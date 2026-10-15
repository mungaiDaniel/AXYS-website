#!/usr/bin/env node

/**
 * MongoDB Database Export Script
 * Exports all collections to JSON files for handover to external developer
 */

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Read environment variables manually
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const MONGO_URL = envVars.MONGO_URL || process.env.MONGO_URL;
const DB_NAME = envVars.DB_NAME || process.env.DB_NAME || 'aib-axys';

async function exportDatabase() {
  console.log('🔄 Starting MongoDB Export...');
  console.log(`📊 Database: ${DB_NAME}`);
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

    // Create export directory
    const exportDir = path.join(__dirname, '..', 'database-export');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    // Get all collections
    const collections = await db.listCollections().toArray();
    console.log(`📦 Found ${collections.length} collections`);
    console.log('');

    let totalDocuments = 0;

    // Export each collection
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      console.log(`📥 Exporting: ${collectionName}`);
      
      const collection = db.collection(collectionName);
      const documents = await collection.find({}).toArray();
      
      // Write to JSON file
      const filename = path.join(exportDir, `${collectionName}.json`);
      fs.writeFileSync(filename, JSON.stringify(documents, null, 2));
      
      console.log(`   ✅ ${documents.length} documents → ${collectionName}.json`);
      totalDocuments += documents.length;
    }

    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('✅ EXPORT COMPLETE!');
    console.log('═══════════════════════════════════════');
    console.log(`📊 Total collections: ${collections.length}`);
    console.log(`📄 Total documents: ${totalDocuments}`);
    console.log(`📁 Export location: ${exportDir}`);
    console.log('');
    console.log('📦 Files created:');
    
    const exportedFiles = fs.readdirSync(exportDir);
    exportedFiles.forEach(file => {
      const filePath = path.join(exportDir, file);
      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`   - ${file} (${sizeKB} KB)`);
    });

    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Zip the database-export folder');
    console.log('2. Share with external developer');
    console.log('3. Developer uses import script to restore');
    console.log('');

    // Create import script
    createImportScript(exportDir);

  } catch (error) {
    console.error('❌ Export failed:', error.message);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 Disconnected from MongoDB');
    }
  }
}

function createImportScript(exportDir) {
  const importScript = `#!/usr/bin/env node

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
  console.log(\`📊 Target Database: \${DB_NAME}\`);
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
    
    console.log(\`📦 Found \${files.length} collection files\`);
    console.log('');

    let totalImported = 0;

    // Import each collection
    for (const file of files) {
      const collectionName = file.replace('.json', '');
      console.log(\`📤 Importing: \${collectionName}\`);
      
      const filePath = path.join(exportDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      if (data.length === 0) {
        console.log(\`   ⚠️  Empty collection - skipping\`);
        continue;
      }

      const collection = db.collection(collectionName);
      
      // Clear existing data (optional - remove this if you want to merge)
      await collection.deleteMany({});
      
      // Insert documents
      await collection.insertMany(data);
      
      console.log(\`   ✅ \${data.length} documents imported\`);
      totalImported += data.length;
    }

    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('✅ IMPORT COMPLETE!');
    console.log('═══════════════════════════════════════');
    console.log(\`📊 Total collections: \${files.length}\`);
    console.log(\`📄 Total documents: \${totalImported}\`);
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
`;

  const scriptPath = path.join(exportDir, 'import-database.js');
  fs.writeFileSync(scriptPath, importScript);
  console.log(`📝 Created import script: ${scriptPath}`);
}

// Run export
exportDatabase();
