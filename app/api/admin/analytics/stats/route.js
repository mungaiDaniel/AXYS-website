// File: app/api/admin/analytics/stats/route.js
// Force dynamic rendering for admin routes
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AnalyticsEvent from '@/models/AnalyticsEvent';
import Contact from '@/models/Contact';
import { verifyAdminRequest } from '@/lib/auth';

// GET - Fetch analytics statistics
export async function GET(request) {
  try {
    const adminData = verifyAdminRequest(request);
    if (!adminData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('range') || '7d'; // Default: last 7 days

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case '24h':
        startDate.setHours(now.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '365d':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'all':
        startDate = new Date(0);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // Exclude admin dashboard traffic so stats reflect public visitors only
    const notAdmin = { pageUrl: { $not: /^\/admin/ } };

    // Run analytics queries in parallel
    const [
      totalPageViews,
      uniqueSessions,
      topPages,
      eventsByType,
      deviceBreakdown,
      referralSources,
      topClickedElements,
      recentEvents,
    ] = await Promise.all([
      // Total page views
      AnalyticsEvent.countDocuments({
        eventType: 'page_view',
        ...notAdmin,
        timestamp: { $gte: startDate },
      }),

      // Unique sessions
      AnalyticsEvent.distinct('sessionId', {
        ...notAdmin,
        timestamp: { $gte: startDate },
        sessionId: { $ne: '' },
      }),

      // Top pages by views
      AnalyticsEvent.aggregate([
        {
          $match: {
            eventType: 'page_view',
            ...notAdmin,
            timestamp: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: '$pageUrl',
            views: { $sum: 1 },
          },
        },
        { $sort: { views: -1 } },
        { $limit: 10 },
        {
          $project: {
            _id: 0,
            pageUrl: '$_id',
            views: 1,
          },
        },
      ]),

      // Events by type
      AnalyticsEvent.aggregate([
        {
          $match: {
            ...notAdmin,
            timestamp: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: '$eventType',
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        {
          $project: {
            _id: 0,
            eventType: '$_id',
            count: 1,
          },
        },
      ]),

      // Device breakdown
      AnalyticsEvent.aggregate([
        {
          $match: {
            ...notAdmin,
            timestamp: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: '$deviceType',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            deviceType: '$_id',
            count: 1,
          },
        },
      ]),

      // Top referrers (where users came from)
      AnalyticsEvent.aggregate([
        {
          $match: {
            ...notAdmin,
            timestamp: { $gte: startDate },
            referrer: { $ne: '' },
          },
        },
        {
          $group: {
            _id: '$referrer',
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
        {
          $project: {
            _id: 0,
            referrer: '$_id',
            count: 1,
          },
        },
      ]),

      // Top tracked elements (clicks, downloads, form submissions, or any element-level event)
      AnalyticsEvent.aggregate([
        {
          $match: {
            eventType: { $nin: ['page_view', 'scroll_depth', 'session_start', 'session_end'] },
            ...notAdmin,
            timestamp: { $gte: startDate },
            elementId: { $ne: '' },
          },
        },
        {
          $group: {
            _id: '$elementId',
            count: { $sum: 1 },
            pageUrl: { $first: '$pageUrl' },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
        {
          $project: {
            _id: 0,
            elementId: '$_id',
            count: 1,
            pageUrl: 1,
          },
        },
      ]),

      // Recent events (last 50)
      AnalyticsEvent.find({ ...notAdmin, timestamp: { $gte: startDate } })
        .sort({ timestamp: -1 })
        .limit(50)
        .select('eventType pageUrl elementId timestamp deviceType sessionId')
        .lean(),
    ]);

    // Get contact form referral sources
    const contactReferralSources = await Contact.aggregate([
      {
        $match: {
          referralSource: { $ne: '', $exists: true },
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: '$referralSource',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      {
        $project: {
          _id: 0,
          source: '$_id',
          count: 1,
        },
      },
    ]);

    // Calculate total events
    const totalEvents = await AnalyticsEvent.countDocuments({
      ...notAdmin,
      timestamp: { $gte: startDate },
    });

    // Most recent page view
    const recentPageView = await AnalyticsEvent.findOne({
      eventType: 'page_view',
      ...notAdmin,
      timestamp: { $gte: startDate },
    })
      .sort({ timestamp: -1 })
      .select('pageUrl timestamp')
      .lean();

    // Build response
    const stats = {
      timeRange,
      startDate,
      endDate: now,
      summary: {
        totalEvents,
        totalPageViews,
        uniqueSessions: uniqueSessions.length,
        avgEventsPerSession: uniqueSessions.length > 0 
          ? (totalEvents / uniqueSessions.length).toFixed(2) 
          : 0,
      },
      topPages,
      eventsByType,
      deviceBreakdown,
      referralSources,
      topClickedElements,
      recentPageView,
      contactReferralSources,
      recentEvents,
    };

    return NextResponse.json({ stats }, { status: 200 });
  } catch (error) {
    console.error('Get analytics stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics statistics' },
      { status: 500 }
    );
  }
}