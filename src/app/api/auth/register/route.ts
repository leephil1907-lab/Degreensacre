import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { isEmail, validatePassword, sanitizeForDb } from '@/lib/validation';

// POST /api/auth/register - Register new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const errors: string[] = [];
    
    if (!body.first_name || body.first_name.trim().length < 2) {
      errors.push('First name is required (min 2 characters)');
    }
    if (!body.last_name || body.last_name.trim().length < 2) {
      errors.push('Last name is required (min 2 characters)');
    }
    if (!body.email || !isEmail(body.email)) {
      errors.push('Valid email is required');
    }
    
    const passwordError = validatePassword(body.password || '');
    if (passwordError) errors.push(passwordError.message);

    if (errors.length > 0) {
      return NextResponse.json(
        { error: errors.join('. '), success: false },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase.auth.signUp({
      email: body.email.toLowerCase().trim(),
      password: body.password,
      options: {
        data: {
          first_name: sanitizeForDb(body.first_name),
          last_name: sanitizeForDb(body.last_name),
          account_type: body.account_type || 'buyer',
          phone: body.phone || null,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/verify`,
      },
    });

    if (error) {
      if (error.message.includes('already registered')) {
        return NextResponse.json(
          { error: 'An account with this email already exists', success: false },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: error.message, success: false },
        { status: 400 }
      );
    }

    return NextResponse.json({
      user: data.user,
      success: true,
      message: 'Account created. Please check your email to verify your account.',
    });
  } catch (error) {
    console.error('POST /api/auth/register error:', error);
    return NextResponse.json(
      { error: 'Failed to create account', success: false },
      { status: 500 }
    );
  }
}
