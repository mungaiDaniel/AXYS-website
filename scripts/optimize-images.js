#!/usr/bin/env node
/**
 * Automated Image Optimization Script for AIB-AXYS Platform
 * Converts PNG/JPG to WebP and compresses images
 * Run: node scripts/optimize-images.js
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const QUALITY = 80; // WebP quality (0-100)
const MAX_WIDTH = 1920; // Max width for large images

async function optimizeImage(filePath) {
  try {
    const filename = path.basename(filePath, path.extname(filePath));
    const dir = path.dirname(filePath);
    const webpPath = path.join(dir, `${filename}.webp`);

    // Skip if WebP already exists
    try {
      await fs.access(webpPath);
      console.log(`⏭️  Skipping ${filename} (WebP exists)`);
      return;
    } catch {
      // WebP doesn't exist, proceed
    }

    const image = sharp(filePath);
    const metadata = await image.metadata();

    // Resize if too large
    if (metadata.width > MAX_WIDTH) {
      image.resize(MAX_WIDTH, null, {
        withoutEnlargement: true,
        fit: 'inside',
      });
    }

    // Convert to WebP
    await image
      .webp({ quality: QUALITY })
      .toFile(webpPath);

    const originalSize = (await fs.stat(filePath)).size;
    const newSize = (await fs.stat(webpPath)).size;
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);

    console.log(`✅ ${filename}: ${formatBytes(originalSize)} → ${formatBytes(newSize)} (${savings}% smaller)`);
  } catch (error) {
    console.error(`❌ Failed to optimize ${filePath}:`, error.message);
  }
}

async function findImages(dir) {
  const files = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.next') {
      files.push(...await findImages(fullPath));
    } else if (entry.isFile() && /\.(png|jpg|jpeg)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

async function main() {
  console.log('🖼️  AIB-AXYS Image Optimization Script\n');
  console.log(`📁 Scanning: ${PUBLIC_DIR}\n`);

  try {
    const images = await findImages(PUBLIC_DIR);
    
    if (images.length === 0) {
      console.log('No images found to optimize.');
      return;
    }

    console.log(`Found ${images.length} images. Starting optimization...\n`);

    for (const imagePath of images) {
      await optimizeImage(imagePath);
    }

    console.log('\n✨ Optimization complete!');
    console.log('\n⚠️  MANUAL STEPS REQUIRED:');
    console.log('1. Update Image components to use .webp extensions');
    console.log('2. Add fallback for browsers without WebP support:');
    console.log('   <picture>');
    console.log('     <source srcset="/image.webp" type="image/webp" />');
    console.log('     <img src="/image.png" alt="" />');
    console.log('   </picture>');
    console.log('3. Test all pages to ensure images load correctly');
    console.log('4. Once verified, delete original PNG/JPG files to save space');

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main();
