import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/USD', { cache: 'no-store' });
    if (!response.ok) throw new Error('FX provider unavailable');
    const data = await response.json();
    const usdNgn = Number(data?.rates?.NGN);
    return NextResponse.json({ usdNgn: Number.isFinite(usdNgn) ? usdNgn : null, updatedAt: data?.time_last_update_utc ?? null });
  } catch {
    return NextResponse.json({ usdNgn: null, updatedAt: null }, { status: 200 });
  }
}
