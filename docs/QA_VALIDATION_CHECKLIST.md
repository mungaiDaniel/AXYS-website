# QA Validation Checklist
## AIB-AXYS Africa Platform - Human Testing Protocol

**Purpose:** Verify all recent UI/UX changes are working correctly before deployment  
**Tester:** ___________________________  
**Date:** ___________________________  
**Environment:** [ ] Local Development [ ] Staging [ ] Production  

---

## 📋 PRE-TEST SETUP

Before starting the QA process, ensure:

- [ ] Application is running locally: `npm run dev` or `npm run build && npm run start`
- [ ] Browser is open at `http://localhost:3000`
- [ ] Browser DevTools are open (F12) to check for console errors
- [ ] You have admin credentials ready for testing admin features
- [ ] Screen resolution is at least 1920x1080 for desktop testing
- [ ] Mobile device or responsive mode ready for mobile testing

---

## 🔐 SECTION 1: ADMIN SIDEBAR & LAYOUT

**Context:** The admin interface has been refactored from a top navbar to a collapsible left sidebar.

### Desktop View (Width > 768px)

- [ ] **Login to Admin Panel**
  - Navigate to: `http://localhost:3000/admin/login`
  - Enter credentials: `sk@horizonafrica.com` / `Admin@2026`
  - Verify successful login and redirect to `/admin/dashboard`

- [ ] **Sidebar Default State**
  - Verify sidebar is visible on the LEFT side of the screen
  - Verify sidebar shows:
    - AIB-AXYS logo at the top
    - Navigation links with icons (Dashboard, Contacts, Documents, etc.)
    - User profile section at the bottom
  - Verify main content area is to the RIGHT of sidebar

- [ ] **Sidebar Collapse Functionality**
  - Click the **Menu icon** (☰) in the top-right corner of the header
  - Verify sidebar smoothly animates to collapsed state (narrow width)
  - Verify logo changes from full "AIBAXYS" text to emblem icon only
  - Verify navigation items show only icons (no text)
  - **CRITICAL:** Verify main content area EXPANDS (left margin reduces)

- [ ] **Sidebar Expand Functionality**
  - Click the Menu icon again
  - Verify sidebar smoothly expands back to full width
  - Verify logo changes from emblem to full "AIBAXYS" text
  - Verify navigation items show icons + text labels
  - Verify main content area contracts back (left margin increases)

- [ ] **Sidebar Navigation**
  - Click each navigation item in the sidebar
  - Verify correct page loads for each item:
    - [ ] Dashboard
    - [ ] Contacts
    - [ ] Documents
    - [ ] Research Papers
    - [ ] Exchange Rates
    - [ ] IPO Settings
    - [ ] Global Funds
    - [ ] Analytics
    - [ ] Page Settings
    - [ ] Users (if super-admin)
  - Verify active page is highlighted in the sidebar

- [ ] **Sidebar Scroll Behavior**
  - If sidebar has many items, scroll within the sidebar
  - Verify only sidebar scrolls, not the entire page
  - Verify header with logo stays fixed at top

### Mobile/Tablet View (Width ≤ 768px)

- [ ] **Sidebar Hidden by Default**
  - Resize browser to mobile width (e.g., 375px)
  - Verify sidebar is NOT visible on page load
  - Verify main content fills the entire screen

- [ ] **Mobile Menu Button**
  - Verify Menu icon (☰) is visible in the header
  - Click the Menu icon
  - Verify sidebar slides in from the left as an overlay
  - Verify backdrop (dark overlay) appears behind sidebar

- [ ] **Mobile Sidebar Close**
  - Click outside the sidebar (on the backdrop)
  - Verify sidebar slides out and disappears
  - OR click the Menu icon again and verify same behavior

---

## 🌙 SECTION 2: DARK MODE INTEGRITY (ADMIN ONLY)

**Context:** Dark mode in the admin area was problematic and has been REMOVED. The admin area now uses LIGHT MODE ONLY.

