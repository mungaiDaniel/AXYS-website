'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Ban } from 'lucide-react';
import LoadingPage from '@/components/LoadingPage';

export default function PageAccessGuard({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAccessible, setIsAccessible] = useState(true);
  const [loading, setLoading] = useState(false); // Start as false for better UX

  useEffect(() => {
    let isMounted = true;

    const checkPageAccess = async () => {
      // Skip check for admin and home page
      if (pathname.startsWith('/admin') || pathname === '/') {
        if (isMounted) {
          setIsAccessible(true);
          setLoading(false);
        }
        return;
      }

      setLoading(true);

      try {
        const response = await fetch('/api/page-visibility');
        if (!response.ok) {
          throw new Error('Failed to fetch visibility settings');
        }

        const data = await response.json();
        const settings = data.settings || {};

        // Map pathname to pageName
        const pageNameMap = {
          '/about': 'about',
          '/group': 'group',
          '/platforms': 'platforms',
          '/services': 'services',
          '/research': 'research',
          '/ipo': 'ipo',
          '/ipo/quickmart': 'ipo-quickmart',
          '/ipo/dangote': 'ipo-dangote',
          '/ipo/quickmart/share-calculator': 'ipo-share-calculator',
          '/ipo/dangote/share-calculator': 'ipo-dangote-share-calculator',
          '/leverage': 'leverage',
          '/faq': 'faq',
          '/contact': 'contact',
          '/downloads': 'downloads',
          '/global-markets': 'global-markets',
          '/fund-account/local-stocks': 'fund-local-stocks',
          '/fund-account/multi-currency': 'fund-multi-currency',
          '/fund-account/international-equities': 'fund-international',
          '/fund-account/offshore-funds': 'fund-offshore',
          '/exchange-rates': 'exchange-rates',
          '/terms': 'terms',
          '/privacy': 'privacy',
        };

        const pageName = pageNameMap[pathname];

        if (isMounted) {
          if (pageName && settings[pageName]) {
            const pageSettings = settings[pageName];
            setIsAccessible(pageSettings.isAccessible !== false);
          } else {
            // Page not in settings, allow access by default
            setIsAccessible(true);
          }
        }
      } catch (error) {
        console.error('Error checking page access:', error);
        // On error, allow access to prevent blocking legitimate pages
        if (isMounted) {
          setIsAccessible(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkPageAccess();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  if (loading) {
    return (
      <LoadingPage />
    );
  }

  if (!isAccessible) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0a0a0f]">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-100 dark:bg-red-900/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <Ban className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Page Not Available
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            This page is currently not accessible. Please contact support if you believe this is an error.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-[#0017bf] dark:bg-[#00005b] text-white rounded-lg hover:bg-[#0017bf]/90 dark:hover:bg-[#00005b]/90 transition-all duration-300"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return children;
}
