/**
 * Supabase Auth returns provider-level wording that means nothing to a
 * customer. Translate the messages we actually see into plain guidance, and
 * never surface raw provider text on an auth screen.
 */
export function friendlyAuthError(raw: unknown): string {
  const message = String((raw as { message?: string })?.message ?? raw ?? '').toLowerCase();

  if (!message) return 'Something went wrong. Please try again.';

  if (message.includes('rate limit') || message.includes('too many')) {
    return 'We have sent too many e-mails in the last hour. Please try again in a few minutes, or message us on WhatsApp and we will set up your account for you.';
  }
  if (message.includes('invalid login credentials') || message.includes('invalid_grant')) {
    return 'That e-mail and password do not match. Check for typos, or use “Forgot password” to reset it.';
  }
  if (message.includes('email not confirmed')) {
    return 'Please confirm your e-mail address before signing in — check your inbox and spam folder for the confirmation link.';
  }
  if (message.includes('already registered') || message.includes('already exists')) {
    return 'An account with this e-mail already exists. Sign in instead, or reset your password.';
  }
  if (message.includes('password') && message.includes('least')) {
    return 'Choose a stronger password of at least 8 characters.';
  }
  if (message.includes('invalid') && message.includes('email')) {
    return 'Enter a valid e-mail address.';
  }
  if (message.includes('network') || message.includes('fetch')) {
    return 'We could not reach the server. Check your internet connection and try again.';
  }
  if (message.includes('signup') && message.includes('disabled')) {
    return 'New account creation is temporarily closed. Please contact us and we will help you register.';
  }
  if (message.includes('link') && message.includes('expired')) {
    return 'That link has expired. Request a new one and use it within the hour.';
  }

  return 'We could not complete that request. Please try again, or contact support if it keeps happening.';
}
