import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { createEnquiry } from '@/lib/db-helpers';
import { isEmail, isPhone, sanitizeForDb, validateLength } from '@/lib/validation';

// POST /api/enquiries - Submit enquiry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const errors: string[] = [];
    
    if (!body.buyer_name || body.buyer_name.trim().length < 2) {
      errors.push('Name is required (min 2 characters)');
    }
    if (!body.buyer_email || !isEmail(body.buyer_email)) {
      errors.push('Valid email is required');
    }
    if (body.buyer_phone && !isPhone(body.buyer_phone)) {
      errors.push('Invalid phone number');
    }
    if (!body.message || body.message.trim().length < 10) {
      errors.push('Message is required (min 10 characters)');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: errors.join('. '), success: false },
        { status: 400 }
      );
    }

    const enquiry = await createEnquiry({
      property_id: body.property_id || undefined,
      buyer_name: sanitizeForDb(body.buyer_name),
      buyer_email: body.buyer_email.toLowerCase().trim(),
      buyer_phone: body.buyer_phone || undefined,
      message: sanitizeForDb(body.message),
      source: body.source || 'website',
    });

    return NextResponse.json({ enquiry, success: true });
  } catch (error) {
    console.error('POST /api/enquiries error:', error);
    return NextResponse.json(
      { error: 'Failed to submit enquiry', success: false },
      { status: 500 }
    );
  }
}

// GET /api/enquiries - Get user's enquiries
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    const { data: enquiries, error } = await supabase
      .from('enquiries')
      .select('*, properties(title, slug, images:property_images(url))')
      .eq('buyer_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ enquiries, success: true });
  } catch (error) {
    console.error('GET /api/enquiries error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enquiries', success: false },
      { status: 500 }
    );
  }
}
