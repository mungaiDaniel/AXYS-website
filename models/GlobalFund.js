// File: models/GlobalFund.js
import mongoose from 'mongoose';

const GlobalFundSchema = new mongoose.Schema(
  {
    fundName: {
      type: String,
      required: true,
      trim: true,
    },
    shortName: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      required: true,
    },
    performanceBoxes: {
      type: [
        {
          label: {
            type: String,
            required: true,
          },
          value: {
            type: String,
            required: true,
          },
        }
      ],
      default: [],
    },
    documents: {
      type: [
        {
          name: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
          uploadedAt: {
            type: Date,
            default: Date.now,
          },
        }
      ],
      default: [],
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: String,
      default: '',
    },
    lastModifiedBy: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
GlobalFundSchema.index({ isVisible: 1, displayOrder: 1 });

export default mongoose.models.GlobalFund || mongoose.model('GlobalFund', GlobalFundSchema);