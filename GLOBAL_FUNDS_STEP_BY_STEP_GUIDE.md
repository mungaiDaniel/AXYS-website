# Global Funds: Step-by-Step Visual Guide

**For colleagues who learn best by following exact steps**

---

## Step 0: Pre-Work Checklist

Before you start adding a fund, make sure you have:

- [ ] **Fund information** (Name, description, strategy)
- [ ] **Financial metrics** (Return figures, fund size, dates)
- [ ] **Document files** (Factsheet PDF, annual report, etc.)
- [ ] **Admin login credentials**
- [ ] **Manager approval** (if required by your process)

---

## Step 1: Navigate to Global Funds

```
1. Go to the admin dashboard at: https://ww3.aib-axysafrica.com/admin
2. Look at LEFT SIDE MENU
3. Find and click: "Global Funds"
4. You'll see a blue "+ Add New Fund" button in the top-right corner
```

**Expected Screen:**
- A list of existing global funds (if any exist)
- Blue button labeled "+ Add New Fund"
- Edit/Delete options next to each fund

---

## Step 2: Click "Add New Fund" Button

```
ACTION: Click the blue "+ Add New Fund" button (top right of page)
```

**A large modal dialog will appear** with several sections:

```
┌─ Add New Global Fund ──────────────────────────────────────┐
│                                                              │
│ SECTION 1: FUND INFORMATION                                 │
│   ☐ Fund Name (required)                    [____________]  │
│   ☐ Short Name (optional)                   [____________]  │
│   ☐ Description (required)                  [____________]  │
│                                                              │
│ SECTION 2: DISPLAY ORDER                                    │
│   ☐ Display Order                           [____________]  │
│                                                              │
│ SECTION 3: PERFORMANCE METRICS                              │
│   + Add Metric                                              │
│   (None added yet)                                           │
│                                                              │
│ SECTION 4: DOCUMENTS                                        │
│   ☐ Upload File    ☐ Add URL                                │
│   (No documents added yet)                                   │
│                                                              │
│ SECTION 5: VISIBILITY                                       │
│   ☑ Visible on public website                                │
│                                                              │
│                              [Cancel]  [Save Fund]          │
└──────────────────────────────────────────────────────────────┘
```

---

## Step 3: Fill in Fund Information

### 3A. Fund Name Field

```
FIELD: Fund Name *
TYPE: Text input
REQUIRED: Yes ✓
```

**What to enter:**
- The official, full name of the investment fund
- Should be professional and clear
- Clients will see this on the website

**Examples:**
- ✅ "African Technology Growth Fund"
- ✅ "Emerging Markets Equity Fund"
- ✅ "Fixed Income Bond Fund"
- ❌ "Fund 1" (too vague)
- ❌ "NEW FUND!!!" (unprofessional)

**CHARACTER LIMIT:**
- Recommended: 100 characters or less
- Longer names are technically possible but may look bad on website

**ACTION:**
```
1. Click in the "Fund Name" field
2. Type the full fund name
3. Example: "African Growth Fund"
```

---

### 3B. Short Name Field

```
FIELD: Short Name (e.g. AEF, AYF)
TYPE: Text input
REQUIRED: No ❌ (optional)
```

**What to enter:**
- A 3-5 letter abbreviation or "ticker" for the fund
- Used in reports, documents, and quick reference

**Examples:**
- ✅ "AGF" for African Growth Fund
- ✅ "TIF" for Tech Innovation Fund
- ✅ "EMEF" for Emerging Markets Equity Fund
- ❌ "Very Long Fund Name Here" (defeats the purpose)

**WHERE IT'S USED:**
- Reports and internal documents
- API integrations (if applicable)
- Quick identification in dashboards

**ACTION:**
```
1. Click in the "Short Name" field
2. Type a 3-5 letter abbreviation
3. Example: "AGF"
4. Leave blank if you don't have one (it's optional)
```

---

### 3C. Description Field

```
FIELD: Description *
TYPE: Long text field (multi-line)
REQUIRED: Yes ✓
```

**What to enter:**
- A clear, compelling description of the fund
- Should explain:
  - **What** the fund invests in
  - **Who** should invest in it
  - **Why** it's a good investment
  - **How much** risk is involved

**Total length:** 300-500 characters is ideal (about 2-3 sentences)

**Professional Example:**
```
"A dynamic, diversified portfolio of high-growth technology companies 
across African and emerging markets. Designed for growth-oriented 
investors aged 25-55 with a 5+ year investment horizon and moderate 
to high risk tolerance. Annual performance tracking in top decile."
```

