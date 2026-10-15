import mongoose from 'mongoose';

const PageSettingsSchema = new mongoose.Schema(
  {
    pageName: {
      type: String,
      required: true,
      unique: true,
    },
    isAccessible: {
      type: Boolean,
      default: true,
    },
    showInNav: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.PageSettings || mongoose.model('PageSettings', PageSettingsSchema);
