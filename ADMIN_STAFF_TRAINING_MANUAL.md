# AIB-AXYS Admin Staff Training Manual
## Document Management & Exchange Rate Updates

**Version:** 1.0  
**Date:** April 22, 2026  
**Target Audience:** Admin Staff, Operations Team  
**Training Duration:** 45 minutes

---

## 📋 TRAINING OVERVIEW

This manual provides comprehensive training for AIB-AXYS admin staff on two critical functions:
1. **Document Upload & Management**
2. **Exchange Rate Updates**

Both functions are essential for maintaining accurate, up-to-date information for clients and ensuring regulatory compliance.

---

## 🎯 LEARNING OBJECTIVES

By the end of this training, staff will be able to:
- ✅ Upload documents securely to the admin system
- ✅ Update exchange rates for USD, EUR, and GBP to KSH
- ✅ Manage document categories and metadata
- ✅ Set appropriate expiry times for rates
- ✅ Monitor upload/download statistics
- ✅ Troubleshoot common issues
- ✅ Follow security best practices

---

## 🔐 ADMIN ACCESS & SECURITY

### Login Process
1. Navigate to `/admin/login`
2. Enter your admin credentials
3. Complete two-factor authentication if enabled
4. Access granted to admin dashboard

### Security Best Practices
- **Never share credentials** with anyone
- **Log out** after each session
- **Use strong passwords** (12+ characters, mixed case, numbers, symbols)
- **Report suspicious activity** immediately
- **Enable screen lock** when stepping away

---

## 📄 DOCUMENT MANAGEMENT TRAINING

### Section 1: Understanding Document Categories

The system supports the following document categories:

| Category | Purpose | File Types | Access Level |
|----------|---------|------------|--------------|
| **Compliance Documents** | Regulatory compliance, policies | PDF, Word | Public |
| **Terms & Conditions** | Service agreements, legal terms | PDF, Word | Public |
| **Audited Financial Reports** | Annual/quarterly financial statements | PDF, Excel | Public |
| **Unaudited Financial Reports** | Monthly/weekly financial updates | PDF, Excel | Public |
| **Application Forms** | Account opening, service applications | PDF, Word | Public |
| **Press Releases** | Company news and announcements | PDF, Word | Public |
| **News** | General company news | PDF, Word | Public |
| **Fees & Tariffs** | Service pricing and fee structures | PDF, Excel | Public |
| **Other** | Miscellaneous documents | PDF, Word, Excel | Public |

### Section 2: Document Upload Process

#### Step-by-Step Upload Guide

**Step 1: Access Document Management**
```
Navigation: Admin Dashboard → Documents
URL: /admin/documents
```

**Step 2: Prepare Your Document**
- Ensure file is in supported format (PDF, Word, Excel)
- Check file size (maximum 50MB)
- Verify content accuracy and completeness
- Remove any sensitive information

**Step 3: Fill Upload Form**
```
Required Fields:
• Title: Descriptive document name
• Description: Brief summary (optional but recommended)
• Category: Select from dropdown list
• File: Choose file from computer
```

**Step 4: Upload and Verify**
- Click "Upload Document" button
- Wait for upload confirmation
- Verify document appears in the list below
- Check file details (size, upload date, download count)

#### Upload Form Interface
```
┌─────────────────────────────────────────────────────────────┐
│                  Upload New Document                        │
├─────────────────────────────────────────────────────────────┤
│ Title: [Document Title Here]                                │
│ Category: [▼ Compliance Documents]                          │
│ Description: [Brief description of document contents]       │
│ File: [Choose File...] (PDF, Word, Excel - Max 50MB)        │
│                                                             │
│ [Upload Document]                                           │
└─────────────────────────────────────────────────────────────┘
```

### Section 3: Document Management

#### Viewing Uploaded Documents
The document list displays:
- **Title:** Document name
- **Category:** Classification type
- **File Name:** Original filename
- **Downloads:** Number of times downloaded
- **Published Date:** Upload timestamp
- **Actions:** Download and Delete buttons

#### Editing Documents
```
Current Limitation: Documents cannot be edited after upload
Workaround: Delete old version and upload new one
```

