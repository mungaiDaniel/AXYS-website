# RBAC Debugging - Code Change Reference

This document shows the exact code changes made to resolve Super Admin access, user/role management, and duplicate role errors. Each section includes the old code (before) and the new code (after), with explanations in plain language for non-developers.

---

## 1. Preventing Duplicate Roles in Seeder Script

**File:** `scripts/seed-roles.js`

**Before:**
```js
const existingRole = await mongoose.connection.collection('roles').findOne({ slug: roleData.slug });
```

**After:**
```js
const existingRole = await mongoose.connection.collection('roles').findOne({
  $or: [
    { slug: roleData.slug },
    { name: roleData.name },
  ],
});
```

**Explanation:**
Now checks for both the role's name and slug to prevent duplicates.

---

## 2. Preventing Duplicate Super Admin Role on Admin Creation

**File:** `app/api/auth/init/route.js`

**Before:**
```js
let superAdminRole = await Role.findOne({ slug: 'super-admin' });
if (!superAdminRole) {
  superAdminRole = await Role.create({ ... });
}
```

**After:**
```js
let superAdminRole = await Role.findOne({ $or: [ { slug: 'super-admin' }, { name: 'Super Admin' } ] });
if (!superAdminRole) {
  const duplicate = await Role.findOne({ $or: [ { slug: 'super-admin' }, { name: 'Super Admin' } ] });
  if (duplicate) {
    superAdminRole = duplicate;
  } else {
    try {
      superAdminRole = await Role.create({ ... });
    } catch (err) {
      if (err.code === 11000) {
        superAdminRole = await Role.findOne({ $or: [ { slug: 'super-admin' }, { name: 'Super Admin' } ] });
      } else {
        throw err;
      }
    }
  }
}
```

**Explanation:**
Now checks for both name and slug, and handles duplicate errors gracefully.

---

## 3. Super Admin Role Assignment (MongoDB Command)

**Before:**
Admin user may reference an incorrect or missing role ObjectId.

**After:**
```js
var superAdmin = db.roles.findOne({slug:'super-admin'})
db.admins.updateOne({email:'sk@horizonafrica.com'}, { $set: { role: superAdmin._id } })
```

**Explanation:**
Directly assigns the correct Super Admin role to the admin user.

---

## 4. Sidebar and Access Checks (AdminSidebar.js, lib/auth.js)

**Before:**
Checks for `super_admin` or inconsistent slug.

**After:**
Checks for `slug === 'super-admin'` everywhere.

**Example:**
```js
if (link.superAdminOnly) {
  return admin?.role?.slug === 'super-admin' || admin?.role === 'super-admin';
}
```

**Explanation:**
Ensures only Super Admins see Users/Roles links and have access.

---

## 5. User Management Page (users/page.js)

**Before:**
Role dropdown and user table may show duplicates or incorrect roles.

**After:**
```js
{Array.from(new Map(roles.map(role => [role.slug, role])).values()).map(role => (
  <option key={role._id} value={role._id}>{role.name}</option>
))}
```

**Explanation:**
Role dropdown is deduplicated and always shows correct role names.

---

## Result
- All code now checks for the correct Super Admin slug.
- Duplicate roles are prevented.
- Admin user is correctly assigned Super Admin role.
- Users/Roles management is visible and functional for Super Admins.

---

**Date:** February 19, 2026
