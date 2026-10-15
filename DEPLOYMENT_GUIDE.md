# AIB-AXYS Development Path Description
## Production Deployment Manual for Next.js 16 Platform

**CRITICAL:** Follow this guide EXACTLY. Deviation may cause production downtime.

---

## 📋 PREREQUISITES

Before proceeding, ensure you have:
- ✅ Identity file (`id_aib-axys`) - Sent separately via secure channel
- ✅ SFTP Client (FileZilla, Cyberduck, or WinSCP)
- ✅ SSH Client (Terminal on Mac/Linux, PuTTY on Windows)
- ✅ Local development environment tested and working

---

## 🔐 SECTION 1: Setup Your Local Environment

### Step 1.1: Obtain Server Access Credentials

Please use the Identity file sent along with this document for SSH authentication.

**Server Address:** `aib-axysafrica.com`  
**Username:** `aib-axysafrica`  
**Port:** `22` (default)

### Step 1.2: Download Site Files via SFTP

1. Open your SFTP client (e.g., FileZilla)
2. Configure connection:
   - **Host:** `aib-axysafrica.com`
   - **Protocol:** SFTP - SSH File Transfer Protocol
   - **Logon Type:** Key file
   - **User:** `aib-axysafrica`
   - **Key file:** Browse to your `id_aib-axys` file
3. Click "Connect"

4. **Navigate to the `site` folder** on the remote server

5. **⚠️ DOWNLOAD ALL FILES IN THE `site` FOLDER:**
   ```
   Download:
   ✅ /app
   ✅ /components
   ✅ /public
   ✅ /lib
   ✅ /models
   ✅ /data
   ✅ /contexts
   ✅ /styles
   ✅ package.json
   ✅ package-lock.json
   ✅ next.config.js
   ✅ .env (if exists)
   ✅ tailwind.config.js
   ✅ postcss.config.js
   ✅ jsconfig.json
   
   DO NOT DOWNLOAD:
   ❌ .next (build artifacts)
   ❌ node_modules (dependencies)
   ```

   **WARNING:** Do NOT download `.next` and `node_modules` folders. These will be regenerated locally.

### Step 1.3: Set Up Local Environment

1. Navigate to your downloaded `site` folder:
   ```bash
   cd ~/Downloads/site
   # or wherever you downloaded the files
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create/Update `.env` file with development values:
   ```bash
   # .env.local (for local development)
   MONGO_URL=mongodb://localhost:27017/aib-axys-dev
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   # Add other environment variables as needed
   ```

4. Run development server:
   ```bash
   npm run dev
   ```

5. Verify the site loads at: `http://localhost:3000`

---

## 🚀 SECTION 2: Updating Server Environment

### Step 2.1: Make and Test Your Changes Locally

1. Make your code changes in your local environment
2. Test thoroughly:
   - ✅ All pages load correctly
   - ✅ Forms submit without errors
   - ✅ Admin dashboard is accessible
   - ✅ No console errors in browser
3. Run production build locally to catch errors:
   ```bash
   npm run build
   npm run start
   # Test at http://localhost:3000
   ```

### Step 2.2: Upload ONLY Updated Files

On updating and testing your local environment, upload ONLY the updated files using your SFTP client.

**⚠️ WARNING: DO NOT UPLOAD `.next` nor `node_modules`**

**Upload Strategy:**
- If you modified `/app/page.js` → Upload ONLY `/app/page.js`
- If you added new images → Upload ONLY the new images to `/public`
- If you changed `/components/Navbar.js` → Upload ONLY `/components/Navbar.js`

**Common Upload Scenarios:**

| What Changed | Upload These Files |
|--------------|-------------------|
| Homepage content | `/app/page.js` |
| New component | `/components/[NewComponent].js` |
| API route | `/app/api/[route]/route.js` |
| CSS changes | `/app/globals.css` or `/styles/[file].css` |
| Package updates | `package.json` (then rebuild on server) |
| Environment vars | `.env` (handle with extreme care) |

### Step 2.3: Connect to Server via SSH

Use an SSH client to connect to the server:

```bash
ssh -i id_aib-axys aib-axysafrica@aib-axysafrica.com
```

**Windows Users (using PuTTY):**
1. Convert `id_aib-axys` to `.ppk` format using PuTTYgen first
2. In PuTTY:
   - **Host Name:** `aib-axysafrica.com`
   - **Connection → SSH → Auth → Private key:** Browse to your `.ppk` file
   - Click "Open"

