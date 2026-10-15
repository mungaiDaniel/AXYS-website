import mongoose from 'mongoose';

const DangoteRateCacheSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    rate: { type: Number, min: 0 },
    source: { type: String, default: 'live' },
    provider: { type: String },
    fetchedAt: { type: Date },
    lockUntil: { type: Date },
    nextRefreshAt: { type: Date },
  },
  { versionKey: false, collection: 'dangote_rate_cache' },
);

export default mongoose.models.DangoteRateCache || mongoose.model('DangoteRateCache', DangoteRateCacheSchema);
