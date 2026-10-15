// File: app/admin/global-funds/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Trash2, Edit, Save, X, Plus, FileText, Eye, EyeOff } from 'lucide-react';

export default function AdminGlobalFundsPage() {
  const router = useRouter();
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingFund, setEditingFund] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(null);
  const [newFund, setNewFund] = useState({
    fundName: '',
    shortName: '',
    description: '',
    performanceBoxes: [],
    documents: [],
    isVisible: true,
    displayOrder: 0,
  });

  useEffect(() => {
    fetchFunds();
  }, []);

  const fetchFunds = async () => {
    try {
      const response = await fetch('/api/admin/global-funds');
      
      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      const data = await response.json();
      setFunds(data.funds || []);
    } catch (error) {
      console.error('Error fetching funds:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFund = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin/global-funds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFund),
      });

      if (response.ok) {
        alert('Fund created successfully!');
        setNewFund({
          fundName: '',
          shortName: '',
          description: '',
          performanceBoxes: [],
          documents: [],
          isVisible: true,
          displayOrder: 0,
        });
        setShowAddForm(false);
        fetchFunds();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to create fund');
      }
    } catch (error) {
      console.error('Create error:', error);
      alert('Failed to create fund');
    }
  };

  const handleUpdateFund = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/admin/global-funds', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingFund),
      });

      if (response.ok) {
        alert('Fund updated successfully!');
        setEditingFund(null);
        fetchFunds();
      } else {
        const data = await response.json().catch(() => ({}));
        alert(data.error || 'Failed to update fund');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update fund');
    }
  };

  const handleDeleteFund = async (id) => {
    if (!confirm('Are you sure you want to delete this fund?')) return;
    
    try {
      await fetch(`/api/admin/global-funds?id=${id}`, { method: 'DELETE' });
      fetchFunds();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleDocumentUpload = async (fundId, file) => {
    setUploadingDoc(fundId);
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fundId', fundId);

      // For now, we'll upload to the documents folder using the existing upload logic
      // You can create a dedicated API route for fund documents if needed
      const uploadResponse = await fetch('/api/admin/documents', {
        method: 'POST',
        body: formData,
      });

      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        
        // Find the fund and add the document
        const fund = funds.find(f => f._id === fundId);
        if (fund) {
          const updatedDocuments = [
            ...fund.documents,
            {
              name: file.name,
              url: uploadData.document.fileUrl,
            }
          ];

          // Update the fund with new document
          await fetch('/api/admin/global-funds', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: fundId,
              documents: updatedDocuments,
            }),
          });

          alert('Document uploaded successfully!');
          fetchFunds();
        }
      } else {
        alert('Failed to upload document');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload document');
    } finally {
      setUploadingDoc(null);
    }
  };

  const addDocumentToNewFund = () => {
    const name = prompt('Enter document name:');
    const url = prompt('Enter document URL (e.g., /documents/filename.pdf):');
    
    if (name && url) {
      setNewFund({
        ...newFund,
        documents: [...newFund.documents, { name, url }]
      });
    }
  };

  const addDocumentToEditingFund = () => {
    const name = prompt('Enter document name:');
    const url = prompt('Enter document URL (e.g., /documents/filename.pdf):');
    
    if (name && url) {
      setEditingFund({
        ...editingFund,
        documents: [...editingFund.documents, { name, url }]
      });
    }
  };

  const removeDocumentFromNewFund = (index) => {
    setNewFund({
      ...newFund,
      documents: newFund.documents.filter((_, i) => i !== index)
    });
  };

  const removeDocumentFromEditingFund = (index) => {
    setEditingFund({
      ...editingFund,
      documents: editingFund.documents.filter((_, i) => i !== index)
    });
  };

  const addPerformanceBoxToNewFund = () => {
    setNewFund({
      ...newFund,
      performanceBoxes: [...(newFund.performanceBoxes || []), { label: '', value: '' }]
    });
  };

  const addPerformanceBoxToEditingFund = () => {
    setEditingFund({
      ...editingFund,
      performanceBoxes: [...(editingFund.performanceBoxes || []), { label: '', value: '' }]
    });
  };

  const updatePerformanceBoxInNewFund = (index, field, fieldValue) => {
    const updatedBoxes = [...(newFund.performanceBoxes || [])];
    updatedBoxes[index] = { ...updatedBoxes[index], [field]: fieldValue };
    setNewFund({ ...newFund, performanceBoxes: updatedBoxes });
  };

  const updatePerformanceBoxInEditingFund = (index, field, fieldValue) => {
    const updatedBoxes = [...(editingFund.performanceBoxes || [])];
    updatedBoxes[index] = { ...updatedBoxes[index], [field]: fieldValue };
    setEditingFund({ ...editingFund, performanceBoxes: updatedBoxes });
  };

  const removePerformanceBoxFromNewFund = (index) => {
    setNewFund({
      ...newFund,
      performanceBoxes: (newFund.performanceBoxes || []).filter((_, i) => i !== index)
    });
  };

  const removePerformanceBoxFromEditingFund = (index) => {
    setEditingFund({
      ...editingFund,
      performanceBoxes: (editingFund.performanceBoxes || []).filter((_, i) => i !== index)
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Global Funds Manager</h1>
          <p className="text-gray-600 mt-1">{funds.length} funds configured</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-6 py-3 bg-[#0017bf] dark:bg-[#00005b] text-white rounded-lg hover:bg-[#0017bf] dark:bg-[#00005b]/90 transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Fund</span>
        </button>
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddForm(false)}>
          <div className="bg-white rounded-lg max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Add New Global Fund</h2>
              <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreateFund} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fund Name *</label>
                <input
                  type="text"
                  value={newFund.fundName}
                  onChange={(e) => setNewFund({ ...newFund, fundName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Short Name (e.g. AEF, AYF)</label>
                <input
                  type="text"
                  value={newFund.shortName || ''}
                  onChange={(e) => setNewFund({ ...newFund, shortName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={newFund.description}
                  onChange={(e) => setNewFund({ ...newFund, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
                  rows={4}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
                  <input
                    type="number"
                    value={newFund.displayOrder}
                    onChange={(e) => setNewFund({ ...newFund, displayOrder: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Performance Metrics</label>
                  <button
                    type="button"
                    onClick={addPerformanceBoxToNewFund}
                    className="text-sm text-[#0017bf] dark:text-[#00005b] hover:underline flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Metric</span>
                  </button>
                </div>
                {newFund.performanceBoxes && newFund.performanceBoxes.length > 0 ? (
                  <div className="space-y-3">
                    {newFund.performanceBoxes.map((box, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={box.label}
                          onChange={(e) => updatePerformanceBoxInNewFund(index, 'label', e.target.value)}
                          placeholder="Label (e.g., PERFORMANCE, ANNUALIZED, YTD)"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b] text-sm"
                        />
                        <input
                          type="text"
                          value={box.value}
                          onChange={(e) => updatePerformanceBoxInNewFund(index, 'value', e.target.value)}
                          placeholder="Value (e.g., 42.5%, 15.2)"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b] text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removePerformanceBoxFromNewFund(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No performance metrics added yet. Click "Add Metric" to add one.</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newFund.isVisible}
                  onChange={(e) => setNewFund({ ...newFund, isVisible: e.target.checked })}
                  className="w-4 h-4 text-[#0017bf] dark:text-[#00005b] border-gray-300 rounded focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
                />
                <label className="text-sm text-gray-700">Visible on public website</label>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Documents</label>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-[#0017bf] dark:text-[#00005b] hover:underline cursor-pointer flex items-center space-x-1">
                      <Upload className="w-4 h-4" />
                      <span>Upload File</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          
                          const formData = new FormData();
                          formData.append('file', file);
                          formData.append('title', file.name);
                          formData.append('category', 'global-funds');
                          
                          try {
                            const response = await fetch('/api/admin/documents', {
                              method: 'POST',
                              body: formData,
                            });
                            
                            if (response.ok) {
                              const data = await response.json();
                              setNewFund({
                                ...newFund,
                                documents: [...newFund.documents, { name: file.name, url: data.document.fileUrl }]
                              });
                              alert('Document uploaded successfully!');
                            } else {
                              alert('Failed to upload document');
                            }
                          } catch (error) {
                            console.error('Upload error:', error);
                            alert('Failed to upload document');
                          }
                          e.target.value = '';
                        }}
                        className="hidden"
                        id="upload-doc-new"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={addDocumentToNewFund}
                      className="text-sm text-[#0017bf] dark:text-[#00005b] hover:underline"
                    >
                      + Add URL
                    </button>
                  </div>
                </div>
                {newFund.documents.length > 0 && (
                  <div className="space-y-2">
                    {newFund.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-xs text-gray-500">{doc.url}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDocumentFromNewFund(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex space-x-3 pt-4 border-t">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#0017bf] dark:bg-[#00005b] text-white rounded-lg hover:bg-[#0017bf] dark:bg-[#00005b]/90 flex items-center justify-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>Create Fund</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Funds List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">All Global Funds</h2>
        </div>
        {loading ? (
          <div className="p-12 text-center text-gray-600">
            Loading global funds...
          </div>
        ) : funds.length > 0 ? (
          <div className="divide-y">
            {funds.map((fund) => (
              <div key={fund._id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-bold text-lg text-gray-900">{fund.fundName}</h3>
                      {fund.isVisible ? (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>Visible</span>
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded flex items-center space-x-1">
                          <EyeOff className="w-3 h-3" />
                          <span>Hidden</span>
                        </span>
                      )}
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                        Order: {fund.displayOrder}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{fund.description}</p>
                    {fund.performanceBoxes && fund.performanceBoxes.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-2">
                        {fund.performanceBoxes.map((box, idx) => (
                          <span key={idx} className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
                            <strong>{box.label}:</strong> {box.value}
                          </span>
                        ))}
                      </div>
                    )}
                    {fund.documents && fund.documents.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-medium text-gray-700 mb-2">Attached Documents:</p>
                        <div className="flex flex-wrap gap-2">
                          {fund.documents.map((doc, idx) => (
                            <a
                              key={idx}
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs hover:bg-blue-100 transition-colors flex items-center space-x-1"
                            >
                              <FileText className="w-3 h-3" />
                              <span>{doc.name}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-3">
                      <span>Created: {new Date(fund.createdAt).toLocaleDateString()}</span>
                      <span>Updated: {new Date(fund.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingFund({ ...fund })}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Edit Fund"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteFund(fund._id)}
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
            <p>No global funds configured yet</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingFund && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setEditingFund(null)}>
          <div className="bg-white rounded-lg max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Edit Global Fund</h2>
              <button onClick={() => setEditingFund(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleUpdateFund} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fund Name *</label>
                <input
                  type="text"
                  value={editingFund.fundName}
                  onChange={(e) => setEditingFund({ ...editingFund, fundName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Short Name (e.g. AEF, AYF)</label>
                <input
                  type="text"
                  value={editingFund.shortName || ''}
                  onChange={(e) => setEditingFund({ ...editingFund, shortName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={editingFund.description}
                  onChange={(e) => setEditingFund({ ...editingFund, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
                  rows={4}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
                  <input
                    type="number"
                    value={editingFund.displayOrder}
                    onChange={(e) => setEditingFund({ ...editingFund, displayOrder: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Performance Metrics</label>
                  <button
                    type="button"
                    onClick={addPerformanceBoxToEditingFund}
                    className="text-sm text-[#0017bf] dark:text-[#00005b] hover:underline flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Metric</span>
                  </button>
                </div>
                {editingFund.performanceBoxes && editingFund.performanceBoxes.length > 0 ? (
                  <div className="space-y-3">
                    {editingFund.performanceBoxes.map((box, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={box.label}
                          onChange={(e) => updatePerformanceBoxInEditingFund(index, 'label', e.target.value)}
                          placeholder="Label (e.g., MARGARET, ANNUALIZED, YTD)"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b] text-sm"
                        />
                        <input
                          type="text"
                          value={box.value}
                          onChange={(e) => updatePerformanceBoxInEditingFund(index, 'value', e.target.value)}
                          placeholder="Value (e.g., 42.5%, 15.2)"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b] text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removePerformanceBoxFromEditingFund(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No performance metrics added yet. Click "Add Metric" to add one.</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={editingFund.isVisible}
                  onChange={(e) => setEditingFund({ ...editingFund, isVisible: e.target.checked })}
                  className="w-4 h-4 text-[#0017bf] dark:text-[#00005b] border-gray-300 rounded focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
                />
                <label className="text-sm text-gray-700">Visible on public website</label>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Documents</label>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-[#0017bf] dark:text-[#00005b] hover:underline cursor-pointer flex items-center space-x-1">
                      <Upload className="w-4 h-4" />
                      <span>Upload File</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          
                          const formData = new FormData();
                          formData.append('file', file);
                          formData.append('title', file.name);
                          formData.append('category', 'global-funds');
                          
                          try {
                            const response = await fetch('/api/admin/documents', {
                              method: 'POST',
                              body: formData,
                            });
                            
                            if (response.ok) {
                              const data = await response.json();
                              setEditingFund({
                                ...editingFund,
                                documents: [...editingFund.documents, { name: file.name, url: data.document.fileUrl }]
                              });
                              alert('Document uploaded successfully!');
                            } else {
                              alert('Failed to upload document');
                            }
                          } catch (error) {
                            console.error('Upload error:', error);
                            alert('Failed to upload document');
                          }
                          e.target.value = '';
                        }}
                        className="hidden"
                        id="upload-doc-edit"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={addDocumentToEditingFund}
                      className="text-sm text-[#0017bf] dark:text-[#00005b] hover:underline"
                    >
                      + Add URL
                    </button>
                  </div>
                </div>
                {editingFund.documents && editingFund.documents.length > 0 && (
                  <div className="space-y-2">
                    {editingFund.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-xs text-gray-500">{doc.url}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDocumentFromEditingFund(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex space-x-3 pt-4 border-t">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#0017bf] dark:bg-[#00005b] text-white rounded-lg hover:bg-[#0017bf] dark:bg-[#00005b]/90 flex items-center justify-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingFund(null)}
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