// File: components/AdminLayout.js
'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from '../contexts/ThemeContext';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (isLoginPage) {
    return <ThemeProvider>{children}</ThemeProvider>;
  }

  return (
    <ThemeProvider>
      <div className="mx-admin min-h-screen bg-gray-50 flex">
        <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <main data-mx-admin="" className={`flex-1 transition-all duration-300 ${
          isCollapsed ? 'ml-20' : 'ml-64'
        } p-8 bg-gray-50`}>
          {/* Keyed by route so each admin page gets the shared enter transition */}
          <div key={pathname} className="mx-page">
            {children}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}