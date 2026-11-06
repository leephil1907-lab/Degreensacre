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
  const lat = Number(source.lat ?? source.latitude);
  const lng = Number(source.lng ?? source.lon ?? source.longitude);
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

export function getPropertyImage(property: {
  images?: unknown;
  property_images?: unknown;
}) {
  if (Array.isArray(property.images) && typeof property.images[0] === 'string' && property.images[0]) {
    return property.images[0];
  }
  if (Array.isArray(property.property_images)) {
    const images = property.property_images as { url?: unknown; is_primary?: boolean; display_order?: number }[];
    const primary = images.find((image) => image.is_primary && typeof image.url === 'string');
    const first = primary || [...images].sort((a, b) => (a.display_order || 0) - (b.display_order || 0))[0];
    if (first && typeof first.url === 'string' && first.url) return first.url;
  }
  return '/property-placeholder.svg';
}
