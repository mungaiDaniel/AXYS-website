#!/usr/bin/env node
/**
 * Dashboard Test Data Seeder
 * 
 * Creates realistic test data for the admin dashboard:
 * - Contact form submissions
 * - Analytics events (page views, sessions, user interactions)
 * 
 * Usage: node scripts/seed-dashboard-data.js
 */

const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Load environment variables
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
}

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
}

const CONTACT_SUBJECTS = ['account-opening', 'ipo', 'funding-issues', 'general'];
const REFERRAL_SOURCES = ['google', 'facebook', 'linkedin', 'direct', 'email', 'referral'];
const PAGE_URLS = [
  '/platforms',
  '/ipo',
  '/leverage',
  '/research',
  '/downloads',
  '/global-markets',
  '/services',
  '/about',
  '/contact',
];
const EVENT_TYPES = ['page_view', 'button_click', 'form_submit', 'link_click', 'download'];
const DEVICE_TYPES = ['mobile', 'tablet', 'desktop'];

function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateContactName() {
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'Robert', 'Lisa', 'James', 'Mary'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
}

function generateEmail() {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.com', 'business.co.ke'];
  const name = Math.random().toString(36).substr(2, 8);
  return `${name}@${domains[Math.floor(Math.random() * domains.length)]}`;
}

function generatePhone() {
  return `+254${Math.floor(Math.random() * 900000000 + 100000000)}`;
}

function generateMessage(subject) {
  const messages = {
    'account-opening': 'I would like to open a trading account with AIB AXYS. Could you provide more information about the account opening process?',
    'ipo': 'I am interested in participating in the Quick Mart PLC IPO. Can you provide details about the subscription process?',
    'funding-issues': 'I need help with a funding issue on my account.',
    'general': 'I have a general inquiry about your services. Can someone from your team get in touch with me?',
  };
  return messages[subject] || 'I am interested in your services.';
}

async function seedContacts(count = 500) {
  console.log(`\n📧 Creating ${count} contact submissions...\n`);

  const contacts = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const status = Math.random() < 0.3 ? 'new' : Math.random() < 0.6 ? 'read' : 'responded';
    const subject = CONTACT_SUBJECTS[Math.floor(Math.random() * CONTACT_SUBJECTS.length)];
    
    const contact = {
      name: generateContactName(),
      email: generateEmail(),
      phone: generatePhone(),
      subject,
      message: generateMessage(subject),
      hasCDSC: Math.random() < 0.5 ? 'yes' : 'no',
      cdscNumber: Math.random() < 0.5 ? `${Math.floor(Math.random() * 1000000000)}` : '',
      referralSource: REFERRAL_SOURCES[Math.floor(Math.random() * REFERRAL_SOURCES.length)],
      status,
      emailSent: status !== 'new',
      notes: status === 'responded' ? 'Contacted client with further information' : '',
      createdAt: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    };
    
    contacts.push(contact);
  }

  try {
    const result = await mongoose.connection.collection('contacts').insertMany(contacts);
    console.log(`✅ Created ${result.insertedIds.length} contact submissions`);
    
    // Log distribution
    const newCount = contacts.filter(c => c.status === 'new').length;
    const ipoCount = contacts.filter(c => c.subject === 'ipo').length;
    const leverageCount = contacts.filter(c => c.subject === 'funding-issues').length;
    
    console.log(`   - New submissions: ${newCount}`);
    console.log(`   - IPO applications: ${ipoCount}`);
    console.log(`   - Leverage inquiries: ${leverageCount}`);
  } catch (error) {
    console.error('❌ Error creating contacts:', error.message);
  }
}

async function seedAnalyticsEvents(count = 3000) {
  console.log(`\n📊 Creating ${count} analytics events...\n`);

  const events = [];
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const activeSessions = new Set();
  
  // Create realistic sessions
  const sessionCount = Math.floor(count / 10);
  for (let i = 0; i < sessionCount; i++) {
    activeSessions.add(generateSessionId());
  }
  
  const sessions = Array.from(activeSessions);
  
  for (let i = 0; i < count; i++) {
    const sessionId = sessions[Math.floor(Math.random() * sessions.length)];
    const eventType = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];
    const pageUrl = PAGE_URLS[Math.floor(Math.random() * PAGE_URLS.length)];
    const deviceType = DEVICE_TYPES[Math.floor(Math.random() * DEVICE_TYPES.length)];
    
    const event = {
      eventType,
      pageUrl,
      elementId: eventType === 'button_click' ? `btn_${Math.floor(Math.random() * 1000)}` : '',
      metadata: {},
      timestamp: new Date(sevenDaysAgo.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000),
      sessionId,
      userId: `user_${Math.floor(Math.random() * 1000)}`,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      referrer: Math.random() < 0.5 ? 'google.com' : 'direct',
      deviceType,
    };
    
    events.push(event);
  }

  try {
    const result = await mongoose.connection.collection('analyticsevents').insertMany(events);
    console.log(`✅ Created ${result.insertedIds.length} analytics events`);
    
    // Log distribution
    const pageViews = events.filter(e => e.eventType === 'page_view').length;
    const clicks = events.filter(e => e.eventType === 'button_click').length;
    const uniqueSessions = new Set(events.map(e => e.sessionId)).size;
    
    console.log(`   - Page views: ${pageViews}`);
    console.log(`   - Button clicks: ${clicks}`);
    console.log(`   - Unique sessions: ${uniqueSessions}`);
  } catch (error) {
    console.error('❌ Error creating analytics events:', error.message);
  }
}

async function main() {
  console.log('\n🌱 Dashboard Data Seeder\n');
  console.log('This script will populate the database with realistic test data');
  
  await connectDB();
  
  try {
    // Clear existing data (optional - comment out if you want to append)
    console.log('\n🧹 Clearing existing test data...');
    await mongoose.connection.collection('contacts').deleteMany({});
    await mongoose.connection.collection('analyticsevents').deleteMany({});
    console.log('✅ Cleared existing data');
    
    // Seed data
    await seedContacts(500);
    await seedAnalyticsEvents(3000);
    
    console.log('\n✅ Dashboard data seeding complete!\n');
    console.log('📈 Dashboard statistics:');
    
    // Show final counts
    const contactCount = await mongoose.connection.collection('contacts').countDocuments();
    const newContactCount = await mongoose.connection.collection('contacts').countDocuments({ status: 'new' });
    const ipoCount = await mongoose.connection.collection('contacts').countDocuments({ subject: 'ipo' });
    const eventCount = await mongoose.connection.collection('analyticsevents').countDocuments();
    const sessionCount = (await mongoose.connection.collection('analyticsevents').distinct('sessionId')).length;
    
    console.log(`   - Total Contacts: ${contactCount}`);
    console.log(`   - New Submissions: ${newContactCount}`);
    console.log(`   - IPO Applications: ${ipoCount}`);
    console.log(`   - Total Events: ${eventCount}`);
    console.log(`   - Unique Sessions: ${sessionCount}`);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB\n');
  }
}

main();
