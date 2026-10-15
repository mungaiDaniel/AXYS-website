import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: true,
      enum: [
        'terms-and-conditions',
        'audited-financial-reports',
        'unaudited-financial-reports',
        'application-forms',
        'press-releases',
        'news',
        'fees-and-tariffs',
        'compliance-documents',
        // Used for documents attached to Global Funds
        'global-funds',
        'other',
      ],
    },
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    fileType: {
      type: String,
      default: 'application/pdf',
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    publishedDate: {
      type: Date,
      default: Date.now,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    uploadedBy: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Document || mongoose.model('Document', DocumentSchema);
