import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import {
  describeCriteria,
  matchesCriteria,
  normaliseCriteria,
  suggestName,
  type SearchCriteria,
} from '@/lib/saved-searches';
import { checkRateLimit } from '@/lib/rate-limit';

type PropertyRow = Record<string, unknown> & { id?: string };
type MatchableRow = PropertyRow & Parameters<typeof matchesCriteria>[1];

/** Live match counts make the dashboard list honest: "3 properties match now". */
async function countMatches(supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>, searches: { id: string; criteria: SearchCriteria }[]) {
  if (!searches.length) return new Map<string, number>();
  const { data: properties } = await supabase
    .from('properties')
    .select('id,title,address,area,city,lga,state,type,property_type,price,bedrooms,documentation,verification_status,status')
    .eq('status', 'available')
    .limit(1000);

  const rows = (properties || []) as PropertyRow[];
  return new Map(searches.map((search) => [
    search.id,
    rows.filter((property) => matchesCriteria(search.criteria, property as MatchableRow)).length,
  ]));
}

// GET /api/searches — the signed-in customer's saved searches, with live counts.
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Please sign in to see your saved searches.', success: false }, { status: 401 });
    }

    const { data: searches, error } = await supabase
      .from('saved_searches')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const rows = (searches || []).map((search) => ({
      ...search,
      criteria: normaliseCriteria(search.criteria),
      summary: describeCriteria(normaliseCriteria(search.criteria)),
    }));

    const counts = await countMatches(supabase, rows.map((row) => ({ id: row.id, criteria: row.criteria })));

    return NextResponse.json({
      searches: rows.map((row) => ({ ...row, match_count: counts.get(row.id) ?? 0 })),
      success: true,
    });
  } catch (error) {
    console.error('GET /api/searches error:', error);
    return NextResponse.json({ error: 'We could not load your saved searches.', success: false }, { status: 500 });
  }
}

// POST /api/searches — save the filters currently shown on /properties.
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Please sign in to save searches.', success: false }, { status: 401 });
    }

    const limited = checkRateLimit(`saved-search:${user.id}`, 20, 60 * 60 * 1000);
    if (!limited.allowed) {
      return NextResponse.json({ error: 'You have saved a lot of searches in the last hour. Try again later.', success: false }, { status: 429 });
    }

    const body = await request.json().catch(() => ({}));
    const criteria = normaliseCriteria(body?.criteria);
    if (!Object.keys(criteria).length) {
      return NextResponse.json({ error: 'Choose at least one filter before saving a search.', success: false }, { status: 400 });
    }

    const name = String(body?.name ?? '').trim().slice(0, 80) || suggestName(criteria);
    const frequency = ['instant', 'daily', 'weekly'].includes(String(body?.alert_frequency))
      ? String(body.alert_frequency)
      : 'instant';

    const { data, error } = await supabase
      .from('saved_searches')
      .insert({
        user_id: user.id,
        name,
        criteria,
        alert_enabled: body?.alert_enabled !== false,
        alert_frequency: frequency,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: `You already have a search called “${name}”. Choose another name.`, success: false }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json({
      search: { ...data, criteria, summary: describeCriteria(criteria) },
      success: true,
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/searches error:', error);
    return NextResponse.json({ error: 'We could not save that search. Please try again.', success: false }, { status: 500 });
  }
}

// PATCH /api/searches — rename, pause/resume alerts, or change the frequency.
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized', success: false }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const id = typeof body?.id === 'string' ? body.id : '';
    if (!id) {
      return NextResponse.json({ error: 'Which search should be updated?', success: false }, { status: 400 });
    }

    const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (typeof body?.name === 'string' && body.name.trim()) update.name = body.name.trim().slice(0, 80);
    if (typeof body?.alert_enabled === 'boolean') update.alert_enabled = body.alert_enabled;
    if (['instant', 'daily', 'weekly'].includes(String(body?.alert_frequency))) {
      update.alert_frequency = body.alert_frequency;
    }
    if (Object.keys(update).length === 1) {
      return NextResponse.json({ error: 'Nothing to update.', success: false }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('saved_searches')
      .update(update)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: 'That search could not be found.', success: false }, { status: 404 });
    }

    return NextResponse.json({ search: data, success: true });
  } catch (error) {
    console.error('PATCH /api/searches error:', error);
    return NextResponse.json({ error: 'We could not update that search.', success: false }, { status: 500 });
  }
}

// DELETE /api/searches?id=… — remove one of the customer's searches.
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized', success: false }, { status: 401 });
    }

    const searchId = new URL(request.url).searchParams.get('id');
    if (!searchId) {
      return NextResponse.json({ error: 'Search ID is required', success: false }, { status: 400 });
    }

    const { error } = await supabase
      .from('saved_searches')
      .delete()
      .eq('id', searchId)
      .eq('user_id', user.id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/searches error:', error);
    return NextResponse.json({ error: 'We could not delete that search.', success: false }, { status: 500 });
  }
}
