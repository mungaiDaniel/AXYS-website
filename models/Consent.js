import mongoose from 'mongoose';

const ConsentSchema = new mongoose.Schema(
  {
    contactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact',
    },
    email: {
      type: String,
      required: true,
    },
    consentType: {
      type: String,
      enum: ['marketing', 'data_processing', 'cookies'],
      required: true,
    },
    consentGiven: {
      type: Boolean,
      required: true,
    },
    consentDate: {
      type: Date,
      default: Date.now,
    },
    ipAddress: {
      type: String,
      default: '',
    },
    withdrawnDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Consent || mongoose.model('Consent', ConsentSchema);
