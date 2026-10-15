// File: app/admin/analytics/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  MousePointerClick,
  Activity,
  Smartphone,
  Monitor,
  Tablet,
  ExternalLink,
  Calendar,
  TrendingUp,
  Download as DownloadIcon
} from 'lucide-react';

const COLORS = ['#0017bf', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

export default function AnalyticsPage() {
  const router = useRouter();
  const [analyticsStats, setAnalyticsStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('weekly');

  useEffect(() => {
    fetchAnalyticsData();
  }, [period]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const rangeMap = {
        'daily': '24h',
        'weekly': '7d',
        'monthly': '30d',
        'annually': '365d',
        'all_time': 'all'
      };

      const range = rangeMap[period];
      const response = await fetch(`/api/admin/analytics/stats?range=${range}`);

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
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!analyticsStats) return;

    const csvRows = [];
    csvRows.push('Category,Metric,Value');
    csvRows.push(`Summary,Total Events,${analyticsStats.summary?.totalEvents || 0}`);
    csvRows.push(`Summary,Page Views,${analyticsStats.summary?.totalPageViews || 0}`);
    csvRows.push(`Summary,Unique Sessions,${analyticsStats.summary?.uniqueSessions || 0}`);
    csvRows.push(`Summary,Avg Events/Session,${analyticsStats.summary?.avgEventsPerSession || 0}`);
    csvRows.push('');
    csvRows.push('Page URL,Views');
    analyticsStats.topPages?.forEach(page => {
      csvRows.push(`${page.pageUrl},${page.views}`);
    });
    csvRows.push('');
    csvRows.push('Device Type,Count');
    analyticsStats.deviceBreakdown?.forEach(device => {
      csvRows.push(`${device.deviceType},${device.count}`);
    });
    csvRows.push('');
    csvRows.push('Event Type,Count');
    analyticsStats.eventsByType?.forEach(event => {
      csvRows.push(`${event.eventType},${event.count}`);
    });
    csvRows.push('');
    csvRows.push('Referral Source,Count');
    analyticsStats.contactReferralSources?.forEach(source => {
      csvRows.push(`${source.source},${source.count}`);
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `analytics_${period}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  const formatXAxisLabel = (value, index) => {
    if (period === 'daily') {
      const hour = index % 24;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:00 ${ampm}`;
    } else if (period === 'weekly') {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return days[index % 7] || value;
    } else if (period === 'monthly') {
      return `Week ${Math.floor(index / 7) + 1}`;
    } else {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months[index % 12] || value;
    }
  };

  const prepareChartData = () => {
    if (!analyticsStats?.topPages) return [];
    return analyticsStats.topPages.slice(0, 10).map((item, index) => ({
      name: item.pageUrl.length > 25 ? item.pageUrl.substring(0, 25) + '...' : item.pageUrl,
      fullName: item.pageUrl,
      views: item.views,
      xLabel: formatXAxisLabel(item.pageUrl, index)
    }));
  };

  const chartData = prepareChartData();
  const deviceData = analyticsStats?.deviceBreakdown?.map(item => ({
    name: item.deviceType.charAt(0).toUpperCase() + item.deviceType.slice(1),
    value: item.count,
  })) || [];
  const eventTypeData = analyticsStats?.eventsByType?.map(item => ({
    name: item.eventType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    count: item.count,
  })) || [];
  const referralData = analyticsStats?.contactReferralSources?.map(item => ({
    name: item.source,
    value: item.count,
  })) || [];

  const topClickedElements = analyticsStats?.topClickedElements && analyticsStats.topClickedElements.length > 0
    ? analyticsStats.topClickedElements
    : analyticsStats?.recentEvents?.filter(event => event.elementId).slice(0, 10) ?? [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Detailed Analytics</h1>
          <p className="text-gray-600">Comprehensive insights and user behavior metrics</p>
        </div>
        <button onClick={exportToCSV} className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg">
          <DownloadIcon className="w-5 h-5" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8 border border-gray-100">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-700">Time Period:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['daily', 'weekly', 'monthly', 'annually', 'all_time'].map((p) => (
              <button key={p} onClick={() => setPeriod(p)} className={`px-6 py-2 rounded-lg font-medium transition-all ${period === p ? 'bg-[#0017bf] dark:bg-[#00005b] text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {p === 'all_time' ? 'All Time' : p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsStats?.summary?.totalEvents?.toLocaleString() || 0}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Page Views</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsStats?.summary?.totalPageViews?.toLocaleString() || 0}</p>
            </div>
            <Activity className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Unique Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsStats?.summary?.uniqueSessions?.toLocaleString() || 0}</p>
            </div>
            <Monitor className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Events/Session</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsStats?.summary?.avgEventsPerSession || 0}</p>
            </div>
            <MousePointerClick className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Most Recent Page Viewed</p>
              <p className="text-base font-semibold text-gray-900 truncate">{analyticsStats?.recentPageView?.pageUrl || 'No recent views'}</p>
              <p className="text-xs text-gray-500 mt-2">{analyticsStats?.recentPageView?.timestamp ? new Date(analyticsStats.recentPageView.timestamp).toLocaleString() : 'N/A'}</p>
            </div>
            <Calendar className="w-8 h-8 text-indigo-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8 border border-gray-100">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Page Views by URL</h2>
          <p className="text-sm text-gray-600">Most visited pages during the selected period</p>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="views" fill="#0017bf" radius={[8, 8, 0, 0]} name="Page Views" barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Device Breakdown</h2>
            <p className="text-sm text-gray-600">Mobile vs Desktop vs Tablet usage</p>
          </div>
          {deviceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={deviceData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#8884d8" paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                  {deviceData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center"><Monitor className="w-12 h-12 mx-auto mb-2" /><p>No device data yet</p></div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Referral Sources</h2>
            <p className="text-sm text-gray-600">Where did users hear about you?</p>
          </div>
          {referralData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={referralData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#8884d8" paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                  {referralData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center"><ExternalLink className="w-12 h-12 mx-auto mb-2" /><p>No referral data yet</p></div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">User Interactions by Type</h2>
          <p className="text-sm text-gray-600">Types of events tracked across the site</p>
        </div>
        {eventTypeData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={eventTypeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" angle={-20} textAnchor="end" height={100} tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#00C49F" radius={[8, 8, 0, 0]} name="Events" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-400">
            <div className="text-center"><Activity className="w-12 h-12 mx-auto mb-2" /><p>No event data yet</p></div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Top Clicked Elements</h2>
          <p className="text-sm text-gray-600">Most interacted elements on your website</p>
        </div>
        {topClickedElements && topClickedElements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topClickedElements.map((item, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-[#0017bf] dark:hover:border-[#00005b] hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <MousePointerClick className="w-5 h-5 text-[#0017bf] dark:text-[#00005b]" />
                  <span className="text-xs text-gray-500">{item.count || 1} interactions</span>
                </div>
                <p className="font-semibold text-sm text-gray-900 mb-1 truncate">{item.elementId}</p>
                <p className="text-xs text-gray-600 truncate">{item.pageUrl || 'Unknown page'}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-48 text-gray-400">
            <div className="text-center"><MousePointerClick className="w-12 h-12 mx-auto mb-2" /><p>No click data yet</p></div>
          </div>
        )}
      </div>
    </div>
  );
}
