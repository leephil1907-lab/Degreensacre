import { NextResponse } from 'next/server';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { createServerSupabaseClient } from '@/lib/supabase-server';

type AdminContext = {
  supabase: SupabaseClient;
  user: User;
};

type AdminAuthResult =
  | { context: AdminContext; response?: never }
  | { context?: never; response: NextResponse };

/** Authenticate the request and verify the profile's admin flag through RLS. */
export async function requireAdminApi(): Promise<AdminAuthResult> {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      response: NextResponse.json(
        { error: 'Please sign in to continue.', success: false },
        { status: 401 },
      ),
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError) {
    console.error('Admin profile verification failed:', profileError);
    return {
      response: NextResponse.json(
        { error: 'We could not verify administrator access.', success: false },
        { status: 500 },
      ),
    };
  }

  if (!profile?.is_admin) {
    return {
      response: NextResponse.json(
        { error: 'Administrator access required.', success: false },
        { status: 403 },
      ),
    };
  }

  return { context: { supabase, user } };
}

export function databaseError(error: unknown, fallback: string) {
  const candidate = error as { code?: string; message?: string } | null;

  if (candidate?.code === '23505') {
    return NextResponse.json(
      { error: 'That slug or unique value is already in use.', success: false },
      { status: 409 },
    );
  }

  if (candidate?.code === '23503') {
    return NextResponse.json(
      { error: 'This record is still linked to other content. Reassign or remove those links first.', success: false },
      { status: 409 },
    );
  }

  console.error(fallback, error);
  return NextResponse.json({ error: fallback, success: false }, { status: 500 });
}
