import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot write cookies. The proxy refreshes auth
          // cookies for protected routes; Route Handlers can still write them.
        }
      },
    },
  });
}

// Kept as a compatibility name for existing admin/data helpers. This is the
// current administrator's RLS-scoped client, never a service-role client.
// It MUST retain the request cookies or every admin policy sees an anonymous user.
/**
 * Service-role client. Only for the auth mailer, which must mint confirmation
 * and recovery links without asking Supabase to send an e-mail. Never use it
 * for request-scoped reads — those must stay under the caller's RLS.
 */
export function createServiceRoleClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured');
  return createClient(supabaseUrl, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function createAdminSupabaseClient() {
  return createServerSupabaseClient();
}

export async function getUser() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getProfile() {
  const user = await getUser();
  if (!user) return null;

  const supabase = await createServerSupabaseClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
}

export async function requireAuth() {
  const user = await getUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function requireAdmin() {
  const profile = await getProfile();
  if (!profile || !profile.is_admin) {
    throw new Error('Forbidden: Admin access required');
  }
  return profile;
}
