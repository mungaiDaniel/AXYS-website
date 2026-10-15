'use client';

import { useState, useEffect } from 'react';
import GlassCard from '@/components/GlassCard';
import ScrollReveal from '@/components/ScrollReveal';
import { Clock, RefreshCw, TrendingUp, Mail, AlertCircle, ArrowDownToLine, Building2, Smartphone, ArrowUpToLine } from 'lucide-react';
import { PageHero, Section, QuickLinks } from '@/components/layout/PageLayout';
import { FundingNav } from '@/components/layout/Funding';

export default function MultiCurrencyPage() {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [foreignAmount, setForeignAmount] = useState('');
  const [kshAmount, setKshAmount] = useState('');
  const [countdown, setCountdown] = useState({});
  const [expandedDepositCurrency, setExpandedDepositCurrency] = useState(null);

  const toggleDepositSection = (currency) => {
    setExpandedDepositCurrency(expandedDepositCurrency === currency ? null : currency);
  };

  // Get available deposit currencies - mirrors Currency Converter logic
  // KSH is always available, plus any currency marked as active (isActive: true)
  const getAvailableDepositCurrencies = () => {
    const kshCurrency = ['KSH']; // KSH is always available
    const activeForeignCurrencies = rates
      .filter(r => r.isActive !== false && r.currency !== 'EUR') // Show all active currencies (excluding EUR)
      .map(r => r.currency);
    return [...new Set([...kshCurrency, ...activeForeignCurrencies])];
  };

  // Check if a specific currency is available (isActive and not hidden by admin)
  const isCurrencyAvailable = (currency) => {
    if (currency === 'KSH') return true; // KSH is always available
    if (currency === 'EUR') return false; // EUR is disabled for deposits
    return rates.some(r => r.currency === currency && r.isActive !== false);
  };

  // Auto-collapse expanded section if the currency is no longer available
  useEffect(() => {
    if (expandedDepositCurrency && !isCurrencyAvailable(expandedDepositCurrency)) {
      setExpandedDepositCurrency(null); // Collapse if currency is no longer available
    }
  }, [rates, expandedDepositCurrency]);

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchRates = async () => {
    setFetchError(null);
    try {
      const response = await fetch('/api/exchange-rates', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) {
        setFetchError(data.error || 'Failed to load rates');
        setRates([]);
        return;
      }
      setRates(data.rates || []);
      if (data.rates && data.rates.length > 0 && !selectedCurrency) {
        setSelectedCurrency(data.rates[0].currency);
      }
    } catch (error) {
      console.error('Error fetching rates:', error);
      setFetchError('Unable to load exchange rates. Please try again later.');
      setRates([]);
    } finally {
      setLoading(false);
    }
  };

  const selectedRate = rates.find((r) => r.currency === selectedCurrency);

  const handleConvert = (value, direction) => {
    if (!selectedRate || !value) {
      setForeignAmount('');
      setKshAmount('');
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    if (direction === 'toKsh') {
      setForeignAmount(value);
      setKshAmount((numValue * selectedRate.rate).toFixed(2));
    } else {
      setKshAmount(value);
      setForeignAmount((numValue / selectedRate.rate).toFixed(2));
    }
  };

  const getCurrencyIcon = (currency) => {
    switch (currency) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      default: return '$';
    }
  };

  const getTimeRemaining = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diff = expiry - now;

    if (diff <= 0) return 'Expired';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const newCountdown = {};
      rates.forEach((rate) => {
        newCountdown[rate.currency] = getTimeRemaining(rate.expiryDate);
      });
      setCountdown(newCountdown);
    }, 1000);

    return () => clearInterval(timer);
  }, [rates]);

  return (
    <div className="min-h-screen">
      <PageHero
        crumbs={[{ label: 'Fund Account' }, { label: 'USD & GBP' }]}
        eyebrow="Fund Account"
        title="Multi-Currency Account Funding"
        subtitle="Deposit and convert foreign currency at live rates"
        aside={
          <QuickLinks
            eyebrow="On this page"
            icon={RefreshCw}
            links={[
              { label: 'Exchange Rates', href: '#rates' },
              { label: 'Currency Converter', href: '#converter' },
              { label: 'Deposit Instructions', href: '#deposit' },
              { label: 'Withdraw Funds', href: '#withdraw' },
            ]}
          />
        }
      />
      <FundingNav />

      <Section tone="white" id="rates" className="scroll-mt-32" containerClassName="max-w-6xl">

        {/* Exchange Rates */}
        <ScrollReveal type="fadeUp" className="flex justify-center mb-12">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading exchange rates...</p>
            </div>
          ) : fetchError ? (
            <GlassCard className="p-8 max-w-md mx-auto text-center">
              <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Unable to load rates</h3>
              <p className="text-sm text-muted-foreground mb-4">{fetchError}</p>
              <button
                type="button"
                onClick={() => { setLoading(true); fetchRates(); }}
                className="px-4 py-2 bg-[#0017bf] dark:bg-[#00005b] text-white rounded-lg hover:opacity-90"
              >
                Try again
              </button>
            </GlassCard>
          ) : rates.filter(r => !r.comingSoon).length === 0 ? (
            <GlassCard className="p-8 max-w-2xl mx-auto text-center">
              <TrendingUp className="w-12 h-12 text-[#0017bf] dark:text-cyan-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No exchange rates available yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Rates are set by the administrator. Please check back later or contact us at{' '}
                <a href="mailto:info@axysinvestmentbank.com" className="text-[#0017bf] dark:text-cyan-400 hover:underline">info@axysinvestmentbank.com</a>.
              </p>
            </GlassCard>
          ) : (
            <div className={`grid grid-cols-1 ${rates.length === 1 ? 'md:grid-cols-1 max-w-md' : rates.length === 2 ? 'md:grid-cols-2 max-w-3xl' : 'md:grid-cols-2 lg:grid-cols-3 max-w-7xl'} gap-8`}>
              {rates.map((rate) => {
                const isComingSoon = rate.comingSoon === true;
                const isExpired = !isComingSoon && new Date(rate.expiryDate) <= new Date();

                return (
                  <GlassCard key={rate.currency} className="p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-6xl font-bold bg-gradient-to-br from-cyan-400 to-[#0017bf] bg-clip-text text-transparent">
                        {getCurrencyIcon(rate.currency)}
                      </div>

                      {/* Valid Until / Coming Soon */}
                      <div className="text-right">
                        {isComingSoon ? (
                          <div className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                            Coming soon
                          </div>
                        ) : (
                          <>
                            <div className="text-sm font-semibold text-black dark:text-white">
                              Valid Until:
                            </div>
                            <div className={`text-lg ${isExpired ? 'text-[#ff0000]' : 'text-[#0017bf] dark:text-[#00005b]'}`}>
                              {countdown[rate.currency] || 'Loading...'}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1 text-center">Currency</div>
                        <div className="text-3xl font-bold text-center">
                          {rate.currency}
                          <span className="text-3xl"> → KSH</span>
                        </div>
                      </div>

                      {/* Buy and Sell Rates Side by Side */}
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        {/* Buy Rate */}
                        <div className="text-center">
                          <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">WE BUY</div>
                          {isComingSoon ? (
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                              TBA
                            </div>
                          ) : (
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                              {(rate.buyRate || rate.rate).toFixed(2)}
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground mt-1">KSH</div>
                        </div>

                        {/* Sell Rate */}
                        <div className="text-center">
                          <div className="text-xs font-semibold text-[#0017bf] dark:text-cyan-400 mb-2">WE SELL</div>
                          {isComingSoon ? (
                            <div className="text-3xl font-bold text-[#0017bf] dark:text-cyan-400">
                              TBA
                            </div>
                          ) : (
                            <div className="text-3xl font-bold text-[#0017bf] dark:text-cyan-400">
                              {(rate.sellRate || rate.rate).toFixed(2)}
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground mt-1">KSH</div>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground pt-2 text-center">
                        Last updated: {new Date(rate.updatedAt).toLocaleString()}
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}
        </ScrollReveal>

      </Section>

      <Section tone="tint" containerClassName="max-w-6xl">
        {/* Currency Converter */}
        <ScrollReveal type="fadeUp" className="scroll-mt-32" id="converter">
          <GlassCard className="p-8 w-full max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl font-bold gradient-text mb-6 text-center">Currency Converter</h2>

            {!loading && !fetchError && rates.filter(r => !r.comingSoon).length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                Exchange rates will appear here once they are set by the administrator.
              </p>
            )}

            {rates.filter(r => !r.comingSoon).length > 0 && (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-center">Select Currency</label>
                  <div className={`grid ${rates.filter(r => !r.comingSoon).length === 1 ? 'grid-cols-1 max-w-xs' : rates.filter(r => !r.comingSoon).length === 2 ? 'grid-cols-2 max-w-sm' : 'grid-cols-3 max-w-md'} gap-3 mx-auto`}>
                    {rates.filter(r => !r.comingSoon).map((rate) => (
                      <button
                        key={rate.currency}
                        onClick={() => setSelectedCurrency(rate.currency)}
                        className={`p-4 rounded-lg font-semibold transition-all duration-200 ${selectedCurrency === rate.currency
                          ? 'bg-[#0017bf] dark:bg-[#00005b] text-white shadow-lg shadow-[#0017bf]/50 scale-105'
                          : 'bg-gray-100 dark:bg-gray-800 text-foreground hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                      >
                        {rate.currency}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedRate && !selectedRate.comingSoon && (
                  <>
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2 text-center">{selectedCurrency} Amount</label>
                      <div className="relative max-w-md mx-auto">
                        <input
                          type="number"
                          value={foreignAmount}
                          onChange={(e) => handleConvert(e.target.value, 'toKsh')}
                          placeholder={`Enter ${selectedCurrency} amount`}
                          className="w-full px-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b] focus:border-transparent text-lg"
                        />
                      </div>
                    </div>

                    <div className="flex justify-center mb-6">
                      <div className="p-3 rounded-full bg-gradient-to-br from-cyan-400 to-[#0017bf] text-white">
                        <RefreshCw className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2 text-center">KSH Amount</label>
                      <div className="relative max-w-md mx-auto">
                        <input
                          type="number"
                          value={kshAmount}
                          onChange={(e) => handleConvert(e.target.value, 'fromKsh')}
                          placeholder="Enter KSH amount"
                          className="w-full px-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b] focus:border-transparent text-lg"
                        />
                      </div>
                    </div>

                    {foreignAmount && kshAmount && (
                      <div className="p-6 bg-gradient-to-br from-[#0017bf] dark:from-[#00005b]/10 to-cyan-400/10 rounded-lg border-2 border-[#0017bf]/20 max-w-md mx-auto">
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground mb-2">Conversion Result</div>
                          <div className="text-3xl font-bold text-[#0017bf] dark:text-cyan-400">
                            {foreignAmount} {selectedCurrency} = {kshAmount} KSH
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </GlassCard>
        </ScrollReveal>

        {/* Deposit Instructions with Inline Accordion */}
        <div id="deposit" className="scroll-mt-32" />
        <ScrollReveal type="fadeUp">
          <GlassCard className="p-8 mb-8">
            <h2 className="text-2xl font-bold gradient-text mb-6 text-center">Deposit Instructions</h2>
            <p className="text-center text-muted-foreground mb-8">
              Select your currency to view the bank account details for deposit.
            </p>

            {/* Currency Selector - Dynamic Based on Admin Settings */}
            <div className="flex justify-center gap-4 mb-8 flex-wrap">
              {getAvailableDepositCurrencies().map((currency) => (
                <button
                  key={currency}
                  onClick={() => toggleDepositSection(currency)}
                  className={`flex-1 min-w-[120px] max-w-[140px] px-8 py-4 rounded-lg font-semibold transition-all duration-300 ${
                    expandedDepositCurrency === currency
                      ? 'bg-[#0017bf] dark:bg-[#00005b] text-white shadow-lg shadow-[#0017bf]/50 scale-105'
                      : 'bg-gray-100 dark:bg-gray-800 text-foreground hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {currency}
                </button>
              ))}
            </div>

            {/* Accordion Content - KSH */}
            {expandedDepositCurrency === 'KSH' && (
              <div className="space-y-6 mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
                {/* Deposit Details Section */}
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <Smartphone className="w-8 h-8 transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />
                    </div>
                    <h3 className="text-xl font-bold">A) Via M-Pesa</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="backdrop-blur-md bg-white/60 dark:bg-[#0a0a0f]/60 border border-gray-200/30 dark:border-white/10 p-4 rounded-lg shadow-lg">
                      <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Paybill Number</div>
                      <div className="text-3xl font-bold text-green-600">548800</div>
                    </div>

                    <div className="backdrop-blur-md bg-white/60 dark:bg-[#0a0a0f]/60 border border-gray-200/30 dark:border-white/10 p-4 rounded-lg shadow-lg">
                      <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Account Number</div>
                      <div className="text-lg font-bold text-red-600">[Your CDSC Account No.]</div>
                      <div className="text-xs text-red-600 mt-1 font-semibold">Do not include the initial zeros</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 mb-6 mt-8">
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <Building2 className="w-8 h-8 transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />
                    </div>
                    <h3 className="text-xl font-bold">B) Via Bank</h3>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-4 transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]">i) Equity Bank</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="backdrop-blur-md bg-white/60 dark:bg-[#0a0a0f]/60 border border-gray-200/30 dark:border-white/10 p-4 rounded-lg shadow-lg">
                        <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Bank Name</div>
                        <div className="text-base font-bold text-foreground">Equity Bank</div>
                      </div>

                      <div className="backdrop-blur-md bg-white/60 dark:bg-[#0a0a0f]/60 border border-gray-200/30 dark:border-white/10 p-4 rounded-lg shadow-lg">
                        <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Account Name</div>
                        <div className="text-base font-bold text-foreground">AIB-AXYS Africa Limited - Client Account</div>
                      </div>

                      <div className="backdrop-blur-md bg-white/60 dark:bg-[#0a0a0f]/60 border border-gray-200/30 dark:border-white/10 p-4 rounded-lg shadow-lg">
                        <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Account Number</div>
                        <div className="text-lg font-bold text-[#0017bf] dark:text-cyan-400">0180290140655</div>
                      </div>
                    </div>

                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-red-600 mb-1">Important</div>
                          <div className="text-sm text-red-600">
                            Your CDSC Account Number or AXYS Investment Bank Client Code must be included to facilitate the allocation of funds.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-4 transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]\">ii) Stanbic Bank</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="backdrop-blur-md bg-white/60 dark:bg-[#0a0a0f]/60 border border-gray-200/30 dark:border-white/10 p-4 rounded-lg shadow-lg">
                        <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Bank Name</div>
                        <div className="text-base font-bold text-foreground">Stanbic Bank</div>
                      </div>

                      <div className="backdrop-blur-md bg-white/60 dark:bg-[#0a0a0f]/60 border border-gray-200/30 dark:border-white/10 p-4 rounded-lg shadow-lg">
                        <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Account Name</div>
                        <div className="text-base font-bold text-foreground">AXYS Investment Bank Limited -Client Account</div>
                      </div>

                      <div className="backdrop-blur-md bg-white/60 dark:bg-[#0a0a0f]/60 border border-gray-200/30 dark:border-white/10 p-4 rounded-lg shadow-lg">
                        <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Account Number</div>
                        <div className="text-lg font-bold text-[#0017bf] dark:text-cyan-400">0100000733363</div>
                      </div>
                    </div>

                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-red-600 mb-1">Important</div>
                          <div className="text-sm text-red-600">
                            Your CDSC Account Number or AXYS Investment Bank Client Code must be included along with specific instructions to facilitate the allocation of funds.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notify Us Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-cyan-500/10 rounded-lg">
                      <ArrowDownToLine className="w-8 h-8 text-cyan-600" />
                    </div>
                    <h3 className="text-xl font-bold">After Deposit - Notify Us</h3>
                  </div>

                  <p className="text-muted-foreground mb-6">
                    Once you've deposited, please notify us immediately for swift allocation by sending a copy of the transaction confirmation slip via email.
                  </p>

                  <div className="backdrop-blur-md bg-white/60 dark:bg-[#0a0a0f]/60 border border-gray-200/30 dark:border-white/10 p-6 rounded-lg shadow-lg">
                    <div className="text-sm font-semibold text-muted-foreground uppercase mb-4">Email Format</div>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-semibold">To:</span> <span className="transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]">info@axysinvestmentbank.com</span>
                      </div>
                      <div>
                        <span className="font-semibold">Subject:</span> <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Local Stocks Deposit: [Your Full Name]</span>
                      </div>
                      <div>
                        <span className="font-semibold">Attach:</span> Transaction confirmation slip
                      </div>
                      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded">
                        <div className="text-xs font-semibold text-muted-foreground uppercase mb-3">Include in Email:</div>
                        <ul className="space-y-2 text-xs text-muted-foreground">
                          <li className="flex items-start space-x-2">
                            <span className="text-[#0017bf] dark:text-[#00005b] font-bold">•</span>
                            <span>Your CDSC Account Number or AXYS Investment Bank Client Code</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-[#0017bf] dark:text-[#00005b] font-bold">•</span>
                            <span>Amount deposited</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-[#0017bf] dark:text-[#00005b] font-bold">•</span>
                            <span>Specific offshore fund you wish to invest in</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Accordion Content - USD */}
            {expandedDepositCurrency === 'USD' && (
              <div className="space-y-6 mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
                {/* Deposit Details Section */}
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <Building2 className="w-8 h-8 transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />
                    </div>
                    <h3 className="text-xl font-bold">Bank Transfer Details</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="backdrop-blur-md bg-white/60 dark:bg-[#0a0a0f]/60 border border-gray-200/30 dark:border-white/10 p-4 rounded-lg shadow-lg">
                      <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Bank Name</div>
                      <div className="text-base font-bold text-foreground">Equity Bank</div>
                    </div>

                    <div className="backdrop-blur-md bg-white/60 dark:bg-[#0a0a0f]/60 border border-gray-200/30 dark:border-white/10 p-4 rounded-lg shadow-lg">
                      <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Swift Code</div>
                      <div className="text-lg font-bold text-[#0017bf] dark:text-cyan-400">EQBLKENA</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="backdrop-blur-md bg-white/60 dark:bg-[#0a0a0f]/60 border border-gray-200/30 dark:border-white/10 p-4 rounded-lg shadow-lg">
                      <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Account Number</div>
                      <div className="text-lg font-bold text-[#0017bf] dark:text-cyan-400">0180287076623</div>
                    </div>

                    <div className="backdrop-blur-md bg-white/60 dark:bg-[#0a0a0f]/60 border border-gray-200/30 dark:border-white/10 p-4 rounded-lg shadow-lg">
                      <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Account Name</div>
                      <div className="text-base font-bold text-foreground">AIB-AXYS Africa Limited - Client Account</div>
                    </div>
                  </div>

                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-red-600 mb-1">Important</div>
                        <div className="text-sm text-red-600">
                          Your CDSC Account Number or AXYS Investment Bank Client Code must be included in the deposit instructions to facilitate fund allocation.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notify Us Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-cyan-500/10 rounded-lg">
                      <ArrowDownToLine className="w-8 h-8 text-cyan-600" />
                    </div>
                    <h3 className="text-xl font-bold">After Deposit - Notify Us</h3>
                  </div>

                  <p className="text-muted-foreground mb-6">
                    Once you've deposited, please notify us immediately for swift allocation by sending a copy of the transaction confirmation slip via email.
                  </p>

                  <div className="backdrop-blur-md bg-white/60 dark:bg-[#0a0a0f]/60 border border-gray-200/30 dark:border-white/10 p-6 rounded-lg shadow-lg">
                    <div className="text-sm font-semibold text-muted-foreground uppercase mb-4">Email Format</div>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-semibold">To:</span> <span className="text-[#0017bf] dark:text-[#1477bb]">info@axysinvestmentbank.com</span>
                      </div>
                      <div>
                        <span className="font-semibold">Subject:</span> <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Multi-currency Deposit: [Your Full Name]</span>
                      </div>
                      <div>
                        <span className="font-semibold">Attach:</span> Transaction confirmation slip
                      </div>
                      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded">
                        <div className="text-xs font-semibold text-muted-foreground uppercase mb-3">Include in Email:</div>
                        <ul className="space-y-2 text-xs text-muted-foreground">
                          <li className="flex items-start space-x-2">
                            <span className="text-[#0017bf] dark:text-[#00005b] font-bold">•</span>
                            <span>Your CDSC Account Number or AXYS Investment Bank Client Code</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-[#0017bf] dark:text-[#00005b] font-bold">•</span>
                            <span>Amount deposited in USD</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-[#0017bf] dark:text-[#00005b] font-bold">•</span>
                            <span>Specific offshore fund you wish to invest in</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Accordion Content - GBP */}
            {expandedDepositCurrency === 'GBP' && (
              <div className="space-y-6 mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
                {/* Deposit Details Section */}
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <Building2 className="w-8 h-8 transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]" />
                    </div>
                    <h3 className="text-xl font-bold">Bank Transfer Details</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="backdrop-blur-md bg-white/60 dark:bg-[#0a0a0f]/60 border border-gray-200/30 dark:border-white/10 p-4 rounded-lg shadow-lg">
                      <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Bank Name</div>
                      <div className="text-base font-bold text-foreground">Equity Bank</div>
                    </div>

                    <div className="backdrop-blur-md bg-white/60 dark:bg-[#0a0a0f]/60 border border-gray-200/30 dark:border-white/10 p-4 rounded-lg shadow-lg">
                      <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">IBAN / Sort Code</div>
                      <div className="text-lg font-bold text-[#0017bf] dark:text-cyan-400">EQBLKENA</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="backdrop-blur-md bg-white/60 dark:bg-[#0a0a0f]/60 border border-gray-200/30 dark:border-white/10 p-4 rounded-lg shadow-lg">
                      <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Account Number</div>
                      <div className="text-lg font-bold text-[#0017bf] dark:text-cyan-400">018287073652</div>
                    </div>

                    <div className="backdrop-blur-md bg-white/60 dark:bg-[#0a0a0f]/60 border border-gray-200/30 dark:border-white/10 p-4 rounded-lg shadow-lg">
                      <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Account Name</div>
                      <div className="text-base font-bold text-foreground">AIB-AXYS Africa Limited - Client Account</div>
                    </div>
                  </div>

                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-red-600 mb-1">Important</div>
                        <div className="text-sm text-red-600">
                          Your CDSC Account Number or AXYS Investment Bank Client Code must be included in the deposit instructions to facilitate fund allocation.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notify Us Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-cyan-500/10 rounded-lg">
                      
                      <ArrowDownToLine className="w-8 h-8 text-cyan-600" />
                    </div>
                    <h3 className="text-xl font-bold">After Deposit - Notify Us</h3>
                  </div>

                  <p className="text-muted-foreground mb-6">
                    Once you've deposited, please notify us immediately for swift allocation by sending a copy of the transaction confirmation slip via email.
                  </p>

                  <div className="backdrop-blur-md bg-white/60 dark:bg-[#0a0a0f]/60 border border-gray-200/30 dark:border-white/10 p-6 rounded-lg shadow-lg">
                    <div className="text-sm font-semibold text-muted-foreground uppercase mb-4">Email Format</div>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-semibold">To:</span> <span className="text-[#0017bf] dark:text-[#1477bb]">info@axysinvestmentbank.com</span>
                      </div>
                      <div>
                        <span className="font-semibold">Subject:</span> <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Multi-currency Deposit: [Your Full Name]</span>
                      </div>
                      <div>
                        <span className="font-semibold">Attach:</span> Transaction confirmation slip
                      </div>
                      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded">
                        <div className="text-xs font-semibold text-muted-foreground uppercase mb-3">Include in Email:</div>
                        <ul className="space-y-2 text-xs text-muted-foreground">
                          <li className="flex items-start space-x-2">
                            <span className="text-[#0017bf] dark:text-[#00005b] font-bold">•</span>
                            <span>Your CDSC Account Number or AXYS Investment Bank Client Code</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-[#0017bf] dark:text-[#00005b] font-bold">•</span>
                            <span>Amount deposited in GBP</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-[#0017bf] dark:text-[#00005b] font-bold">•</span>
                            <span>Specific offshore fund you wish to invest in</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!expandedDepositCurrency && (
              <p className="text-center text-sm text-muted-foreground">
                After depositing, send confirmation to: <strong className="transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]">info@axysinvestmentbank.com</strong>
              </p>
            )}
          </GlassCard>
        </ScrollReveal>

        {/* Withdrawal Section */}
        <div id="withdraw" className="scroll-mt-32" />
        <ScrollReveal type="fadeUp">
          <GlassCard className="p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <ArrowUpToLine className="w-8 h-8 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold">Withdraw Funds</h2>
            </div>

            <p className="text-muted-foreground mb-6">
              To withdraw funds from your multi-currency account, please send a withdrawal request via email with the following information:
            </p>

            <div className="backdrop-blur-md bg-white/60 dark:bg-[#0a0a0f]/60 border border-gray-200/30 dark:border-white/10 p-6 rounded-lg shadow-lg mb-6">
              <div className="text-sm font-semibold text-muted-foreground uppercase mb-4">Required Information</div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <span className="transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb] font-bold">•</span>
                  <span>Amount to withdraw (specify currency: USD, EUR, or GBP)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb] font-bold">•</span>
                  <span>Your CDSC Account Number or AXYS Investment Bank Client Code</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb] font-bold">•</span>
                  <span>Bank account details for the withdrawal (Bank name, Account name, Account number, Branch)</span>
                </li>
              </ul>
            </div>

            <div className="backdrop-blur-md bg-white/60 dark:bg-[#0a0a0f]/60 border border-gray-200/30 dark:border-white/10 p-6 rounded-lg shadow-lg">
              <div className="text-sm font-semibold text-muted-foreground uppercase mb-2">Email Format for Withdrawal</div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-semibold">To:</span> <span className="transition-transform duration-300 text-[#0017bf] dark:text-[#1477bb]">info@axysinvestmentbank.com</span>
                </div>
                <div>
                  <span className="font-semibold">Subject:</span> <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Multi-Currency Withdrawal: [Your Full Name]</span>
                </div>
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded font-mono text-xs">
                  <div>Amount: [e.g., 1,000 USD]</div>
                  <div>CDSC/Client Code: [Your Code]</div>
                  <div>Bank Name: [e.g., Equity Bank]</div>
                  <div>Account Name: [Your Name]</div>
                  <div>Account Number: [Your Account]</div>
                  <div>Branch: [Branch Name]</div>
                </div>
              </div>
            </div>
          </GlassCard>
        </ScrollReveal>
      </Section>
    </div>
  );
}
