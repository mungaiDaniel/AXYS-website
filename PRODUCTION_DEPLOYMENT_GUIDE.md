# AIB-AXYS AFRICA - PRODUCTION DEPLOYMENT GUIDE

**Project:** AIB-AXYS Africa Financial Website  
**Version:** 2.0  
**Last Updated:** January 26, 2026  
**Framework:** Next.js 16.1.4  
**Database:** MongoDB  
**Server:** aib-axysafrica.com  

---

## IMPORTANT NOTES BEFORE DEPLOYMENT

⚠️ **CRITICAL:** This guide is for deploying to the production server at `aib-axysafrica.com`

**Prerequisites:**
- SSH Identity file (provided separately as `id_aib-axys`)
- SFTP client (FileZilla recommended)
- SSH terminal access
- Local development environment set up

**Security Notes:**
- All critical and high-severity vulnerabilities have been fixed
- GDPR endpoint now requires email verification
- Rate limiting implemented on login and downloads
- Audit logging active on all sensitive operations

---

## Section 1: Setup Your Local Environment

**Purpose:** Prepare a local development environment that mirrors the deployment server for testing updates.

### 1. Securely log into your deployment server

**Credentials:**
- **Server Address:** `aib-axysafrica.com`
- **Username:** `aib-axysafrica`
- **Authentication:** SSH Key (Identity file sent along with this document: `id_aib-axys`)
- **Protocol:** SFTP (port 22)

**Recommended SFTP Client:**
- **FileZilla:** https://filezilla-project.org/download.php

**FileZilla Connection Settings:**
- Host: `aib-axysafrica.com`
- Protocol: SFTP - SSH File Transfer Protocol
- Logon Type: Key file
- User: `aib-axysafrica`
- Key file: Browse and select `id_aib-axys`
- Port: 22

### 2. Download current production files

**Action:** Download all files within the `site` folder to your local machine.

**IMPORTANT EXCLUSIONS:**
- **DO NOT DOWNLOAD** the `.next` folder (build artifacts)
- **DO NOT DOWNLOAD** the `node_modules` folder (dependencies)

**Reason:** These folders are auto-generated and will be rebuilt. Downloading them wastes time and bandwidth.

**Outcome:** Your local environment will now be similar to the deployment environment, allowing you to test updates safely before deploying to production.

---

## Section 2: Updating Server Environment

**Purpose:** Upload local updates to the server and rebuild the website.

### 1. Upload updated files

**Tool:** SFTP client (FileZilla or equivalent)

**Action:** Upload *only* the files you have modified or updated.

**CRITICAL EXCLUSIONS:**
- **DO NOT UPLOAD** the `.next` folder
- **DO NOT UPLOAD** the `node_modules` folder

**Reason:** These will be regenerated during the build process. Uploading them can cause conflicts or deployment failures.

**Common Files to Upload:**
- `/app/` directory (pages, components, API routes)
- `/components/` directory
- `/lib/` directory
- `/models/` directory
- `/public/` directory (images, assets)
- `package.json` (if dependencies changed)
- `next.config.js` (if configuration changed)
- `.env` file (if environment variables changed)

### 2. Connect to the server via SSH

**Command:**
```bash
ssh -i id_aib-axys aib-axysafrica@aib-axysafrica.com
```

**Note:** Ensure the identity file `id_aib-axys` has proper permissions:
```bash
chmod 600 id_aib-axys
```

**Troubleshooting:**
- If you get "Permission denied (publickey)" error, verify the key file path and permissions
- If you get "Host key verification failed", add `-o StrictHostKeyChecking=no` flag (first time only)

### 3. Navigate to the site folder

**Command:**
```bash
cd ~/site
```

**Explanation:** This changes the current directory to `~/site` on the server, where the website files are located.

**Verify location:**
```bash
pwd
# Should output: /home/aib-axysafrica/site
```

### 4. Install dependencies (if package.json changed)

**Command:**
```bash
npm install
```

**OR if using yarn:**
```bash
yarn install
```

**When to run:** Only if you updated `package.json` with new dependencies or version changes.

**Note:** This may take 2-5 minutes depending on the number of changes.

### 5. Rebuild the website

**Command:**
```bash
npm run build
```

**Explanation:** This executes the `build` script in `package.json`, which:
- Compiles all React/Next.js code
- Optimizes assets and images
- Generates production-ready files in `.next` folder
- Validates all routes and API endpoints

**Expected Output:**
```
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages (X/X)
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                   XXX kB        XXX kB
├ ○ /about                              XXX kB        XXX kB
...
```

**Action:** Take note of any errors and correct the files before proceeding.

**Common Errors:**
- **Syntax errors:** Fix in code and re-upload
- **Missing dependencies:** Run `npm install` again
- **Environment variable missing:** Check `.env` file
- **MongoDB connection error:** Verify `MONGO_URL` in `.env`

