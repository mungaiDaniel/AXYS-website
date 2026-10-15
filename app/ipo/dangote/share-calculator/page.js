'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import GlassCard from '@/components/GlassCard';
import {
  calculateDangoteShares,
  DANGOTE_CALCULATOR_CONFIG,
  formatCalculatorNumber,
  getDefaultProcessingFee,
  getFormattedResultBoxes,
} from '@/lib/dangote-share-calculator';
import {
  applyCachedLiveRate,
  editRateValue,
  preserveRateAfterFailure,
  rateDiffersFromLive,
  resetRateToLive,
} from '@/lib/dangote-rate-state';
import { PageHero, Section } from '@/components/layout/PageLayout';

const disclaimer = 'This is an estimate only. Actual exchange rates, charges and allotment may differ.';

function currency(value, currencyCode) {
  return `${currencyCode} ${formatCalculatorNumber(value)}`;
}

export default function DangoteShareCalculatorPage() {
  const [amount, setAmount] = useState('');
  const [customRate, setCustomRate] = useState('');
  const [processingFee, setProcessingFee] = useState(() => getDefaultProcessingFee(''));
  const [processingFeeEdited, setProcessingFeeEdited] = useState(false);
  const [bankCharges, setBankCharges] = useState(DANGOTE_CALCULATOR_CONFIG.BANK_CHARGES_USD);
  const [fxCost, setFxCost] = useState(DANGOTE_CALCULATOR_CONFIG.FX_CHARGES_USD);
  const [otherCosts, setOtherCosts] = useState(DANGOTE_CALCULATOR_CONFIG.OTHER_COSTS_USD);
  const [costErrors, setCostErrors] = useState({});
  const [rate, setRate] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [resultRateSource, setResultRateSource] = useState('Live rate');
  const [rateError, setRateError] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [initialRateLoading, setInitialRateLoading] = useState(true);
  const rateRef = useRef(null);
  const customRateRef = useRef('');
  const manualRateRef = useRef(false);
  async function readCachedRate() {
    const response = await fetch('/api/exchange-rate', { cache: 'no-store' });
    const data = await response.json();
    if (!response.ok || typeof data.rate !== 'number' || !Number.isFinite(data.rate) || data.rate <= 0) {
      throw new Error(data.error || 'Live rate is unavailable.');
    }
    return data;
  }

  useEffect(() => {
    let active = true;
    readCachedRate()
      .then((data) => {
        if (!active) return;
        const nextRate = String(data.rate);
        const updated = applyCachedLiveRate({
          currentBoxValue: customRateRef.current,
          manualOverride: manualRateRef.current,
          nextRate,
        });
        rateRef.current = updated.liveRate;
        customRateRef.current = updated.boxValue;
        setRate(updated.liveRate);
        setCustomRate(updated.boxValue);
        setUpdatedAt(data.updatedAt);
      })
      .catch(() => {
        if (active) setRateError(preserveRateAfterFailure(customRateRef.current, rateRef.current).message);
      })
      .finally(() => {
        if (active) setInitialRateLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleCalculate(event) {
    event.preventDefault();
    setResult(null);
    setError('');
    const nextCostErrors = {};
    [
      ['processingFee', processingFee, 'Processing fee'],
      ['bankCharges', bankCharges, 'Bank charges'],
      ['fxCost', fxCost, 'FX cost'],
      ['otherCosts', otherCosts, 'Other costs'],
    ].forEach(([field, value, label]) => {
      const input = event.currentTarget.elements.namedItem(field);
      if (input?.validity?.badInput || (value.trim() && (!/^\d+(?:\.\d+)?$/.test(value.trim()) || !Number.isFinite(Number(value)) || Number(value) < 0))) {
        nextCostErrors[field] = `${label} must be a number greater than or equal to zero.`;
      }
    });
    setCostErrors(nextCostErrors);
    if (Object.keys(nextCostErrors).length) return;

    const parsedAmount = Number(amount);
    if (!amount.trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError('Enter a valid USD amount greater than zero.');
      return;
    }

    try {
      let chosenRate = customRate.trim();
      let chosenRateSource = manualRateRef.current ? 'Manual rate' : 'Live rate';

      if (!manualRateRef.current) {
        try {
          const data = await readCachedRate();
          const nextRate = String(data.rate);
          const updated = applyCachedLiveRate({
            currentBoxValue: customRateRef.current,
            manualOverride: manualRateRef.current,
            nextRate,
          });
          rateRef.current = updated.liveRate;
          setRate(updated.liveRate);
          setUpdatedAt(data.updatedAt);

          if (!manualRateRef.current) {
            customRateRef.current = updated.boxValue;
            setCustomRate(updated.boxValue);
            chosenRate = updated.boxValue;
            setRateError('');
          } else {
            chosenRate = customRateRef.current.trim();
            chosenRateSource = 'Manual rate';
          }
        } catch {
          chosenRate = customRateRef.current.trim() || customRate.trim();
        }
      }

      if (!chosenRate) {
        throw new Error(rateRef.current
          ? 'Enter an exchange rate greater than zero.'
          : 'Live rate is unavailable. Enter an exchange rate greater than zero to continue.');
      }
      if (!/^\d+(?:\.\d+)?$/.test(chosenRate) || Number(chosenRate) <= 0) {
        throw new Error('Enter a valid exchange rate greater than zero.');
      }
      chosenRateSource = manualRateRef.current ? 'Manual rate' : 'Live rate';
      const calculated = calculateDangoteShares(
        amount,
        chosenRate,
        processingFee.trim(),
        bankCharges.trim(),
        fxCost.trim(),
        otherCosts.trim(),
      );
      setResult(calculated);
      setResultRateSource(chosenRateSource);
      setError('');
    } catch (calculationError) {
      setError(calculationError.message || 'Unable to calculate the share estimate.');
    }
  }

  const resultBoxes = getFormattedResultBoxes(result);
  const rows = result ? [
    ['Amount (USD)', currency(result.amountUsd, 'USD')],
    ['Processing fee (USD)', currency(result.processingFeeUsd, 'USD')],
    ['Bank charges (USD)', currency(result.bankChargesUsd, 'USD')],
    ['FX cost (USD)', currency(result.fxChargesUsd, 'USD')],
    ['Other costs (USD)', currency(result.otherCostsUsd, 'USD')],
    ['Total cost (USD)', currency(result.totalCostUsd, 'USD')],
    ['Net consideration (USD)', currency(result.netConsiderationUsd, 'USD')],
    [`Exchange rate (NGN/USD, ${resultRateSource === 'Live rate' ? 'Live mid-market rate' : resultRateSource})`, formatCalculatorNumber(result.exchangeRate, 4, 4)],
    ['Net consideration (NGN)', currency(result.netConsiderationNgn, 'NGN')],
    ['Price per share (NGN)', currency(result.pricePerShareNgn, 'NGN')],
  ] : [];

  return (
    <main className="min-h-screen">
      <PageHero
        crumbs={[{ label: 'IPO', href: '/ipo' }, { label: 'Dangote Petroleum Refinery IPO', href: '/ipo/dangote' }, { label: 'Share Calculator' }]}
        eyebrow="Dangote Petroleum Refinery IPO"
        title="Share Calculator"
        subtitle={<>Estimate the number of Dangote IPO shares available after fees and currency conversion.</>}
      />

      <Section tone="tint" containerClassName="max-w-4xl">

        <GlassCard className="p-5 sm:p-8">
          <form onSubmit={handleCalculate} noValidate>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="investment-usd" className="mb-2 block text-sm font-semibold">Investment amount (USD) <span aria-hidden="true">*</span></label>
                <input
                  id="investment-usd"
                  name="amount"
                  type="number"
                  min="0.01"
                  step="any"
                  required
                  value={amount}
                  onChange={(event) => {
                    const nextAmount = event.target.value;
                    setResult(null);
                    setAmount(nextAmount);
                    if (!processingFeeEdited) setProcessingFee(getDefaultProcessingFee(nextAmount));
                  }}
                  placeholder="e.g. 2,000"
                  className="w-full rounded-lg border bg-background px-4 py-3 text-foreground outline-none transition focus:ring-2 focus:ring-[#1477bb]"
                  aria-describedby="investment-help"
                />
                
                <p id="investment-help" className="mt-2 text-xs text-muted-foreground">Enter the total USD amount you plan to invest.</p>
              </div>
              <div>
                <label htmlFor="custom-rate" className="mb-2 block text-sm font-semibold">USD to NAIRA Exchange rate <span className="font-normal text-muted-foreground">(optional)</span></label>
                <input
                  id="custom-rate"
                  name="customRate"
                  type="number"
                  min="0.000001"
                  step="any"
                  value={customRate}
                  onChange={(event) => {
                    const edited = editRateValue(event.target.value, rateRef.current);
                    manualRateRef.current = edited.manualOverride;
                    customRateRef.current = edited.boxValue;
                    setResult(null);
                    setCustomRate(edited.boxValue);
                    if (edited.manualOverride || rateRef.current) setRateError('');
                    else setRateError('Live rate unavailable. Enter a rate manually.');
                  }}
                  placeholder={!rate && initialRateLoading ? 'Loading live rate…' : 'NGN per 1 USD'}
                  className="w-full rounded-lg border bg-background px-4 py-3 text-foreground outline-none transition focus:ring-2 focus:ring-[#1477bb]"
                  aria-describedby="rate-help"
                  aria-busy={!rate && initialRateLoading}
                />
                <p id="rate-help" className="mt-2 text-xs text-muted-foreground">Auto-filled with the live mid-market rate. You can edit it to use your own rate.</p>
                {rateDiffersFromLive(customRate, rate) && (
                  <button
                    type="button"
                    onClick={() => {
                      const reset = resetRateToLive(rateRef.current);
                      manualRateRef.current = reset.manualOverride;
                      customRateRef.current = reset.boxValue;
                      setCustomRate(reset.boxValue);
                      setResult(null);
                      setRateError('');
                    }}
                    className="mt-2 text-xs font-semibold text-[#0017bf] hover:underline dark:text-[#55b9e8]"
                  >
                    Reset to live rate
                  </button>
                )}
              </div>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {[
                { id: 'processing-fee', name: 'processingFee', label: 'Processing fee (USD)', hint: `(${DANGOTE_CALCULATOR_CONFIG.PROCESSING_FEE_PERCENT}% of amount)`, placeholder: '0.00', helper: 'Defaults to 2% of the investment amount.', value: processingFee, setValue: setProcessingFee, processingFee: true },
                { id: 'bank-charges', name: 'bankCharges', label: 'Bank charges (USD) subject to bank', placeholder: 'e.g. 10', helper: 'Enter the bank charges in USD.', value: bankCharges, setValue: setBankCharges },
                { id: 'fx-cost', name: 'fxCost', label: 'FX cost (USD) subject to bank', placeholder: 'e.g. 5', helper: 'Enter the foreign exchange cost in USD.', value: fxCost, setValue: setFxCost },
                { id: 'other-costs', name: 'otherCosts', label: 'Other costs (USD) subject to bank', placeholder: 'e.g. 0', helper: 'Any other cost in USD (optional).', value: otherCosts, setValue: setOtherCosts },
              ].map((field) => (
                <div key={field.id}>
                  <label htmlFor={field.id} className="mb-2 block text-sm font-semibold">
                    {field.label} {field.hint && <span className="font-normal text-muted-foreground">{field.hint}</span>}
                  </label>
                  <input
                    id={field.id}
                    name={field.name}
                    type="number"
                    min="0"
                    step="any"
                    value={field.value}
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      setResult(null);
                      if (field.processingFee) {
                        if (nextValue === '') {
                          setProcessingFeeEdited(false);
                          setProcessingFee(getDefaultProcessingFee(amount));
                        } else {
                          setProcessingFeeEdited(true);
                          field.setValue(nextValue);
                        }
                      } else {
                        field.setValue(nextValue);
                      }
                    }}
                    placeholder={field.placeholder}
                    className="w-full rounded-lg border bg-background px-4 py-3 text-foreground outline-none transition focus:ring-2 focus:ring-[#1477bb]"
                    aria-invalid={Boolean(costErrors[field.name])}
                    aria-describedby={`${field.id}-help${costErrors[field.name] ? ` ${field.id}-error` : ''}`}
                  />
                  <p id={`${field.id}-help`} className="mt-2 text-xs text-muted-foreground">{field.helper}</p>
                  {costErrors[field.name] && <p id={`${field.id}-error`} className="mt-2 text-xs text-red-600 dark:text-red-400" role="alert">{costErrors[field.name]}</p>}
                </div>
              ))}
              <button type="submit" className="mt-7 w-full rounded-lg bg-[#0017bf] px-6 py-3.5 font-semibold text-white transition hover:bg-[#1477bb] sm:w-auto">
              Calculate shares
            </button>
              
            <div className="sm:col-span-2">
                <label id="total-cost-usd-label" className="mb-2 block text-sm font-semibold">Total Cost In USD</label>
                <output
                  aria-labelledby="total-cost-usd-label"
                  aria-live="polite"
                  className="flex min-h-[50px] w-full items-center rounded-lg border bg-muted/50 px-4 py-3 text-xl font-bold tabular-nums text-foreground"
                >
                  {resultBoxes.totalCostUsd}
                </output>
              </div>
              <div className="sm:col-span-2">
                <label id="net-consideration-usd-label" className="mb-2 block text-sm font-semibold">Net Consideration in USD</label>
                <output
                  aria-labelledby="net-consideration-usd-label"
                  aria-live="polite"
                  className="flex min-h-[50px] w-full items-center rounded-lg border bg-muted/50 px-4 py-3 text-xl font-bold tabular-nums text-foreground"
                >
                  {resultBoxes.netConsiderationUsd}
                </output>
              </div>
              <div className="sm:col-span-2">
                <label id="net-consideration-ngn-label" className="mb-2 block text-sm font-semibold">Net Consideration in NAIRA</label>
                <output
                  aria-labelledby="net-consideration-ngn-label"
                  aria-live="polite"
                  className="flex min-h-[50px] w-full items-center rounded-lg border bg-muted/50 px-4 py-3 text-xl font-bold tabular-nums text-foreground"
                >
                  {resultBoxes.netConsiderationNgn}
                </output>
              </div>
              <div className="sm:col-span-2">
                <label id="price-per-share-ngn-label" className="mb-2 block text-sm font-semibold">Price Per Share in NAIRA</label>
                <output
                  aria-labelledby="price-per-share-ngn-label"
                  aria-live="polite"
                  className="flex min-h-[50px] w-full items-center rounded-lg border bg-muted/50 px-4 py-3 text-xl font-bold tabular-nums text-foreground"
                >
                  {resultBoxes.pricePerShareNgn}
                </output>
              </div>
              <div className="sm:col-span-2">
                <label id="total-shares-label" className="mb-2 block text-sm font-semibold">Total shares</label>
                <output
                  aria-labelledby="total-shares-label"
                  aria-live="polite"
                  className="flex min-h-[50px] w-full items-center rounded-lg border bg-muted/50 px-4 py-3 text-xl font-bold tabular-nums text-foreground"
                >
                  {resultBoxes.numberOfShares}
                </output>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-muted-foreground" aria-live="polite">
              {rate && <span>Current mid-market rate: <strong className="text-foreground">NGN {formatCalculatorNumber(rate, 4, 4)} / USD</strong></span>}
              {updatedAt && <span>Updated {new Date(updatedAt).toLocaleString()}</span>}
              <a href="https://www.exchangerate-api.com" target="_blank" rel="noreferrer" className="underline underline-offset-2">Rates by ExchangeRate-API</a>
            </div>

            {rateError && <p className="mt-3 text-sm text-red-600 dark:text-red-400" role="alert">{rateError}</p>}
            {error && <p className="mt-4 text-sm font-medium text-red-600 dark:text-red-400" role="alert">{error}</p>}

            
          </form>
        </GlassCard>

        {result && (
          <section className="mt-8 mx-result-in" aria-live="polite" aria-labelledby="results-heading">
            <GlassCard className="overflow-hidden">
              <div className="border-b border-border p-5 sm:px-7">
                <h2 id="results-heading" className="text-xl font-bold">Your estimate</h2>
                <p className="mt-1 text-sm text-muted-foreground">The exchange rate is shown as NGN per USD and is multiplied by your net USD amount.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[420px] border-collapse text-sm">
                  <tbody>
                    {rows.map(([label, value]) => (
                      <tr key={label} className="border-b border-border last:border-0">
                        <th scope="row" className="px-5 py-3 text-left font-medium text-muted-foreground sm:px-7">{label}</th>
                        <td className="px-5 py-3 text-right font-semibold tabular-nums sm:px-7">{value}</td>
                      </tr>
                    ))}
                    <tr className="bg-[#0017bf] text-white dark:bg-[#1477bb]">
                      <th scope="row" className="px-5 py-5 text-left text-base font-bold sm:px-7">NUMBER OF SHARES</th>
                      <td className="px-5 py-5 text-right text-xl font-bold tabular-nums sm:px-7">{formatCalculatorNumber(result.numberOfShares, 0, 0)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="px-5 py-4 text-xs text-muted-foreground sm:px-7">{disclaimer}</p>
            </GlassCard>
          </section>
        )}
      </Section>
    </main>
  );
}
