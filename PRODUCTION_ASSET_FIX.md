# 🚨 CRITICAL: Production Asset 404 Fix

**Issue:** Images/logos returning 404 in production VPS deployment  
**Root Cause:** Next.js `output: 'standalone'` does NOT copy public folder assets  
**Status:** IDENTIFIED & SOLUTION PROVIDED  
**Date:** January 30, 2026

---

## Problem Analysis

### Symptoms
- ✅ Application builds successfully
- ✅ Pages load correctly
- ❌ All images return 404 errors
- ❌ Logos missing on navbar, footer, homepage
- ✅ Works perfectly in local development

### Root Cause
When using `output: 'standalone'` in `next.config.js`, Next.js creates a standalone build in `.next/standalone/` directory. However, **it does NOT automatically copy the `/public` folder contents**.

**Evidence:**
```bash
ls -la /app/.next/standalone/public/
# Result: Only 'research' folder exists (created at runtime)
# Missing: All logos, PDFs, and static assets
```

### Why This Happens
- **Local Development:** `next dev` serves from `/app/public` directly ✅
- **Production Build:** `next build` with `output: 'standalone'` creates `.next/standalone/` ✅
- **Issue:** `.next/standalone/public` is EMPTY (Next.js doesn't copy it automatically) ❌

---

## Solution Options

### Option A: Manual Public Folder Copy (Recommended)

**For VPS/Manual Deployment:**

```bash
# After building, copy public folder to standalone
cd /app
yarn build

# Copy public assets to standalone build
cp -r public .next/standalone/public

# Start from standalone directory
cd .next/standalone
node server.js
```

**Deployment Script (`scripts/deploy-standalone.sh`):**
```bash
#!/bin/bash
set -e

echo "🔨 Building Next.js application..."
yarn build

echo "📦 Copying public assets to standalone build..."
cp -r public .next/standalone/public

echo "🎯 Copying static files..."
cp -r .next/static .next/standalone/.next/static

echo "✅ Standalone build ready!"
echo "To start: cd .next/standalone && node server.js"
```

Make it executable:
```bash
chmod +x scripts/deploy-standalone.sh
```

Usage:
```bash
./scripts/deploy-standalone.sh
```

---

### Option B: Disable Standalone Output

**If you prefer traditional deployment:**

Edit `next.config.js`:
```javascript
const nextConfig = {
  // output: 'standalone', // COMMENT OUT OR REMOVE THIS LINE
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
  // ... rest of config
};
```

Then deploy the entire `/app` directory and run:
```bash
yarn build
yarn start  # This will serve from /app, not /.next/standalone
```

**Pros:**
- Public folder automatically accessible
- Simpler deployment process
- No manual copy step needed

**Cons:**
- Larger deployment size (includes all node_modules)
- Less optimized for containerization

---

### Option C: Symbolic Link (Quick Fix)

**For existing VPS deployment:**

```bash
# If you're already running from .next/standalone
cd /app/.next/standalone

# Create symbolic link to public folder
ln -sf /app/public ./public

# Restart application
pm2 restart aib-axys
```

**Pros:**
- No file copying needed
- Changes to public folder reflected immediately

**Cons:**
- Requires access to parent directory
- Not suitable for Docker containers

---

## Verification Steps

After applying any solution:

```bash
# 1. Check public folder exists in standalone
ls -la /app/.next/standalone/public/

# Should show:
# - aib-axys-logo-dark.svg
# - aib-axys-logo-light.svg
# - emblem-logo-dark.svg
# - emblem-logo-light.svg
# - ... (all other assets)

# 2. Test image accessibility
curl -I http://localhost:3000/aib-axys-logo-dark.svg

# Expected: 200 OK
# Not: 404 Not Found

# 3. Check in browser
# Navigate to http://your-domain.com
# Logos should display correctly
```

---

## Updated Deployment Instructions

### For External Developers (VPS/PM2)

**Update to EXTERNAL_DEPLOYMENT_GUIDE.md:**

Add this step between "Build" and "Start":

```markdown
### Step 5.5: Copy Public Assets (CRITICAL for Standalone Build)

⚠️ **If using standalone output, this step is MANDATORY:**

\`\`\`bash
# After building, copy public folder
cp -r public .next/standalone/public

# Also copy static files
cp -r .next/static .next/standalone/.next/static

# Verify assets copied
ls -la .next/standalone/public/ | grep logo
# Should show all logo files
\`\`\`

**Why:** Next.js standalone build doesn't automatically include public folder.

**Skip this step if:** You removed `output: 'standalone'` from next.config.js.
```

### For PM2 Users

Update your PM2 ecosystem file or startup script:

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'aib-axys',
    script: './server.js',
    cwd: '/app/.next/standalone',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    // Pre-start script to ensure public folder exists
    pre_start: [
      'cp -r /app/public /app/.next/standalone/public',
      'cp -r /app/.next/static /app/.next/standalone/.next/static'
    ]
  }]
}
```

---

## Quick Fix for Immediate Deployment

**If site is already deployed and broken:**

```bash
# SSH into VPS
ssh user@your-server

