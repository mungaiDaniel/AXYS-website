#!/usr/bin/env node

/**
 * MongoDB Database Import Script
 * Imports all collections from exported JSON files
 * 
 * USAGE:
 * 1. Update MONGO_URL and DB_NAME in your .env file
 * 2. Run: node import-database.js
 */

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME || 'aib-axys';

async function importDatabase() {
  console.log('🔄 Starting MongoDB Import...');
  console.log(`📊 Target Database: ${DB_NAME}`);
  console.log('');

  let client;
  
  try {
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    client = new MongoClient(MONGO_URL);
    await client.connect();
    const db = client.db(DB_NAME);
    
    console.log('✅ Connected successfully');
    console.log('');

    // Get all JSON files
    const exportDir = __dirname;
    const files = fs.readdirSync(exportDir).filter(f => f.endsWith('.json'));
    
    console.log(`📦 Found ${files.length} collection files`);
    console.log('');

    let totalImported = 0;

    // Import each collection
    for (const file of files) {
      const collectionName = file.replace('.json', '');
      console.log(`📤 Importing: ${collectionName}`);
      
      const filePath = path.join(exportDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      if (data.length === 0) {
        console.log(`   ⚠️  Empty collection - skipping`);
        continue;
      }

      const collection = db.collection(collectionName);
      
      // Clear existing data (optional - remove this if you want to merge)
      await collection.deleteMany({});
      
      // Insert documents
      await collection.insertMany(data);
      
      console.log(`   ✅ ${data.length} documents imported`);
      totalImported += data.length;
    }

    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('✅ IMPORT COMPLETE!');
    console.log('═══════════════════════════════════════');
    console.log(`📊 Total collections: ${files.length}`);
    console.log(`📄 Total documents: ${totalImported}`);
    console.log('');

  } catch (error) {
    console.error('❌ Import failed:', error.message);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 Disconnected from MongoDB');
    }
  }
}

importDatabase();
