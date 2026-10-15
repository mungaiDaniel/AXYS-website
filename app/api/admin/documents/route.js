export const runtime = 'nodejs';

// Force dynamic rendering for admin routes
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Document from '@/models/Document';
import { verifyAdminRequest } from '@/lib/auth';

// GET - Fetch all documents
export async function GET(request) {
  try {
    const adminData = verifyAdminRequest(request);
    if (!adminData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const documents = await Document.find()
      .sort({ publishedDate: -1 })
      .limit(100);

    return NextResponse.json({ documents }, { status: 200 });
  } catch (error) {
    console.error('Get documents error:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

// POST - Upload new document
export async function POST(request) {
  try {
    const adminData = verifyAdminRequest(request);
    if (!adminData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const formData = await request.formData();
    const file = formData.get('file');
    const title = formData.get('title');
    const description = formData.get('description');
    const category = formData.get('category');

    if (!file || !title || !category) {
      return NextResponse.json({ error: 'File, title, and category are required' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, Word, and Excel files allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 50MB.' },
        { status: 400 }
      );
    }

    // Create upload directory
    const { mkdir, writeFile } = await import('fs/promises');
    const path = await import('path');
    // The live standalone server serves assets from .next/standalone/public,
    // while local development serves /public. Keep both locations in sync so a
    // newly uploaded document is downloadable immediately, without a restart.
    const uploadDirs = [...new Set([
      path.join(process.cwd(), 'public', 'documents'),
      path.join(process.cwd(), '.next', 'standalone', 'public', 'documents'),
    ])];
    await Promise.all(uploadDirs.map((directory) => mkdir(directory, { recursive: true })));

    // Generate unique filename
    const timestamp = Date.now();
    const ext = path.extname(file.name);
    const safeName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9-]/g, '_');
    const fileName = `${timestamp}-${safeName}${ext}`;
    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await Promise.all(uploadDirs.map((directory) => writeFile(path.join(directory, fileName), buffer)));

    // Create database entry
    const document = await Document.create({
      title,
      description: description || '',
      category,
      fileName: file.name,
      fileUrl: `/documents/${fileName}`,
      fileSize: file.size,
      fileType: file.type,
      publishedDate: new Date(),
      uploadedBy: adminData.email,
    });

    // Audit log
    try {
      const AuditLog = (await import('@/models/AuditLog')).default;
      await AuditLog.create({
        adminId: adminData.id || adminData._id,
        adminEmail: adminData.email,
        action: 'documents_upload',
        resourceType: 'document',
        resourceId: document._id.toString(),
        details: {
          documentId: document._id,
          title,
          category,
          fileName: file.name,
        },
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || '',
      });
    } catch (auditError) {
      console.error('Audit logging failed:', auditError);
    }

    console.log('✅ Document uploaded:', document._id);

    return NextResponse.json({ document }, { status: 201 });
  } catch (error) {
    console.error('Upload document error:', error);
    return NextResponse.json({ error: 'Failed to upload document' }, { status: 500 });
  }
}

// DELETE - Delete document
export async function DELETE(request) {
  try {
    const adminData = verifyAdminRequest(request);
    if (!adminData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const doc = await Document.findById(id);
    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    await Document.findByIdAndDelete(id);

    // Remove the matching upload from disk. Only delete files stored in this
    // application's managed /public/documents directory.
    if (doc.fileUrl?.startsWith('/documents/')) {
      try {
        const { unlink } = await import('fs/promises');
        const path = await import('path');
        const fileName = path.basename(doc.fileUrl);
        const documentDirs = [...new Set([
          path.join(process.cwd(), 'public', 'documents'),
          path.join(process.cwd(), '.next', 'standalone', 'public', 'documents'),
        ])];
        await Promise.all(documentDirs.map(async (directory) => {
          try {
            await unlink(path.join(directory, fileName));
          } catch (error) {
            if (error.code !== 'ENOENT') throw error;
          }
        }));
      } catch (fileError) {
        // The database record is already removed; a missing file should not
        // prevent the admin from completing the deletion.
        if (fileError.code !== 'ENOENT') {
          console.error('Failed to remove document file:', fileError);
        }
      }
    }

    // Audit log
    try {
      const AuditLog = (await import('@/models/AuditLog')).default;
      await AuditLog.create({
        adminId: adminData.id || adminData._id,
        adminEmail: adminData.email,
        action: 'documents_delete',
        resourceType: 'document',
        resourceId: id,
        details: {
          documentId: id,
          title: doc.title,
          category: doc.category,
        },
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || '',
      });
    } catch (auditError) {
      console.error('Audit logging failed:', auditError);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Delete document error:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}

// PATCH - Update document
export async function PATCH(request) {
  try {
    const adminData = verifyAdminRequest(request);
    if (!adminData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { id, title, description, category, isPublished } = await request.json();

    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category) updateData.category = category;
    if (isPublished !== undefined) updateData.isPublished = isPublished;

    const document = await Document.findByIdAndUpdate(id, updateData, { new: true });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Audit log
    try {
      const AuditLog = (await import('@/models/AuditLog')).default;
      await AuditLog.create({
        adminId: adminData.id || adminData._id,
        adminEmail: adminData.email,
        action: 'documents_edit',
        resourceType: 'document',
        resourceId: id,
        details: {
          documentId: id,
          title: document.title,
          category: document.category,
          changes: updateData,
        },
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || '',
      });
    } catch (auditError) {
      console.error('Audit logging failed:', auditError);
    }

    return NextResponse.json({ document }, { status: 200 });
  } catch (error) {
    console.error('Update document error:', error);
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
  }
}
