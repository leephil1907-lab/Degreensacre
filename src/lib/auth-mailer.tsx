import AuthEmail, { type AuthEmailKind } from '@/emails/AuthEmail';
import { sendEmail } from './email';
import { isEmail } from './validation';
import { createServiceRoleClient } from './supabase-server';
import { getSiteUrl } from './site';

/**
 * Authentication e-mail that does not depend on Supabase's built-in mailer.
 *
 * Supabase can generate a confirmation or recovery link without sending
 * anything (auth.admin.generateLink). We deliver that link through Resend, so
 * sign-up confirmation and password resets come from our own verified domain,
 * with our branding, at Resend's sending limits — not the shared 2-per-hour cap.
 *
 * When Resend is not configured the routes report `fallback: true` and the UI
 * keeps using Supabase's own mailer, so nothing breaks before the key exists.
 */
export function isAuthMailerConfigured(): boolean {
  const required = process.env.NODE_ENV === 'production'
    ? Boolean(process.env.EMAIL_REPLY_TO)
    : true;
  return Boolean(
    process.env.RESEND_API_KEY &&
    process.env.EMAIL_FROM &&
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  ) && required;
}

const SUBJECTS: Record<AuthEmailKind, string> = {
  confirm_signup: 'Confirm your De-Greenacres account',
  reset_password: 'Reset your De-Greenacres password',
  confirm_email_change: 'Confirm your new De-Greenacres e-mail',
};

type LinkResult = { actionLink: string; userId?: string } | { error: string };

function describe(error: { message?: string; code?: string } | null): string {
  const message = (error?.message || '').toLowerCase();
  if (message.includes('already registered') || message.includes('already been registered')) {
    return 'An account with this e-mail already exists. Sign in instead, or reset your password.';
  }
  if (message.includes('user not found')) return 'No account uses that e-mail address.';
  if (message.includes('rate limit')) return 'Too many attempts. Please wait a few minutes and try again.';
  return 'We could not prepare that link. Please try again.';
}

/** Creates the user (if needed) and returns a confirmation link Supabase did not e-mail. */
export async function createUserWithConfirmationLink(params: {
  email: string;
  password: string;
  metadata: Record<string, unknown>;
  redirectTo: string;
}): Promise<LinkResult> {
  const admin = createServiceRoleClient();

  const { data, error } = await admin.auth.admin.generateLink({
    type: 'signup',
    email: params.email,
    password: params.password,
    options: { data: params.metadata, redirectTo: params.redirectTo },
  });

  if (error) return { error: describe(error as { message?: string }) };

  const actionLink = (data as { properties?: { action_link?: string } })?.properties?.action_link;
  if (!actionLink) return { error: 'We could not prepare that link. Please try again.' };

  return { actionLink, userId: (data as { user?: { id?: string } })?.user?.id };
}

/** Recovery link for an existing account. Never reveals whether the account exists. */
export async function createRecoveryLink(email: string, redirectTo: string): Promise<LinkResult> {
  const admin = createServiceRoleClient();
  const { data, error } = await admin.auth.admin.generateLink({
    type: 'recovery',
    email,
    options: { redirectTo },
  });

  if (error) {
    if ((error.message || '').toLowerCase().includes('user not found')) return { error: 'not_found' };
    return { error: describe(error as { message?: string }) };
  }

  const actionLink = (data as { properties?: { action_link?: string } })?.properties?.action_link;
  if (!actionLink) return { error: 'We could not prepare that link. Please try again.' };
  return { actionLink };
}

/** Fresh confirmation link for an account that never clicked the first one. */
export async function createConfirmationLink(email: string, redirectTo: string): Promise<LinkResult> {
  const admin = createServiceRoleClient();
  const { data, error } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: { redirectTo },
  });

  if (error) {
    if ((error.message || '').toLowerCase().includes('user not found')) return { error: 'not_found' };
    return { error: describe(error as { message?: string }) };
  }

  const actionLink = (data as { properties?: { action_link?: string } })?.properties?.action_link;
  if (!actionLink) return { error: 'We could not prepare that link. Please try again.' };
  return { actionLink };
}

export async function deliverAuthEmail(params: {
  kind: AuthEmailKind;
  to: string;
  actionLink: string;
  name?: string;
  idempotencyKey?: string;
}): Promise<{ success: boolean; error?: string }> {
  if (!isEmail(params.to)) return { success: false, error: 'Invalid e-mail address.' };

  return sendEmail({
    to: params.to,
    subject: SUBJECTS[params.kind],
    template: <AuthEmail kind={params.kind} actionLink={params.actionLink} name={params.name} />,
    idempotencyKey: params.idempotencyKey,
  });
}

/** Absolute, same-origin redirect target for the link inside the e-mail. */
export function authRedirect(path: string): string {
  const base = getSiteUrl().replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
