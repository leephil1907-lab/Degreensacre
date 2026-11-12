import type { SupabaseClient } from '@supabase/supabase-js';
import { notifyEvents } from './email-events';
import { describeCriteria, matchesCriteria, type MatchableProperty, type SearchCriteria } from './saved-searches';

const MAX_SEARCHES = 500;

/**
 * Called after a property becomes publicly available. Finds active saved
 * searches that still match it and e-mails each customer once.
 *
 * Delivery is fire-and-forget (`notifyEvents` schedules work with `after`), so a
 * slow mail provider never delays the administrator's publish action. The
 * idempotency key is derived from (search id, property id), so re-saving or
 * re-publishing the same listing cannot spam anybody.
 */
export async function notifySavedSearchMatches(
  supabase: SupabaseClient,
  property: MatchableProperty & { id?: string; slug?: string; price?: number | string | null },
) {
  try {
    if (String(property.status || '') !== 'available') return;

    const { data: searches, error } = await supabase
      .from('saved_searches')
      .select('id, user_id, name, criteria, alert_frequency')
      .eq('alert_enabled', true)
      .eq('alert_frequency', 'instant')
      .limit(MAX_SEARCHES);

    if (error || !searches?.length) return;

    const matching = searches.filter((search) => matchesCriteria((search.criteria || {}) as SearchCriteria, property));
    if (!matching.length) return;

    const ownerIds = [...new Set(matching.map((search) => search.user_id))];
    const { data: owners } = await supabase
      .from('profiles')
      .select('id, email, first_name')
      .in('id', ownerIds);

    const byId = new Map((owners || []).map((owner) => [owner.id, owner]));
    const notices = matching.flatMap((search) => {
      const owner = byId.get(search.user_id);
      if (!owner?.email) return [];
      const criteria = (search.criteria || {}) as SearchCriteria;
      return [{
        event: 'saved_search_match' as const,
        to: owner.email as string,
        recordId: `${search.id}:${property.id ?? property.slug ?? 'property'}`,
        data: {
          name: owner.first_name || undefined,
          actionPath: property.slug ? `/properties/${property.slug}` : '/properties',
          details: {
            'Saved search': search.name,
            'Looking for': describeCriteria(criteria),
            'New match': property.title || 'New property',
            Location: [property.area, property.state].filter(Boolean).join(', ') || undefined,
            Price: typeof property.price !== 'undefined' && property.price !== null
              ? `₦${Number(property.price).toLocaleString('en-NG')}`
              : undefined,
          },
        },
      }];
    });

    if (!notices.length) return;
    notifyEvents(notices);

    // Timestamp the alert for digest scheduling and support enquiries. This is a
    // best-effort write: RLS only allows the row's owner (or an admin RPC) to
    // update it, so failure is expected when a seller publishes their own listing.
    try {
      await supabase.rpc('mark_saved_searches_notified', { search_ids: matching.map((search) => search.id) });
    } catch {
      /* not fatal — only affects the digest window */
    }
  } catch {
    console.warn('[saved-search-alerts] matching failed');
  }
}
