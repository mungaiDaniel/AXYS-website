import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
    adminEmail: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'login',
        'logout',
        'contact_view',
        'contact_update',
        'contact_delete',
        'contact_export',
        'research_upload',
        'research_edit',
        'research_delete',
        'documents_upload',
        'documents_edit',
        'documents_delete',
        'global_funds_create',
        'global_funds_update',
        'global_funds_delete',
        'ipo_settings_update',
        'page_visibility_update',
        'email_settings_update',
        'user_create',
        'user_update',
        'user_delete',
        'exchange_rate_update',
      ],
    },
    resourceType: {
      type: String,
      default: '',
    },
    resourceId: {
      type: String,
      default: '',
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
AuditLogSchema.index({ adminId: 1, createdAt: -1 });
AuditLogSchema.index({ action: 1, createdAt: -1 });

export default mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
