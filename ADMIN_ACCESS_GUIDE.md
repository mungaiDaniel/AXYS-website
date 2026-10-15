# 🔐 AIB-AXYS Admin Portal - Quick Access Guide

## Admin Portal Access

**Live Admin URL**: https://toggle-nav.preview.emergentagent.com/admin/login

### Login Credentials:
- **Email**: sk@horizonafrica.com
- **Password**: Admin@2026

---

## Admin Portal URLs

### Main Admin Pages:

1. **Login**: 
   - https://toggle-nav.preview.emergentagent.com/admin/login

2. **Dashboard**: 
   - https://toggle-nav.preview.emergentagent.com/admin/dashboard

3. **Contact Submissions**: 
   - https://toggle-nav.preview.emergentagent.com/admin/contacts

4. **Research Papers**: 
   - https://toggle-nav.preview.emergentagent.com/admin/research

5. **IPO Settings**: 
   - https://toggle-nav.preview.emergentagent.com/admin/ipo-settings

6. **Page Visibility**: 
   - https://toggle-nav.preview.emergentagent.com/admin/pages

7. **Email Settings**: 
   - https://toggle-nav.preview.emergentagent.com/admin/settings

---

## How to Login

### Step 1: Open Admin Portal
Go to: **https://toggle-nav.preview.emergentagent.com/admin/login**

### Step 2: Enter Credentials
- Email: **sk@horizonafrica.com**
- Password: **Admin@2026**

### Step 3: Click "Sign In"
You'll be redirected to the dashboard

---

## Troubleshooting

### If Login Page Doesn't Load:
1. Check that the main website works: https://toggle-nav.preview.emergentagent.com
2. Try refreshing the page (Ctrl+F5 or Cmd+Shift+R)
3. Clear browser cache and try again
4. Check server is running: `sudo supervisorctl status nextjs`

### If Login Fails:
1. Double-check email: sk@horizonafrica.com
2. Double-check password: Admin@2026
3. Check MongoDB is running: `sudo supervisorctl status mongodb`
4. Check server logs: `tail -50 /var/log/supervisor/nextjs.out.log`

### If Can't Access Admin Pages After Login:
1. Make sure cookies are enabled in your browser
2. Try using incognito/private browsing mode
3. Check browser console for errors (F12)

---

## What You Can Do in Admin Panel

### 📧 Manage Contact Submissions
- View all form submissions
- Filter by status or subject
- Mark as read/responded
- Export to CSV
- Delete submissions

### 📄 Upload Research Papers
- Upload PDF files
- Add title, description, category
- Tag research papers
- View download statistics
- Delete papers

### ⏱️ Manage IPO Settings
- Change countdown timer date/time
- Update "Apply Now" button link
- Enable/disable IPO display
- Edit IPO name

### 👁️ Control Page Visibility
- Toggle any page on/off
- Control navigation display
- **Research page currently HIDDEN**
- Toggle ON to show in navigation

### 📬 Configure Email (Outlook)
- Add SMTP host and port
- Enter Outlook email and password
- Save configuration
- Restart server to activate

---

## 🎯 Quick Start

1. **Go to**: https://toggle-nav.preview.emergentagent.com/admin/login
2. **Login** with sk@horizonafrica.com / Admin@2026
3. **Explore** the dashboard and admin features!

---

## 🔒 Security Notes

- Admin portal is password protected
- JWT tokens expire after 7 days
- Cookies are HTTP-only (secure)
- Only authorized admins can access

---

**Your Admin Portal is Live and Ready!** 🎊

If you're still having issues accessing it, please let me know what error you see!
