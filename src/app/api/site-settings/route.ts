import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { DEFAULT_SITE_SETTINGS } from '@/lib/site-settings';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('settings')
      .eq('id', 1)
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json(
      { settings: { ...DEFAULT_SITE_SETTINGS, ...(data?.settings || {}) }, success: true },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    console.error('GET /api/site-settings error:', error);
    return NextResponse.json(
      { error: 'Site settings are temporarily unavailable.', success: false },
      { status: 503 },
    );
  }
}
