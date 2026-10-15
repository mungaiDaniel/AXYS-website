# 🚀 AIB-AXYS Africa Platform - External Deployment Guide

**Version:** 2.1 - Phase 2 Complete  
**Last Updated:** January 30, 2026  
**Target Audience:** External Developers & DevOps Engineers  
**Deployment Type:** Manual VPS/Server Deployment

---

## 📋 Table of Contents

1. [Quick Start Summary](#quick-start-summary)
2. [System Requirements](#system-requirements)
3. [Project Structure](#project-structure)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [Build & Deployment Steps](#build--deployment-steps)
7. [Post-Deployment Verification](#post-deployment-verification)
8. [Troubleshooting](#troubleshooting)
9. [Critical Paths Reference](#critical-paths-reference)

---

## Quick Start Summary

**What This Application Is:**
- Next.js 16.1.4 (React 19.2.3) financial services platform
- MongoDB database for data persistence
- JWT-based authentication for admin panel
- Public website + Admin dashboard

**Deployment Time:** ~30-45 minutes  
**Difficulty Level:** Intermediate  
**Critical Success Factors:**
1. ✅ MongoDB connection with explicit database name
2. ✅ Environment variables properly configured
3. ✅ Health endpoint responding (deployment validation)
4. ✅ Admin user seeded in database

---

## System Requirements

### Server Specifications

**Minimum:**
- **OS:** Ubuntu 20.04+ / Debian 10+ / CentOS 8+
- **CPU:** 2 vCPU cores
- **RAM:** 2GB minimum, 4GB recommended
- **Storage:** 10GB free space
- **Node.js:** v18.x or v20.x (LTS recommended)
- **Package Manager:** Yarn 1.22+ (npm also works but yarn preferred)

**Network:**
- Open port 3000 (or your chosen port) for HTTP traffic
- Outbound internet access for MongoDB Atlas (if using cloud database)
- Optional: Port 443 for HTTPS (with reverse proxy like Nginx)

### Software Dependencies

Install these before deployment:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js (using NodeSource repository)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Yarn
npm install -g yarn

# Verify installations
node --version  # Should show v18.x or v20.x
yarn --version  # Should show 1.22.x or higher
```

---

## Project Structure

### Critical Directories & Files

```
/app/                           # PROJECT ROOT
├── .env                        # ⚠️ CRITICAL - Environment variables (create this)
├── .env.example                # Template for .env file
├── package.json                # Dependencies manifest
├── next.config.js              # Next.js configuration
│
├── app/                        # Application source code
│   ├── page.js                 # Homepage
│   ├── layout.js               # Root layout
│   ├── globals.css             # Global styles
│   │
│   ├── api/                    # API Routes (Backend)
│   │   ├── health/route.js     # Health check endpoint ⚠️ REQUIRED
│   │   ├── auth/               # Authentication endpoints
│   │   │   ├── login/route.js
│   │   │   ├── logout/route.js
│   │   │   └── me/route.js
│   │   ├── admin/              # Admin API endpoints
│   │   │   ├── dashboard/route.js
│   │   │   ├── contacts/route.js
│   │   │   ├── research/route.js
│   │   │   └── ... (more admin APIs)
│   │   └── ...                 # Public APIs
│   │
│   ├── admin/                  # Admin panel pages
│   │   ├── login/page.js
│   │   ├── dashboard/page.js
│   │   └── ... (more admin pages)
│   │
│   └── ... (public pages)
│
├── components/                 # React components
│   ├── Navbar.js
│   ├── Footer.js
│   ├── PageAccessGuard.js      # Page visibility control
│   └── ...
│
├── lib/                        # Utility libraries
│   ├── mongodb.js              # ⚠️ CRITICAL - Database connection
│   ├── auth.js                 # JWT authentication
│   └── ...
│
├── models/                     # MongoDB/Mongoose models
│   ├── Admin.js                # Admin users
│   ├── Contact.js              # Contact form submissions
│   ├── ResearchPaper.js        # Research documents
│   ├── PageSettings.js         # Page visibility settings
│   └── ... (11 more models)
│
├── public/                     # Static assets (accessible via URL)
│   ├── research/               # Uploaded research papers (created at runtime)
│   └── ...
│
└── docs/                       # Documentation
    ├── DEPLOYMENT_MANUAL.md
    └── DEPLOYMENT_SOP.md
```

---

## Environment Configuration

### Step 1: Create .env File

**Location:** `/app/.env` (project root)

```bash
cd /app
cp .env.example .env
nano .env  # or use vim, vi, etc.
```

### Step 2: Configure Environment Variables

**Complete .env Template with Explanations:**

```env
# ============================================
# DATABASE CONFIGURATION (CRITICAL)
# ============================================

# MongoDB Connection String
# Format for Local MongoDB:
MONGO_URL=mongodb://localhost:27017/aib-axys

# Format for MongoDB Atlas (Cloud):
# MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority

# ⚠️ CRITICAL: Database Name (MUST be set explicitly)
# Without this, the app defaults to "test" database and will fail in production
DB_NAME=aib-axys

# ============================================
# APPLICATION CONFIGURATION
# ============================================

# Public URL of your application
# Examples:
# - Production: https://aib-axysafrica.com
# - Staging: https://staging.aib-axysafrica.com
# - Local: http://localhost:3000
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# Node environment (production or development)
NODE_ENV=production

# CORS Origins (comma-separated or * for all)
CORS_ORIGINS=*

# ============================================
# AUTHENTICATION & SECURITY
# ============================================

# JWT Secret Key for authentication tokens
# ⚠️ IMPORTANT: Use a strong, random string (minimum 32 characters)
# Generate one: openssl rand -base64 32
JWT_SECRET=your-super-secret-jwt-key-change-this-minimum-32-characters

# ============================================
# EMAIL CONFIGURATION (Optional)
# ============================================

# Default email addresses for contact forms
CONTACT_EMAIL_DEFAULT=info@axysinvestmentbank.com
CONTACT_EMAIL_GENERAL=feedback@aib-axysafrica.com

# SMTP Configuration (if using email features)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
```

### Step 3: Verify Configuration

```bash
# Check if .env exists and contains required variables
cat .env | grep MONGO_URL
cat .env | grep DB_NAME
cat .env | grep JWT_SECRET

# All three should return values (not empty)
```

---

## Database Setup

### Option A: MongoDB Atlas (Cloud - Recommended)

**Step 1: Create MongoDB Atlas Account**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up / Log in
3. Create a new cluster (Free tier works fine for testing)

**Step 2: Create Database**
1. In Atlas console, click "Browse Collections"
2. Click "Add My Own Data"
3. Database name: `aib-axys`
4. Collection name: `admins` (first collection, others auto-created)

**Step 3: Create Database User**
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Username: your choice (e.g., `aib_admin`)
4. Password: generate strong password
5. **Database User Privileges:**
   - Built-in Role: `readWrite` on `aib-axys` database
   - ⚠️ DO NOT grant access to `test` database
6. Click "Add User"

**Step 4: Configure Network Access**
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. For testing: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add your server's specific IP address
5. Click "Confirm"

**Step 5: Get Connection String**
1. Go to "Database" and click "Connect"
2. Choose "Connect your application"
3. Driver: Node.js
4. Copy the connection string
5. Replace `<password>` with your database user password
6. **IMPORTANT:** Do NOT include database name in the URL
7. Add to `.env` as `MONGO_URL`

**Example:**
```env
# Correct (no database name in URL):
MONGO_URL=mongodb+srv://aib_admin:myPassword123@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
DB_NAME=aib-axys

# ❌ Wrong (database in URL):
# MONGO_URL=mongodb+srv://user:pass@cluster0.abc123.mongodb.net/aib-axys
```

### Option B: Local MongoDB

**Step 1: Install MongoDB**

```bash
# Ubuntu/Debian
sudo apt install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify MongoDB is running
sudo systemctl status mongod
```

**Step 2: Create Database**

```bash
# Connect to MongoDB shell
mongosh

# Create database and user
use aib-axys

db.createUser({
  user: "aib_admin",
  pwd: "your_secure_password",
  roles: [{ role: "readWrite", db: "aib-axys" }]
})

exit
```

**Step 3: Configure .env**

```env
MONGO_URL=mongodb://aib_admin:your_secure_password@localhost:27017/aib-axys
DB_NAME=aib-axys
```

### Database Schema (Auto-Created)

The application will automatically create these collections:

1. **admins** - Admin users
2. **contacts** - Contact form submissions
3. **researchpapers** - Research documents
4. **pagesettings** - Page visibility settings
5. **analyticevents** - Analytics data
6. **auditlogs** - Security audit logs
7. **roles** - User roles (RBAC)
8. **exchangerates** - Currency exchange rates
9. **iposettings** - IPO configurations
10. **globalfunds** - Fund information
11. **documents** - Uploaded documents
12. **consents** - GDPR consents
13. **emailverificationtokens** - Email verification
14. **emailsettings** - Email configurations

---

## Build & Deployment Steps

### Step 1: Transfer Files to Server

**Option A: Git Clone (Recommended)**

```bash
# SSH into your server
ssh username@your-server-ip

# Navigate to desired directory
cd /var/www  # or ~/sites or your preferred location

# Clone repository
git clone <your-repository-url> aib-axys
cd aib-axys
```

**Option B: SFTP Upload**

Using FileZilla, Cyberduck, or command-line SFTP:
```bash
# Connect via SFTP
sftp username@your-server-ip

# Navigate to upload directory
cd /var/www

# Upload project folder (excluding node_modules and .next)
put -r /local/path/to/project aib-axys
```

**Files to EXCLUDE from upload:**
- `node_modules/` (will be installed on server)
- `.next/` (will be generated during build)
- `.env` (create separately on server)
- `yarn.lock` or `package-lock.json` (optional, but include for consistency)

### Step 2: Install Dependencies

```bash
cd /var/www/aib-axys  # or your project directory

# Install production dependencies
yarn install --production=false

# This will take 2-5 minutes depending on server speed
```

### Step 3: Configure Environment

```bash
# Create .env file
cp .env.example .env

# Edit with your values
nano .env

# Verify critical variables are set
cat .env | grep -E "MONGO_URL|DB_NAME|JWT_SECRET"
```

### Step 4: Seed Admin User (First Time Only)

```bash
# Run the admin initialization script
node init-admin.js

# Or manually via MongoDB shell:
mongosh "your-connection-string"
use aib-axys
db.admins.insertOne({
  email: "sk@horizonafrica.com",
  password: "$2a$10$hashedpasswordhere",  # Use bcrypt to hash
  role: "super-admin",
  createdAt: new Date()
})
```

**Default Admin Credentials:**
- Email: `sk@horizonafrica.com`
- Password: `Admin@2026`
- ⚠️ **Change immediately after first login**

### Step 5: Build the Application

```bash
# Build Next.js application
yarn build

# Expected output:
# ✓ Compiled successfully
# ✓ Collecting page data
# ✓ Generating static pages (40/40)
# ✓ Finalizing page optimization
#
# Route (app)                              Size     First Load JS
# ┌ ○ /                                    X kB          XXX kB
# ├ ○ /about                               X kB          XXX kB
# └ ... (more routes)
#
# ○  (Static)  prerendered as static content
# ƒ  (Dynamic)  server-rendered on demand
```

**Build should complete in 10-20 seconds.**

If build fails, check:
- Node.js version (should be 18.x or 20.x)
- All dependencies installed
- No syntax errors in code
- Memory available (min 2GB RAM)

**✅ PUBLIC FOLDER:** Now automatically accessible! No manual copy step needed.

**Note:** We've removed `output: 'standalone'` from next.config.js for VPS deployment simplicity. This means:
- ✅ Public folder works automatically
- ✅ Simpler deployment process
- ✅ No asset 404 issues
- Slightly larger deployment size (~300MB more) - acceptable for VPS

### Step 6: Start the Application

**Option A: Using PM2 (Recommended for Production)**

```bash
# Install PM2 globally (one-time)
npm install -g pm2

# Start application from project root
cd /var/www/aib-axys  # Ensure you're in project root, NOT .next/standalone
pm2 start yarn --name "aib-axys" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# Follow the output instructions

# Useful PM2 commands:
pm2 status           # Check status
pm2 logs aib-axys    # View logs
pm2 restart aib-axys # Restart app
pm2 stop aib-axys    # Stop app
pm2 delete aib-axys  # Remove from PM2
```

**Option B: Using nohup (Simple)**

```bash
# Start application in background
cd /var/www/aib-axys  # Ensure you're in project root
nohup yarn start > app.log 2>&1 &

# Verify it's running
ps aux | grep node

# Check logs
tail -f app.log

# Expected output:
# > next start
# ▲ Next.js 16.1.4
# - Local:        http://localhost:3000
# - Network:      http://0.0.0.0:3000
#
# ✓ Ready in Xs
```

**⚠️ IMPORTANT:** Always start from the project root `/var/www/aib-axys`, NOT from `.next/standalone/`!

### Step 7: Configure Reverse Proxy (Optional but Recommended)

**Nginx Configuration:**

```bash
# Install Nginx
sudo apt install nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/aib-axys

# Add this configuration:
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/aib-axys /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

**SSL Certificate (HTTPS):**

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Certificate will auto-renew
```

---

## Post-Deployment Verification

### Critical Health Checks

Run these checks to verify deployment success:

#### 1. Health Endpoint (CRITICAL)

```bash
curl http://localhost:3000/api/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2026-01-30T10:30:00.000Z",
  "service": "horizon-africa-backend"
}

# Status code: 200 OK
```

**❌ If you get 404:** Health endpoint is missing - deployment will fail validation

#### 2. Database Connection

```bash
# Check application logs for MongoDB connection
tail -f app.log | grep -i mongo

# Expected output:
# ✅ MongoDB connected successfully to database: aib-axys

# ❌ If you see "not authorized on test":
# - Check DB_NAME is set in .env
# - Verify MongoDB user has permissions on aib-axys database
```

#### 3. Homepage Loading

```bash
curl http://localhost:3000

# Should return HTML content (status 200)

# Or in browser:
# http://your-domain.com
```

#### 4. Admin Login

```bash
# Test admin login API
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sk@horizonafrica.com","password":"Admin@2026"}'

# Expected: JSON response with success: true

# Or in browser:
# http://your-domain.com/admin/login
```

#### 5. API Endpoints

```bash
# Test public API (no auth required)
curl http://localhost:3000/api/page-visibility

# Expected: JSON with page settings

# Test admin API (requires auth)
curl http://localhost:3000/api/admin/dashboard

# Expected: 401 Unauthorized (correct, as no JWT token provided)
```

### Verification Checklist

- [ ] Server is running on port 3000
- [ ] Health endpoint returns 200 OK
- [ ] MongoDB connection successful
- [ ] No error messages in logs
- [ ] Homepage loads in browser
- [ ] Admin login page accessible
- [ ] Can log in with admin credentials
- [ ] Admin dashboard loads after login
- [ ] Public pages loading correctly
- [ ] Navigation menu working
- [ ] Footer links functional

---

## Troubleshooting

### Issue 1: "Port 3000 already in use"

**Symptoms:** Error when starting application

**Solution:**
```bash
# Find process using port 3000
sudo lsof -i :3000
# Or
sudo netstat -tulpn | grep :3000

# Kill the process
kill -9 <PID>

# Or kill all node processes
pkill node

# Start application again
yarn start
```

### Issue 2: "Module not found" errors

**Symptoms:** Build or runtime errors about missing modules

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules yarn.lock
yarn install

# Clear Next.js cache
rm -rf .next

# Rebuild
yarn build
yarn start
```

### Issue 3: "not authorized on test to execute command"

**Symptoms:** MongoDB authentication error, app trying to use "test" database

**Root Cause:** `DB_NAME` environment variable not set

**Solution:**
```bash
# Add DB_NAME to .env
echo "DB_NAME=aib-axys" >> .env

# Verify it's set
cat .env | grep DB_NAME

# Restart application
pm2 restart aib-axys
# Or if using nohup:
pkill node
nohup yarn start > app.log 2>&1 &

# Check logs for successful connection
tail -f app.log | grep "MongoDB connected successfully to database: aib-axys"
```

### Issue 4: Health Endpoint Returns 404

**Symptoms:** `/api/health` returns 404 Not Found

**Root Cause:** Health endpoint file missing or incorrect location

**Solution:**
```bash
# Verify file exists
ls -la /var/www/aib-axys/app/api/health/route.js

# If missing, create it:
mkdir -p /var/www/aib-axys/app/api/health

cat > /var/www/aib-axys/app/api/health/route.js << 'EOF'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    return NextResponse.json(
      { 
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'horizon-africa-backend'
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error',
        message: error.message 
      },
      { status: 500 }
    )
  }
}
EOF

# Rebuild and restart
yarn build
pm2 restart aib-axys
```

### Issue 5: "ECONNREFUSED" - Cannot connect to MongoDB

**Symptoms:** MongoDB connection refused

**Solutions:**

**For Local MongoDB:**
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# If not running, start it
sudo systemctl start mongod
sudo systemctl enable mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

**For MongoDB Atlas:**
```bash
# Check network connectivity
ping cluster0.abc123.mongodb.net

# Verify IP whitelist in Atlas console
# Network Access → Add current server IP

# Test connection string
mongosh "your-connection-string"
```

### Issue 6: Build fails with memory errors

**Symptoms:** "JavaScript heap out of memory"

**Solution:**
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Build again
yarn build

# Or add to .env:
echo "NODE_OPTIONS=--max-old-space-size=4096" >> .env
```

### Issue 7: Images/Logos Return 404 in Production

**Symptoms:** Site loads but all images show broken icons, logos missing

**Root Cause:** Application was using `output: 'standalone'` which doesn't include public folder

**✅ FIXED (January 30, 2026):**
- Removed `output: 'standalone'` from next.config.js
- Application now uses standard build mode
- Public folder automatically accessible
- No manual copy steps required

**New Deployment Process:**
```bash
# Simple deployment (no standalone complexity)
cd /var/www/aib-axys
yarn build
pm2 start yarn --name "aib-axys" -- start

# ✅ All assets now work automatically
```

**Verification:**
```bash
# Test images are accessible
curl -I http://localhost:3000/aib-axys-logo-dark.svg
# Expected: HTTP/1.1 200 OK

# Check in browser
# All logos should display correctly
```

**Trade-off:** Deployment size increased by ~300MB (acceptable for VPS). Security unchanged.

**See also:** `ASSET_404_AUDIT_REPORT.md` for comprehensive root cause analysis

---

### Issue 8: Admin can't login / wrong credentials

**Solution:**
```bash
# Reset admin password via MongoDB
mongosh "your-connection-string"

use aib-axys

# Check if admin exists
db.admins.findOne({email: "sk@horizonafrica.com"})

# If not exists, run seed script:
exit
node init-admin.js

# Or create manually with bcrypt hash
```

**Solution:**
```bash
# Reset admin password via MongoDB
mongosh "your-connection-string"

use aib-axys

# Check if admin exists
db.admins.findOne({email: "sk@horizonafrica.com"})

# If not exists, run seed script:
exit
node init-admin.js

# Or create manually with bcrypt hash
```

---

## Critical Paths Reference

### File System Paths

```bash
# Application Root
/var/www/aib-axys/             # Main project directory

# Configuration Files
/var/www/aib-axys/.env          # Environment variables (create this)
/var/www/aib-axys/.env.example  # Environment template
/var/www/aib-axys/package.json  # Dependencies

# Critical Application Files
/var/www/aib-axys/app/api/health/route.js              # Health check endpoint
/var/www/aib-axys/lib/mongodb.js                       # Database connection
/var/www/aib-axys/models/                              # Database models
/var/www/aib-axys/components/PageAccessGuard.js        # Page protection

# Static Assets (created at runtime)
/var/www/aib-axys/public/research/                     # Uploaded research papers
/var/www/aib-axys/.next/                               # Build output (generated)

# Logs
/var/www/aib-axys/app.log                              # Application logs (if using nohup)
~/.pm2/logs/aib-axys-out.log                           # PM2 output logs
~/.pm2/logs/aib-axys-error.log                         # PM2 error logs
```

### URL Paths

```bash
# Public Pages
http://your-domain.com/                # Homepage
http://your-domain.com/about           # About page
http://your-domain.com/contact         # Contact page
http://your-domain.com/research        # Research papers

# Admin Pages
http://your-domain.com/admin/login     # Admin login
http://your-domain.com/admin/dashboard # Admin dashboard

# API Endpoints (Backend)
http://your-domain.com/api/health                  # Health check (CRITICAL)
http://your-domain.com/api/auth/login              # Admin login API
http://your-domain.com/api/page-visibility         # Page settings (public)
http://your-domain.com/api/exchange-rates          # Exchange rates (public)
http://your-domain.com/api/admin/dashboard         # Dashboard stats (protected)
http://your-domain.com/api/admin/contacts          # Contact management (protected)
http://your-domain.com/api/admin/research          # Research management (protected)
```

### Database Paths

```bash
# MongoDB Atlas
mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority

# Local MongoDB
mongodb://localhost:27017/aib-axys

# Database Name (always)
aib-axys

# Collections (auto-created)
aib-axys.admins
aib-axys.contacts
aib-axys.researchpapers
aib-axys.pagesettings
aib-axys.analyticevents
# ... (15 collections total)
```

---

## Quick Reference Commands

### Deployment Workflow (Copy-Paste - UPDATED Jan 30, 2026)

```bash
# 1. Transfer files to server
cd /var/www
git clone <repo-url> aib-axys
cd aib-axys

# 2. Install dependencies
yarn install

# 3. Configure environment
cp .env.example .env
nano .env  # Edit with your values

# 4. Seed admin user (first time only)
node init-admin.js

# 5. Build application
yarn build
# ✅ Public folder automatically accessible (no manual copy needed)

# 6. Start with PM2
npm install -g pm2
pm2 start yarn --name "aib-axys" -- start
pm2 save
pm2 startup

# 7. Verify deployment
curl http://localhost:3000/api/health
curl -I http://localhost:3000/aib-axys-logo-dark.svg  # Should return 200
curl http://localhost:3000  # Homepage should load
```

**✅ SIMPLIFIED:** No need to copy public folder manually anymore!

### Maintenance Commands

```bash
# View logs
pm2 logs aib-axys

# Restart application
pm2 restart aib-axys

# Stop application
pm2 stop aib-axys

# Update code (if using git)
git pull origin main
yarn install
yarn build
pm2 restart aib-axys

# Check database connection
mongosh "your-connection-string"
use aib-axys
db.stats()
```

---

## Support & Additional Resources

**Documentation Files:**
- `DEPLOYMENT_MANUAL.md` - Detailed VPS deployment guide
- `DEPLOYMENT_FIXES.md` - Recent fixes and solutions
- `HANDOVER_COMPLETE.md` - Project overview and handover
- `PROJECT_HANDOVER_MAP.md` - Complete architecture map

**Admin Credentials (Default):**
- URL: `http://your-domain.com/admin/login`
- Email: `sk@horizonafrica.com`
- Password: `Admin@2026`
- ⚠️ **CHANGE IMMEDIATELY AFTER FIRST LOGIN**

**Emergency Contact:**
- Technical Issues: Check troubleshooting section above
- Database Issues: Verify MongoDB connection and credentials
- Build Issues: Check Node.js version and dependencies

---

**Document Status:** ✅ Complete & Production Ready  
**Version:** 2.1  
**Last Verified:** January 30, 2026  
**Next Review:** April 2026

---

**Deployment Checklist:**

- [ ] Server meets minimum requirements
- [ ] Node.js 18.x or 20.x installed
- [ ] MongoDB configured (Atlas or local)
- [ ] .env file created with all required variables
- [ ] DB_NAME explicitly set to "aib-axys"
- [ ] Dependencies installed (yarn install)
- [ ] Application built successfully (yarn build)
- [ ] Admin user seeded in database
- [ ] Application started with PM2 or nohup
- [ ] Health endpoint returns 200 OK
- [ ] Homepage loads successfully
- [ ] Admin login functional
- [ ] No errors in logs

**🎉 Once all items checked, deployment is complete!**
