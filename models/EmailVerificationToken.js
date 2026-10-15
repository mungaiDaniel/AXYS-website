import mongoose from 'mongoose';

const EmailVerificationTokenSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    purpose: {
      type: String,
      enum: ['gdpr_access', 'gdpr_delete', 'email_verify'],
      required: true,
    },
    used: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for automatic cleanup of expired tokens
EmailVerificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.EmailVerificationToken || 
  mongoose.model('EmailVerificationToken', EmailVerificationTokenSchema);
