// File: app/api/admin/global-funds/route.js
// Force dynamic rendering for admin routes
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import GlobalFund from '@/models/GlobalFund';
import { verifyAdminRequest } from '@/lib/auth';
import { sanitizeInput } from '@/lib/security';

// GET - Fetch all global funds (admin view)
export async function GET(request) {
  try {
    const adminData = verifyAdminRequest(request);
    if (!adminData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const funds = await GlobalFund.find()
      .sort({ displayOrder: 1, createdAt: -1 })
      .limit(200);

    return NextResponse.json({ funds }, { status: 200 });
  } catch (error) {
    console.error('Get global funds error:', error);
    return NextResponse.json({ error: 'Failed to fetch global funds' }, { status: 500 });
  }
}

// POST - Create new global fund
export async function POST(request) {
  try {
    const adminData = verifyAdminRequest(request);
    if (!adminData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    let { fundName, shortName, description, performanceBoxes, minInvestment, maxInvestment, documents, isVisible, displayOrder } = body;

    // Sanitize inputs
    fundName = sanitizeInput(fundName);
    shortName = shortName != null ? sanitizeInput(String(shortName)) : '';
    description = sanitizeInput(description);

    // Validate required fields
    if (!fundName || !description) {
      return NextResponse.json(
        { error: 'Fund name and description are required' },
        { status: 400 }
      );
    }

    // Sanitize performanceBoxes array if provided
    if (performanceBoxes && Array.isArray(performanceBoxes)) {
      performanceBoxes = performanceBoxes.map(box => ({
        label: sanitizeInput(box.label || ''),
        value: sanitizeInput(box.value || ''),
      }));
    }

    // Sanitize documents array if provided
    if (documents && Array.isArray(documents)) {
      documents = documents.map(doc => ({
        name: sanitizeInput(doc.name || ''),
        url: sanitizeInput(doc.url || ''),
        uploadedAt: doc.uploadedAt || new Date(),
      }));
    }

    // Create the fund
    const fund = await GlobalFund.create({
      fundName,
      shortName: shortName || '',
      description,
      performanceBoxes: performanceBoxes || [],
      minInvestment: minInvestment ? parseFloat(minInvestment) : null,
      maxInvestment: maxInvestment ? parseFloat(maxInvestment) : null,
      documents: documents || [],
      isVisible: isVisible !== undefined ? isVisible : true,
      displayOrder: displayOrder || 0,
      createdBy: adminData.email,
      lastModifiedBy: adminData.email,
    });

    // Audit log
    try {
      const AuditLog = (await import('@/models/AuditLog')).default;
      await AuditLog.create({
        adminId: adminData.id || adminData._id,
        adminEmail: adminData.email,
        action: 'global_funds_create',
        resourceType: 'global_fund',
        resourceId: fund._id.toString(),
        details: {
          fundId: fund._id,
          fundName,
          isVisible,
        },
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || '',
      });
    } catch (auditError) {
      console.error('Audit logging failed:', auditError);
    }

    console.log('✅ Global fund created:', fund._id);

    return NextResponse.json({ fund }, { status: 201 });
  } catch (error) {
    console.error('Create global fund error:', error);
    return NextResponse.json({ error: 'Failed to create global fund' }, { status: 500 });
  }
}

// PATCH - Update global fund
export async function PATCH(request) {
  try {
    const adminData = verifyAdminRequest(request);
    if (!adminData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { id, _id, fundName, shortName, description, performanceBoxes, documents, isVisible, displayOrder } = body;

    const fundId = id || _id;

    if (!fundId) {
      return NextResponse.json({ error: 'Fund ID is required' }, { status: 400 });
    }

    // Build update object
    const updateData = {
      lastModifiedBy: adminData.email,
    };

    if (fundName) updateData.fundName = sanitizeInput(fundName);
    if (shortName !== undefined) updateData.shortName = sanitizeInput(String(shortName));
    if (description) updateData.description = sanitizeInput(description);
    if (performanceBoxes !== undefined) {
      updateData.performanceBoxes = Array.isArray(performanceBoxes) ? performanceBoxes.map(box => ({
        label: sanitizeInput(box.label || ''),
        value: sanitizeInput(box.value || ''),
      })) : [];
    }
    if (documents !== undefined) {
      updateData.documents = Array.isArray(documents) ? documents.map(doc => ({
        name: sanitizeInput(doc.name || ''),
        url: sanitizeInput(doc.url || ''),
        uploadedAt: doc.uploadedAt || new Date(),
      })) : [];
    }
    if (isVisible !== undefined) updateData.isVisible = isVisible;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;

    const fund = await GlobalFund.findByIdAndUpdate(fundId, updateData, { new: true });

    if (!fund) {
      return NextResponse.json({ error: 'Fund not found' }, { status: 404 });
    }

    // Audit log
    try {
      const AuditLog = (await import('@/models/AuditLog')).default;
      await AuditLog.create({
        adminId: adminData.id || adminData._id,
        adminEmail: adminData.email,
        action: 'global_funds_update',
        resourceType: 'global_fund',
        resourceId: fundId,
        details: {
          fundId: fundId,
          fundName: fund.fundName,
          updates: Object.keys(updateData),
        },
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || '',
      });
    } catch (auditError) {
      console.error('Audit logging failed:', auditError);
    }

    console.log('✅ Global fund updated:', id);

    return NextResponse.json({ fund }, { status: 200 });
  } catch (error) {
    console.error('Update global fund error:', error);
    return NextResponse.json({ error: 'Failed to update global fund' }, { status: 500 });
  }
}

// DELETE - Delete global fund
export async function DELETE(request) {
  try {
    const adminData = verifyAdminRequest(request);
    if (!adminData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Fund ID is required' }, { status: 400 });
    }

    const fund = await GlobalFund.findById(id);
    if (!fund) {
      return NextResponse.json({ error: 'Fund not found' }, { status: 404 });
    }

    await GlobalFund.findByIdAndDelete(id);

    // Audit log
    try {
      const AuditLog = (await import('@/models/AuditLog')).default;
      await AuditLog.create({
        adminId: adminData.id || adminData._id,
        adminEmail: adminData.email,
        action: 'global_funds_delete',
        resourceType: 'global_fund',
        resourceId: id,
        details: {
          fundId: id,
          fundName: fund.fundName,
        },
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || '',
      });
    } catch (auditError) {
      console.error('Audit logging failed:', auditError);
    }

    console.log('✅ Global fund deleted:', id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Delete global fund error:', error);
    return NextResponse.json({ error: 'Failed to delete global fund' }, { status: 500 });
  }
}