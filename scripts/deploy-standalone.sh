#!/bin/bash
set -e

echo "🚀 AIB-AXYS Africa - Standalone Deployment Script"
echo "=================================================="
echo ""

# Step 1: Build
echo "📦 Step 1/4: Building Next.js application..."
yarn build

if [ $? -ne 0 ]; then
  echo "❌ Build failed! Please fix errors and try again."
  exit 1
fi

echo "✅ Build successful!"
echo ""

# Step 2: Copy public assets
echo "📁 Step 2/4: Copying public assets to standalone build..."
cp -r public .next/standalone/public

if [ $? -ne 0 ]; then
  echo "⚠️  Warning: Failed to copy public folder"
else
  echo "✅ Public folder copied successfully"
fi

# Verify critical assets
if [ -f ".next/standalone/public/aib-axys-logo-dark.svg" ]; then
  echo "  ✓ Logo files present"
else
  echo "  ⚠️  Warning: Logo files may be missing"
fi

echo ""

# Step 3: Copy static files
echo "🎨 Step 3/4: Copying static build files..."
cp -r .next/static .next/standalone/.next/static 2>/dev/null || echo "  ⚠️  Static folder copy failed (may not exist yet)"

echo ""

# Step 4: Verify
echo "🔍 Step 4/4: Verifying standalone build..."

if [ -d ".next/standalone" ]; then
  echo "  ✓ Standalone directory exists"
else
  echo "  ❌ Standalone directory missing!"
  exit 1
fi

if [ -f ".next/standalone/server.js" ]; then
  echo "  ✓ Server file present"
else
  echo "  ❌ Server file missing!"
  exit 1
fi

if [ -d ".next/standalone/public" ]; then
  echo "  ✓ Public folder present in standalone"
  ASSET_COUNT=$(ls -1 .next/standalone/public/*.svg 2>/dev/null | wc -l)
  echo "  ✓ Asset count: $ASSET_COUNT SVG files"
else
  echo "  ⚠️  Public folder missing in standalone!"
fi

echo ""
echo "✅ =================================================="
echo "✅ STANDALONE BUILD COMPLETE!"
echo "✅ =================================================="
echo ""
echo "📍 Build location: .next/standalone/"
echo ""
echo "🚀 To start the application:"
echo "   cd .next/standalone"
echo "   node server.js"
echo ""
echo "   OR with PM2:"
echo "   pm2 start .next/standalone/server.js --name aib-axys"
echo ""
echo "🔗 Application will be available at: http://localhost:3000"
echo ""
