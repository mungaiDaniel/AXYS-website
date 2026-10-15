# RBAC & Admin Access Debugging - Change Log

## Summary
This document outlines all changes and fixes applied to the AIB-AXYS Admin Portal to resolve issues with Super Admin access, user/role management, and duplicate role errors. These steps were taken to ensure a robust, secure, and maintainable RBAC (Role-Based Access Control) system.

---

## 1. Database Cleanup & Seeding
- **Cleared all admin and role collections** in MongoDB to remove duplicates and invalid references:
  - `db.admins.deleteMany({})`
  - `db.roles.deleteMany({})`
- **Seeded system roles** using `node scripts/seed-roles.js` to ensure only one of each system role (Super Admin, Admin, Viewer) exists.
- **Verified** that only three system roles exist and that all are unique by name and slug.

## 2. Duplicate Role Prevention
- **Added extra validation** in `scripts/seed-roles.js` to prevent creation of duplicate roles by checking both `name` and `slug` before inserting.
- **Added similar validation** in `/api/auth/init/route.js` to ensure Super Admin role is not duplicated during admin initialization.

## 3. Super Admin Assignment & JWT Consistency
- **Ensured all Super Admin logic checks for the correct slug:**
  - All code now checks for `slug: 'super-admin'` (not `super_admin` or other variants).
- **Updated admin user** (`sk@horizonafrica.com`) to reference the correct Super Admin role ObjectId in MongoDB:
  - Used a direct MongoDB update command to set the `role` field to the correct ObjectId.
- **Verified JWT and /api/auth/me** endpoint include the correct role slug and permissions for the logged-in admin.

## 4. Codebase Improvements
- **AdminSidebar.js:**
  - Sidebar links for Users/Roles are now only visible to Super Admins (checked by `admin.role.slug === 'super-admin'`).
- **users/page.js:**
  - User management page now fetches roles and users dynamically, and displays correct role names and permissions.
  - Handles access denied errors and redirects non-super-admins appropriately.
- **lib/auth.js:**
  - `isSuperAdmin` and related logic now only check for the correct slug.
  - All RBAC checks are consistent and robust.

## 5. Troubleshooting & Testing
- **Tested login and dashboard access** with Super Admin credentials (`sk@horizonafrica.com`).
- **Verified** that Users and Roles management features are only accessible to Super Admins.
- **Tested** that duplicate key errors no longer occur during seeding or admin creation.
- **Documented** all steps and provided clear MongoDB commands for future maintenance.

---

## Key MongoDB Commands Used
```js
// Clear all admins and roles
use aib-axys
db.admins.deleteMany({})
db.roles.deleteMany({})

// Seed roles
node scripts/seed-roles.js

// Assign Super Admin role to a user
var superAdmin = db.roles.findOne({slug:'super-admin'})
db.admins.updateOne({email:'sk@horizonafrica.com'}, { $set: { role: superAdmin._id } })
```

---

## Result
- The RBAC system is now clean, deduplicated, and secure.
- Super Admin access and user/role management are fully functional.
- All changes are documented for audit and future reference.

---

**Prepared by:** Daniel IT Officer
**Date:** February 19, 2026
