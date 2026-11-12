import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase-server';
import { sendEmail } from '@/lib/email';
import EventEmail from '@/emails/EventEmail';
import { matchesCriteria, describeCriteria, type SearchCriteria } from '@/lib/saved-searches';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Daily/weekly saved-search digests.
 *
 * Instant alerts are sent inline when a property is published. Summaries need a
 * clock, so Render (or any scheduler) calls this endpoint once a day:
 *
 *   GET /api/cron/saved-searches
 *   Authorization: Bearer $CRON_SECRET
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY: the job reads other customers' searches,
 * which RLS deliberately blocks for everyone else. Without either secret the
 * endpoint answers 503 and nothing is sent — the instant alerts keep working.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const bearer = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim();

  if (!secret || bearer !== secret) {
    return NextResponse.json({ error: 'Not authorised.' }, { status: 401 });
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: 'Digest job needs SUPABASE_SERVICE_ROLE_KEY. Instant alerts are unaffected.' },
      { status: 503 },
    );
  }

  const supabase = createServiceRoleClient();
  const now = Date.now();
  const windows: Record<string, number> = { daily: 24 * 60 * 60 * 1000, weekly: 7 * 24 * 60 * 60 * 1000 };

  const { data: searches, error } = await supabase
    .from('saved_searches')
    .select('id, user_id, name, criteria, alert_frequency, last_notified_at')
    .eq('alert_enabled', true)
    .in('alert_frequency', ['daily', 'weekly'])
    .limit(500);

  if (error) {
    console.error('[cron] saved search query failed:', error.message);
    return NextResponse.json({ error: 'Could not load saved searches.' }, { status: 500 });
  }

  const due = (searches || []).filter((search) => {
    const window = windows[search.alert_frequency] ?? windows.daily;
    const since = search.last_notified_at ? new Date(search.last_notified_at).getTime() : 0;
    return now - since >= window;
  });

  if (!due.length) {
    return NextResponse.json({ success: true, sent: 0, checked: searches?.length ?? 0 });
  }

  const { data: properties } = await supabase
    .from('properties')
    .select('id,slug,title,address,area,city,lga,state,type,property_type,price,bedrooms,documentation,verification_status,status,updated_at')
    .eq('status', 'available')
    .order('updated_at', { ascending: false })
    .limit(200);

  const catalogue = properties || [];
  const ownerIds = [...new Set(due.map((search) => search.user_id))];
  const { data: owners } = await supabase.from('profiles').select('id,email,first_name').in('id', ownerIds);
  const ownerById = new Map((owners || []).map((owner) => [owner.id, owner]));

  let sent = 0;
  for (const search of due) {
    const criteria = (search.criteria || {}) as SearchCriteria;
    const window = windows[search.alert_frequency] ?? windows.daily;
    const since = search.last_notified_at ? new Date(search.last_notified_at).getTime() : 0;
    const matches = catalogue.filter((property) => {
      if (!matchesCriteria(criteria, property)) return false;
      if (!since) return true;
      return new Date(String(property.updated_at || 0)).getTime() > since - window;
    }).slice(0, 5);

    if (!matches.length) continue;
    const owner = ownerById.get(search.user_id);
    if (!owner?.email) continue;

    const result = await sendEmail({
      to: owner.email,
      subject: `${matches.length} new ${matches.length === 1 ? 'property' : 'properties'} for “${search.name}”`,
      template: EventEmail({
        event: 'saved_search_match',
        data: {
          name: owner.first_name || undefined,
          subject: `New matches for “${search.name}”`,
          actionPath: '/dashboard?tab=searches',
          message: `Your saved search (${describeCriteria(criteria)}) has new listings:\n\n${matches
            .map((property) => `• ${property.title} — ${[property.area, property.state].filter(Boolean).join(', ')} · ₦${Number(property.price || 0).toLocaleString('en-NG')}`)
            .join('\n')}\n\nAvailability and pricing change; confirm the details with our team before making plans.`,
        },
      }),
      idempotencyKey: `digest-${search.id}-${new Date().toISOString().slice(0, 10)}`,
    });

    if (result.success) {
      sent += 1;
      await supabase.from('saved_searches').update({ last_notified_at: new Date().toISOString() }).eq('id', search.id);
    }
  }

  return NextResponse.json({ success: true, checked: searches?.length ?? 0, due: due.length, sent });
}
