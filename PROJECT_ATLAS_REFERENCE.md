# 🗺️ PROJECT ATLAS - AIB-AXYS Africa Platform (v1.2)

**Purpose:** Master Navigation Reference for Developers  
**Last Updated:** January 30, 2026  
**Status:** Production-Ready, Security-Hardened

---

## 📊 Quick Reference Table

### Core Configuration

| File / Directory | Category | Purpose / Functionality |
|:---|:---|:---|
| `next.config.js` | **Config** | Security headers (HSTS, CSP, X-Frame-Options), CORS, image optimization, Turbopack |
| `tailwind.config.js` | **Styling** | Theme configuration, brand colors, custom animations |
| `.env` | **Config** | Environment variables (DB_NAME, MONGO_URL, JWT_SECRET, CORS) |
| `.env.example` | **Config** | Template for environment configuration |
| `package.json` | **Dependencies** | Next.js 16.1.4, React 19, MongoDB, Mongoose, JWT libraries |
| `jsconfig.json` | **Config** | Path aliases (@/components, @/lib, @/models) |
| `postcss.config.js` | **Styling** | Tailwind CSS configuration |
| `.prettierrc.json` | **Dev Tools** | Code formatting rules |
| `.lintstagedrc.js` | **Dev Tools** | Pre-commit hooks for linting |

---

### Application Core

| File / Directory | Category | Purpose / Functionality |
|:---|:---|:---|
| `app/layout.js` | **Core** | Root layout with Inter font (display: swap), theme script, metadata |
| `app/page.js` | **Public** | Homepage with hero section, services, statistics |
| `app/loading.js` | **Core** | Loading state wrapper (uses LoadingPage component) |
| `app/globals.css` | **Styling** | Global styles, animations, Tailwind directives, dark mode |
| `app/api/[[...path]]/route.js` | **API** | Catch-all API route for legacy endpoints |

---

### Security & Authentication

| File / Directory | Category | Purpose / Functionality |
|:---|:---|:---|
| `lib/auth.js` | **Security** | JWT authentication, password hashing (bcrypt), admin verification, token validation |
| `lib/permissions.js` | **Security** | RBAC permission system, 48 granular permissions, role validation |
| `lib/security.js` | **Security** | Rate limiting, input sanitization, XSS protection, SQL injection prevention |
| `lib/audit.js` | **Security** | Audit logging for admin actions, compliance tracking |
| `models/Admin.js` | **Security** | Admin user model with password hashing, role references |
| `models/Role.js` | **Security** | RBAC roles (super-admin, admin, analyst, viewer) with custom permissions |
| `models/AuditLog.js` | **Security** | Security audit trail (admin actions, timestamps, IP addresses) |
| `app/api/auth/login/route.js` | **API** | Admin login with JWT cookie, rate limiting (5 attempts/15min) |
| `app/api/auth/logout/route.js` | **API** | Logout endpoint (clears JWT cookie) |
| `app/api/auth/me/route.js` | **API** | Get current admin user details |
| `app/api/health/route.js` | **API** | Health check endpoint (deployment validation) - **CRITICAL** |

---

### Admin Panel (Protected Routes)

| File / Directory | Category | Purpose / Functionality |
|:---|:---|:---|
| `app/admin/layout.js` | **Admin** | Admin layout with sidebar, navbar, route guard |
| `app/admin/login/page.js` | **Admin** | Admin login form with credentials validation |
| `app/admin/dashboard/page.js` | **Admin** | Analytics dashboard (contacts, research, applications stats) |
| `app/admin/contacts/page.js` | **Admin** | Contact management (view, filter, update status, add notes) |
| `app/admin/research/page.js` | **Admin** | Research paper upload, edit, delete (file management) |
| `app/admin/pages/page.js` | **Admin** | Page visibility controls (hide/show pages, navbar visibility) |
| `app/admin/users/page.js` | **Admin** | User management (super-admin only) |
| `app/admin/settings/roles/page.js` | **Admin** | RBAC role management (create/edit custom roles) |
| `app/admin/analytics/page.js` | **Admin** | Analytics dashboard with charts (Recharts) |
| `app/admin/exchange-rates/page.js` | **Admin** | Manage currency exchange rates |
| `app/admin/ipo-settings/page.js` | **Admin** | IPO configuration (target date, apply link, status) |
| `app/admin/gdpr/page.js` | **Admin** | GDPR compliance requests management |
| `app/admin/documents/page.js` | **Admin** | Document upload and management |
| `app/admin/global-funds/page.js` | **Admin** | Global fund management |

---

### Admin API Endpoints (All Protected)

