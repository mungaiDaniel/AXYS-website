// Force dynamic rendering for admin routes
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import EmailSettings from '@/models/EmailSettings';
import { verifyAdminRequest } from '@/lib/auth';

// GET - Fetch email settings
export async function GET(request) {
  try {
    const adminData = verifyAdminRequest(request);
    if (!adminData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    let settings = await EmailSettings.findOne();

    // Create default if doesn't exist
    if (!settings) {
      settings = await EmailSettings.create({
        host: 'smtp.office365.com',
        port: 587,
        isConfigured: false,
      });
    }

    // Don't send password to frontend
    return NextResponse.json(
      {
        settings: {
          host: settings.host,
          port: settings.port,
          user: settings.user,
          fromEmail: settings.fromEmail,
          isConfigured: settings.isConfigured,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get email settings error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// PUT - Update email settings
export async function PUT(request) {
  try {
    const adminData = verifyAdminRequest(request);
    if (!adminData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { host, port, user, password, fromEmail } = await request.json();

    let settings = await EmailSettings.findOne();

    if (!settings) {
      settings = await EmailSettings.create({
        host,
        port,
        user,
        password,
        fromEmail,
        isConfigured: !!(user && password),
      });
    } else {
      if (host) settings.host = host;
      if (port) settings.port = port;
      if (user) settings.user = user;
      if (password) settings.password = password;
      if (fromEmail) settings.fromEmail = fromEmail;
      settings.isConfigured = !!(settings.user && settings.password);
      await settings.save();
    }

    return NextResponse.json(
      {
        success: true,
        settings: {
          host: settings.host,
          port: settings.port,
          user: settings.user,
          fromEmail: settings.fromEmail,
          isConfigured: settings.isConfigured,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update email settings error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
