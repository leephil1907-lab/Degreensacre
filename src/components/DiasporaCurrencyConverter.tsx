'use client';

import { useEffect, useState } from 'react';

type Currency = 'USD' | 'GBP' | 'EUR' | 'CAD';

const FALLBACK_RATES: Record<Currency, number> = {
  USD: 1580,
  GBP: 2000,
  EUR: 1700,
  CAD: 1140,
};

export default function DiasporaCurrencyConverter() {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [amount, setAmount] = useState<string>('100000');
  const [rates, setRates] = useState<Record<Currency, number>>(FALLBACK_RATES);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let active = true;
    fetch('/api/market-metrics', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { ngnPerCurrency?: Partial<Record<Currency, number | null>> } | null) => {
        if (!active || !data?.ngnPerCurrency) return;
        const next: Record<Currency, number> = { ...FALLBACK_RATES };
        let updated = false;
        (['USD', 'GBP', 'EUR', 'CAD'] as Currency[]).forEach((code) => {
          const val = Number(data.ngnPerCurrency?.[code]);
          if (Number.isFinite(val) && val > 0) {
            next[code] = Math.round(val);
            updated = true;
          }
        });
        if (updated) {
          setRates(next);
          setIsLive(true);
        }
      })
      .catch(() => {
        /* fallback rates remain active */
      });
    return () => {
      active = false;
    };
  }, []);

  const numericAmount = Math.max(0, Number(amount) || 0);
  const ngnValue = numericAmount * rates[currency];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-forest to-forest-600 rounded-2xl p-8 md:p-12 text-white">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Currency Converter</h2>
              <p className="text-white/90">See how much your investment is worth in Naira</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <label htmlFor="diaspora-currency" className="block text-sm text-white/80 mb-2">
                  Foreign Currency
                </label>
                <div className="flex items-center gap-3">
                  <select
                    id="diaspora-currency"
                    aria-label="Foreign currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as Currency)}
                    className="bg-white/20 text-white border border-white/30 rounded-lg px-4 py-3 font-semibold"
                  >
                    <option value="USD" className="text-charcoal">USD</option>
                    <option value="GBP" className="text-charcoal">GBP</option>
                    <option value="EUR" className="text-charcoal">EUR</option>
                    <option value="CAD" className="text-charcoal">CAD</option>
                  </select>
                  <input
                    type="number"
                    min="0"
                    aria-label="Investment amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount"
                    className="flex-1 bg-white/20 text-white border border-white/30 rounded-lg px-4 py-3 placeholder-white/60"
                  />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-sm text-white/80 mb-2">Nigerian Naira (NGN)</div>
                <div className="text-3xl font-bold">
                  ₦{Math.round(ngnValue).toLocaleString('en-NG')}
                </div>
                <div className="text-xs text-white/70 mt-2">
                  {isLive ? 'Live' : 'Indicative'} rate: ₦{rates[currency].toLocaleString('en-NG')}/{currency}
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-white/80">
              * Exchange rates are indicative and subject to market fluctuations
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
