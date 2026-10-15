// File: components/AdminNavbar.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Mail,
  FileText,
  Settings,
  TrendingUp,
  LogOut,
  Eye,
  User,
  Shield,
  Menu,
  X,
  DollarSign,
  ExternalLink,
  Download,
  Globe,
  BarChart3
} from 'lucide-react';
import Image from 'next/image';

export default function AdminNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchAdminInfo();
  }, []);

  const fetchAdminInfo = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setAdmin(data.admin);
      }
    } catch (error) {
      console.error('Error fetching admin info:', error);
    }
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    }
  };

  const navLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Analytics', href: '/admin/analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { name: 'Contacts', href: '/admin/contacts', icon: <Mail className="w-5 h-5" /> },
    { name: 'Global Funds', href: '/admin/global-funds', icon: <Globe className="w-5 h-5" /> },
    { name: 'Exchange Rates', href: '/admin/exchange-rates', icon: <DollarSign className="w-5 h-5" /> },
    { name: 'Research', href: '/admin/research', icon: <FileText className="w-5 h-5" /> },
    { name: 'Documents', href: '/admin/documents', icon: <Download className="w-5 h-5" /> },
    { name: 'IPO Settings', href: '/admin/ipo-settings', icon: <TrendingUp className="w-5 h-5" /> },
    { name: 'Page Visibility', href: '/admin/pages', icon: <Eye className="w-5 h-5" /> },
    { name: 'GDPR Requests', href: '/admin/gdpr', icon: <Shield className="w-5 h-5" /> },
    { name: 'Users', href: '/admin/users', icon: <User className="w-5 h-5" /> },
    { name: 'Settings', href: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100">
            <Menu className="w-5 h-5" />
          </button>
          <Image src="/axys-logo-dark.png" alt="AXYS Investment Bank" width={300} height={100} className="h-7 w-auto" />
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/" target="_blank" className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
            <ExternalLink className="w-4 h-4" />
          </Link>
          <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-gray-100 text-red-600">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 shadow-lg transition-all duration-300 z-40 ${sidebarOpen ? 'w-64' : 'w-[80px]'
        } overflow-hidden`}>
        {/* Logo Section */}
        <div className="border-b border-gray-200">
          <div className="h-16 flex items-center justify-center px-4">
            {sidebarOpen ? (
              <>
                <Link href="/admin/dashboard" className="flex items-center space-x-3">
                  <Image
                    src="/axys-logo-dark.png"
                    alt="AXYS Investment Bank"
                    width={140}
                    height={40}
                    className="h-8 w-auto"
                  />
                </Link>
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="hidden lg:block absolute right-4 p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <Link href="/admin/dashboard" className="flex items-center justify-center">
                <Image
                  src="/favicon-light.jpeg"
                  alt="AXYS Investment Bank"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-lg"
                />
              </Link>
            )}
          </div>
          {!sidebarOpen && (
            <div className="hidden lg:flex items-center justify-center pb-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.name} href={link.href}>
                  <div className={`flex items-center ${sidebarOpen ? 'justify-start space-x-3' : 'justify-center'} px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? 'bg-[#0017bf] dark:bg-[#00005b] text-white shadow-lg' : 'text-gray-700 hover:bg-gray-100'
                    }`}>
                    <div className={sidebarOpen ? '' : 'flex items-center justify-center'}>
                      {link.icon}
                    </div>
                    {sidebarOpen && (
                      <span className="whitespace-nowrap">{link.name}</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 p-4 space-y-2">
          <Link href="/" target="_blank" className={`flex items-center ${sidebarOpen ? 'justify-start space-x-3' : 'justify-center'} px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors`}>
            <ExternalLink className="w-5 h-5" />
            {sidebarOpen && <span className="whitespace-nowrap">View Website</span>}
          </Link>

          {admin && sidebarOpen && (
            <div className="px-4 py-2">
              <div className="text-xs text-gray-500">Logged in as</div>
              <div className="text-sm font-medium text-gray-900 truncate">{admin.email}</div>
            </div>
          )}

          <button onClick={handleLogout} className={`w-full flex items-center ${sidebarOpen ? 'justify-start space-x-3' : 'justify-center'} px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors`}>
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="whitespace-nowrap">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setSidebarOpen(false)} />
      )}
    </>
  );
}
