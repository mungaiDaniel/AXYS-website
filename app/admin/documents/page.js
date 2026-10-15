'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, Trash2, Download, Edit, Save, X } from 'lucide-react';

const categoryLabels = {
  'terms-and-conditions': 'Terms & Conditions', 'audited-financial-reports': 'Audited Financial Reports',
  'unaudited-financial-reports': 'Unaudited Financial Reports', 'application-forms': 'Application Forms',
  'press-releases': 'Press Releases', news: 'News', 'fees-and-tariffs': 'Fees & Tariffs',
  'compliance-documents': 'Compliance Documents', 'global-funds': 'Global Funds', other: 'Other',
};

export default function AdminDocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [uploadForm, setUploadForm] = useState({ title: '', description: '', category: 'compliance-documents' });

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/admin/documents');
      if (response.status === 401) return router.push('/admin/login');
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) { console.error('Error fetching documents:', error); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchDocuments(); }, []);

  const handleUpload = async (event) => {
    event.preventDefault(); setUploading(true);
    try {
      const fileInput = document.getElementById('docFile');
      const file = fileInput.files[0];
      if (!file) throw new Error('Please select a file');
      const formData = new FormData();
      formData.append('file', file); formData.append('title', uploadForm.title);
      formData.append('description', uploadForm.description); formData.append('category', uploadForm.category);
      const response = await fetch('/api/admin/documents', { method: 'POST', body: formData });
      if (!response.ok) throw new Error((await response.json()).error || 'Upload failed');
      alert('Document uploaded successfully.');
      setUploadForm({ title: '', description: '', category: 'compliance-documents' }); fileInput.value = ''; fetchDocuments();
    } catch (error) { console.error('Upload error:', error); alert(error.message || 'Upload failed'); }
    finally { setUploading(false); }
  };

  const handleEdit = async (event) => {
    event.preventDefault(); setSaving(true);
    try {
      const response = await fetch('/api/admin/documents', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingDocument._id, title: editingDocument.title, description: editingDocument.description || '', category: editingDocument.category, isPublished: editingDocument.isPublished }),
      });
      if (!response.ok) throw new Error((await response.json()).error || 'Failed to update document');
      alert('Document updated successfully.'); setEditingDocument(null); fetchDocuments();
    } catch (error) { console.error('Update error:', error); alert(error.message || 'Failed to update document'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this document permanently? This cannot be undone.')) return;
    try {
      const response = await fetch(`/api/admin/documents?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error((await response.json()).error || 'Failed to delete document');
      setDocuments((current) => current.filter((doc) => doc._id !== id));
    } catch (error) { console.error('Delete error:', error); alert(error.message || 'Failed to delete document'); }
  };

  const fieldClass = 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf]';
  const categoryOptions = Object.entries(categoryLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>);

  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="mb-8"><h1 className="text-3xl font-bold text-gray-900">Documents</h1><p className="text-gray-600 mt-1">{documents.length} uploaded documents</p></div>
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-xl font-bold mb-4">Upload New Document</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-2">Title *</label><input type="text" value={uploadForm.title} onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })} className={fieldClass} required /></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Category *</label><select value={uploadForm.category} onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })} className={fieldClass}>{categoryOptions}</select></div></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Description</label><textarea value={uploadForm.description} onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })} rows={3} className={fieldClass} /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">File (PDF, Word, or Excel; max. 50 MB) *</label><input type="file" id="docFile" accept=".pdf,.doc,.docx,.xls,.xlsx" className="w-full px-4 py-2 border border-gray-300 rounded-lg" required /></div>
        <button type="submit" disabled={uploading} className="w-full py-3 bg-[#0017bf] text-white rounded-lg font-semibold hover:bg-[#0017bf]/90 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"><Upload className="w-5 h-5" /><span>{uploading ? 'Uploading...' : 'Upload Document'}</span></button>
      </form>
    </div>
    <div className="bg-white rounded-lg shadow"><div className="p-6 border-b"><h2 className="text-xl font-bold">Uploaded Documents</h2></div>
      {loading ? <div className="p-12 text-center text-gray-600">Loading documents...</div> : documents.length > 0 ? <div className="divide-y">{documents.map((doc) => <div key={doc._id} className="p-6 hover:bg-gray-50"><div className="flex items-start justify-between gap-4"><div className="flex-1 min-w-0"><div className="flex flex-wrap items-center gap-3 mb-2"><FileText className="w-5 h-5 text-[#0017bf] flex-shrink-0" /><h3 className="font-semibold text-gray-900 break-words">{doc.title}</h3><span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">{categoryLabels[doc.category] || doc.category}</span>{!doc.isPublished && <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">Draft</span>}</div>{doc.description && <p className="text-sm text-gray-600 mb-2">{doc.description}</p>}<div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500"><span>{doc.fileName}</span><span>{new Date(doc.publishedDate).toLocaleDateString()}</span><span>{((doc.fileSize || 0) / 1024).toFixed(2)} KB</span><span>{doc.downloadCount || 0} downloads</span></div></div><div className="flex items-center gap-2 flex-shrink-0"><button onClick={() => setEditingDocument({ ...doc })} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit document" aria-label="Edit document"><Edit className="w-5 h-5" /></button><a href={`/api/documents/download?id=${doc._id}`} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Download document" aria-label="Download document"><Download className="w-5 h-5" /></a><button onClick={() => handleDelete(doc._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete document" aria-label="Delete document"><Trash2 className="w-5 h-5" /></button></div></div></div>)}</div> : <div className="p-12 text-center text-gray-500"><FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" /><p>No documents uploaded yet</p></div>}
    </div>
    {editingDocument && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setEditingDocument(null)}><div className="bg-white rounded-lg max-w-2xl w-full p-6" onClick={(event) => event.stopPropagation()}><div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-bold">Edit Document</h2><button onClick={() => setEditingDocument(null)} className="text-gray-400 hover:text-gray-600" aria-label="Close edit dialog"><X className="w-6 h-6" /></button></div><form onSubmit={handleEdit} className="space-y-4"><div><label className="block text-sm font-medium text-gray-700 mb-2">Title *</label><input type="text" value={editingDocument.title} onChange={(e) => setEditingDocument({ ...editingDocument, title: e.target.value })} className={fieldClass} required /></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Category *</label><select value={editingDocument.category} onChange={(e) => setEditingDocument({ ...editingDocument, category: e.target.value })} className={fieldClass}>{categoryOptions}</select></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Description</label><textarea value={editingDocument.description || ''} onChange={(e) => setEditingDocument({ ...editingDocument, description: e.target.value })} rows={3} className={fieldClass} /></div><label className="flex items-center gap-3 text-sm text-gray-700"><input type="checkbox" checked={editingDocument.isPublished !== false} onChange={(e) => setEditingDocument({ ...editingDocument, isPublished: e.target.checked })} className="w-4 h-4" />Publish this document on the website</label><div className="flex gap-3 pt-4 border-t"><button type="submit" disabled={saving} className="flex-1 py-3 bg-[#0017bf] text-white rounded-lg hover:bg-[#0017bf]/90 disabled:opacity-50 flex items-center justify-center gap-2"><Save className="w-5 h-5" /><span>{saving ? 'Saving...' : 'Save Changes'}</span></button><button type="button" onClick={() => setEditingDocument(null)} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Cancel</button></div></form></div></div>}
  </div>;
}
