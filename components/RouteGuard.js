// File: components/RouteGuard.js
'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import LoadingPage from './LoadingPage';

export default function RouteGuard({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAccess();
  }, [pathname]);

  const checkAccess = async () => {
    setLoading(true);
    const publicRoutes = ['/404', '/500', '/admin/login', '/admin'];
    const isPublicRoute = publicRoutes.includes(pathname);
    const isAdminRoute = pathname.startsWith('/admin');
    const isApiRoute = pathname.startsWith('/api');
    const isStaticAsset = pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|css|js)$/);
    
    if (isPublicRoute || isAdminRoute || isApiRoute || isStaticAsset) {
      setAuthorized(true);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/page-visibility');
      if (!response.ok) {
        setAuthorized(true);
        setLoading(false);
        return;
      }

      const data = await response.json();
      const settings = data.settings || {};
      let isAccessible = true;
      
      Object.keys(settings).forEach(pageName => {
        const pageSetting = settings[pageName];
        if (pageSetting.path && pageSetting.path === pathname) {
          isAccessible = pageSetting.isAccessible !== false;
        }
      });
      
      if (!isAccessible) {
        router.push('/404');
        return;
      }
      
      setAuthorized(true);
    } catch (error) {
      console.error('Route guard error:', error);
      setAuthorized(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingPage />;
  return authorized ? children : null;
}