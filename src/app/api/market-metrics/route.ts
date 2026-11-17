import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type FxRates = {
  NGN?: number;
  GBP?: number;
  EUR?: number;
  CAD?: number;
};

export async function GET() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const response = await fetch('https://open.er-api.com/v6/latest/USD', {
      cache: 'no-store',
      signal: controller.signal,
    }).finally(() => clearTimeout(timer));

    if (!response.ok) throw new Error('FX provider unavailable');
    const data = (await response.json()) as { rates?: FxRates; time_last_update_utc?: string };
    const rates = data?.rates || {};
    const usdNgn = Number(rates.NGN);
    if (!Number.isFinite(usdNgn) || usdNgn <= 0) {
      return NextResponse.json({ usdNgn: null, ngnPerCurrency: null, updatedAt: null }, { status: 200 });
    }

    const ngnPerCurrency = {
      USD: usdNgn,
      GBP: Number.isFinite(Number(rates.GBP)) && Number(rates.GBP) > 0 ? usdNgn / Number(rates.GBP) : null,
      EUR: Number.isFinite(Number(rates.EUR)) && Number(rates.EUR) > 0 ? usdNgn / Number(rates.EUR) : null,
      CAD: Number.isFinite(Number(rates.CAD)) && Number(rates.CAD) > 0 ? usdNgn / Number(rates.CAD) : null,
    };

    return NextResponse.json({
      usdNgn,
      ngnPerCurrency,
      updatedAt: data?.time_last_update_utc ?? null,
    });
  } catch {
    return NextResponse.json({ usdNgn: null, ngnPerCurrency: null, updatedAt: null }, { status: 200 });
  }
}
