# 📧 Email Service Setup Guide for AIB-AXYS Contact Form

## Overview
The contact form is fully functional and will send emails once you configure your SMTP credentials.

## Quick Setup Options

### Option 1: Gmail (Recommended for Testing)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Copy the generated 16-character password

3. **Add to `.env` file**:
```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx  # Your 16-char app password
EMAIL_FROM=info@axysinvestmentbank.com
```

4. **Restart server**: `sudo supervisorctl restart nextjs`

---

### Option 2: Microsoft 365 / Outlook

1. **Add to `.env` file**:
```bash
EMAIL_HOST=smtp.office365.com
EMAIL_PORT=587
EMAIL_USER=info@axysinvestmentbank.com
EMAIL_PASS=your-password
EMAIL_FROM=info@axysinvestmentbank.com
```

2. **Restart server**: `sudo supervisorctl restart nextjs`

---

### Option 3: SendGrid (Production Recommended)

1. **Create SendGrid account**: https://sendgrid.com/
2. **Create API Key**:
   - Go to Settings → API Keys
   - Create API Key with "Mail Send" permissions
   - Copy the API key

3. **Add to `.env` file**:
```bash
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx  # Your API key
EMAIL_FROM=info@axysinvestmentbank.com
```

4. **Restart server**: `sudo supervisorctl restart nextjs`

---

## Email Routing Logic

The contact form automatically routes emails based on subject:

| Subject | Recipient Email |
|---------|----------------|
| Account Opening | info@axysinvestmentbank.com |
| KPC IPO Application | info@axysinvestmentbank.com |
| Apply for Leverage | info@axysinvestmentbank.com |
| General Inquiries | feedback@aib-axysafrica.com |

---

## Current Status

✅ **Email Service Integration**: Complete  
⚠️ **Configuration Required**: Add SMTP credentials to `.env`  
✅ **Fallback Behavior**: Logs to console if not configured  
✅ **Error Handling**: Graceful degradation implemented  

---

**Once configured, emails will be sent automatically!** 📧