#### Deleting Documents
```
Process:
1. Click trash icon (🗑️) next to document
2. Confirm deletion in popup dialog
3. Document permanently removed
4. Download count history preserved
```

### Section 4: Best Practices for Document Management

#### File Naming Conventions
```
Format: [Category]_[Date]_[Description]
Example: Compliance_2026-04-22_Privacy_Policy.pdf
```

#### Content Quality Checklist
- [ ] Document is current and accurate
- [ ] No sensitive information included
- [ ] File size optimized for web delivery
- [ ] Content approved by compliance officer
- [ ] Version number included if applicable

#### Upload Frequency Guidelines
- **Compliance Documents:** Update quarterly or as regulations change
- **Financial Reports:** Upload immediately after completion
- **Application Forms:** Update when processes change
- **Press Releases:** Upload same day as public release

---

## 💱 EXCHANGE RATE MANAGEMENT TRAINING

### Section 1: Understanding Exchange Rates

#### Rate Types
The system manages two types of rates for each currency:

**Buy Rate (We Buy From Customer):**
- Rate at which we purchase foreign currency from customers
- Should be lower than sell rate (we make profit on spread)
- Used when customers want to sell USD/EUR/GBP

**Sell Rate (We Sell To Customer):**
- Rate at which we sell foreign currency to customers
- Should be higher than buy rate
- Used when customers want to buy USD/EUR/GBP

#### Supported Currencies
- **USD (US Dollar)** to KSH (Kenyan Shilling)
- **EUR (Euro)** to KSH
- **GBP (British Pound)** to KSH

### Section 2: Rate Update Process

#### Step-by-Step Rate Update Guide

**Step 1: Access Exchange Rate Management**
```
Navigation: Admin Dashboard → Exchange Rates
URL: /admin/exchange-rates
```

**Step 2: Review Current Rates**
- Check existing rates for all currencies
- Note expiry dates and status
- Identify which rates need updating

**Step 3: Update Buy Rate**
```
For each currency (USD, EUR, GBP):
• Buy Rate: Enter rate (e.g., 165.00)
• Buy Expiry: Set date/time when rate expires
• Typically 24-48 hours from update time
```

**Step 4: Update Sell Rate**
```
For each currency:
• Sell Rate: Enter rate (e.g., 166.50)
• Sell Expiry: Set date/time when rate expires
• Should match or be close to buy rate expiry
```

**Step 5: Configure Visibility**
```
Options:
• Show on Public Page: Enable to display to customers
• Mark as "Coming Soon": For future currency launches
```

**Step 6: Save Changes**
- Click "Update [Currency] Rate" button
- Wait for confirmation message
- Verify rates appear correctly

#### Rate Update Interface
```
┌─────────────────────────────────────────────────────────────┐
│                    USD to KSH                               │
│ Current Rate: 165.25 KSH                                   │
├─────────────────────────────────────────────────────────────┤
│ BUY RATE (We buy from you)                                  │
│ Rate: [165.00]    Expiry: [2026-04-23 09:00]                │
│                                                            │
│ SELL RATE (We sell to you)                                  │
│ Rate: [166.50]    Expiry: [2026-04-23 09:00]                │
│                                                            │
│ [✓] Show on Public Page    [ ] Mark as "Coming Soon"        │
│                                                            │
│ [Update USD Rate]                                           │
└─────────────────────────────────────────────────────────────┘
```

### Section 3: Rate Management Best Practices

#### Rate Setting Guidelines
```
Buy Rate < Sell Rate (Always maintain profit margin)
Typical Spread: 1.0 - 2.0 KSH depending on market conditions
Expiry Time: 24 hours for forex rates
Update Frequency: Daily during market hours
```

#### Market Hours Consideration
- **East Africa Time (EAT):** 9:00 AM - 5:00 PM
- **London Time:** 8:00 AM - 4:00 PM
- **New York Time:** 1:00 PM - 9:00 PM
- Update rates during overlapping market hours for best rates

#### Rate Source Verification
- Use reputable financial data providers
- Cross-reference with multiple sources
- Consider market volatility and news events
- Document rate source for audit purposes

