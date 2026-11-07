import { randomUUID } from 'node:crypto';
import { notifyEvents, teamNotice } from '@/lib/email-events';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { requestRateLimit } from '@/lib/rate-limit';
import { isEmail, isUuid, sanitizeForDb } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    const requestedLimit = Number.parseInt(new URL(request.url).searchParams.get('limit') || '20', 10);
    const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 50) : 20;
    const supabase = await createServerSupabaseClient();
    const { data, error, count } = await supabase
      .from('reviews')
      .select('id, name, rating, title, message, location, created_at, is_verified_buyer', { count: 'exact' })
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return NextResponse.json({ reviews: data || [], count: count || 0, success: true });
  } catch (error) {
    console.error('GET /api/reviews error:', error);
    return NextResponse.json({ error: 'Reviews are temporarily unavailable.', success: false }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const rate = requestRateLimit(request, 'review', 3);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Too many review submissions. Please try again later.', success: false },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfter) } },
    );
  }

  try {
    const body = await request.json();
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const message = String(body.message || '').trim();
    const rating = Number(body.rating);
    const title = String(body.title || '').trim();
    const location = String(body.location || '').trim();

    if (name.length < 2 || name.length > 120) return NextResponse.json({ error: 'Enter a valid name.', success: false }, { status: 400 });
    if (!isEmail(email) || email.length > 320) return NextResponse.json({ error: 'Enter a valid email address.', success: false }, { status: 400 });
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) return NextResponse.json({ error: 'Rating must be between 1 and 5.', success: false }, { status: 400 });
    if (message.length < 20 || message.length > 5000) return NextResponse.json({ error: 'Review must contain 20–5,000 characters.', success: false }, { status: 400 });
    if (title.length > 200 || location.length > 200) return NextResponse.json({ error: 'Review title or location is too long.', success: false }, { status: 400 });
    if (body.property_id && !isUuid(String(body.property_id))) return NextResponse.json({ error: 'Invalid property reference.', success: false }, { status: 400 });

    const supabase = await createServerSupabaseClient();
    const recordId = randomUUID();
    const { error } = await supabase.from('reviews').insert({
      id: recordId,
      name: sanitizeForDb(name),
      email,
      rating,
      title: title ? sanitizeForDb(title) : null,
      message: sanitizeForDb(message),
      location: location ? sanitizeForDb(location) : null,
      property_id: body.property_id || null,
      status: 'pending',
      is_verified_buyer: false,
    });

    if (error) {
      console.error('Review persistence error:', error);
      return NextResponse.json({ error: 'Your review could not be saved. Please try again later.', success: false }, { status: 500 });
    }

    notifyEvents([{ event: 'review_received', to: email, recordId, data: { name, details: { Status: 'Pending moderation' } } }, ...teamNotice('admin_review', recordId)]);
    return NextResponse.json({ success: true, message: 'Thank you. Your review has been received and will appear after moderation.' }, { status: 201 });
  } catch (error) {
    console.error('POST /api/reviews error:', error);
    return NextResponse.json({ error: 'Invalid review submission.', success: false }, { status: 400 });
  }
}
