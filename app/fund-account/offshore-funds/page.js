'use client';

import { useState, useEffect } from 'react';
import { Building2, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Reveal } from '@/components/motion';
import { PageHero, Section, QuickLinks } from '@/components/layout/PageLayout';
import { FundingNav, DetailTile, MethodBlock, Notice, NotifyCard } from '@/components/layout/Funding';

export default function OffshoreFundsPage() {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setError('Unable to load offshore funds. Please try again later.');
      setFunds([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <PageHero
        crumbs={[{ label: 'Fund Account' }, { label: 'Offshore Funds' }]}
        eyebrow="Fund Account"
        title="Offshore Funds Investment"
        subtitle="Invest in Axiom Africa Equity Fund and other offshore funds"
        aside={
          <QuickLinks
            eyebrow="On this page"
            icon={TrendingUp}
            links={[
              { label: 'USD Account Details', href: '#usd' },
              { label: 'After Deposit - Notify Us', href: '#notify' },
              { label: 'Available Offshore Funds', href: '#funds' },
            ]}
          />
        }
      />
      <FundingNav />

      <Section tone="white">
        <div className="grid lg:grid-cols-[1fr_22rem] gap-12 lg:gap-16 items-start">
          <div className="min-w-0">
            {/* Bank Details */}
            <MethodBlock id="usd" num="01" icon={Building2} title="USD Account Details">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DetailTile label="Bank Name" value="Stanbic Bank" />
                <DetailTile label="Account Name" value="AXYS Investment Bank Limited - Client Account" />
                <DetailTile label="Account Number" value="0100013147347" tone="accent" copy />
              </div>
            </MethodBlock>

            {/* Available Funds */}
            <MethodBlock id="funds" num="03" icon={TrendingUp} title="Available Offshore Funds">
              {loading ? (
                <div className="space-y-3" aria-busy="true">
                  {[0, 1].map((i) => <div key={i} className="mx-row h-20 animate-pulse" />)}
                  <p className="sr-only">Loading offshore funds...</p>
                </div>
              ) : error ? (
                <div className="mx-faq-item p-8 text-center">
                  <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <button
                    type="button"
                    onClick={() => { setLoading(true); fetchFunds(); }}
                    className="px-4 py-2 bg-[#0017bf] text-white rounded-lg hover:opacity-90"
                  >
                    Try Again
                  </button>
                </div>
              ) : funds.length === 0 ? (
                <div className="mx-faq-item p-8">
                  <p className="text-muted-foreground mb-2">
                    No offshore funds are currently available. Please contact us for more information.
                  </p>
                  <p className="mx-mono font-semibold text-[#0017bf] dark:text-[#9AA6EF]">info@axysinvestmentbank.com</p>
                </div>
              ) : (
                <>
                  {funds.map((fund) => (
                    <Link key={fund._id} href={`/global-markets?fundId=${fund._id}`} className="mx-row group">
                      <span className="mx-service-icon !w-11 !h-11 shrink-0"><TrendingUp /></span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground">{fund.fundName}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{fund.description}</p>
                      </div>
                      <ArrowRight className="mx-arrow w-5 h-5 text-[#0017bf] dark:text-[#9AA6EF] flex-shrink-0" />
                    </Link>
                  ))}
                  <Notice tone="info" title="More offshore funds">
                    For more information on other offshore funds, please contact us at:{' '}
                    <span className="mx-mono font-semibold">info@axysinvestmentbank.com</span>
                  </Notice>
                </>
              )}
            </MethodBlock>
          </div>

          {/* Email Notification */}
          <Reveal className="lg:sticky lg:top-40 scroll-mt-40" id="notify">
            <NotifyCard step="Step 02" subject="Offshore Funds Deposit: [Your Full Name]">
              <div>
                <p className="text-[#9AA6EF] mb-2">Include in Email:</p>
                <ul className="mx-mono text-xs text-white/90 space-y-1.5">
                  <li>- Your CDSC Account Number or AXYS Investment Bank Client Code</li>
                  <li>- Specific offshore fund you wish to invest in</li>
                  <li>- Amount deposited</li>
                </ul>
              </div>
            </NotifyCard>
          </Reveal>
        </div>
      </Section>
    </div>
  );
}
