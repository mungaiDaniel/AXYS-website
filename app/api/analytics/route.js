// File: app/api/analytics/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AnalyticsEvent from '@/models/AnalyticsEvent';
import { rateLimit, sanitizeInput } from '@/lib/security';
import { getIpAddress } from '@/lib/audit';

// POST - Track analytics event
export async function POST(request) {
  try {
    const ipAddress = getIpAddress(request);
    
    // Rate limit: 100 events per minute per IP
    const rateCheck = rateLimit(`analytics:${ipAddress}`, 100, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    await connectDB();

    const body = await request.json();
    let { eventType, pageUrl, elementId, metadata, sessionId, userId, referrer } = body;

    // Sanitize inputs
    eventType = sanitizeInput(eventType);
    pageUrl = sanitizeInput(pageUrl);
    elementId = sanitizeInput(elementId);
    sessionId = sanitizeInput(sessionId);
    userId = sanitizeInput(userId);
    referrer = sanitizeInput(referrer);

    // Validate required fields
    if (!eventType || !pageUrl) {
      return NextResponse.json(
        { error: 'eventType and pageUrl are required' },
        { status: 400 }
      );
    }

    // Validate event type
    const validEventTypes = [
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
    ];

    if (!validEventTypes.includes(eventType)) {
      return NextResponse.json(
        { error: 'Invalid event type' },
        { status: 400 }
      );
    }

    // Get user agent for device detection
    const userAgent = request.headers.get('user-agent') || '';
    
    // Simple device type detection
    let deviceType = 'desktop';
    if (/mobile/i.test(userAgent)) {
      deviceType = 'mobile';
    } else if (/tablet|ipad/i.test(userAgent)) {
      deviceType = 'tablet';
    }

    // Sanitize metadata object
    let sanitizedMetadata = {};
    if (metadata && typeof metadata === 'object') {
      Object.keys(metadata).forEach(key => {
        if (typeof metadata[key] === 'string') {
          sanitizedMetadata[key] = sanitizeInput(metadata[key]);
        } else {
          sanitizedMetadata[key] = metadata[key];
        }
      });
    }

    // Create analytics event
    const event = await AnalyticsEvent.create({
      eventType,
      pageUrl,
      elementId: elementId || '',
      metadata: sanitizedMetadata,
      timestamp: new Date(),
      sessionId: sessionId || '',
      userId: userId || '',
      userAgent,
      ipAddress,
      referrer: referrer || '',
      deviceType,
    });

    return NextResponse.json(
      { success: true, eventId: event._id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Analytics tracking error:', error);
    // Don't expose errors to client for analytics
    return NextResponse.json(
      { success: false },
      { status: 200 }
    );
  }
}