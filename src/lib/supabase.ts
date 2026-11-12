import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

// The browser client shares the same cookie-backed session used by Server
// Components, Route Handlers and the auth proxy. Using the plain supabase-js
// local-storage client here would leave server-side admin/API requests signed
// out even after a successful browser login.
let browserClient: SupabaseClient | null = null;

/**
 * Create (once) the browser Supabase client.
 *
 * Construction is deferred until first use so that importing shared modules
 * during `next build` / CI does not require live Supabase credentials. A
 * missing configuration surfaces as a clear runtime error instead of a failed
 * deployment.
 */
export function getSupabaseBrowserClient(): SupabaseClient {
  if (browserClient) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    );
  }

  browserClient = createBrowserClient(url, anonKey);
  return browserClient;
}

/**
 * Lazily-resolved client kept for existing `import { supabase }` call sites.
 * Property access is forwarded to the memoised browser client on first touch.
 */
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, property) {
    const client = getSupabaseBrowserClient();
    const value = Reflect.get(client as object, property) as unknown;
    return typeof value === 'function' ? value.bind(client) : value;
  },
  has(_target, property) {
    return property in getSupabaseBrowserClient();
  },
});
