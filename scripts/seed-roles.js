#!/usr/bin/env node
/**
 * RBAC Migration & Seeder Script
 * 
 * This script:
 * 1. Creates system roles (Super Admin, Admin, Viewer)
 * 2. Migrates existing admin users from string-based roles to ObjectId references
 * 
 * IMPORTANT: Run this ONCE before using the new RBAC system
 * Usage: node scripts/seed-roles.js
 */

const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Manually load environment variables
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

// Import permission definitions
const { SUPER_ADMIN_PERMISSIONS, DEFAULT_ADMIN_PERMISSIONS } = require('../lib/permissions');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
}

async function seedSystemRoles() {
  console.log('\n📦 Seeding System Roles...\n');

  const systemRoles = [
    {
      name: 'Super Admin',
      slug: 'super_admin',
      description: 'Full system access with all permissions. Cannot be deleted.',
      permissions: SUPER_ADMIN_PERMISSIONS,
      isSystem: true,
      isActive: true,
    },
    {
      name: 'Admin',
      slug: 'admin',
      description: 'Standard administrator with most permissions except user and role management.',
      permissions: DEFAULT_ADMIN_PERMISSIONS,
      isSystem: true,
      isActive: true,
    },
    {
      name: 'Viewer',
      slug: 'viewer',
      description: 'Read-only access to most resources.',
      permissions: [
        'research.view',
        'documents.view',
        'contacts.view',
        'ipo.view',
        'exchange_rates.view',
        'global_funds.view',
        'analytics.view',
        'logs.view',
      ],
      isSystem: true,
      isActive: true,
    },
  ];

  const createdRoles = {};

  for (const roleData of systemRoles) {
    try {
      // Use direct MongoDB operations to avoid model hooks
      // Extra validation: check for existing role by name or slug
      const existingRole = await mongoose.connection.collection('roles').findOne({
        $or: [
          { slug: roleData.slug },
          { name: roleData.name },
        ],
      });

      if (existingRole) {
        // Update existing role
        await mongoose.connection.collection('roles').updateOne(
          { _id: existingRole._id },
          { $set: {
            permissions: roleData.permissions,
            description: roleData.description,
            isSystem: roleData.isSystem,
            isActive: roleData.isActive,
            updatedAt: new Date(),
          }}
        );
        console.log(`✅ Updated system role: ${roleData.name} (${roleData.permissions.length} permissions)`);
        createdRoles[roleData.slug] = { ...existingRole, ...roleData };
      } else {
        // Create new role
        const result = await mongoose.connection.collection('roles').insertOne({
          ...roleData,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(`✅ Created system role: ${roleData.name} (${roleData.permissions.length} permissions)`);
        createdRoles[roleData.slug] = { _id: result.insertedId, ...roleData };
      }
    } catch (error) {
      if (error.code === 11000) {
        console.error(`❌ Duplicate role detected for name or slug: ${roleData.name} / ${roleData.slug}`);
      } else {
        console.error(`❌ Error with role ${roleData.name}:`, error.message);
      }
    }
  }

  return createdRoles;
}

async function migrateAdminUsers(roles) {
  console.log('\n👥 Migrating Admin Users...\n');

  try {
    const admins = await mongoose.connection.collection('admins').find({}).toArray();
    let migratedCount = 0;
    let skippedCount = 0;

    for (const admin of admins) {
      try {
        // Check if role is already an ObjectId
        if (admin.role && mongoose.Types.ObjectId.isValid(admin.role) && admin.role.constructor.name === 'ObjectId') {
          console.log(`⏭️  ${admin.email} - Already migrated`);
          skippedCount++;
          continue;
        }

        // Map old string role to new Role ObjectId
        let newRoleId;
        const oldRole = admin.role || 'admin';

        if (oldRole === 'super-admin') {
          newRoleId = roles.super-admin._id;
        } else {
          // Default to admin role
          newRoleId = roles.admin._id;
        }

        // Update the admin's role
        /*await mongoose.connection.collection('admins').updateOne(
          { _id: admin._id },
          { $set: { role: newRoleId, updatedAt: new Date() } }
        );*/
	await mongoose.connection.collection('admins').updateOne(
	  { _id: admin._id },
	  { $set: { role: newRoleId, updatedAt: new Date() } },
	  { bypassDocumentValidation: true }
	);

        const roleName = oldRole === 'super-admin' ? 'Super Admin' : 'Admin';
        console.log(`✅ ${admin.email} → ${roleName}`);
        migratedCount++;
      } catch (error) {
        console.error(`❌ Error migrating ${admin.email}:`, error.message);
      }
    }

    console.log(`\n📊 Migration Summary:`);
    console.log(`   Migrated: ${migratedCount}`);
    console.log(`   Skipped: ${skippedCount}`);
    console.log(`   Total: ${admins.length}`);

  } catch (error) {
    console.error('❌ Migration error:', error);
  }
}

async function verifySetup() {
  console.log('\n🔍 Verification Report:\n');

  const roles = await mongoose.connection.collection('roles').find({}).toArray();
  const admins = await mongoose.connection.collection('admins').find({}).toArray();

  console.log(`📊 Roles in database: ${roles.length}`);
  roles.forEach(role => {
    const systemBadge = role.isSystem ? '[SYSTEM]' : '[CUSTOM]';
    console.log(`   ${systemBadge} ${role.name} (${role.slug}): ${role.permissions.length} permissions`);
  });

  console.log(`\n👥 Admin users: ${admins.length}`);
  for (const admin of admins) {
    const role = roles.find(r => r._id.toString() === admin.role?.toString());
    if (role) {
      console.log(`   ✅ ${admin.email} → ${role.name} (${role.permissions.length} permissions)`);
    } else {
      console.log(`   ❌ ${admin.email} → ROLE NOT FOUND`);
    }
  }
}

async function main() {
  console.log('═'.repeat(60));
  console.log('🚀 AIB-AXYS RBAC Migration & Seeder');
  console.log('═'.repeat(60));

  try {
    await connectDB();

    const roles = await seedSystemRoles();
    await migrateAdminUsers(roles);
    await verifySetup();

    console.log('\n═'.repeat(60));
    console.log('✅ RBAC Setup Complete!');
    console.log('═'.repeat(60));
    console.log('\nNext Steps:');
    console.log('1. Test login at /admin/login');
    console.log('2. Verify super admin has access to all features');
    console.log('3. Create custom roles via Admin UI (coming soon)');
    console.log('');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Setup failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

main();
