// Force dynamic rendering for admin routes
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import Role from '@/models/Role';
import { requireSuperAdmin, hashPassword } from '@/lib/auth';

// GET - Fetch all admin users (Super Admin only)
export async function GET(request) {
  try {
    const adminData = await requireSuperAdmin(request);

    await connectDB();

    const users = await Admin.find()
      .populate('role', 'name slug permissions isSystem')
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(100);

    // Format response to include role details
    const formattedUsers = users.map(user => ({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role ? {
        id: user.role._id,
        name: user.role.name,
        slug: user.role.slug,
        permissionsCount: user.role.permissions?.length || 0,
        isSystem: user.role.isSystem,
      } : null,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    return NextResponse.json({ users: formattedUsers }, { status: 200 });
  } catch (error) {
    if (error.message.includes('Forbidden') || error.message === 'Unauthorized') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Get users error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST - Create new admin user (Super Admin only)
export async function POST(request) {
  try {
    const adminData = await requireSuperAdmin(request);

    await connectDB();

    const { email, password, name, roleId } = await request.json();

    // Validate
    if (!email || !password || !roleId) {
      return NextResponse.json({ error: 'Email, password, and role required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Validate role exists
    const role = await Role.findById(roleId);
    if (!role || !role.isActive) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Check if user exists
    const existing = await Admin.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user with roleId
    const user = await Admin.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name || 'Admin',
      role: roleId, // ObjectId reference
    });

    // Populate role for response
    const populatedUser = await Admin.findById(user._id).populate('role', 'name slug');

    return NextResponse.json(
      {
        success: true,
        user: {
          id: populatedUser._id,
          email: populatedUser.email,
          name: populatedUser.name,
          role: {
            id: populatedUser.role._id,
            name: populatedUser.role.name,
            slug: populatedUser.role.slug,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error.message.includes('Forbidden') || error.message === 'Unauthorized') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Create user error:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

// DELETE - Remove admin user (Super Admin only)
export async function DELETE(request) {
  try {
    const adminData = await requireSuperAdmin(request);

    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    // Prevent deleting yourself
    if (userId === adminData.id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    await Admin.findByIdAndDelete(userId);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error.message.includes('Forbidden') || error.message === 'Unauthorized') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Delete user error:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}

// PATCH - Update admin user (Super Admin only)
export async function PATCH(request) {
  try {
    const adminData = await requireSuperAdmin(request);

    await connectDB();

    const { userId, name, roleId, isActive, newPassword } = await request.json();

    // Validate roleId if provided
    if (roleId) {
      const role = await Role.findById(roleId);
      if (!role || !role.isActive) {
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (roleId) updateData.role = roleId; // ObjectId reference
    if (isActive !== undefined) updateData.isActive = isActive;
    
    // Handle password change
    if (newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
      }
      updateData.password = await hashPassword(newPassword);
    }

    const user = await Admin.findByIdAndUpdate(userId, updateData, { new: true })
      .populate('role', 'name slug')
      .select('-password');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role ? {
            id: user.role._id,
            name: user.role.name,
            slug: user.role.slug,
          } : null,
          isActive: user.isActive,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (error.message.includes('Forbidden') || error.message === 'Unauthorized') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
