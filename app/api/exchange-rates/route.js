// Public endpoint for exchange rates
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ExchangeRate from '@/models/ExchangeRate';

export async function GET() {
  try {
    await connectDB();

    // Get all rates that are active & visible on public page.
    // IMPORTANT: Many legacy records were created before isActive/showOnPublic existed,
    // so we treat missing fields as true to avoid hiding valid data.
    const rates = await ExchangeRate.find({
      $and: [
        {
          $or: [
            { isActive: true },
            { isActive: { $exists: false } },   // legacy records
          ],
        },
        {
          $or: [
            { showOnPublic: true },
            { showOnPublic: { $exists: false } }, // legacy records
          ],
        },
      ],
    }).sort({ currency: 1 });

    return NextResponse.json({ rates }, { status: 200 });
  } catch (error) {
    console.error('Get exchange rates error:', error);
    return NextResponse.json({ error: 'Failed to fetch rates' }, { status: 500 });
  }
}
