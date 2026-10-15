import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required. Please set it in .env file.');
}

/**
 * Hash password
 */
export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

/**
 * Compare password with hash
 */
export async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

/**
 * Generate JWT token
 */
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify JWT token
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Get token from request cookies
 */
export function getTokenFromRequest(request) {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {});

  return cookies['admin-token'] || null;
}

/**
 * Verify admin from request
 */
export function verifyAdminRequest(request) {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  
  return verifyToken(token);
}

/**
 * Verify admin and populate role permissions
 * Returns admin data with permissions array
 */
export async function verifyAdminWithPermissions(request) {
  const adminData = verifyAdminRequest(request);
  if (!adminData) return null;

  // If permissions already in token, return
  if (adminData.permissions) return adminData;

  // Fetch role and permissions from database
  try {
    const Admin = (await import('@/models/Admin')).default;
    const admin = await Admin.findById(adminData.id).populate('role');
    
    if (!admin || !admin.isActive || !admin.role) return null;

    return {
      ...adminData,
      roleName: admin.role.name,
      roleSlug: admin.role.slug,
      permissions: admin.role.permissions,
      isSystem: admin.role.isSystem,
    };
  } catch (error) {
    console.error('Error fetching admin permissions:', error);
    return null;
  }
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(adminData, permission) {
  if (!adminData || !adminData.permissions) return false;
  return adminData.permissions.includes(permission);
}

/**
 * Check if user is Super Admin
 */
export function isSuperAdmin(adminData) {
  if (!adminData) return false;
  // Normalise any existing slug or role identifier:
  // - treat both "super-admin" and "super_admin" as Super Admin
  // - fall back to role.name when available
  const rawSlug =
    adminData.roleSlug ||
    (typeof adminData.role === 'string' ? adminData.role : adminData.role?.slug);

  const normalizedSlug = rawSlug
    ? rawSlug.toLowerCase().replace(/[_\s]+/g, '-')
    : null;

  if (normalizedSlug === 'super-admin') {
    return true;
  }

  const roleName =
    typeof adminData.role === 'object' && adminData.role
      ? adminData.role.name
      : adminData.roleName;

  return roleName === 'Super Admin';
}

/**
 * Require specific permission (throws error if not authorized)
 */
export async function requirePermission(request, permission) {
  const adminData = await verifyAdminWithPermissions(request);
  
  if (!adminData) {
    throw new Error('Unauthorized');
  }

  if (!hasPermission(adminData, permission)) {
    throw new Error(`Forbidden: Missing permission '${permission}'`);
  }

  return adminData;
}

/**
 * Require Super Admin role (throws error if not super admin)
 */
export async function requireSuperAdmin(request) {
  const adminData = await verifyAdminWithPermissions(request);
  
  if (!adminData) {
    throw new Error('Unauthorized');
  }

  if (!isSuperAdmin(adminData)) {
    throw new Error('Forbidden: Super Admin access required');
  }

  return adminData;
}


/**
 * Generate email verification token
 */
export function generateEmailVerificationToken() {
  const crypto = require('crypto');
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Create email verification token record
 */
export async function createEmailVerificationToken(email, purpose = 'gdpr_access', expiryMinutes = 60) {
  const EmailVerificationToken = (await import('@/models/EmailVerificationToken')).default;
  const token = generateEmailVerificationToken();
  
  await EmailVerificationToken.create({
    email: email.toLowerCase(),
    token,
    purpose,
    expiresAt: new Date(Date.now() + expiryMinutes * 60 * 1000),
    used: false,
  });
  
  return token;
}

/**
 * Verify email verification token
 */
export async function verifyEmailVerificationToken(token, purpose = 'gdpr_access') {
  const EmailVerificationToken = (await import('@/models/EmailVerificationToken')).default;
  
  const tokenRecord = await EmailVerificationToken.findOne({
    token,
    purpose,
    used: false,
    expiresAt: { $gt: new Date() },
  });
  
  if (!tokenRecord) {
    return null;
  }
  
  // Mark as used
  tokenRecord.used = true;
  await tokenRecord.save();
  
  return tokenRecord.email;
}

