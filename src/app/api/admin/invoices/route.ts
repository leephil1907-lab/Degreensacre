import { NextRequest, NextResponse } from 'next/server';
import { databaseError, requireAdminApi } from '@/lib/admin-auth';
import { createInvoice, listInvoices, sanitizeInvoiceInput } from '@/lib/invoice-server';
import { logAdminActivity } from '@/lib/db-helpers';

// GET /api/admin/invoices — list every invoice with its line items
export async function GET() {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  try {
    const invoices = await listInvoices(auth.context.supabase);
    return NextResponse.json({ invoices, success: true });
  } catch (error) {
    return databaseError(error, 'Invoices could not be loaded.');
  }
}

// POST /api/admin/invoices — create an invoice (number + totals are server-side)
export async function POST(request: NextRequest) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  try {
    const parsed = sanitizeInvoiceInput(await request.json());
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error, success: false }, { status: 400 });
    }

    const created = await createInvoice(auth.context.supabase, parsed.value, auth.context.user.id);

    await logAdminActivity({
      admin_id: auth.context.user.id,
      action: 'invoice_created',
      entity_type: 'invoice',
      entity_id: created.id,
      details: { invoice_number: created.invoice_number, client: parsed.value.client_name, total: parsed.value.totals.total },
    });

    return NextResponse.json({ invoice: created, success: true }, { status: 201 });
  } catch (error) {
    return databaseError(error, 'The invoice could not be created.');
  }
}
