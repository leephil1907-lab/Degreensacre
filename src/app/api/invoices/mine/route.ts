import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

/**
 * Invoices addressed to the signed-in customer. Row-level security restricts the
 * query to the e-mail on the session, so this can never return another client's
 * billing history.
 */
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Please sign in to continue.', success: false }, { status: 401 });

    const { data, error } = await supabase
      .from('invoices')
      .select('*, invoice_items(*), invoice_payments(*)')
      .order('issue_date', { ascending: false })
      .limit(100);
    if (error) throw error;

    return NextResponse.json({ invoices: data ?? [], success: true });
  } catch (error) {
    console.error('Client invoice lookup failed:', error);
    return NextResponse.json({ error: 'Your invoices could not be loaded.', success: false }, { status: 500 });
  }
}
