// File: components/AdminSidebar.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../contexts/ThemeContext';
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
  DollarSign,
  ExternalLink,
  Download,
  Globe,
  BarChart3,
  Sun,
  Moon
} from 'lucide-react';

export default function AdminSidebar({ isCollapsed, setIsCollapsed }) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [admin, setAdmin] = useState(null);

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

  const isSuperAdmin = (adminData) => {
    if (!adminData) return false;

    const role = adminData.role;
    const rawSlug =
      typeof role === 'string'
        ? role
        : role?.slug;

    const normalizedSlug = rawSlug
      ? rawSlug.toLowerCase().replace(/[_\s]+/g, '-')
      : null;

    if (normalizedSlug === 'super-admin') {
      return true;
    }

    const roleName =
      typeof role === 'object' && role
        ? role.name
        : null;

    return roleName === 'Super Admin';
  };

  const hasAdminOrAboveAccess = (adminData) => {
    if (!adminData) return false;
    const role = adminData.role;
    const rawSlug =
      typeof role === 'string'
        ? role
        : role?.slug;

    const normalizedSlug = rawSlug
      ? rawSlug.toLowerCase().replace(/[_\s]+/g, '-')
      : null;

    // Allow Super Admin and Admin, block Viewer/others
    if (normalizedSlug === 'super-admin' || normalizedSlug === 'admin') {
      return true;
    }

    const roleName =
      typeof role === 'object' && role
        ? role.name
        : null;

    return roleName === 'Super Admin' || roleName === 'Admin';
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
    { name: 'Page Visibility', href: '/admin/pages', icon: <Eye className="w-5 h-5" />, adminOrAbove: true },
    { name: 'GDPR Requests', href: '/admin/gdpr', icon: <Shield className="w-5 h-5" /> },
    { name: 'Users', href: '/admin/users', icon: <User className="w-5 h-5" />, superAdminOnly: true },
    { name: 'Roles', href: '/admin/settings/roles', icon: <Shield className="w-5 h-5" />, superAdminOnly: true },
    { name: 'Settings', href: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <aside data-mx-admin-sidebar="" className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-40 ${
      isCollapsed ? 'w-20' : 'w-64'
    } flex flex-col`}>
      {/* Header Section */}
      {!isCollapsed ? (
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
          {/* Logo */}
          <Link href="/admin/dashboard" className="flex items-center">
            <Image
              src="/axys-logo-dark.png"
              alt="AXYS Investment Bank"
              width={180}
              height={50}
              className="h-10 w-auto"
            />
          </Link>
          
          {/* Collapse Button */}
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Collapse sidebar"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      ) : (
        <div className="border-b border-gray-200">
          {/* Centered Emblem */}
          <div className="h-16 flex items-center justify-center">
            <Link href="/admin/dashboard">
              <Image
                src="/favicon-light.webp"
                alt="AXYS Investment Bank"
                width={28}
                height={28}
                className="h-7 w-7 rounded-lg"
              />
            </Link>
          </div>
          
          {/* Expand Button */}
          <div className="flex items-center justify-center pb-3">
            <button
              onClick={() => setIsCollapsed(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Expand sidebar"
            >
              <Menu className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-3">
          {navLinks
            .filter(link => {
              if (link.superAdminOnly) {
                return isSuperAdmin(admin);
              }
              if (link.adminOrAbove) {
                return hasAdminOrAboveAccess(admin);
              }
              return true;
            })
            .map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.name} href={link.href}>
                  <div className={`flex items-center ${
                    isCollapsed ? 'justify-center' : 'justify-start space-x-3'
                  } px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}>
                    {link.icon}
                    {!isCollapsed && <span className="whitespace-nowrap">{link.name}</span>}
                  </div>
                </Link>
              );
            })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 p-4 space-y-2">
        {/* View Website */}
        <Link
          href="/"
          target="_blank"
          className={`flex items-center ${
            isCollapsed ? 'justify-center' : 'justify-start space-x-3'
          } px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors`}
        >
          <ExternalLink className="w-5 h-5" />
          {!isCollapsed && <span className="whitespace-nowrap">View Website</span>}
        </Link>
        
        {/* User Info */}
        {admin && !isCollapsed && (
          <div className="px-4 py-2">
            <div className="text-xs text-gray-500">Logged in as</div>
            <div className="text-sm font-medium text-gray-900 truncate">{admin.email}</div>
          </div>
        )}
        
        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center ${
            isCollapsed ? 'justify-center' : 'justify-start space-x-3'
          } px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors`}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="whitespace-nowrap">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