| File / Directory | Category | Purpose / Functionality |
|:---|:---|:---|
| `app/api/admin/dashboard/route.js` | **API** | Dashboard stats (contacts, research, applications) |
| `app/api/admin/contacts/route.js` | **API** | Contact CRUD operations, filtering, status updates |
| `app/api/admin/research/route.js` | **API** | Research paper upload, edit, delete (stores in /public/research) |
| `app/api/admin/roles/route.js` | **API** | RBAC role management (super-admin only) |
| `app/api/admin/users/route.js` | **API** | Admin user management (super-admin only) |
| `app/api/admin/page-settings/route.js` | **API** | Page visibility controls (isVisible, isAccessible) |
| `app/api/admin/page-settings/seed/route.js` | **API** | Initialize default page settings |
| `app/api/admin/analytics/stats/route.js` | **API** | Analytics data for charts |
| `app/api/admin/audit-logs/route.js` | **API** | Fetch security audit logs |
| `app/api/admin/exchange-rates/route.js` | **API** | Manage exchange rates |
| `app/api/admin/ipo-settings/route.js` | **API** | IPO configuration management |
| `app/api/admin/email-settings/route.js` | **API** | Email configuration |
| `app/api/admin/documents/route.js` | **API** | Document management |
| `app/api/admin/global-funds/route.js` | **API** | Global fund management |

---

### Public Pages

| File / Directory | Category | Purpose / Functionality |
|:---|:---|:---|
| `app/about/page.js` | **Public** | About page (company story, team, board of directors) |
| `app/contact/page.js` | **Public** | Contact form (saves to database, optional email notification) |
| `app/research/page.js` | **Public** | Research papers listing with category filters, download tracking |
| `app/downloads/page.js` | **Public** | Downloads page (NSE companies PDF, terms & conditions) |
| `app/ipo/page.js` | **Public** | IPO page with countdown, application link |
| `app/faq/page.js` | **Public** | Frequently asked questions |
| `app/exchange-rates/page.js` | **Public** | Exchange rates display (static display) |
| `app/fund-account/local-stocks/page.js` | **Public** | Local stocks funding info |
| `app/fund-account/multi-currency/page.js` | **Public** | Multi-currency exchange with live API data |
| `app/fund-account/international-equities/page.js` | **Public** | International equities info |
| `app/fund-account/offshore-funds/page.js` | **Public** | Offshore funds info |
| `app/platforms/page.js` | **Public** | Trading platforms overview |
| `app/services/page.js` | **Public** | Services offered |
| `app/leverage/page.js` | **Public** | Leverage trading information |
| `app/global-markets/page.js` | **Public** | Global markets access |
| `app/group/page.js` | **Public** | AXYS Group information |
| `app/terms/page.js` | **Public** | Terms and conditions |
| `app/privacy/page.js` | **Public** | Privacy policy |

---

### Public API Endpoints (No Authentication)

| File / Directory | Category | Purpose / Functionality |
|:---|:---|:---|
| `app/api/contact/route.js` | **API** | Contact form submission (rate limited: 5/hour per IP) |
| `app/api/research/route.js` | **API** | Fetch published research papers (public access) |
| `app/api/research/download/route.js` | **API** | Track research paper downloads (rate limited: 10/min per IP) |
| `app/api/page-visibility/route.js` | **API** | Get page accessibility settings (used by navbar, footer, mobile nav) |
| `app/api/exchange-rates/route.js` | **API** | Fetch active exchange rates |
| `app/api/documents/route.js` | **API** | Fetch public documents |
| `app/api/documents/download/route.js` | **API** | Download public documents |
| `app/api/analytics/route.js` | **API** | Track page views and events |
| `app/api/gdpr/user-data/route.js` | **API** | GDPR data request with email verification |

---

### React Components (UI)

| File / Directory | Category | Purpose / Functionality |
|:---|:---|:---|
| `components/Navbar.js` | **UI** | Main navigation with dropdowns, dynamic page filtering, theme toggle |
| `components/MobileNav.js` | **UI** | Mobile hamburger menu (used inside Navbar) |
| `components/Footer.js` | **UI** | Footer with links, dynamic page filtering |
| `components/SwipeNavigation.js` | **UI** | Mobile swipe navigation between pages, respects page accessibility |
| `components/LoadingPage.js` | **UI** | Loading screen with pulsing logo, **3-second failsafe timeout** |
| `components/PageAccessGuard.js` | **Security** | Client-side route guard (blocks inaccessible pages) |
| `components/RouteGuard.js` | **Security** | Admin route protection |
| `components/ClientLayout.js` | **Core** | Client-side layout wrapper with loading state management |
| `components/GlassCard.js` | **UI** | Glassmorphism card component with optional 3D tilt |
| `components/LazyImage.js` | **UI** | Lazy-loaded image component with blur placeholder |
| `components/AdminLayout.js` | **Admin** | Admin panel layout wrapper |
| `components/AdminNavbar.js` | **Admin** | Admin top navbar with logout |
| `components/AdminSidebar.js` | **Admin** | Admin sidebar navigation with RBAC-based menu items |
| `components/TeamMemberModal.js` | **UI** | Modal for team member details |
| `components/EmblemLoader.js` | **UI** | Alternative SVG-based loading animation |
| `components/RouteLoadingWrapper.js` | **UI** | Route transition loading wrapper |

