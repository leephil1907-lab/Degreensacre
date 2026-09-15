import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { validatePassword } from '@/lib/validation';

// POST /api/auth/change-password - Change password (requires auth)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate new password
    const passwordError = validatePassword(body.new_password || '');
    if (passwordError) {
      return NextResponse.json(
        { error: passwordError.message, success: false },
        { status: 400 }
      );
    }

    if (body.new_password !== body.confirm_password) {
      return NextResponse.json(
        { error: 'Passwords do not match', success: false },
        { status: 400 }
      );
    }

    const { error } = await supabase.auth.updateUser({
      password: body.new_password,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message, success: false },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('POST /api/auth/change-password error:', error);
    return NextResponse.json(
      { error: 'Failed to change password', success: false },
      { status: 500 }
    );
  }
}