### Step 2.4: Rebuild the Website

Once connected via SSH, navigate to the site directory and rebuild:

```bash
cd ~/site
npm run build
```

**Expected Output:**
```
Route (app)                              Size     First Load JS
┌ ○ /                                   1.2 kB         100 kB
├ ○ /about                              800 B          95 kB
├ ○ /contact                            1.5 kB         102 kB
...
✓ Compiled successfully
```

**⚠️ If Build Fails:**
```bash
# Check for syntax errors in your uploaded files
npm run build 2>&1 | tee build-error.log

# View the error log
cat build-error.log

# Common fixes:
# 1. Missing import statement
# 2. Syntax error (missing bracket, quote, etc.)
# 3. Missing dependency - run: npm install
```

---

## 🔄 SECTION 3: Process Management (The "Kill Switch" Protocol)

**CRITICAL IMPORTANCE:** Next.js runs as a background process. After rebuilding, you MUST restart it properly to apply changes.

### Step 3.1: Identify the Running Process

Check which process is using port 3000:

```bash
ss -tulnp | grep :3000
```

**Example Output:**
```
tcp   LISTEN 0   511   0.0.0.0:3000   0.0.0.0:*   users:(("node",pid=12345,fd=18))
                                                           ↑
                                                    This is your PID
```

**Alternative Command (if `ss` not available):**
```bash
lsof -i :3000
# or
netstat -tulnp | grep :3000
```

### Step 3.2: Kill the Process

Replace `<PID>` with the number from Step 3.1:

```bash
kill <PID>
```

**Example:**
```bash
# If PID was 12345:
kill 12345
```

**Verify process is stopped:**
```bash
ss -tulnp | grep :3000
# Should return nothing
```

**⚠️ If Process Won't Die:**
```bash
# Force kill (use as last resort)
kill -9 <PID>
```

### Step 3.3: Start the New Build

Start the Next.js production server in the background using `nohup`:

```bash
nohup npm run start &
```

**What This Does:**
- `nohup` = Keep running even after SSH disconnect
- `npm run start` = Run Next.js in production mode
- `&` = Run in background

**Expected Output:**
```
[1] 23456
nohup: ignoring input and appending output to 'nohup.out'
```

The number `[1] 23456` is your new process ID.

### Step 3.4: Verify the Site Is Running

1. **Check if process is active:**
   ```bash
   ss -tulnp | grep :3000
   ```

2. **Check for errors in logs:**
   ```bash
   tail -f ~/site/nohup.out
   ```
   Press `Ctrl + C` to exit log viewing.

3. **Test the live site:**
   - Open browser: `https://aib-axysafrica.com`
   - Check your updated pages
   - Verify no errors in browser console (F12 → Console)

4. **Exit SSH session:**
   ```bash
   exit
   ```

---

## 🔄 RECENT UPDATES & CRITICAL FIXES

**Latest Changes (January 29, 2026):**

### RBAC (Role-Based Access Control) System
- **New Feature:** Dynamic permission system for admin users
- **Access Level:** Super Admin only
- **Components Added:**
  - `/lib/permissions.js` - 38 permissions across 13 categories
  - `/models/Role.js` - Role model with permissions
  - `/api/admin/roles/route.js` - Role management API
  - `/admin/settings/roles/page.js` - Role management UI
  - `/scripts/seed-roles.js` - One-time migration script
- **Breaking Change:** Admin.role changed from String to ObjectId reference
- **Migration:** MUST run `node scripts/seed-roles.js` before first use
- **Testing:** Login as super admin → Navigate to "Roles" → Create test role

### Mobile Swipe Navigation Update
- **File:** `/components/SwipeNavigation.js`
- **Issue Fixed:** Old page routes caused navigation to skip new pages
- **Solution:** Updated page routes to include all 17 pages
- **Impact:** Mobile users can now swipe through entire site seamlessly
- **Testing:** Verify swipe navigation works on mobile devices

### Loading Animation Consistency Fix
- **Files:** `/components/RouteLoadingWrapper.js`, `/components/LoadingPage.js`
- **Issue Fixed:** Pulsing emblem animation would timeout prematurely
- **Solution:** Animation now waits for actual content load completion
- **Impact:** Consistent loading experience across all pages
- **Testing:** Verify animation stays visible until content fully loads

**When Deploying RBAC Changes:**
```bash
# After uploading files and rebuilding:
cd ~/site
npm run build

# CRITICAL: Run migration BEFORE restarting
node scripts/seed-roles.js

# Then restart process
ss -tulnp | grep :3000
kill <PID>
nohup npm run start &
```

