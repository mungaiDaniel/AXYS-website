'use client';

import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Stagger, TiltCard } from '@/components/motion';
import { PageHero, Section } from '@/components/layout/PageLayout';

const CURRENCY_SYMBOLS = { USD: '$', EUR: '€', GBP: '£' };

function getTimeRemaining(expiryDate, now) {
  const target = new Date(expiryDate).getTime();
  if (!expiryDate || Number.isNaN(target)) return { text: 'Not set', expired: true };
  const difference = target - now;
  if (difference <= 0) return { text: 'Expired', expired: true };
  const days = Math.floor(difference / 86400000);
  const hours = Math.floor((difference % 86400000) / 3600000);
  const minutes = Math.floor((difference % 3600000) / 60000);
  return { text: `${days ? `${days}d ` : ''}${hours}h ${minutes}m`, expired: false };
}

export default function ExchangeRatesPage() {
  const [rates, setRates] = useState([]);
  const [now, setNow] = useState(Date.now());
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('/api/exchange-rates', { cache: 'no-store' });
        if (!response.ok) throw new Error('Unable to load exchange rates');
        const data = await response.json();
        setRates(data.rates || []);
      } catch (fetchError) {
        console.error('Exchange rate fetch error:', fetchError);
        setError('Exchange rates are temporarily unavailable.');
      }
    };
    fetchRates();
    const refreshRates = setInterval(fetchRates, 60000);
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => { clearInterval(refreshRates); clearInterval(timer); };
  }, []);

  return (
    <div className="min-h-screen">
      <PageHero
        crumbs={[{ label: 'Exchange Rates' }]}
        eyebrow="Markets"
        title="Daily Exchange Rates"
        subtitle="Rates and validity times are shown in East Africa Time (EAT)."
        actions={
          <a href="/fund-account/multi-currency" className="mx-btn px-6 py-3 bg-white text-[#00005B] rounded-lg font-semibold">
            USD &amp; GBP funding <ArrowRight className="mx-arrow w-4 h-4" />
          </a>
        }
      />

      <Section tone="tint" containerClassName="max-w-6xl">
        {error ? (
          <div className="mx-notice"><p>{error}</p></div>
        ) : rates.length === 0 ? (
          <div className="mx-faq-item p-8 text-center"><p className="text-muted-foreground">No exchange rates are available right now.</p></div>
        ) : (
          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rates.map((rate) => {
              const buyStatus = getTimeRemaining(rate.buyExpiryDate || rate.expiryDate, now);
              const sellStatus = getTimeRemaining(rate.sellExpiryDate || rate.expiryDate, now);
              return (
                <TiltCard key={rate._id || rate.currency} className="mx-fund-card h-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="mx-avatar !w-11 !h-11 !text-lg">{CURRENCY_SYMBOLS[rate.currency]}</span>
                      <div>
                        <h2 className="mx-mono font-bold text-white text-lg">{rate.currency}/KES</h2>
                        <span className="mx-mono text-[11px] text-[#9AA6EF]">1 {rate.currency} in KES</span>
                      </div>
                    </div>
                    {rate.comingSoon && <span className="mx-chip !text-[10px]">Coming soon</span>}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-7">
                    <div>
                      <p className="mx-mono text-[10px] uppercase tracking-[0.16em] text-[#9AA6EF]/70">We buy</p>
                      <p className="mx-mono text-2xl font-bold text-[#3ddc9c]">{Number(rate.buyRate || rate.rate).toFixed(2)}</p>
                      <p className="text-[11px] text-[#9AA6EF]/80 mt-2">Valid until (EAT)</p>
                      <p className={`mx-mono text-xs font-semibold ${buyStatus.expired ? 'text-red-400' : 'text-white'}`}>{buyStatus.text}</p>
                    </div>
                    <div className="border-l border-white/10 pl-4">
                      <p className="mx-mono text-[10px] uppercase tracking-[0.16em] text-[#9AA6EF]/70">We sell</p>
                      <p className="mx-mono text-2xl font-bold text-[#ff8a8a]">{Number(rate.sellRate || rate.rate).toFixed(2)}</p>
                      <p className="text-[11px] text-[#9AA6EF]/80 mt-2">Valid until (EAT)</p>
                      <p className={`mx-mono text-xs font-semibold ${sellStatus.expired ? 'text-red-400' : 'text-white'}`}>{sellStatus.text}</p>
                    </div>
                  </div>
                  <div className="mx-fund-line" aria-hidden="true" />
                </TiltCard>
              );
            })}
          </Stagger>
        )}
      </Section>
    </div>
  );
}
