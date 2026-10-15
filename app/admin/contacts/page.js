'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, Calendar, Filter, Download, Trash2, Eye, FileSpreadsheet, FileText, X, Search } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function AdminContactsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', subject: '', dateRange: '' });
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 1000, returned: 0 });
  // searchInput: what the user is typing
  // searchQuery: the applied search term used for filtering
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filter, customDateRange, contacts, searchQuery]);

  const fetchContacts = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.status) params.append('status', filter.status);
      if (filter.subject) params.append('subject', filter.subject);
      // Pull more than 100 so the admin totals match the dashboard counts
      params.append('limit', '1000');

      const response = await fetch(`/api/admin/contacts?${params.toString()}`);

      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      const data = await response.json();
      setContacts(data.contacts || []);
      setPagination(data.pagination || { total: (data.contacts || []).length, page: 1, limit: 1000, returned: (data.contacts || []).length });
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...contacts];

    // Apply status filter
    if (filter.status) {
      filtered = filtered.filter((c) => c.status === filter.status);
    }

    // Apply subject filter
    if (filter.subject) {
      filtered = filtered.filter((c) => c.subject === filter.subject);
    }

    // Apply date range filter
    if (filter.dateRange) {
      const now = new Date();
      let startDate;

      switch (filter.dateRange) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case 'custom':
          if (customDateRange.start && customDateRange.end) {
            const start = new Date(customDateRange.start);
            const end = new Date(customDateRange.end);
            end.setHours(23, 59, 59, 999);
            filtered = filtered.filter(c => {
              const contactDate = new Date(c.createdAt);
              return contactDate >= start && contactDate <= end;
            });
          }
          break;
      }

      if (filter.dateRange !== 'custom' && startDate) {
        filtered = filtered.filter(c => new Date(c.createdAt) >= startDate);
      }
    }

    // Apply search by email / phone / name
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      filtered = filtered.filter((c) => {
        return (
          (c.email && c.email.toLowerCase().includes(q)) ||
          (c.phone && c.phone.toLowerCase().includes(q)) ||
          (c.name && c.name.toLowerCase().includes(q))
        );
      });
    }

    setFilteredContacts(filtered);
  };

  const updateStatus = async (id, status) => {
    try {
      await fetch('/api/admin/contacts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      fetchContacts();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteContact = async (id) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;

    try {
      await fetch(`/api/admin/contacts?id=${id}`, { method: 'DELETE' });
      fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const exportToCSV = (delimiter = ',') => {
    const headers = ['Name', 'Email', 'Phone', 'Subject', 'Message', 'CDSC', 'CDSC Number', 'Status', 'Date'];
    const rows = filteredContacts.map(c => [
      c.name,
      c.email,
      c.phone,
      c.subject,
      c.message.replace(/[\r\n]+/g, ' ').replace(/[|,;]/g, ' '),
      c.hasCDSC,
      c.cdscNumber || '',
      c.status,
      new Date(c.createdAt).toLocaleString()
    ]);

    const csv = [headers, ...rows].map(row => row.join(delimiter)).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const dateStr = filter.dateRange ? `-${filter.dateRange}` : '';
    const delimiterName = delimiter === '|' ? 'pipe' : 'csv';
    a.download = `contacts${dateStr}-${Date.now()}.${delimiterName === 'pipe' ? 'csv' : 'csv'}`;
    a.click();
    window.URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const exportToExcel = () => {
    const headers = ['Name', 'Email', 'Phone', 'Subject', 'Message', 'Has CDSC', 'CDSC Number', 'Status', 'Date'];
    const data = filteredContacts.map(c => [
      c.name,
      c.email,
      c.phone,
      subjectLabels[c.subject] || c.subject,
      c.message,
      c.hasCDSC === 'yes' ? 'Yes' : c.hasCDSC === 'no' ? 'No' : 'N/A',
      c.cdscNumber || '',
      c.status.charAt(0).toUpperCase() + c.status.slice(1),
      new Date(c.createdAt).toLocaleString()
    ]);

    const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);

    // Auto-size columns
    const colWidths = headers.map((_, i) => ({
      wch: Math.max(
        headers[i].length,
        ...data.map(row => (row[i] ? String(row[i]).length : 0))
      )
    }));
    ws['!cols'] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Contacts');

    const dateStr = filter.dateRange ? `-${filter.dateRange}` : '';
    XLSX.writeFile(wb, `contacts${dateStr}-${Date.now()}.xlsx`);
    setShowExportMenu(false);
  };

  const subjectLabels = {
    'account-opening': 'Account Opening',
    'ipo': 'Quickmart IPO Application',
    'dangote-ipo': 'Dangote Petroleum Refinery IPO Application',
    'leverage': 'Apply for Leverage',
    'general': 'General Inquiries',
  };

  const hasActiveFilters = Boolean(filter.status || filter.subject || filter.dateRange);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Contact Submissions</h1>
          <div className="flex items-center justify-between mt-2">
            <p className="text-gray-600">
              {hasActiveFilters
                ? `Showing ${filteredContacts.length} of ${contacts.length} loaded submissions (DB total: ${pagination.total})`
                : `Showing ${contacts.length} of ${pagination.total} total submissions`}
            </p>

            {/* Export Menu */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center space-x-2 px-4 py-2 bg-[#0017bf] dark:bg-[#00005b] text-white rounded-lg hover:bg-[#0017bf] dark:bg-[#00005b]/90 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>

              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="p-2">
                    <div className="text-xs font-semibold text-gray-500 uppercase px-3 py-2">Export Format</div>
                    <button
                      onClick={() => exportToCSV(',')}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      <div className="text-left">
                        <div className="font-medium">CSV (Comma)</div>
                        <div className="text-xs text-gray-500">Standard comma-delimited</div>
                      </div>
                    </button>
                    <button
                      onClick={() => exportToCSV('|')}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      <div className="text-left">
                        <div className="font-medium">CSV (Pipe)</div>
                        <div className="text-xs text-gray-500">Pipe-delimited format</div>
                      </div>
                    </button>
                    <button
                      onClick={exportToExcel}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      <div className="text-left">
                        <div className="font-medium">Excel (.xlsx)</div>
                        <div className="text-xs text-gray-500">Microsoft Excel format</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
              >
                <option value="">All Status</option>
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="responded">Responded</option>
              </select>
            </div>

            <select
              value={filter.subject}
              onChange={(e) => setFilter({ ...filter, subject: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
            >
              <option value="">All Subjects</option>
              <option value="account-opening">Account Opening</option>
              <option value="ipo">Quickmart IPO</option>
              <option value="dangote-ipo">Dangote Petroleum Refinery IPO</option>
              <option value="funding-issues">Funding issues</option>
              <option value="password-reset">Password reset</option>
              <option value="dormant-account">Dormant account activation</option>
              <option value="offshore">Offshore Services</option>
              <option value="general">General</option>
            </select>

            <select
              value={filter.dateRange}
              onChange={(e) => setFilter({ ...filter, dateRange: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
            >
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="custom">Custom Range</option>
            </select>

            {/* Search by email / phone / name */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSearchQuery(searchInput.trim());
                  }
                }}
                placeholder="Search by email, phone, or name"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
              />
              <button
                type="button"
                onClick={() => setSearchQuery(searchInput.trim())}
                className="px-3 py-2 bg-[#0017bf] dark:bg-[#00005b] text-white rounded-lg hover:bg-[#0017bf] dark:bg-[#00005b]/90 transition-colors flex items-center justify-center"
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {filter.dateRange === 'custom' && (
              <>
                <input
                  type="date"
                  value={customDateRange.start}
                  onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
                  placeholder="Start Date"
                />
                <input
                  type="date"
                  value={customDateRange.end}
                  onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
                  placeholder="End Date"
                />
              </>
            )}
          </div>

          {filter.dateRange === 'custom' && customDateRange.start && customDateRange.end && (
            <div className="mt-2 text-sm text-gray-600">
              Showing contacts from {new Date(customDateRange.start).toLocaleDateString()} to {new Date(customDateRange.end).toLocaleDateString()}
            </div>
          )}
        </div>

        {/* Contacts Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-600">
              Loading contacts...
            </div>
          ) : filteredContacts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CDSC</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredContacts.map((contact) => (
                    <tr key={contact._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{contact.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{contact.email}</div>
                        <div className="text-sm text-gray-500">{contact.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {subjectLabels[contact.subject]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {contact.hasCDSC === 'yes' ? (
                          <div>
                            <div className="text-green-600">Yes</div>
                            <div className="text-gray-500">{contact.cdscNumber}</div>
                          </div>
                        ) : contact.hasCDSC === 'no' ? (
                          <span className="text-orange-600">No</span>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(contact.createdAt).toLocaleDateString()}
                        <div className="text-xs text-gray-400">
                          {new Date(contact.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={contact.status}
                          onChange={(e) => updateStatus(contact._id, e.target.value)}
                          className={`px-3 py-1 text-xs rounded-full border-0 ${contact.status === 'new' ? 'bg-green-100 text-green-700' :
                              contact.status === 'read' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                            }`}
                        >
                          <option value="new">New</option>
                          <option value="read">Read</option>
                          <option value="responded">Responded</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedContact(contact)}
                            className="text-[#0017bf] dark:text-[#00005b] hover:text-[#0017bf] dark:text-[#00005b]/80"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteContact(contact._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <p>No contacts found matching your filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Contact Details</h2>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-gray-900">{selectedContact.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{selectedContact.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900">{selectedContact.phone}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Subject</label>
                  <p className="text-gray-900">{subjectLabels[selectedContact.subject]}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Message</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedContact.message}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Has CDSC</label>
                    <p className="text-gray-900">
                      {selectedContact.hasCDSC === 'yes'
                        ? 'Yes'
                        : selectedContact.hasCDSC === 'no'
                          ? 'No'
                          : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">CDSC Number</label>
                    <p className="text-gray-900">{selectedContact.cdscNumber || '—'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Referral Source</label>
                    <p className="text-gray-900">{selectedContact.referralSource || '—'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email Sent</label>
                    <p className="text-gray-900">{selectedContact.emailSent ? 'Yes' : 'No'}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Internal Notes</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedContact.notes || '—'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <p className="text-gray-900 capitalize">{selectedContact.status}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Submitted</label>
                    <p className="text-gray-900">{new Date(selectedContact.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedContact(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
