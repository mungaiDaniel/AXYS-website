import mongoose from 'mongoose';

const ResearchPaperSchema = new mongoose.Schema(
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
      enum: [
        'price-list', 
        'daily-briefs', 
        'weekly-note', 
        'company-specific-reports', 
        'fixed-income-notes', 
        'stock-recommendations', 
        'quarterly-reports', 
        'topical-reports', 
        'bespoke-reports',
        'market-analysis', 
        'ipo-analysis', 
        'sector-reports', 
        'information-memorandums', 
        'company', 
        'other'
      ],
      default: 'other',
    },
    company: {
      type: String,
      default: '',
    },
    sector: {
      type: String,
      default: '',
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
    publishedDate: {
      type: Date,
      default: Date.now,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ResearchPaper || mongoose.model('ResearchPaper', ResearchPaperSchema);