**What to AVOID:**
- ❌ Vague descriptions: "A good fund"
- ❌ Promises of returns: "Guaranteed 20% annual return"
- ❌ Marketing hype: "The BEST fund in Africa!!!"
- ❌ Empty: Leave it blank
- ❌ Sales language: "Don't miss out!"

**Suggested Format:**
```
Sentence 1: What it invests in
Sentence 2: Who should invest
Sentence 3: Risk level or key characteristics
```

**ACTION:**
```
1. Click in the "Description" text field
2. Type a 2-3 sentence professional description
3. Review for spelling/grammar
4. Do NOT include your personal opinions
5. Example text:
   "A diversified portfolio of African tech companies with 
    5+ year growth potential. Ideal for investors aged 25-50 
    seeking moderate-to-high returns with higher risk tolerance."
```

---

## Step 4: Set Display Order

```
FIELD: Display Order
TYPE: Numeric input
REQUIRED: Yes ✓
DEFAULT: 12 (shown in example screenshot)
```

**What is Display Order?**
- A number that controls where the fund appears in lists
- Funds with **lower numbers appear first**
- Funds with **higher numbers appear later**

**Display Order Logic:**
```
Order: 10  → Appears 1st on website
Order: 20  → Appears 2nd on website
Order: 30  → Appears 3rd on website
Order: 40  → Appears 4th on website
Order: 50  → Appears last on website
```

**WHY USE GAPS (10, 20, 30 instead of 1, 2, 3)?**

Scenario: You want to insert a new flagship fund later
- Using gaps: Change new fund to 15, keep others at 20, 30, 40 ✓
- Using sequential: Have to renumber everything (10→11, 20→21, etc) ❌

**BEST PRACTICE NUMBERING:**
```
Flagship/Main funds:     10, 20, 30
Secondary funds:         40, 50, 60
Niche/Specialized funds: 70, 80, 90
Deprecated funds:        100+ (or just hide them)
```

**ACTION:**
```
1. Click in the "Display Order" field
2. Clear the default number (if any)
3. Enter a number based on priority:
   - First fund to display: 10
   - Second fund to display: 20
   - Third fund to display: 30
   etc.
4. Example: Enter "10" for a main fund
```

---

## Step 5: Add Performance Metrics

```
SECTION: Performance Metrics
REQUIRED: No ❌ (optional, but highly recommended)
BUTTON: "+ Add Metric"
```

**What are Performance Metrics?**
- Statistics that show fund performance to potential investors
- Examples: "YTD Return: 15.5%", "Fund Size: $250M"
- Appear on the fund detail page on the website

**HOW TO ADD A METRIC:**

### Step 5.1: Click "+ Add Metric"

```
ACTION: Click the blue "+ Add Metric" link/button
```

A new form will appear asking for:
- **Label**: The name of the metric (e.g., "YTD Return")
- **Value**: The actual value (e.g., "15.5%")

### Step 5.2: Fill in Metric Label

```
FIELD: Label
EXAMPLE: "YTD Return"
```

Common metric labels:
- ✓ "YTD Return" (Year-to-Date return)
- ✓ "1-Year Return"
- ✓ "3-Year Return"
- ✓ "5-Year Return"
- ✓ "Fund Size" or "AUM" (Assets Under Management)
- ✓ "Expense Ratio"
- ✓ "Inception Date"
- ✓ "Sharpe Ratio"
- ✓ "Volatility"

**ACTION:**
```
1. Click in the "Label" field
2. Type the metric name, e.g., "YTD Return"
```

### Step 5.3: Fill in Metric Value

```
FIELD: Value
EXAMPLE: "15.5%"
```

How to format values:
- ✓ Percentages: "15.5%", "8.3% p.a."
- ✓ Currency: "$250M", "€1.2B"
- ✓ Dates: "January 2020"
- ✓ Ratios: "1.25"
- ✓ Descriptive: "Top Quartile"

**ACTION:**
```
1. Click in the "Value" field
2. Type the actual metric value, e.g., "15.5%"
```

### Step 5.4: Save the Metric

```
ACTION: Click "Save" or "Add" button to save this metric
```

The metric now appears in the list:
```
Performance Metrics
▼ YTD Return | 15.5%  [Edit] [Delete]
  (Ready to add more)
```

### Step 5.5: Repeat for Additional Metrics

