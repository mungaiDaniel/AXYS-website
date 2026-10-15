#!/usr/bin/env node

/**
 * Cleanup Script for AIB-AXYS Website
 * Identifies and optionally removes unused files
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 AIB-AXYS Website Cleanup Analysis\n');

// Files that can potentially be removed
const potentiallyUnusedFiles = [
  'public/design-reference.png',  // 698KB - was only for reference
  'public/app-mockup-1.png',      // 621KB - duplicate, using app-mockup-2.png
  'public/phone-mockup-splash.png', // 621KB - individual phone, using combined mockup
  'public/phone-mockup-app.png',    // 2MB - individual phone, using combined mockup
  'public/digitrader-logo-light.png', // 74KB - using new logo files
  'public/digitrader-dark.png',      // 65KB - using new logo files  
  'public/digitrader-white.png',     // 187KB - using new logo files
  'public/digitrader-logo-dark.png'  // 18KB - using new logo files
];

let totalSize = 0;

console.log('📦 Potentially Unused Files:\n');

potentiallyUnusedFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    totalSize += stats.size;
    console.log(`   ${sizeKB}KB - ${file}`);
  }
});

const totalMB = (totalSize / (1024 * 1024)).toFixed(2);

console.log(`\n💾 Total Potential Savings: ${totalMB}MB\n`);

console.log('⚠️  CAUTION: Review files before deleting!\n');
console.log('To delete these files, run:');
console.log('   node cleanup-unused-files.js --delete\n');

if (process.argv.includes('--delete')) {
  console.log('🗑️  Deleting unused files...\n');
  
  let deletedCount = 0;
  potentiallyUnusedFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`   ✅ Deleted: ${file}`);
      deletedCount++;
    }
  });
  
  console.log(`\n✨ Cleanup complete! Deleted ${deletedCount} file(s)\n`);
  console.log(`📉 Saved ${totalMB}MB of storage\n`);
}
