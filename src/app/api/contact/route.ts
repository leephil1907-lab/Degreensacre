import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { sanitizeForDb, isEmail, isPhone } from '@/lib/validation';

// POST /api/contact - Submit contact form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const errors: string[] = [];
    
    if (!body.name || body.name.trim().length < 2) {
      errors.push('Name is required');
    }
    if (!body.email || !isEmail(body.email)) {
      errors.push('Valid email is required');
    }
    if (!body.subject || body.subject.trim().length < 3) {
      errors.push('Subject is required');
    }
    if (!body.message || body.message.trim().length < 10) {
      errors.push('Message is required (min 10 characters)');
    }
    if (body.phone && !isPhone(body.phone)) {
      errors.push('Invalid phone number');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: errors.join('. '), success: false },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from('contact_requests')
      .insert({
        name: sanitizeForDb(body.name),
        email: body.email.toLowerCase().trim(),
        phone: body.phone ? sanitizeForDb(body.phone) : null,
        subject: sanitizeForDb(body.subject),
        message: sanitizeForDb(body.message),
        status: 'new',
      })
      .select()
      .single();

    if (error) {
      console.error('Contact form error:', error);
      return NextResponse.json(
        { error: 'Failed to submit contact form', success: false },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent. We will get back to you shortly.',
    });
  } catch (error) {
    console.error('POST /api/contact error:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
