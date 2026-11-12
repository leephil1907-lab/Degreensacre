import { NextRequest, NextResponse } from 'next/server';
import { databaseError, requireAdminApi } from '@/lib/admin-auth';
import { getInvoice, isUuid, recordPayment } from '@/lib/invoice-server';
import { logAdminActivity } from '@/lib/db-helpers';

type Params = { params: Promise<{ id: string }> };

// POST /api/admin/invoices/[id]/payments — record money received
export async function POST(request: NextRequest, { params }: Params) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const { id } = await params;
  if (!isUuid(id)) return NextResponse.json({ error: 'Invalid invoice id.', success: false }, { status: 400 });

  try {
    const body = await request.json();

    // "Settle the balance" is a one-click action in the panel.
    let amount = Number(body?.amount);
    if (body?.settle === true) {
      const invoice = await getInvoice(auth.context.supabase, id);
      if (!invoice) return NextResponse.json({ error: 'Invoice not found.', success: false }, { status: 404 });
      amount = Math.max(0, Number(invoice.total) - Number(invoice.amount_paid));
    }

    const payment = await recordPayment(
      auth.context.supabase,
      id,
      {
        amount,
        method: body?.method,
        reference: body?.reference,
        paid_at: body?.paid_at,
        notes: body?.notes,
      },
      auth.context.user.id,
    );

    const invoice = await getInvoice(auth.context.supabase, id);

    await logAdminActivity({
      admin_id: auth.context.user.id,
      action: 'invoice_payment_recorded',
      entity_type: 'invoice',
      entity_id: id,
      details: {
        invoice_number: invoice?.invoice_number,
        amount: payment.amount,
        method: payment.method,
        balance: invoice ? Math.max(0, Number(invoice.total) - Number(invoice.amount_paid)) : null,
      },
    });

    return NextResponse.json({ payment, invoice, success: true }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message) return NextResponse.json({ error: message, success: false }, { status: 400 });
    return databaseError(error, 'The payment could not be recorded.');
  }
}

// DELETE /api/admin/invoices/[id]/payments?payment_id=… — undo a mistaken entry
export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const { id } = await params;
  const paymentId = request.nextUrl.searchParams.get('payment_id');
  if (!isUuid(id) || !isUuid(paymentId)) {
    return NextResponse.json({ error: 'A valid invoice and payment id are required.', success: false }, { status: 400 });
  }

  try {
    const { error } = await auth.context.supabase
      .from('invoice_payments')
      .delete()
      .eq('id', paymentId)
      .eq('invoice_id', id);
    if (error) throw error;

    const invoice = await getInvoice(auth.context.supabase, id);
    await logAdminActivity({
      admin_id: auth.context.user.id,
      action: 'invoice_payment_removed',
      entity_type: 'invoice',
      entity_id: id,
      details: { invoice_number: invoice?.invoice_number, payment_id: paymentId },
    });

    return NextResponse.json({ invoice, success: true });
  } catch (error) {
    return databaseError(error, 'The payment could not be removed.');
  }
}
