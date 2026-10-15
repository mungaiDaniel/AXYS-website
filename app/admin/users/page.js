'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, UserPlus, Trash2, Edit, Lock, Mail, User as UserIcon } from 'lucide-react';

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    roleId: '',
  });
  const [roles, setRoles] = useState([]);
  const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' });

  const isSuperAdminRole = (role) => {
    if (!role) return false;
    const rawSlug = role.slug?.toLowerCase();
    const normalizedSlug = rawSlug ? rawSlug.replace(/[_\s]+/g, '-') : null;
    if (normalizedSlug === 'super-admin') return true;
    return role.name === 'Super Admin';
  };

  const isCurrentSuperAdmin = () => {
    if (!currentAdmin) return false;
    const role = currentAdmin.role;
    if (!role) return false;
    const rawSlug = (typeof role === 'string' ? role : role.slug)?.toLowerCase();
    const normalizedSlug = rawSlug ? rawSlug.replace(/[_\s]+/g, '-') : null;
    if (normalizedSlug === 'super-admin') return true;
    const roleName =
      typeof role === 'object' && role
        ? role.name
        : currentAdmin.roleName;
    return roleName === 'Super Admin';
  };

  useEffect(() => {
    fetchCurrentAdmin();
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/admin/roles');
      if (response.ok) {
        const data = await response.json();
        setRoles(data.roles || []);
        // Set default roleId to first role if not set
        if (!formData.roleId && data.roles && data.roles.length > 0) {
          setFormData(f => ({ ...f, roleId: data.roles[0]._id }));
        }
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchCurrentAdmin = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setCurrentAdmin(data.admin);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      
      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (response.status === 403) {
        alert('Access denied. Super admin only.');
        router.push('/admin/dashboard');
        return;
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('User created successfully!');
        setFormData({ email: '', password: '', name: '', roleId: '6981c9681cc552c4dd6c21a3' });
        setShowAddForm(false);
        fetchUsers();
      } else {
        alert(data.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Create user error:', error);
      alert('Failed to create user');
    }
  };

  const handleDeleteUser = async (userId, userEmail) => {
    if (!confirm(`Are you sure you want to delete ${userEmail}?`)) return;

    try {
      const response = await fetch(`/api/admin/users?id=${userId}`, { method: 'DELETE' });
      
      if (response.ok) {
        alert('User deleted successfully');
        fetchUsers();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete user');
    }
  };

  const handleChangePassword = async (e, userId) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newPassword: passwordData.newPassword }),
      });

      if (response.ok) {
        alert('Password changed successfully!');
        setShowPasswordForm(null);
        setPasswordData({ newPassword: '', confirmPassword: '' });
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Password change error:', error);
      alert('Failed to change password');
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isActive: !currentStatus }),
      });
      fetchUsers();
    } catch (error) {
      console.error('Toggle status error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">Manage admin users and permissions</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-2 px-4 py-2 bg-[#0017bf] dark:bg-[#00005b] text-white rounded-lg hover:bg-[#0017bf] dark:bg-[#00005b]/90 transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            <span>Add New User</span>
          </button>
        </div>
      </div>

      {/* Add User Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Create New Admin User</h2>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password * (min 6 characters)</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
                  minLength={6}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={formData.roleId}
                  onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
                  required
                >
                  {Array.from(new Map(roles.map(role => [role.slug, role])).values()).map(role => (
                    <option key={role._id} value={role._id}>{role.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-6 py-2 bg-[#0017bf] dark:bg-[#00005b] text-white rounded-lg hover:bg-[#0017bf] dark:bg-[#00005b]/90 transition-colors"
              >
                Create User
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => {
                const userId = user.id || user._id;
                return (
                <tr key={userId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <UserIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      isSuperAdminRole(user.role)
                        ? 'bg-purple-100 text-purple-700'
                        : user.role?.slug === 'viewer'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role?.name || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleUserStatus(userId, user.isActive)}
                      disabled={currentAdmin?.id === userId || !isCurrentSuperAdmin()}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        user.isActive
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {user.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowPasswordForm(userId)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Change Password"
                      >
                        <Lock className="w-4 h-4" />
                      </button>
                      {currentAdmin?.id !== userId && isCurrentSuperAdmin() && (
                        <button
                          onClick={() => handleDeleteUser(userId, user.email)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      {currentAdmin?.id === userId && (
                        <span className="text-xs text-gray-400 italic">You</span>
                      )}
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowPasswordForm(null)}>
          <div className="bg-white rounded-lg max-w-md w-full p-6 mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            <form onSubmit={(e) => handleChangePassword(e, showPasswordForm)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password *</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
                  minLength={6}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
                  minLength={6}
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#0017bf] dark:bg-[#00005b] text-white rounded-lg hover:bg-[#0017bf] dark:bg-[#00005b]/90"
                >
                  Change Password
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(null)}
                  className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">User Roles Explained</h3>
        <div className="space-y-2 text-sm text-blue-700">
          <p><strong>Super Admin:</strong> Full access to all features including user management, can create/delete other admins</p>
          <p><strong>Admin:</strong> Can manage content (contacts, research, IPO settings) but cannot manage other users</p>
          <p><strong>Viewer:</strong> Read-only access to most resources</p>
        </div>
      </div>
    </div>
  );
}
