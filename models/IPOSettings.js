import mongoose from 'mongoose';

const IPOSettingsSchema = new mongoose.Schema(
  {
    // Which IPO this record configures — one document per IPO page.
    slug: {
      type: String,
      enum: ['quickmart', 'dangote'],
      unique: true,
      sparse: true,
    },
    name: {
      type: String,
      required: true,
      default: 'Quick Mart PLC IPO',
    },
    targetDate: {
      type: Date,
      required: true,
      default: () => new Date('2026-10-30T17:00:00+03:00'),
    },
    applyNowLink: {
      type: String,
      default: 'https://quickmartipo.e-offer.app/',
    },
    applicationFormLink: {
      type: String,
      default: 'https://quickmartipo.e-offer.app/',
    },
    videoUrl: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      default: 'Quick Mart PLC IPO',
    },
  },
  {
    timestamps: true,
  }
);

// In dev, hot reload keeps an older compiled model around; rebuild it if it predates the slug field.
if (mongoose.models.IPOSettings && !mongoose.models.IPOSettings.schema.path('slug')) {
  mongoose.deleteModel('IPOSettings');
}

export default mongoose.models.IPOSettings || mongoose.model('IPOSettings', IPOSettingsSchema);
