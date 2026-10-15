'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DollarSign, Euro, Save } from 'lucide-react';
import { fromEATDateTimeLocal, toEATDateTimeLocal } from '@/lib/eatDateTime';

export default function AdminExchangeRates() {
  const router = useRouter();
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    USD: { rate: '', expiryDate: '', buyRate: '', buyExpiryDate: '', sellRate: '', sellExpiryDate: '', showOnPublic: true, comingSoon: false },
    EUR: { rate: '', expiryDate: '', buyRate: '', buyExpiryDate: '', sellRate: '', sellExpiryDate: '', showOnPublic: true, comingSoon: false },
    GBP: { rate: '', expiryDate: '', buyRate: '', buyExpiryDate: '', sellRate: '', sellExpiryDate: '', showOnPublic: true, comingSoon: false },
  });

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const response = await fetch('/api/admin/exchange-rates');

      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      const data = await response.json();
      const ratesData = data.rates || [];
      setRates(ratesData);

      const newFormData = { ...formData };
      ratesData.forEach((rate) => {
        newFormData[rate.currency] = {
          rate: rate.rate.toString(),
          expiryDate: toEATDateTimeLocal(rate.expiryDate),
          buyRate: (rate.buyRate || rate.rate).toString(),
          buyExpiryDate: rate.buyExpiryDate ? toEATDateTimeLocal(rate.buyExpiryDate) : toEATDateTimeLocal(rate.expiryDate),
          sellRate: (rate.sellRate || rate.rate).toString(),
          sellExpiryDate: rate.sellExpiryDate ? toEATDateTimeLocal(rate.sellExpiryDate) : toEATDateTimeLocal(rate.expiryDate),
          showOnPublic: rate.showOnPublic !== false,
          comingSoon: rate.comingSoon === true,
        };
      });
      setFormData(newFormData);
    } catch (error) {
      console.error('Error fetching rates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (currency) => {
    const data = formData[currency];

    // Validate required fields
    if (!data.buyRate || !data.buyExpiryDate || !data.sellRate || !data.sellExpiryDate) {
      alert('Please fill in buy rate, buy expiry, sell rate, and sell expiry');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('/api/admin/exchange-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currency,
          rate: parseFloat(data.buyRate) || parseFloat(data.sellRate) || 0,
          expiryDate: fromEATDateTimeLocal(data.buyExpiryDate || data.sellExpiryDate),
          buyRate: parseFloat(data.buyRate) || 0,
          buyExpiryDate: fromEATDateTimeLocal(data.buyExpiryDate || data.sellExpiryDate),
          sellRate: parseFloat(data.sellRate) || 0,
          sellExpiryDate: fromEATDateTimeLocal(data.sellExpiryDate || data.buyExpiryDate),
          showOnPublic: data.showOnPublic,
          comingSoon: data.comingSoon,
        }),
      });

      if (response.ok) {
        alert(`${currency} rate updated successfully!`);
        fetchRates();
      } else {
        const errorData = await response.json();
        alert(`Failed to update rate: ${errorData.error || 'Unknown error'}`);
        console.error('API Error:', errorData);
      }
    } catch (error) {
      console.error('Error saving rate:', error);
      alert(`Error saving rate: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (currency, field, value) => {
    setFormData({
      ...formData,
      [currency]: {
        ...formData[currency],
        [field]: value,
      },
    });
  };

  const getCurrencyIcon = (currency) => {
    if (currency === 'USD') return <DollarSign className="w-6 h-6" />;
    if (currency === 'EUR') return <Euro className="w-6 h-6" />;
    return <span className="text-xl font-bold">£</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">Loading exchange rates...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Exchange Rate Management</h1>
        <p className="text-gray-600">
          Set exchange rates and expiry times for public display
        </p>
      </div>

      <div className="space-y-6">
        {['USD', 'EUR', 'GBP'].map((currency) => (
          <div key={currency} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-400 to-[#0017bf] text-white">
                {getCurrencyIcon(currency)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{currency} to KSH</h2>
                <p className="text-sm text-gray-500">
                  Current Rate:
                  {rates.find((r) => r.currency === currency)
                    ? ` ${rates.find((r) => r.currency === currency).rate} KSH`
                    : ' Not set'}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Buy Rate Row */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Buy Rate (We buy from you)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Buy Rate (1 {currency} = ? KSH)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData[currency].buyRate}
                      onChange={(e) => handleInputChange(currency, 'buyRate', e.target.value)}
                      placeholder="e.g., 165.00"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valid Until (Buy Rate Expiry)
                    </label>
                    <input
                      type="datetime-local"
                      value={formData[currency].buyExpiryDate}
                      onChange={(e) => handleInputChange(currency, 'buyExpiryDate', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Sell Rate Row */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Sell Rate (We sell to you)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sell Rate (1 {currency} = ? KSH)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData[currency].sellRate}
                      onChange={(e) => handleInputChange(currency, 'sellRate', e.target.value)}
                      placeholder="e.g., 166.50"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valid Until (Sell Rate Expiry)
                    </label>
                    <input
                      type="datetime-local"
                      value={formData[currency].sellExpiryDate}
                      onChange={(e) => handleInputChange(currency, 'sellExpiryDate', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Visibility Controls */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id={`show-${currency}`}
                  checked={formData[currency].showOnPublic !== false}
                  onChange={(e) => handleInputChange(currency, 'showOnPublic', e.target.checked)}
                  className="w-5 h-5 text-[#0017bf] dark:text-[#00005b] rounded focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
                />
                <label htmlFor={`show-${currency}`} className="text-sm font-medium text-gray-700 cursor-pointer">
                  Show on Public Page
                </label>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id={`coming-${currency}`}
                  checked={formData[currency].comingSoon === true}
                  onChange={(e) => handleInputChange(currency, 'comingSoon', e.target.checked)}
                  className="w-5 h-5 text-[#0017bf] dark:text-[#00005b] rounded focus:ring-2 focus:ring-[#0017bf] dark:focus:ring-[#00005b]"
                />
                <label htmlFor={`coming-${currency}`} className="text-sm font-medium text-gray-700 cursor-pointer">
                  Mark as "Coming Soon"
                </label>
              </div>
            </div>

            <button
              onClick={() => handleSave(currency)}
              disabled={saving}
              className="w-full px-6 py-3 bg-[#0017bf] dark:bg-[#00005b] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-[#0017bf]/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>{saving ? 'Saving...' : `Update ${currency} Rate`}</span>
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
        <h3 className="font-semibold text-[#0017bf] dark:text-cyan-400 mb-3">💡 Quick Tips</h3>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li>• Set realistic expiry times (typically 24-48 hours for forex rates)</li>
          <li>• Update rates regularly to maintain accuracy</li>
          <li>• Expired rates will be highlighted in red on the public page</li>
          <li>• The public converter uses these rates for calculations</li>
        </ul>
      </div>
    </div>
  );
}
