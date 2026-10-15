// File: lib/permissions.js
/**
 * System-wide Permission Definitions for RBAC
 * These permissions can be assigned to custom roles by Super Admins
 * 
 * Permission Naming Convention: resource.action
 * Example: research.create, contacts.view
 */

export const PERMISSION_CATEGORIES = {
  // Content Management
  RESEARCH: {
    label: 'Research Papers',
    description: 'Manage research publications',
    permissions: {
      'research.view': 'View Research Papers',
      'research.create': 'Create Research Papers',
      'research.edit': 'Edit Research Papers',
      'research.delete': 'Delete Research Papers',
      'research.publish': 'Publish Research Papers',
    },
  },
  
  DOCUMENTS: {
    label: 'Documents',
    description: 'Manage document library',
    permissions: {
      'documents.view': 'View Documents',
      'documents.create': 'Upload Documents',
      'documents.edit': 'Edit Documents',
      'documents.delete': 'Delete Documents',
    },
  },

  IPO: {
    label: 'IPO Settings',
    description: 'Manage IPO configurations',
    permissions: {
      'ipo.view': 'View IPO Settings',
      'ipo.edit': 'Edit IPO Settings',
      'ipo.applications': 'View IPO Applications',
    },
  },

  NEWS: {
    label: 'News & Updates',
    description: 'Manage news and announcements',
    permissions: {
      'news.manage': 'Manage News/Updates',
    },
  },

  // CRM & Customer Data
  CONTACTS: {
    label: 'Contact Management',
    description: 'Manage customer contacts and leads',
    permissions: {
      'contacts.view': 'View Contacts',
      'contacts.edit': 'Edit Contacts',
      'contacts.delete': 'Delete Contacts',
      'contacts.export': 'Export Contact Data',
    },
  },

  EXCHANGE_RATES: {
    label: 'Exchange Rates',
    description: 'Manage currency exchange rates',
    permissions: {
      'exchange_rates.view': 'View Exchange Rates',
      'exchange_rates.edit': 'Edit Exchange Rates',
    },
  },

  GLOBAL_FUNDS: {
    label: 'Global Funds',
    description: 'Manage global investment funds',
    permissions: {
      'global_funds.view': 'View Global Funds',
      'global_funds.create': 'Create Global Funds',
      'global_funds.edit': 'Edit Global Funds',
      'global_funds.delete': 'Delete Global Funds',
    },
  },

  // System Administration
  USERS: {
    label: 'User Management',
    description: 'Manage admin users (Super Admin only)',
    permissions: {
      'users.view': 'View Admin Users',
      'users.create': 'Create Admin Users',
      'users.edit': 'Edit Admin Users',
      'users.delete': 'Delete Admin Users',
      'users.manage': 'Full User Management Access',
    },
  },

  ROLES: {
    label: 'Role Management',
    description: 'Manage roles and permissions (Super Admin only)',
    permissions: {
      'roles.manage': 'Manage Roles & Permissions',
    },
  },

  ANALYTICS: {
    label: 'Analytics',
    description: 'View and export analytics data',
    permissions: {
      'analytics.view': 'View Analytics Dashboard',
      'analytics.export': 'Export Analytics Data',
    },
  },

  LOGS: {
    label: 'Audit Logs',
    description: 'View system audit logs',
    permissions: {
      'logs.view': 'View Audit Logs',
      'logs.export': 'Export Audit Logs',
    },
  },

  SETTINGS: {
    label: 'System Settings',
    description: 'Configure system settings',
    permissions: {
      'settings.view': 'View Settings',
      'settings.email': 'Manage Email Settings',
      'settings.pages': 'Manage Page Visibility',
    },
  },

  GDPR: {
    label: 'GDPR & Compliance',
    description: 'Handle GDPR data requests',
    permissions: {
      'gdpr.view': 'View GDPR Requests',
      'gdpr.process': 'Process GDPR Requests',
    },
  },
};

/**
 * Get all permissions as a flat array
 */
export const getAllPermissions = () => {
  const permissions = [];
  Object.values(PERMISSION_CATEGORIES).forEach(category => {
    Object.keys(category.permissions).forEach(permission => {
      permissions.push(permission);
    });
  });
  return permissions;
};

/**
 * Get permission label by key
 */
export const getPermissionLabel = (permissionKey) => {
  for (const category of Object.values(PERMISSION_CATEGORIES)) {
    if (category.permissions[permissionKey]) {
      return category.permissions[permissionKey];
    }
  }
  return permissionKey;
};

/**
 * Validate if a permission exists
 */
export const isValidPermission = (permission) => {
  return getAllPermissions().includes(permission);
};

/**
 * System Role: Super Admin
 * This role cannot be deleted and has ALL permissions
 */
export const SUPER_ADMIN_PERMISSIONS = getAllPermissions();

/**
 * System Role: Admin (Default)
 * Standard admin with most permissions except user/role management
 */
export const DEFAULT_ADMIN_PERMISSIONS = [
  // Content
  'research.view',
  'research.create',
  'research.edit',
  'research.delete',
  'research.publish',
  'documents.view',
  'documents.create',
  'documents.edit',
  'documents.delete',
  'ipo.view',
  'ipo.edit',
  'ipo.applications',
  
  // CRM
  'contacts.view',
  'contacts.edit',
  'contacts.delete',
  'contacts.export',
  'exchange_rates.view',
  'exchange_rates.edit',
  'global_funds.view',
  'global_funds.create',
  'global_funds.edit',
  'global_funds.delete',
  
  // System (limited)
  'analytics.view',
  'analytics.export',
  'logs.view',
  'settings.view',
  'settings.pages',
  'gdpr.view',
  'gdpr.process',
];

/**
 * Helper: Check if user has permission
 * @param {Array} userPermissions - User's permission array
 * @param {String} requiredPermission - Permission to check
 * @returns {Boolean}
 */
export const hasPermission = (userPermissions, requiredPermission) => {
  if (!Array.isArray(userPermissions)) return false;
  return userPermissions.includes(requiredPermission);
};

/**
 * Helper: Check if user has any of the permissions
 */
export const hasAnyPermission = (userPermissions, requiredPermissions) => {
  if (!Array.isArray(userPermissions) || !Array.isArray(requiredPermissions)) return false;
  return requiredPermissions.some(perm => userPermissions.includes(perm));
};

/**
 * Helper: Check if user has all permissions
 */
export const hasAllPermissions = (userPermissions, requiredPermissions) => {
  if (!Array.isArray(userPermissions) || !Array.isArray(requiredPermissions)) return false;
  return requiredPermissions.every(perm => userPermissions.includes(perm));
};
