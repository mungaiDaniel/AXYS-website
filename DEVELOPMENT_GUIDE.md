# AIB-AXYS Africa — Development Guide

**Date:** February 24, 2026
**Version:** 1.0
**Stack:** Next.js 16.1 (App Router) · React 19 · MongoDB 6.6 · Mongoose 9.1 · Tailwind CSS 3.4 · Shadcn/Radix UI

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture & Directory Structure](#2-architecture--directory-structure)
3. [Environment Setup](#3-environment-setup)
4. [Development Workflow](#4-development-workflow)
5. [Authentication & RBAC System](#5-authentication--rbac-system)
6. [Audit Logging System](#6-audit-logging-system)
7. [Database Schema & Validators](#7-database-schema--validators)
8. [API Reference](#8-api-reference)
9. [Component Architecture](#9-component-architecture)
10. [File Upload & Storage](#10-file-upload--storage)
11. [Completed Changes Log](#11-completed-changes-log)
12. [Deployment Guide](#12-deployment-guide)
13. [Outstanding Tasks](#13-outstanding-tasks)
14. [Troubleshooting](#14-troubleshooting)

---

## 1. Project Overview

AIB-AXYS Africa is a production financial services website for a licensed Kenyan stockbrokerage firm. It serves two audiences:

| Layer | Purpose |
|---|---|
| **Public Site** (17 pages) | Marketing, research downloads, exchange rates, fund account instructions, IPO applications |
| **Admin Panel** (13 pages) | Contact management, research/document CRUD, exchange rates, user management, GDPR |

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.1 (App Router, React 19) |
| Styling | Tailwind CSS 3.4 + Shadcn/Radix UI (48 components) |
| Animations | Framer Motion 11 |
| Database | MongoDB 6.6 via Mongoose 9.1 |
| Auth | Custom JWT + bcrypt (HTTP-only cookies) |
| Email | Nodemailer 7.0 (SMTP configurable) |
| File Handling | Multer (uploads), XLSX (exports) |
| Deployment | Standalone Node.js server (SSH to `aib-axysafrica.com`) |

---

## 2. Architecture & Directory Structure

```
AIB-AXYS/
├── app/                          # Next.js App Router
│   ├── layout.js                 # Root layout (Inter font, dark mode script)
│   ├── page.js                   # Homepage
│   ├── globals.css               # Global styles
│   ├── [page-routes]/            # Public pages (about, contact, research, etc.)
│   ├── admin/                    # Admin panel routes
│   │   ├── layout.js             # Admin layout (sidebar + navbar wrapper)
│   │   ├── dashboard/page.js     # Dashboard stats
│   │   ├── contacts/page.js      # Contact management
│   │   ├── research/page.js      # Research paper CRUD
│   │   ├── documents/page.js     # Document CRUD
│   │   ├── exchange-rates/page.js# FX rate management
│   │   ├── users/page.js         # User management (super-admin only)
│   │   ├── settings/             # System settings + roles
│   │   └── [other admin pages]/
│   └── api/                      # API routes
│       ├── auth/                 # Login/logout/init/me
│       ├── admin/                # Protected admin CRUD (JWT required)
│       └── [public endpoints]/   # Contact, research, documents, exchange-rates, GDPR
│
├── components/                   # Shared React components
│   ├── Navbar.js                 # Public navbar (18KB, complex dropdowns)
│   ├── AdminSidebar.js           # Admin sidebar with RBAC filtering
│   ├── AdminNavbar.js            # Admin top navbar
│   ├── RouteGuard.js             # Auth route protection
│   ├── PageAccessGuard.js        # Page visibility guard
│   └── ui/                       # 48 Shadcn UI primitives
│
├── models/                       # Mongoose models (14 models)
│   ├── Admin.js                  # Admin accounts
│   ├── Contact.js                # Contact form submissions
│   ├── Document.js               # Business/compliance documents
│   ├── ResearchPaper.js          # Research papers
│   ├── ExchangeRate.js           # FX rates
│   ├── AuditLog.js               # Audit trail
│   ├── Role.js                   # RBAC roles
│   └── [others]                  # Consent, EmailVerificationToken, GlobalFund, etc.
│
├── lib/                          # Shared utilities
│   ├── auth.js                   # JWT generation/verification, isSuperAdmin()
│   ├── mongodb.js                # DB connection with pooling
│   ├── permissions.js            # RBAC permission checks
│   ├── security.js               # Rate limiting, input sanitization
│   ├── audit.js                  # Audit log helpers
│   ├── email.js                  # Email sending (Nodemailer)
│   └── utils.js                  # General utilities
│
├── hooks/                        # Custom React hooks
│   ├── use-mobile.jsx            # Mobile detection
│   ├── use-toast.js              # Toast notifications
│   └── useCountdown.js           # Countdown timer
│
├── contexts/                     # React contexts
│   └── ThemeContext.js            # Dark/light mode
│
├── data/                         # Static data
│   ├── nseCompanies.js           # NSE listed companies
│   └── teamData.js               # Team member data
│
├── config/
│   └── content.json              # Site content configuration
│
├── scripts/                      # DevOps & maintenance scripts
│   ├── apply-mongodb-validators.js  # DB validator alignment
│   ├── deploy.sh                    # Automated deployment
│   ├── health-check.sh              # System health monitoring
│   └── [others]
│
└── public/                       # Static assets, uploaded files
    ├── research/                 # Uploaded research PDFs
    └── documents/                # Uploaded business documents
```

### Key Conventions

- **File-based routing** via Next.js App Router (`app/` directory)
- **`'use client'`** directive on interactive components; server components by default
- **API routes** in `app/api/` using `export async function GET/POST/PATCH/DELETE`
- **Dynamic rendering** forced on admin routes via `export const dynamic = 'force-dynamic'`
- **Imports** use `@/` alias (configured in `jsconfig.json`) mapping to project root

---

## 3. Environment Setup

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** 6.x (local or remote)
- **Yarn** 1.22+ (project uses yarn as package manager)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd AIB-AXYS

# Install dependencies
yarn install

# Copy environment variables
cp .env.example .env
# Edit .env with your local values
```

### Required Environment Variables

```env
# Database
MONGO_URL=mongodb://localhost:27017/aib-axys
DB_NAME=aib-axys

# Auth
JWT_SECRET=<64-byte-random-hex>

# Application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
CORS_ORIGINS=*

# Email (optional for dev - mocked when not set)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
CONTACT_EMAIL_DEFAULT=info@axysinvestmentbank.com
CONTACT_EMAIL_GENERAL=feedback@aib-axysafrica.com
```

### Running Locally

```bash
# Development server (with memory limit for stability)
yarn dev

# Production build
yarn build

# Start production server
yarn start

# Apply MongoDB validators (run once per database)
yarn db:apply-validators

# Run tests
yarn test
```

---

## 4. Development Workflow

### Branch Strategy

1. Make changes on a feature/fix branch
2. Test locally with `yarn dev`
3. Verify build succeeds with `yarn build`
4. Commit and push for review

### Code Style

- **Linting:** ESLint with `next/core-web-vitals` config
- **Formatting:** Prettier (run with `yarn format`)
- **Pre-commit hooks:** Husky + lint-staged (auto-formats staged files)

### Testing

```bash
yarn test              # Run tests once
yarn test:watch        # Watch mode
yarn test:coverage     # With coverage report
```

---

## 5. Authentication & RBAC System

### How Authentication Works

1. Admin submits email + password to `POST /api/auth/login`
2. Server validates credentials, generates JWT token
3. Token stored in HTTP-only cookie (`admin-token`, 7-day expiry)
4. Subsequent requests verified via `verifyAdminRequest()` in `lib/auth.js`

### Role-Based Access Control

The system uses two roles stored in the `roles` MongoDB collection:

| Role | Slug (DB) | Access Level |
|---|---|---|
| **Super Admin** | `super_admin` | Full access including user management |
| **Admin** | `admin` | Standard admin access (no user/role management) |

### The Slug Normalization Pattern

> **IMPORTANT:** The database stores role slugs with underscores (`super_admin`), but code historically used hyphens (`super-admin`). This mismatch was fixed using a normalization approach.

The `isSuperAdmin()` function (in `lib/auth.js`) normalizes slugs before comparison:

```javascript
// lib/auth.js — isSuperAdmin()
const normalizedSlug = rawSlug
  ? rawSlug.toLowerCase().replace(/[_\s]+/g, '-')
  : null;

if (normalizedSlug === 'super-admin') {
  return true;
}
```

This same pattern is replicated in:

| File | Function | Purpose |
|---|---|---|
| `lib/auth.js` | `isSuperAdmin(adminData)` | Server-side role check |
| `components/AdminSidebar.js` | `isSuperAdmin(adminData)` | Client-side nav filtering |
| `components/AdminSidebar.js` | `hasAdminOrAboveAccess(adminData)` | Admin-or-higher check |
| `app/admin/users/page.js` | `isSuperAdminRole(role)` | Role object check |
| `app/admin/users/page.js` | `isCurrentSuperAdmin()` | Current user check |

When adding new role-dependent features, **always use this normalization pattern** rather than directly comparing slug strings.

### Admin Sidebar Conditional Rendering

The sidebar filters menu items based on role:

```javascript
// components/AdminSidebar.js
const navLinks = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard /> },
  // ... standard items visible to all admins ...
  { name: 'Page Visibility', href: '/admin/pages', icon: <Eye />, adminOrAbove: true },
  { name: 'Users', href: '/admin/users', icon: <User />, superAdminOnly: true },
  { name: 'Roles', href: '/admin/settings/roles', icon: <Shield />, superAdminOnly: true },
  // ...
];

// Filtered during render:
navLinks.filter(link => {
  if (link.superAdminOnly) return isSuperAdmin(admin);
  if (link.adminOrAbove) return hasAdminOrAboveAccess(admin);
  return true;
});
```

### User ID Handling Convention

> **IMPORTANT:** MongoDB returns `_id`, but Mongoose `toJSON()` adds `id` as a virtual. The API response may contain either or both.

**Always use this pattern** when referencing a user/document ID:

```javascript
const userId = user.id || user._id;
```

This is applied consistently in `app/admin/users/page.js` for:
- `handleDeleteUser()`
- `toggleUserStatus()`
- `handleChangePassword()`

---

## 6. Audit Logging System

### Overview

All destructive or sensitive operations are logged to the `auditlogs` collection via the `AuditLog` model.

### Allowed Actions (Enum)

The following actions are defined in `models/AuditLog.js`:

```
login, logout,
contact_view, contact_update, contact_delete, contact_export,
research_upload, research_edit, research_delete,
documents_upload, documents_edit, documents_delete,
global_funds_create, global_funds_update, global_funds_delete,
ipo_settings_update, page_visibility_update, email_settings_update,
user_create, user_update, user_delete,
exchange_rate_update
```

### How to Create an Audit Log Entry

When adding new auditable operations, follow this pattern:

```javascript
try {
  const AuditLog = (await import('@/models/AuditLog')).default;
  await AuditLog.create({
    adminId: adminData.id || adminData._id,     // Required: ObjectId
    adminEmail: adminData.email,                  // Required: String
    action: 'research_delete',                    // Required: Must be in enum
    resourceType: 'research_paper',               // Optional: Resource category
    resourceId: id,                               // Optional: Resource ID
    details: {                                    // Optional: Additional context
      title: paper.title,
      category: paper.category,
    },
    ipAddress:
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown',
    userAgent: request.headers.get('user-agent') || '',
  });
} catch (auditError) {
  console.error('Audit logging failed:', auditError);
  // Never fail the main operation if audit logging fails
}
```

### Key Rules

1. **`adminId` is required** — always include `adminData.id || adminData._id`
2. **`action` must match the enum** — if you need a new action, add it to `models/AuditLog.js`
3. **Wrap in try/catch** — audit failures should never block the main operation
4. **Use dynamic import** — `const AuditLog = (await import('@/models/AuditLog')).default`

---

## 7. Database Schema & Validators

### MongoDB Collections (10)

| Collection | Model File | Key Fields |
|---|---|---|
| `admins` | `models/Admin.js` | email, password (bcrypt), role (ObjectId → roles), isActive |
| `contacts` | `models/Contact.js` | name, email, phone, subject, message, status, hasCDSC |
| `researchpapers` | `models/ResearchPaper.js` | title, category (enum), fileName, fileUrl, downloadCount |
| `documents` | `models/Document.js` | title, category (enum), fileName, fileUrl, fileType, downloadCount |
| `exchangerates` | `models/ExchangeRate.js` | currency, buyRate, sellRate, expiryDate, showOnPublic |
| `auditlogs` | `models/AuditLog.js` | adminId, adminEmail, action (enum), details, ipAddress |
| `consents` | `models/Consent.js` | email, consentType, consentGiven, consentDate |
| `emailverificationtokens` | `models/EmailVerificationToken.js` | email, token, purpose, used, expiresAt (TTL) |
| `iposettings` | `models/IPOSettings.js` | endDate, externalLink, isActive |
| `pagesettings` | `models/PageSettings.js` | pageName, showInNav, isPublished, order |
| `roles` | `models/Role.js` | name, slug, permissions[], isSystem |
| `globalfunds` | `models/GlobalFund.js` | fundName, description, performance, documents[], isVisible |

### MongoDB Validator Alignment Script

Production databases may have stricter validators than the Mongoose schemas expect. The script `scripts/apply-mongodb-validators.js` re-aligns them.

```bash
# Apply validators to current database
yarn db:apply-validators
```

**What it does:**
- Sets `validationLevel: 'moderate'` (only validates on inserts and updates to validated fields)
- Sets `validationAction: 'error'` (rejects invalid documents)
- Aligns validators for: `researchpapers`, `admins`, `documents`, `globalfunds`
- Uses `additionalProperties: true` to allow Mongoose-managed fields (`__v`, timestamps, etc.)

**When to run:**
- After creating a new MongoDB database
- After changing a Mongoose model's required fields or enum values
- When encountering `MongoServerError: Document failed validation` (error code 121)

---

## 8. API Reference

### Public Endpoints (No Auth Required)

| Method | Endpoint | Purpose | Rate Limit |
|---|---|---|---|
| `GET` | `/api/page-visibility` | Page settings | — |
| `GET` | `/api/research` | Published research (with `?category=`) | — |
| `GET` | `/api/research/download?id=` | Track download + serve file | 10/min |
| `GET` | `/api/documents` | Published documents (with `?category=`) | — |
| `GET` | `/api/documents/download?id=` | Download file + track count | 20/min |
| `GET` | `/api/exchange-rates` | Live FX rates (filtered by `showOnPublic`) | — |
| `POST` | `/api/contact` | Submit contact form | 5/min |
| `POST` | `/api/gdpr/user-data` | Request GDPR data access | 3/hr |
| `GET` | `/api/gdpr/user-data?token=` | Get user data (verified) | — |
| `DELETE` | `/api/gdpr/user-data?token=` | Delete user data (verified) | — |
| `GET` | `/api/health` | Health check | — |

### Authentication Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/auth/login` | Login (rate limited: 5/5min) |
| `POST` | `/api/auth/logout` | Logout (clears cookie) |
| `GET` | `/api/auth/me` | Get current admin info |
| `POST` | `/api/auth/init` | Create first admin (one-time) |

### Protected Admin Endpoints (JWT Required)

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/admin/dashboard` | Dashboard stats |
| `GET/PATCH/DELETE` | `/api/admin/contacts` | Contact CRUD (audit logged) |
| `GET/POST/PATCH/DELETE` | `/api/admin/research` | Research CRUD (audit logged) |
| `GET/POST/PATCH/DELETE` | `/api/admin/documents` | Document CRUD (audit logged) |
| `GET/POST` | `/api/admin/exchange-rates` | FX rate management (audit logged) |
| `GET/POST/DELETE/PATCH` | `/api/admin/users` | User management (super-admin only) |
| `GET/POST` | `/api/admin/ipo-settings` | IPO config |
| `GET/POST` | `/api/admin/page-settings` | Page visibility |
| `GET/POST` | `/api/admin/email-settings` | Email config |
| `GET` | `/api/admin/audit-logs` | View audit trail |

### API Route Pattern

Every admin API route follows this structure:

```javascript
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { verifyAdminRequest } from '@/lib/auth';

export async function GET(request) {
  try {
    // 1. Authenticate
    const adminData = verifyAdminRequest(request);
    if (!adminData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Connect to DB
    await connectDB();

    // 3. Business logic
    // ...

    // 4. Audit log (for destructive operations)
    // ...

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
```

---

## 9. Component Architecture

### Public Site Components

| Component | File | Purpose |
|---|---|---|
| Navbar | `components/Navbar.js` | Main navigation (dropdowns, mobile menu, theme toggle) |
| Footer | `components/Footer.js` | Site footer |
| ClientLayout | `components/ClientLayout.js` | Wraps pages with navbar + footer |
| GlassCard | `components/GlassCard.js` | Reusable glassmorphism card |
| LazyImage | `components/LazyImage.js` | Lazy-loaded images |
| SwipeNavigation | `components/SwipeNavigation.js` | Mobile touch gestures |
| CookieConsentBanner | `components/CookieConsentBanner.js` | GDPR cookie banner |

### Admin Components

| Component | File | Purpose |
|---|---|---|
| AdminLayout | `components/AdminLayout.js` | Admin page wrapper |
| AdminSidebar | `components/AdminSidebar.js` | Sidebar navigation with RBAC filtering |
| AdminNavbar | `components/AdminNavbar.js` | Admin top bar |
| RouteGuard | `components/RouteGuard.js` | Auth verification on admin routes |
| PageAccessGuard | `components/PageAccessGuard.js` | Page visibility enforcement |

### Design System

- **Visual style:** Glassmorphism (frosted glass)
- **Font:** Inter (Google Fonts)
- **Colors:** Primary Blue `#0017bf` → `#0014a8`, Cyan highlights, Green (buy/success), Red (warnings)
- **Patterns:** `backdrop-blur-md`, `bg-white/60`, `shadow-lg`, `rounded-lg`
- **Dark mode:** Full support via `ThemeContext` + `next-themes` + inline script in `layout.js`

---

## 10. File Upload & Storage

### Storage Location

Files are stored on the **local filesystem** under `public/`:

```
public/
├── research/     # Research paper PDFs
│   └── {timestamp}-{sanitized-name}.pdf
└── documents/    # Business documents (PDF, Word, Excel)
    └── {timestamp}-{sanitized-name}.{ext}
```

### Upload Flow (Research Papers)

1. Admin uploads via `POST /api/admin/research` (FormData)
2. File type validated (PDF only for research)
3. Unique filename generated: `{Date.now()}-{sanitized-original-name}`
4. File saved to `public/research/`
5. Database record created with `fileUrl: /research/{filename}`
6. Audit logged

### Upload Flow (Documents)

1. Admin uploads via `POST /api/admin/documents` (FormData)
2. File type validated (PDF, Word, Excel — max 50MB)
3. File saved to `public/documents/`
4. Database record created
5. Audit logged

### Download Flow (Documents)

The `GET /api/documents/download?id=` endpoint:
1. Rate-limits by IP (20/min)
2. Looks up document in database
3. Tries multiple file paths (for deployment compatibility)
4. Streams file with `Content-Disposition: attachment`
5. Increments `downloadCount` in the database

---

## 11. Completed Changes Log

### 11.1 RBAC & Super Admin Access

| Problem | Super Admins couldn't see Users/Roles menu items |
|---|---|
| Root Cause | DB stores `super_admin` (underscore), code checked `super-admin` (hyphen) |
| Fix | Added slug normalization in `isSuperAdmin()` via `.replace(/[_\s]+/g, '-')` |

**Files changed:**
- `lib/auth.js` — Enhanced `isSuperAdmin()` with slug normalization
- `components/AdminSidebar.js` — Added local `isSuperAdmin()` + `hasAdminOrAboveAccess()` helpers
- `app/admin/users/page.js` — Added `isSuperAdminRole()` and `isCurrentSuperAdmin()` helpers

---

### 11.2 User Management — Delete, Status Toggle, Password Change

| Problem | User actions failed due to `user._id` vs `user.id` mismatch |
|---|---|
| Fix | Standardized all user references to `const userId = user.id \|\| user._id` |

**File changed:** `app/admin/users/page.js`
**Functions fixed:** `handleDeleteUser()`, `toggleUserStatus()`, `handleChangePassword()`

---

### 11.3 Audit Logging — Research Paper Deletion

| Problem | `ValidationError` on delete — missing `adminId`, invalid action string |
|---|---|
| Fix | Added `adminId`, changed action to `'research_delete'`, added `resourceType`/`resourceId` |

**File changed:** `app/api/admin/research/route.js` — `DELETE` handler

---

### 11.4 Audit Logging — Document Deletion

| Problem | Same issue as research — missing `adminId`, invalid action `'DOCUMENT_DELETED'` |
|---|---|
| Fix | Added `adminId`, changed action to `'documents_delete'`, added resource details |

**Files changed:**
- `app/api/admin/documents/route.js` — `DELETE` handler
- `models/AuditLog.js` — Added `'documents_delete'` (and related actions) to enum

---

### 11.5 MongoDB Validation Errors

| Problem | Uploads/user creation failed in production with code 121 validation errors |
|---|---|
| Fix | Created validator alignment script |

**Files created/changed:**
- `scripts/apply-mongodb-validators.js` — Applies aligned validators to 4 collections
- `package.json` — Added `"db:apply-validators"` script

---

### 11.6 Document Download Functionality

| Problem | Documents weren't downloadable, no download tracking |
|---|---|
| Fix | Created download API with `Content-Disposition: attachment` and `downloadCount` increment |

**Files created/changed:**
- `app/api/documents/download/route.js` — Serves files with tracking
- `app/downloads/page.js` — Updated links to use new API

---

### 11.7 Contact Management Enhancements

| Problem | Admin contacts page lacked delete functionality and subject filtering |
|---|---|
| Fix | Added delete button, confirmation, subject filter dropdown, and audit logging |

**Files changed:**
- `app/admin/contacts/page.js` — Added delete UI and subject filter
- `app/api/admin/contacts/route.js` — Added `DELETE` endpoint with audit logging

---

## 12. Deployment Guide

### Pre-Deployment Checklist

- [ ] All changes tested locally with `yarn dev`
- [ ] Build succeeds: `yarn build`
- [ ] No console errors in browser
- [ ] Admin login, user CRUD, research upload, document download all verified

### Deployment Steps

```bash
# 1. Upload files (exclude .next, node_modules)
#    Use SFTP/SCP to server: aib-axysafrica.com

# 2. SSH into server
ssh aib-axysafrica@aib-axysafrica.com

# 3. Navigate to site directory
cd ~/site

# 4. Install dependencies (if package.json changed)
npm install

# 5. Apply database validators (one-time per DB change)
npm run db:apply-validators

# 6. Build the application
npm run build

# 7. Stop current process
ss -tulnp | grep :3000
kill <pid>

# 8. Start new process
nohup npm run start &

# 9. Verify deployment
curl http://localhost:3000/api/health
```

### Post-Deployment Verification

1. **Admin login** — Verify JWT cookie is set
2. **User creation** — Create and delete a test user
3. **Research upload** — Upload a test PDF, verify it appears on `/research`
4. **Document download** — Download a document, check `downloadCount` incremented
5. **Contact management** — Submit a contact form, verify admin can view/delete it
6. **Exchange rates** — Update a rate, verify public page reflects the change

### Maintenance Scripts

| Script | Command | Purpose |
|---|---|---|
| Health Check | `bash scripts/health-check.sh` | Check Next.js, MongoDB, disk, memory |
| Deploy | `bash scripts/deploy.sh` | Automated backup + deploy |
| Restart | `bash scripts/restart-services.sh` | Quick service restart |
| View Logs | `bash scripts/view-logs.sh` | Log viewer (standard/error/live) |

---

## 13. Outstanding Tasks

| # | Task | Description | Priority |
|---|---|---|---|
| 1 | **Multi-Currency Page Layout** | Align `/fund-account/multi-currency` with approved design specs (card layout, typography, countdown timers) | 🔴 High |
| 2 | **Mobile Swipe Navigation** | Fix swipe navigation issues on mobile devices to ensure smooth touch interactions | 🔴 High |
| 3 | **Global Funds Dynamic Data** | Replace hardcoded global funds with database-driven content; add admin CRUD interface | 🟡 Medium |

---

## 14. Troubleshooting

### Common Issues

**"Document failed validation" (MongoServerError code 121)**
- MongoDB collection validators are out of sync with Mongoose schemas
- Fix: `yarn db:apply-validators`

**Super Admin can't see Users/Roles menu**
- Role slug mismatch between database and code
- Verify `isSuperAdmin()` normalization is applied in both `lib/auth.js` and `AdminSidebar.js`

**User delete/toggle/password change fails**
- User ID mismatch (`_id` vs `id`)
- Ensure all references use `const userId = user.id || user._id`

**Audit log creation fails with ValidationError**
- The `action` value is not in the `AuditLog` model's enum
- Add the new action to the enum in `models/AuditLog.js`
- Ensure `adminId` is provided: `adminData.id || adminData._id`

**File upload succeeds but download returns 404**
- File wasn't copied to `.next/standalone/public/` during build
- Run `node scripts/copy-public.js` or rebuild with `yarn build`

**Rate limiting resets on server restart**
- Rate limiting uses in-memory counters in `lib/security.js`
- This is by design; consider Redis-backed rate limiting for multi-instance deployments

---

*Last updated: February 24, 2026*
