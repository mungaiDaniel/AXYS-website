import connectDB from './mongodb';
import AuditLog from '@/models/AuditLog';

/**
 * Create an audit log entry
 */
export async function createAuditLog({
  adminId,
  adminEmail,
  action,
  resourceType = '',
  resourceId = '',
  details = {},
  ipAddress = '',
  userAgent = '',
}) {
  try {
    await connectDB();

    const log = await AuditLog.create({
      adminId,
      adminEmail,
      action,
      resourceType,
      resourceId,
      details,
      ipAddress,
      userAgent,
    });

    console.log(`📝 Audit log created: ${action} by ${adminEmail}`);
    return log;
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // Don't throw - audit logging shouldn't break the main flow
    return null;
  }
}

/**
 * Get audit logs with pagination
 */
export async function getAuditLogs({ limit = 50, skip = 0, adminId, action }) {
  try {
    await connectDB();

    const query = {};
    if (adminId) query.adminId = adminId;
    if (action) query.action = action;

    const logs = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await AuditLog.countDocuments(query);

    return { logs, total };
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    return { logs: [], total: 0 };
  }
}

/**
 * Get IP address from request
 */
export function getIpAddress(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 
             request.headers.get('x-real-ip') || 
             'unknown';
  return ip;
}

/**
 * Get user agent from request
 */
export function getUserAgent(request) {
  return request.headers.get('user-agent') || 'unknown';
}
