import { notifyEvents } from '@/lib/email-events';
import { databaseError, requireAdminApi } from '@/lib/admin-auth';
import { isUuid } from '@/lib/validation';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/admin/reviews — Get all reviews (admin)
export async function GET() {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  try {
    const { data: reviews, error } = await auth.context.supabase
      .from('reviews')
      .select('id, user_id, name, email, rating, title, message, location, property_id, status, is_verified_buyer, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) return databaseError(error, 'Failed to fetch reviews');

    return NextResponse.json({ reviews: reviews || [], success: true });
  } catch (error) {
    return databaseError(error, 'Failed to fetch reviews');
  }
}

// PATCH /api/admin/reviews — Approve or reject a review
export async function PATCH(request: NextRequest) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    const { review_id, action } = body;

    if (!isUuid(String(review_id || ''))) {
      return NextResponse.json({ error: 'Valid review ID required', success: false }, { status: 400 });
    }
    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Choose approve or reject.', success: false }, { status: 400 });
    }

    const { data: previous, error: previousError } = await auth.context.supabase
      .from('reviews')
      .select('status')
      .eq('id', review_id)
      .single();
    if (previousError) return databaseError(previousError, 'Review could not be loaded.');

    const status = action === 'approve' ? 'approved' : 'rejected';
    const { data: review, error } = await auth.context.supabase
      .from('reviews')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', review_id)
      .select('id, user_id, name, email, rating, title, message, location, property_id, status, is_verified_buyer, created_at, updated_at')
      .single();

    if (error) return databaseError(error, 'Failed to update review');

    if (previous.status !== review.status && review.email) {
      notifyEvents([{
        event: status === 'approved' ? 'review_approved' : 'review_rejected',
        to: review.email,
        recordId: `${review.id}:${review.updated_at}`,
        data: { name: review.name },
      }]);
    }
    return NextResponse.json({ review, success: true });
  } catch (error) {
    return databaseError(error, 'Failed to update review');
  }
}

// DELETE /api/admin/reviews — Delete a review
export async function DELETE(request: NextRequest) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    const { review_id } = body;

    if (!isUuid(String(review_id || ''))) {
      return NextResponse.json({ error: 'Valid review ID required', success: false }, { status: 400 });
    }

    const { error } = await auth.context.supabase.from('reviews').delete().eq('id', review_id);
    if (error) return databaseError(error, 'Failed to delete review');

    return NextResponse.json({ success: true });
  } catch (error) {
    return databaseError(error, 'Failed to delete review');
  }
}
