import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { isEmail } from '@/lib/validation';
import { getSiteUrl } from '@/lib/site';
import { requestRateLimit } from '@/lib/rate-limit';
import { authRedirect, createRecoveryLink, deliverAuthEmail, isAuthMailerConfigured } from '@/lib/auth-mailer';

// POST /api/auth/reset-password - Request password reset
export async function POST(request: NextRequest) {
  const rate = requestRateLimit(request, 'auth-recovery', 5, 15 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Too many reset requests. Please wait before trying again.', success: false },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfter) } },
    );
  }

  try {
    const body = await request.json();

    if (typeof body?.email !== 'string' || !isEmail(body.email)) {
      return NextResponse.json(
        { error: 'Valid email is required', success: false },
        { status: 400 }
      );
    }

    // Preferred path: mint the recovery link and deliver it from our own domain.
    if (isAuthMailerConfigured()) {
      const link = await createRecoveryLink(body.email.toLowerCase().trim(), authRedirect('/auth/reset-password'));
      if ('error' in link && link.error !== 'not_found') {
        console.warn('[auth-mailer] recovery link failed');
      }
      if (!('error' in link)) {
        const delivery = await deliverAuthEmail({ kind: 'reset_password', to: body.email.toLowerCase().trim(), actionLink: link.actionLink });
        if (!delivery.success) console.warn('[auth-mailer] reset delivery failed:', delivery.error);
      }
      // Same answer either way: never disclose whether the address is registered.
      return NextResponse.json({
        success: true,
        message: 'If that address has an account, a reset link is on its way.',
      });
    }

    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.auth.resetPasswordForEmail(
      body.email.toLowerCase().trim(),
      {
        redirectTo: `${getSiteUrl()}/auth/reset-password`,
      }
    );

    if (error) {
      return NextResponse.json(
        { error: error.message, success: false },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset link sent to your email',
    });
  } catch (error) {
    console.error('POST /api/auth/reset-password error:', error);
    return NextResponse.json(
      { error: 'Failed to send reset link', success: false },
      { status: 500 }
    );
  }
}
