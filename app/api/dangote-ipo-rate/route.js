import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import DangoteRateCache from '@/models/DangoteRateCache';
import { getCachedRateResponse } from '@/lib/dangote-rate-service';

// Legacy path retained as a cache-only alias. It never contacts rate providers.
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const result = await getCachedRateResponse(() => DangoteRateCache.findById('USD_NGN').lean());
    return NextResponse.json(result.body, {
      status: result.status,
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch {
    return NextResponse.json(
      { error: 'The live USD/NGN rate is not available. Enter a rate manually to continue.' },
      { status: 503, headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  }
}