---

### Database Models (Mongoose Schemas)

| File / Directory | Category | Purpose / Functionality |
|:---|:---|:---|
| `models/Admin.js` | **Database** | Admin users (email, password, role, isActive) |
| `models/Role.js` | **Database** | RBAC roles (name, slug, permissions, isSystem) |
| `models/Contact.js` | **Database** | Contact form submissions (name, email, message, status, notes) |
| `models/ResearchPaper.js` | **Database** | Research papers (title, category, fileUrl, downloadCount, **9 category types**) |
| `models/PageSettings.js` | **Database** | Page visibility (page, isVisible, isAccessible, showInNav) |
| `models/AnalyticsEvent.js` | **Database** | Page view tracking (event, path, userAgent, timestamp) |
| `models/AuditLog.js` | **Database** | Admin action logs (adminEmail, action, details, ipAddress) |
| `models/ExchangeRate.js` | **Database** | Currency exchange rates (currency, rate, isActive) |
| `models/IPOSettings.js` | **Database** | IPO configuration (name, targetDate, applyNowLink, isActive) |
| `models/GlobalFund.js` | **Database** | Global fund details |
| `models/Document.js` | **Database** | Uploaded documents |
| `models/Consent.js` | **Database** | GDPR consent records |
| `models/EmailSettings.js` | **Database** | Email SMTP configuration |
| `models/EmailVerificationToken.js` | **Database** | Email verification tokens for GDPR requests |

---

### Utility Libraries

| File / Directory | Category | Purpose / Functionality |
|:---|:---|:---|
| `lib/mongodb.js` | **Database** | MongoDB connection with **explicit DB_NAME** (prevents 'test' db issue) |
| `lib/auth.js` | **Security** | JWT functions, password hashing, admin verification, super-admin check |
| `lib/permissions.js` | **Security** | Permission constants, validation, RBAC helper functions |
| `lib/security.js` | **Security** | Rate limiting, input sanitization, XSS/SQL injection prevention |
| `lib/audit.js` | **Security** | Audit log creation for compliance |
| `lib/email.js` | **Utility** | Email sending (Nodemailer) with SMTP configuration |
| `lib/utils.js` | **Utility** | General utility functions (cn for className merging) |

---

### Data Files

| File / Directory | Category | Purpose / Functionality |
|:---|:---|:---|
| `data/teamData.js` | **Data** | Team member information (name, role, image, bio, social links) |
| `data/nseCompanies.js` | **Data** | NSE-listed companies (name, sector) for research paper tagging |
| `config/content.json` | **Data** | Site content configuration (if exists) |

---

### Context Providers

| File / Directory | Category | Purpose / Functionality |
|:---|:---|:---|
| `contexts/ThemeContext.js` | **State** | Dark/light theme management with localStorage persistence |

---

### Custom Hooks

| File / Directory | Category | Purpose / Functionality |
|:---|:---|:---|
| `hooks/use-mobile.jsx` | **Hooks** | Responsive breakpoint detection |
| `hooks/use-toast.js` | **Hooks** | Toast notification system |
| `hooks/useCountdown.js` | **Hooks** | Countdown timer for IPO page |

---

### Scripts & Tools

| File / Directory | Category | Purpose / Functionality |
|:---|:---|:---|
| `scripts/seed-roles.js` | **Scripts** | Initialize RBAC roles (run once on setup) |
| `scripts/optimize-images.js` | **Scripts** | Image optimization utility |
| `scripts/project-health-check.js` | **Scripts** | Deployment health check |
| `scripts/deploy.sh` | **Scripts** | Deployment script |
| `scripts/restart-services.sh` | **Scripts** | Service restart script |
| `scripts/health-check.sh` | **Scripts** | Health check script |
| `scripts/view-logs.sh` | **Scripts** | Log viewing script |
| `init-admin.js` | **Scripts** | Initialize first admin user (sk@horizonafrica.com) |
| `cleanup-unused-files.js` | **Scripts** | Remove unused files |
| `optimize-website.js` | **Scripts** | Website optimization script |
| `load-test.js` | **Scripts** | Load testing script |

---

### Documentation

