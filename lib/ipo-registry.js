import { QUICKMART_IPO } from '@/lib/quickmart-ipo';

// Default admin settings for each IPO page. A record is created from these the
// first time an IPO's settings are requested; after that the admin edits win.
export const IPO_DEFAULTS = {
  quickmart: {
    name: QUICKMART_IPO.name,
    description: QUICKMART_IPO.name,
    targetDate: QUICKMART_IPO.closeDate,
    applyNowLink: QUICKMART_IPO.applyPortalUrl,
    applicationFormLink: QUICKMART_IPO.applyPortalUrl,
    videoUrl: '',
    isActive: true,
  },
  dangote: {
    name: 'Dangote Petroleum Refinery IPO',
    description: 'Dangote Petroleum Refinery IPO',
    targetDate: '2026-10-13T23:59:00+01:00',
    applyNowLink: 'https://aib-axysafrica.com/documents/1790230197185-DANGOTE_IPO_CLIENT_OPT-IN_FORM_VF5_.pdf',
    applicationFormLink: 'https://aib-axysafrica.com/documents/1790230197185-DANGOTE_IPO_CLIENT_OPT-IN_FORM_VF5_.pdf',
    videoUrl: '/newlogos/IMG_3454.MP4',
    isActive: true,
  },
};

export const IPO_SLUGS = Object.keys(IPO_DEFAULTS);

export const IPO_LABELS = {
  quickmart: 'Quick Mart PLC IPO',
  dangote: 'Dangote Petroleum Refinery IPO',
};
