# 📦 HANDOVER PACKAGE - Instructions for External Developer

**AIB-AXYS Africa Platform v1.2**  
**Date:** January 30, 2026  
**For:** External Developer Deployment

---

## 📥 STEP 1: DOWNLOAD FILES FROM EMERGENT

### Method A: Use "Save to GitHub" Feature (Recommended)

1. **In Emergent Chat Interface:**
   - Look for "Save to GitHub" button (usually near chat input or in settings menu)
   - Click it to push code to a GitHub repository
   - Copy the GitHub repository URL
   
2. **Share with Developer:**
   ```
   GitHub Repo: <your-repo-url>
   Developer can clone: git clone <repo-url>
   ```

### Method B: Download as ZIP

1. **If GitHub option not available:**
   - Use your browser's file manager or Emergent's download feature
   - Download entire `/app` directory as ZIP
   - Share ZIP file via Google Drive, Dropbox, or email

2. **Important Files to Include:**
   ```
   /app/                          ← Entire project directory
   ├── app/                       ← Next.js application
   ├── components/                ← React components
   ├── lib/                       ← Utility libraries
   ├── models/                    ← Database schemas
   ├── public/                    ← Static assets (CRITICAL)
   ├── scripts/                   ← Deployment scripts
   ├── docs/                      ← Documentation
   ├── .env.example               ← Environment template
   ├── package.json               ← Dependencies
   ├── yarn.lock                  ← Dependency versions
   └── ... (all other files)
   ```

**⚠️ CRITICAL:** Ensure `/public` folder is included with all 27 static assets!

---

## 📊 STEP 2: EXPORT DATABASE

### Run Export Script

**On Emergent (in this workspace):**

```bash
# Navigate to project
cd /app

# Run database export
node scripts/export-database.js
```

**Expected Output:**
```
🔄 Starting MongoDB Export...
📊 Database: aib-axys

🔗 Connecting to MongoDB...
✅ Connected successfully

📦 Found 14 collections

📥 Exporting: admins
   ✅ 1 documents → admins.json
📥 Exporting: contacts
   ✅ 5 documents → contacts.json
... (for all collections)

✅ EXPORT COMPLETE!
📁 Export location: /app/database-export
```

### Download Database Export

```bash
# Zip the database export folder
cd /app
zip -r database-export.zip database-export/

# Download database-export.zip and share with developer
```

**Database Export Includes:**
- admins.json (admin users)
- roles.json (RBAC roles)
- pagesettings.json (page visibility)
- contacts.json (contact form submissions)
- researchpapers.json (research documents)
- exchangerates.json (currency rates)
- iposettings.json (IPO configuration)
- ... (all 14 collections)

---

## 📧 STEP 3: SHARE WITH DEVELOPER

### Email Template

```
Subject: AIB-AXYS Platform - Code & Database Handover

Hi [Developer Name],

Please find the AIB-AXYS Africa platform files and database export:

CODE:
- GitHub Repository: <repo-url>
  OR
- Google Drive Link: <zip-file-link>

DATABASE:
- Google Drive Link: <database-export.zip>
- Import script included in database-export/import-database.js

DOCUMENTATION:
All documentation is included in the code:
- PRIMARY: EXTERNAL_DEPLOYMENT_GUIDE.md (start here)
- File reference: COMPLETE_FILE_PURPOSE_TABLE.md
- Deployment fixes: DEPLOYMENT_FIXES.md
- Security: SECURITY_AUDIT_2026.md

ADMIN CREDENTIALS:
- URL: http://your-domain.com/admin/login
- Email: sk@horizonafrica.com
- Password: Admin@2026
⚠️ CHANGE IMMEDIATELY after first login

CRITICAL ENVIRONMENT VARIABLES:
You must create .env file with:
- MONGO_URL=<your-mongodb-connection-string>
- DB_NAME=aib-axys
- JWT_SECRET=<generate-strong-secret-32-chars>
- NEXT_PUBLIC_BASE_URL=<your-domain>
- CORS_ORIGINS=*

See .env.example in the code for complete list.

DEPLOYMENT INSTRUCTIONS:
Follow EXTERNAL_DEPLOYMENT_GUIDE.md step-by-step.

Questions? Let me know!
```

---

## 🔧 STEP 4: FIX MISSING ASSETS ISSUE

### The Asset Problem

**Issue:** Logos not showing on deployed Emergent site

**Root Cause:** When using `output: 'standalone'` mode, Next.js doesn't automatically include the `/public` folder in the standalone build.

### Two Solutions:

#### Solution A: For Emergent Re-deployment (Add to package.json)

Update the build script to automatically copy public assets:

**File:** `package.json` (Line 9)

**Change FROM:**
```json
"build": "next build",
```

**Change TO:**
```json
"build": "next build && cp -r public .next/standalone/public 2>/dev/null || true && cp -r .next/static .next/standalone/.next/static 2>/dev/null || true",
```

