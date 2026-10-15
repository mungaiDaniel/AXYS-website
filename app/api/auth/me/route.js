// Force dynamic rendering for admin routes
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import Role from '@/models/Role';
import { verifyAdminRequest } from '@/lib/auth';

export async function GET(request) {
  try {
    const adminData = verifyAdminRequest(request);

    if (!adminData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const admin = await Admin.findById(adminData.id)
      .populate('role', 'name slug permissions isSystem')
      .select('-password');

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role ? {
            id: admin.role._id,
            name: admin.role.name,
            slug: admin.role.slug,
            permissions: admin.role.permissions,
            isSystem: admin.role.isSystem,
          } : null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get admin error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
