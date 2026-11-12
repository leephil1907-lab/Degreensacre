/**
 * Invoice domain logic shared by the admin UI, the API routes and the PDF
 * renderer. All money is handled as whole naira amounts and recalculated on the
 * server so a client can never dictate a total.
 */

export const INVOICE_STATUSES = ['draft', 'sent', 'partially_paid', 'paid', 'overdue', 'void'] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

export const STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: 'Draft',
  sent: 'Sent',
  partially_paid: 'Partially paid',
  paid: 'Paid',
  overdue: 'Overdue',
  void: 'Void',
};

export type InvoiceItemInput = {
  id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount?: number;
  position?: number;
};

export type InvoiceItem = InvoiceItemInput & {
  id: string;
  amount: number;
  position: number;
};

export type InvoiceInput = {
  client_name: string;
  client_email?: string | null;
  client_phone?: string | null;
  client_address?: string | null;
  property_id?: string | null;
  property_title?: string | null;
  status?: InvoiceStatus;
  issue_date?: string;
  due_date?: string | null;
  discount?: number;
  tax_rate?: number;
  amount_paid?: number;
  notes?: string | null;
  terms?: string | null;
  bank_name?: string | null;
  bank_account_name?: string | null;
  bank_account_number?: string | null;
  items: InvoiceItemInput[];
};

export const PAYMENT_METHODS = ['bank_transfer', 'cash', 'cheque', 'card', 'pos', 'other'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  bank_transfer: 'Bank transfer',
  cash: 'Cash',
  cheque: 'Cheque',
  card: 'Card',
  pos: 'POS',
  other: 'Other',
};

export type InvoicePayment = {
  id: string;
  invoice_id: string;
  amount: number;
  method: PaymentMethod;
  reference: string | null;
  paid_at: string;
  notes: string | null;
  recorded_by: string | null;
  created_at: string;
};

export type Invoice = Required<Pick<InvoiceInput, 'client_name'>> & {
  id: string;
  invoice_number: string;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string | null;
  client_email: string | null;
  client_phone: string | null;
  client_address: string | null;
  property_id: string | null;
  property_title: string | null;
  currency: string;
  subtotal: number;
  discount: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  amount_paid: number;
  notes: string | null;
  terms: string | null;
  bank_name: string | null;
  bank_account_name: string | null;
  bank_account_number: string | null;
  created_at: string;
  updated_at: string;
  invoice_items: InvoiceItem[];
  invoice_payments?: InvoicePayment[];
};

/** Money received against an invoice, newest first. */
export function sortedPayments(invoice: Pick<Invoice, 'invoice_payments'>): InvoicePayment[] {
  return [...(invoice.invoice_payments ?? [])].sort(
    (a, b) => new Date(b.paid_at).getTime() - new Date(a.paid_at).getTime(),
  );
}

/** How many days an unpaid balance has been overdue (0 when not overdue). */
export function daysOverdue(dueDate: string | null): number {
  if (!dueDate) return 0;
  const due = new Date(`${dueDate}T23:59:59`);
  if (Number.isNaN(due.getTime())) return 0;
  const diff = Math.floor((Date.now() - due.getTime()) / 86_400_000);
  return diff > 0 ? diff : 0;
}

export const COMPANY = {
  name: 'De-Greenacres Properties Limited',
  shortName: 'De-Greenacres Properties',
  rcNumber: '1856064',
  email: 'info@degreenacresproperties.com',
  altEmail: 'de_greenacrespropertiesltd@yahoo.com',
  phone: '+234 806 501 9971',
  address: 'Lagos, Nigeria',
  website: 'degreenacres.org',
} as const;

/** Sanity-clamped money value so bad input can never reach the database. */
export function toMoney(value: unknown): number {
  const numeric = typeof value === 'number' ? value : Number(String(value ?? '').replace(/[^0-9.-]/g, ''));
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(0, Math.round(numeric * 100) / 100);
}

