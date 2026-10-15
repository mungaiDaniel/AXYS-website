// Force dynamic rendering to bypass caching
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ResearchPaper from '@/models/ResearchPaper';

export async function GET() {
  try {
    await connectDB();

    // Fetch all papers regardless of isPublished status
    const papers = await ResearchPaper.find({})
      .sort({ publishedDate: -1 })
      .limit(1000000)
      .select('-__v');

    return NextResponse.json({ papers }, { status: 200 });
  } catch (error) {
    console.error('Get research papers error:', error);
    return NextResponse.json({ papers: [] }, { status: 200 });
  }
}
