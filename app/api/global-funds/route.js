// Public API: list global funds visible on the website
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import GlobalFund from '@/models/GlobalFund';

export async function GET() {
  try {
    await connectDB();

    const funds = await GlobalFund.find({ isVisible: true })
      .sort({ displayOrder: 1, createdAt: 1 })
      .limit(100)
      .lean();

    return NextResponse.json({ funds }, { status: 200 });
  } catch (error) {
    console.error('Get public global funds error:', error);
    return NextResponse.json({ error: 'Failed to fetch global funds' }, { status: 500 });
  }
}
