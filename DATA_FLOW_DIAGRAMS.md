# AIB-AXYS AFRICA - DATA FLOW DIAGRAMS (Mermaid)

## Complete System Architecture

```mermaid
graph TB
    subgraph Users
        PU[Public Users]
        AU[Admin Users]
    end

    subgraph Frontend
        PF[Public Pages<br/>Home, About, Services, etc.]
        AF[Admin Pages<br/>Dashboard, Contacts, etc.]
    end

    subgraph API_Layer[API Routes]
        PA[Public APIs<br/>contact, research, exchange-rates]
        AUTH[Auth APIs<br/>login, logout, me]
        ADMIN[Admin APIs<br/>Protected Routes]
    end

    subgraph Middleware
        JWT[JWT Verification<br/>lib/auth.js]
        DB[MongoDB Connection<br/>lib/mongodb.js]
    end

    subgraph Database[MongoDB]
        CONTACTS[contacts]
        ADMINS[admins]
        RESEARCH[researchpapers]
        RATES[exchangerates]
        CONSENTS[consents]
        AUDIT[auditlogs]
        IPO[iposettings]
        PAGES[pagesettings]
        EMAIL[emailsettings]
    end

    PU --> PF
    AU --> AF
    PF --> PA
    AF --> AUTH
    AF --> ADMIN
    
    PA --> DB
    AUTH --> DB
    AUTH --> JWT
    ADMIN --> JWT
    ADMIN --> DB
    
    DB --> CONTACTS
    DB --> ADMINS
    DB --> RESEARCH
    DB --> RATES
    DB --> CONSENTS
    DB --> AUDIT
    DB --> IPO
    DB --> PAGES
    DB --> EMAIL
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant Admin
    participant LoginPage as /admin/login
    participant AuthAPI as /api/auth/login
    participant MongoDB
    participant Dashboard as /admin/dashboard

    Admin->>LoginPage: Enter email & password
    LoginPage->>AuthAPI: POST { email, password }
    AuthAPI->>MongoDB: Find admin by email
    MongoDB-->>AuthAPI: Return admin record
    AuthAPI->>AuthAPI: bcrypt.compare(password, hash)
    alt Password Valid
        AuthAPI->>AuthAPI: jwt.sign({ id, email, role })
        AuthAPI->>Admin: Set-Cookie: admin-token=JWT
        AuthAPI-->>LoginPage: 200 OK
        LoginPage->>Dashboard: Redirect
    else Password Invalid
        AuthAPI-->>LoginPage: 401 Unauthorized
        LoginPage->>Admin: Show error
    end
```

## Contact Form Submission Flow

```mermaid
sequenceDiagram
    participant User
    participant ContactForm as /contact
    participant ContactAPI as /api/contact
    participant MongoDB
    participant AdminPanel as Admin Dashboard

    User->>ContactForm: Fill form (name, email, phone, message)
    ContactForm->>ContactAPI: POST /api/contact
    ContactAPI->>ContactAPI: Validate input
    ContactAPI->>MongoDB: Create new Contact document
    MongoDB-->>ContactAPI: Document saved
    ContactAPI->>ContactAPI: [Optional] Send email notification
    ContactAPI-->>ContactForm: 200 Success
    ContactForm->>User: Show success message
    
    Note over AdminPanel: Admin can view in /admin/contacts
    AdminPanel->>MongoDB: Query contacts
    MongoDB-->>AdminPanel: Return all submissions
```

## Protected Admin Request Flow

```mermaid
sequenceDiagram
    participant Admin
    participant AdminPage as /admin/contacts
    participant AdminAPI as /api/admin/contacts
    participant AuthLib as lib/auth.js
    participant MongoDB

    Admin->>AdminPage: Click "Contacts"
    AdminPage->>AdminAPI: GET /api/admin/contacts<br/>(Cookie: admin-token)
    
    AdminAPI->>AuthLib: verifyAdminRequest(request)
    AuthLib->>AuthLib: Extract token from cookie
    AuthLib->>AuthLib: jwt.verify(token, JWT_SECRET)
    
    alt Token Valid
        AuthLib-->>AdminAPI: Return admin data
        AdminAPI->>MongoDB: Contact.find()
        MongoDB-->>AdminAPI: Return contacts
        AdminAPI-->>AdminPage: 200 { contacts: [...] }
        AdminPage->>Admin: Display contacts table
    else Token Invalid/Expired
        AuthLib-->>AdminAPI: Return null
        AdminAPI-->>AdminPage: 401 Unauthorized
        AdminPage->>Admin: Redirect to /admin/login
    end
```

## Exchange Rate Update Flow

