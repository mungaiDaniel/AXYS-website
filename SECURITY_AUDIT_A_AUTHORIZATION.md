# SECURITY AUDIT A: DATA LEAK & AUTHORIZATION ANALYSIS
**Auditor Role:** Senior Penetration Tester  
**Date:** January 26, 2026  
**Focus:** Authorization Bypass, IDOR, RBAC, Data Leaks  

---

## EXECUTIVE SUMMARY

**Overall Risk:** 🔴 **HIGH**  
**Critical Issues:** 1  
**High Issues:** 1  
**Medium Issues:** 2  
**Low Issues:** 2  
**Total Vulnerabilities:** 6

**Immediate Action Required:** YES - Critical GDPR endpoint vulnerability.

---

## 🔴 CRITICAL VULNERABILITIES

### CRITICAL #1: IDOR + NO AUTH in GDPR Data Export

**File:** `/app/app/api/gdpr/user-data/route.js` (GET method)  
**Severity:** **CRITICAL** 🔴  
**CVSS Score:** 9.1 (Critical)  
**CWE:** CWE-639 (Authorization Bypass Through User-Controlled Key)

**Vulnerable Code:**
```javascript
// Line 12-45
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');  // ❌ USER-CONTROLLED
  
  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }
  
  await connectDB();
  
  // ❌ NO AUTHENTICATION OR VERIFICATION!
  const contacts = await Contact.find({ email }).select('-__v');
  const consents = await Consent.find({ email }).select('-__v');
  
  return NextResponse.json(userData, { status: 200 });  // ❌ RETURNS ALL DATA
}
```

**Attack Scenario:**
```bash
# Attacker can enumerate ANY email address
curl "https://your-site.com/api/gdpr/user-data?email=victim@example.com"
curl "https://your-site.com/api/gdpr/user-data?email=competitor@business.com"
curl "https://your-site.com/api/gdpr/user-data?email=sk@horizonafrica.com"

# Each returns FULL user data:
{
  "email": "victim@example.com",
  "contactSubmissions": [{
    "_id": "...",
    "name": "John Victim",
    "email": "victim@example.com",
    "phone": "+254712345678",
    "cdscNumber": "CDSC123456",
    "message": "I want to invest 5 million in...",
    "createdAt": "2026-01-25..."
  }],
  "consentRecords": [...]
}
```

**Impact:**
- **Mass Data Breach:** All customer PII accessible without authentication
- **GDPR Article 32 Violation:** Inadequate security measures
- **Regulatory Risk:** Fines up to €20M or 4% of annual turnover
- **Reputation Damage:** Complete loss of customer trust
- **Competitive Intelligence:** Competitors can see all client communications
- **Identity Theft Risk:** Exposed phone numbers, CDSC numbers, financial interests

**Exploitability:** **TRIVIAL**
- No authentication required
- No rate limiting on endpoint
- Scriptable mass extraction
- Can be automated to scrape entire database

**Recommended Fix (Email Verification Token):**
```javascript
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  
  if (!email || !token) {
    return NextResponse.json({ error: 'Email and verification token required' }, { status: 400 });
  }
  
  // Verify the token was sent to this email address
  const verifiedEmail = await verifyEmailVerificationToken(token);
  
  if (!verifiedEmail || verifiedEmail !== email) {
    return NextResponse.json({ error: 'Invalid or expired verification token' }, { status: 403 });
  }
  
  // Mark token as used (prevent replay)
  await markTokenAsUsed(token);
  
  // Log the access
  await AuditLog.create({
    action: 'GDPR_DATA_ACCESS',
    email,
    ipAddress: request.headers.get('x-forwarded-for'),
    userAgent: request.headers.get('user-agent'),
    timestamp: new Date(),
  });
  
  await connectDB();
  const contacts = await Contact.find({ email }).select('-__v');
  const consents = await Consent.find({ email }).select('-__v');
  
  return NextResponse.json({ email, contactSubmissions: contacts, consentRecords: consents }, { status: 200 });
}
```

**Workflow:**
1. User submits email for data request
2. System sends verification email with one-time token
3. User clicks link with token
4. Token is validated and marked as used
5. Data is returned

**Priority:** 🔴 **FIX BEFORE PRODUCTION - BLOCKER**

---

## 🟠 HIGH SEVERITY VULNERABILITIES

### HIGH #1: Missing Audit Logging on Critical Operations

**Files:** Multiple admin routes  
**Severity:** **HIGH** 🟠  
**CVSS Score:** 6.8 (Medium-High)  
**CWE:** CWE-778 (Insufficient Logging)

**Missing Audit Logs On:**

1. **Contact Deletion** (`/api/admin/contacts` DELETE)
   - WHO deleted
   - WHAT contact (ID, email, name)
   - WHEN deleted
   - IP address

2. **Research Paper Deletion** (`/api/admin/research` DELETE)
   - Paper title, category
   - Admin who deleted
   - Timestamp

3. **Exchange Rate Updates** (`/api/admin/exchange-rates` POST)
   - Previous rate vs new rate
   - Which admin made the change
   - Could affect public financial decisions

