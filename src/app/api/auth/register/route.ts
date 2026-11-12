import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { isEmail, isPhone } from '@/lib/validation';
import { requestRateLimit } from '@/lib/rate-limit';
import { authRedirect, createUserWithConfirmationLink, deliverAuthEmail, isAuthMailerConfigured } from '@/lib/auth-mailer';

const ACCOUNT_TYPES = ['buyer', 'seller', 'agent'] as const;

function text(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

// Registration uses the public Supabase Auth API. The handle_new_user database
// trigger creates the profile and strips privileged account metadata.
export async function POST(request: NextRequest) {
  const rate = requestRateLimit(request, 'auth-register', 5, 60 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Too many registration attempts. Please try again later.', success: false },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfter) } },
    );
  }

  try {
    const body = await request.json();
    const email = text(body?.email, 254).toLowerCase();
    const password = typeof body?.password === 'string' ? body.password : '';
    const firstName = text(body?.first_name, 80);
    const lastName = text(body?.last_name, 80);
    const phone = text(body?.phone, 30);
    const state = text(body?.state, 80);
    const requestedType = text(body?.account_type, 20) || 'buyer';

    if (!isEmail(email)) {
      return NextResponse.json({ error: 'Enter a valid email address.', success: false }, { status: 400 });
    }
    if (password.length < 8 || password.length > 128) {
      return NextResponse.json({ error: 'Password must be between 8 and 128 characters.', success: false }, { status: 400 });
    }
    if (!firstName || !lastName) {
      return NextResponse.json({ error: 'First name and last name are required.', success: false }, { status: 400 });
    }
    if (phone && !isPhone(phone)) {
      return NextResponse.json({ error: 'Enter a valid phone number or leave it blank.', success: false }, { status: 400 });
    }
    if (!ACCOUNT_TYPES.includes(requestedType as typeof ACCOUNT_TYPES[number])) {
      return NextResponse.json({ error: 'Choose a valid account type.', success: false }, { status: 400 });
    }

    // Preferred path: create the account and e-mail the confirmation link
    // ourselves, so activation is not limited by Supabase's 2-per-hour mailer.
    if (isAuthMailerConfigured()) {
      const link = await createUserWithConfirmationLink({
        email,
        password,
        metadata: {
          first_name: firstName,
          last_name: lastName,
          phone: phone || null,
          state: state || null,
          account_type: requestedType,
        },
        redirectTo: authRedirect('/signin?verified=confirmed'),
      });

      if ('error' in link) {
        const conflict = /already exists/i.test(link.error);
        return NextResponse.json({ error: link.error, success: false }, { status: conflict ? 409 : 400 });
      }

      const delivery = await deliverAuthEmail({
        kind: 'confirm_signup',
        to: email,
        actionLink: link.actionLink,
        name: firstName,
        idempotencyKey: `signup-${link.userId ?? email}`,
      });

      if (!delivery.success) {
        console.error('[auth-mailer] confirmation delivery failed:', delivery.error);
        return NextResponse.json({
          error: 'Your account was created, but the confirmation e-mail could not be sent. Try “Resend confirmation” on the sign-in page in a moment.',
          success: false,
        }, { status: 502 });
      }

      return NextResponse.json({
        success: true,
        user: { id: link.userId, email },
        requires_email_confirmation: true,
        mailer: 'resend',
      }, { status: 201 });
    }

    const supabase = await createServerSupabaseClient();
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phone || null,
          state: state || null,
          account_type: requestedType,
        },
      },
    });

    if (authError) {
      console.error('Supabase registration failed:', authError.message);
      if (/already registered|already exists/i.test(authError.message)) {
        return NextResponse.json({ error: 'An account with this email already exists.', success: false }, { status: 409 });
      }
      if (authError.status && authError.status >= 400 && authError.status < 500) {
        return NextResponse.json({ error: authError.message, success: false }, { status: authError.status });
      }
      return NextResponse.json({ error: 'We could not create your account right now. Please try again shortly.', success: false }, { status: 502 });
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'We could not create your account right now. Please try again shortly.', success: false }, { status: 502 });
    }

    return NextResponse.json({
      success: true,
      user: { id: authData.user.id, email: authData.user.email },
      requires_email_confirmation: !authData.session,
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/auth/register error:', error);
    return NextResponse.json(
      { error: 'We could not create your account right now. Please try again shortly.', success: false },
      { status: 500 },
    );
  }
}
