// File: app/api/admin/page-settings/seed/route.js
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PageSettings from '@/models/PageSettings';
import { verifyAdminRequest } from '@/lib/auth';

export async function GET(request) {
  try {
    const adminData = verifyAdminRequest(request);
    if (!adminData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const masterPages = [
      // Main Pages
      { path: '/', pageName: 'home', name: 'Home', showInNav: true, isAccessible: true },
      { path: '/services', pageName: 'services', name: 'Services', showInNav: true, isAccessible: true },
      { path: '/platforms', pageName: 'platforms', name: 'Platforms', showInNav: true, isAccessible: true },
      { path: '/research', pageName: 'research', name: 'Research', showInNav: true, isAccessible: true },
      { path: '/downloads', pageName: 'downloads', name: 'Downloads', showInNav: true, isAccessible: true },
      { path: '/ipo', pageName: 'ipo', name: 'IPO', showInNav: true, isAccessible: true },
      { path: '/ipo/quickmart', pageName: 'ipo-quickmart', name: 'Quick Mart PLC IPO', showInNav: true, isAccessible: true },
      { path: '/ipo/dangote', pageName: 'ipo-dangote', name: 'Dangote Petroleum Refinery IPO', showInNav: true, isAccessible: true },
      { path: '/ipo/quickmart/share-calculator', pageName: 'ipo-share-calculator', name: 'Quickmart IPO Share Calculator', showInNav: false, isAccessible: true },
      { path: '/ipo/dangote/share-calculator', pageName: 'ipo-dangote-share-calculator', name: 'Dangote IPO Share Calculator', showInNav: false, isAccessible: true },
      { path: '/faq', pageName: 'faq', name: 'FAQ', showInNav: true, isAccessible: true },
      { path: '/contact', pageName: 'contact', name: 'Contact', showInNav: true, isAccessible: true },
      
      // About Dropdown
      { path: '/about', pageName: 'about', name: 'About Us (Subpage)', showInNav: true, isAccessible: true },
      { path: '/group', pageName: 'group', name: 'The Group', showInNav: true, isAccessible: true },
      
      // Services Dropdown
      { path: '/leverage', pageName: 'leverage', name: 'Leverage', showInNav: true, isAccessible: true },
      { path: '/global-markets', pageName: 'global-markets', name: 'Global Markets', showInNav: true, isAccessible: true },
      
      // Fund Account Dropdown
      { path: '/fund-account/local-stocks', pageName: 'fund-local-stocks', name: 'Local Stocks', showInNav: false, isAccessible: true },
      { path: '/fund-account/multi-currency', pageName: 'fund-multi-currency', name: 'Multi-Currency', showInNav: false, isAccessible: true },
      { path: '/fund-account/international-equities', pageName: 'fund-international', name: 'International Equities', showInNav: false, isAccessible: true },
      { path: '/fund-account/offshore-funds', pageName: 'fund-offshore', name: 'Offshore Funds', showInNav: false, isAccessible: true },
      
      // Legal Pages
      { path: '/privacy', pageName: 'privacy', name: 'Privacy Policy', showInNav: false, isAccessible: true },
      { path: '/terms', pageName: 'terms', name: 'Terms & Conditions', showInNav: false, isAccessible: true },
    ];

    let seededCount = 0;
    let updatedCount = 0;
    let unchangedCount = 0;

    for (const pageData of masterPages) {
      const result = await PageSettings.updateOne(
        { pageName: pageData.pageName },
        { 
          $set: {
            path: pageData.path,
            name: pageData.name,
            showInNav: pageData.showInNav,
            isAccessible: pageData.isAccessible,
          }
        },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        seededCount++;
      } else if (result.modifiedCount > 0) {
        updatedCount++;
      } else {
        unchangedCount++;
      }
    }

    // Audit log
    try {
      const AuditLog = (await import('@/models/AuditLog')).default;
      await AuditLog.create({
        adminEmail: adminData.email,
        action: 'PAGE_SETTINGS_SEEDED',
        details: {
          totalPages: masterPages.length,
          seeded: seededCount,
          updated: updatedCount,
          unchanged: unchangedCount,
        },
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        timestamp: new Date(),
      });
    } catch (auditError) {
      console.error('Audit logging failed:', auditError);
    }

    console.log(`✅ Page settings seeded: ${seededCount} new, ${updatedCount} updated, ${unchangedCount} unchanged`);

    return NextResponse.json({
      success: true,
      message: 'Page settings seeded successfully',
      stats: {
        total: masterPages.length,
        seeded: seededCount,
        updated: updatedCount,
        unchanged: unchangedCount,
      },
      pages: await PageSettings.find().sort({ path: 1 })
    }, { status: 200 });
  } catch (error) {
    console.error('Seed page settings error:', error);
    return NextResponse.json(
      { error: 'Failed to seed page settings' },
      { status: 500 }
    );
  }
}