4. **Admin User Creation/Deletion** (`/api/admin/users`)
   - New admin created by whom
   - Deleted admin details
   - Role assignments

**Impact:**
- **No Forensics:** Cannot investigate security incidents
- **Insider Threats:** Malicious admin actions untracked
- **Compliance Failure:** Many regulations require audit trails
- **No Accountability:** Cannot prove who did what

**Recommended Implementation:**
```javascript
// After any critical operation
await AuditLog.create({
  adminEmail: adminData.email,
  action: 'CONTACT_DELETED',  // or 'EXCHANGE_RATE_UPDATED', etc.
  details: {
    contactId: id,
    contactEmail: contact.email,
    contactName: contact.name,
    previousRate: oldRate,  // for exchange rates
    newRate: rate,
  },
  ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
  userAgent: request.headers.get('user-agent'),
  timestamp: new Date(),
});
```

**Priority:** 🟠 **HIGH - Required for compliance**

---

## 🟡 MEDIUM SEVERITY VULNERABILITIES

### MEDIUM #1: No Rate Limiting on Public Research Download

**File:** `/app/app/api/research/download/route.js`  
**Severity:** **MEDIUM** 🟡  
**CVSS Score:** 5.3 (Medium)

**Issue:**
```javascript
export async function GET(request) {
  // ❌ NO RATE LIMITING
  const id = searchParams.get('id');
  await ResearchPaper.findByIdAndUpdate(id, { $inc: { downloadCount: 1 } });
  return NextResponse.json({ success: true }, { status: 200 });
}
```

**Attack:**
- Attacker can spam downloads
- Inflate download counters artificially
- DoS attack on database
- Resource exhaustion

**Recommended Fix:**
```javascript
import { rateLimit } from '@/lib/security';

export async function GET(request) {
  const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
  
  // Rate limit: 10 downloads per minute per IP
  const rateCheck = rateLimit(ipAddress, 10, 60000);
  if (!rateCheck.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  
  // Continue...
}
```

**Priority:** 🟡 **MEDIUM**

---

### MEDIUM #2: PATCH Routes Don't Validate ID Ownership

**Files:** `/api/admin/contacts` (PATCH), `/api/admin/research` (PATCH)  
**Severity:** **MEDIUM** 🟡  
**CVSS Score:** 5.8 (Medium)

**Issue:**
Routes validate admin authentication but don't validate if the resource exists before updating:

```javascript
// /api/admin/contacts/route.js - Line 52
const contact = await Contact.findByIdAndUpdate(id, updateData, { new: true });

if (!contact) {  // ✅ Checks if found
  return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
}
```

**This is actually SECURE** ✅ - MongoDB returns null if ID doesn't exist, and code checks for it.

**However, improvement:**
Add validation that the ID format is valid before querying:

```javascript
if (!mongoose.Types.ObjectId.isValid(id)) {
  return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
}
```

**Priority:** 🟡 **MEDIUM - Code quality improvement**

---

## 🟢 LOW SEVERITY / INFORMATIONAL

### LOW #1: Password Hash Properly Protected

**File:** `/app/app/api/auth/me/route.js`  
**Status:** ✅ **SECURE**

**Code Review:**
```javascript
const admin = await Admin.findById(adminData.id).select('-password');  // ✅ EXCLUDES PASSWORD

return NextResponse.json({
  admin: {
    id: admin._id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
    // ✅ Password NOT included
  },
}, { status: 200 });
```

**Finding:** ✅ Password hashes are properly excluded from API responses.

---

### LOW #2: Admin User Management Has Proper RBAC

**File:** `/app/app/api/admin/users/route.js`  
**Status:** ✅ **SECURE**

**Code Review:**
```javascript
export async function GET(request) {
  const adminData = verifyAdminRequest(request);
  if (!adminData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // ✅ PROPER RBAC CHECK
  if (adminData.role !== 'super-admin') {
    return NextResponse.json({ error: 'Forbidden - Super admin only' }, { status: 403 });
  }
  
  // Continue...
}
```

**Finding:** ✅ User management routes properly restrict to super-admin role.

---

## IDOR ANALYSIS RESULTS

### ✅ SECURE: ID-Based Routes Properly Protected

**Routes Analyzed:**

1. **`/api/admin/contacts` (PATCH, DELETE)**
   - ✅ Requires admin authentication
   - ✅ Uses MongoDB findByIdAndUpdate/findByIdAndDelete
   - ✅ Returns 404 if not found
   - ⚠️ Missing audit logging (but not IDOR)

2. **`/api/admin/research` (PATCH, DELETE)**
   - ✅ Requires admin authentication
   - ✅ Validates ID existence
   - ✅ No user-specific data (admin resources only)

3. **`/api/admin/exchange-rates` (POST)**
   - ✅ Requires admin authentication
   - ✅ Uses currency as unique key (not user-controllable ID)
   - ✅ Upsert pattern prevents IDOR

**Conclusion:** No IDOR vulnerabilities in admin routes (proper auth gates). However, GDPR endpoint is WIDE OPEN.

---

