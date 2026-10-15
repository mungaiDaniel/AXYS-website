// Force dynamic rendering for admin routes
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import Role from '@/models/Role';
import { hashPassword } from '@/lib/auth';

/**
 * Initialize admin account
 * This endpoint creates the initial admin if it doesn't exist
 */
export async function POST(request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin already exists' },
        { status: 400 }
      );
    }

    // Find or create Super Admin role (check by both name and slug)
    let superAdminRole = await Role.findOne({ $or: [ { slug: 'super-admin' }, { name: 'Super Admin' } ] });

    if (!superAdminRole) {
      // Double-check for duplicates before create (race condition safety)
      const duplicate = await Role.findOne({ $or: [ { slug: 'super-admin' }, { name: 'Super Admin' } ] });
      if (duplicate) {
        superAdminRole = duplicate;
      } else {
        try {
          superAdminRole = await Role.create({
            name: 'Super Admin',
            slug: 'super-admin',
            permissions: [
              'view_dashboard',
              'manage_admins',
              'manage_roles',
              'manage_contacts',
              'manage_research',
              'manage_ipo',
              'manage_pages',
              'manage_settings',
              'view_analytics',
              'manage_users',
              'manage_content',
              'view_reports',
            ],
            isSystem: true,
            description: 'Full system access',
            isActive: true,
          });
        } catch (err) {
          if (err.code === 11000) {
            // Duplicate detected, fetch the existing one
            superAdminRole = await Role.findOne({ $or: [ { slug: 'super-admin' }, { name: 'Super Admin' } ] });
          } else {
            throw err;
          }
        }
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create admin
    const admin = await Admin.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name: 'Admin',
      role: superAdminRole._id,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Admin created successfully',
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Init admin error:', error);
    return NextResponse.json(
      { error: 'Failed to create admin' },
      { status: 500 }
    );
  }
}
