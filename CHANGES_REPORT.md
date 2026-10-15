# AIB-AXYS – Changes Report

Summary of changes made to fix admin access, user management, audit logging, and production database validation.

---

## 1. Admin Access: Users & Roles in Sidebar + “Access denied” Fix

**Problem:** Users and Roles did not appear in the admin sidebar for Super Admins, and visiting `/admin/users` showed “Access denied. Super admin only.” The database Super Admin role uses slug `super_admin` (underscore) while the code only checked for `super-admin` (dash).

### 1.1 `lib/auth.js`
- **Updated `isSuperAdmin(adminData)`** so Super Admin is recognised regardless of slug format:
  - Normalises slug (e.g. `super_admin` → `super-admin`) and treats both as Super Admin.
  - Also accepts role by name: `roleName === 'Super Admin'`.
- Ensures APIs that use `requireSuperAdmin(request)` (e.g. `/api/admin/users`) allow the correct users.

### 1.2 `components/AdminSidebar.js`
- **Added local `isSuperAdmin(admin)` helper** using the same slug/name logic.
- **Adjusted nav link filtering:** “Users” and “Roles” are shown only when `isSuperAdmin(admin)` is true.
- Result: Super Admins see Users and Roles in the sidebar; non–Super Admins do not.

### 1.3 `app/admin/users/page.js`
- **Added helpers:** `isSuperAdminRole(role)` (for role badge) and `isCurrentSuperAdmin()` (for current user).
- **Replaced all hard-coded `'super-admin'` checks** with these helpers so both `super_admin` and `super-admin` (and “Super Admin” by name) are handled.
- **Fixed user ID usage:** Introduced `userId = user.id || user._id` and used it for:
  - Table row key, status toggle, change-password modal, delete button, and “You” / self-checks.
- Result: Role badges and action visibility (delete, toggle status) are correct, and the page no longer shows “Access denied” for valid Super Admins.

---

## 2. User Delete: “Failed to delete user”

**Problem:** Deleting a user in the admin panel showed “Failed to delete user”. The API returns users with field `id` (not `_id`), but the UI used `user._id`, so the request was sent as `?id=undefined` and the backend could not find the user.

### 2.1 `app/admin/users/page.js`
- **Consistent user identifier:** Each row uses `const userId = user.id || user._id` and passes `userId` to:
  - `handleDeleteUser(userId, user.email)`
  - `toggleUserStatus(userId, user.isActive)`
  - `setShowPasswordForm(userId)` and `handleChangePassword(e, showPasswordForm)`
  - Comparisons with `currentAdmin?.id` for “You” and delete/toggle visibility.
- Result: Delete, status toggle, and change-password actions use a valid ID; delete works in production and locally.

---

## 3. Audit Log: Research Paper Deletion

**Problem:** Deleting a research paper triggered “Audit logging failed: ValidationError” because:
- `AuditLog` requires `adminId` but it was not set.
- Action value `RESEARCH_PAPER_DELETED` is not in the `AuditLog` schema enum (valid value is `research_delete`).

### 3.1 `app/api/admin/research/route.js` (DELETE handler)
- **Audit log payload updated:**
  - Set **`adminId`**: `adminData.id || adminData._id`.
  - Set **`action`**: `'research_delete'` (valid enum value).
  - Added **`resourceType`**: `'research_paper'`, **`resourceId`**: paper `id`.
  - Replaced invalid **`timestamp`** in `details` with standard schema fields; added **`userAgent`** from request headers.
- Result: Research paper deletion is recorded in `AuditLog` without validation errors.

---

## 4. Production: MongoDB Document Validation (Research Upload, Document Upload & Create User)

**Problem:** In production, research paper upload, document upload, and admin user creation failed with `MongoServerError: Document failed validation (code 121)`. Local DB had no collection validators (`options: {}`); production had (or needed) validators that did not match the current Mongoose schemas.

### 4.1 New script: `scripts/apply-mongodb-validators.js`
- **Purpose:** Apply MongoDB collection validators so they match the Mongoose models and inserts succeed in production.
- **Collections and rules:**
  - **`researchpapers`:** Required fields `title`, `fileName`, `fileUrl`; `category` enum aligned with `models/ResearchPaper.js`; optional fields for description, company, sector, fileSize, publishedDate, isPublished, tags, downloadCount; `additionalProperties: true` for timestamps etc.
  - **`documents`:** Required fields `title`, `category`, `fileName`, `fileUrl`; `category` enum aligned with `models/Document.js` (terms-and-conditions, audited-financial-reports, unaudited-financial-reports, application-forms, press-releases, news, fees-and-tariffs, compliance-documents, other); optional fields for description, fileSize, fileType, isPublished, publishedDate, downloadCount, uploadedBy; `additionalProperties: true`.
  - **`admins`:** Required fields `email`, `password`, `role` (ObjectId); optional `name`, `isActive`; `additionalProperties: true`.
- **Validation level:** `moderate` (only new writes are validated).
- Script can be run with:  
  `MONGODB_URI="..." npm run db:apply-validators`  
  or by running the equivalent `collMod` commands in mongosh (documented in the script header).

### 4.2 `package.json`
- **New script:** `"db:apply-validators": "node scripts/apply-mongodb-validators.js"` for applying validators against the database specified in `MONGODB_URI`.

---

## 5. Files Touched (Summary)

| File | Change |
|------|--------|
| `lib/auth.js` | `isSuperAdmin()` supports `super_admin` / `super-admin` and “Super Admin” by name. |
| `components/AdminSidebar.js` | Local `isSuperAdmin()`, filter so Users/Roles show only for Super Admins. |
| `app/admin/users/page.js` | Super Admin helpers, `userId = user.id \|\| user._id` everywhere, correct delete/toggle/password/“You” logic. |
| `app/api/admin/research/route.js` | Audit log: `adminId`, `action: 'research_delete'`, resourceType/resourceId/userAgent. |
| `scripts/apply-mongodb-validators.js` | New: apply validators for `researchpapers`, `documents`, and `admins`. |
| `package.json` | New script: `db:apply-validators`. |

---

## 6. Outcome

- Super Admins see **Users** and **Roles** in the sidebar and can access user management without “Access denied.”
- **User delete**, status toggle, and change password work with correct user IDs.
- **Research paper deletion** is audit-logged without validation errors.
- **Production** can use MongoDB validators aligned with the app; running the validator script (or equivalent `collMod` commands) fixes “Document failed validation” for research uploads and user creation.

---

*Report generated for AIB-AXYS project.*
