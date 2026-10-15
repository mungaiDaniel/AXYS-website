// Force dynamic rendering for admin routes
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Role from '@/models/Role';
import Admin from '@/models/Admin';
import { requireSuperAdmin } from '@/lib/auth';
import { isValidPermission } from '@/lib/permissions';

// GET - List all roles (Super Admin only)
export async function GET(request) {
  try {
    // Verify Super Admin access
    const adminData = await requireSuperAdmin(request);

    await connectDB();

    const roles = await Role.find()
      .sort({ isSystem: -1, name: 1 }) // System roles first
      .select('-__v');

    // Get user count for each role
    const rolesWithCounts = await Promise.all(
      roles.map(async (role) => {
        const userCount = await Admin.countDocuments({ role: role._id });
        return {
          ...role.toObject(),
          userCount,
        };
      })
    );

    return NextResponse.json({ roles: rolesWithCounts }, { status: 200 });
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Get roles error:', error);
    return NextResponse.json({ error: 'Failed to fetch roles' }, { status: 500 });
  }
}

// POST - Create new role (Super Admin only)
export async function POST(request) {
  try {
    // Verify Super Admin access
    const adminData = await requireSuperAdmin(request);

    await connectDB();

    const { name, description, permissions } = await request.json();

    // Validate input
    if (!name || !Array.isArray(permissions)) {
      return NextResponse.json(
        { error: 'Name and permissions array required' },
        { status: 400 }
      );
    }

    // Validate all permissions are valid
    const invalidPermissions = permissions.filter(perm => !isValidPermission(perm));
    if (invalidPermissions.length > 0) {
      return NextResponse.json(
        { error: `Invalid permissions: ${invalidPermissions.join(', ')}` },
        { status: 400 }
      );
    }

    // Auto-generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');

    // Check if role with same name or slug exists
    const existing = await Role.findOne({
      $or: [{ name }, { slug }],
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Role with this name already exists' },
        { status: 400 }
      );
    }

    // Create new role
    const role = await Role.create({
      name,
      slug,
      description: description || '',
      permissions,
      isSystem: false,
      createdBy: adminData.id,
    });

    // Audit log
    try {
      const AuditLog = (await import('@/models/AuditLog')).default;
      await AuditLog.create({
        adminEmail: adminData.email,
        action: 'ROLE_CREATED',
        details: {
          roleId: role._id,
          roleName: role.name,
          permissionsCount: permissions.length,
        },
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        timestamp: new Date(),
      });
    } catch (auditError) {
      console.error('Audit logging failed:', auditError);
    }

    return NextResponse.json(
      {
        success: true,
        role: {
          id: role._id,
          name: role.name,
          slug: role.slug,
          description: role.description,
          permissions: role.permissions,
          isSystem: role.isSystem,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Create role error:', error);
    return NextResponse.json({ error: 'Failed to create role' }, { status: 500 });
  }
}

// PATCH - Update role (Super Admin only)
export async function PATCH(request) {
  try {
    // Verify Super Admin access
    const adminData = await requireSuperAdmin(request);

    await connectDB();

    const { id, name, description, permissions } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Role ID required' }, { status: 400 });
    }

    const role = await Role.findById(id);

    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    // Prevent editing system roles' core properties
    if (role.isSystem) {
      return NextResponse.json(
        { error: 'Cannot modify system roles' },
        { status: 403 }
      );
    }

    // Validate permissions if provided
    if (permissions && Array.isArray(permissions)) {
      const invalidPermissions = permissions.filter(perm => !isValidPermission(perm));
      if (invalidPermissions.length > 0) {
        return NextResponse.json(
          { error: `Invalid permissions: ${invalidPermissions.join(', ')}` },
          { status: 400 }
        );
      }
      role.permissions = permissions;
    }

    // Update fields
    if (name) role.name = name;
    if (description !== undefined) role.description = description;

    await role.save();

    // Audit log
    try {
      const AuditLog = (await import('@/models/AuditLog')).default;
      await AuditLog.create({
        adminEmail: adminData.email,
        action: 'ROLE_UPDATED',
        details: {
          roleId: role._id,
          roleName: role.name,
          changes: { name, description, permissionsCount: permissions?.length },
        },
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        timestamp: new Date(),
      });
    } catch (auditError) {
      console.error('Audit logging failed:', auditError);
    }

    return NextResponse.json(
      {
        success: true,
        role: {
          id: role._id,
          name: role.name,
          slug: role.slug,
          description: role.description,
          permissions: role.permissions,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Update role error:', error);
    return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
  }
}

// DELETE - Delete role (Super Admin only)
export async function DELETE(request) {
  try {
    // Verify Super Admin access
    const adminData = await requireSuperAdmin(request);

    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Role ID required' }, { status: 400 });
    }

    const role = await Role.findById(id);

    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    // Prevent deleting system roles
    if (role.isSystem) {
      return NextResponse.json(
        { error: 'Cannot delete system roles' },
        { status: 403 }
      );
    }

    // Check if any users are assigned to this role
    const usersWithRole = await Admin.countDocuments({ role: id });

    if (usersWithRole > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete role. ${usersWithRole} user(s) are assigned to this role.`,
          usersAssigned: usersWithRole,
        },
        { status: 400 }
      );
    }

    // Delete the role
    await Role.findByIdAndDelete(id);

    // Audit log
    try {
      const AuditLog = (await import('@/models/AuditLog')).default;
      await AuditLog.create({
        adminEmail: adminData.email,
        action: 'ROLE_DELETED',
        details: {
          roleId: id,
          roleName: role.name,
          permissionsCount: role.permissions.length,
        },
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        timestamp: new Date(),
      });
    } catch (auditError) {
      console.error('Audit logging failed:', auditError);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Delete role error:', error);
    return NextResponse.json({ error: 'Failed to delete role' }, { status: 500 });
  }
}