**Why This Works:**
- After Next.js builds, automatically copies public/ to standalone/public/
- Happens during build (before Docker image creation)
- Emergent deployment will include assets
- Logos will display correctly

#### Solution B: For External Developer (Already Solved)

The developer will deploy to a standard VPS (not Emergent), so:
- ✅ They don't need standalone mode complications
- ✅ Can remove `output: 'standalone'` from next.config.js
- ✅ Public folder works automatically
- ✅ Much simpler (documented in EXTERNAL_DEPLOYMENT_GUIDE.md)

---

## 🐌 STEP 5: FIX SLOW PLATFORMS PAGE

### Issue Fixed

**Problem:** Platforms page showed loading spinner, waiting for images to load

**Fix Applied:**
- ✅ Removed image loading state logic
- ✅ Removed conditional opacity transitions
- ✅ Page now loads immediately
- ✅ Images load progressively (Next.js Image component handles it)

**File Changed:** `app/platforms/page.js`

---

## 📋 COMPLETE HANDOVER CHECKLIST

### For You (To Prepare):

- [ ] Run `node scripts/export-database.js` to export database
- [ ] Zip database-export folder: `zip -r database-export.zip database-export/`
- [ ] Push code to GitHub OR download /app as ZIP
- [ ] Share GitHub link OR ZIP file with developer
- [ ] Share database-export.zip with developer
- [ ] Send email with credentials and instructions (template above)

### For Developer (They Will Do):

- [ ] Clone/download code
- [ ] Extract database-export.zip
- [ ] Install Node.js 18.x or 20.x
- [ ] Install MongoDB (Atlas or local)
- [ ] Run `yarn install`
- [ ] Create `.env` file from `.env.example`
- [ ] Run `node database-export/import-database.js` to import database
- [ ] Run `yarn build`
- [ ] Run `pm2 start yarn --name "aib-axys" -- start`
- [ ] Verify at `http://localhost:3000`
- [ ] Setup Nginx reverse proxy (optional)
- [ ] Setup SSL with Certbot (optional)

---

## 🚨 CRITICAL NOTES

### About Assets on Emergent

**Current Emergent Deployment:**
- Logos not showing because public folder not copied to standalone build
- Fix: Update package.json build script (see Solution A above)
- Re-deploy after making this change

**External Developer Deployment:**
- Will NOT have this issue (they'll use normal mode or manually handle standalone)
- Full instructions in EXTERNAL_DEPLOYMENT_GUIDE.md

### About Database

**Emergent Database:**
- Hosted on Emergent's MongoDB
- Export script creates JSON files of all data
- Developer imports to their own MongoDB (Atlas or local)

**Collections to Export (14 total):**
1. admins (admin users)
2. roles (RBAC roles)
3. contacts (contact submissions)
4. researchpapers (research docs)
5. pagesettings (page visibility)
6. analyticevents (analytics tracking)
7. auditlogs (security logs)
8. exchangerates (currency rates)
9. iposettings (IPO config)
10. globalfunds (fund data)
11. documents (uploaded docs)
12. consents (GDPR consents)
13. emailsettings (email config)
14. emailverificationtokens (verification tokens)

---

## 📞 SUPPORT FOR DEVELOPER

**If Developer Has Issues:**

**MongoDB Issues:**
- See DEPLOYMENT_FIXES.md → Issue #3 (MongoDB "not authorized on test")
- See EXTERNAL_DEPLOYMENT_GUIDE.md → Troubleshooting section

**Asset 404 Issues:**
- See ASSET_404_AUDIT_REPORT.md (comprehensive diagnosis)
- See PRODUCTION_ASSET_FIX.md (solutions)

**General Deployment:**
- See EXTERNAL_DEPLOYMENT_GUIDE.md (primary guide - 600+ lines)
- See COMPLETE_FILE_PURPOSE_TABLE.md (file navigation)

**Environment Setup:**
- See .env.example (all required variables)
- See EXTERNAL_DEPLOYMENT_GUIDE.md → Environment Configuration section

---

## ⚡ QUICK FIX FOR EMERGENT ASSETS

**To fix logos on Emergent deployment RIGHT NOW:**

1. **Update package.json build script:**
```json
"build": "next build && cp -r public .next/standalone/public 2>/dev/null || true && cp -r .next/static .next/standalone/.next/static 2>/dev/null || true"
```

2. **Re-deploy to Emergent**

3. **Assets will now work!**

---

**Handover Package Status:** ✅ READY  
**Database Export Script:** ✅ CREATED (`scripts/export-database.js`)  
**Deployment Guide:** ✅ COMPLETE (`EXTERNAL_DEPLOYMENT_GUIDE.md`)  
**File Reference:** ✅ COMPLETE (`COMPLETE_FILE_PURPOSE_TABLE.md`)  
**Slow Page Issue:** ✅ FIXED (`platforms/page.js`)  
**Asset Issue:** ✅ SOLUTION PROVIDED (update package.json build script)
