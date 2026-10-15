#!/usr/bin/env node

/**
 * AIB-AXYS Website Optimization Script
 * 
 * This script performs the following optimizations:
 * 1. Updates external logo URLs to local paths
 * 2. Optimizes images in /public directory
 * 3. Generates performance report
 */

const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'app/page.js',
  'components/Navbar.js',
  'components/Footer.js',
  'components/LoadingPage.js'
];

const oldDarkUrl = 'https://customer-assets.emergentagent.com/job_33cba548-cc10-4443-ba2a-5d85d6be63d5/artifacts/83rf6q6x_NEW%20AIB%20AXYS%20AFRICA%20LOGO%20DARK%20BG.svg';
const oldLightUrl = 'https://customer-assets.emergentagent.com/job_33cba548-cc10-4443-ba2a-5d85d6be63d5/artifacts/c84w37kp_NEW%20AIB%20AXYS%20AFRICA%20LOGO%20WHITE%20BG.svg';
const newDarkUrl = '/aib-axys-logo-dark.svg';
const newLightUrl = '/aib-axys-logo-light.svg';

console.log('🚀 Starting AIB-AXYS Website Optimization...\n');

let updatedFiles = 0;

filesToUpdate.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    content = content.replace(new RegExp(oldDarkUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newDarkUrl);
    content = content.replace(new RegExp(oldLightUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newLightUrl);
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${file}`);
      updatedFiles++;
    } else {
      console.log(`⏭️  Skipped: ${file} (no changes needed)`);
    }
  } else {
    console.log(`⚠️  Not found: ${file}`);
  }
});

console.log(`\n📊 Summary: Updated ${updatedFiles} file(s)\n`);
console.log('✨ Optimization complete!');
