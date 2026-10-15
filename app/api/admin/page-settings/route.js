// Force dynamic rendering for admin routes
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PageSettings from '@/models/PageSettings';
import { verifyAdminRequest } from '@/lib/auth';

// GET - Fetch all page settings
export async function GET(request) {
  try {
    await connectDB();

    const pages = [
      { pageName: 'home', name: 'Home', path: '/' },
      { pageName: 'about', name: 'About', path: '/about' },
      { pageName: 'group', name: 'Group', path: '/group' },
      { pageName: 'platforms', name: 'Platforms', path: '/platforms' },
      { pageName: 'services', name: 'Services', path: '/services' },
      { pageName: 'research', name: 'Research', path: '/research' },
      { pageName: 'ipo', name: 'IPO (All IPOs page & menu)', path: '/ipo' },
      { pageName: 'ipo-quickmart', name: 'Quick Mart PLC IPO', path: '/ipo/quickmart' },
      { pageName: 'ipo-dangote', name: 'Dangote Petroleum Refinery IPO', path: '/ipo/dangote' },
      { pageName: 'ipo-share-calculator', name: 'Quickmart IPO Share Calculator', path: '/ipo/quickmart/share-calculator' },
      { pageName: 'ipo-dangote-share-calculator', name: 'Dangote IPO Share Calculator', path: '/ipo/dangote/share-calculator' },
      { pageName: 'leverage', name: 'Leverage', path: '/leverage' },
      { pageName: 'faq', name: 'FAQ', path: '/faq' },
      { pageName: 'contact', name: 'Contact', path: '/contact' },
      { pageName: 'downloads', name: 'Downloads', path: '/downloads' },
      { pageName: 'global-markets', name: 'Global Markets', path: '/global-markets' },
      { pageName: 'fund-local-stocks', name: 'Fund Account - Local Stocks', path: '/fund-account/local-stocks' },
      { pageName: 'fund-multi-currency', name: 'Fund Account - Multi-currency', path: '/fund-account/multi-currency' },
      { pageName: 'fund-international', name: 'Fund Account - International', path: '/fund-account/international-equities' },
      { pageName: 'fund-offshore', name: 'Fund Account - Offshore', path: '/fund-account/offshore-funds' },
    ];

    // Pages that are reachable but not linked from the navbar by default.
    const hiddenFromNavByDefault = ['research', 'ipo-share-calculator', 'ipo-dangote-share-calculator'];

    let settings = await PageSettings.find();

    // Initialize if empty
    if (settings.length === 0) {
      const defaultSettings = pages.map(page => ({
        pageName: page.pageName,
        isAccessible: true,
        showInNav: !hiddenFromNavByDefault.includes(page.pageName),
      }));

      settings = await PageSettings.insertMany(defaultSettings);
    }

    // Merge with page info
    const pageSettings = pages.map(page => {
      const setting = settings.find(s => s.pageName === page.pageName) || {
        isAccessible: true,
        showInNav: !hiddenFromNavByDefault.includes(page.pageName),
      };
      return {
        ...page,
        ...setting.toObject?.() || setting,
      };
    });

    return NextResponse.json({ pages: pageSettings }, { status: 200 });
  } catch (error) {
    console.error('Get page settings error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// PUT - Update page visibility
export async function PUT(request) {
  try {
    const adminData = verifyAdminRequest(request);
    if (!adminData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { pageName, isAccessible, showInNav } = await request.json();

    // Protect home page - it should always be accessible
    if (pageName === 'home' && isAccessible === false) {
      return NextResponse.json({ error: 'Home page must always be accessible' }, { status: 400 });
    }

    let setting = await PageSettings.findOne({ pageName });

    if (!setting) {
      setting = await PageSettings.create({ pageName, isAccessible, showInNav });
    } else {
      if (isAccessible !== undefined) setting.isAccessible = isAccessible;
      if (showInNav !== undefined) setting.showInNav = showInNav;
      await setting.save();
    }

    return NextResponse.json({ setting }, { status: 200 });
  } catch (error) {
    console.error('Update page settings error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
