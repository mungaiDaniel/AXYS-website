# 🗺️ PROJECT HANDOVER MAP

**AIB-AXYS Africa - Complete Site Atlas**  
**Version:** 1.2.5.1  
**Framework:** Next.js 16.1.4 (App Router)  
**Last Updated:** January 29, 2026

> **For the Next Developer:** This document maps the entire codebase. Read this FIRST before touching any code.

---

## 📚 Table of Contents

1. [Project Configuration (Root)](#1--project-configuration-root)
2. [Application Layer (/app)](#2--application-layer-app)
3. [Component Library (/components)](#3--component-library-components)
4. [Data Layer (/models & /lib)](#4--data-layer-models--lib)
5. [Documentation & Scripts](#5--documentation--scripts)
6. [Critical Workflows](#6--critical-workflows)
7. [Database Schema Reference](#7--database-schema-reference)
8. [Environment Variables](#8--environment-variables)

---

## 1. 🏗️ Project Configuration (Root)

*Core files that control the entire application behavior.*

### Build & Framework
- **`next.config.js`** - Next.js configuration
  - Security headers (CSP, HSTS, X-Frame-Options)
  - Image optimization domains (Unsplash, Pexels, S3)
  - Webpack customizations
  - Environment variable exposure

- **`package.json`** - Dependency manifest
  - **Key Dependencies:**
    - `next@16.1.4` - Framework
    - `react@19.0.0` - UI library
    - `mongoose@9.11.2` - MongoDB ODM
    - `jsonwebtoken@9.0.2` - Authentication
    - `bcryptjs@2.4.3` - Password hashing
    - `nodemailer@6.9.17` - Email service
    - `recharts@2.15.0` - Data visualization
    - `lucide-react@0.468.0` - Icon library
  - **Scripts:**
    - `dev` - Development server
    - `build` - Production build
    - `start` - Production server
    - `lint` - ESLint check

- **`tailwind.config.js`** - Design system configuration
  - Color palette (brand-blue, custom dark theme)
  - Custom utilities and components
  - shadcn/ui integration
  - Dark mode setup

- **`.env`** - Environment secrets (**NEVER COMMIT**)
  - `MONGO_URL` - Database connection
  - `JWT_SECRET` - Auth token signing key
  - `NEXT_PUBLIC_BASE_URL` - Public domain
  - Email credentials (SMTP)

### Supporting Config
- **`jsconfig.json`** - Path aliases (`@/` → project root)
- **`postcss.config.js`** - CSS processing (Tailwind)
- **`components.json`** - shadcn/ui configuration

---

## 2. 📱 Application Layer (`/app`)

*Next.js App Router structure. All routes are file-based.*

### 🔐 Admin Portal (`/app/admin/`)

**Protected Area - Requires Authentication**

#### Layout & Auth
- **`layout.js`** - Admin shell
  - Wraps all admin pages with `AdminLayout`
  - Handles authentication checks
  - Sidebar navigation integration

- **`loading.js`** - Loading UI for admin transitions

- **`login/page.js`** - Admin login form
  - Email/password authentication
  - JWT token generation
  - Redirects to dashboard on success

#### Dashboard & Analytics
- **`dashboard/page.js`** - Main admin overview
  - Key metrics cards (Users, Research, Contacts, Exchange Rates)
  - Recent activities feed
  - Quick actions panel

- **`analytics/page.js`** - Advanced analytics
  - Page views tracking
  - User engagement metrics
  - Export to CSV functionality
  - Charts using Recharts

#### User & Role Management (RBAC)
- **`users/page.js`** - User CRUD interface
  - List all admin users
  - Add/Edit/Delete users
  - Role assignment dropdown
  - Password reset functionality

- **`settings/roles/page.js`** - Role & Permission management
  - Create custom roles
  - Assign granular permissions
  - System roles (Super Admin, Admin, Editor, Viewer)
  - Permission matrix display

#### Content Management
- **`research/page.js`** - Research paper uploads
  - PDF file upload (with file size limits)
  - Metadata editor (title, description, date)
  - Download/Delete controls
  - Public visibility toggle

- **`documents/page.js`** - General document management
  - Multi-format uploads
  - Category tagging
  - Searchable document library

- **`pages/page.js`** - Page visibility management
  - Toggle page visibility in navigation
  - Toggle page accessibility (block access)
  - "Show in Nav" vs "Accessible" controls
  - Home page protection (cannot be disabled)

#### Data Management
- **`exchange-rates/page.js`** - Currency rate management
  - Add/Edit exchange rates
  - Set expiry timers
  - Enable/Disable currencies
  - Real-time updates to public site

- **`global-funds/page.js`** - Global fund data
  - Fund performance tracking
  - Price updates
  - Historical data management

- **`contacts/page.js`** - Contact form submissions
  - View all contact inquiries
  - Export to CSV with pipe delimiter
  - Mark as resolved/unresolved
  - Email integration for responses

- **`ipo-settings/page.js`** - IPO configuration
  - Set IPO open/close dates
  - Configure offer details
  - Enable/Disable IPO features

#### Compliance & Privacy
- **`gdpr/page.js`** - GDPR data management
  - User data export requests
  - Data deletion (right to be forgotten)
  - Email verification for requests
  - Audit trail logging

### 🌍 Public Website (`/app/`)

**Accessible to all visitors**

#### Core Pages
- **`page.js`** - **Homepage**
  - Hero section with CTA
  - Live exchange rates display
  - Services overview
  - IPO highlights
  - Responsive design

- **`layout.js`** - Root layout
  - Wraps all pages with `ClientLayout`
  - Theme provider integration
  - Metadata configuration

- **`loading.js`** - Global loading state

#### Informational Pages
- **`about/page.js`** - Company information
  - Mission & vision
  - Team members with bios
  - Company history
  - Awards & certifications

- **`group/page.js`** - AXYS Group information
  - Group structure
  - Subsidiaries
  - Global presence

- **`services/page.js`** - Service offerings
  - Investment services
  - Trading platforms
  - Financial products
  - Pricing information

#### Trading & Investment
- **`platforms/page.js`** - Trading platform info
  - DigiTrader app showcase
  - Platform features
  - Download links (App Store, Google Play)
  - Platform comparison

- **`fund-account/`** - Funding options
  - **`local-stocks/page.js`** - NSE stock funding
  - **`multi-currency/page.js`** - Forex accounts
    - Live currency timers
    - Exchange rate cards
    - Account opening process
  - **`international-equities/page.js`** - Global stock access
  - **`offshore-funds/page.js`** - International funds

- **`leverage/page.js`** - IPO financing
  - Leverage terms & conditions
  - Application process
  - Interest rates

- **`ipo/page.js`** - IPO applications
  - Current IPO details (e.g., KPC IPO)
  - Application instructions
  - USSD codes and online portal links
  - FAQs specific to IPO

#### Market Data
- **`exchange-rates/page.js`** - **Live exchange rates** (Public)
  - Real-time currency data
  - Countdown timers ("Valid Until")
  - Currency conversion calculator
  - Fetches from `/api/exchange-rates`

- **`global-markets/page.js`** - International market data
  - Global fund performance
  - Market indices
  - Charts and graphs

- **`research/page.js`** - Research reports (Public)
  - Downloadable PDF reports
  - Stock recommendations
  - Market analysis
  - Requires filtering by visibility settings

#### Support & Legal
- **`faq/page.js`** - Frequently Asked Questions
  - Accordion UI
  - Categories: Account, Trading, Deposits, IPO
  - Search functionality

- **`contact/page.js`** - Contact form
  - Name, email, phone, message fields
  - Optional referral source
  - Submits to `/api/contact`
  - Success/Error notifications

- **`downloads/page.js`** - Downloadable resources
  - Forms & templates
  - App installers
  - Marketing materials

- **`terms/page.js`** - Terms & Conditions (Static)
- **`privacy/page.js`** - Privacy Policy (Static)

### 🔌 API Layer (`/app/api/`)

**Backend routes - All return JSON**

#### Authentication (`/api/auth/`)
- **`login/route.js`** (POST)
  - Validates email/password
  - Generates JWT with embedded permissions
  - Returns user object + token

- **`logout/route.js`** (POST)
  - Clears authentication cookies
  - Invalidates session

- **`me/route.js`** (GET)
  - Returns current user profile
  - Populates role and permissions
  - Used for session verification

- **`init/route.js`** (POST)
  - Bootstrap endpoint for first admin creation
  - Disabled in production

#### Admin CRUD Operations (`/api/admin/`)

**Protected - Requires JWT Token & Permissions**

- **`users/route.js`**
  - GET - List all users
  - POST - Create user
  - PUT - Update user
  - DELETE - Delete user
  - Permission: `manage_users`

- **`roles/route.js`**
  - GET - List all roles
  - POST - Create role
  - PUT - Update role permissions
  - DELETE - Delete role (except system roles)
  - Permission: `manage_roles`

- **`research/route.js`**
  - GET - List research papers
  - POST - Upload PDF (file handling)
  - PUT - Update metadata
  - DELETE - Remove paper
  - Permission: `manage_research`

- **`documents/route.js`**
  - Same CRUD pattern as research
  - Permission: `manage_documents`

- **`exchange-rates/route.js`**
  - GET - All rates with admin details
  - POST - Create new rate
  - PUT - Update rate
  - DELETE - Remove rate
  - Permission: `manage_exchange_rates`

- **`global-funds/route.js`**
  - Full CRUD for fund data
  - Permission: `manage_global_funds`

- **`contacts/route.js`**
  - GET - All contact submissions
  - PUT - Update status
  - DELETE - Remove contact
  - Permission: `view_contacts`

- **`ipo-settings/route.js`**
  - GET/PUT - IPO configuration
  - Permission: `manage_ipo_settings`

- **`page-settings/route.js`**
  - GET - All page visibility settings
  - PUT - Update page visibility/accessibility
  - Protection: Home page cannot be disabled

- **`page-settings/seed/route.js`**
  - POST - Initialize/reset all page settings
  - One-time setup route

- **`dashboard/route.js`**
  - GET - Dashboard statistics
  - Aggregates data from all models

- **`analytics/stats/route.js`**
  - GET - Analytics data for charts

- **`audit-logs/route.js`**
  - GET - System audit trail
  - Logs all admin actions

- **`email-settings/route.js`**
  - GET/PUT - Email configuration

#### Public API (`/api/`)

**No authentication required**

- **`exchange-rates/route.js`** (GET)
  - Returns only enabled, non-expired rates
  - Public-facing data

- **`page-visibility/route.js`** (GET)
  - Returns page visibility settings for nav filtering
  - Used by Navbar and Footer components

- **`research/route.js`** (GET)
  - Public research papers list
  - Filtered by visibility

- **`research/download/route.js`** (GET)
  - Download PDF by ID
  - File streaming

- **`documents/route.js`** (GET)
  - Public documents list

- **`documents/download/route.js`** (GET)
  - Document file streaming

- **`contact/route.js`** (POST)
  - Submit contact form
  - Email notification to admin
  - Saves to database

- **`gdpr/user-data/route.js`** (POST)
  - GDPR data request handler
  - Email verification required

- **`analytics/route.js`** (POST)
  - Log page view events
  - Used for analytics tracking

#### Catch-All Route
- **`[[...path]]/route.js`**
  - Legacy route handler
  - Returns 404 for unknown paths

---

## 3. 🧩 Component Library (`/components/`)

### Core UI (shadcn/ui) (`/components/ui/`)

*Pre-built, accessible components. DO NOT modify these directly.*

**Complete list:**
- `accordion.jsx` - Collapsible sections
- `alert.jsx`, `alert-dialog.jsx` - Notifications & modals
- `avatar.jsx` - User profile images
- `badge.jsx` - Status indicators
- `breadcrumb.jsx` - Navigation trail
- `button.jsx` - Primary interactive element
- `calendar.jsx` - Date picker
- `card.jsx` - Container component
- `carousel.jsx` - Image/content slider
- `chart.jsx` - Data visualization wrapper
- `checkbox.jsx`, `radio-group.jsx` - Form inputs
- `collapsible.jsx` - Expandable panels
- `command.jsx` - Command palette
- `context-menu.jsx`, `dropdown-menu.jsx`, `menubar.jsx` - Menu systems
- `dialog.jsx`, `sheet.jsx`, `drawer.jsx` - Modal variants
- `form.jsx` - Form wrapper with validation
- `hover-card.jsx` - Hover popups
- `input.jsx`, `textarea.jsx` - Text inputs
- `input-otp.jsx` - OTP input fields
- `label.jsx` - Form labels
- `navigation-menu.jsx` - Complex nav structures
- `pagination.jsx` - Page navigation
- `popover.jsx` - Floating content
- `progress.jsx` - Loading bars
- `resizable.jsx` - Resizable panels
- `scroll-area.jsx` - Custom scrollbars
- `select.jsx` - Dropdown selects
- `separator.jsx` - Dividers
- `sidebar.jsx` - Collapsible sidebar
- `skeleton.jsx` - Loading placeholders
- `slider.jsx` - Range inputs
- `sonner.jsx`, `toast.jsx`, `toaster.jsx` - Toast notifications
- `switch.jsx`, `toggle.jsx`, `toggle-group.jsx` - Toggle controls
- `table.jsx` - Data tables
- `tabs.jsx` - Tab navigation
- `tooltip.jsx` - Hover hints

### Feature Components (`/components/`)

#### Navigation & Layout
- **`Navbar.js`** - Main site navigation
  - Responsive with mobile menu
  - Dropdown menus (About, Platforms, Services, Fund Account)
  - Filters pages based on visibility settings
  - Dark mode toggle
  - Sticky positioning
  - Logo fade-in on scroll

- **`Footer.js`** - Site footer
  - Quick links (filtered by page visibility)
  - Services links
  - Contact information
  - Regulatory disclaimers
  - Dark mode support

- **`AdminSidebar.js`** - Admin navigation sidebar
  - Role-based link visibility
  - Collapsible menu
  - Active route highlighting
  - Permission checks for each link

- **`AdminNavbar.js`** - Admin top bar
  - User profile dropdown
  - Logout button
  - Current user display

- **`SwipeNavigation.js`** - Mobile gesture navigation
  - Swipe left/right between pages
  - Touch gesture detection
  - Page transition animations

#### Guards & Wrappers
- **`RouteGuard.js`** - Admin route protection
  - Checks JWT token
  - Redirects to login if unauthorized
  - Validates token expiry

- **`PageAccessGuard.js`** - **NEW** - Page visibility control
  - Checks if page is accessible
  - Shows "Page Not Available" for disabled pages
  - Fetches settings from `/api/page-visibility`
  - Always allows Home and Admin pages

- **`ClientLayout.js`** - Client-side layout wrapper
  - Theme provider
  - Navbar + Footer
  - Integrates all guards
  - Swipe navigation wrapper

- **`AdminLayout.js`** - Admin layout wrapper
  - Sidebar + Navbar
  - Admin-specific styling

#### UI Enhancements
- **`LoadingPage.js`** - Full-page loader
  - "Asymptotic" progress animation
  - Eases to 90% then waits
  - Custom easing function

- **`RouteLoadingWrapper.js`** - Route transition loader
  - Shows loading mask during page changes
  - Smooth transitions

- **`EmblemLoader.js`** - Branded loading animation
  - Company logo with pulse effect
  - Used in admin sections

- **`LazyImage.js`** - Progressive image loading
  - Blur-up effect
  - Intersection observer
  - Lazy loading optimization

- **`GlassCard.js`** - Glassmorphism card component
  - Frosted glass effect
  - Used for feature showcases

- **`TeamMemberModal.js`** - Team bio popup
  - Shows detailed team member info
  - Used on About page

### Contexts (`/contexts/`)
- **`ThemeContext.js`** - Dark mode state management
  - Persists theme to localStorage
  - Provides `theme` and `toggleTheme`

### Hooks (`/hooks/`)
- **`use-mobile.jsx`** - Mobile detection hook
- **`use-toast.js`** - Toast notification hook
- **`useCountdown.js`** - Countdown timer logic
  - Used for exchange rate expiry timers

---

## 4. 💾 Data Layer (`/models/` & `/lib/`)

### Mongoose Models (`/models/`)

*Database schemas. All use MongoDB with Mongoose ODM.*

#### User Management
- **`Admin.js`** - Admin user accounts
  ```js
  {
    email: String (unique),
    password: String (hashed with bcrypt),
    firstName: String,
    lastName: String,
    role: ObjectId (ref: 'Role'),
    isActive: Boolean,
    lastLogin: Date,
    createdAt: Date,
    updatedAt: Date
  }
  ```

- **`Role.js`** - RBAC roles
  ```js
  {
    name: String (e.g., "Super Admin"),
    slug: String (e.g., "super-admin"),
    permissions: [String],
    isSystem: Boolean,
    description: String
  }
  ```
  - System roles cannot be deleted
  - Permissions defined in `/lib/permissions.js`

#### Content Models
- **`ResearchPaper.js`** - Research documents
  ```js
  {
    title: String,
    description: String,
    fileUrl: String,
    publishDate: Date,
    isVisible: Boolean,
    downloadCount: Number
  }
  ```

- **`Document.js`** - General documents
  ```js
  {
    title: String,
    description: String,
    fileUrl: String,
    category: String,
    uploadDate: Date
  }
  ```

#### Market Data
- **`ExchangeRate.js`** - Currency exchange rates
  ```js
  {
    fromCurrency: String,
    toCurrency: String,
    buyRate: Number,
    sellRate: Number,
    expiryDate: Date,
    isEnabled: Boolean
  }
  ```

- **`GlobalFund.js`** - Investment fund data
  ```js
  {
    name: String,
    code: String,
    price: Number,
    change: Number,
    lastUpdated: Date,
    isVisible: Boolean
  }
  ```

#### Site Configuration
- **`PageSettings.js`** - Page visibility control
  ```js
  {
    pageName: String (unique),
    isAccessible: Boolean,
    showInNav: Boolean
  }
  ```

- **`IPOSettings.js`** - IPO configuration
  ```js
  {
    isEnabled: Boolean,
    offerOpenDate: Date,
    offerCloseDate: Date,
    offerDetails: String
  }
  ```

- **`EmailSettings.js`** - Email config
  ```js
  {
    smtpHost: String,
    smtpPort: Number,
    smtpUser: String,
    smtpPassword: String (encrypted)
  }
  ```

#### User Interactions
- **`Contact.js`** - Contact form submissions
  ```js
  {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    message: String,
    referralSource: String,
    status: String ('pending', 'resolved'),
    submittedAt: Date
  }
  ```

#### Compliance & Analytics
- **`Consent.js`** - GDPR consent records
  ```js
  {
    email: String,
    consentType: String,
    consentGiven: Boolean,
    ipAddress: String,
    timestamp: Date
  }
  ```

- **`AnalyticsEvent.js`** - Page view tracking
  ```js
  {
    eventType: String,
    page: String,
    userAgent: String,
    ipAddress: String,
    timestamp: Date
  }
  ```

- **`AuditLog.js`** - Admin action logging
  ```js
  {
    user: ObjectId (ref: 'Admin'),
    action: String,
    resource: String,
    details: Object,
    ipAddress: String,
    timestamp: Date
  }
  ```

- **`EmailVerificationToken.js`** - GDPR email verification
  ```js
  {
    email: String,
    token: String,
    requestType: String,
    expiresAt: Date
  }
  ```

### Library Functions (`/lib/`)

#### Core Utilities
- **`mongodb.js`** - Database connection handler (**Updated Jan 29, 2026**)
  - Connection pooling
  - Singleton pattern
  - **Explicit database name configuration** ⚠️ NEW
  - Error handling with improved logging
  - Usage: `await connectDB()`
  - **Critical:** Uses `DB_NAME` environment variable to set database explicitly
  - Prevents defaulting to "test" database in production

- **`auth.js`** - Authentication utilities
  - `hashPassword(password)` - Bcrypt hashing
  - `verifyPassword(password, hash)` - Password comparison
  - `generateToken(user)` - JWT creation with role permissions
  - `verifyToken(token)` - JWT validation
  - `verifyAdminRequest(request)` - Middleware helper

- **`permissions.js`** - RBAC permission definitions
  - `ALL_PERMISSIONS` - Complete list of system permissions
  - Grouped by category (Users, Content, Data, Settings)
  - Used by Role model and frontend checks

- **`security.js`** - Security utilities
  - Input sanitization
  - XSS prevention
  - Rate limiting helpers

- **`email.js`** - Email sending utilities
  - Nodemailer configuration
  - `sendEmail(to, subject, text, html)` - Send email
  - Template support

- **`audit.js`** - Audit logging utilities
  - `logAdminAction(user, action, resource, details)` - Create audit log

- **`utils.js`** - General utilities
  - `cn()` - Class name merger (for Tailwind)

---

## 5. 📂 Documentation & Scripts

### Documentation (`/docs/`)
- **`DEPLOYMENT_MANUAL.md`** - ⭐ **Production deployment guide** (Created in Task 2)
  - SFTP upload instructions
  - Build process
  - Server restart commands
  - PM2 setup
  - Troubleshooting

- **`DEPLOYMENT_SOP.md`** - Standard operating procedures
- **`QA_VALIDATION_CHECKLIST.md`** - Testing checklist
- **`RBAC_IMPLEMENTATION.md`** - Role system documentation

### Root Documentation
- **`MAINTENANCE_LOG.md`** - ⭐ **Code sanitation log** (Created in Task 1)
- **`PROJECT_HANDOVER_MAP.md`** - ⭐ **THIS FILE** (You are here)
- **`DEPLOYMENT_FIXES.md`** - ⭐ **Critical production fixes** (Jan 29, 2026) ⚠️ NEW
- **`DEPLOYMENT_READINESS_REPORT.md`** - **Deployment clearance** (Updated)
- **`HANDOVER_COMPLETE.md`** - **Handover summary** (Updated)
- **`SECURITY_AUDIT_2026.md`** - Security audit report
- **`DEPLOYMENT_GUIDE.md`** - Alternative deployment guide

### Scripts (`/scripts/`)
- **`seed-roles.js`** - ⭐ **RBAC initialization**
  - Creates system roles (Super Admin, Admin, Editor, Viewer)
  - Migrates existing users to RBAC structure
  - Run once after deployment: `node scripts/seed-roles.js`

- **`optimize-images.js`** - Image compression utility
- **`project-health-check.js`** - System diagnostics
- **`deploy.sh`** - Automated deployment script
- **`health-check.sh`** - Server health check
- **`restart-services.sh`** - Service restart script
- **`view-logs.sh`** - Log viewing helper

### Config Files
- **`init-admin.js`** - Create first admin (dev only)
- **`cleanup-unused-files.js`** - Remove orphaned files

---

## 6. ⚙️ Critical Workflows

### 🔐 Authentication Flow

1. **User visits `/admin/login`**
2. Enters email/password
3. POST to `/api/auth/login`
   - Verifies credentials against `Admin` model
   - Fetches user's `Role` and `permissions`
   - Generates JWT with embedded permissions
   - Returns token in HTTP-only cookie
4. Client stores user data in React Context
5. All admin routes check JWT via `RouteGuard`
6. API routes verify token using `verifyAdminRequest()`

### 🔒 RBAC Permission Check

1. **Component renders admin link**
2. Checks `user.role.permissions` array
3. If required permission exists, show link
4. Example:
   ```js
   {user.role?.permissions.includes('manage_users') && (
     <Link href="/admin/users">Users</Link>
   )}
   ```

### 📄 Page Visibility System

**How it works:**

1. **Admin toggles page visibility** in `/admin/pages`
   - "Show in Nav" button → Updates `showInNav` field
   - "Accessible" button → Updates `isAccessible` field
2. **API updates database** via `/api/admin/page-settings` (PUT)
3. **Frontend fetches settings** from `/api/page-visibility` (GET)
4. **Navbar filters links** based on `showInNav`
5. **Footer filters links** based on `showInNav`
6. **PageAccessGuard blocks access** if `isAccessible = false`
   - Shows "Page Not Available" message
   - Always allows Home and Admin pages

### 📊 Exchange Rate Updates

1. **Admin adds/edits rate** in `/admin/exchange-rates`
2. Sets `expiryDate` (e.g., 24 hours from now)
3. **Public page** fetches from `/api/exchange-rates`
4. **Countdown timer** (`useCountdown` hook) shows "Valid Until"
5. When expired, rate is hidden automatically
6. User clicks "Fund Now" → Redirects to relevant funding page

### 📧 Contact Form Submission

1. **User fills form** on `/contact`
2. POST to `/api/contact`
3. **Server:**
   - Saves to `Contact` model
   - Sends email to admin via Nodemailer
   - Returns success/error
4. **Admin views** submissions in `/admin/contacts`
5. Can export to CSV or mark as resolved

### 🔒 GDPR Data Request

1. **User submits request** via `/api/gdpr/user-data`
2. Server creates `EmailVerificationToken`
3. **Verification email sent** with unique link
4. **User clicks link** → Returns to API with token
5. **Server verifies token** → Processes request
   - Export: Returns JSON of all user data
   - Delete: Permanently removes data from all models
6. **Logs action** in `AuditLog`

---

## 7. 📋 Database Schema Reference

### Collections Summary

| Collection | Documents | Purpose |
|------------|-----------|---------|
| `admins` | ~5-20 | Admin user accounts |
| `roles` | 4 (system) | RBAC roles |
| `researchpapers` | ~50-100 | PDF reports |
| `documents` | ~20-50 | General files |
| `exchangerates` | ~10-15 | Currency rates |
| `globalfunds` | ~30-50 | Investment funds |
| `pagesettings` | ~16 | Page visibility |
| `iposettings` | 1 | IPO config |
| `contacts` | Growing | Contact submissions |
| `analyticevents` | Growing | Page views |
| `auditlogs` | Growing | Admin actions |
| `consents` | Growing | GDPR consents |
| `emailverificationtokens` | Temporary | GDPR verifications |

### Indexes
*Recommended indexes for performance:*

```js
// Admins
db.admins.createIndex({ email: 1 }, { unique: true })

// Roles
db.roles.createIndex({ slug: 1 }, { unique: true })

// Exchange Rates
db.exchangerates.createIndex({ isEnabled: 1, expiryDate: 1 })

// Page Settings
db.pagesettings.createIndex({ pageName: 1 }, { unique: true })

// Analytics
db.analyticevents.createIndex({ timestamp: -1 })
db.analyticevents.createIndex({ page: 1, timestamp: -1 })

// Audit Logs
db.auditlogs.createIndex({ timestamp: -1 })
db.auditlogs.createIndex({ user: 1, timestamp: -1 })
```

---

## 8. 🔐 Environment Variables

### Required Variables (**Updated Jan 29, 2026**)

**`.env` file structure:**

```env
# Database (CRITICAL - MongoDB Configuration)
MONGO_URL=mongodb://localhost:27017/aib-axys
# OR for MongoDB Atlas (Production):
# MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority

DB_NAME=aib-axys  # ⚠️ CRITICAL - Must be set explicitly

# Application
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://your-domain.com
CORS_ORIGINS=*

# Authentication
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# Email Configuration (Optional - for contact form)
CONTACT_EMAIL_DEFAULT=info@axysinvestmentbank.com
CONTACT_EMAIL_GENERAL=feedback@aib-axysafrica.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=AIB-AXYS Africa <noreply@aib-axysafrica.com>
```

### ⚠️ CRITICAL: DB_NAME Requirement

**Why DB_NAME is required:**
- Mongoose defaults to "test" database if not explicitly specified
- MongoDB Atlas denies access to "test" database (correct security)
- Without `DB_NAME`, all queries will fail with "not authorized" errors

**Fixed in code (Jan 29, 2026):**
- `/app/lib/mongodb.js` now uses explicit `dbName` option
- Reads from `DB_NAME` environment variable
- Fallback to 'aib-axys' if not set

**For MongoDB Atlas:**
1. Create database named `aib-axys`
2. Create user with `readWrite` permission on `aib-axys` database ONLY
3. Set `DB_NAME=aib-axys` in environment variables
4. Do NOT include database name in MONGO_URL

**See:** `DEPLOYMENT_FIXES.md` for complete details

### Security Notes

⚠️ **CRITICAL:**
- **NEVER commit `.env` to version control** (except for Emergent deployment)
- Use `.env.local` for local development
- Regenerate `JWT_SECRET` in production
- Use app-specific passwords for Gmail
- Store `.env` backups securely (encrypted)
- **Always set `DB_NAME` in production** ⚠️ NEW

### Environment-Specific Variables

**Development:**
```env
NODE_ENV=development
MONGO_URL=mongodb://localhost:27017/aib-axys
DB_NAME=aib-axys
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Production (Emergent/Kubernetes):**
```env
NODE_ENV=production
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=aib-axys  # ⚠️ REQUIRED
NEXT_PUBLIC_BASE_URL=https://your-app.emergent.host
```

---

## 🚀 Quick Start Guide for New Developers

### 1. Clone & Setup

```bash
# Clone repository
git clone <repository-url>
cd aib-axys

# Install dependencies
yarn install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URL and JWT secret

# Initialize database (run once)
node scripts/seed-roles.js
node init-admin.js  # Creates first admin: admin@example.com / admin123
```

### 2. Development

```bash
# Start dev server
yarn dev

# Open browser
http://localhost:3000

# Admin portal
http://localhost:3000/admin/login
```

### 3. Before Making Changes

1. **Read this map** (you're doing it!)
2. **Check `MAINTENANCE_LOG.md`** for recent changes
3. **Review the specific component/route** you're modifying
4. **Test locally** before deploying
5. **Update documentation** if adding features

### 4. Common Tasks

**Add a new admin page:**
1. Create `app/admin/your-page/page.js`
2. Add link in `components/AdminSidebar.js` (with permission check)
3. Create API route `app/api/admin/your-endpoint/route.js`
4. Add permission in `lib/permissions.js`

**Add a new public page:**
1. Create `app/your-page/page.js`
2. Add to `Navbar.js` dropdown or links
3. Add to `Footer.js` if needed
4. Add to page visibility system in admin

**Modify styling:**
- Use Tailwind classes (see `tailwind.config.js` for custom colors)
- Check `app/globals.css` for global styles
- Use shadcn/ui components when possible

---

## 📞 Support & Maintenance

### When Things Break

1. **Check logs:**
   ```bash
   # Server logs
   tail -f nohup.out
   
   # MongoDB logs
   sudo tail -f /var/log/mongodb/mongod.log
   ```

2. **Check build:**
   ```bash
   yarn build
   # Look for errors
   ```

3. **Check database:**
   ```bash
   mongosh
   use aib-axys
   db.admins.find()
   ```

4. **Restart services:**
   ```bash
   # See DEPLOYMENT_MANUAL.md for full instructions
   ```

### Code Quality

- **Linting:** `yarn lint`
- **Format:** Use Prettier (VS Code extension recommended)
- **TypeScript:** Not currently used (JS only)

### Testing

- **No automated tests yet** (recommended to add)
- **Manual testing** checklist in `docs/QA_VALIDATION_CHECKLIST.md`

---

## 🎯 Key Architecture Decisions

### Why Next.js App Router?
- Server-side rendering for SEO
- File-based routing (simple structure)
- Built-in API routes (no separate backend)
- Streaming and Suspense support

### Why Mongoose over Prisma?
- Flexible schema (no migrations needed)
- Dynamic queries
- Familiar to team

### Why JWT over Sessions?
- Stateless authentication
- Scalable across multiple servers
- Embeds permissions for RBAC

### Why shadcn/ui over Material-UI?
- Tailwind-first (consistent styling)
- Accessible components (ARIA compliant)
- Copy-paste architecture (no heavy package)

---

## 📦 Deployment Checklist

Before deploying to production:

- [ ] `.env` configured with production values
- [ ] **`DB_NAME` environment variable set to `aib-axys`** ⚠️ CRITICAL
- [ ] `JWT_SECRET` is unique and secure (32+ chars)
- [ ] MongoDB connection is stable
- [ ] MongoDB Atlas user has `readWrite` permission on correct database
- [ ] `yarn build` completes without errors
- [ ] First admin user created
- [ ] Roles seeded (`node scripts/seed-roles.js`)
- [ ] Email settings configured (if using contact form)
- [ ] Domain DNS pointed to server
- [ ] SSL certificate installed (HTTPS)
- [ ] Firewall allows traffic on port 3000
- [ ] PM2 or nohup configured for process management
- [ ] Backup strategy in place
- [ ] **Reviewed `DEPLOYMENT_FIXES.md` for production issues** ⚠️ NEW

**See `docs/DEPLOYMENT_MANUAL.md` for full instructions.**  \n**See `DEPLOYMENT_FIXES.md` for critical MongoDB fixes.**

---

## 🆘 Emergency Contacts

**For critical issues:**
- **Technical Lead:** [Your contact info]
- **Database Admin:** [DBA contact]
- **DevOps:** [DevOps contact]

**Documentation:**
- **Main Docs:** `/docs` folder
- **This Map:** `PROJECT_HANDOVER_MAP.md`
- **Deployment:** `docs/DEPLOYMENT_MANUAL.md`
- **Production Fixes:** `DEPLOYMENT_FIXES.md` ⚠️ CRITICAL - Read first!
- **Deployment Status:** `DEPLOYMENT_READINESS_REPORT.md`
- **Maintenance Log:** `MAINTENANCE_LOG.md`

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.2.5.1 | 2026-01-29 | Page visibility system, MongoDB fixes, deployment docs |
| 1.2.5.0 | 2026-01-29 | RBAC implementation, role management |
| 1.2.4.0 | 2026-01-29 | Mobile navigation fixes |
| 1.2.3.0 | 2026-01-23 | Research paper management |
| 1.2.0.0 | 2026-01-19 | Admin portal foundation |

**Critical Production Fixes (v1.2.5.1):**\n- \u2705 MongoDB database authorization (explicit dbName configuration)\n- \u2705 Duplicate index warning (AnalyticsEvent model)\n- \u2705 Page loading issue (PageAccessGuard component)\n- \u2705 Environment variable documentation

---

**Last Updated:** January 29, 2026  
**Maintained By:** System Architecture Team  
**Next Review:** April 2026

---

## ⭐ Final Notes for the Next Developer

**You now have:**
1. ✅ Complete codebase map
2. ✅ Deployment instructions
3. ✅ Database schemas
4. ✅ Critical workflows
5. ✅ Maintenance log

**Before you start coding:**
1. Read `DEPLOYMENT_MANUAL.md` to understand the server
2. Review `MAINTENANCE_LOG.md` for recent changes
3. Familiarize yourself with the RBAC system (it's everywhere!)
4. Test locally first, always
5. Update this map when you add features

**Pro Tips:**
- Use VS Code with ESLint and Tailwind extensions
- Keep console open for Next.js hot reload messages
- MongoDB Compass is great for viewing data
- PM2 is your friend for production
- Always backup before major changes

**Good luck! The codebase is well-structured and ready for expansion. 🚀**
