// Force dynamic rendering for admin routes
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';
import { verifyAdminRequest } from '@/lib/auth';

// GET - Fetch all contacts
export async function GET(request) {
  try {
    const adminData = verifyAdminRequest(request);
    if (!adminData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const subject = searchParams.get('subject');
    const limitParam = searchParams.get('limit');
    const pageParam = searchParams.get('page');

    let query = {};
    if (status) query.status = status;
    if (subject) query.subject = subject;

    // Pagination / sizing (defaults chosen to keep admin UI accurate without overwhelming payloads)
    const limit = Math.min(Math.max(parseInt(limitParam || '1000', 10) || 1000, 1), 5000);
    const page = Math.max(parseInt(pageParam || '1', 10) || 1, 1);
    const skip = (page - 1) * limit;

    const [total, contacts] = await Promise.all([
      Contact.countDocuments(query),
      Contact.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    return NextResponse.json(
      {
        contacts,
        pagination: {
          total,
          page,
          limit,
          returned: contacts.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get contacts error:', error);
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}

// PATCH - Update contact status/notes
export async function PATCH(request) {
  try {
    const adminData = verifyAdminRequest(request);
    if (!adminData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { id, status, notes } = await request.json();

    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const contact = await Contact.findByIdAndUpdate(id, updateData, { new: true });

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json({ contact }, { status: 200 });
  } catch (error) {
    console.error('Update contact error:', error);
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
  }
}

// DELETE - Delete contact
export async function DELETE(request) {
  try {
    const adminData = verifyAdminRequest(request);
    if (!adminData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Get contact data before deletion (for audit)
    const contact = await Contact.findById(id);

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    // Delete the contact
    await Contact.findByIdAndDelete(id);

    // Audit log the deletion
    try {
      const AuditLog = (await import('@/models/AuditLog')).default;
      await AuditLog.create({
        adminId: adminData.id || adminData._id,
        adminEmail: adminData.email,
        action: 'contact_delete',
        resourceType: 'contact',
        resourceId: id,
        details: {
          contactId: id,
          contactEmail: contact.email,
          contactName: contact.name,
          subject: contact.subject,
        },
        ipAddress:
          request.headers.get('x-forwarded-for') ||
          request.headers.get('x-real-ip') ||
          'unknown',
        userAgent: request.headers.get('user-agent') || '',
      });
    } catch (auditError) {
      console.error('Audit logging failed:', auditError);
      // Continue - don't fail the operation if audit fails
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Delete contact error:', error);
    return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
  }
}
