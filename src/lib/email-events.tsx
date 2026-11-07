import { after } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import EventEmail from '@/emails/EventEmail';
import { EMAIL_EVENTS, type EmailEvent, type EventEmailData } from '@/emails/events';
import { sendEmail } from './email';
import { isEmail } from './validation';
import { createHash } from 'node:crypto';

export type EventNotice = { event: EmailEvent; to: string; data?: EventEmailData; recordId: string };

/** Called only after a successful database mutation, never from a public email relay. */
export function notifyEvents(notices: EventNotice[]) {
  const valid = notices.filter(notice => isEmail(notice.to));
  if (!valid.length) return;
  after(async () => {
    for (const notice of valid) {
      try {
        const key = createHash('sha256').update(`${notice.event}:${notice.recordId}:${notice.to.toLowerCase()}`).digest('hex');
        const result = await sendEmail({
          to: notice.to,
          subject: EMAIL_EVENTS[notice.event].subject,
          template: <EventEmail event={notice.event} data={notice.data} />,
          idempotencyKey: `event-${key}`,
        });
        if (!result.success) console.warn(`[email-event] ${notice.event}: ${result.error}`);
      } catch { console.warn(`[email-event] ${notice.event}: dispatch failed`); }
    }
  });
}

export function teamNotice(event: EmailEvent, recordId: string, data?: EventEmailData): EventNotice[] {
  const address = process.env.EMAIL_NOTIFICATIONS_TO || process.env.EMAIL_REPLY_TO || '';
  return isEmail(address) ? [{ event, recordId, data, to: address }] : [];
}

/** Owner addresses are read server-side under the current admin's RLS; never trust body.email. */
export async function notifyListingChange(supabase: SupabaseClient, previous: { status: string }, property: { id: string; owner_id?: string; title: string; status: string; updated_at?: string }) {
  if (!property.owner_id || previous.status === property.status) return;
  const events: Record<string, EmailEvent> = { available: 'listing_published', pending_review: 'listing_review_required', withdrawn: 'listing_withdrawn', sold: 'listing_sold', rented: 'listing_rented' };
  const event = events[property.status];
  if (!event) return;
  try {
    const { data: owner } = await supabase.from('profiles').select('email, first_name').eq('id', property.owner_id).maybeSingle();
    if (owner?.email) notifyEvents([{ event, to: owner.email, recordId: `${property.id}:${property.updated_at}`, data: { name: owner.first_name, details: { Property: property.title } } }]);
  } catch { console.warn('[email-event] Listing recipient lookup failed'); }
}