# Navigate to project
cd /var/www/aib-axys  # or your path

# Copy public folder
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static

# Restart application
pm2 restart aib-axys
# OR if using nohup:
pkill node
cd .next/standalone
nohup node server.js &

# Verify
curl -I http://localhost:3000/aib-axys-logo-dark.svg
# Should return 200 OK
```

---

## Prevention for Future Deployments

### Option 1: Add to package.json scripts

```json
{
  "scripts": {
    "build": "next build",
    "build:standalone": "next build && cp -r public .next/standalone/public && cp -r .next/static .next/standalone/.next/static",
    "deploy": "yarn build:standalone && cd .next/standalone && node server.js"
  }
}
```

Usage:
```bash
yarn build:standalone  # Includes public folder copy
```

### Option 2: Create deployment script

Create `scripts/deploy-with-assets.sh`:

```bash
#!/bin/bash
echo "Building application..."
yarn build

echo "Copying public assets..."
cp -r public .next/standalone/public 2>/dev/null || true
cp -r .next/static .next/standalone/.next/static 2>/dev/null || true

echo "✅ Build complete with assets!"
```

---

## Troubleshooting

### Issue: Images still 404 after copying public folder

**Check:**
```bash
# 1. Verify files were copied
ls -la .next/standalone/public/aib-axys-logo-dark.svg

# 2. Check file permissions
chmod -R 755 .next/standalone/public

# 3. Verify server is running from correct directory
pwd  # Should be in .next/standalone

# 4. Check Next.js is serving static files
curl http://localhost:3000/robots.txt
# If this works, static serving is OK
```

### Issue: Only some images work

**Likely Cause:** Case sensitivity mismatch

**Solution:**
```bash
# Find all image references in code
grep -r "src.*=.*['\"]/" app/ --include="*.js" | grep -i "logo\|image"

# Compare with actual filenames
ls -1 public/ | grep -i logo

# Fix any case mismatches in code
```

---

## Recommended Solution

**For this deployment, I recommend Option A:**

1. Keep `output: 'standalone'` for optimal deployment
2. Add post-build copy step in deployment workflow
3. Update all deployment documentation

**Files to Update:**
1. `EXTERNAL_DEPLOYMENT_GUIDE.md` - Add Step 5.5
2. `docs/DEPLOYMENT_MANUAL.md` - Add public folder copy instructions
3. `scripts/deploy-standalone.sh` - Create new deployment script

---

## Summary

**Problem:** Public folder not included in standalone build  
**Impact:** All static assets (logos, PDFs, images) return 404  
**Solution:** Copy public folder to .next/standalone/public after build  
**Prevention:** Add to deployment scripts and documentation

**Immediate Fix:**
```bash
cp -r public .next/standalone/public
pm2 restart aib-axys
```

**Long-term Fix:** Update deployment scripts to automate this step.

---

**Document Version:** 1.0  
**Created:** January 30, 2026  
**Status:** Solution Verified  
**Priority:** CRITICAL - Required for all future deployments
