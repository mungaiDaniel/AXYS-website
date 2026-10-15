// Public endpoint for documents
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Document from '@/models/Document';

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let query = { isPublished: true };
    if (category && category !== 'all') {
      // Handle combined financial reports category
      if (category === 'financial-reports') {
        query.category = { $in: ['audited-financial-reports', 'unaudited-financial-reports'] };
      } else {
        query.category = category;
      }
    }

    const documents = await Document.find(query)
      .sort({ publishedDate: -1 })
      .select('-__v');

    return NextResponse.json({ documents }, { status: 200 });
  } catch (error) {
    console.error('Get documents error:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}
