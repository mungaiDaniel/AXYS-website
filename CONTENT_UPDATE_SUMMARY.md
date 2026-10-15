# CONTENT UPDATE SUMMARY - AIB-AXYS AFRICA WEBSITE
**Date:** January 26, 2026  
**Update Type:** Content & Team Information Updates  

---

## ✅ CHANGES IMPLEMENTED

### 1️⃣ FOOTER TEXT UPDATE

**File Path:** `/app/components/Footer.js`  
**Line:** 29-31

**Previous Text:**
```
Leading stock trading platform in Kenya, specializing in IPOs, 
leveraged trading, and global fund access.
```

**Updated Text:**
```
Leading Brokerage Firm in Kenya, specializing in Local Stocks 
and Bonds, International Equities, ETFs and Offshore Funds.
```

**Change Description:**
- Replaced "stock trading platform" with "Brokerage Firm"
- Updated services description to be more comprehensive
- Added specific mention of "Local Stocks and Bonds, International Equities, ETFs and Offshore Funds"

---

### 2️⃣ GROUP PAGE - CLIENT ASSETS STAT UPDATE

**File Path:** `/app/app/group/page.js`  
**Line:** 29

**Previous:**
```javascript
{ icon: <TrendingUp />, value: '10,000+', label: 'Clients' }
```

**Updated:**
```javascript
{ icon: <TrendingUp />, value: 'USD14+ Bn', label: 'Client Assets' }
```

**Change Description:**
- Replaced "10,000+ Clients" metric
- Updated to "USD14+ Bn Client Assets"
- Changed label from "Clients" to "Client Assets"
- More accurately reflects financial scale of operations

---

### 3️⃣ ABOUT PAGE - OUR STORY TEXT UPDATES

**File Path:** `/app/app/about/page.js`  
**Lines:** 74-89

**Changes Made:**

**A. First Paragraph - Market Expertise Text**
- **Changed:** "more than 25 years" → "**over 30 years**"
- **Changed:** "fully accredited stockbroker" → "**fully accredited brokerage firm**"

**B. Third Paragraph - Complete Rewrite**

**REMOVED:**
```
With 30+ years of experience, 170+ employees across the group, 
and over 10,000 clients worldwide, AXYS Group operates across 
85 countries and six continents. We combine local market expertise 
with global reach to deliver exceptional value to our clients.
```

**REPLACED WITH:**
```
As part of the wider AXYS Group, AIB-AXYS combines local market 
expertise with global reach to deliver exceptional value to our clients.
```

**Change Description:**
- Removed specific group-level statistics (moved to Group page)
- Simplified messaging to focus on AIB-AXYS' position within AXYS Group
- Maintained emphasis on "local market expertise with global reach"
- More concise and focused on client value proposition

---

### 4️⃣ ABOUT PAGE - BOARD OF DIRECTORS UPDATE

**File Path:** `/app/app/about/page.js`  
**Lines:** 29-36

**Previous Board (7 members):**
```javascript
{ name: 'Charles Makori Omanga', role: 'Chairperson - Independent Non-Executive Director' }
{ name: 'Michel Guy Rivalland', role: 'Non-executive Director' }
{ name: 'Kenneth Wendell Ian Sababady', role: 'Non-executive Director' }
{ name: 'Derek Arthur Waruhiu', role: 'Non-executive & Independent Director' }
{ name: 'Khilan Gulabchand Shah', role: 'Non-executive & Independent Director' }
{ name: 'Yasser Soolayman Doobory', role: 'Alternate to Mr. Michel - Non-executive Director' }
{ name: 'Cedric Beguier', role: 'Alternate to Mr. Ian - Non-executive Director' }
```

**Updated Board (7 members - Reordered & Renamed):**
```javascript
{ name: 'Charles M. Omanga', role: 'Chairperson, Non-executive & Independent Director' }
{ name: 'Michel Guy Rivalland', role: 'Non-executive Director' }
{ name: 'Yasser Doobory', role: 'Non-executive Director and Alternate to Michel Guy Rivalland' }
{ name: 'Ian Sababady', role: 'Non-executive Director' }
{ name: 'Cédric Béguier', role: 'Non-executive Director and Alternate to Ian Sababady' }
{ name: 'Derek A. Waruhiu', role: 'Non-executive & Independent Director' }
{ name: 'Khilan G. Shah', role: 'Non-executive & Independent Director' }
```

**Key Changes:**
1. **Charles Makori Omanga** → **Charles M. Omanga** (shortened middle name)
2. **Kenneth Wendell Ian Sababady** → **Ian Sababady** (simplified)
3. **Yasser Soolayman Doobory** → **Yasser Doobory** (shortened)
4. **Cedric Beguier** → **Cédric Béguier** (added accent)
5. **Derek Arthur Waruhiu** → **Derek A. Waruhiu** (shortened middle name)
6. **Khilan Gulabchand Shah** → **Khilan G. Shah** (shortened middle name)

