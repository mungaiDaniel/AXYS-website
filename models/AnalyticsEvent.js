// File: models/AnalyticsEvent.js
import mongoose from 'mongoose';

const AnalyticsEventSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      required: true,
      enum: [
        'page_view',
        'button_click',
        'form_submit',
        'link_click',
        'download',
        'video_play',
        'scroll_depth',
        'session_start',
        'session_end',
        'custom',
      ],
      index: true,
    },
    pageUrl: {
      type: String,
      required: true,
      index: true,
    },
    elementId: {
      type: String,
      default: '',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
      // Index removed - using compound indexes and TTL index below
    },
    sessionId: {
      type: String,
      default: '',
      index: true,
    },
    userId: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
    ipAddress: {
      type: String,
      default: '',
    },
    referrer: {
      type: String,
      default: '',
    },
    deviceType: {
      type: String,
      enum: ['mobile', 'tablet', 'desktop', 'unknown'],
      default: 'unknown',
    },
  },
  {
    timestamps: false,
  }
);

// Compound index for efficient queries
AnalyticsEventSchema.index({ eventType: 1, timestamp: -1 });
AnalyticsEventSchema.index({ pageUrl: 1, timestamp: -1 });
AnalyticsEventSchema.index({ sessionId: 1, timestamp: 1 });

// TTL index - automatically delete events older than 90 days
AnalyticsEventSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

export default mongoose.models.AnalyticsEvent || mongoose.model('AnalyticsEvent', AnalyticsEventSchema);