- [ ] **Verify Light Mode Only**
  - In the admin area, look for a dark/light mode toggle button
  - **Expected:** NO dark mode toggle should be present in admin area
  - Verify background is light/white
  - Verify text is dark/black

- [ ] **Public Site Dark Mode**
  - Navigate to the public homepage: `http://localhost:3000`
  - Look for the dark/light mode toggle (moon/sun icon) in the top-right
  - Click the toggle
  - Verify background changes to dark
  - Verify text changes to light/white
  - Verify images/logos swap to dark-mode versions

- [ ] **Dark Mode Persistence**
  - With dark mode enabled on public site, refresh the page
  - Verify dark mode is still active after refresh (persisted in localStorage)

**NOTE:** If you find a dark mode toggle in the admin area, REPORT THIS AS A BUG.

---

## ⏳ SECTION 3: LOADING SCREEN CONSISTENCY

**Context:** The site has a pulsing emblem loading animation that should consistently mask page loading and only disappear when content is fully loaded.

### Test Procedure:

- [ ] **Hard Refresh Test**
  - Navigate to: `http://localhost:3000`
  - Perform a hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
  - **Observe:**
    - [ ] Pulsing emblem animation appears immediately
    - [ ] Animation continues pulsing consistently
    - [ ] Animation ONLY disappears when page content is fully loaded
    - [ ] No premature timeout or flashing

- [ ] **Slow Connection Simulation**
  - Open DevTools → Network Tab
  - Set throttling to "Slow 3G"
  - Refresh the page
  - Verify pulsing animation stays visible until ALL content loads
  - **Critical:** Animation should NOT timeout while images are still loading

- [ ] **Fast Connection Test**
  - Disable throttling (back to "No throttling")
  - Refresh the page
  - Verify animation appears briefly and disappears smoothly once content is ready
  - No flickering or premature disappearance

- [ ] **Navigation Between Pages**
  - Click between different pages (Home → About → Platforms)
  - Verify loading animation appears on EVERY navigation
  - Verify animation waits for new page content to load before disappearing

- [ ] **Maximum Timeout Check**
  - Simulate very slow connection or network failure
  - Verify animation disappears after maximum 3 seconds (fallback timeout)
  - This prevents infinite loading if content fails to load

- [ ] **Console Error Check**
  - During loading, check browser console (F12 → Console)
  - Verify NO errors related to LoadingPage or RouteLoadingWrapper
  - Expected: Clean console or only informational logs

---

## 🧭 SECTION 4: PUBLIC NAVIGATION

**Context:** The public-facing navbar has dropdown menus and responsive behavior.

### Desktop Navigation (Width > 768px)

- [ ] **Navbar Layout**
  - Navigate to: `http://localhost:3000`
  - Verify navbar items are horizontally aligned
  - Verify items are spaced out filling the width (justified)
  - Expected items: Home, About, Platforms, Services, Fund Account, Research, Downloads, IPO, FAQ, Contact

- [ ] **About Dropdown**
  - Hover over "About" in the navbar
  - **Expected:** Dropdown appears with submenu items
  - Verify dropdown contains:
    - [ ] "About Group" (or similar)
    - [ ] Other submenu items
  - Verify dropdown is styled correctly (glass effect, shadows)
  - Click "About Group" and verify navigation to correct page

- [ ] **Services Dropdown**
  - Hover over "Services"
  - Verify dropdown appears with service options:
    - [ ] Leverage
    - [ ] Global Markets
    - [ ] Other services
  - Click each item and verify correct page loads

- [ ] **Fund Account Dropdown**
  - Hover over "Fund Account"
  - Verify dropdown appears with funding options:
    - [ ] Local Stocks
    - [ ] Multi-Currency
    - [ ] International Equities
    - [ ] Offshore Funds
  - Click each item and verify correct page loads

