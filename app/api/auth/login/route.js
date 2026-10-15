// Force dynamic rendering for admin routes
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import Role from '@/models/Role';
import { comparePassword, generateToken } from '@/lib/auth';
import { rateLimit } from '@/lib/security';

export async function POST(request) {
  try {
    // Get IP for rate limiting
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    
    // Rate limit: 5 login attempts per 5 minutes per IP
    const rateCheck = rateLimit(ipAddress, 5, 300000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again in 5 minutes.' },
        { status: 429 }
      );
    }

    await connectDB();

    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find admin user and populate role
    const admin = await Admin.findOne({ email: email.toLowerCase() }).populate('role');

    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if account is active
    if (!admin.isActive) {
      return NextResponse.json(
        { error: 'Account is disabled' },
        { status: 401 }
      );
    }

    // Check if role exists and is active
    if (!admin.role || !admin.role.isActive) {
      return NextResponse.json(
        { error: 'Invalid role configuration' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await comparePassword(password, admin.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token with role and permissions
    const token = generateToken({
      id: admin._id.toString(),
      email: admin.email,
      role: admin.role._id.toString(),
      roleName: admin.role.name,
      roleSlug: admin.role.slug,
      permissions: admin.role.permissions,
    });

    // Create response with token in cookie
    const response = NextResponse.json(
      {
        success: true,
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: {
            id: admin.role._id,
            name: admin.role.name,
            slug: admin.role.slug,
            permissions: admin.role.permissions,
          },
        },
      },
      { status: 200 }
    );

    // Set HTTP-only cookie
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
