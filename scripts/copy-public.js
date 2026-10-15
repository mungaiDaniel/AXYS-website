#!/usr/bin/env node

/**
 * Post-build script to copy public assets to standalone build
 * This ensures assets are available in containerized deployments
 */

const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..', 'public');
const targetDir = path.join(__dirname, '..', '.next', 'standalone', 'public');
const staticSource = path.join(__dirname, '..', '.next', 'static');
const staticTarget = path.join(__dirname, '..', '.next', 'standalone', '.next', 'static');

console.log('🔧 Post-build: Copying public assets to standalone...');

// Check if standalone build exists
const standalonePath = path.join(__dirname, '..', '.next', 'standalone');
if (!fs.existsSync(standalonePath)) {
  console.log('⚠️  Standalone build not found - skipping asset copy');
  console.log('   (This is normal for development builds)');
  process.exit(0);
}

// Function to copy directory recursively
function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`⚠️  Source not found: ${src}`);
    return;
  }

  // Create destination directory
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read source directory
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // Recursively copy subdirectory
      copyRecursive(srcPath, destPath);
    } else {
      // Copy file
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  // Copy public folder
  console.log(`📁 Copying: ${sourceDir} → ${targetDir}`);
  copyRecursive(sourceDir, targetDir);
  
  // Count copied files
  const copiedFiles = fs.readdirSync(targetDir).filter(f => fs.statSync(path.join(targetDir, f)).isFile());
  console.log(`✅ Copied ${copiedFiles.length} files from public folder`);

  // Copy static files
  if (fs.existsSync(staticSource)) {
    console.log(`📁 Copying: ${staticSource} → ${staticTarget}`);
    copyRecursive(staticSource, staticTarget);
    console.log(`✅ Copied static build files`);
  }

  console.log('✅ Post-build asset copy complete!');
  console.log('');
  console.log('Standalone build is ready for deployment.');
  console.log('Location: .next/standalone/');
  
} catch (error) {
  console.error('❌ Error copying assets:', error.message);
  process.exit(1);
}
