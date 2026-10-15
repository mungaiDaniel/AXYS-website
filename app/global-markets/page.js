'use client';

import { useState, useEffect } from 'react';
import { Download, AlertCircle, X, ArrowRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Reveal, Stagger, TiltCard } from '@/components/motion';
import { PageHero, Section, SectionIntro, QuickLinks } from '@/components/layout/PageLayout';

// ─── Fund Detail Modal ─────────────────────────────────────────────────────────
function FundModal({ isOpen, onClose, fund }) {
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  if (isOpen && !isVisible && !isClosing) setIsVisible(true);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setIsVisible(false);
      onClose();
    }, 400);
  };

  if (!isVisible || !fund) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Backdrop */}
      <div
        className="glass-modal-backdrop absolute inset-0 cursor-pointer"
        onClick={handleClose}
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      />

      {/* Card */}
      <div
        className="glass-modal-card relative z-10 w-full max-w-3xl max-h-[90dvh] overflow-y-auto rounded-2xl border border-white/30 shadow-2xl dark:shadow-2xl dark:shadow-black/60"
        style={{
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          animation: isClosing
            ? 'modal-card-shrink 0.4s cubic-bezier(0.6,0,0.84,0) forwards'
            : 'modal-card-expand 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards',
          scrollBehavior: 'smooth',
          overscrollBehavior: 'contain',
        }}
      >
        {/* Content Wrapper with Generous Padding */}
        <div className="px-8 sm:px-10 lg:px-12 py-10 sm:py-12 lg:py-14 space-y-8">
          {/* Performance Metric (title + value) */}
          
          {/* Fund Name */}
          <h3 className="text-2xl sm:text-3xl font-bold text-center text-foreground dark:text-white mb-2">
            {fund.fundName}
          </h3>
          {fund.shortName && (
            <p className="text-center text-sm text-muted-foreground dark:text-gray-400 mb-4">({fund.shortName})</p>
          )}
          <div className="w-16 h-1 rounded-full mx-auto mb-8 bg-[#1477bb]" />

          {/* Separator */}
          {fund.performanceBoxes && fund.performanceBoxes.length > 0 && (
            <div className="flex items-center gap-3 pt-4">
              <div className="flex-1 h-px bg-black/15 dark:bg-white/20" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground dark:text-gray-400">Performance</span>
              <div className="flex-1 h-px bg-black/15 dark:bg-white/20" />
            </div>
          )}

          {fund.performanceBoxes && fund.performanceBoxes.length > 0 && (
            <div className="flex justify-center">
              <div className="flex flex-wrap gap-4 w-full justify-center">
                {fund.performanceBoxes.map((box, idx) => (
                  <div key={idx} className="inline-flex flex-col items-center bg-blue-50/90 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-500/30 rounded-2xl px-10 py-7 backdrop-blur-sm">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#1477bb] dark:text-cyan-300 mb-2">
                      {box.label}
                    </span>
                    <span className="text-5xl sm:text-6xl font-bold text-green-600 dark:text-green-400 leading-none">
                      {box.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {fund.documents && fund.documents.length > 0 && (
            <div className="border-t border-black/15 dark:border-white/15 pt-8">
              <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground dark:text-gray-400 block mb-5 text-center">
                Documents
              </span>
              <div className="flex flex-col gap-3">
                {fund.documents.map((doc, i) => (
                  <a
                    key={i}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-5 py-3 rounded-lg border border-primary/40 dark:border-cyan-500/40 text-brand-blue dark:text-cyan-300 hover:bg-primary/15 dark:hover:bg-cyan-500/20 hover:border-primary/60 dark:hover:border-cyan-500/60 transition-all duration-200 text-sm font-medium"
                  >
                    <Download className="w-4 h-4 shrink-0" />
                    {doc.name}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {fund.description && (
            <p className="text-base text-muted-foreground dark:text-gray-300 leading-relaxed text-center pt-4">
              {fund.description}
            </p>
          )}


          

          {/* CTA */}
          <div className="flex justify-center pt-6">
            <Link href="/contact" onClick={handleClose}>
              <button className="px-10 py-3.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 hover:scale-105 active:scale-98 dark:bg-cyan-600 dark:hover:bg-cyan-500">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function GlobalMarketsPage() {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFund, setSelectedFund] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchFunds();
  }, []);

  const fetchFunds = async () => {
    try {
      setError(null);
      const response = await fetch('/api/global-funds', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Failed to load funds');
        setFunds([]);
        return;
      }
      setFunds(data.funds || []);
    } catch (err) {
      console.error('Error fetching global funds:', err);
      setError('Unable to load global funds. Please try again later.');
      setFunds([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (fund) => {
    setSelectedFund(fund);
    setIsModalOpen(true);
  };

  // Fund families offered (as listed on the Services page)
  const fundUniverse = [
    'Axiom Africa Equity Fund',
    'Dynamic Global Equity Feeder Fund',
    'Global Sharia Funds – Sukuk and Halal Equities',
    'Global Fixed Income Funds',
    'Global Multi-Asset / Special Funds',
    'Global Index / Money Market Funds',
    'Global Exchange Traded Funds (ETFs)',
  ];

  return (
    <div className="min-h-screen">
      <PageHero
        crumbs={[{ label: 'Services', href: '/services' }, { label: 'Offshore Funds' }]}
        eyebrow="Global investing"
        title="Offshore Funds"
        subtitle="Diversified investment solutions for every investor"
        aside={
          <QuickLinks
            eyebrow="Get started"
            icon={TrendingUp}
            links={[
              { label: 'Fund your offshore account', href: '/fund-account/offshore-funds' },
              { label: 'USD & GBP funding', href: '/fund-account/multi-currency' },
              { label: 'Talk to our investment team', href: '/contact' },
            ]}
          />
        }
      />

      <Section tone="tint">
        <SectionIntro eyebrow="Fund performance" title="Our funds" text="Select a fund to see its performance, documents and details." />

        {loading ? (
          <div className="grid md:grid-cols-2 gap-6" aria-busy="true">
            {[0, 1].map((i) => (
              <div key={i} className="mx-fund-card h-56 animate-pulse opacity-60" />
            ))}
            <p className="sr-only">Loading global funds...</p>
          </div>
        ) : error ? (
          <div className="mx-faq-item p-8 max-w-md text-center mx-auto">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">{error}</p>
            <button
              type="button"
              onClick={() => { setLoading(true); fetchFunds(); }}
              className="px-4 py-2 bg-[#0017bf] text-white rounded-lg hover:opacity-90"
            >
              Try again
            </button>
          </div>
        ) : funds.length === 0 ? (
          <div className="mx-faq-item p-8 max-w-2xl">
            <p className="text-muted-foreground mb-4">
              No global funds are currently available. Please check back later.
            </p>
            <Link href="/contact" data-analytics-label="global_markets_contact_us" data-analytics-event="link_click" className="mx-link text-[#0017bf] dark:text-[#9AA6EF] font-medium">
              Contact us
            </Link>
          </div>
        ) : (
          <Stagger className="grid md:grid-cols-2 gap-6">
            {funds.map((fund) => {
              const [main, ...rest] = fund.performanceBoxes || [];
              return (
                <button
                  key={fund._id}
                  data-analytics-label="global_markets_fund_card"
                  data-analytics-event="button_click"
                  onClick={() => handleOpen(fund)}
                  className="group w-full text-left rounded-2xl"
                >
                  <TiltCard className="mx-fund-card h-full flex flex-col">
                    <p className="mx-eyebrow !text-[#9AA6EF] inline-flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" /> Fund performance
                    </p>
                    <h2 className="mx-mono text-sm text-[#C9CFF5] mt-4 uppercase tracking-wide leading-relaxed">
                      {fund.fundName}{fund.shortName ? ` / ${fund.shortName}` : ''}
                    </h2>
                    <div className="flex items-end justify-between gap-4 mt-2">
                      <div>
                        {main && <p className="mx-mono text-[10px] uppercase tracking-[0.16em] text-[#9AA6EF]/70">{main.label}</p>}
                        <p className="mx-mono text-3xl font-bold text-white whitespace-nowrap">{main ? main.value : '—'}</p>
                      </div>
                      <div className="flex flex-wrap justify-end gap-1.5">
                        {rest.map((box, idx) => (
                          <span key={idx} className="mx-badge mx-badge-up">{box.label} {box.value}</span>
                        ))}
                      </div>
                    </div>
                    {fund.description && (
                      <p className="text-sm text-[#C9CFF5]/80 leading-relaxed mt-5 line-clamp-2">{fund.description}</p>
                    )}
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                      Explore fund <ArrowRight className="mx-arrow w-4 h-4" />
                    </span>
                    <div className="mx-fund-line mt-auto" aria-hidden="true" />
                  </TiltCard>
                </button>
              );
            })}
          </Stagger>
        )}
      </Section>

      {/* Fund universe */}
      <Section tone="white">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10">
          <SectionIntro eyebrow="Fund universe" title="Access world-class offshore funds" className="!mb-0" />
          <Stagger className="grid sm:grid-cols-2 gap-3">
            {fundUniverse.map((name, i) => (
              <div key={name} className="mx-row !py-4">
                <span className="mx-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-semibold text-foreground text-sm">{name}</span>
              </div>
            ))}
          </Stagger>
        </div>
      </Section>

      {/* CTA */}
      <Section tone="navy">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
          <SectionIntro
            eyebrow="Talk to us"
            title="Interested in Our Funds?"
            text="Contact our investment team to learn more about our fund offerings and find the right investment solution for your needs."
            light
            className="!mb-0"
          />
          <Reveal className="lg:justify-self-end">
            <Link href="/contact">
              <button data-analytics-label="global_markets_contact_us_cta" data-analytics-event="button_click" className="mx-btn px-8 py-4 bg-white text-[#00005B] rounded-lg font-semibold">
                Contact Us <ArrowRight className="mx-arrow w-4 h-4" />
              </button>
            </Link>
          </Reveal>
        </div>
      </Section>

      {/* Fund Detail Modal */}
      <FundModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fund={selectedFund}
      />
    </div>
  );
}