**Do NOT proceed if build fails.** Fix all errors first.

---

## Section 3: Updating the Website (Deployment)

**Purpose:** Restart the website to apply the changes made during the build process.

### 1. Identify the running process ID (PID)

**Command:**
```bash
ss -tulnp | grep :3000
```

**Explanation:**
- `ss`: Socket investigation utility
- `-tulnp`: Shows TCP, UDP, listening ports, numeric addresses, and process info
- `| grep :3000`: Filters for the Next.js process running on port 3000

**Example Output:**
```
tcp   LISTEN 0   511   0.0.0.0:3000   0.0.0.0:*   users:(("node",pid=104837,fd=19))
```

**Outcome:** This command reveals the site's process ID (PID). In the example above, the PID is **104837**.

### 2. Shutdown the current site process

**Command Pattern:**
```bash
kill <enter pid>
```

**Example:**
```bash
kill 104837
```

**Explanation:** This terminates the currently running website process gracefully.

**Verification:** Wait 2-3 seconds, then check if process stopped:
```bash
ss -tulnp | grep :3000
# Should return nothing if successfully stopped
```

**If process doesn't stop:** Use force kill:
```bash
kill -9 104837
```

### 3. Restart the website in the background

**Command:**
```bash
nohup npm run start &
```

**Explanation:**
- `nohup`: "No hang up" - keeps the process running even after SSH session closes
- `npm run start`: Starts the Next.js production server
- `&`: Runs in background, allowing terminal to be used for other commands

**Expected Output:**
```
nohup: ignoring input and appending output to 'nohup.out'
[1] 105234
```

**Note the new PID:** In the example above, the new PID is **105234**.

### 4. Verify deployment success

**Command:**
```bash
# Check if process is running
ss -tulnp | grep :3000

# View startup logs
tail -f nohup.out
```

**Press Ctrl+C to exit log viewing.**

**Expected in nohup.out:**
```
▲ Next.js 16.1.4
- Local:        http://localhost:3000
- Network:      http://0.0.0.0:3000

✓ Ready in 1500ms
```

### 5. Test the website

**In your browser:**
- Visit: `https://aib-axysafrica.com`
- Check homepage loads correctly
- Test navigation (dropdowns should work)
- Verify admin panel: `https://aib-axysafrica.com/admin/login`

**Basic Health Check:**
```bash
curl -I https://aib-axysafrica.com
# Should return: HTTP/2 200
```

### 6. Exit SSH session

**Command:**
```bash
exit
```

**Note:** The website will continue running in the background thanks to `nohup`.

---

## CRITICAL DEPLOYMENT CHECKLIST

**Before Every Deployment:**

- [ ] Test all changes in local development environment
- [ ] Run `npm run build` locally to check for errors
- [ ] Backup current production files (download via SFTP)
- [ ] Verify `.env` file has correct production values
- [ ] Check `package.json` for dependency changes

**During Deployment:**

- [ ] Upload only modified files (NOT .next or node_modules)
- [ ] Connect via SSH with correct identity file
- [ ] Navigate to ~/site directory
- [ ] Run `npm install` (if package.json changed)
- [ ] Run `npm run build` (MUST succeed before proceeding)
- [ ] Identify current PID (`ss -tulnp | grep :3000`)
- [ ] Kill old process (`kill <pid>`)
- [ ] Start new process (`nohup npm run start &`)
- [ ] Verify new process running
- [ ] Test website in browser

**After Deployment:**

- [ ] Check website loads: https://aib-axysafrica.com
- [ ] Test admin panel login
- [ ] Verify new features work
- [ ] Check browser console for errors
- [ ] Monitor nohup.out for any runtime errors
- [ ] Keep SSH session open for 5 minutes to monitor

---

## CRITICAL NOTES

### Commands 3-5 MUST Be Executed for Redeploy

It is **CRITICAL** to run the following commands in sequence for the website to **redeploy** properly:

```bash
# Command 3: Build
npm run build

# Command 4: Kill old process
kill <pid>

# Command 5: Start new process
nohup npm run start &
```

**Why this is critical:**
- Build generates new optimized code
- Old process must be stopped to release port 3000
- New process must start to serve updated code
- **Especially important** for updates to:
  - Admin panel files
  - Research papers (to make them available for download)
  - API routes
  - Database models
  - Configuration changes

**Failure to restart** = Changes NOT visible to users!

---

## ENVIRONMENT VARIABLES (.env)

**Critical Variables:**

```env
MONGO_URL=mongodb://localhost:27017/aib-axys
DB_NAME=aib-axys
NEXT_PUBLIC_BASE_URL=https://aib-axysafrica.com
CORS_ORIGINS=https://aib-axysafrica.com,https://www.aib-axysafrica.com
JWT_SECRET=<generate-64-byte-random-hex>
CONTACT_EMAIL_DEFAULT=info@axysinvestmentbank.com
CONTACT_EMAIL_GENERAL=feedback@aib-axysafrica.com
```

