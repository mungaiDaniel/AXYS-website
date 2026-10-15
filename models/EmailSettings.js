import mongoose from 'mongoose';

const EmailSettingsSchema = new mongoose.Schema(
  {
    host: {
      type: String,
      default: 'smtp.office365.com',
    },
    port: {
      type: Number,
      default: 587,
    },
    user: {
      type: String,
      default: '',
    },
    password: {
      type: String,
      default: '',
    },
    fromEmail: {
      type: String,
      default: 'info@axysinvestmentbank.com',
    },
    isConfigured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.EmailSettings || mongoose.model('EmailSettings', EmailSettingsSchema);
