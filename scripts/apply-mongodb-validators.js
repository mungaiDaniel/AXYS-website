#!/usr/bin/env node
/**
 * Apply MongoDB collection validators to match Mongoose schemas.
 * Fixes "Document failed validation" (code 121) in production for research uploads, document uploads, and user creation.
 *
 * Usage:
 *   npm run db:apply-validators
 *
 * Uses MONGODB_URI or MONGO_URI from .env (loaded automatically).
 * Run against the DB you want to fix (e.g. set .env to production URI before running).
 */

const path = require('path');
const fs = require('fs');

// Load .env from project root (same pattern as scripts/seed-roles.js)
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key) process.env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
    }
  });
}

const { MongoClient } = require('mongodb');

// Validators aligned with models/ResearchPaper.js, models/Admin.js, models/Document.js, and models/GlobalFund.js
const VALIDATORS = {
  researchpapers: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'fileName', 'fileUrl'],
      properties: {
        title: { bsonType: 'string' },
        description: { bsonType: 'string' },
        category: {
          bsonType: 'string',
          enum: [
            'price-list',
            'daily-briefs',
            'weekly-note',
            'company-specific-reports',
            'fixed-income-notes',
            'stock-recommendations',
            'quarterly-reports',
            'topical-reports',
            'bespoke-reports',
            'market-analysis',
            'ipo-analysis',
            'sector-reports',
            'information-memorandums',
            'company',
            'other',
          ],
        },
        company: { bsonType: 'string' },
        sector: { bsonType: 'string' },
        fileName: { bsonType: 'string' },
        fileUrl: { bsonType: 'string' },
        fileSize: { bsonType: ['int', 'long', 'double'] },
        publishedDate: { bsonType: 'date' },
        isPublished: { bsonType: 'bool' },
        tags: {
          bsonType: 'array',
          items: { bsonType: 'string' },
        },
        downloadCount: { bsonType: ['int', 'long', 'double'] },
      },
      additionalProperties: true,
    },
  },
  admins: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'password', 'role'],
      properties: {
        email: { bsonType: 'string' },
        password: { bsonType: 'string' },
        name: { bsonType: 'string' },
        role: { bsonType: 'objectId' },
        isActive: { bsonType: 'bool' },
      },
      additionalProperties: true,
    },
  },
  documents: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'category', 'fileName', 'fileUrl'],
      properties: {
        title: { bsonType: 'string' },
        description: { bsonType: 'string' },
        category: {
          bsonType: 'string',
          enum: [
            'terms-and-conditions',
            'audited-financial-reports',
            'unaudited-financial-reports',
            'application-forms',
            'press-releases',
            'news',
            'fees-and-tariffs',
            'compliance-documents',
            // Used for documents attached to Global Funds
            'global-funds',
            'other',
          ],
        },
        fileName: { bsonType: 'string' },
        fileUrl: { bsonType: 'string' },
        fileSize: { bsonType: ['int', 'long', 'double'] },
        fileType: { bsonType: 'string' },
        isPublished: { bsonType: 'bool' },
        publishedDate: { bsonType: 'date' },
        downloadCount: { bsonType: ['int', 'long', 'double'] },
        uploadedBy: { bsonType: 'string' },
      },
      additionalProperties: true,
    },
  },
  globalfunds: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['fundName', 'description'],
      properties: {
        fundName: { bsonType: 'string' },
        description: { bsonType: 'string' },
        performance: { bsonType: 'string' },
        documents: {
          bsonType: 'array',
          items: {
            bsonType: 'object',
            required: ['name', 'url'],
            properties: {
              name: { bsonType: 'string' },
              url: { bsonType: 'string' },
              uploadedAt: { bsonType: 'date' },
            },
            additionalProperties: true,
          },
        },
        isVisible: { bsonType: 'bool' },
        displayOrder: { bsonType: ['int', 'long', 'double'] },
        createdBy: { bsonType: 'string' },
        lastModifiedBy: { bsonType: 'string' },
      },
      additionalProperties: true,
    },
  },
  contacts: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'email', 'phone', 'subject', 'message'],
      properties: {
        name: { bsonType: 'string' },
        email: { bsonType: 'string' },
        phone: { bsonType: 'string' },
        subject: {
          bsonType: 'string',
          enum: [
            'account-opening',
            'ipo',
            'dangote-ipo',
            'funding-issues',
            'password-reset',
            'dormant-account',
            'general',
            'offshore',
          ],
        },
        message: { bsonType: 'string' },
        hasCDSC: {
          bsonType: 'string',
          enum: ['yes', 'no', ''],
        },
        cdscNumber: { bsonType: 'string' },
        referralSource: { bsonType: 'string' },
        status: {
          bsonType: 'string',
          enum: ['new', 'read', 'responded'],
        },
        emailSent: { bsonType: 'bool' },
        notes: { bsonType: 'string' },
      },
      additionalProperties: true,
    },
  },
};

async function applyValidators() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.MONGODB_URL || process.env.MONGO_URL;
  if (!uri) {
    console.error('Missing MONGODB_URI, MONGO_URI, MONGODB_URL, or MONGO_URL. Set it in .env or the environment.');
    process.exit(1);
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    console.log('Connected to MongoDB. Applying validators...\n');

    for (const [collName, validator] of Object.entries(VALIDATORS)) {
      try {
        await db.command({
          collMod: collName,
          validator,
          validationLevel: 'moderate',
          validationAction: 'error',
        });
        console.log('  ✓', collName, '– validator applied');
      } catch (err) {
        if (err.code === 26 || err.codeName === 'NamespaceNotFound') {
          console.log('  ○', collName, '– collection does not exist yet (created on first insert)');
        } else {
          console.error('  ✗', collName, '–', err.message);
        }
      }
    }

    console.log('\nDone. Research uploads, document uploads, global fund creation, contact form submissions, and user creation should now pass validation.');
  } finally {
    await client.close();
  }
}

applyValidators().catch((err) => {
  console.error(err);
  process.exit(1);
});
