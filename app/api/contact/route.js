// File: app/api/contact/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';
import Consent from '@/models/Consent';
import EmailSettings from '@/models/EmailSettings';
import { sendEmail } from '@/lib/email';
import { createZohoDeskTicket } from '@/lib/zoho';
import { rateLimit, sanitizeInput, isValidEmail, isValidPhone, escapeHtml } from '@/lib/security';
import { getIpAddress, getUserAgent } from '@/lib/audit';

export async function POST(request) {
  try {
    // Get IP for rate limiting
    const ipAddress = getIpAddress(request);

    // Rate limit: 5 submissions per minute per IP
    const rateCheck = rateLimit(ipAddress, 5, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    await connectDB();

    const body = await request.json();
    let { name, email, phone, subject, message, hasCDSC, cdscNumber, referralSource } = body;

    // Sanitize inputs
    name = sanitizeInput(name);
    email = sanitizeInput(email);
    phone = sanitizeInput(phone);
    message = sanitizeInput(message);
    cdscNumber = sanitizeInput(cdscNumber);
    referralSource = sanitizeInput(referralSource);

    // Validate required fields
    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate phone format
    if (!isValidPhone(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone format' },
        { status: 400 }
      );
    }

    // Validate subject enum
    const validSubjects = [
      'account-opening',
      'ipo',
      'dangote-ipo',
      'funding-issues',
      'password-reset',
      'dormant-account',
      'general',
      'offshore',
    ];
    if (!validSubjects.includes(subject)) {
      return NextResponse.json(
        { error: 'Invalid subject. Please select a valid option.' },
        { status: 400 }
      );
    }

    // Save to database
    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
      hasCDSC: hasCDSC || '',
      cdscNumber: cdscNumber || '',
      referralSource: referralSource || '',
      status: 'new',
      emailSent: false,
    });

    // Record consent for data processing
    await Consent.create({
      contactId: contact._id,
      email,
      consentType: 'data_processing',
      consentGiven: true,
      ipAddress,
    });

    console.log('✅ Contact saved to database:', contact._id);

    // Determine recipient email based on subject
    const defaultEmail = process.env.CONTACT_EMAIL_DEFAULT || 'info@axysinvestmentbank.com';
    const generalEmail = process.env.CONTACT_EMAIL_GENERAL || 'feedback@aib-axysafrica.com';

    let recipientEmail = defaultEmail;
    if (subject === 'general') {
      recipientEmail = generalEmail;
    }

    // Get subject label
    const subjectLabels = {
      'account-opening': 'Account Opening',
      'ipo': 'Quickmart IPO Application',
      'dangote-ipo': 'Dangote Petroleum Refinery IPO Application',
      'funding-issues': 'Funding issues',
      'password-reset': 'Password reset or Forgot password',
      'dormant-account': 'Dormant account activation',
      'general': 'General Inquiries',
      'offshore': 'Offshore Services',
    };
    const subjectLabel = subjectLabels[subject] || subject;

    // Create the support ticket independently of email delivery. A Zoho outage must not
    // prevent a visitor's message from being saved and acknowledged.
    let zohoResult = { success: false, configured: false };
    try {
      zohoResult = await createZohoDeskTicket({
        id: contact._id.toString(),
        name,
        email,
        phone,
        subjectLabel,
        message,
        referralSource,
        cdscNumber,
      });
      if (zohoResult.success) {
        console.log('Zoho Desk ticket created:', zohoResult.ticketNumber || zohoResult.id);
      }
    } catch (zohoError) {
      console.error('Zoho Desk sync failed:', zohoError.message);
    }

    // Build email content
    let emailText = `
New Contact Form Submission from AXYS Investment Bank Website
${'='.repeat(50)}

From: ${name}
Email: ${email}
Phone: ${phone}
Subject: ${subjectLabel}

Message:
${message}
`;

    // Add referral source if provided
    if (referralSource) {
      emailText += `
${'='.repeat(50)}`;
      emailText += `\nReferral Source: ${referralSource}`;
    }

    // Add CDSC information if applicable (IPO, dormant-account, or general)
    if (subject === 'ipo' || subject === 'dangote-ipo' || subject === 'dormant-account' || subject === 'general') {
      const cdscLabel = subject === 'general' ? 'CDSC / ID Number' : 'CDSC Account';
      emailText += `\n${'='.repeat(50)}`;
      emailText += `\n${cdscLabel}: ${hasCDSC === 'yes' ? 'Yes' : 'No'}`;
      if (hasCDSC === 'yes' && cdscNumber) {
        emailText += `\n${subject === 'general' ? 'CDSC / ID Number' : 'CDSC Number'}: ${cdscNumber}`;
      } else if (hasCDSC === 'no' && subject !== 'general') {
        emailText += `\nNote: Client needs to create CDSC account first`;
      }
    }

    emailText += `\n\n${'='.repeat(50)}`;
    emailText += `\nSubmission ID: ${contact._id}`;
    emailText += `\nSubmitted: ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi' })} EAT`;

    // HTML version for better formatting
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0017bf; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; margin: 20px 0; }
          .field { margin: 10px 0; }
          .label { font-weight: bold; color: #0017bf; }
          .value { margin-left: 10px; }
          .message-box { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #0017bf; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          .id { background: #e3f2fd; padding: 10px; border-radius: 4px; font-family: monospace; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Contact Form Submission</h2>
            <p>AXYS Investment Bank Website</p>
          </div>
          
          <div class="content">
            <div class="field">
              <span class="label">From:</span>
              <span class="value">${name}</span>
            </div>
            <div class="field">
              <span class="label">Email:</span>
              <span class="value"><a href="mailto:${email}">${email}</a></span>
            </div>
            <div class="field">
              <span class="label">Phone:</span>
              <span class="value"><a href="tel:${phone}">${phone}</a></span>
            </div>
            <div class="field">
              <span class="label">Subject:</span>
              <span class="value">${subjectLabel}</span>
            </div>
            
            ${referralSource ? `
              <div class="field">
                <span class="label">How they heard about us:</span>
                <span class="value">${escapeHtml(referralSource)}</span>
              </div>
            ` : ''}
            
            ${(subject === 'ipo' || subject === 'dangote-ipo' || subject === 'dormant-account' || subject === 'general') ? `
              <div class="field">
                <span class="label">${subject === 'general' ? 'Has CDSC / ID:' : 'Has CDSC Account:'}</span>
                <span class="value">${hasCDSC === 'yes' ? 'Yes' : 'No'}</span>
              </div>
              ${hasCDSC === 'yes' && cdscNumber ? `
                <div class="field">
                  <span class="label">${subject === 'general' ? 'CDSC / ID Number:' : 'CDSC Number:'}</span>
                  <span class="value"><strong>${cdscNumber}</strong></span>
                </div>
              ` : ''}
              ${hasCDSC === 'no' && subject !== 'general' ? `
                <div class="field" style="color: #ff9800;">
                  <span class="label">Note:</span>
                  <span class="value">Client needs to create CDSC account first</span>
                </div>
              ` : ''}
            ` : ''}
            
            <div class="message-box">
              <div class="label">Message:</div>
              <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
            </div>
            
            <div class="id">
              <strong>Submission ID:</strong> ${contact._id}
            </div>
          </div>
          
          <div class="footer">
            <p>Submitted on ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi' })} EAT</p>
            <p>View in admin dashboard: <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/contacts">Admin Panel</a></p>
            <p>AXYS Investment Bank | www.aib-axysafrica.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Zoho Desk receives this submission through its API above. Do not also send
    // the notification email to a Desk mailbox, or it creates a duplicate ticket.
    if (process.env.CONTACT_EMAIL_NOTIFICATIONS !== 'true') {
      return NextResponse.json(
        {
          success: true,
          message: 'Message sent successfully',
          recipient: recipientEmail,
          emailConfigured: false,
          zohoSynced: zohoResult.success,
        },
        { status: 200 }
      );
    }

    // Send email
    try {
      const emailResult = await sendEmail({
        to: recipientEmail,
        subject: `New ${subjectLabel} Inquiry - ${name}`,
        text: emailText,
        html: emailHtml,
      });

      if (!emailResult.success) {
        // Email service not configured, but we'll still return success
        console.log('⚠️  Email service not configured. Message logged.');
        console.log('To:', recipientEmail);
        console.log('Content:', emailText);
      }

      return NextResponse.json(
        {
          success: true,
          message: 'Message sent successfully',
          recipient: recipientEmail,
          emailConfigured: emailResult.success,
          zohoSynced: zohoResult.success,
        },
        { status: 200 }
      );
    } catch (emailError) {
      console.error('Email sending failed:', emailError);

      // Still return success to user, but log the error
      return NextResponse.json(
        {
          success: true,
          message: 'Message received. Our team will contact you soon.',
          note: 'Email delivery issue - message logged for manual follow-up',
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
