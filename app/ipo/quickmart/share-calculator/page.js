'use client';

import { useState } from 'react';
import Link from 'next/link';
import GlassCard from '@/components/GlassCard';
import { QUICKMART_IPO } from '@/lib/quickmart-ipo';
import { CountUp } from '@/components/motion';
import { PageHero, Section } from '@/components/layout/PageLayout';

const { pricePerShareKes, minShares, shareIncrement } = QUICKMART_IPO;
const minAmount = minShares * pricePerShareKes;

const kes = (value) => `KES ${value.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Shares must be at least the minimum and then go up in fixed increments,
// so round down to the nearest valid lot.
function calculateQuickmartShares(amount) {
  const affordable = Math.floor(amount / pricePerShareKes);
  if (affordable < minShares) return null;
  const shares = minShares + Math.floor((affordable - minShares) / shareIncrement) * shareIncrement;
  const cost = shares * pricePerShareKes;
  return { shares, cost, balance: amount - cost };
}

export default function QuickmartShareCalculatorPage() {
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  function handleCalculate(event) {
    event.preventDefault();
    setResult(null);
    const parsed = Number(amount);
    if (!amount.trim() || !Number.isFinite(parsed) || parsed <= 0) {
      setError('Enter a valid KES amount greater than zero.');
      return;
    }
    const calculated = calculateQuickmartShares(parsed);
    if (!calculated) {
      setError(`The minimum application is ${minShares} shares (${kes(minAmount)}).`);
      return;
    }
    setError('');
    setResult(calculated);
  }

  return (
    <main className="min-h-screen">
      <PageHero
        crumbs={[{ label: 'IPO', href: '/ipo' }, { label: 'Quick Mart PLC IPO', href: '/ipo/quickmart' }, { label: 'Share Calculator' }]}
        eyebrow="Quick Mart PLC IPO"
        title="Share Calculator"
        subtitle={<>Estimate how many Quickmart shares your investment buys at the Offer Price of {kes(pricePerShareKes)} per share.</>}
      />

      <Section tone="tint" containerClassName="max-w-3xl">

        <GlassCard className="p-5 sm:p-8">
          <form onSubmit={handleCalculate} noValidate>
            <label htmlFor="investment-kes" className="mb-2 block text-sm font-semibold">Investment amount (KES) <span aria-hidden="true">*</span></label>
            <input
              id="investment-kes"
              name="amount"
              type="number"
              min={minAmount}
              step="any"
              required
              value={amount}
              onChange={(event) => { setAmount(event.target.value); setResult(null); }}
              placeholder={`e.g. ${minAmount.toLocaleString('en-KE')}`}
              className="w-full rounded-lg border bg-background px-4 py-3 text-foreground outline-none transition focus:ring-2 focus:ring-[#1477bb]"
              aria-describedby="investment-help"
            />
            <p id="investment-help" className="mt-2 text-xs text-muted-foreground">
              Minimum {minShares} shares ({kes(minAmount)}), then in multiples of {shareIncrement} shares.
            </p>
            <button type="submit" className="mt-6 w-full rounded-lg bg-[#0017bf] px-6 py-3.5 font-semibold text-white transition hover:bg-[#1477bb] sm:w-auto">
              Calculate shares
            </button>
            {error && <p className="mt-4 text-sm font-medium text-red-600 dark:text-red-400" role="alert">{error}</p>}
          </form>
        </GlassCard>

        {result && (
          <section className="mt-8 mx-result-in" aria-live="polite" aria-labelledby="results-heading">
            <GlassCard className="overflow-hidden">
              <div className="border-b border-border p-5 sm:px-7">
                <h2 id="results-heading" className="text-xl font-bold">Your estimate</h2>
              </div>
              <table className="w-full border-collapse text-sm">
                <tbody>
                  {[
                    ['Offer price per share', kes(pricePerShareKes)],
                    ['Amount to pay', kes(result.cost)],
                    ['Unused balance', kes(result.balance)],
                  ].map(([label, value]) => (
                    <tr key={label} className="border-b border-border">
                      <th scope="row" className="px-5 py-3 text-left font-medium text-muted-foreground sm:px-7">{label}</th>
                      <td className="px-5 py-3 text-right font-semibold tabular-nums sm:px-7">{value}</td>
                    </tr>
                  ))}
                  <tr className="bg-[#0017bf] text-white dark:bg-[#1477bb]">
                    <th scope="row" className="px-5 py-5 text-left text-base font-bold sm:px-7">NUMBER OF SHARES</th>
                    <td className="px-5 py-5 text-right text-xl font-bold tabular-nums sm:px-7"><CountUp value={result.shares} locale="en-KE" duration={0.7} /></td>
                  </tr>
                </tbody>
              </table>
              <p className="px-5 py-4 text-xs text-muted-foreground sm:px-7">
                This is an estimate only. Final allotment depends on demand and may be scaled back if the Offer is oversubscribed.
              </p>
            </GlassCard>
          </section>
        )}
      </Section>
    </main>
  );
}
