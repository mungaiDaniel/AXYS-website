import { NextResponse } from 'next/server';
import { QUICKMART_IPO } from '@/lib/quickmart-ipo';

// Quickmart IPO application forms are issued through the official e-offer portal.
export async function GET() {
  return NextResponse.redirect(QUICKMART_IPO.applyPortalUrl);
}