---

## 🆘 TROUBLESHOOTING GUIDE

### Problem: "Permission denied" when uploading files
**Solution:**
```bash
# SSH into server and check permissions
cd ~/site
ls -la

# Fix permissions if needed (as needed)
chmod 755 ~/site
chmod 644 ~/site/package.json
```

### Problem: Build fails with "Module not found"
**Solution:**
```bash
# A new npm package was likely added
cd ~/site
npm install  # Install missing dependencies
npm run build
```

### Problem: Site shows old content after restart
**Solution:**
```bash
# Clear Next.js cache
cd ~/site
rm -rf .next
npm run build
# Then kill and restart as per Section 3
```

### Problem: Port 3000 already in use but ss shows nothing
**Solution:**
```bash
# Check all node processes
ps aux | grep node

# Kill all node processes (CAUTION: Only if you're sure)
pkill -f "node"

# Restart
nohup npm run start &
```

### Problem: Changes not reflecting on live site
**Checklist:**
1. ✅ Did you upload the correct file?
2. ✅ Did you run `npm run build` after uploading?
3. ✅ Did you kill the old process?
4. ✅ Did you start the new process?
5. ✅ Did you clear browser cache? (Ctrl + Shift + R)
6. ✅ Are you checking the correct URL (not localhost)?

---

## 📊 DEPLOYMENT CHECKLIST

Use this checklist for every deployment:

### Pre-Deployment:
- [ ] All changes tested locally (`npm run dev`)
- [ ] Production build succeeds locally (`npm run build`)
- [ ] No console errors in browser
- [ ] Admin dashboard accessible and functional
- [ ] Forms submit correctly
- [ ] Images load properly
- [ ] Mobile responsiveness checked

### Deployment:
- [ ] Connected to server via SFTP
- [ ] Uploaded ONLY changed files (not `.next` or `node_modules`)
- [ ] Connected to server via SSH
- [ ] Navigated to `~/site`
- [ ] Ran `npm run build` successfully
- [ ] Identified running process with `ss -tulnp | grep :3000`
- [ ] Killed old process with `kill <PID>`
- [ ] Started new process with `nohup npm run start &`

### Post-Deployment Verification:
- [ ] Process is running (`ss -tulnp | grep :3000`)
- [ ] No errors in `tail ~/site/nohup.out`
- [ ] Live site loads: `https://aib-axysafrica.com`
- [ ] Tested changed pages on live site
- [ ] Checked browser console for errors
- [ ] Tested on mobile device
- [ ] Admin dashboard still accessible

---

## 🔒 SECURITY REMINDERS

1. **Never commit `.env` to Git** - Contains sensitive credentials
2. **Always use SSH key** - Never use password authentication
3. **Limit SSH access** - Only authorized developers
4. **Review code before deploying** - Especially changes to `/api` routes
5. **Keep dependencies updated** - Run `npm audit` regularly
6. **Monitor logs** - Check `nohup.out` for suspicious activity

---

## 📞 SUPPORT CONTACTS

If you encounter issues beyond this guide:

1. **Check logs first:**
   ```bash
   tail -f ~/site/nohup.out
   ```

2. **Check system resources:**
   ```bash
   df -h  # Disk space
   free -h  # Memory
   top  # CPU usage
   ```

3. **Escalate to:**
   - DevOps Team Lead
   - System Administrator
   - Include: Error messages, steps taken, log excerpts

---

## 📝 APPENDIX: Common Commands Quick Reference

```bash
# === SSH Connection ===
ssh -i id_aib-axys aib-axysafrica@aib-axysafrica.com

# === Navigate to Site ===
cd ~/site

# === Check Running Process ===
ss -tulnp | grep :3000
ps aux | grep node

# === Kill Process ===
kill <PID>        # Graceful
kill -9 <PID>     # Force

# === Build & Start ===
npm run build
nohup npm run start &

# === View Logs ===
tail -f ~/site/nohup.out       # Live logs
tail -n 100 ~/site/nohup.out   # Last 100 lines
cat ~/site/nohup.out | grep ERROR  # Search for errors

# === Check Disk Space ===
df -h

# === Exit SSH ===
exit
```

---

**Document Version:** 1.0  
**Last Updated:** January 29, 2026  
**Maintained By:** DevOps Team

---

**END OF DEPLOYMENT GUIDE**

*Keep this document secure and up-to-date with any infrastructure changes.*