### Section 4: Expiry Management

#### Expiry Best Practices
```
✅ Set realistic expiry times (24-48 hours)
✅ Update before expiry to avoid gaps
✅ Monitor expired rates (highlighted in red)
✅ Public converter uses these expiry times
```

#### Handling Expired Rates
```
System Behavior:
• Expired rates highlighted in red on public page
• Customers notified of expired rates
• Admin dashboard shows expiry warnings
• No automatic rate updates (manual process required)
```

---

## 🛠️ TROUBLESHOOTING GUIDE

### Document Upload Issues

#### Problem: File Too Large
```
Solution: Compress PDF or split into smaller files
Maximum: 50MB per file
```

#### Problem: Unsupported File Type
```
Supported: .pdf, .doc, .docx, .xls, .xlsx
Solution: Convert file to supported format
```

#### Problem: Upload Fails
```
Check:
• Internet connection
• File not corrupted
• Server not overloaded
• Try again in 5 minutes
```

### Exchange Rate Issues

#### Problem: Rate Not Updating
```
Check:
• All required fields filled
• Expiry date in future
• Valid number format
• Server connection
```

#### Problem: Rate Not Showing Publicly
```
Check:
• "Show on Public Page" enabled
• Rate not expired
• Page refreshed
• Cache cleared
```

---

## 📊 MONITORING & REPORTING

### Document Analytics
- **Download Counts:** Track document popularity
- **Upload History:** Maintain audit trail
- **Category Usage:** Identify most requested documents
- **File Sizes:** Monitor storage usage

### Rate Performance
- **Update Frequency:** Track how often rates change
- **Expiry Compliance:** Monitor on-time updates
- **Customer Usage:** Track converter usage patterns
- **Error Reports:** Log any rate-related issues

---

## 📞 SUPPORT & ESCALATION

### Internal Support
- **Technical Issues:** Contact IT support team
- **Process Questions:** Contact operations manager
- **Rate Sources:** Contact finance department
- **Document Approval:** Contact compliance officer

### Emergency Procedures
- **System Down:** Call IT emergency line
- **Rate Errors:** Contact finance manager immediately
- **Security Issues:** Report to security team
- **Data Loss:** Follow data recovery procedures

---

## 📋 TRAINING CHECKLIST

### Document Management
- [ ] Access admin documents page
- [ ] Upload a test document
- [ ] Verify document appears in list
- [ ] Download document to verify
- [ ] Delete test document
- [ ] Understand all categories

### Exchange Rate Management
- [ ] Access exchange rates page
- [ ] Update a test rate (use dummy data)
- [ ] Verify rate saves correctly
- [ ] Check public display
- [ ] Set appropriate expiry time
- [ ] Understand buy vs sell rates

### Security & Best Practices
- [ ] Demonstrate secure login/logout
- [ ] Explain password requirements
- [ ] Show reporting procedures
- [ ] Review emergency contacts

---

## 🎓 TRAINING COMPLETION

### Certification Requirements
- [ ] Complete all hands-on exercises
- [ ] Pass knowledge assessment (80% minimum)
- [ ] Demonstrate proper procedures
- [ ] Sign training acknowledgment form

### Ongoing Training
- **Monthly Refreshers:** Key procedure updates
- **Quarterly Audits:** Process compliance checks
- **Annual Recertification:** Complete retraining
- **System Updates:** New feature training

---

## 📞 CONTACT INFORMATION

**Training Coordinator:** [Name]  
**Email:** training@aib-axys.africa  
**Phone:** +254 XXX XXX XXX  

**Technical Support:** IT Helpdesk  
**Email:** support@aib-axys.africa  
**Phone:** +254 XXX XXX XXX  

**Operations Manager:** [Name]  
**Email:** operations@aib-axys.africa  
**Phone:** +254 XXX XXX XXX  

---

**Training Manual Version:** 1.0  
**Last Updated:** April 22, 2026  
**Next Review:** October 22, 2026</content>
<parameter name="filePath">c:\Users\Dantez\Downloads\AIB-AXYS\ADMIN_STAFF_TRAINING_MANUAL.md