| File / Directory | Category | Purpose / Functionality |
|:---|:---|:---|
| `EXTERNAL_DEPLOYMENT_GUIDE.md` | **Docs** | **CRITICAL** - Comprehensive deployment guide for external developers (500+ lines) |
| `docs/DEPLOYMENT_MANUAL.md` | **Docs** | VPS deployment step-by-step (nohup, PM2, Nginx) |
| `docs/DEPLOYMENT_SOP.md` | **Docs** | Standard operating procedures for deployment |
| `docs/RBAC_IMPLEMENTATION.md` | **Docs** | RBAC system architecture and usage |
| `docs/QA_VALIDATION_CHECKLIST.md` | **Docs** | Testing checklist |
| `DEPLOYMENT_FIXES.md` | **Docs** | Phase 1 & 2 deployment fixes (MongoDB, health endpoint, etc.) |
| `HANDOVER_COMPLETE.md` | **Docs** | Project handover summary (v2.1) |
| `SECURITY_AUDIT_2026.md` | **Docs** | Security audit report |
| `test_result.md` | **Docs** | Testing protocol and results |

---

## 🔑 Critical Files Checklist

**Before Deployment, Verify These Files:**

1. ✅ `/app/.env` - All environment variables set correctly
2. ✅ `/app/app/api/health/route.js` - Health endpoint exists and returns 200
3. ✅ `/app/lib/mongodb.js` - DB_NAME explicitly set (NOT defaulting to "test")
4. ✅ `/app/next.config.js` - Security headers configured, poweredByHeader: false
5. ✅ `/app/components/LoadingPage.js` - 3-second failsafe timeout implemented
6. ✅ `/app/app/layout.js` - Font display: 'swap' configured

---

## 🚨 Security Hardening Applied (Jan 30, 2026)

**next.config.js Enhancements:**
- ✅ `poweredByHeader: false` - Hides Next.js signature
- ✅ Enhanced CSP: `base-uri 'self'; form-action 'self'`
- ✅ Permissions-Policy: Added `payment=()` restriction
- ✅ Access-Control-Allow-Credentials: Added for cookie-based auth
- ✅ X-DNS-Prefetch-Control: Enabled for performance

**LoadingPage.js Failsafe:**
- ✅ Hard 3-second timeout prevents infinite loading
- ✅ Logs warning if timeout is reached
- ✅ Gracefully returns null if failsafe triggers

**Font Optimization:**
- ✅ Inter font configured with `display: 'swap'`
- ✅ Preload enabled, fallback fonts specified

---

## 📍 Quick Navigation by Task

**Need to modify admin permissions?**
- Start: `lib/permissions.js`
- Then: `models/Role.js`
- API: `app/api/admin/roles/route.js`

**Need to add a new page?**
- Create: `app/your-page/page.js`
- Update: `components/Navbar.js` (add link)
- Update: `components/SwipeNavigation.js` (add to pages array)
- Seed: Add to `models/PageSettings.js` default data

**Need to modify security headers?**
- File: `next.config.js`
- Section: `async headers()`

**Need to debug loading issues?**
- Component: `components/LoadingPage.js`
- Wrapper: `components/ClientLayout.js`
- Global: `app/loading.js`

**Need to check admin authentication?**
- Library: `lib/auth.js`
- Middleware: `verifyAdminRequest()` or `requireSuperAdmin()`
- Login API: `app/api/auth/login/route.js`

**Need to modify database connection?**
- File: `lib/mongodb.js`
- **CRITICAL:** Always set `DB_NAME` environment variable

---

## 🎯 Technology Stack

**Frontend:**
- Next.js 16.1.4 (React 19, App Router)
- Tailwind CSS 3.4.1
- shadcn/ui components
- Recharts for analytics
- React Hook Form + Zod validation

**Backend:**
- Next.js API Routes
- MongoDB + Mongoose ODM
- JWT authentication (jsonwebtoken)
- bcryptjs for password hashing
- Rate limiting (custom implementation)

**Development Tools:**
- ESLint 9.39.2
- Prettier 3.8.0
- Husky + lint-staged (pre-commit hooks)

**Deployment:**
- Standalone Next.js build
- Supervisor process management
- MongoDB (Emergent-managed)

---

## 📞 Support & Maintenance

**Admin Credentials (Default):**
- URL: `/admin/login`
- Email: `sk@horizonafrica.com`
- Password: `Admin@2026`
- ⚠️ **CHANGE IMMEDIATELY AFTER FIRST LOGIN**

**Environment Variables Required:**
```
MONGO_URL=<connection-string>
DB_NAME=aib-axys
NEXT_PUBLIC_BASE_URL=<your-domain>
JWT_SECRET=<strong-secret-32-chars-min>
CORS_ORIGINS=*
```

**Health Check:**
```bash
curl http://localhost:3000/api/health
# Expected: {"status":"ok","timestamp":"...","service":"horizon-africa-backend"}
```

---

**Document Version:** 1.0  
**Created:** January 30, 2026  
**Status:** Production-Ready, Security-Hardened  
**Next Review:** April 2026
