import mongoose from 'mongoose';

const ExchangeRateSchema = new mongoose.Schema(
  {
    currency: {
      type: String,
      required: true,
      enum: ['USD', 'EUR', 'GBP'],
      unique: true,
    },
    rate: {
      type: Number,
      required: true,
      min: 0,
    },
    buyRate: {
      type: Number,
      min: 0,
      default: 0,
    },
    sellRate: {
      type: Number,
      min: 0,
      default: 0,
    },
    buyExpiryDate: {
      type: Date,
    },
    sellExpiryDate: {
      type: Date,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    showOnPublic: {
      type: Boolean,
      default: true,
    },
    comingSoon: {
      type: Boolean,
      default: false,
    },
    lastUpdatedBy: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ExchangeRate || mongoose.model('ExchangeRate', ExchangeRateSchema);