- [ ] **Static Links**
  - Click each non-dropdown item:
    - [ ] Home → Loads homepage
    - [ ] Platforms → Loads platforms page
    - [ ] Research → Loads research papers page
    - [ ] Downloads → Loads downloads page
    - [ ] IPO → Loads IPO application page
    - [ ] FAQ → Loads FAQ page
    - [ ] Contact → Loads contact form

### Mobile Navigation (Width ≤ 768px)

- [ ] **Hamburger Menu**
  - Resize browser to mobile width (≤ 768px)
  - Verify navbar collapses to hamburger menu icon (☰)
  - Click hamburger icon
  - Verify mobile menu slides in/appears

- [ ] **Mobile Menu Navigation**
  - Verify all navigation items are present in mobile menu
  - Tap "About" → Verify submenu expands inline
  - Tap "Services" → Verify submenu expands
  - Tap "Fund Account" → Verify submenu expands
  - Tap any link and verify page loads

- [ ] **Mobile Menu Close**
  - Verify mobile menu has a close button (X)
  - Click close button or tap outside menu
  - Verify menu closes/disappears

---

## 💱 SECTION 5: EXCHANGE RATES PAGE (CRITICAL)

**Context:** This page displays live exchange rates with a "Valid Until" timer.

- [ ] **Navigate to Page**
  - Go to: `http://localhost:3000/exchange-rates`
  - Verify page loads without errors

- [ ] **Rate Cards Display**
  - Verify exchange rate cards are visible for:
    - [ ] USD → KSH
    - [ ] GBP → KSH
    - [ ] (EUR if applicable)
  - Verify each card shows:
    - Currency symbol ($ or £)
    - "WE BUY" rate
    - "WE SELL" rate

