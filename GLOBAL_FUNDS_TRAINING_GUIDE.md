# Global Funds Management Training Guide

**Created:** March 11, 2026  
**Audience:** Junior Admins & Content Managers  
**Difficulty Level:** Beginner to Intermediate  

---

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Adding a New Global Fund (Step-by-Step)](#adding-a-new-global-fund-step-by-step)
4. [Field Reference Guide](#field-reference-guide)
5. [Best Practices](#best-practices)
6. [Managing Existing Funds](#managing-existing-funds)
7. [Troubleshooting](#troubleshooting)
8. [Common Scenarios](#common-scenarios)

---

## Overview

The **Global Funds** system allows administrators to create, manage, and publish investment funds to the AIB-AXYS platform. Clients can view these funds on the public website and initiate investments through the bank deposit system.

### Key Capabilities

- ✅ Create multiple funds with different investment profiles
- ✅ Track performance metrics for each fund
- ✅ Attach documents (factsheets, annual reports, etc.)
- ✅ Control visibility (publish/unpublish without deletion)
- ✅ Manage display order on the website
- ✅ Full audit trail for compliance

---

## Getting Started

### Access the Global Funds Admin Panel

1. Log in to the **AIB-AXYS Admin Dashboard**
2. Navigate to **Global Funds** from the left sidebar menu
3. You should see:
   - A list of existing global funds (if any)
   - A blue **"+ Add New Fund"** button in the top-right corner
   - Edit/Delete options for each fund

### System Access Requirements

- You must have **Admin** credentials
- Access is controlled by JWT authentication
- All actions are logged for audit purposes

---

## Adding a New Global Fund (Step-by-Step)

### Step 1: Open the Add New Fund Modal

Click the **"+ Add New Fund"** button in the top-right corner of the Global Funds page.

A modal dialog will appear with the following sections:
- Fund Information
- Display Order
- Performance Metrics
- Documents
- Visibility Settings

### Step 2: Fill in Fund Information

#### **Fund Name** (Required)
- Enter the full, formal name of the fund
- Examples: "African Growth Fund", "Tech Innovation Portfolio", "Emerging Markets Fund"
- Max length: No hard limit, but keep it under 100 characters for UI display
- This name appears:
  - In the admin panel
  - On the public website
  - In client communications

#### **Short Name** (Optional)
- Enter an abbreviated version or ticker code
- Examples: "AGF", "TIP", "EMF"
- Use 3-5 characters typically
- Useful for:
  - Reports and documents
  - Quick identification in dashboards
  - API references

#### **Description** (Required)
- Provide a clear, compelling description of the fund
- Should include:
  - Investment focus/strategy
  - Target client profile
  - Geographic or sector emphasis
  - Risk level (if applicable)
- Example:
  ```
  "A dynamic portfolio focusing on high-growth technology companies 
  across emerging African markets. Suitable for growth-oriented investors 
  with a 5+ year investment horizon. Medium-to-high risk profile."
  ```
- This description appears on the public website, so make it professional and informative

### Step 3: Set Display Order

The **Display Order** field controls where this fund appears in lists:
- This is a numeric field (example: 1, 2, 3, etc.)
- Funds are sorted by this number (lowest to highest)
- If you want a fund to appear first: use **1**
- If you want it to appear second: use **2**
- You can use any numbers; they don't need to be sequential

**Best Practice:** Leave gaps in numbering (e.g., 10, 20, 30) so you can easily insert funds later without renumbering everything.

### Step 4: Add Performance Metrics

Performance Metrics show fund statistics to potential investors.

**To add a metric:**
1. Click the **"+ Add Metric"** link
2. Enter a **Label** (e.g., "YTD Return", "5-Year Average", "Fund Size")
3. Enter a **Value** (e.g., "12.5%", "8.3% p.a.", "$500M")
4. Click Save

**Repeat for each metric you want to display.**

**Common Performance Metrics:**
- YTD Return (Year-to-Date)
- 1-Year Return
- 3-Year Return
- 5-Year Return
- Fund Size / Assets Under Management
- Inception Date
- Expense Ratio

**Note:** You can add as many metrics as needed. They'll all display on the fund detail page. Keep it between 4-8 metrics for best readability.

### Step 5: Upload or Link Documents

Documents provide additional information to clients (factsheets, annual reports, prospectuses, etc.).

**To add a document:**
1. Click **"Upload File"** OR **"Add URL"**
2. **If uploading:** Select a PDF or document from your computer
3. **If adding URL:** Paste a web link to an external document
4. Document name will auto-populate based on filename or URL
5. Click Save

**Recommended Documents:**
- Fund Factsheet (1-2 pages)
- Latest Annual Report
- Prospectus (if applicable)
- Performance Brochure
- Risk Disclosure Document

### Step 6: Set Visibility

#### **"Visible on public website" (Checkbox)**

- ✅ **Checked** (default): Fund appears on the public website and clients can see it
- ❌ **Unchecked**: Fund is hidden from the public website (useful for draft funds or funds under maintenance)

**Important:** This setting allows you to:
- Create a fund in draft mode without publishing it
- Temporarily hide a fund without deleting it
- Publish a fund when it's ready for client access

### Step 7: Save the Fund

Click the **"Save Fund"** button at the bottom of the modal.

**The system will:**
1. Validate all required fields (Fund Name, Description)
2. Perform input sanitization (security check)
3. Store the fund in the database
4. Create an audit log entry
5. Display a success message

**You'll then see:**
- The new fund appears in the dashboard list
- The modal automatically closes
- The fund is ready for client viewing (if visible)

---

## Field Reference Guide

| Field | Type | Required? | Max Length | Notes |
|-------|------|-----------|-----------|-------|
| **Fund Name** | Text | ✅ Yes | ~100 chars | Display name for the fund |
| **Short Name** | Text | ❌ No | ~10 chars | Ticker code or abbreviation |
| **Description** | Text (Long) | ✅ Yes | ~500 chars | Detailed fund explanation |
| **Display Order** | Number | ✅ Yes | - | Controls sort order (lower = higher priority) |
| **Performance Metrics** | Metric Array | ❌ No | 8+ metrics | Contains label & value pairs |
| **Documents** | File Array | ❌ No | 10+ files | PDFs, links, and attachments |
| **Visible on Website** | Boolean | ✅ Yes | - | Toggle to show/hide from public |
| **Created By** | Text (Auto) | - | - | Admin email who created it |
| **Last Modified By** | Text (Auto) | - | - | Admin email who last edited it |

---

## Best Practices

### Naming Conventions

✅ **DO:**
- Use clear, professional fund names
- Include geographic area if relevant ("African Tech Fund", "European Real Estate Fund")
- Use consistent naming across documents and marketing materials

❌ **DON'T:**
- Use vague names like "Fund 1" or "New Fund"
- Use ALL CAPS unless it's a known acronym
- Include version numbers in the name (manage updates instead)

### Descriptions

✅ **DO:**
- Write for non-expert investors (avoid jargon)
- Include investment strategy and target investor profile
- Mention risk level and time horizon
- Be honest about fees or limitations

❌ **DON'T:**
- Make unrealistic return promises
- Use marketing hype instead of facts
- Leave descriptions blank or vague

### Documents

✅ **DO:**
- Upload professional, branded documents
- Include a factsheet as minimum
- Update documents annually (for reports)
- Link to external compliance/regulatory documents if needed

❌ **DON'T:**
- Upload overly large files (keep under 5MB each)
- Use low-quality or outdated documents
- Include duplicate documents (use different names if you must)

### Display Order

✅ **DO:**
- Number in intervals (10, 20, 30) for flexibility
- Put flagship funds first (order 10)
- Update order if investment strategy changes

❌ **DON'T:**
- Use sequential numbers (1, 2, 3, 4...) - no room to insert funds
- Randomly order funds without reason

### Performance Metrics

✅ **DO:**
- Use consistent metric types across similar funds
- Update metrics quarterly or annually
- Include at least "Fund Size" as one metric
- Use realistic, audited figures

❌ **DON'T:**
- Include projected or estimated returns
- Use so many metrics it becomes overwhelming
- Update metrics inconsistently

---

## Managing Existing Funds

### Editing a Fund

1. Click the **Edit** (pencil icon) next to the fund name
2. Modify any fields
3. Click **Save Changes**
4. The system logs who edited it and when

### Deleting a Fund

1. Click the **Delete** (trash icon) next to the fund name
2. Confirm the deletion
3. Note: This is permanent and cannot be undone

**Recommendation:** Instead of deleting, uncheck "Visible on website" and keep the fund inactive. This preserves historical data.

### Hiding a Fund Temporarily

1. Edit the fund
2. Uncheck **"Visible on public website"**
3. Click **Save**
4. Fund is now hidden from clients (but still in the system)
5. Check the box again to re-publish

---

## Troubleshooting

### Problem: "Required field missing" error

**Solution:**
- Ensure **Fund Name** is filled in
- Ensure **Description** is filled in
- Ensure **Display Order** is a number
- Re-save the form

### Problem: Fund doesn't appear on public website

**Possible causes:**
1. "Visible on website" is unchecked → Check the box and save
2. Display Order sorting issue → Verify the number is correct
3. Browser cache → Clear browser cache and reload
4. Page hasn't refreshed → Manually refresh the public website

**Solution:**
1. Edit the fund
2. Verify "Visible on website" is checked
3. Verify Display Order number is correct
4. Save changes
5. Test on the public website (clear cache if needed)

### Problem: Document upload fails

**Possible causes:**
1. File is too large (>10MB)
2. File type not supported (try PDF, not raw Word doc)
3. Network connection issue

**Solution:**
1. Compress the PDF using a PDF tool
2. Convert the document to PDF if it's not
3. Try uploading again
4. If still failing, use "Add URL" instead and host the file externally

### Problem: Performance metrics don't save

**Solution:**
1. Click "+ Add Metric" even if it looks added
2. Enter both Label AND Value (both required)
3. Click Save before leaving the form
4. Save the entire fund
5. Edit and verify the metrics are there

### Problem: "Access Denied" error

**Possible causes:**
1. Your admin account doesn't have Global Funds permission
2. Your session has expired

**Solution:**
1. Log out and log back in
2. Contact your system administrator if permission issue persists

---

## Common Scenarios

### Scenario 1: Launching a New Fund

1. **Create the fund:** Fill all required fields with complete information
2. **Gather documents:** Collect factsheet, prospectus, brochure
3. **Upload documents:** Add 3-5 professional documents
4. **Set Display Order:** Put at order 10 if it's a flagship fund
5. **Hide initially:** Uncheck "Visible on website"
6. **Internal review:** Have manager review the fund
7. **Publish:** Check "Visible on website" when approved
8. **Announce:** Inform clients about the new fund

### Scenario 2: Quarterly Performance Update

1. **Edit the fund** that needs updating
2. **Update Performance Metrics:**
   - Modify YTD Return, 3-Year Return values
   - Add new metrics if needed
3. **Update Documents:** 
   - Upload new quarterly factsheet
   - Archive old one (delete or rename)
4. **Save Changes**
5. **Verify on public site** that numbers are current

### Scenario 3: Deprecating an Old Fund

1. **Don't delete** - this preserves historical data
2. **Edit the fund**
3. **Update Description** to add: "This fund is no longer accepting new investments as of [DATE]. Existing holders can continue to review performance."
4. **Uncheck "Visible on website"**
5. **Save**
6. Fund is now hidden from new clients but data is preserved

### Scenario 4: Multiple Similar Funds (Regional Versions)

**Example:** US Tech Fund, EU Tech Fund, African Tech Fund

1. Use consistent naming: "[REGION] Tech Fund"
2. Adjust Display Order sequentially (10, 11, 12)
3. Customize descriptions for each region's strategy
4. Include region-specific documents
5. Update performance metrics independently

---

## Quick Reference Checklist

Use this checklist when adding a new fund:

- [ ] Fund Name entered (required)
- [ ] Description entered (required)
- [ ] Short Name added (optional but recommended)
- [ ] Display Order set to a number
- [ ] At least 1 Performance Metric added
- [ ] At least 1 document uploaded/linked
- [ ] "Visible on website" checked (if ready to publish)
- [ ] Preview on public website to verify appearance
- [ ] Notify team/clients about new fund availability

---

## Support & Questions

If you encounter issues not covered in this guide:
1. Check the Troubleshooting section above
2. Ask your direct supervisor
3. Contact the development team for technical issues
4. Refer to system audit logs if data discrepancies occur

---

## Version History

| Date | Changes | Author |
|------|---------|--------|
| Mar 11, 2026 | Initial training guide created | Admin Team |

