import { NextRequest, NextResponse } from 'next/server';
import { createElement } from 'react';
import { render } from '@react-email/render';
import { requireAdminApi } from '@/lib/admin-auth';
import { EMAIL_EVENTS, type EmailEvent } from '@/emails/events';
import EventEmail from '@/emails/EventEmail';

export async function GET(request: NextRequest) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;
  const event = request.nextUrl.searchParams.get('event') || '';
  if (!Object.prototype.hasOwnProperty.call(EMAIL_EVENTS, event)) return NextResponse.json({ error: 'Unknown email event.' }, { status: 400 });
  const html = await render(createElement(EventEmail, { event: event as EmailEvent }));
  return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'private, no-store', 'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; img-src https: data:; base-uri 'none'; form-action 'none'; frame-ancestors 'self'" } });
}
