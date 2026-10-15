# DEPLOYMENT SOP (Standard Operating Procedure)
## AIB-AXYS Africa Next.js Platform

**Document Version:** 2.0  
**Effective Date:** January 29, 2026  
**Target Environment:** Production Linux Server  
**Application:** Next.js 16 Platform with MongoDB  

---

## ⚠️ CRITICAL WARNING

**READ THIS ENTIRE DOCUMENT BEFORE DEPLOYING**

Improper deployment can cause production downtime. Follow these steps EXACTLY in sequence. Do not skip steps or deviate from the procedure.

**Estimated Deployment Time:** 10-15 minutes (excluding file upload)

---

## 📋 TABLE OF CONTENTS

1. [Pre-Deployment Checklist](#1-pre-deployment-checklist)
2. [Access Protocols](#2-access-protocols)
3. [The Safe Deployment Cycle](#3-the-safe-deployment-cycle)
4. [Process Management (Kill Switch)](#4-process-management-kill-switch)
5. [Post-Deployment Verification](#5-post-deployment-verification)
6. [Rollback Strategy](#6-rollback-strategy)
7. [Troubleshooting](#7-troubleshooting)
8. [Recent Updates & Fixes](#8-recent-updates--fixes)
9. [Emergency Contacts](#9-emergency-contacts)
10. [Deployment Log Template](#10-deployment-log-template)
11. [Best Practices](#11-best-practices)
12. [Quick Reference Commands](#12-quick-reference-commands)

---

## 1. PRE-DEPLOYMENT CHECKLIST

Before touching the production server, verify:

### Local Environment Validation

- [ ] **Code changes tested locally**
  ```bash
  npm run dev
  # Test all changed features thoroughly
  ```

- [ ] **Production build succeeds locally**
  ```bash
  npm run build
  # Must complete without errors
  ```

- [ ] **Production mode tested locally**
  ```bash
  npm run start
  # Verify app works in production mode
  ```

- [ ] **QA Validation completed**
  - Review `/docs/QA_VALIDATION_CHECKLIST.md`
  - All critical features tested
  - No console errors
  - Mobile responsiveness verified

- [ ] **Environment variables documented**
  - If you added new `.env` variables, document them
  - Prepare to update server `.env` if needed

### Pre-Flight Verification

- [ ] **Git status clean** (if using version control)
  ```bash
  git status
  # Ensure all changes are committed
  ```

- [ ] **Backup plan ready**
  - Know your rollback procedure (Section 6)
  - Have previous working version info ready

- [ ] **Deployment window scheduled**
  - Best time: Low traffic hours (e.g., 2 AM - 6 AM EAT)
  - Avoid peak business hours (9 AM - 5 PM)

- [ ] **Stakeholders notified**
  - Inform team of deployment
  - Have someone available for testing post-deployment

---

## 2. ACCESS PROTOCOLS

### 2.1 SSH Access

**Primary Connection Method:**
```bash
ssh -i id_aib-axys aib-axysafrica@aib-axysafrica.com
```

**Connection Details:**
- **Host:** `aib-axysafrica.com`
- **Username:** `aib-axysafrica`
- **Port:** `22` (default)
- **Auth:** SSH Key (`id_aib-axys`)

**Windows Users (PuTTY):**
1. Convert `id_aib-axys` to `.ppk` using PuTTYgen
2. In PuTTY:
   - Host: `aib-axysafrica.com`
   - Connection → SSH → Auth → Private key file: `id_aib-axys.ppk`

**First-Time Connection:**
```bash
# You may see this prompt:
# "The authenticity of host 'aib-axysafrica.com' can't be established."
# Type: yes (to add to known hosts)
```

**Verify Successful Connection:**
```bash
# After connecting, you should see:
aib-axysafrica@server:~$

# Verify you're in the correct directory:
pwd
# Expected output: /home/aib-axysafrica
```

### 2.2 SFTP Access

**Recommended Clients:**
- **FileZilla** (Windows/Mac/Linux) - Free
- **Cyberduck** (Mac) - Free
- **WinSCP** (Windows) - Free

**FileZilla Configuration:**
1. Host: `sftp://aib-axysafrica.com`
2. Protocol: `SFTP - SSH File Transfer Protocol`
3. Logon Type: `Key file`
4. User: `aib-axysafrica`
5. Key file: Browse to `id_aib-axys`
6. Port: `22`
7. Click "Connect"

### 2.3 CRITICAL SFTP RULES

**⚠️ NEVER UPLOAD THESE FOLDERS:**
```
❌ .next/          # Build artifacts - regenerated on server
❌ node_modules/   # Dependencies - installed on server
❌ .git/           # Version control - not needed on server
❌ .env.local      # Local environment file
```

**Deleting these folders on the server WILL cause downtime!**

**✅ SAFE TO UPLOAD:**
```
✅ app/            # Next.js application code
✅ components/     # React components
✅ lib/            # Utility libraries
✅ models/         # Mongoose models
✅ public/         # Static assets (images, etc.)
✅ styles/         # CSS files
✅ contexts/       # React contexts
✅ data/           # Static data files
✅ package.json    # Dependency list
✅ next.config.js  # Next.js configuration
✅ tailwind.config.js
✅ postcss.config.js
```

---

## 3. THE SAFE DEPLOYMENT CYCLE

Follow these steps IN ORDER. Do not skip steps.

### STEP 1: Local Build Verification

**Purpose:** Catch errors before they reach production

```bash
# Clean previous builds
rm -rf .next

# Install dependencies (if package.json changed)
npm install

# Build for production
npm run build
```

**Expected Output:**
```
Route (app)                              Size     First Load JS
┌ ○ /                                   1.2 kB         100 kB
├ ○ /about                              800 B          95 kB
...
✓ Compiled successfully
```

**If Build Fails:**
- DO NOT PROCEED
- Fix errors locally
- Re-run build until successful
- Common issues:
  - Syntax errors (missing brackets, quotes)
  - Import errors (typos, wrong paths)
  - Type errors (TypeScript if used)

### STEP 2: File Upload via SFTP

**Connect to Server:**
- Use your SFTP client with credentials from Section 2.2
- Navigate to: `/home/aib-axysafrica/site/`

**Upload Strategy:**

**Scenario A: Small changes (1-5 files)**
- Upload ONLY the changed files
- Example: If you edited `app/page.js`, upload only that file

**Scenario B: New features (multiple files)**
- Upload all affected folders
- Example: New component → Upload entire `components/` folder

**Scenario C: Major changes (many files)**
- Upload all code folders (see "Safe to Upload" list above)
- Keep existing `.next`, `node_modules`, `.env` on server

**File Upload Checklist:**
```
Changed:                      Upload:
─────────────────────────────────────────────
Homepage content              app/page.js
New component                 components/NewComponent.js
API route                     app/api/route-name/route.js
Styles                        styles/filename.css or app/globals.css
Images                        public/new-image.png
Package.json updated          package.json (then npm install on server)
Environment variables         .env (handle with extreme care)
```

**Upload Verification:**
- After upload, refresh SFTP client
- Verify file sizes match local files
- Verify timestamps are recent

### STEP 3: Server Rebuild

**Connect via SSH:**
```bash
ssh -i id_aib-axys aib-axysafrica@aib-axysafrica.com
```

**Navigate to Site Directory:**
```bash
cd ~/site
```

**Verify Current Directory:**
```bash
pwd
# Expected: /home/aib-axysafrica/site
```

**Check Uploaded Files (Optional):**
```bash
ls -la app/
# Verify your changes are present
```

**Install Dependencies (if package.json changed):**
```bash
npm install
# Only needed if you added/removed packages
```

**Build the Application:**
```bash
npm run build
```

**Monitor Build Output:**
- Watch for errors
- Build should complete with "✓ Compiled successfully"

**If Build Fails on Server:**
```bash
# View full error log
npm run build 2>&1 | tee build-error.log
cat build-error.log

# Common fixes:
# 1. Missing package: npm install
# 2. File not uploaded: re-upload via SFTP
# 3. Syntax error: fix locally, re-upload, rebuild
```

**Build Success Indicators:**
```
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

---

## 4. PROCESS MANAGEMENT (KILL SWITCH)

**CRITICAL:** After rebuilding, you MUST restart the Next.js process.

### STEP 4.1: Identify the Running Process

**Check what's using port 3000:**
```bash
ss -tulnp | grep :3000
```

**Example Output:**
```
tcp   LISTEN 0   511   0.0.0.0:3000   0.0.0.0:*   users:(("node",pid=12345,fd=18))
                                                           ↑
                                                    This is your PID
```

**Alternative Commands (if `ss` unavailable):**
```bash
# Method 2: Using lsof
lsof -i :3000

# Method 3: Using netstat
netstat -tulnp | grep :3000

# Method 4: Find all node processes
ps aux | grep node
```

**No Process Found?**
- If commands return nothing, the server is not running
- Skip to Step 4.3 (Start New Process)

### STEP 4.2: Kill the Process

**Replace `<PID>` with the number from Step 4.1**

**Graceful Kill (Preferred):**
```bash
kill 12345
# Replace 12345 with your actual PID
```

**Verify Process Stopped:**
```bash
ss -tulnp | grep :3000
# Should return nothing
```

**Force Kill (if graceful kill failed):**
```bash
kill -9 12345
# Use only if graceful kill didn't work
```

**Kill All Node Processes (CAUTION):**
```bash
# Only use if you're CERTAIN no other Node apps are running
pkill -f "node"

# Verify all killed:
ps aux | grep node
```

### STEP 4.3: Start the New Process

**Start Next.js in Background:**
```bash
nohup npm run start &
```

**What This Does:**
- `nohup`: Keeps process running after SSH disconnect
- `npm run start`: Runs Next.js in production mode
- `&`: Runs in background

**Expected Output:**
```
[1] 23456
nohup: ignoring input and appending output to 'nohup.out'
```

**Verify Process Started:**
```bash
ss -tulnp | grep :3000
# Should show new process on port 3000
```

**Check Process Status:**
```bash
jobs
# Should list the background job
```

**Important Notes:**
- Process will keep running after you disconnect from SSH
- Logs are written to `~/site/nohup.out`
- To stop: Find PID and `kill <PID>`

---

## 5. POST-DEPLOYMENT VERIFICATION

### STEP 5.1: Server-Side Verification

**Check Process is Running:**
```bash
ss -tulnp | grep :3000
# Should show process listening on port 3000
```

**Check Recent Logs:**
```bash
tail -f ~/site/nohup.out
# Watch logs in real-time
# Press Ctrl+C to exit
```

**Look for:**
- ✅ "Ready on http://0.0.0.0:3000"
- ✅ No ERROR messages
- ❌ Any stack traces or exceptions

**Check Last 100 Log Lines:**
```bash
tail -n 100 ~/site/nohup.out
```

**Search for Errors:**
```bash
cat ~/site/nohup.out | grep ERROR
cat ~/site/nohup.out | grep FATAL
```

### STEP 5.2: Client-Side Verification

**Test from Your Computer:**

1. **Homepage Test:**
   - Open: `https://aib-axysafrica.com`
   - Verify page loads
   - Check for visual errors

2. **Changed Pages Test:**
   - Navigate to pages you modified
   - Verify changes are visible
   - Test functionality

3. **Browser Console Check:**
   - Press F12 → Console tab
   - Look for red errors
   - Report any JavaScript exceptions

4. **Admin Dashboard Test:**
   - Go to: `https://aib-axysafrica.com/admin/login`
   - Log in with credentials
   - Verify dashboard loads
   - Check admin features

5. **Mobile Test:**
   - Test on actual mobile device OR
   - Use browser responsive mode (F12 → Device Toggle)
   - Verify mobile layout works

### STEP 5.3: Functional Testing

**Critical User Paths:**
- [ ] Contact form submission
- [ ] Research paper downloads
- [ ] Exchange rates display correctly
- [ ] Admin can log in
- [ ] Admin can manage content

**Performance Check:**
```bash
# On server, check resource usage:
top
# Press 'q' to exit

# Check disk space:
df -h

# Check memory:
free -h
```

### STEP 5.4: Exit SSH

**Once everything is verified:**
```bash
exit
# This closes the SSH connection
# The Next.js process continues running (thanks to nohup)
```

---

## 6. ROLLBACK STRATEGY

**If deployment fails or causes issues, follow this procedure:**

### OPTION A: Quick Rollback (Restart Old Process)

**If build fails but old code still works:**

```bash
# 1. Connect to server
ssh -i id_aib-axys aib-axysafrica@aib-axysafrica.com

# 2. Don't rebuild, just restart existing process
ss -tulnp | grep :3000
kill <PID>
nohup npm run start &

# 3. Verify old version is working
# 4. Fix issues locally and re-deploy
```

### OPTION B: File-Level Rollback

**If you uploaded bad files:**

```bash
# 1. Connect via SFTP
# 2. Delete the bad files you uploaded
# 3. Re-upload previous working versions
# 4. Rebuild on server:
cd ~/site
npm run build
# 5. Restart process (Section 4)
```

### OPTION C: Full Rollback (Site Backup)

**If major issues require full restoration:**

```bash
# 1. Connect via SSH
ssh -i id_aib-axys aib-axysafrica@aib-axysafrica.com

# 2. Stop current process
ss -tulnp | grep :3000
kill -9 <PID>

# 3. Rename broken version
cd ~
mv site site_broken_$(date +%Y%m%d_%H%M%S)

# 4. Restore backup (if you created one)
# Option 4a: Copy from backup
cp -r site_backup site

# Option 4b: Re-download from repository
git clone <repository-url> site

# 5. Install dependencies
cd site
npm install

# 6. Build
npm run build

# 7. Start process
nohup npm run start &

# 8. Verify working
tail -f nohup.out
```

### Creating Pre-Deployment Backup

**Before risky deployments, create backup:**

```bash
ssh -i id_aib-axys aib-axysafrica@aib-axysafrica.com
cd ~
cp -r site site_backup_$(date +%Y%m%d_%H%M%S)

# Verify backup created
ls -la | grep site
```

---

## 7. TROUBLESHOOTING

### Problem: "Permission denied" during file upload

**Cause:** File permissions issue

**Solution:**
```bash
# SSH into server
ssh -i id_aib-axys aib-axysafrica@aib-axysafrica.com

# Check permissions
ls -la ~/site

# Fix permissions (if needed)
chmod -R 755 ~/site
chown -R aib-axysafrica:aib-axysafrica ~/site

# Retry upload
```

### Problem: Build fails with "Module not found"

**Cause:** Missing npm package

**Solution:**
```bash
cd ~/site
npm install
npm run build
```

### Problem: Old content still showing after deployment

**Cause:** Browser cache or deployment not completed

**Solution:**
```bash
# 1. Hard refresh browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

# 2. Clear Next.js cache on server:
ssh -i id_aib-axys aib-axysafrica@aib-axysafrica.com
cd ~/site
rm -rf .next
npm run build
# Then restart process (Section 4)

# 3. Clear browser data:
# Chrome: Settings → Privacy → Clear browsing data
```

### Problem: Port 3000 already in use

**Cause:** Old process still running

**Solution:**
```bash
# Find and kill all node processes
ps aux | grep node
kill -9 <PID>

# Or kill all at once
pkill -f "node"

# Verify port is free
ss -tulnp | grep :3000
# Should return nothing

# Start new process
cd ~/site
nohup npm run start &
```

### Problem: "Cannot connect to MongoDB"

**Cause:** Database connection issue

**Solution:**
```bash
# 1. Check if MongoDB is running
sudo systemctl status mongod

# 2. Start MongoDB if stopped
sudo systemctl start mongod

# 3. Check .env file
cat ~/site/.env | grep MONGO_URL

# 4. Test connection
mongo  # or mongosh (newer versions)

# 5. Restart Next.js process
```

### Problem: Site loads but shows 500 error

**Cause:** Runtime error in code

**Solution:**
```bash
# Check logs for error details
tail -f ~/site/nohup.out

# Look for stack trace
cat ~/site/nohup.out | grep -A 20 ERROR

# Common causes:
# - Database connection failed
# - Environment variable missing
# - API route error
# - Invalid data in database

# Fix identified issue and redeploy
```

### Problem: Deployment worked but feature not showing

**Checklist:**
1. Did you upload the correct file?
2. Did you rebuild (`npm run build`)?
3. Did you restart the process?
4. Did you clear browser cache?
5. Are you viewing the correct URL (not localhost)?

---

## 8. RECENT UPDATES & FIXES

**Latest Changes (January 29, 2026):**

### RBAC System Implementation
- **New Feature:** Dynamic Role-Based Access Control
- **Impact:** Super Admins can now create custom roles with granular permissions
- **Files Added:**
  - `/lib/permissions.js` - 38 permissions across 13 categories
  - `/models/Role.js` - Role model with permissions array
  - `/api/admin/roles/route.js` - Role management API
  - `/scripts/seed-roles.js` - Migration script
  - `/admin/settings/roles/page.js` - Role management UI
- **Files Modified:**
  - `/models/Admin.js` - Role field now ObjectId reference
  - `/lib/auth.js` - Added permission checking functions
  - `/api/auth/login/route.js` - JWT includes permissions
  - `/api/admin/users/route.js` - Uses roleId instead of role string
  - `/components/AdminSidebar.js` - Super Admin filtering

**Migration Required (ONE-TIME):**
```bash
# SSH into server
ssh -i id_aib-axys aib-axysafrica@aib-axysafrica.com
cd ~/site

# Run migration script
node scripts/seed-roles.js

# Expected output:
# ✅ Created system role: Super Admin (38 permissions)
# ✅ Created system role: Admin (29 permissions)
# ✅ Created system role: Viewer (8 permissions)
# ✅ Migrated X admin users
```

**Testing After Deployment:**
1. Login as super admin
2. Verify "Roles" link appears in sidebar
3. Navigate to Roles page → Should show 3 system roles
4. Create a test custom role
5. Verify custom role creation works

### Mobile Swipe Navigation Update
- **File:** `/components/SwipeNavigation.js`
- **Change:** Updated page routes to include all new pages and subpages
- **Impact:** Mobile users can now swipe through all pages including:
  - Fund Account subpages (Local Stocks, Multi-Currency, International Equities, Offshore Funds)
  - New pages (Global Markets, Research, Downloads, Exchange Rates)
- **Testing:** Verify swipe navigation works on mobile devices

### Loading Animation Consistency Fix
- **Files:** `/components/RouteLoadingWrapper.js`, `/components/LoadingPage.js`
- **Change:** Loading animation now waits for actual content to load before disappearing
- **Previous Issue:** Animation would timeout prematurely in certain areas
- **Current Behavior:** 
  - Animation stays visible until content fully loads
  - Checks for document.readyState === 'complete'
  - Waits for all images to load
  - Maximum 3-second timeout as safety fallback
- **Testing:** Verify loading screen consistency across all pages

**If Deploying These Changes:**
```bash
# Upload all modified files (see files list above)
# Upload new files (seed-roles.js, permissions.js, Role.js, etc.)

# Then rebuild on server:
cd ~/site
npm run build

# CRITICAL: Run migration before restarting
node scripts/seed-roles.js

# Restart process (see Section 4)
```

---

## 9. EMERGENCY CONTACTS

**In case of critical deployment failure:**

**Primary Contact:**
- **Role:** DevOps Lead / System Administrator
- **Availability:** 24/7 for production emergencies

**Secondary Contact:**
- **Role:** Technical Lead / Senior Developer

**Escalation Path:**
1. Check logs (Section 5.1)
2. Attempt rollback (Section 6)
3. Contact DevOps Lead
4. If unavailable, contact Technical Lead
5. Document all actions taken

---

## 10. DEPLOYMENT LOG TEMPLATE

**Keep a record of all deployments:**

```
Date: _______________
Time: _______________
Deployed By: _______________

Changes Deployed:
□ Bug fixes
□ New features
□ Content updates
□ Dependency updates
□ Configuration changes

Files Changed:
- 
- 
- 

Build Status: [ ] Success [ ] Failed
Restart Status: [ ] Success [ ] Failed
Verification Status: [ ] Passed [ ] Failed

Issues Encountered:


Resolution:


Deployment Duration: _______ minutes

Sign-off: _______________
```

---

## 11. BEST PRACTICES

**Do:**
- ✅ Test everything locally first
- ✅ Deploy during low-traffic hours
- ✅ Create backups before major changes
- ✅ Monitor logs after deployment
- ✅ Test mobile and desktop versions
- ✅ Communicate with team before deployment
- ✅ Document all changes in deployment log

**Don't:**
- ❌ Deploy directly to production without local testing
- ❌ Upload .next or node_modules folders
- ❌ Skip the rebuild step on server
- ❌ Forget to restart the process
- ❌ Deploy during peak traffic hours
- ❌ Make changes directly on server via SSH editing
- ❌ Delete .env file on server

---

## 12. QUICK REFERENCE COMMANDS

**SSH Connection:**
```bash
ssh -i id_aib-axys aib-axysafrica@aib-axysafrica.com
```

**Navigate to Site:**
```bash
cd ~/site
```

**Build:**
```bash
npm run build
```

**Check Process:**
```bash
ss -tulnp | grep :3000
```

**Kill Process:**
```bash
kill <PID>
```

**Start Process:**
```bash
nohup npm run start &
```

**View Logs:**
```bash
tail -f ~/site/nohup.out
```

**Exit SSH:**
```bash
exit
```

---

**END OF DEPLOYMENT SOP**

*Review this document regularly and update with lessons learned from deployments.*

---

**Document Revision History:**

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-01-20 | Initial version | DevOps Team |
| 2.0 | 2026-01-29 | Added troubleshooting, rollback procedures | DevOps Team |
