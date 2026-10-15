// Force dynamic rendering for admin routes
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ExchangeRate from '@/models/ExchangeRate';
import { verifyAdminRequest } from '@/lib/auth';

// GET - Fetch all exchange rates
export async function GET(request) {
  try {
    const adminData = verifyAdminRequest(request);
    if (!adminData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const rates = await ExchangeRate.find().sort({ currency: 1 });

    return NextResponse.json({ rates }, { status: 200 });
  } catch (error) {
    console.error('Get exchange rates error:', error);
    return NextResponse.json({ error: 'Failed to fetch rates' }, { status: 500 });
  }
}

// POST - Update exchange rate
export async function POST(request) {
  try {
    const adminData = verifyAdminRequest(request);
    if (!adminData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { currency, rate, expiryDate, buyRate, buyExpiryDate, sellRate, sellExpiryDate, showOnPublic, comingSoon } = await request.json();

    // Validate currency
    if (!['USD', 'EUR', 'GBP'].includes(currency)) {
      return NextResponse.json(
        { error: 'Invalid currency. Must be USD, EUR, or GBP.' },
        { status: 400 }
      );
    }

    // Validate rate
    const rateNum = parseFloat(rate);
    if (isNaN(rateNum) || rateNum <= 0 || rateNum > 1000) {
      return NextResponse.json(
        { error: 'Invalid exchange rate. Must be between 0 and 1000.' },
        { status: 400 }
      );
    }

    // Validate expiry dates (allow up to 2 minutes in the past to avoid clock skew / click delay)
    const now = Date.now();
    const minValidTime = now - 2 * 60 * 1000; // 2 minutes ago

    const buyExpiry = buyExpiryDate ? new Date(buyExpiryDate) : null;
    const sellExpiry = sellExpiryDate ? new Date(sellExpiryDate) : null;
    const expiry = new Date(expiryDate);

    if (isNaN(expiry.getTime())) {
      return NextResponse.json(
        { error: 'Invalid expiry date format.' },
        { status: 400 }
      );
    }

    if (buyExpiry && !isNaN(buyExpiry.getTime()) && buyExpiry.getTime() < minValidTime) {
      return NextResponse.json(
        { error: `Buy rate expiry must be in the future. You entered ${buyExpiry.toLocaleString()}; current time is ${new Date().toLocaleString()}. Please set it to a later date/time.` },
        { status: 400 }
      );
    }
    if (sellExpiry && !isNaN(sellExpiry.getTime()) && sellExpiry.getTime() < minValidTime) {
      return NextResponse.json(
        { error: `Sell rate expiry must be in the future. You entered ${sellExpiry.toLocaleString()}; current time is ${new Date().toLocaleString()}. Please set it to a later date/time.` },
        { status: 400 }
      );
    }
    if (expiry.getTime() < minValidTime) {
      return NextResponse.json(
        { error: `Expiry date must be in the future. You entered ${expiry.toLocaleString()}; current time is ${new Date().toLocaleString()}. Please set both buy and sell expiry to a later date/time.` },
        { status: 400 }
      );
    }

    if (!currency || !rate || !expiryDate) {
      return NextResponse.json(
        { error: 'Currency, rate, and expiry date are required' },
        { status: 400 }
      );
    }

    const exchangeRate = await ExchangeRate.findOneAndUpdate(
      { currency },
      {
        rate: parseFloat(rate),
        expiryDate: new Date(expiryDate),
        buyRate: buyRate ? parseFloat(buyRate) : parseFloat(rate),
        buyExpiryDate: buyExpiryDate ? new Date(buyExpiryDate) : new Date(expiryDate),
        sellRate: sellRate ? parseFloat(sellRate) : parseFloat(rate),
        sellExpiryDate: sellExpiryDate ? new Date(sellExpiryDate) : new Date(expiryDate),
        isActive: true,
        showOnPublic: showOnPublic !== false,
        comingSoon: comingSoon === true,
        lastUpdatedBy: adminData.email,
      },
      { upsert: true, new: true, runValidators: true }
    );

    // Audit log the update
    try {
      const AuditLog = (await import('@/models/AuditLog')).default;
      await AuditLog.create({
        adminId: adminData.id || adminData._id,
        adminEmail: adminData.email,
        action: 'exchange_rate_update',
        resourceType: 'exchange_rate',
        resourceId: String(exchangeRate._id),
        details: {
          currency,
          newRate: parseFloat(rate),
          expiryDate: new Date(expiryDate),
        },
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || '',
      });
    } catch (auditError) {
      console.error('Audit logging failed:', auditError);
    }

    console.log('✅ Exchange rate updated:', currency, rate);

    return NextResponse.json({ exchangeRate }, { status: 200 });
  } catch (error) {
    console.error('Update exchange rate error:', error);
    return NextResponse.json({ error: 'Failed to update rate' }, { status: 500 });
  }
}
