import { NextRequest, NextResponse } from 'next/server';
import { requestRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

type GeocodeResult = {
  id: string;
  name: string;
  displayName: string;
  lat: number;
  lng: number;
  category: string;
  type: string;
  address: Record<string, string>;
};

type CacheEntry = { expiresAt: number; results: GeocodeResult[] };
const globalCache = globalThis as unknown as { __deGreenacresGeocodeCache?: Map<string, CacheEntry> };
const cache = globalCache.__deGreenacresGeocodeCache || new Map<string, CacheEntry>();
globalCache.__deGreenacresGeocodeCache = cache;

export async function GET(request: NextRequest) {
  const rate = requestRateLimit(request, 'geocode', 30, 10 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Too many address searches. Please wait a few minutes and try again.', success: false }, { status: 429, headers: { 'Retry-After': String(rate.retryAfter) } });
  }

  const query = (request.nextUrl.searchParams.get('q') || '').trim().replace(/\s+/g, ' ');
  if (query.length < 2 || query.length > 200) {
    return NextResponse.json({ error: 'Enter an address or landmark between 2 and 200 characters.', success: false }, { status: 400 });
  }

  const cacheKey = query.toLowerCase();
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json({ results: cached.results, cached: true, success: true });
  }

  try {
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('q', query);
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('addressdetails', '1');
    url.searchParams.set('countrycodes', 'ng');
    url.searchParams.set('dedupe', '1');
    url.searchParams.set('limit', '5');

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'en',
        'User-Agent': process.env.GEOCODING_USER_AGENT || 'De-GreenacresProperties/1.0 (Nigerian property address search)',
      },
      signal: AbortSignal.timeout(12000),
      cache: 'no-store',
    });
    if (!response.ok) {
      console.error(`Address geocoder returned ${response.status}.`);
      return NextResponse.json({ error: 'The address service is temporarily unavailable. Please try again shortly.', success: false }, { status: 502 });
    }

    const data: unknown = await response.json();
    if (!Array.isArray(data)) throw new Error('Unexpected geocoder response.');
    const results = data.slice(0, 5).flatMap((item): GeocodeResult[] => {
      if (!item || typeof item !== 'object') return [];
      const source = item as Record<string, unknown>;
      const lat = Number(source.lat);
      const lng = Number(source.lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) return [];
      const rawAddress = source.address && typeof source.address === 'object' && !Array.isArray(source.address) ? source.address as Record<string, unknown> : {};
      const address = Object.fromEntries(Object.entries(rawAddress).filter(([, value]) => typeof value === 'string').map(([key, value]) => [key, String(value).slice(0, 160)]));
      return [{
        id: String(source.place_id || `${lat},${lng}`),
        name: String(source.name || '').slice(0, 200),
        displayName: String(source.display_name || query).slice(0, 500),
        lat,
        lng,
        category: String(source.category || source.class || '').slice(0, 80),
        type: String(source.type || '').replaceAll('_', ' ').slice(0, 100),
        address,
      }];
    });

    if (cache.size >= 200) {
      const oldest = cache.keys().next().value;
      if (oldest) cache.delete(oldest);
    }
    cache.set(cacheKey, { results, expiresAt: Date.now() + 24 * 60 * 60 * 1000 });
    return NextResponse.json({ results, cached: false, success: true }, { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' } });
  } catch (error) {
    console.error('Address geocoding failed:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: 'We could not search that address right now. Check your connection and try again.', success: false }, { status: 502 });
  }
}
