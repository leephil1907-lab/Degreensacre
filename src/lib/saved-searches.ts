/**
 * Saved-search criteria: the shape we store in `saved_searches.criteria`, and
 * the single place that decides whether a property matches it.
 *
 * The matching rules mirror the /properties screen exactly (see
 * `filteredProperties` in src/app/properties/page.tsx), so an alert never
 * promises a match the customer would not see on that page.
 */
export type SearchCriteria = {
  type?: string;
  state?: string;
  area?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  verification?: string;
  documentation?: string;
};

export const COMMERCIAL_PROPERTY_TYPES = new Set([
  'Commercial Building', 'Office Space', 'Shop', 'Warehouse', 'Mixed Use',
]);

export type MatchableProperty = {
  type?: string | null;
  property_type?: string | null;
  state?: string | null;
  area?: string | null;
  city?: string | null;
  lga?: string | null;
  address?: string | null;
  title?: string | null;
  price?: number | string | null;
  bedrooms?: number | null;
  documentation?: string | null;
  verification_status?: string | null;
  verified?: boolean | null;
  status?: string | null;
};

const text = (value: unknown, max = 120) =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

const numberOrUndefined = (value: unknown) => {
  const parsed = typeof value === 'string' ? Number(value.replace(/[^\d.]/g, '')) : Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : undefined;
};

/** Whitelists and clamps whatever arrives from a browser. */
export function normaliseCriteria(raw: unknown): SearchCriteria {
  const input = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const criteria: SearchCriteria = {};

  const type = text(input.type, 24).toLowerCase();
  if (type) criteria.type = type;

  const state = text(input.state, 40);
  if (state) criteria.state = state;

  const area = text(input.area, 80);
  if (area) criteria.area = area;

  const propertyType = text(input.propertyType, 80);
  if (propertyType) criteria.propertyType = propertyType;

  const minPrice = numberOrUndefined(input.minPrice);
  if (minPrice) criteria.minPrice = minPrice;

  const maxPrice = numberOrUndefined(input.maxPrice);
  if (maxPrice) criteria.maxPrice = maxPrice;

  const bedrooms = numberOrUndefined(input.bedrooms);
  if (bedrooms) criteria.bedrooms = Math.min(bedrooms, 20);

  if (text(input.verification, 20) === 'verified') criteria.verification = 'verified';

  const documentation = text(input.documentation, 60);
  if (documentation) criteria.documentation = documentation;

  return criteria;
}

/** True when a new property satisfies every condition the saved search asked for. */
export function matchesCriteria(criteria: SearchCriteria, property: MatchableProperty): boolean {
  if (String(property.status || '') !== 'available') return false;

  if (criteria.type === 'land' && property.property_type !== 'Land') return false;
  if (criteria.type === 'commercial' && !COMMERCIAL_PROPERTY_TYPES.has(property.property_type || '')) return false;
  if (criteria.type && !['land', 'commercial'].includes(criteria.type) && property.type !== criteria.type) return false;

  if (criteria.state) {
    const state = String(property.state || '').toLowerCase();
    const wanted = criteria.state.toLowerCase();
    const matches = wanted === 'fct'
      ? ['fct', 'abuja', 'abuja (fct)'].includes(state)
      : state === wanted;
    if (!matches) return false;
  }

  if (criteria.area) {
    const query = criteria.area.trim().toLowerCase();
    const haystack = [property.title, property.address, property.area, property.city, property.lga, property.state, property.property_type]
      .map((value) => String(value || '').toLowerCase())
      .join(' ');
    if (query && !haystack.includes(query)) return false;
  }

  if (criteria.propertyType && String(property.property_type || '').toLowerCase() !== criteria.propertyType.toLowerCase()) return false;

  const price = Number(property.price);
  if (criteria.minPrice && !(price >= criteria.minPrice)) return false;
  if (criteria.maxPrice && !(price <= criteria.maxPrice)) return false;

  if (criteria.bedrooms && Number(property.bedrooms || 0) < criteria.bedrooms) return false;

  if (criteria.verification === 'verified'
    && property.verification_status !== 'verified'
    && property.verified !== true) return false;

  if (criteria.documentation
    && String(property.documentation || '').toLowerCase() !== criteria.documentation.toLowerCase()) return false;

  return true;
}

const naira = (value: number) => {
  if (value >= 1_000_000_000) return `₦${(value / 1_000_000_000).toFixed(value % 1_000_000_000 === 0 ? 0 : 1)}b`;
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}m`;
  if (value >= 1_000) return `₦${Math.round(value / 1_000)}k`;
  return `₦${value}`;
};

/** Short human label used in the dashboard list and in alert e-mails. */
export function describeCriteria(criteria: SearchCriteria): string {
  const parts: string[] = [];

  if (criteria.type === 'sale') parts.push('For sale');
  else if (criteria.type === 'rent') parts.push('For rent');
  else if (criteria.type === 'short-let') parts.push('Short let');
  else if (criteria.type === 'land') parts.push('Land');
  else if (criteria.type === 'commercial') parts.push('Commercial');

  if (criteria.propertyType) parts.push(criteria.propertyType);
  if (criteria.state) parts.push(criteria.state);
  if (criteria.area) parts.push(criteria.area);

  if (criteria.minPrice || criteria.maxPrice) {
    if (criteria.minPrice && criteria.maxPrice) parts.push(`${naira(criteria.minPrice)}–${naira(criteria.maxPrice)}`);
    else if (criteria.minPrice) parts.push(`From ${naira(criteria.minPrice)}`);
    else parts.push(`Up to ${naira(criteria.maxPrice!)}`);
  }

  if (criteria.bedrooms) parts.push(`${criteria.bedrooms}+ beds`);
  if (criteria.verification === 'verified') parts.push('Verified only');
  if (criteria.documentation) parts.push(criteria.documentation);

  return parts.length ? parts.join(' · ') : 'All properties';
}

/** Suggested name when the customer does not type one. */
export function suggestName(criteria: SearchCriteria): string {
  const bits: string[] = [];
  if (criteria.propertyType) bits.push(criteria.propertyType);
  else if (criteria.type === 'land') bits.push('Land');
  else if (criteria.type === 'commercial') bits.push('Commercial space');
  else if (criteria.bedrooms) bits.push(`${criteria.bedrooms}-bed`);
  else bits.push('Properties');

  if (criteria.state) bits.push(`in ${criteria.state}`);
  else if (criteria.area) bits.push(`in ${criteria.area}`);

  if (criteria.type === 'rent') bits.push('for rent');
  else if (criteria.type === 'sale') bits.push('for sale');

  return bits.join(' ').replace(/\s+/g, ' ').slice(0, 80) || 'Saved search';
}

export type SavedSearch = {
  id: string;
  user_id: string;
  name: string;
  criteria: SearchCriteria;
  alert_enabled: boolean;
  alert_frequency: 'instant' | 'daily' | 'weekly';
  last_notified_at: string | null;
  created_at: string;
  updated_at?: string | null;
};