- [ ] **"Valid Until" Timer**
  - Look at the TOP RIGHT of each exchange rate card
  - **Expected:**
    - [ ] Label: "Valid Until:" (in BLACK text)
    - [ ] Timer value: e.g., "14h 52m 30s" (in ROYAL BLUE #0017bf)
    - [ ] OR "Expired" (in RED #ff0000 if rate is expired)
  - **Critical:** Verify timer text is VISIBLE and NOT hidden
  - Wait 1 minute and verify timer counts down in real-time

- [ ] **Currency Pair Display**
  - Verify currency pairs like "USD → KSH" have consistent text size
  - Verify "KSH" is the SAME size as "USD" (not smaller)
  - Verify arrow (→) is properly displayed

---

## 🌐 SECTION 6: MULTI-CURRENCY FUND ACCOUNT PAGE

**Context:** Similar to exchange rates but with additional features.

- [ ] **Navigate to Page**
  - Go to: `http://localhost:3000/fund-account/multi-currency`
  - Verify page loads

- [ ] **Exchange Rate Cards**
  - Same checks as Section 5
  - Additionally verify timer is aligned to center of currency symbol

- [ ] **Currency Converter**
  - Scroll to "Currency Converter" section
  - Select a currency (e.g., USD)
  - Enter an amount (e.g., 100)
  - Verify KSH amount is calculated and displayed
  - Verify calculation is correct based on displayed rate

---

## 📄 SECTION 7: PLATFORMS PAGE (DIGITRADER LOGO)

**Context:** Logo has been updated.

- [ ] **Navigate to Page**
  - Go to: `http://localhost:3000/platforms`
  - Verify page loads

- [ ] **Logo Display - Light Mode**
  - Verify DigiTrader logo is visible on the left side
  - Expected: BLUE logo with "AIBAXYS DigiTrader" text
  - Verify logo is crisp and not pixelated

- [ ] **Logo Display - Dark Mode**
  - Toggle to dark mode
  - Verify logo changes to WHITE version
  - Verify logo is still crisp and visible against dark background

---

## 👥 SECTION 8: ABOUT US PAGE (TEAM ORDER)

**Context:** Team member order has been updated.

- [ ] **Navigate to Page**
  - Go to: `http://localhost:3000/about`
  - Scroll to "Management" section

- [ ] **Verify Team Order**
  - Verify management team appears in this order:
    1. [ ] Bansri Pattni (CEO)
    2. [ ] Mary Maloba (Ag. CEO & Head of Compliance)
    3. [ ] **Stella Wambugu (Head of Markets)** ← Should be AFTER Mary
    4. [ ] Lemek Oltele
    5. [ ] Nina Goswami
    6. [ ] Priscilla Gichuhi

---

## 🐛 SECTION 9: CONSOLE ERROR CHECK (ALL PAGES)

For EACH page you visit during testing:

- [ ] **Open Browser Console** (F12 → Console tab)
- [ ] **Check for Errors:**
  - [ ] Homepage - No errors
  - [ ] Admin Dashboard - No errors
  - [ ] Exchange Rates - No errors
  - [ ] Multi-Currency - No errors
  - [ ] Platforms - No errors
  - [ ] About Us - No errors
  - [ ] Contact Form - No errors

**Acceptable Logs:**
- Informational logs (blue/gray)
- Build messages from Next.js

**Report These:**
- Red errors (JavaScript exceptions)
- Yellow warnings (if numerous)
- Failed network requests (404, 500 errors)

---

## 📱 SECTION 10: MOBILE SWIPE NAVIGATION

**Context:** Mobile users can swipe left/right to navigate between pages.

### Test on Mobile Device or Browser Mobile Mode

- [ ] **Enable Mobile View**
  - Open DevTools (F12) → Device Toggle (Ctrl+Shift+M)
  - Select a mobile device (e.g., iPhone 12, Pixel 5)
  - Or test on actual mobile device

- [ ] **Swipe Navigation Test**
  - Navigate to homepage
  - Swipe LEFT (toward left edge) 
  - **Expected:** Navigate to next page (About)
  - Swipe LEFT again → Should go to Group page
  - Continue swiping LEFT through all pages in order:
    - [ ] Home → About → Group → Platforms → Services
    - [ ] Leverage → Global Markets
    - [ ] Local Stocks → Multi-Currency → International Equities → Offshore Funds
    - [ ] Research → Downloads → Exchange Rates → IPO → FAQ → Contact

- [ ] **Reverse Swipe Test**
  - From any page, swipe RIGHT (toward right edge)
  - **Expected:** Navigate to previous page
  - Verify correct order in reverse

- [ ] **Page Indicator Dots**
  - Look at the bottom of the screen
  - Verify dots appear showing current page position
  - Verify dots auto-hide after 4 seconds of inactivity
  - Tap a dot → Verify navigation to that page

- [ ] **Edge Cases**
  - On homepage, swipe RIGHT → Should NOT navigate (already at first page)
  - On contact page, swipe LEFT → Should NOT navigate (already at last page)
  - Try vertical scrolling while swiping → Should prioritize scrolling over navigation

- [ ] **Visual Feedback**
  - While swiping, verify edge indicators appear:
    - Swipe left → Blue bar appears on right edge
    - Swipe right → Blue bar appears on left edge
  - Verify bar grows as you swipe further

---

## 📱 SECTION 11: RESPONSIVE DESIGN CHECK

Test at these breakpoints:

### Mobile (375px width)
- [ ] Homepage renders correctly
- [ ] All text is readable (no overflow)
- [ ] Images scale properly
- [ ] Navigation menu works
- [ ] Forms are usable

### Tablet (768px width)
- [ ] Layout adjusts appropriately
- [ ] Sidebar behavior is correct (hidden/overlay)
- [ ] All features accessible

### Desktop (1920px width)
- [ ] Full sidebar visible
- [ ] Content centered properly
- [ ] No horizontal scrollbars

---

## 🔐 SECTION 13: RBAC (ROLE-BASED ACCESS CONTROL)

**Context:** Super Admins can now create custom roles with granular permissions.

### Super Admin Only Features

- [ ] **Login as Super Admin**
  - Use credentials: `sk@horizonafrica.com` / `Admin@2026`
  - Verify successful login

- [ ] **Verify Super Admin Sidebar Access**
  - In admin sidebar, verify "Users" link is visible
  - Verify "Roles" link is visible
  - **Note:** Regular admins should NOT see these links

- [ ] **Role Management Page**
  - Click "Roles" in sidebar
  - Verify page loads at `/admin/settings/roles`
  - Verify 3 system roles are displayed:
    - [ ] Super Admin (SYSTEM badge)
    - [ ] Admin (SYSTEM badge)
    - [ ] Viewer (SYSTEM badge)
  - Verify each card shows:
    - Role name
    - Description
    - Permission count
    - User count

- [ ] **Create Custom Role**
  - Click "Create Role" button
  - Modal should open
  - Enter role name: "Test Role"
  - Enter description: "Testing permissions"
  - **Permission Matrix:**
    - [ ] Verify permissions are organized by category (Research, Documents, Contacts, etc.)
    - [ ] Check 2-3 permissions (e.g., research.view, contacts.view)
    - [ ] Click "Select All" on one category → All permissions in that category selected
    - [ ] Click "Select All" again → All deselected
    - [ ] Verify permission counter updates (e.g., "3 selected")
  - Click "Create Role"
  - Verify success message
  - Verify new role appears in the list
  - Verify role has [CUSTOM] badge (not SYSTEM)

- [ ] **Edit Custom Role**
  - Click Edit icon on the custom role you created
  - Verify modal opens with pre-populated data
  - Change permissions (add/remove some)
  - Click "Update Role"
  - Verify success message
  - Verify permissions were updated

- [ ] **Try to Edit System Role**
  - Click Edit icon on "Super Admin" role
  - **Expected:** Name and description fields should be DISABLED
  - **Expected:** Permission checkboxes should be DISABLED
  - **Expected:** Save button should be DISABLED or show warning
  - System roles cannot be modified

- [ ] **Delete Custom Role**
  - Click Delete icon on your test role
  - Verify confirmation dialog appears
  - Confirm deletion
  - Verify role is removed from list

- [ ] **Try to Delete System Role**
  - Click Delete icon on "Admin" role
  - **Expected:** Should show error "Cannot delete system roles"
  - System roles have no delete button OR button is disabled

### Permission Persistence Test

- [ ] **Logout and Login**
  - Logout from admin panel
  - Login again as super admin
  - Navigate to Roles page
  - Verify all custom roles you created are still there

### Console Error Check

- [ ] **No JavaScript Errors**
  - While testing role management, keep DevTools console open
  - Verify NO red errors appear
  - API calls to `/api/admin/roles` should return 200 OK

---

## ✅ SECTION 14: FINAL VERIFICATION

- [ ] **Clean Build Test**
  - Stop development server
  - Run: `npm run build`
  - Verify build completes without errors
  - Run: `npm run start`
  - Test critical paths again (login, homepage, admin dashboard)

- [ ] **Browser Compatibility** (if time permits)
  - [ ] Chrome - All features work
  - [ ] Firefox - All features work
  - [ ] Safari - All features work
  - [ ] Edge - All features work

---

## 📝 BUG REPORT TEMPLATE

If you find issues, use this format:

```
**Bug Title:** [Brief description]
**Severity:** [ ] Critical [ ] High [ ] Medium [ ] Low
**Page/Component:** [Where did it occur?]
**Steps to Reproduce:**
1. 
2. 
3. 
**Expected Behavior:** 
**Actual Behavior:** 
**Screenshot:** [Attach if visual bug]
**Console Errors:** [Copy/paste if any]
**Browser:** [Chrome/Firefox/Safari] Version: 
**Screen Size:** [Desktop/Mobile/Tablet]
```

---

## ✍️ SIGN-OFF

I have completed the QA validation checklist and confirm:

- [ ] All critical functionality is working as expected
- [ ] All UI/UX changes have been verified
- [ ] No critical bugs were found (or bugs are documented)
- [ ] Application is ready for deployment

**Tester Signature:** ___________________________  
**Date:** ___________________________  

**Notes/Comments:**
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
