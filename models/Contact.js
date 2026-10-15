// File: models/Contact.js
import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
      enum: ['account-opening', 'ipo', 'dangote-ipo', 'funding-issues', 'password-reset', 'dormant-account', 'general', 'offshore'],
    },
    message: {
      type: String,
      required: true,
    },
    hasCDSC: {
      type: String,
      enum: ['yes', 'no', ''],
      default: '',
    },
    cdscNumber: {
      type: String,
      default: '',
    },
    referralSource: {
      type: String,
      required: false,
      default: '',
    },
    status: {
      type: String,
      enum: ['new', 'read', 'responded'],
      default: 'new',
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema);