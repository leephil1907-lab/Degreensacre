import { NextRequest, NextResponse } from 'next/server';
import { authRedirect, createConfirmationLink, deliverAuthEmail, isAuthMailerConfigured } from '@/lib/auth-mailer';
import { isEmail } from '@/lib/validation';

export const runtime = 'nodejs';

const recent = new Map<string, number>();
const WINDOW_MS = 60_000;

/** Re-sends the activation link for an account that never confirmed its e-mail. */
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.', success: false }, { status: 400 });
  }

  if (!isAuthMailerConfigured()) {
    return NextResponse.json({ fallback: true, success: false }, { status: 200 });
  }

  const email = String(body.email ?? '').trim().toLowerCase();
  if (!isEmail(email)) {
    return NextResponse.json({ error: 'Enter a valid e-mail address.', success: false }, { status: 400 });
  }

  const last = recent.get(email);
  if (last && Date.now() - last < WINDOW_MS) {
    return NextResponse.json({ success: true, message: 'A fresh link was just sent — check your inbox.' }, { status: 200 });
  }
  recent.set(email, Date.now());
  if (recent.size > 500) recent.clear();

  try {
    const link = await createConfirmationLink(email, authRedirect('/signin?verified=confirmed'));
    if ('error' in link) {
      return NextResponse.json(
        { success: true, message: 'If that address needs confirming, a fresh link is on its way.' },
        { status: 200 },
      );
    }

    const delivery = await deliverAuthEmail({ kind: 'confirm_signup', to: email, actionLink: link.actionLink });
    if (!delivery.success) {
      return NextResponse.json(
        { error: 'We could not send the e-mail just now. Try again shortly or contact us on WhatsApp.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true, message: 'A fresh confirmation link is on its way.' }, { status: 200 });
  } catch (error) {
    console.error('Resend confirmation failed:', error);
    return NextResponse.json({ error: 'We could not send the e-mail just now. Please try again.' }, { status: 500 });
  }
}
