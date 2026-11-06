import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// The browser client shares the same cookie-backed session used by Server
// Components, Route Handlers and the auth proxy. Using the plain supabase-js
// local-storage client here would leave server-side admin/API requests signed
// out even after a successful browser login.
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
