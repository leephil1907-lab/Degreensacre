import { NextRequest, NextResponse } from 'next/server';
import { databaseError, requireAdminApi } from '@/lib/admin-auth';
import { getInvoice, isUuid, sanitizeInvoiceInput, updateInvoice } from '@/lib/invoice-server';
import { logAdminActivity } from '@/lib/db-helpers';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const { id } = await params;
  if (!isUuid(id)) return NextResponse.json({ error: 'Invalid invoice id.', success: false }, { status: 400 });

  try {
    const invoice = await getInvoice(auth.context.supabase, id);
    if (!invoice) return NextResponse.json({ error: 'Invoice not found.', success: false }, { status: 404 });
    return NextResponse.json({ invoice, success: true });
  } catch (error) {
    return databaseError(error, 'The invoice could not be loaded.');
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const { id } = await params;
  if (!isUuid(id)) return NextResponse.json({ error: 'Invalid invoice id.', success: false }, { status: 400 });

  try {
    const existing = await getInvoice(auth.context.supabase, id);
    if (!existing) return NextResponse.json({ error: 'Invoice not found.', success: false }, { status: 404 });
    if (existing.status === 'paid' && existing.amount_paid > 0) {
      // Paid invoices are financial records: allow notes/status only, not re-pricing.
      const body = await request.json();
      const allowed = ['notes', 'terms', 'status', 'amount_paid'] as const;
      const patch: Record<string, unknown> = {};
      for (const key of allowed) if (body?.[key] !== undefined) patch[key] = body[key];
      const { error } = await auth.context.supabase.from('invoices').update(patch).eq('id', id);
      if (error) throw error;
      await logAdminActivity({
        admin_id: auth.context.user.id,
        action: 'invoice_status_updated',
        entity_type: 'invoice',
        entity_id: id,
        details: { invoice_number: existing.invoice_number, changes: patch },
      });
      return NextResponse.json({ success: true, restricted: true });
    }

    const parsed = sanitizeInvoiceInput(await request.json());
    if (!parsed.ok) return NextResponse.json({ error: parsed.error, success: false }, { status: 400 });

    await updateInvoice(auth.context.supabase, id, parsed.value);
    await logAdminActivity({
      admin_id: auth.context.user.id,
      action: 'invoice_updated',
      entity_type: 'invoice',
      entity_id: id,
      details: { invoice_number: existing.invoice_number, total: parsed.value.totals.total, status: parsed.value.status },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return databaseError(error, 'The invoice could not be updated.');
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const { id } = await params;
  if (!isUuid(id)) return NextResponse.json({ error: 'Invalid invoice id.', success: false }, { status: 400 });

  try {
    const existing = await getInvoice(auth.context.supabase, id);
    if (!existing) return NextResponse.json({ error: 'Invoice not found.', success: false }, { status: 404 });
    if (existing.status === 'paid') {
      return NextResponse.json(
        { error: 'Paid invoices cannot be deleted. Mark the invoice as void instead.', success: false },
        { status: 409 },
      );
    }
    const { error } = await auth.context.supabase.from('invoices').delete().eq('id', id);
    if (error) throw error;
    await logAdminActivity({
      admin_id: auth.context.user.id,
      action: 'invoice_deleted',
      entity_type: 'invoice',
      entity_id: id,
      details: { invoice_number: existing.invoice_number, client: existing.client_name },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return databaseError(error, 'The invoice could not be deleted.');
  }
}