## RBAC ANALYSIS RESULTS

### ✅ GOOD: Some Routes Have Proper RBAC

**Properly Protected (Super-Admin Only):**
- `/api/admin/users` GET/POST/DELETE/PATCH ✅
  - All methods check `adminData.role !== 'super-admin'`
  - Prevents regular admins from user management

### ⚠️ MISSING: Other Routes Don't Check Roles

**No RBAC Enforcement:**
- `/api/admin/contacts` - Any admin can delete ALL contacts
- `/api/admin/research` - Any admin can delete ALL research
- `/api/admin/exchange-rates` - Any admin can modify public rates
- `/api/admin/settings` - Any admin can change system config
- `/api/admin/email-settings` - Any admin can access email credentials

**Recommendation:**
Implement least-privilege access:
- **super-admin:** Full access
- **admin:** Read-only or limited write access
- Sensitive operations require super-admin

---

## SENSITIVE DATA LEAKAGE ANALYSIS

### ✅ GOOD: Password Hashes Never Exposed

**All Auth Routes Properly Filter:**
```javascript
// /api/auth/me/route.js
const admin = await Admin.findById(adminData.id).select('-password');  // ✅

// /api/auth/login/route.js
admin: {
  id: admin._id,
  email: admin.email,
  name: admin.name,
  role: admin.role,
  // ✅ password NOT included
}

// /api/admin/users/route.js
const users = await Admin.find().select('-password');  // ✅
```

**Finding:** ✅ No password hash leakage detected.

### ⚠️ CONCERN: Full Contact Objects Returned

**File:** `/api/admin/contacts/route.js`  
**Issue:** Returns full MongoDB documents including internal IDs

**Current:**
```javascript
const contacts = await Contact.find(query).sort({ createdAt: -1 }).limit(100);
return NextResponse.json({ contacts }, { status: 200 });
```

**Recommendation:**
Select only necessary fields:
```javascript
const contacts = await Contact.find(query)
  .select('-__v -notes')  // Exclude internal fields
  .sort({ createdAt: -1 })
  .limit(100);
```

---

## AUTHORIZATION SUMMARY

| Endpoint | Auth Required | RBAC | IDOR Protected | Data Filtering | Audit Logged |
|----------|---------------|------|----------------|----------------|-------------|
| `/api/contact` | ❌ Public | N/A | N/A | ✅ | ❌ |
| `/api/research` | ❌ Public | N/A | N/A | ✅ | ❌ |
| `/api/exchange-rates` | ❌ Public | N/A | N/A | ✅ | ❌ |
| `/api/gdpr/user-data` GET | ❌ **CRITICAL** | ❌ | ❌ | ❌ | ❌ |
| `/api/gdpr/user-data` DELETE | ✅ Admin | ⚠️ No role check | ✅ | ✅ | ❌ |
| `/api/auth/login` | ❌ Public | N/A | N/A | ✅ | ❌ |
| `/api/auth/me` | ✅ Admin | ✅ | ✅ | ✅ | ❌ |
| `/api/admin/dashboard` | ✅ Admin | ❌ | ✅ | ✅ | ❌ |
| `/api/admin/contacts` | ✅ Admin | ❌ | ✅ | ⚠️ | ❌ |
| `/api/admin/research` | ✅ Admin | ❌ | ✅ | ✅ | ❌ |
| `/api/admin/exchange-rates` | ✅ Admin | ❌ | ✅ | ✅ | ❌ |
| `/api/admin/users` | ✅ Admin | ✅ Super-Admin | ✅ | ✅ | ❌ |
| `/api/admin/ipo-settings` | ✅ Admin | ❌ | ✅ | ✅ | ❌ |
| `/api/admin/page-settings` | ✅ Admin | ❌ | ✅ | ✅ | ❌ |
| `/api/admin/email-settings` | ✅ Admin | ❌ | ✅ | ⚠️ | ❌ |

---

## PRIORITY FIXES

### 🔴 IMMEDIATE (Before Production)
1. **Fix GDPR endpoint** - Add email verification token system
2. **Add rate limiting** - Implement on all public endpoints

### 🟠 HIGH (Within 1 Week)
3. **Implement audit logging** - Track all sensitive operations
4. **Add RBAC to admin routes** - Enforce super-admin for critical ops

### 🟡 MEDIUM (Within 1 Month)
5. **Add ID format validation** - Prevent invalid MongoDB ID queries
6. **Review data filtering** - Ensure minimal data exposure

---

## SECURITY STRENGTHS ✅

1. ✅ **Password Security:** bcrypt with 10 rounds
2. ✅ **JWT Implementation:** Proper token generation and verification
3. ✅ **HTTP-Only Cookies:** XSS protection
4. ✅ **Password Filtering:** Never exposed in API responses
5. ✅ **Admin Auth:** Consistently applied to protected routes
6. ✅ **Super-Admin Enforcement:** User management properly restricted
7. ✅ **Contact Form:** Has rate limiting and input sanitization

---

**CONCLUSION:** System has good baseline security BUT CRITICAL GDPR endpoint must be fixed before production deployment.