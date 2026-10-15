'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Clock, CheckCircle, Rocket, Calculator } from 'lucide-react';
import { IPO_LABELS } from '@/lib/ipo-registry';
import { Stagger } from '@/components/motion';
import { PageHero, Section, SectionIntro, FactCard } from '@/components/layout/PageLayout';

const IPOS = [
  {
    slug: 'quickmart',
    summary: 'Offer for Sale of 2,000,000,000 shares in Kenya’s second-largest supermarket chain at KES 7.50 per share. Listing on the Nairobi Securities Exchange.',
    venue: 'NSE · Kenya',
  },
  {
    slug: 'dangote',
    summary: 'Offer for Subscription of up to 4,100,000,000 shares at ₦525.00 per share. Listing on the Main Board of the Nigerian Exchange.',
    venue: 'NGX · Nigeria',
  },
];

function formatClose(date) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleString('en-KE', { timeZone: 'Africa/Nairobi', dateStyle: 'medium', timeStyle: 'short' });
}

export default function IPOIndexPage() {
  const [settings, setSettings] = useState({});
  const [visibility, setVisibility] = useState(null);

  // Each IPO has its own Page Visibility entry (ipo-quickmart, ipo-dangote).
  useEffect(() => {
    let active = true;
    fetch('/api/page-visibility', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : { settings: {} }))
      .then((data) => { if (active) setVisibility(data.settings || {}); })
      .catch(() => { if (active) setVisibility({}); });
    return () => { active = false; };
  }, []);

  const isListed = (slug) => {
    const page = visibility?.[`ipo-${slug}`];
    return !page || (page.isAccessible !== false && page.showInNav !== false);
  };
  const listedIpos = visibility ? IPOS.filter(({ slug }) => isListed(slug)) : [];

  useEffect(() => {
    let active = true;
    Promise.all(IPOS.map(({ slug }) =>
      fetch(`/api/admin/ipo-settings?ipo=${slug}`, { cache: 'no-store' })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => [slug, data?.settings || null])
        .catch(() => [slug, null])
    )).then((entries) => {
      if (active) setSettings(Object.fromEntries(entries));
    });
    return () => { active = false; };
  }, []);

  const openCount = listedIpos.filter(({ slug }) => {
    const t = settings[slug]?.targetDate;
    return t && new Date(t).getTime() > Date.now();
  }).length;

  return (
    <div className="min-h-screen">
      <PageHero
        crumbs={[{ label: 'IPO' }]}
        eyebrow="Primary markets"
        title="IPO Applications"
        subtitle="Choose an offer to see the details, key dates and how to apply through AXYS Investment Bank."
        aside={
          <FactCard
            eyebrow="Offers"
            icon={Rocket}
            facts={[
              ['Listed offers', String(listedIpos.length)],
              ['Open now', String(openCount)],
              ['Markets', listedIpos.map((i) => i.venue.split(' · ')[0]).join(' · ') || '—'],
              ['Apply via', 'AXYS'],
            ]}
          />
        }
      />

      <Section tone="tint">
        <SectionIntro eyebrow="Current offers" title="Choose an offer" />

        {visibility && listedIpos.length === 0 && (
          <div className="mx-faq-item p-8 max-w-2xl">
            <p className="text-muted-foreground">There are no IPOs open for applications right now. Please check back soon.</p>
          </div>
        )}

        <Stagger className="space-y-6">
          {listedIpos.map(({ slug, summary, venue }, index) => {
            const ipo = settings[slug];
            const closesAt = ipo?.targetDate ? new Date(ipo.targetDate) : null;
            const isOpen = closesAt ? closesAt.getTime() > Date.now() : null;
            return (
              <div key={slug} className="mx-offer group">
                <a href={`/ipo/${slug}`} className="mx-offer-main">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="mx-num">{String(index + 1).padStart(2, '0')}</span>
                    <span className="mx-chip mx-chip-light">{venue}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{ipo?.name?.trim() || IPO_LABELS[slug]}</h2>
                  <p className="text-muted-foreground leading-relaxed max-w-2xl">{summary}</p>
                  <span className="mt-6 inline-flex items-center gap-2 font-semibold text-[#0017bf] dark:text-[#9AA6EF]">
                    View offer <ArrowRight className="mx-arrow w-4 h-4" />
                  </span>
                </a>
                <div className="mx-offer-side">
                  <p className="mx-eyebrow !text-[#9AA6EF] inline-flex items-center gap-2">
                    {isOpen ? <Clock className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                    Status
                  </p>
                  {isOpen !== null ? (
                    <>
                      <p className={`mt-3 text-xl font-bold ${isOpen ? 'text-[#3ddc9c]' : 'text-white/80'}`}>
                        {isOpen ? 'Open' : 'Offer period closed'}
                      </p>
                      {isOpen && (
                        <p className="mx-mono text-sm text-[#C9CFF5] mt-1">closes {formatClose(closesAt)} EAT</p>
                      )}
                    </>
                  ) : (
                    <p className="mt-3 text-white/60 mx-mono text-sm">Loading…</p>
                  )}
                  <a href={`/ipo/${slug}/share-calculator`} className="mx-link mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white">
                    <Calculator className="w-4 h-4" /> Share Calculator
                  </a>
                  <div className="mx-fund-line" aria-hidden="true" />
                </div>
              </div>
            );
          })}
        </Stagger>
      </Section>
    </div>
  );
}
