import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ResearchPaper from '@/models/ResearchPaper';
import { rateLimit } from '@/lib/security';

export async function GET(request) {
  try {
    // Get IP for rate limiting
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    
    // Rate limit: 10 downloads per minute per IP
    const rateCheck = rateLimit(ipAddress, 10, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many download requests. Please try again later.' },
        { status: 429 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Increment download count
      await ResearchPaper.findByIdAndUpdate(id, {
        $inc: { downloadCount: 1 },
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Download tracking error:', error);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
