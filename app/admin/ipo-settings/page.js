'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Calendar, Link as LinkIcon, Save } from 'lucide-react';
import { fromEATDateTimeLocal, formatEATDateTime, toEATDateTimeLocal } from '@/lib/eatDateTime';
import { IPO_LABELS } from '@/lib/ipo-registry';

export default function AdminIPOSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ipo, setIpo] = useState('quickmart');
  const [message, setMessage] = useState(null);
  const [overview, setOverview] = useState({});

  // Both IPOs' current settings, for the side-by-side summary at the top.
  const fetchOverview = async () => {
    const entries = await Promise.all(Object.keys(IPO_LABELS).map(async (slug) => {
      try {
        const res = await fetch(`/api/admin/ipo-settings?ipo=${slug}`, { cache: 'no-store' });
        const data = await res.json();
        return [slug, res.ok ? data.settings : null];
      } catch {
        return [slug, null];
      }
    }));
    setOverview(Object.fromEntries(entries));
  };

  useEffect(() => {
    fetchOverview();
  }, []);
  const [formData, setFormData] = useState({
    name: '',
    targetDate: '',
    applyNowLink: '',
    applicationFormLink: '',
    videoUrl: '',
    isActive: true,
  });

  useEffect(() => {
    setMessage(null);
    fetchSettings(ipo);
  }, [ipo]);

  const fetchSettings = async (slug = ipo) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/ipo-settings?ipo=${slug}`, { cache: 'no-store' });

      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      const data = await response.json();
      if (!response.ok || !data.settings) {
        throw new Error(data.error || 'Failed to load IPO settings');
      }
      setSettings(data.settings);

      // Format date for input
      const formattedDate = toEATDateTimeLocal(data.settings.targetDate);

      setFormData({
        name: data.settings.name || '',
        targetDate: formattedDate,
        applyNowLink: data.settings.applyNowLink || '',
        applicationFormLink: data.settings.applicationFormLink || data.settings.applyNowLink || '',
        videoUrl: data.settings.videoUrl ?? '',
        isActive: data.settings.isActive,
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to load IPO settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/ipo-settings?ipo=${ipo}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          targetDate: fromEATDateTimeLocal(formData.targetDate),
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (response.status === 401) {
        setMessage({ type: 'error', text: data.error || 'Your admin session has expired. Please log in again.' });
        router.push('/admin/login');
        return;
      }
      if (!response.ok) {
        throw new Error(data.error || `Save failed (HTTP ${response.status})`);
      }
      setMessage({ type: 'success', text: `${IPO_LABELS[ipo]} settings saved. The public page updates within a few seconds.` });
      fetchSettings(ipo);
      fetchOverview();
    } catch (error) {
      console.error('Save error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  if (loading && !settings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading IPO settings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/admin/dashboard">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">IPO Settings</h1>
              <p className="text-sm text-gray-500">Manage IPO countdown timer and links</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Both IPOs at a glance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {Object.entries(IPO_LABELS).map(([slug, label]) => {
            const item = overview[slug];
            const closes = item?.targetDate ? new Date(item.targetDate) : null;
            const open = closes ? closes.getTime() > Date.now() : false;
            const selected = ipo === slug;
            return (
              <div key={slug} className={`bg-white rounded-lg shadow p-5 border-2 ${selected ? 'border-[#0017bf]' : 'border-transparent'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</p>
                    <p className="font-bold text-gray-900 mt-1">{item?.name || '—'}</p>
                  </div>
                  {item && (
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${open ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      {open ? 'Open' : 'Closed'}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Closes: {closes ? `${formatEATDateTime(closes)} EAT` : 'Not set'}
                </p>
                <p className="text-sm text-gray-600">
                  Countdown: {item ? (item.isActive ? 'Shown' : 'Hidden') : '—'}
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setIpo(slug)}
                    disabled={selected}
                    className="px-3 py-1.5 text-sm font-semibold rounded-md bg-[#0017bf] text-white disabled:opacity-50"
                  >
                    {selected ? 'Editing' : 'Edit'}
                  </button>
                  <a href={`/ipo/${slug}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#0017bf] hover:underline">
                    View page
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="w-8 h-8 text-[#0017bf] dark:text-[#00005b]" />
            <h2 className="text-2xl font-bold">{IPO_LABELS[ipo]} Settings</h2>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Which IPO are you editing?</label>
            <div className="grid grid-cols-2 gap-2 rounded-lg bg-gray-100 p-1">
              {Object.entries(IPO_LABELS).map(([slug, label]) => (
                <button
                  key={slug}
                  type="button"
                  onClick={() => setIpo(slug)}
                  className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${ipo === slug ? 'bg-white text-[#0017bf] shadow' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Changes apply to <a href={`/ipo/${ipo}`} target="_blank" rel="noopener noreferrer" className="underline">/ipo/{ipo}</a> only.
            </p>
          </div>

          {message && (
            <div className={`mb-6 rounded-lg px-4 py-3 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`} role="status">
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IPO Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
                placeholder={IPO_LABELS[ipo]}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Countdown Target Date & Time *
              </label>
              <input
                type="datetime-local"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                All times are East Africa Time (EAT). Current: {formatEATDateTime(fromEATDateTimeLocal(formData.targetDate))} EAT
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apply Now Link <span className="text-gray-400">(official IPO application portal)</span>
              </label>
              <input
                type="url"
                value={formData.applyNowLink}
                onChange={(e) => setFormData({ ...formData, applyNowLink: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
                placeholder="https://..."
              />
              <p className="text-xs text-gray-400 mt-1">Used for the red &ldquo;Apply Now&rdquo; button on the IPO page.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Portal / Form Link <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={formData.applicationFormLink}
                onChange={(e) => setFormData({ ...formData, applicationFormLink: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
                placeholder="https://..."
                required
              />
              <p className="text-xs text-gray-400 mt-1">Used for the &ldquo;Application Portal&rdquo; button, the How to Apply card, and the FAQ apply link on the IPO page.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IPO Video URL <span className="text-gray-400">(local path or external link)</span>
              </label>
              <input
                type="text"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
                placeholder="/newlogos/quickmart-ipo-guide.mp4"
              />
              <p className="text-xs text-gray-400 mt-1">Used for the &ldquo;Watch Video&rdquo; buttons on the IPO page. Leave empty to hide them.</p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-[#0017bf] dark:text-[#00005b] border-gray-300 rounded focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                Show IPO countdown on website
              </label>
            </div>

            <div className="pt-4 border-t">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-[#0017bf] dark:bg-[#00005b] text-white rounded-lg font-semibold hover:bg-[#0017bf] dark:bg-[#00005b]/90 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>{saving ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          </form>

          {/* Preview */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-sm text-blue-900 mb-2">Preview — {IPO_LABELS[ipo]}</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>IPO Name:</strong> {formData.name}</p>
              <p><strong>Closing:</strong> {formatEATDateTime(fromEATDateTimeLocal(formData.targetDate))} EAT</p>
              <p><strong>Apply Link:</strong> <a href={formData.applyNowLink} target="_blank" rel="noopener noreferrer" className="underline break-all">{formData.applyNowLink}</a></p>
              <p><strong>Application Form Link:</strong> <a href={formData.applicationFormLink} target="_blank" rel="noopener noreferrer" className="underline break-all">{formData.applicationFormLink}</a></p>
              <p><strong>Video URL:</strong> <span className="font-mono text-xs">{formData.videoUrl || 'None'}</span></p>
              <p><strong>Status:</strong> {formData.isActive ? 'Active ✅' : 'Hidden ❌'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
