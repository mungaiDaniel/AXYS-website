// Quick Mart PLC IPO — facts sourced from the Information Memorandum dated 02 October 2026.
// The IPO name, countdown date and links are admin-editable (see /admin/ipo-settings);
// everything here is the static offer content shared by the IPO page and the FAQ page.

export const QUICKMART_IPO = Object.freeze({
  name: 'Quick Mart PLC IPO',
  closeDate: '2026-10-30T17:00:00+03:00',
  applyPortalUrl: 'https://quickmartipo.e-offer.app/',
  ussdCode: '*483*803#',
  pricePerShareKes: 7.5,
  minShares: 500,
  shareIncrement: 100,
});

export const quickmartIpoTimeline = [
  { phase: 'Offer Opens', date: '5 October 2026, 9:00am EAT' },
  { phase: 'Offer Closes & Retail Payment Deadline', date: '30 October 2026, 5:00pm EAT' },
  { phase: 'Announcement of Results & Allocation', date: '6 November 2026' },
  { phase: 'Payment Date for Qualified Institutional Investors', date: '10 November 2026' },
  { phase: 'CDS Accounts Credited & Refunds Begin', date: '11 November 2026' },
  { phase: 'NSE Listing & Commencement of Trading', date: '12 November 2026' },
];

const { applyPortalUrl, ussdCode } = QUICKMART_IPO;

export const quickmartIpoFaqs = [
  {
    q: 'What is the Quick Mart PLC IPO?',
    a: 'Quick Mart PLC ("Quickmart"), Kenya\'s second-largest supermarket chain, is listing on the Main Investment Market Segment (MIMS) of the Nairobi Securities Exchange. The Offer is an Offer for Sale by the Selling Shareholder, Sokoni Retail Kenya Limited, of 2,000,000,000 existing ordinary shares (50% of the Company) at a fixed price of KES 7.50 per share, raising gross proceeds of KES 15 billion.',
  },
  {
    q: 'What are the key dates for the Offer?',
    a: 'Expected timetable:\n• Offer Opens: 5 October 2026, 9:00am EAT\n• Offer Closes (and last day of payment by retail investors): 30 October 2026, 5:00pm EAT\n• Announcement of results and allocation: 6 November 2026\n• Payment date for Qualified Institutional Investors: 10 November 2026\n• CDS accounts credited and refunds begin: 11 November 2026\n• Listing and commencement of trading on the NSE: 12 November 2026\n\nDates are subject to change with CMA approval.',
  },
  {
    q: 'What is the Offer Price and minimum application?',
    a: 'The Offer Price is KES 7.50 per share. The minimum application is 500 shares (KES 3,750), in multiples of 100 shares thereafter. There is no maximum application size.',
  },
  {
    q: 'How do I apply?',
    a: `You need a valid CDS account before applying. You can then apply through any of these channels:\n• Online: complete the application on the official IPO portal — ${applyPortalUrl}\n• Mobile (USSD): dial ${ussdCode} — for applications of up to KES 250,000\n• Physical form: submit a completed Application Form through AXYS Investment Bank (an Authorised Placing Agent for the Offer) by 5:00pm EAT on 30 October 2026.\n\nIf you do not yet have a CDS account, open one with AXYS Investment Bank first.`,
    formLink: applyPortalUrl,
  },
  {
    q: 'How do I pay for my shares?',
    a: 'Retail investors must pay by 5:00pm EAT on 30 October 2026.\n\nM-Pesa:\n• Pay Bill: 8250250\n• Account Number: 6565650 followed by the 6-digit serial number on your Application Form (13 digits in total)\n\nBank transfer (RTGS / EFT / TT) or cash deposit:\n• Bank: Stanbic Bank Kenya Limited, Chiromo Branch (Branch Code 31000, SWIFT SBICKENX)\n• Account Name: Quickmart IPO\n• Account Number: 6565650 followed by your 6-digit Application Form serial number\n• Narration: your Application Form serial number',
  },
  {
    q: 'Who can apply and how are shares allocated?',
    a: 'The Offer is open to Kenyan retail investors, Kenyan institutional investors, EAC investors and foreign investors (subject to selling restrictions). Indicative allocation: Kenyan Retail 20%, Kenyan Institutional 35%, EAC Investors 12%, Foreign Investors 20%, and the Cornerstone Investor (IFC) 13%. If a category is oversubscribed, applications may be scaled back pro rata; undersubscribed shares are reallocated, with Kenyan retail investors (Quickmart staff first) given priority.',
  },
  {
    q: 'Will Quickmart pay dividends?',
    a: 'After listing, Quickmart intends to target a payout of at least approximately 80% of annual profit after tax, paid semi-annually, subject to Board discretion. The projected FY2026 dividend is KES 0.50 per share, an implied dividend yield of 6.7% at the Offer Price. Dividends to Kenyan residents and EAC citizens attract 5% withholding tax.',
  },
  {
    q: 'What happens if the Offer is undersubscribed?',
    a: 'The Offer is conditional on valid applications for at least 75% of the Offer Shares (1.5 billion shares). If this is not met and not waived with CMA approval, the Offer lapses and application monies are refunded in full within 14 business days to the bank or mobile money account on your application.',
  },
  {
    q: 'Does Quickmart receive the money raised?',
    a: 'No. This is an Offer for Sale — no new shares are being issued. The net proceeds of approximately KES 14.4 billion go to the Selling Shareholder, Sokoni Retail Kenya Limited, which will retain 50% of the Company and is subject to a 24-month lock-up on 60% of its remaining shares.',
  },
];