```
1. Click "+ Add Metric" again
2. Enter new Label (e.g., "3-Year Return")
3. Enter new Value (e.g., "12.8%")
4. Click Save
5. Repeat until you've added all metrics (4-8 is typical)
```

**RECOMMENDED METRICS (In this order):**
1. "Fund Size" or "AUM" - How big the fund is
2. "Inception Date" - When the fund started
3. "YTD Return" - Current year performance
4. "3-Year Return" - Medium term performance
5. "5-Year Return" - Long-term performance
6. "Expense Ratio" - Annual fees
7. "Benchmark" - Comparison index performance (if applicable)

---

## Step 6: Upload or Link Documents

```
SECTION: Documents
REQUIRED: No ❌ (optional, but highly recommended)
BUTTONS: "Upload File" OR "Add URL"
```

**What are Documents?**
- PDFs, factsheets, annual reports, prospectuses
- Provide detailed information to potential investors
- Appear as downloadable links on the fund page

### Step 6.1: Upload a File

```
ACTION: Click the "Upload File" button
```

A file picker dialog will open:

```
1. Navigate to where the file is on your computer
2. Select the document (PDF preferred)
3. Click "Upload" or "Open"
4. Wait for the file to upload (progress shown)
5. Document appears in the list with auto-generated name
```

**RECOMMENDATIONS:**
- ✓ Use PDF format (most professional)
- ✓ File size: Under 5MB each
- ✓ Professional branding on documents
- ✓ Clear, legible text and charts

**SUPPORTED FILES:**
- ✓ PDF (best)
- ✓ DOC/DOCX (will convert)
- ✓ XLS/XLSX (if converted to PDF)
- Avoid: ZIP, EXE, or other executable formats

### Step 6.2: OR Add a URL Link

```
ACTION: Click the "Add URL" button
```

A text field will appear:

```
1. Paste the full web address/URL
2. Example: https://example.com/fundname-factsheet.pdf
3. The system extracts the filename automatically
4. Click "Save URL"
5. Link appears in the documents list
```

**USE THIS WHEN:**
- Document is already hosted on a website
- Document is very large (>10MB)
- You want to link to external compliance documents
- Document is frequently updated on a website

**MAKE SURE:**
- ✓ URL is publicly accessible (not password protected)
- ✓ URL doesn't expire
- ✓ Link points to the actual document (not a page that links to it)
- ✓ Test the link works before saving

### Step 6.3: Recommended Documents

**Minimum (Must Have):**
- [ ] Fund Factsheet (1-2 pages)

**Highly Recommended:**
- [ ] Annual Report
- [ ] Prospectus or Offering Document
- [ ] Performance Brochure
- [ ] Risk Disclosure

**Optional But Good:**
- [ ] Monthly Newsletter
- [ ] Quarterly Report
- [ ] Benchmark Comparison Chart
- [ ] Historical Performance Data

---

## Step 7: Set Visibility

```
SECTION: Visibility Settings
CHECKBOX: "Visible on public website"
DEFAULT: ✓ Checked (enabled)
```

**What does this do?**
- ✓ Checked: Fund appears on the public website for clients
- ❌ Unchecked: Fund is hidden from public view (still in admin system)

**WORKFLOW EXAMPLE:**

```
DRAFT MODE:
1. Create fund with all details
2. UNCHECK "Visible on public website"
3. Save fund
4. Send to manager/team for review
5. Make requested changes
6. Both parties approve

PUBLISH MODE:
7. CHECK "Visible on public website"
8. Save
9. Notify clients/marketing team
10. Verify on public website (clear cache if needed)
```

**ACTION - IF FUND IS READY NOW:**
```
1. Verify the checkbox is CHECKED ✓
2. This makes the fund immediately visible to public
3. Skip to Step 8: Save
```

**ACTION - IF FUND IS IN DRAFT MODE:**
```
1. Click to UNCHECK the checkbox ❌
2. This hides the fund from public view
3. After approval, come back and CHECK it
4. Save to publish
```

---

## Step 8: Review Everything

Before saving, review all fields:

```
CHECKLIST:
□ Fund Name: Clear and professional?
□ Short Name: 3-5 characters? (optional, can be blank)
□ Description: 2-3 sentences explaining strategy?
□ Display Order: Numeric value entered?
□ Performance Metrics: At least 1-2 added?
□ Documents: At least factsheet uploaded?
□ Visibility: Checkbox status correct?
```

---

## Step 9: Save the Fund

```
ACTION: Click the blue "SAVE FUND" button (bottom right of modal)
```