**IMPORTANT:**
- Update `NEXT_PUBLIC_BASE_URL` to production domain
- Generate new `JWT_SECRET` before production:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
- Restrict `CORS_ORIGINS` to your actual domain (not *)
- Configure SMTP settings if email functionality needed

---

## AUTOMATED DEPLOYMENT (Using Scripts)

**The project includes automated deployment scripts for easier deployment:**

### Option A: Use deploy.sh (Recommended)

**Command:**
```bash
cd ~/site
bash scripts/deploy.sh
```

**What it does automatically:**
1. Creates timestamped backup
2. Pulls latest changes (if git configured)
3. Installs dependencies
4. Runs database migrations (if any)
5. Builds application
6. Restarts services
7. Performs health check
8. Cleans old backups

**Advantages:**
- Automatic backup before deployment
- Error handling and rollback capability
- Health checks after deployment
- One command deployment

### Option B: Manual Deployment (As Described Above)

Use the manual steps if you need more control or if scripts are not available.

---

## HEALTH MONITORING

**After deployment, monitor system health:**

```bash
# Run health check script
bash scripts/health-check.sh

# Or manually check:
curl https://aib-axysafrica.com
ss -tulnp | grep :3000
tail -n 50 nohup.out
```

**Check for:**
- ✅ Website responds (200 status)
- ✅ Process is running on port 3000
- ✅ No errors in nohup.out
- ✅ MongoDB connected successfully

---

## TROUBLESHOOTING

### Website not loading after deployment

**Check:**
```bash
# Is the process running?
ss -tulnp | grep :3000

# If not, check for errors:
tail -n 100 nohup.out

# Check if port is blocked:
sudo netstat -tulnp | grep :3000
```

**Common Issues:**
- Port 3000 already in use → Kill old process properly
- Build errors → Check nohup.out for compilation errors
- MongoDB not connected → Verify MONGO_URL in .env
- Permission errors → Check file ownership: `ls -la`

### Build fails with errors

**Actions:**
1. Read error message carefully
2. Fix syntax/import errors in code
3. Verify all dependencies installed: `npm install`
4. Check Node.js version: `node --version` (should be 18+)
5. Try clean build: `rm -rf .next && npm run build`

### Changes not visible after deployment

**Checklist:**
- [ ] Did you run `npm run build`?
- [ ] Did you kill the old process?
- [ ] Did you start the new process?
- [ ] Clear browser cache (Ctrl+Shift+R)
- [ ] Check correct URL (https not http)

---

## ROLLBACK PROCEDURE

**If deployment fails:**

### Option A: Using deploy.sh backups

```bash
# List backups
ls -lah ~/backups/

# Restore from backup
cd ~/
tar -xzf backups/backup_YYYYMMDD_HHMMSS.tar.gz

# Restart
cd site
kill <current_pid>
nohup npm run start &
```

### Option B: Manual rollback

1. Download previous working version via SFTP
2. Upload to server (overwrite current files)
3. Rebuild: `npm run build`
4. Restart process

---

## MAINTENANCE COMMANDS

**View logs:**
```bash
tail -f nohup.out          # Live logs
tail -n 100 nohup.out      # Last 100 lines
```

**Restart website:**
```bash
# Find PID
ss -tulnp | grep :3000

# Restart
kill <pid>
nohup npm run start &
```

**Check disk space:**
```bash
df -h
```

**Check memory:**
```bash
free -h
```

**Database status:**
```bash
sudo systemctl status mongodb
```

---

## SECURITY CHECKLIST FOR PRODUCTION

### Before First Deployment

- [ ] **Update JWT_SECRET** to cryptographically random value (64 bytes)
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```
- [ ] **Restrict CORS_ORIGINS** to actual domain (remove *)
- [ ] **Configure SMTP** for email functionality (optional)
- [ ] **Verify MongoDB** has authentication enabled in production
- [ ] **Set NODE_ENV=production** in environment

### Security Features Active (Verified)

- ✅ GDPR endpoint requires email verification tokens
- ✅ Login rate limiting (5 attempts per 5 minutes)
- ✅ Download rate limiting (10 per minute)
- ✅ Contact form rate limiting (5 per minute)
- ✅ Input validation on exchange rates
- ✅ Audit logging on sensitive operations
- ✅ Password hashing (bcrypt, 10 rounds)
- ✅ HTTP-only JWT cookies
- ✅ Security headers (HSTS, CSP, X-Frame-Options, etc.)
- ✅ No hardcoded secrets in codebase

---

## ADMIN PANEL ACCESS

**URL:** `https://aib-axysafrica.com/admin/login`

