// File: app/admin/pages/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, RefreshCw, Download, Check, X } from 'lucide-react';

export default function AdminPageVisibilityPage() {
  const router = useRouter();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/admin/page-settings');
      
      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      const data = await response.json();
      setPages(data.pages || []);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    if (!confirm('This will seed/reset all page settings. Continue?')) return;
    
    setSeeding(true);
    try {
      const response = await fetch('/api/admin/page-settings/seed');
      
      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        alert(`Success! ${data.stats.seeded} new pages seeded, ${data.stats.updated} pages updated.`);
        fetchPages();
      } else {
        alert('Failed to seed pages');
      }
    } catch (error) {
      console.error('Seed error:', error);
      alert('Failed to seed pages');
    } finally {
      setSeeding(false);
    }
  };

  const toggleField = async (pageName, field, currentValue) => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/page-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageName,
          [field]: !currentValue,
        }),
      });

      if (response.ok) {
        fetchPages();
      }
    } catch (error) {
      console.error('Update error:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">Loading pages...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Page Visibility Management</h1>
          <p className="text-gray-600 mt-1">Control which pages are visible and accessible on the website</p>
        </div>
        <button
          onClick={handleSeed}
          disabled={seeding}
          className="flex items-center space-x-2 px-6 py-3 bg-[#0017bf] dark:bg-[#00005b] text-white rounded-lg hover:bg-[#0017bf] dark:bg-[#00005b]/90 transition-all disabled:opacity-50 shadow-lg"
        >
          <RefreshCw className="w-5 h-5" />
          <span>{seeding ? 'Seeding...' : 'Seed/Reset Pages'}</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Total Pages</div>
          <div className="text-3xl font-bold text-gray-900">{pages.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Visible in Nav</div>
          <div className="text-3xl font-bold text-green-600">{pages.filter(p => p.showInNav).length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Accessible</div>
          <div className="text-3xl font-bold text-blue-600">{pages.filter(p => p.isAccessible).length}</div>
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Page Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Path</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Show in Nav</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Accessible</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pages.map((page) => (
                <tr key={page.pageName} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{page.name || page.pageName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-mono">{page.path}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleField(page.pageName, 'showInNav', page.showInNav)}
                      disabled={saving}
                      className={`p-2 rounded-lg transition-all ${
                        page.showInNav
                          ? 'bg-green-100 text-green-600 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                    >
                      {page.showInNav ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleField(page.pageName, 'isAccessible', page.isAccessible)}
                      disabled={saving || page.pageName === 'home'}
                      className={`p-2 rounded-lg transition-all ${
                        page.pageName === 'home'
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : page.isAccessible
                          ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                          : 'bg-red-100 text-red-600 hover:bg-red-200'
                      }`}
                      title={page.pageName === 'home' ? 'Home page must always be accessible' : ''}
                    >
                      {page.isAccessible ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Show in Nav:</strong> Controls if the page appears in the navigation menu</li>
          <li>• <strong>Accessible:</strong> Controls if users can visit the page (redirects to 404 if disabled)</li>
          <li>• <strong>Seed/Reset:</strong> Refreshes the page list with all routes including subpages</li>
        </ul>
      </div>
    </div>
  );
}
