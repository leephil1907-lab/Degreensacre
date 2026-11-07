export type PropertyCoordinates = { lat: number; lng: number };

export type PropertyLocation = {
  address?: string | null;
  area?: string | null;
  city?: string | null;
  lga?: string | null;
  state?: string | null;
  coordinates?: unknown;
  latitude?: unknown;
  longitude?: unknown;
  lat?: unknown;
  lng?: unknown;
};

export function parseCoordinates(value: unknown): PropertyCoordinates | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const source = value as Record<string, unknown>;
  const rawLat = source.lat ?? source.latitude;
  const rawLng = source.lng ?? source.lon ?? source.longitude;
  if (![rawLat, rawLng].every((coordinate) =>
    (typeof coordinate === 'number' || typeof coordinate === 'string') && String(coordinate).trim() !== ''
  )) return null;
  const lat = Number(rawLat);
  const lng = Number(rawLng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return { lat, lng };
}

export function getPropertyCoordinates(property: PropertyLocation): PropertyCoordinates | null {
  const stored = parseCoordinates(property.coordinates);
  if (stored) return stored;
  if (property.lat !== undefined || property.lng !== undefined) {
    return parseCoordinates({ lat: property.lat, lng: property.lng });
  }
  if (property.latitude !== undefined || property.longitude !== undefined) {
    return parseCoordinates({ lat: property.latitude, lng: property.longitude });
  }
  return null;
}

export function getPropertyAddress(property: PropertyLocation, includeCountry = false) {
  const parts = [property.address, property.area, property.city || property.lga, property.state];
  if (includeCountry) parts.push('Nigeria');
  const seen = new Set<string>();
  return parts
    .map((part) => String(part || '').trim())
    .filter((part) => {
      if (!part) return false;
      const key = part.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .join(', ');
}

export function formatPropertyPrice(value: unknown, period?: string | null) {
  const price = Number(value || 0);
  const absolute = Math.abs(price);
  let formatted: string;
  if (absolute >= 1_000_000_000) {
    formatted = `₦${(price / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
  } else if (absolute >= 1_000_000) {
    formatted = `₦${(price / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  } else {
    formatted = `₦${Math.round(price).toLocaleString('en-NG')}`;
  }

  const normalized = String(period || '').toLowerCase().replace(/^per-/, '').replace(/^per_/, '');
  const suffix = normalized && normalized !== 'one-time' && normalized !== 'one time'
    ? `/${normalized === 'sqm' ? 'sqm' : normalized}`
    : '';
  return `${formatted}${suffix}`;
}

// Stock-library images cannot substantiate a listing's physical appearance.
// Preserve the stored records, but do not present these as property photographs.
export function isStockImage(url: unknown): boolean {
  if (typeof url !== 'string') return false;
  try {
    const host = new URL(url).hostname.toLowerCase();
    return ['unsplash.com', 'pexels.com', 'pixabay.com'].some((domain) => host === domain || host.endsWith(`.${domain}`));
  } catch { return false; }
}

export function getPropertyImage(property: {
  images?: unknown;
  property_images?: unknown;
}) {
  if (Array.isArray(property.images)) {
    const actualImage = property.images.find((image) => typeof image === 'string' && image && !isStockImage(image));
    if (actualImage) return actualImage;
  }
  if (Array.isArray(property.property_images)) {
    const images = (property.property_images as { url?: unknown; is_primary?: boolean; display_order?: number }[]).filter((image) => !isStockImage(image.url));
    const primary = images.find((image) => image.is_primary && typeof image.url === 'string');
    const first = primary || [...images].sort((a, b) => (a.display_order || 0) - (b.display_order || 0))[0];
    if (first && typeof first.url === 'string' && first.url) return first.url;
  }
  return '/property-placeholder.svg';
}
