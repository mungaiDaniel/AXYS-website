'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Download, Trash2, Search, AlertTriangle } from 'lucide-react';

export default function AdminGDPRPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [exportData, setExportData] = useState(null);

  const handleExport = async () => {
    if (!email) {
      alert('Please enter an email address');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/gdpr/user-data?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      
      if (response.ok) {
        setExportData(data);
        
        // Auto-download JSON file
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `user-data-${email}-${Date.now()}.json`;
        a.click();
        
        alert('Data exported successfully!');
      } else {
        alert(data.error || 'Export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!email) {
      alert('Please enter an email address');
      return;
    }

    if (!confirm(`⚠️ WARNING: This will permanently delete ALL data for ${email}.\n\nThis action cannot be undone. Are you sure?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/gdpr/user-data?email=${encodeURIComponent(email)}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (response.ok) {
        alert(`Data deleted successfully!\n\nContacts: ${data.deleted.contacts}\nConsents: ${data.deleted.consents}`);
        setEmail('');
        setExportData(null);
      } else {
        alert(data.error || 'Deletion failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Deletion failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Shield className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">GDPR & Privacy Management</h1>
        </div>
        <p className="text-gray-600">Manage user data requests and privacy compliance</p>
      </div>

      {/* GDPR Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User Data Lookup */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">User Data Lookup</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Email Address
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleExport}
                disabled={loading || !email}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-5 h-5" />
                <span>Export Data</span>
              </button>
              <button
                onClick={handleDelete}
                disabled={loading || !email}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-5 h-5" />
                <span>Delete Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">GDPR Compliance Tools</h3>
              <p className="text-sm text-blue-700 leading-relaxed">
                Use these tools to respond to user data requests in compliance with GDPR and Kenya Data Protection Act.
              </p>
            </div>
          </div>
          <div className="space-y-3 text-sm text-blue-700">
            <div>
              <strong>Export Data</strong>: Generates JSON file with all user data (contact submissions, consents)
            </div>
            <div>
              <strong>Delete Data</strong>: Permanently removes all user data (Right to be Forgotten)
            </div>
            <div className="pt-3 border-t border-blue-200 text-xs">
              ⚠️ Deletion is permanent and cannot be undone. Use with caution.
            </div>
          </div>
        </div>
      </div>

      {/* Data Retention Policy */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Data Retention Policy</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex justify-between py-2 border-b">
            <span className="font-medium">Contact Submissions</span>
            <span className="text-gray-600">2 years or until deletion requested</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="font-medium">Consent Records</span>
            <span className="text-gray-600">Duration of relationship + 2 years</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="font-medium">Audit Logs</span>
            <span className="text-gray-600">7 years (regulatory requirement)</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="font-medium">Research Downloads</span>
            <span className="text-gray-600">Anonymized after 1 year</span>
          </div>
        </div>
      </div>
    </div>
  );
}
