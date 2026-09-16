import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase-server';

// GET /api/reviews — Get approved reviews
export async function GET(request: NextRequest) {
  try {
    const adminSupabase = await createAdminSupabaseClient();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    const { data: reviews, error, count } = await adminSupabase
      .from('reviews')
      .select('*', { count: 'exact' })
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return NextResponse.json({ reviews: reviews || [], count: count || 0, success: true });
  } catch (error: any) {
    console.error('GET /api/reviews error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch reviews', success: false }, { status: 500 });
  }
}

// POST /api/reviews — Submit a new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, rating, title, message, location, property_id } = body;

    if (!name || !email || !rating || !message) {
      return NextResponse.json({ error: 'Name, email, rating and message are required', success: false }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5', success: false }, { status: 400 });
    }

    if (message.length < 20) {
      return NextResponse.json({ error: 'Please write at least 20 characters in your review', success: false }, { status: 400 });
    }

    const adminSupabase = await createAdminSupabaseClient();

    const { data: review, error } = await adminSupabase
      .from('reviews')
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        rating: parseInt(rating),
        title: title?.trim() || null,
        message: message.trim(),
        location: location?.trim() || null,
        property_id: property_id || null,
        status: 'approved',
      })
      .select()
      .single();

    if (error) throw error;

    // Send WhatsApp notification to admin
    const stars = '⭐'.repeat(parseInt(rating));
    const whatsappMessage = encodeURIComponent(
      `🆕 New Review on De-Greenacres!\n\n` +
      `${stars} (${rating}/5)\n` +
      `From: ${name.trim()}\n` +
      `Email: ${email.trim()}\n` +
      `Location: ${location?.trim() || 'Not provided'}\n` +
      `Title: ${title?.trim() || 'No title'}\n` +
      `Review: ${message.trim().substring(0, 200)}${message.trim().length > 200 ? '...' : ''}\n\n` +
      `View in Admin → Reviews`
    );

    // Trigger WhatsApp notification (opens WhatsApp with pre-filled message)
    // When WhatsApp Business API is configured, this will send automatically
    try {
      await adminSupabase.from('contact_messages').insert({
        buyer_name: 'System Notification',
        buyer_email: 'system@degreenacres.com',
        message: `NEW REVIEW: ${stars} ${title || ''} — From ${name.trim()} (${email.trim()}) — "${message.trim().substring(0, 100)}..."`,
        status: 'new',
      });
    } catch (notifError) {
      console.error('Notification log error:', notifError);
    }

    return NextResponse.json({
      review,
      success: true,
      message: 'Thank you! Your review has been published.',
      whatsapp_notify: `https://wa.me/2347041754800?text=${whatsappMessage}`,
    });
  } catch (error: any) {
    console.error('POST /api/reviews error:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit review', success: false }, { status: 500 });
  }
}
