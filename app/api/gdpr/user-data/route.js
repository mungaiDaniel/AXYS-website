import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';
import Consent from '@/models/Consent';
import { verifyEmailVerificationToken, createEmailVerificationToken } from '@/lib/auth';
import { rateLimit } from '@/lib/security';
import { sendEmail } from '@/lib/email';

// Force dynamic rendering for admin routes
export const dynamic = 'force-dynamic';

// POST - Request GDPR data access (sends verification email)
export async function POST(request) {
  try {
    const { email, requestType } = await request.json();
    
    // Get IP for rate limiting
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    
    // Rate limit: 3 requests per hour per IP
    const rateCheck = rateLimit(`gdpr-request-${ipAddress}`, 3, 3600000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many GDPR requests. Please try again later.' },
        { status: 429 }
      );
    }

    if (!email || !requestType) {
      return NextResponse.json({ error: 'Email and request type required' }, { status: 400 });
    }

    if (!['access', 'delete'].includes(requestType)) {
      return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
    }

    await connectDB();

    // Generate verification token
    const purpose = requestType === 'access' ? 'gdpr_access' : 'gdpr_delete';
    const token = await createEmailVerificationToken(email, purpose, 60); // 60 min expiry

    // Send verification email
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const verificationLink = `${baseUrl}/gdpr/verify?token=${token}&email=${encodeURIComponent(email)}&type=${requestType}`;

    const emailSubject = requestType === 'access' 
      ? 'AXYS Investment Bank - GDPR Data Access Request Verification'
      : 'AXYS Investment Bank - GDPR Data Deletion Request Verification';

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 30px; border-radius: 8px;">
          <h2 style="color: #0016bc;">GDPR ${requestType === 'access' ? 'Data Access' : 'Data Deletion'} Request</h2>
          
          <p>We received a request to ${requestType === 'access' ? 'access your personal data' : 'delete your personal data'}.</p>
          
          <p>To verify this request is from you, please click the link below:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" 
               style="background: #0016bc; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify ${requestType === 'access' ? 'Data Access' : 'Data Deletion'} Request
            </a>
          </div>
          
          <p style="color: #666; font-size: 12px;">
            This link will expire in 60 minutes.<br>
            If you did not make this request, please ignore this email.<br><br>
            Request from IP: ${ipAddress}
          </p>
          
          <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
          
          <p style="font-size: 12px; color: #999;">
            AXYS Investment Bank<br>
            5th floor, The Promenade, General Mathenge Road, Nairobi, Kenya<br>
            Phone: +254 711 047000
          </p>
        </div>
      </body>
      </html>
    `;

    // Send verification email
    await sendEmail({
      to: email,
      subject: emailSubject,
      html: emailHtml,
      text: `Please verify your GDPR ${requestType} request by clicking this link: ${verificationLink}\n\nThis link expires in 60 minutes.`,
    });

    return NextResponse.json(
      {
        success: true,
        message: `Verification email sent to ${email}. Please check your inbox and click the link to complete your request.`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GDPR request error:', error);
    return NextResponse.json({ error: 'Failed to process GDPR request' }, { status: 500 });
  }
}

// Export user data (GDPR) - NOW REQUIRES VERIFICATION TOKEN
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    if (!email || !token) {
      return NextResponse.json(
        { error: 'Email and verification token required. Please request access via POST endpoint first.' },
        { status: 400 }
      );
    }

    // Verify the token
    const verifiedEmail = await verifyEmailVerificationToken(token, 'gdpr_access');
    
    if (!verifiedEmail || verifiedEmail !== email.toLowerCase()) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token. Please request a new link.' },
        { status: 403 }
      );
    }

    await connectDB();

    // Collect all user data
    const contacts = await Contact.find({ email: email.toLowerCase() }).select('-__v');
    const consents = await Consent.find({ email: email.toLowerCase() }).select('-__v');

    // Audit log the access
    try {
      const AuditLog = (await import('@/models/AuditLog')).default;
      await AuditLog.create({
        adminEmail: null,
        action: 'GDPR_DATA_ACCESS',
        details: {
          email,
          contactsReturned: contacts.length,
          consentsReturned: consents.length,
        },
        ipAddress: request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 'unknown',
        timestamp: new Date(),
      });
    } catch (auditError) {
      console.error('Audit logging failed:', auditError);
    }

    const userData = {
      email,
      exportDate: new Date().toISOString(),
      dataType: 'Personal Data Export (GDPR Article 15)',
      contactSubmissions: contacts,
      consentRecords: consents,
      note: 'This is all personal data we have stored for this email address.',
    };

    return NextResponse.json(userData, {
      status: 200,
      headers: {
        'Content-Disposition': `attachment; filename="user-data-${email}-${Date.now()}.json"`,
      },
    });
  } catch (error) {
    console.error('GDPR export error:', error);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}

// Delete user data (Right to be Forgotten - GDPR) - REQUIRES VERIFICATION TOKEN
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    if (!email || !token) {
      return NextResponse.json(
        { error: 'Email and verification token required. Please request deletion via POST endpoint first.' },
        { status: 400 }
      );
    }

    // Verify the token
    const verifiedEmail = await verifyEmailVerificationToken(token, 'gdpr_delete');
    
    if (!verifiedEmail || verifiedEmail !== email.toLowerCase()) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token. Please request a new link.' },
        { status: 403 }
      );
    }

    await connectDB();

    // Anonymize or delete all user data
    const contactsDeleted = await Contact.deleteMany({ email: email.toLowerCase() });
    const consentsDeleted = await Consent.deleteMany({ email: email.toLowerCase() });

    // Audit log the deletion
    try {
      const AuditLog = (await import('@/models/AuditLog')).default;
      await AuditLog.create({
        adminEmail: null,
        action: 'GDPR_DATA_DELETION',
        details: {
          email,
          contactsDeleted: contactsDeleted.deletedCount,
          consentsDeleted: consentsDeleted.deletedCount,
          verificationToken: token.substring(0, 8) + '...',
        },
        ipAddress: request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 'unknown',
        timestamp: new Date(),
      });
    } catch (auditError) {
      console.error('Audit logging failed:', auditError);
    }

    console.log(`🗑️ GDPR deletion for ${email}: ${contactsDeleted.deletedCount} contacts, ${consentsDeleted.deletedCount} consents`);

    return NextResponse.json(
      {
        success: true,
        message: 'User data deleted successfully',
        deleted: {
          contacts: contactsDeleted.deletedCount,
          consents: consentsDeleted.deletedCount,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GDPR deletion error:', error);
    return NextResponse.json({ error: 'Deletion failed' }, { status: 500 });
  }
}