```mermaid
sequenceDiagram
    participant Admin
    participant ExchangePage as /admin/exchange-rates
    participant ExchangeAPI as /api/admin/exchange-rates
    participant MongoDB
    participant PublicPage as /exchange-rates (Public)

    Admin->>ExchangePage: Enter USD rate: 165.5
    Admin->>ExchangePage: Set expiry: Jan 27, 3:25 PM
    Admin->>ExchangePage: Click "Update USD Rate"
    
    ExchangePage->>ExchangeAPI: POST { currency: USD, rate: 165.5, expiryDate }
    ExchangeAPI->>ExchangeAPI: verifyAdminRequest() ✅
    ExchangeAPI->>MongoDB: ExchangeRate.findOneAndUpdate(<br/>{ currency: USD },<br/>{ rate, expiryDate, lastUpdatedBy },<br/>{ upsert: true })
    MongoDB-->>ExchangeAPI: Updated document
    ExchangeAPI-->>ExchangePage: 200 Success
    ExchangePage->>Admin: Show "Rate updated!"
    
    Note over PublicPage: Public users see updated rate
    PublicPage->>ExchangeAPI: GET /api/exchange-rates
    ExchangeAPI->>MongoDB: ExchangeRate.find({ isActive: true })
    MongoDB-->>ExchangeAPI: Return active rates
    ExchangeAPI-->>PublicPage: { rates: [USD: 165.5, ...] }
    PublicPage->>PublicPage: Display in converter
```

## GDPR Data Request Flow

```mermaid
sequenceDiagram
    participant User
    participant GDPRPage as GDPR Request Form
    participant GDPRAPI as /api/gdpr/user-data
    participant MongoDB
    participant User as User (Email)

    User->>GDPRPage: Request: "Access my data"
    User->>GDPRPage: Enter email
    GDPRPage->>GDPRAPI: POST { email, requestType: "access" }
    
    GDPRAPI->>MongoDB: Contact.find({ email })
    GDPRAPI->>MongoDB: Consent.find({ email })
    MongoDB-->>GDPRAPI: Return all user data
    
    GDPRAPI-->>GDPRPage: 200 { data: { contacts, consents } }
    GDPRPage->>User: Display/download personal data
    
    alt User requests deletion
        User->>GDPRPage: Request: "Delete my data"
        GDPRPage->>GDPRAPI: POST { email, requestType: "delete" }
        GDPRAPI->>MongoDB: Contact.deleteMany({ email })
        GDPRAPI->>MongoDB: Consent.deleteMany({ email })
        GDPRAPI->>MongoDB: AuditLog.create({ action: "deletion" })
        MongoDB-->>GDPRAPI: Deletion confirmed
        GDPRAPI-->>GDPRPage: 200 Success
        GDPRPage->>User: "Data deleted successfully"
    end
```

## Admin Contacts Export Flow

```mermaid
sequenceDiagram
    participant Admin
    participant ContactsPage as /admin/contacts
    participant Browser

    Admin->>ContactsPage: Select filters:<br/>- Date: "Last 7 Days"<br/>- Status: "New"
    ContactsPage->>ContactsPage: Filter contacts client-side
    
    Admin->>ContactsPage: Click "Export" → "Excel (.xlsx)"
    
    ContactsPage->>ContactsPage: exportToExcel()<br/>1. Prepare data array<br/>2. XLSX.utils.aoa_to_sheet()<br/>3. Auto-size columns<br/>4. Create workbook
    
    ContactsPage->>Browser: XLSX.writeFile()<br/>"contacts-week-[timestamp].xlsx"
    
    Browser->>Admin: Download Excel file
    
    Note over Admin: File contains:<br/>Name, Email, Phone, CDSC,<br/>Message, Status, Date
```

---

## Security Boundary Map

```mermaid
graph LR
    subgraph Public_Zone[Public Zone - No Auth]
        PU[Public Users]
        PF[Public Pages]
        PA[Public APIs]
    end
    
    subgraph Auth_Boundary[Authentication Boundary]
        LOGIN[/api/auth/login]
        JWT[JWT Verification]
    end
    
    subgraph Protected_Zone[Protected Zone - Auth Required]
        AP[Admin Pages]
        AA[Admin APIs]
        PII[PII Data Access]
        CRUD[Data Modification]
    end
    
    subgraph Database[Database Layer]
        DB[(MongoDB)]
    end
    
    PU --> PF
    PF --> PA
    PA --> DB
    
    PU --> LOGIN
    LOGIN --> JWT
    JWT --> Protected_Zone
    
    AP --> AA
    AA --> JWT
    AA --> PII
    AA --> CRUD
    PII --> DB
    CRUD --> DB
    
    style Auth_Boundary fill:#ff6b6b
    style Protected_Zone fill:#51cf66
    style Public_Zone fill:#4dabf7
```

---

**For full architectural details, see SECURITY_AUDIT_ARCHITECTURE.md**
