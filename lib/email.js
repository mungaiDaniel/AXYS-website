import nodemailer from 'nodemailer';

/**
 * Email Service Configuration
 * 
 * Setup Instructions:
 * 1. Add your email credentials to .env file:
 *    EMAIL_HOST=smtp.gmail.com (or your SMTP server)
 *    EMAIL_PORT=587
 *    EMAIL_USER=your-email@gmail.com
 *    EMAIL_PASS=your-app-password
 *    EMAIL_FROM=info@axysinvestmentbank.com
 * 
 * 2. For Gmail users:
 *    - Enable 2-Factor Authentication
 *    - Generate an App Password: https://myaccount.google.com/apppasswords
 *    - Use the App Password (not your regular password)
 * 
 * 3. For other SMTP providers (SendGrid, AWS SES, etc.):
 *    - Update the host, port, and credentials accordingly
 */

// Create reusable transporter
let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  // Check if email credentials are configured
  const emailConfigured = process.env.EMAIL_HOST && 
                         process.env.EMAIL_USER && 
                         process.env.EMAIL_PASS;

  if (!emailConfigured) {
    console.warn('⚠️  Email not configured. Set EMAIL_HOST, EMAIL_USER, and EMAIL_PASS in .env');
    return null;
  }

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporter;
}

/**
 * Send email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content (optional)
 * @returns {Promise} - Resolves with info or rejects with error
 */
export async function sendEmail({ to, subject, text, html }) {
  const transporter = getTransporter();
  
  if (!transporter) {
    // Email not configured, just log
    console.log('📧 Email would be sent to:', to);
    console.log('Subject:', subject);
    console.log('Content:', text);
    return { success: false, message: 'Email service not configured' };
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      text,
      html: html || text.replace(/\n/g, '<br>'),
    });

    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email error:', error);
    throw error;
  }
}

/**
 * Verify email configuration
 */
export async function verifyEmailConfig() {
  const transporter = getTransporter();
  
  if (!transporter) {
    return { verified: false, message: 'Email not configured' };
  }

  try {
    await transporter.verify();
    console.log('✅ Email server connection verified');
    return { verified: true, message: 'Email server ready' };
  } catch (error) {
    console.error('❌ Email verification failed:', error.message);
    return { verified: false, message: error.message };
  }
}
