// Force dynamic rendering for admin routes
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import IPOSettings from '@/models/IPOSettings';
import { verifyAdminRequest } from '@/lib/auth';
import { IPO_DEFAULTS, IPO_SLUGS } from '@/lib/ipo-registry';

const NO_STORE = { 'Cache-Control': 'no-store' };

function getSlug(request) {
  const slug = new URL(request.url).searchParams.get('ipo') || 'quickmart';
  return IPO_SLUGS.includes(slug) ? slug : null;
}

// Records saved before IPOs had their own settings have no slug. Assign one by
// name so each IPO page keeps its own record.
let legacyMigrated = false;
async function migrateLegacySettings() {
  if (legacyMigrated) return;
  await IPOSettings.updateMany({ slug: { $exists: false }, name: /dangote/i }, { $set: { slug: 'dangote' } });
  const quickmartExists = await IPOSettings.exists({ slug: 'quickmart' });
  if (!quickmartExists) {
    await IPOSettings.updateOne({ slug: { $exists: false } }, { $set: { slug: 'quickmart' } });
  }
  legacyMigrated = true;
}

async function getOrCreateSettings(slug) {
  await migrateLegacySettings();
  let settings = await IPOSettings.findOne({ slug });
  if (!settings) {
    // Upsert so simultaneous first requests can't create duplicate records.
    const defaults = IPO_DEFAULTS[slug];
    settings = await IPOSettings.findOneAndUpdate(
      { slug },
      { $setOnInsert: { slug, ...defaults, targetDate: new Date(defaults.targetDate) } },
      { upsert: true, new: true }
    );
  } else if (slug === 'quickmart') {
    // Quickmart links inherited from the Dangote offer point at a closed form.
    let changed = false;
    for (const field of ['applyNowLink', 'applicationFormLink']) {
      if (/dangote|ngxinvest/i.test(settings[field] || '')) {
        settings[field] = IPO_DEFAULTS.quickmart.applyNowLink;
        changed = true;
      }
    }
    if (changed) await settings.save();
  }
  return settings;
}

// GET - Fetch settings for one IPO (?ipo=quickmart|dangote, defaults to quickmart)
export async function GET(request) {
  try {
    const slug = getSlug(request);
    if (!slug) return NextResponse.json({ error: 'Unknown IPO' }, { status: 400 });

    await connectDB();
    const settings = await getOrCreateSettings(slug);
    return NextResponse.json({ settings }, { status: 200, headers: NO_STORE });
  } catch (error) {
    console.error('Get IPO settings error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// PUT - Update settings for one IPO
export async function PUT(request) {
  try {
    const adminData = verifyAdminRequest(request);
    if (!adminData) {
      return NextResponse.json({ error: 'Your admin session has expired. Please log in again.' }, { status: 401 });
    }

    const slug = getSlug(request);
    if (!slug) return NextResponse.json({ error: 'Unknown IPO' }, { status: 400 });

    const { name, targetDate, applyNowLink, applicationFormLink, videoUrl, isActive } = await request.json();

    if (targetDate !== undefined && Number.isNaN(new Date(targetDate).getTime())) {
      return NextResponse.json({ error: 'Invalid countdown date' }, { status: 400 });
    }

    await connectDB();
    const settings = await getOrCreateSettings(slug);

    if (name) settings.name = name;
    if (targetDate) settings.targetDate = new Date(targetDate);
    if (applyNowLink !== undefined) settings.applyNowLink = applyNowLink;
    if (applicationFormLink !== undefined) settings.applicationFormLink = applicationFormLink;
    if (videoUrl !== undefined) settings.videoUrl = videoUrl;
    if (isActive !== undefined) settings.isActive = isActive;
    await settings.save();

    return NextResponse.json({ settings }, { status: 200, headers: NO_STORE });
  } catch (error) {
    console.error('Update IPO settings error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update settings' }, { status: 500 });
  }
}
