// Force dynamic rendering for admin routes
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';
import IPOSettings from '@/models/IPOSettings';
import ResearchPaper from '@/models/ResearchPaper';
import { verifyAdminRequest } from '@/lib/auth';

export async function GET(request) {
  try {
    const adminData = verifyAdminRequest(request);
    if (!adminData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get counts and stats
    const totalContacts = await Contact.countDocuments();
    const newContacts = await Contact.countDocuments({ status: 'new' });
    const quickmartIpoApplications = await Contact.countDocuments({ subject: 'ipo' });
    const dangoteIpoApplications = await Contact.countDocuments({ subject: 'dangote-ipo' });
    const ipoApplications = quickmartIpoApplications + dangoteIpoApplications;
    const leverageApplications = await Contact.countDocuments({ subject: 'leverage' });
    const totalResearch = await ResearchPaper.countDocuments();
    const publishedResearch = await ResearchPaper.countDocuments({ isPublished: true });

    // Get recent contacts
    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email subject status createdAt');

    return NextResponse.json(
      {
        stats: {
          totalContacts,
          newContacts,
          ipoApplications,
          quickmartIpoApplications,
          dangoteIpoApplications,
          leverageApplications,
          totalResearch,
          publishedResearch,
        },
        recentContacts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