export function computeTotals(
  items: { quantity: number; unit_price: number }[],
  discountInput = 0,
  taxRateInput = 0,
) {
  const lines = items.map((item) => ({
    quantity: toMoney(item.quantity) || 0,
    unit_price: toMoney(item.unit_price),
    amount: Math.round((toMoney(item.quantity) || 0) * toMoney(item.unit_price) * 100) / 100,
  }));

  const subtotal = Math.round(lines.reduce((sum, line) => sum + line.amount, 0) * 100) / 100;
  const discount = Math.min(toMoney(discountInput), subtotal);
  const taxable = Math.max(0, subtotal - discount);
  const taxRate = Math.min(toMoney(taxRateInput), 100);
  const taxAmount = Math.round(taxable * taxRate) / 100;
  const total = Math.round((taxable + taxAmount) * 100) / 100;

  return { lines, subtotal, discount, taxRate, taxAmount, total };
}

/** Naira formatting used in the UI and the generated documents. */
export function formatNaira(value: number, withDecimals = false): string {
  const amount = Number.isFinite(value) ? value : 0;
  return `₦${amount.toLocaleString('en-NG', {
    minimumFractionDigits: withDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}

export function invoiceBalance(invoice: Pick<Invoice, 'total' | 'amount_paid'>): number {
  return Math.max(0, Math.round((invoice.total - invoice.amount_paid) * 100) / 100);
}

/** Status shown to humans: an unpaid invoice past its due date reads "Overdue". */
export function effectiveStatus(invoice: Pick<Invoice, 'status' | 'due_date' | 'total' | 'amount_paid'>): InvoiceStatus {
  if (invoice.status === 'paid' || invoice.status === 'void' || invoice.status === 'draft') return invoice.status;
  if (invoiceBalance(invoice) <= 0) return 'paid';
  if (invoice.due_date) {
    const due = new Date(`${invoice.due_date}T23:59:59`);
    if (!Number.isNaN(due.getTime()) && due.getTime() < Date.now()) return 'overdue';
  }
  return invoice.amount_paid > 0 ? 'partially_paid' : invoice.status;
}

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
const SCALES = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];

function chunkToWords(value: number): string {
  const parts: string[] = [];
  if (value >= 100) {
    parts.push(`${ONES[Math.floor(value / 100)]} Hundred`);
    value %= 100;
  }
  if (value >= 20) {
    parts.push(TENS[Math.floor(value / 10)] + (value % 10 ? `-${ONES[value % 10]}` : ''));
  } else if (value > 0) {
    parts.push(ONES[value]);
  }
  return parts.join(' ');
}

/** "Two Million Five Hundred Thousand Naira Only" — expected on Nigerian invoices. */
export function amountInWords(value: number): string {
  const whole = Math.floor(Math.abs(value));
  const kobo = Math.round((Math.abs(value) - whole) * 100);

  if (whole === 0 && kobo === 0) return 'Zero Naira Only';

  const groups: string[] = [];
  let remaining = whole;
  let scale = 0;
  while (remaining > 0) {
    const chunk = remaining % 1000;
    if (chunk > 0) {
      const words = chunkToWords(chunk);
      groups.unshift(`${words}${SCALES[scale] ? ` ${SCALES[scale]}` : ''}`);
    }
    remaining = Math.floor(remaining / 1000);
    scale += 1;
  }

  const naira = groups.join(' ') || 'Zero';
  const koboText = kobo > 0 ? ` and ${chunkToWords(kobo)} Kobo` : '';
  return `${naira} Naira${koboText} Only`;
}

export function daysUntilDue(dueDate: string | null): number | null {
  if (!dueDate) return null;
  const due = new Date(`${dueDate}T23:59:59`);
  if (Number.isNaN(due.getTime())) return null;
  return Math.ceil((due.getTime() - Date.now()) / 86_400_000);
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addDaysIso(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}
