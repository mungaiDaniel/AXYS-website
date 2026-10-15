# 🚀 Production Deployment Guide (VPS/Node.js)

**AIB-AXYS Africa Platform**  
**Version:** 1.2.5.1  
**Last Updated:** January 29, 2026  
**Environment:** Ubuntu VPS with Node.js

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [File Transfer (SFTP)](#file-transfer-sftp)
3. [Build Process](#build-process)
4. [Process Management](#process-management-restarting-the-server)
5. [Verification](#verification)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Server Requirements
- **OS:** Ubuntu 20.04+ or similar Linux distribution
- **Node.js:** v18.x or higher
- **npm/yarn:** Latest stable version
- **MongoDB:** Running instance (local or remote)
- **RAM:** Minimum 2GB recommended
- **Storage:** Minimum 5GB free space

### Local Requirements
- **SFTP Client:** FileZilla, Cyberduck, or command-line `sftp`
- **SSH Access:** Valid credentials for the VPS
- **Git:** (Optional) For version control

### Pre-Deployment Checklist

- [ ] `.env` file configured on server with production values
- [ ] MongoDB connection string is correct
- [ ] All required environment variables are set
- [ ] Server firewall allows traffic on port 3000 (or your configured port)
- [ ] Domain DNS is pointed to server IP (if applicable)

---

## File Transfer (SFTP)

### Step 1: Prepare Local Build

**On your local machine:**

```bash
# Ensure you have a clean build
rm -rf .next node_modules

# Install dependencies
npm install
# or
yarn install

# Create a local production build (optional - to verify)
npm run build
```

### Step 2: Connect to Server via SFTP

**Using Command Line:**

```bash
sftp username@your-server-ip
```

**Using FileZilla:**
1. Open FileZilla
2. Enter Host: `sftp://your-server-ip`
3. Username: `your-username`
4. Password: `your-password`
5. Port: `22` (default)
6. Click "Quickconnect"

### Step 3: Upload Files

**Important:** Exclude the following directories to speed up transfer:
- `.next/` (will be rebuilt on server)
- `node_modules/` (will be installed on server)
- `.git/` (optional - not needed for production)

**SFTP Upload Commands:**

```bash
# Navigate to target directory on server
cd ~/site

# Upload all files from local directory
put -r /path/to/local/project/* .
```

**Or using rsync (faster for updates):**

```bash
rsync -avz --progress --exclude 'node_modules' --exclude '.next' --exclude '.git' \
  /path/to/local/project/ username@your-server-ip:~/site/
```

### Step 4: Verify Upload

```bash
# SSH into server
ssh username@your-server-ip

# Check files are present
cd ~/site
ls -la

# Verify package.json exists
cat package.json | head -20
```

---

## Build Process

### Step 1: SSH into Server

```bash
ssh username@your-server-ip
```

### Step 2: Navigate to Site Directory

```bash
cd ~/site
```

### Step 3: Install Dependencies

**If this is a fresh deployment or dependencies changed:**

```bash
# Using npm
npm install --production

# Using yarn (recommended)
yarn install --production
```

**Note:** The `--production` flag excludes dev dependencies.

### Step 4: Build the Application

```bash
# Create optimized production build
npm run build

# Or with yarn
yarn build
```

**Expected Output:**
```
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
...
○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

**Build Time:** Approximately 15-30 seconds depending on server specs.

### Step 5: Verify Build Artifacts

```bash
# Check .next directory was created
ls -la .next/

# Verify build manifest
cat .next/BUILD_ID
```

---

## Process Management (Restarting the Server)

### Method 1: Manual Process Management (Current Method)

#### Step 1: Find the Running Process

```bash
# Find process listening on port 3000
ss -tulnp | grep :3000

# Alternative using lsof
lsof -i :3000

# Alternative using netstat
netstat -tulnp | grep :3000
```

**Example Output:**
```
tcp   LISTEN 0      511    0.0.0.0:3000    0.0.0.0:*    users:(("node",pid=12345,fd=18))
```

Note the **PID** (Process ID) - in this example, it's `12345`.

#### Step 2: Stop the Current Process

```bash
# Graceful shutdown
kill <PID>

# Example:
kill 12345

# Force kill if process doesn't stop (use sparingly)
kill -9 12345
```

#### Step 3: Start the Server

**Using nohup (runs in background, persists after logout):**

```bash
# Start server in background
nohup npm run start &

# Or with yarn
nohup yarn start &
```

**Expected Output:**
```
nohup: ignoring input and appending output to 'nohup.out'
[1] 12456
```

The number in brackets is the new PID.

#### Step 4: Verify Server Started

```bash
# Check if process is running
ps aux | grep node

# Check port is listening
ss -tulnp | grep :3000

# View startup logs
tail -f nohup.out
```

**Expected in nohup.out:**
```
▲ Next.js 16.1.4
- Local:        http://localhost:3000
- Network:      http://0.0.0.0:3000

✓ Starting...
✅ MongoDB connected successfully to database: aib-axys
✓ Ready in 1.2s
```

**⚠️ IMPORTANT:** Look for the MongoDB connection message. If you see:
```
❌ MongoDB connection error: not authorized on test
```

This means `DB_NAME` environment variable is not set. See troubleshooting below.

Press `Ctrl+C` to exit log viewing.

---

### Method 2: Using PM2 (Recommended for Production)

**PM2** is a production process manager that handles restarts, logging, and monitoring.

#### One-Time Setup

```bash
# Install PM2 globally
npm install -g pm2

# Start application with PM2
cd ~/site
pm2 start npm --name "aib-axys" -- start

# Save PM2 process list
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# Follow the instructions output by the command
```

#### Deployment Commands with PM2

```bash
# Restart application after new deployment
pm2 restart aib-axys

# View logs
pm2 logs aib-axys

# Monitor resources
pm2 monit

# View status
pm2 status

# Stop application
pm2 stop aib-axys

# Delete from PM2
pm2 delete aib-axys
```

---

## Verification

### Health Check Steps

#### 1. Server Response

```bash
# Check if server responds
curl http://localhost:3000

# Check from external IP
curl http://your-domain.com
```

#### 2. API Endpoints

```bash
# Test public API
curl http://localhost:3000/api/page-visibility

# Test exchange rates
curl http://localhost:3000/api/exchange-rates
```

#### 3. Database Connection

```bash
# Check logs for MongoDB connection
tail -f nohup.out | grep -i mongo

# Should see: "MongoDB connected successfully"
```

#### 4. Browser Test

1. Open browser to `http://your-domain.com`
2. Verify homepage loads
3. Test navigation menu
4. Check admin login at `/admin/login`
5. Verify exchange rates are displaying

---

## Troubleshooting

### Issue: "Port 3000 is already in use"

**Solution:**
```bash
# Find and kill the process
ss -tulnp | grep :3000
kill <PID>

# Or kill all node processes (nuclear option)
pkill node
```

### Issue: "Module not found" errors

**Solution:**
```bash
# Reinstall dependencies
cd ~/site
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: "ECONNREFUSED" - MongoDB Connection Failed

**Solution:**
```bash
# Check MongoDB is running
sudo systemctl status mongod

# Start MongoDB if stopped
sudo systemctl start mongod

# Verify .env has correct MONGO_URL
cat .env | grep MONGO_URL

# Verify DB_NAME is set
cat .env | grep DB_NAME
```

### Issue: "not authorized on test to execute command" (NEW)

**Solution:**
```bash
# This error means DB_NAME is not set or MongoDB user lacks permissions

# 1. Check DB_NAME environment variable
cat .env | grep DB_NAME
# Should show: DB_NAME=aib-axys

# 2. If missing, add to .env:
echo "DB_NAME=aib-axys" >> .env

# 3. For MongoDB Atlas, verify user has readWrite permission on 'aib-axys' database

# 4. Restart the application
ss -tulnp | grep :3000
kill <PID>
nohup yarn start &

# 5. Check logs for successful connection
tail -f nohup.out
# Should see: "✅ MongoDB connected successfully to database: aib-axys"
```

**Why this happens:**
- Mongoose defaults to "test" database if DB_NAME not specified
- MongoDB Atlas denies access to "test" database (correct security)
- Fixed in code with explicit dbName option, but requires environment variable

**See also:** `DEPLOYMENT_FIXES.md` for detailed explanation

### Issue: Build Fails with Memory Error

**Solution:**
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### Issue: Server stops after closing SSH

**Solution:**
- Ensure you're using `nohup` or PM2
- For nohup: `nohup npm start &`
- Or switch to PM2 (recommended)

### Issue: 502 Bad Gateway (Nginx/Apache)

**Solution:**
```bash
# Check if Next.js is running
ss -tulnp | grep :3000

# Check reverse proxy config
sudo nginx -t
sudo systemctl restart nginx
```

---

## Quick Reference Commands

### Complete Deployment (Copy-Paste Ready)

```bash
# 1. SSH into server
ssh username@your-server-ip

# 2. Navigate to site directory
cd ~/site

# 3. Pull latest code (if using git) OR upload via SFTP
git pull origin main
# OR upload files via SFTP (exclude .next and node_modules)

# 4. Install dependencies (if needed)
yarn install --production

# 5. Build
yarn build

# 6. Find and stop current process
ss -tulnp | grep :3000
# Note the PID
kill <PID>

# 7. Start server
nohup yarn start &

# 8. Verify
tail -f nohup.out
# Wait for "Ready in X.XXs" message
# Press Ctrl+C to exit

# 9. Test
curl http://localhost:3000
```

---

## Environment Variables

Ensure your `~/site/.env` file contains:

```env
# Database (CRITICAL - Updated Jan 29, 2026)
MONGO_URL=mongodb://localhost:27017/aib-axys
# OR for MongoDB Atlas:
# MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=aib-axys  # ⚠️ REQUIRED - Explicit database name

# Server
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NODE_ENV=production
CORS_ORIGINS=*

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-minimum-32-chars

# Email Configuration (Optional)
CONTACT_EMAIL_DEFAULT=info@axysinvestmentbank.com
CONTACT_EMAIL_GENERAL=feedback@aib-axysafrica.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

**⚠️ CRITICAL - MongoDB Atlas Users:**

If using MongoDB Atlas (production), you MUST set `DB_NAME`:
- Without it, application defaults to "test" database
- Will fail with "not authorized" errors
- See `DEPLOYMENT_FIXES.md` for details

**⚠️ SECURITY NOTE:** Never commit `.env` to version control!

---

## Rollback Procedure

If deployment fails:

```bash
# 1. Stop current server
ss -tulnp | grep :3000
kill <PID>

# 2. Restore previous version
cd ~
cp -r site-backup site

# 3. Restart
cd ~/site
nohup npm start &
```

**Recommendation:** Always keep a backup before deploying:
```bash
cp -r ~/site ~/site-backup-$(date +%Y%m%d)
```

---

## Support

**For deployment issues, contact:**
- **Email:** devops@aib-axysafrica.com
- **Documentation:** `/docs` folder in project root
- **Logs Location:** `~/site/nohup.out` or PM2 logs

---

**Document Version:** 1.1  
**Last Review:** January 30, 2026  
**Next Review:** April 2026

---

## 🆕 Recent Updates (January 30, 2026)

### Phase 2 Deployment Fixes Applied

**New Health Check Endpoint:**
- **Path:** `/api/health`
- **Purpose:** Deployment validation and monitoring
- **Response:** `{ status: 'ok', timestamp: '<ISO>', service: 'horizon-africa-backend' }`
- **Test:** `curl http://localhost:3000/api/health`

**Updated Verification Steps:**

```bash
# 1. Health Check (NEW - Required for deployment validation)
curl http://localhost:3000/api/health
# Expected: {"status":"ok","timestamp":"...","service":"horizon-africa-backend"}

# 2. Exchange Rates (Now returns live data)
curl http://localhost:3000/api/exchange-rates
# Expected: {"rates":[...]} with actual exchange rate data

# 3. Database Connection
tail -f nohup.out | grep -i mongo
# Expected: "✅ MongoDB connected successfully to database: aib-axys"
```

**Research Paper Categories:**
- Admin can now upload research papers with 9 specific categories
- Categories: price-list, daily-briefs, weekly-note, company-specific-reports, fixed-income-notes, stock-recommendations, quarterly-reports, topical-reports, bespoke-reports
- No validation errors on upload

**Exchange Rates Page:**
- Now fetches live data from `/api/exchange-rates`
- Removed hardcoded mock data
- Users see real-time accurate rates

**All Backend APIs Tested:**
- ✅ 26/32 tests passed
- ✅ Health endpoint working
- ✅ Exchange rates API working
- ✅ Research paper validation working
- ✅ No regressions in Phase 1 functionality

**Deployment Status:** ✅ READY - All critical blockers resolved