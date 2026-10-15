'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, Server, Save, CheckCircle } from 'lucide-react';

export default function AdminSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    host: 'smtp.office365.com',
    port: 587,
    user: '',
    password: '',
    fromEmail: 'info@axysinvestmentbank.com',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/email-settings');
      
      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      const data = await response.json();
      setSettings(data.settings);
      setFormData({
        host: data.settings.host,
        port: data.settings.port,
        user: data.settings.user || '',
        password: '', // Don't show password
        fromEmail: data.settings.fromEmail,
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/admin/email-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Email settings saved successfully! Please restart the server for changes to take effect.');
        fetchSettings();
      } else {
        alert('Failed to save settings');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading email settings...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Email Settings</h1>
              <p className="text-sm text-gray-500">Configure Microsoft 365/Outlook email integration</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Configuration Status */}
        <div className={`p-4 rounded-lg mb-6 ${
          settings?.isConfigured ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className="flex items-center space-x-3">
            {settings?.isConfigured ? (
              <>
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">Email Service Configured</p>
                  <p className="text-sm text-green-700">Contact form emails will be sent automatically</p>
                </div>
              </>
            ) : (
              <>
                <Mail className="w-6 h-6 text-yellow-600" />
                <div>
                  <p className="font-semibold text-yellow-900">Email Not Configured</p>
                  <p className="text-sm text-yellow-700">Add your Outlook credentials below to enable email sending</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Settings Form */}
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Server className="w-8 h-8 text-[#0017bf] dark:text-[#00005b]" />
            <h2 className="text-2xl font-bold">SMTP Configuration</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SMTP Host
              </label>
              <input
                type="text"
                value={formData.host}
                onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
                placeholder="smtp.office365.com"
              />
              <p className="text-xs text-gray-500 mt-1">For Outlook/Microsoft 365: smtp.office365.com</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SMTP Port
              </label>
              <input
                type="number"
                value={formData.port}
                onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
                placeholder="587"
              />
              <p className="text-xs text-gray-500 mt-1">Usually 587 for TLS or 465 for SSL</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address (Username) *
              </label>
              <input
                type="email"
                value={formData.user}
                onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
                placeholder="info@axysinvestmentbank.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
                placeholder="Enter Outlook password"
                required={!settings?.isConfigured}
              />
              <p className="text-xs text-gray-500 mt-1">
                {settings?.isConfigured ? 'Leave blank to keep existing password' : 'Your Outlook/Microsoft 365 account password'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Email Address
              </label>
              <input
                type="email"
                value={formData.fromEmail}
                onChange={(e) => setFormData({ ...formData, fromEmail: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
                placeholder="info@axysinvestmentbank.com"
              />
              <p className="text-xs text-gray-500 mt-1">Email address that will appear in the 'From' field</p>
            </div>

            <div className="pt-4 border-t">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-[#0017bf] dark:bg-[#00005b] text-white rounded-lg font-semibold hover:bg-[#0017bf] dark:bg-[#00005b]/90 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>{saving ? 'Saving...' : 'Save Email Settings'}</span>
              </button>
            </div>
          </form>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-sm text-blue-900 mb-2">Setup Instructions</h3>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Enter your Outlook/Microsoft 365 email address</li>
              <li>Enter your account password</li>
              <li>Click Save</li>
              <li>Restart the server: <code className="bg-blue-100 px-2 py-1 rounded">sudo supervisorctl restart nextjs</code></li>
              <li>Test the contact form on the website</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
