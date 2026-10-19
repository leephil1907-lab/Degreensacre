import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// GET /api/properties/mine — authenticated owner's or agent's own submissions.
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Please sign in to view your listings.' }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('account_type, is_admin')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError || !profile) {
      return NextResponse.json({ success: false, error: 'We could not confirm your account.' }, { status: 403 });
    }

    if (profile.account_type !== 'seller' && profile.account_type !== 'agent' && profile.is_admin !== true) {
      return NextResponse.json({ success: false, error: 'Listing management is available to property owners and independent agents.' }, { status: 403 });
    }

    // Keep the query scoped to the signed-in owner even when RLS is enabled.
    const { data: properties, error } = await supabase
      .from('properties')
      .select('id, slug, title, type, property_type, price, state, area, status, verification_status, date_added, published_at, property_images(url, is_primary)')
      .eq('owner_id', user.id)
      .order('date_added', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, properties: properties || [] });
  } catch (error) {
    console.error('GET /api/properties/mine error:', error);
    return NextResponse.json({ success: false, error: 'Unable to load your listings right now.' }, { status: 500 });
  }
}
