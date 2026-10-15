// Force dynamic rendering for admin routes
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getAuditLogs } from '@/lib/audit';
import { verifyAdminRequest } from '@/lib/auth';

export async function GET(request) {
  try {
    const adminData = verifyAdminRequest(request);
    if (!adminData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = parseInt(searchParams.get('skip') || '0');
    const action = searchParams.get('action');

    const { logs, total } = await getAuditLogs({ limit, skip, action });

    return NextResponse.json({ logs, total }, { status: 200 });
  } catch (error) {
    console.error('Get audit logs error:', error);
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}
