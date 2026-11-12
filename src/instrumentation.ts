/**
 * Startup configuration check.
 *
 * Next.js calls `register()` once per server process. We use it to fail loudly
 * on missing production configuration instead of shipping a deployment that
 * renders broken pages or silently drops email.
 */
const REQUIRED = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'] as const;
const RECOMMENDED = ['NEXT_PUBLIC_SITE_URL', 'RESEND_API_KEY', 'EMAIL_FROM', 'EMAIL_NOTIFICATIONS_TO'] as const;

export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  if (process.env.NEXT_PHASE === 'phase-production-build') return;

  const missingRequired = REQUIRED.filter((key) => !process.env[key]?.trim());
  const missingRecommended = RECOMMENDED.filter((key) => !process.env[key]?.trim());

  if (missingRequired.length > 0) {
    console.error(
      `[config] Missing required environment variables: ${missingRequired.join(', ')}. ` +
        'Data-backed pages will fail until they are set.',
    );
  }

  if (missingRecommended.length > 0) {
    console.warn(
      `[config] Missing recommended environment variables: ${missingRecommended.join(', ')}. ` +
        'Transactional email, canonical URLs or admin notifications may be degraded.',
    );
  }

  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SITE_URL?.startsWith('http://')) {
    console.warn('[config] NEXT_PUBLIC_SITE_URL should use https:// in production.');
  }
}