**Default Credentials (Change After First Login):**
- **Email:** sk@horizonafrica.com
- **Password:** Admin@2026

**IMPORTANT:** Create new admin users and disable default account after deployment.

**Admin Features:**
- Dashboard analytics
- Contact management with advanced export (CSV, Pipe-CSV, Excel)
- Research paper management (9 categories)
- Exchange rate management (USD, EUR, GBP)
- User management (super-admin only)
- Page visibility controls
- GDPR data management
- Audit log viewing

---

## API ENDPOINTS VERIFICATION

**After deployment, test critical endpoints:**

```bash
# Public endpoints
curl https://aib-axysafrica.com/api/page-visibility
curl https://aib-axysafrica.com/api/exchange-rates
curl https://aib-axysafrica.com/api/research

# Should all return 200 with JSON data
```

**Protected endpoints (require authentication):**
```bash
# These should return 401 Unauthorized without auth cookie
curl https://aib-axysafrica.com/api/admin/dashboard
curl https://aib-axysafrica.com/api/admin/contacts
```

---

## BACKUP STRATEGY

### Automated Backups (deploy.sh)

**Location:** `~/backups/`  
**Format:** `backup_YYYYMMDD_HHMMSS.tar.gz`  
**Retention:** Last 5 backups kept automatically  

**Manual Backup:**
```bash
cd ~
tar -czf backup_$(date +%Y%m%d_%H%M%S).tar.gz \
  --exclude='site/node_modules' \
  --exclude='site/.next' \
  site/
```

**Restore Backup:**
```bash
tar -xzf backup_YYYYMMDD_HHMMSS.tar.gz
```

---

## MONGODB OPERATIONS

**Connection:**
```bash
mongosh mongodb://localhost:27017/aib-axys
```

**Common Operations:**
```javascript
// View collections
show collections

// Count contacts
db.contacts.countDocuments()

// View recent contacts
db.contacts.find().sort({createdAt:-1}).limit(5)

// View audit logs
db.auditlogs.find().sort({timestamp:-1}).limit(10)

// Check exchange rates
db.exchangerates.find()

// Exit
exit
```

---

## PRODUCTION DEPLOYMENT WORKFLOW (SUMMARY)

**Standard Deployment Process:**

```bash
# 1. LOCAL: Test changes
npm run build
npm run start
# Test in browser at localhost:3000

# 2. UPLOAD: Transfer files
# Use SFTP to upload modified files
# EXCLUDE: .next and node_modules

# 3. SSH: Connect to server
ssh -i id_aib-axys aib-axysafrica@aib-axysafrica.com

# 4. NAVIGATE: Go to site folder
cd ~/site

# 5. INSTALL: Update dependencies (if needed)
npm install

# 6. BUILD: Rebuild application
npm run build
# MUST succeed - fix any errors before proceeding

# 7. FIND PID: Identify running process
ss -tulnp | grep :3000
# Note the PID number

# 8. SHUTDOWN: Stop old process
kill 104837  # Replace with actual PID

# 9. RESTART: Start new process
nohup npm run start &

# 10. VERIFY: Check deployment
tail -f nohup.out
# Press Ctrl+C after seeing "Ready"

# 11. TEST: Verify in browser
# Visit https://aib-axysafrica.com

# 12. EXIT: Close SSH session
exit
```

**Total Time:** ~10-15 minutes per deployment

---

## EMERGENCY PROCEDURES

### Website is Down

```bash
# 1. SSH into server
ssh -i id_aib-axys aib-axysafrica@aib-axysafrica.com

# 2. Check process status
ss -tulnp | grep :3000

# 3. Check logs for errors
tail -n 100 nohup.out

# 4. Restart if needed
cd ~/site
nohup npm run start &

# 5. If still failing, check MongoDB
sudo systemctl status mongodb
```

### Rollback to Previous Version

```bash
# 1. Stop current process
kill <pid>

# 2. Restore backup
cd ~
tar -xzf backups/backup_<timestamp>.tar.gz

# 3. Restart
cd site
npm install
npm run build
nohup npm run start &
```

---

## SUPPORT CONTACTS

**For deployment issues:**
- Technical Lead: [Contact Information]
- System Administrator: [Contact Information]

**For application issues:**
- Review security audit documentation
- Check audit logs: `/admin/audit-logs`
- View system logs: `nohup.out`

---

## VERSION HISTORY

| Version | Date | Changes | Deployed By |
|---------|------|---------|-------------|
| 2.0 | Jan 26, 2026 | Security fixes, Next.js 16.1.4, new features | - |
| 1.0 | Jan 21, 2026 | Initial production deployment | - |

---

**END OF DEPLOYMENT GUIDE**

**Always test in local environment before production deployment!**
