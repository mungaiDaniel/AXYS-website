'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Shield, Check, X, Save } from 'lucide-react';
import { PERMISSION_CATEGORIES } from '@/lib/permissions';

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [],
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/admin/roles');
      const data = await response.json();
      if (response.ok) {
        setRoles(data.roles);
      } else {
        alert(data.error || 'Failed to fetch roles');
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      alert('Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = () => {
    setEditingRole(null);
    setFormData({ name: '', description: '', permissions: [] });
    setShowModal(true);
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: [...role.permissions],
    });
    setShowModal(true);
  };

  const handleTogglePermission = (permissionKey) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionKey)
        ? prev.permissions.filter(p => p !== permissionKey)
        : [...prev.permissions, permissionKey],
    }));
  };

  const handleSelectAllInCategory = (category) => {
    const categoryPermissions = Object.keys(category.permissions);
    const allSelected = categoryPermissions.every(p => formData.permissions.includes(p));
    
    setFormData(prev => ({
      ...prev,
      permissions: allSelected
        ? prev.permissions.filter(p => !categoryPermissions.includes(p))
        : [...new Set([...prev.permissions, ...categoryPermissions])],
    }));
  };

  const handleSaveRole = async () => {
    try {
      const url = editingRole ? `/api/admin/roles` : `/api/admin/roles`;
      const method = editingRole ? 'PATCH' : 'POST';
      
      const payload = editingRole
        ? { id: editingRole.id, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert(editingRole ? 'Role updated successfully' : 'Role created successfully');
        setShowModal(false);
        fetchRoles();
      } else {
        alert(data.error || 'Failed to save role');
      }
    } catch (error) {
      console.error('Error saving role:', error);
      alert('Failed to save role');
    }
  };

  const handleDeleteRole = async (roleId, roleName) => {
    if (!confirm(`Are you sure you want to delete the role "${roleName}"?`)) return;

    try {
      const response = await fetch(`/api/admin/roles?id=${roleId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        alert('Role deleted successfully');
        fetchRoles();
      } else {
        alert(data.error || 'Failed to delete role');
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      alert('Failed to delete role');
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Role Management</h1>
          <p className="text-gray-600">Manage roles and permissions for admin users</p>
        </div>
        <button
          onClick={handleCreateRole}
          className="flex items-center gap-2 px-6 py-3 bg-[#0017bf] dark:bg-[#00005b] text-white rounded-lg hover:bg-[#0014a8] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Role
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-600">
          Loading roles...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => (
            <div
              key={role.id || role._id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    role.isSystem
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-purple-100 text-purple-600'
                  }`}>
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{role.name}</h3>
                    {role.isSystem && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">System</span>
                    )}
                  </div>
                </div>
                {!role.isSystem && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditRole(role)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteRole(role.id || role._id, role.name)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-600 mb-4">{role.description}</p>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Permissions:</span>
                  <span className="font-semibold text-[#0017bf] dark:text-[#00005b]">{role.permissions.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Users:</span>
                  <span className="font-semibold">{role.userCount || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Role Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {editingRole ? 'Edit Role' : 'Create New Role'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {/* Basic Info */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Role Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b] focus:border-transparent"
                  placeholder="e.g., Market Analyst"
                  disabled={editingRole?.isSystem}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b] focus:border-transparent"
                  rows="3"
                  placeholder="Describe this role's responsibilities..."
                  disabled={editingRole?.isSystem}
                />
              </div>

              {/* Permissions Matrix */}
              <div>
                <label className="block text-sm font-semibold mb-4">Permissions ({formData.permissions.length} selected)</label>
                
                {Object.entries(PERMISSION_CATEGORIES).map(([categoryKey, category]) => {
                  const categoryPermissions = Object.keys(category.permissions);
                  const selectedCount = categoryPermissions.filter(p => formData.permissions.includes(p)).length;
                  const allSelected = selectedCount === categoryPermissions.length;

                  return (
                    <div key={categoryKey} className="mb-6 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{category.label}</h4>
                          <p className="text-xs text-gray-500">{category.description}</p>
                        </div>
                        <button
                          onClick={() => handleSelectAllInCategory(category)}
                          className={`text-xs px-3 py-1 rounded-lg transition-colors ${
                            allSelected
                              ? 'bg-[#0017bf] dark:bg-[#00005b] text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          disabled={editingRole?.isSystem}
                        >
                          {allSelected ? 'Deselect All' : 'Select All'} ({selectedCount}/{categoryPermissions.length})
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {Object.entries(category.permissions).map(([permKey, permLabel]) => (
                          <label
                            key={permKey}
                            className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                              formData.permissions.includes(permKey)
                                ? 'bg-blue-50'
                                : 'hover:bg-gray-50'
                            } ${editingRole?.isSystem ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <input
                              type="checkbox"
                              checked={formData.permissions.includes(permKey)}
                              onChange={() => handleTogglePermission(permKey)}
                              className="w-4 h-4 text-[#0017bf] dark:text-[#00005b] border-gray-300 rounded focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
                              disabled={editingRole?.isSystem}
                            />
                            <span className="text-sm text-gray-700">{permLabel}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRole}
                disabled={!formData.name || formData.permissions.length === 0 || editingRole?.isSystem}
                className="flex items-center gap-2 px-6 py-2 bg-[#0017bf] dark:bg-[#00005b] text-white rounded-lg hover:bg-[#0014a8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {editingRole ? 'Update Role' : 'Create Role'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
