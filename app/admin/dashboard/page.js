// File: app/admin/dashboard/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Mail,
  FileText,
  TrendingUp,
  Users,
  Eye,
  MousePointerClick,
  Activity,
  Download,
  Clock,
  Globe,
  DollarSign,
  BarChart3,
  ArrowRight
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [analyticsStats, setAnalyticsStats] = useState(null);
  const [recentContacts, setRecentContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchAnalyticsData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');

      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      const data = await response.json();
      setStats(data.stats);
      setRecentContacts(data.recentContacts || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch(`/api/admin/analytics/stats?range=7d`);

      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setAnalyticsStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Contacts',
      value: stats?.totalContacts || 0,
      icon: <Users className="w-8 h-8" />,
      color: 'bg-blue-500',
      link: '/admin/contacts',
      description: 'Form submissions'
    },
    {
      title: 'New Submissions',
      value: stats?.newContacts || 0,
      icon: <Mail className="w-8 h-8" />,
      color: 'bg-green-500',
      link: '/admin/contacts?status=new',
      description: 'Unread messages'
    },
    {
      title: 'Page Views',
      value: analyticsStats?.summary?.totalPageViews || 0,
      icon: <Eye className="w-8 h-8" />,
      color: 'bg-purple-500',
      link: '/admin/analytics',
      description: 'Last 7 days'
    },
    {
      title: 'Unique Sessions',
      value: analyticsStats?.summary?.uniqueSessions || 0,
      icon: <Activity className="w-8 h-8" />,
      color: 'bg-indigo-500',
      link: '/admin/analytics',
      description: 'Active users'
    },
    {
      title: 'Total Events',
      value: analyticsStats?.summary?.totalEvents || 0,
      icon: <MousePointerClick className="w-8 h-8" />,
      color: 'bg-orange-500',
      link: '/admin/analytics',
      description: 'User interactions'
    },
    {
      title: 'Quickmart IPO Applications',
      value: stats?.quickmartIpoApplications || 0,
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'bg-pink-500',
      link: '/admin/contacts',
      description: 'From contact form'
    },
    {
      title: 'Dangote IPO Applications',
      value: stats?.dangoteIpoApplications || 0,
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'bg-rose-500',
      link: '/admin/contacts',
      description: 'From contact form'
    },
  ];

  const quickActions = [
    {
      title: 'View Analytics',
      description: 'Detailed charts and insights',
      icon: <BarChart3 className="w-10 h-10" />,
      href: '/admin/analytics',
      color: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    },
    {
      title: 'Manage Contacts',
      description: 'View and export submissions',
      icon: <Mail className="w-10 h-10" />,
      href: '/admin/contacts',
      color: 'bg-green-50 text-green-600 hover:bg-green-100',
    },
    {
      title: 'Global Funds',
      description: 'Manage fund information',
      icon: <Globe className="w-10 h-10" />,
      href: '/admin/global-funds',
      color: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
    },
    {
      title: 'Exchange Rates',
      description: 'Update currency rates',
      icon: <DollarSign className="w-10 h-10" />,
      href: '/admin/exchange-rates',
      color: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100',
    },
    {
      title: 'Research Papers',
      description: 'Upload documents',
      icon: <FileText className="w-10 h-10" />,
      href: '/admin/research',
      color: 'bg-orange-50 text-orange-600 hover:bg-orange-100',
    },
    {
      title: 'Downloads',
      description: 'Manage public files',
      icon: <Download className="w-10 h-10" />,
      href: '/admin/documents',
      color: 'bg-pink-50 text-pink-600 hover:bg-pink-100',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening at a glance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Link key={index} href={stat.link}>
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                  {stat.icon}
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value.toLocaleString()}</p>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <div className="bg-white rounded-lg shadow p-6 transition-all hover:shadow-lg hover:scale-105 cursor-pointer border border-gray-100">
                <div className={`p-4 rounded-lg ${action.color} inline-block mb-4 transition-colors`}>
                  {action.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="bg-white rounded-lg shadow border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Recent Submissions</h2>
            <Link href="/admin/contacts" className="text-sm text-[#0017bf] dark:text-[#00005b] hover:underline flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {recentContacts.length > 0 ? (
            recentContacts.map((contact) => (
              <div key={contact._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${contact.status === 'new' ? 'bg-green-100 text-green-700' :
                          contact.status === 'read' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                        }`}>
                        {contact.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{contact.email}</p>
                    <p className="text-sm text-gray-500">
                      Subject: {contact.subject.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Mail className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No submissions yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