**Role Description Changes:**
- Chairperson: Changed from "Chairperson - Independent..." → "Chairperson, Non-executive..."
- Alternates: Changed format from "Alternate to Mr. Michel" → "Alternate to Michel Guy Rivalland"
- Removed "Mr." prefix, using full names instead

**Order Changes:**
- Moved Yasser Doobory to position #3 (after Michel, as his alternate)
- Moved Cédric Béguier to position #5 (after Ian, as his alternate)
- This groups directors with their alternates

---

### 5️⃣ ABOUT PAGE - MANAGEMENT TEAM UPDATE

**File Path:** `/app/app/about/page.js`  
**Lines:** 39-42

**Previous Management (5 members):**
```javascript
{ name: 'Bansri Pattni', role: 'Chief Executive Officer' }
{ name: 'Mary Maloba', role: 'Ag. CEO & Compliance Manager' }
{ name: 'Lemek Oltele', role: 'Head of Business Development' }
{ name: 'Nina Goswami', role: 'Head of Equity Trading' }
{ name: 'Priscilla Gichuhi', role: 'Head of Finance, HR & Administration' }
```

**Updated Management (2 members):**
```javascript
{ name: 'Mary Maloba', role: 'Ag. CEO & Head of Compliance' }
{ name: 'Nina Goswami', role: 'Head of Trade' }
```

**Changes:**
1. **Removed 3 members:** Bansri Pattni, Lemek Oltele, Priscilla Gichuhi
2. **Mary Maloba:** Title updated from "Ag. CEO & Compliance Manager" → "Ag. CEO & Head of Compliance"
3. **Nina Goswami:** Title updated from "Head of Equity Trading" → "Head of Trade"

**UI Adjustment:**
- Grid changed from `grid-cols-1 md:grid-cols-2 lg:grid-cols-5` → `grid-cols-1 md:grid-cols-2`
- Added `max-w-2xl mx-auto` for better centering with only 2 cards
- Management section now displays 2 cards side-by-side instead of 5

---

### 6️⃣ TEAM SECTION - UNCHANGED

**File Path:** `/app/app/about/page.js`  
**Lines:** 44-51

**Team Members (6 members - No changes):**
- Ngige Jeff Wanjao - Wealth Management
- Maureen Wanjiku - Wealth Management
- Ian Mudiri - Wealth Management
- Veronica Wambua - Customer Service
- Peter Chege - IT, Products and Innovation
- Samuel Mburu Kinuthia - Project Support Lead

**Note:** Per user instructions, team members were preserved as-is.

---

## 📸 VERIFICATION SCREENSHOTS

All screenshots confirm the changes:

✅ **Footer:** Updated text visible: "Leading Brokerage Firm in Kenya, specializing in Local Stocks and Bonds, International Equities, ETFs and Offshore Funds."

✅ **Group Page:** Stats section shows "USD14+ Bn Client Assets" instead of "10,000+ Clients"

✅ **About Page - Our Story:** 
- Shows "over 30 years of market expertise"
- Shows "fully accredited brokerage firm"
- Third paragraph replaced with simplified AXYS Group text

✅ **About Page - Board of Directors:**
- All 7 directors shown with updated names and titles
- Proper ordering with alternates grouped

✅ **About Page - Management:**
- Only 2 members displayed (Mary Maloba, Nina Goswami)
- Updated titles showing correctly
- Centered 2-column grid layout

---

## 🔧 TECHNICAL IMPLEMENTATION DETAILS

### Files Modified (3 total):

1. **`/app/components/Footer.js`**
   - Updated company description text
   - Line 29-31

2. **`/app/app/group/page.js`**
   - Updated stats array
   - Changed "Clients" metric to "Client Assets"
   - Line 29

3. **`/app/app/about/page.js`**
   - Updated Our Story text (3 paragraphs)
   - Updated Board of Directors array (7 members)
   - Updated Management array (reduced to 2 members)
   - Adjusted Management grid layout
   - Lines 29-42, 74-89, 123

### No Breaking Changes:
- All existing functionality preserved
- No database changes required
- No API modifications needed
- Layout automatically adapts to new content
- Dark/light mode compatibility maintained

---

## ✅ VERIFICATION COMPLETE

All requested content changes have been successfully implemented and verified through screenshots. The website now displays:

- Updated footer branding text
- Correct client assets metric on Group page
- Accurate "Our Story" narrative on About page
- Current Board of Directors with proper titles and ordering
- Streamlined Management team (2 members)
- Preserved Team section (6 members)

**Status:** All content updates live and functional! ✅
