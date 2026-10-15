'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, Trash2, Download, Edit, Save, X, Search } from 'lucide-react';
import { nseCompanies } from '@/data/nseCompanies';

export default function AdminResearchPage() {
  const router = useRouter();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingPaper, setEditingPaper] = useState(null);
  const [companySearch, setCompanySearch] = useState('');
  const [editCompanySearch, setEditCompanySearch] = useState('');
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: 'price-list',
    company: '',
    sector: '',
    tags: '',
  });

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      const response = await fetch('/api/admin/research');
      
      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      const data = await response.json();
      setPapers(data.papers || []);
    } catch (error) {
      console.error('Error fetching papers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const fileInput = document.getElementById('pdfFile');
      const file = fileInput.files[0];

      if (!file) {
        alert('Please select a file');
        setUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', uploadForm.title);
      formData.append('description', uploadForm.description);
      formData.append('category', uploadForm.category);
      formData.append('company', uploadForm.company);
      formData.append('sector', uploadForm.sector);
      formData.append('tags', uploadForm.tags);

      const response = await fetch('/api/admin/research', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Research paper uploaded successfully!');
        setUploadForm({ title: '', description: '', category: 'price-list', company: '', sector: '', tags: '' });
        fileInput.value = '';
        setCompanySearch('');
        fetchPapers();
      } else {
        const data = await response.json();
        alert(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/admin/research', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingPaper._id,
          title: editingPaper.title,
          description: editingPaper.description,
          category: editingPaper.category,
          company: editingPaper.company || '',
          sector: editingPaper.sector || '',
          tags: Array.isArray(editingPaper.tags) ? editingPaper.tags.join(', ') : editingPaper.tags,
        }),
      });

      if (response.ok) {
        alert('Paper updated successfully!');
        setEditingPaper(null);
        setEditCompanySearch('');
        fetchPapers();
      } else {
        alert('Failed to update paper');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update paper');
    }
  };

  const selectCompany = (companyName) => {
    const company = nseCompanies.find(c => c.name === companyName);
    if (company) {
      setUploadForm({ ...uploadForm, company: company.name, sector: company.sector });
      setCompanySearch('');
    }
  };

  const selectEditCompany = (companyName) => {
    const company = nseCompanies.find(c => c.name === companyName);
    if (company) {
      setEditingPaper({ ...editingPaper, company: company.name, sector: company.sector });
      setEditCompanySearch('');
    }
  };

  const deletePaper = async (id) => {
    if (!confirm('Are you sure you want to delete this paper?')) return;
    
    try {
      await fetch(`/api/admin/research?id=${id}`, { method: 'DELETE' });
      fetchPapers();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const filteredCompanies = nseCompanies.filter(c =>
    c.name.toLowerCase().includes(companySearch.toLowerCase()) ||
    c.sector.toLowerCase().includes(companySearch.toLowerCase())
  );

  const filteredEditCompanies = nseCompanies.filter(c =>
    c.name.toLowerCase().includes(editCompanySearch.toLowerCase()) ||
    c.sector.toLowerCase().includes(editCompanySearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Research Papers</h1>
        <p className="text-gray-600 mt-1">{papers.length} papers published</p>
      </div>

      {/* Upload Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Upload New Research Paper</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                value={uploadForm.title}
                onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                value={uploadForm.category}
                onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value, company: '', sector: '' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
              >
                <option value="price-list">Price List</option>
                <option value="daily-briefs">Daily Briefs</option>
                <option value="weekly-note">Weekly Note</option>
                <option value="company-specific-reports">Company Specific Reports</option>
                <option value="fixed-income-notes">Fixed Income Notes</option>
                <option value="stock-recommendations">Stock Recommendations</option>
                <option value="quarterly-reports">Quarterly Reports</option>
                <option value="topical-reports">Topical Reports</option>
                <option value="bespoke-reports">Bespoke Reports</option>
              </select>
            </div>
          </div>

          {/* Company Selection */}
          {uploadForm.category === 'company' && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Company *</label>
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={companySearch}
                  onChange={(e) => setCompanySearch(e.target.value)}
                  placeholder="Search by company name or sector..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
                />
              </div>
              {companySearch && filteredCompanies.length > 0 && (
                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg mb-2">
                  {filteredCompanies.slice(0, 15).map((company, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => selectCompany(company.name)}
                      className="w-full text-left px-4 py-2 hover:bg-blue-100 transition-colors border-b last:border-b-0"
                    >
                      <div className="font-medium text-sm text-gray-900">{company.name}</div>
                      <div className="text-xs text-gray-500">{company.sector}</div>
                    </button>
                  ))}
                </div>
              )}
              {uploadForm.company && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-sm font-semibold text-green-900">{uploadForm.company}</div>
                  <div className="text-xs text-green-700">{uploadForm.sector}</div>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={uploadForm.description}
              onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
            <input
              type="text"
              value={uploadForm.tags}
              onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
              placeholder="e.g., financial, analysis, earnings"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">PDF File *</label>
            <input
              type="file"
              id="pdfFile"
              accept=".pdf"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
              required
            />
          </div>
          <button
            type="submit"
            disabled={uploading || (uploadForm.category === 'company' && !uploadForm.company)}
            className="w-full py-3 bg-[#0017bf] dark:bg-[#00005b] text-white rounded-lg font-semibold hover:bg-[#0017bf] dark:bg-[#00005b]/90 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <Upload className="w-5 h-5" />
            <span>{uploading ? 'Uploading...' : 'Upload Research Paper'}</span>
          </button>
        </form>
      </div>

      {/* Papers List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Published Research Papers</h2>
        </div>
        {loading ? (
          <div className="p-12 text-center text-gray-600">
            Loading research papers...
          </div>
        ) : papers.length > 0 ? (
          <div className="divide-y">
            {papers.map((paper) => (
              <div key={paper._id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <FileText className="w-5 h-5 text-[#0017bf] dark:text-[#00005b]" />
                      <h3 className="font-semibold text-gray-900">{paper.title}</h3>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                        {paper.category.replace(/-/g, ' ')}
                      </span>
                    </div>
                    {paper.company && (
                      <p className="text-sm text-blue-600 mb-1">
                        <strong>Company:</strong> {paper.company} | <span className="text-gray-600">{paper.sector}</span>
                      </p>
                    )}
                    <p className="text-sm text-gray-600 mb-2">{paper.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{new Date(paper.publishedDate).toLocaleDateString()}</span>
                      <span>{(paper.fileSize / 1024).toFixed(2)} KB</span>
                      <span>{paper.downloadCount} downloads</span>
                    </div>
                    {paper.tags && paper.tags.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {paper.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingPaper({ ...paper, tags: paper.tags || [] })}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Edit Paper"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <a
                      href={paper.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      title="View PDF"
                    >
                      <Download className="w-5 h-5" />
                    </a>
                    <button
                      onClick={() => deletePaper(paper._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No research papers uploaded yet</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingPaper && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setEditingPaper(null)}>
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Edit Research Paper</h2>
              <button onClick={() => setEditingPaper(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={editingPaper.title}
                  onChange={(e) => setEditingPaper({ ...editingPaper, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  value={editingPaper.category}
                  onChange={(e) => setEditingPaper({ ...editingPaper, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
                >
                  <option value="price-list">Price List</option>
                  <option value="daily-briefs">Daily Briefs</option>
                  <option value="weekly-note">Weekly Note</option>
                  <option value="company-specific-reports">Company Specific Reports</option>
                  <option value="fixed-income-notes">Fixed Income Notes</option>
                  <option value="stock-recommendations">Stock Recommendations</option>
                  <option value="quarterly-reports">Quarterly Reports</option>
                  <option value="topical-reports">Topical Reports</option>
                  <option value="bespoke-reports">Bespoke Reports</option>
                </select>
              </div>

              {/* Company Selection for Edit */}
              {editingPaper.category === 'company' && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Company *</label>
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={editCompanySearch}
                      onChange={(e) => setEditCompanySearch(e.target.value)}
                      placeholder="Search by company name or sector..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
                    />
                  </div>
                  {editCompanySearch && filteredEditCompanies.length > 0 && (
                    <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg mb-2">
                      {filteredEditCompanies.slice(0, 15).map((company, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => selectEditCompany(company.name)}
                          className="w-full text-left px-4 py-2 hover:bg-blue-100 transition-colors border-b last:border-b-0"
                        >
                          <div className="font-medium text-sm text-gray-900">{company.name}</div>
                          <div className="text-xs text-gray-500">{company.sector}</div>
                        </button>
                      ))}
                    </div>
                  )}
                  {editingPaper.company && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="text-sm font-semibold text-green-900">{editingPaper.company}</div>
                      <div className="text-xs text-green-700">{editingPaper.sector}</div>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={editingPaper.description || ''}
                  onChange={(e) => setEditingPaper({ ...editingPaper, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  value={Array.isArray(editingPaper.tags) ? editingPaper.tags.join(', ') : (editingPaper.tags || '')}
                  onChange={(e) => setEditingPaper({ ...editingPaper, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
                  placeholder="e.g., financial, analysis, earnings"
                />
              </div>
              <div className="flex space-x-3 pt-4 border-t">
                <button
                  type="submit"
                  disabled={editingPaper.category === 'company' && !editingPaper.company}
                  className="flex-1 py-3 bg-[#0017bf] dark:bg-[#00005b] text-white rounded-lg hover:bg-[#0017bf] dark:bg-[#00005b]/90 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setEditingPaper(null); setEditCompanySearch(''); }}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
