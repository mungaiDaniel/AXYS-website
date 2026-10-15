// Public API endpoint for fetching page visibility settings
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PageSettings from '@/models/PageSettings';

export async function GET() {
  try {
    await connectDB();

    const settings = await PageSettings.find();

    // If no settings exist, initialize them
    if (settings.length === 0) {
      const defaultPages = [
        { pageName: 'home', isAccessible: true, showInNav: true },
        { pageName: 'about', isAccessible: true, showInNav: true },
        { pageName: 'group', isAccessible: true, showInNav: true },
        { pageName: 'platforms', isAccessible: true, showInNav: true },
        { pageName: 'services', isAccessible: true, showInNav: true },
        { pageName: 'research', isAccessible: true, showInNav: false }, // Hidden by default
        { pageName: 'ipo', isAccessible: true, showInNav: true },
        { pageName: 'ipo-quickmart', isAccessible: true, showInNav: true },
        { pageName: 'ipo-dangote', isAccessible: true, showInNav: true },
        { pageName: 'ipo-share-calculator', isAccessible: true, showInNav: false },
        { pageName: 'ipo-dangote-share-calculator', isAccessible: true, showInNav: false },
        { pageName: 'leverage', isAccessible: true, showInNav: true },
        { pageName: 'faq', isAccessible: true, showInNav: true },
        { pageName: 'contact', isAccessible: true, showInNav: true },
        { pageName: 'downloads', isAccessible: true, showInNav: true },
        { pageName: 'global-markets', isAccessible: true, showInNav: true },
        { pageName: 'fund-local-stocks', isAccessible: true, showInNav: false },
        { pageName: 'fund-multi-currency', isAccessible: true, showInNav: false },
        { pageName: 'fund-international', isAccessible: true, showInNav: false },
        { pageName: 'fund-offshore', isAccessible: true, showInNav: false },
      ];

      const initialized = await PageSettings.insertMany(defaultPages);
      
      const settingsMap = initialized.reduce((acc, setting) => {
        acc[setting.pageName] = {
          isAccessible: setting.isAccessible,
          showInNav: setting.showInNav,
        };
        return acc;
      }, {});

      return NextResponse.json({ settings: settingsMap }, { status: 200 });
    }

    // Return as object for easy lookup
    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.pageName] = {
        isAccessible: setting.isAccessible,
        showInNav: setting.showInNav,
      };
      return acc;
    }, {});

    return NextResponse.json({ settings: settingsMap }, { status: 200 });
  } catch (error) {
    console.error('Get page visibility error:', error);
    return NextResponse.json({ settings: {} }, { status: 200 });
  }
}