**The system will:**
1. Validate all required fields
2. Check for security issues
3. Store in the database
4. Create audit log entry
5. Display success message

**What you'll see after saving:**
- Modal closes automatically
- New fund appears in the dashboard list
- Success notification appears (temporary)
- Fund is now live (if visibility was checked)

---

## Step 10: Verify on Public Website

**IMPORTANT:** Always test that it looks correct!

```
1. Go to the public website: https://www.aib-axysafrica.com
2. Navigate to "Offshore Funds" or "Global Funds" page
3. Look for your new fund:
   - Is it in the correct position? (based on Display Order)
   - Does the name look correct?
   - Does the description appear?
   - Can clients access all documents?
4. Click on the fund to view details
5. Verify all performance metrics display
6. Verify all documents are downloadable
7. Check on mobile phone too (responsive design)
```

**If something looks wrong:**
1. Go back to Global Funds admin
2. Click the Edit (pencil) icon next to your fund
3. Make corrections
4. Save changes
5. Clear your browser cache (Ctrl+Shift+Delete)
6. Refresh the public website page

---

## Editing a Fund Later

```
TO EDIT EXISTING FUND:
1. Go to Global Funds admin page
2. Find the fund in the list
3. Click the pencil icon (✏️) next to it
4. Modal opens with existing data
5. Change any fields
6. Click "Save Changes"
7. Done - changes take effect immediately
```

```
TO DELETE A FUND:
1. Go to Global Funds admin page
2. Find the fund in the list
3. Click the trash icon (🗑️) next to it
4. Confirm deletion
5. Fund is permanently removed
⚠️ WARNING: This cannot be undone!
⚠️ BETTER OPTION: UnCheck "Visible" instead of deleting
```

---

## Common Issues & Solutions

### Issue 1: "Fund Name is required" error

```
PROBLEM: Can't save, getting error message
CAUSE: Fund Name field is empty
SOLUTION:
  1. Look at the Fund Name field
  2. Make sure it's not blank
  3. Type a fund name
  4. Try saving again
```

### Issue 2: Fund doesn't appear on public website

```
PROBLEM: Added fund but can't see it on the website
POSSIBLE CAUSES:
  1. "Visible on website" is unchecked
  2. Display Order number is wrong
  3. Browser cache not refreshed
  4. Website hasn't reloaded the database

SOLUTIONS:
  1. Edit the fund - CHECK "Visible on website"
  2. Verify Display Order is numeric (not text)
  3. Clear browser cache: Ctrl+Shift+Delete
  4. Close and reopen the website
  5. Try checking on a different browser
```

### Issue 3: Document won't upload

```
PROBLEM: File upload keeps failing
POSSIBLE CAUSES:
  1. File is too large (>10MB)
  2. File format not supported
  3. Network connection issue
  4. Browser issue

SOLUTIONS:
  A. Compress the PDF:
     - Use online PDF compressor (tinypdf.com)
     - Target: under 5MB
     - Try uploading compressed version
  
  B. Use "Add URL" instead:
     - Host the PDF on a website
     - Copy the URL
     - Click "Add URL" button
     - Paste the URL
     - Let the system link to it
  
  C. Try a different browser:
     - Use Chrome instead of Firefox
     - Or vice versa
     - Sometimes one works better
  
  D. Wait and retry:
     - Network might be slow
     - Try uploading in a few minutes
```

### Issue 4: Performance metrics won't save

```
PROBLEM: Added a metric but it doesn't save
POSSIBLE CAUSES:
  1. Didn't click the Save button after entering metric
  2. Value field is empty
  3. Label field is empty

SOLUTIONS:
  1. After entering Label AND Value:
     - Click "Save" or "Add" button explicitly
  2. Make sure BOTH fields are filled:
     - Label: e.g., "YTD Return"
     - Value: e.g., "15.5%"
  3. Then save the entire fund
  4. Edit again to verify metrics are there
```

---

## Final Checklist: Fund Complete

- [ ] Fund Name entered and looks professional
- [ ] Description explains strategy and target investor
- [ ] Display Order set to appropriate number
- [ ] At least 1 performance metric added
- [ ] At least 1 document uploaded or linked
- [ ] "Visible on website" status is correct
- [ ] Saved successfully
- [ ] Appears on public website
- [ ] All links and documents work
- [ ] Colleagues/manager notified
- [ ] Manager approved (if needed)

---

**Congratulations! You've successfully added a new global fund! 🎉**

For questions: Ask your supervisor  
For technical issues: Contact the dev team  
For clarification: Review this guide or the full training guide

