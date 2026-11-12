import { readFileSync } from 'node:fs';
import path from 'node:path';
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import {
  amountInWords,
  COMPANY,
  effectiveStatus,
  formatNaira,
  invoiceBalance,
  STATUS_LABELS,
  type Invoice,
} from './invoices';

const A4 = { width: 595.28, height: 841.89 };
const MARGIN = 44;
const FOREST = rgb(0.192, 0.361, 0.286);
const INK = rgb(0.102, 0.102, 0.094);
const MUTED = rgb(0.42, 0.44, 0.45);
const LINE = rgb(0.9, 0.91, 0.9);
const CREAM = rgb(0.969, 0.973, 0.957);

/**
 * Standard PDF fonts are WinAnsi-encoded, so the naira sign and typographic
 * punctuation cannot be drawn directly. Normalise to characters that always
 * render instead of throwing at generation time.
 */
function safe(value: unknown): string {
  return String(value ?? '')
    .replace(/₦/g, 'NGN ')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u2022/g, '-')
    .replace(/[^\x20-\x7E\n]/g, '')
    .trim();
}

function money(value: number): string {
  return safe(formatNaira(value, true));
}

/** Table cells carry plain figures; the column header states the currency. */
function figure(value: number): string {
  return Number(value || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function shortDate(value: string | null): string {
  if (!value) return '-';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number, maxLines = 3): string[] {
  const words = safe(text).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
      if (lines.length === maxLines) break;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  if (lines.length === maxLines) {
    const last = lines[maxLines - 1];
    if (font.widthOfTextAtSize(`${last}…`, size) > maxWidth) {
      lines[maxLines - 1] = `${last.slice(0, Math.max(0, last.length - 2))}...`;
    }
  }
  return lines;
}

export async function renderInvoicePdf(invoice: Invoice): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let logo: Awaited<ReturnType<typeof pdf.embedPng>> | null = null;
  try {
    logo = await pdf.embedPng(readFileSync(path.join(process.cwd(), 'public', 'logo-256.png')));
  } catch {
    logo = null;
  }

  const status = effectiveStatus(invoice);
  const balance = invoiceBalance(invoice);
  const items = invoice.invoice_items ?? [];

  let page: PDFPage = pdf.addPage([A4.width, A4.height]);
  let y = A4.height;

  const text = (value: string, x: number, top: number, opts: { size?: number; font?: PDFFont; color?: typeof INK } = {}) => {
    page.drawText(value, {
      x,
      y: top,
      size: opts.size ?? 9.5,
      font: opts.font ?? regular,
      color: opts.color ?? INK,
    });
  };

  const textRight = (value: string, rightEdge: number, top: number, opts: Parameters<typeof text>[3] = {}) => {
    const font = opts.font ?? regular;
    const size = opts.size ?? 9.5;
    page.drawText(value, { x: rightEdge - font.widthOfTextAtSize(value, size), y: top, size, font, color: opts.color ?? INK });
  };

  const drawHeader = () => {
    if (logo) page.drawImage(logo, { x: MARGIN, y: y - 62, width: 52, height: 52 });
    const textX = MARGIN + 64;
    text(safe(COMPANY.name), textX, y - 24, { size: 12.5, font: bold });
    text(safe(`RC ${COMPANY.rcNumber}  |  ${COMPANY.address}`), textX, y - 37, { size: 8, color: MUTED });
    text(safe(`${COMPANY.phone}  |  ${COMPANY.email}`), textX, y - 48, { size: 8, color: MUTED });
    text(safe(COMPANY.website), textX, y - 59, { size: 8, color: MUTED });

    textRight('INVOICE', A4.width - MARGIN, y - 30, { size: 22, font: bold, color: FOREST });
    textRight(safe(invoice.invoice_number), A4.width - MARGIN, y - 46, { size: 10, font: bold });
    const label = safe(STATUS_LABELS[status].toUpperCase());
    const pillWidth = regular.widthOfTextAtSize(label, 7.5) + 16;
    page.drawRectangle({
      x: A4.width - MARGIN - pillWidth,
      y: y - 64,
      width: pillWidth,
      height: 15,
      color: status === 'paid' ? rgb(0.91, 0.96, 0.92) : status === 'overdue' ? rgb(0.99, 0.925, 0.92) : CREAM,
      borderColor: LINE,
      borderWidth: 0.6,
    });
    page.drawText(label, {
      x: A4.width - MARGIN - pillWidth + 8,
      y: y - 59,
      size: 7.5,
      font: bold,
      color: status === 'overdue' ? rgb(0.647, 0.165, 0.122) : FOREST,
    });

    page.drawRectangle({ x: MARGIN, y: y - 74, width: A4.width - MARGIN * 2, height: 2.2, color: FOREST });
    y -= 96;
  };

  const drawTableHead = () => {
    page.drawRectangle({ x: MARGIN, y: y - 18, width: A4.width - MARGIN * 2, height: 18, color: FOREST });
    const head = (value: string, x: number, right = false) => {
      if (right) textRight(value, x, y - 12.5, { size: 7.5, font: bold, color: rgb(1, 1, 1) });
      else text(value, x, y - 12.5, { size: 7.5, font: bold, color: rgb(1, 1, 1) });
    };
    head('#', MARGIN + 8);
    head('DESCRIPTION', MARGIN + 26);
    head('QTY', 372, true);
    head('UNIT PRICE (NGN)', 452, true);
    head('AMOUNT (NGN)', A4.width - MARGIN - 10, true);
    y -= 18;
  };

  const drawFooter = () => {
    const footerY = 34;
    page.drawRectangle({ x: MARGIN, y: footerY + 14, width: A4.width - MARGIN * 2, height: 0.7, color: LINE });
    text(safe(`${COMPANY.name}  |  RC ${COMPANY.rcNumber}`), MARGIN, footerY, { size: 7.5, color: MUTED });
    textRight(safe(`${COMPANY.website}  |  ${COMPANY.email}  |  ${COMPANY.phone}`), A4.width - MARGIN, footerY, {
      size: 7.5,
      color: MUTED,
    });
  };

  drawHeader();

  // ---- billed to / facts ----
  text('BILLED TO', MARGIN, y, { size: 7, font: bold, color: MUTED });
  text(safe(invoice.client_name), MARGIN, y - 14, { size: 10.5, font: bold });
  let leftY = y - 26;
  for (const line of [invoice.client_address, invoice.client_email, invoice.client_phone].filter(Boolean).slice(0, 3)) {
    for (const wrapped of wrap(String(line), regular, 8.5, 250, 2)) {
      text(wrapped, MARGIN, leftY, { size: 8.5, color: MUTED });
      leftY -= 11;
    }
  }
  if (invoice.property_title) {
    for (const wrapped of wrap(`Property: ${invoice.property_title}`, bold, 8.5, 250, 2)) {
      text(wrapped, MARGIN, leftY, { size: 8.5, font: bold, color: MUTED });
      leftY -= 11;
    }
  }

  const factsX = A4.width - MARGIN;
  let factY = y;
  const fact = (label: string, value: string) => {
    textRight(safe(label), factsX - 96, factY, { size: 8, color: MUTED });
    textRight(safe(value), factsX, factY, { size: 8.5, font: bold });
    factY -= 13;
  };
  fact('Issue date', shortDate(invoice.issue_date));
  fact('Due date', shortDate(invoice.due_date));
  fact('Currency', 'NGN');

  y = Math.min(leftY, factY) - 14;

  // ---- items ----
  drawTableHead();

  items.forEach((item, index) => {
    const lines = wrap(item.description, regular, 9, 272, 2);
    const rowHeight = Math.max(20, lines.length * 11 + 9);
    if (y - rowHeight < 190) {
      drawFooter();
      page = pdf.addPage([A4.width, A4.height]);
      y = A4.height - MARGIN;
      drawTableHead();
    }
    if (index % 2 === 1) {
      page.drawRectangle({ x: MARGIN, y: y - rowHeight, width: A4.width - MARGIN * 2, height: rowHeight, color: rgb(0.988, 0.99, 0.984) });
    }
    text(String(index + 1), MARGIN + 8, y - 13, { size: 8.5, color: MUTED });
    lines.forEach((line, lineIndex) => text(line, MARGIN + 26, y - 13 - lineIndex * 11, { size: 9 }));
    textRight(Number(item.quantity).toLocaleString('en-NG'), 372, y - 13, { size: 9 });
    textRight(figure(Number(item.unit_price)), 452, y - 13, { size: 9 });
    textRight(figure(Number(item.amount)), A4.width - MARGIN - 10, y - 13, { size: 9, font: bold });
    y -= rowHeight;
    page.drawRectangle({ x: MARGIN, y, width: A4.width - MARGIN * 2, height: 0.6, color: LINE });
  });

  // ---- totals ----
  if (y < 250) {
    drawFooter();
    page = pdf.addPage([A4.width, A4.height]);
    y = A4.height - MARGIN - 30;
  }

  const totalsRight = A4.width - MARGIN;
  let totalY = y - 22;
  const totalRow = (label: string, value: string, opts: { strong?: boolean; size?: number; color?: typeof INK } = {}) => {
    const size = opts.size ?? 9.5;
    textRight(safe(label), totalsRight - 130, totalY, { size, color: opts.color ?? MUTED, font: opts.strong ? bold : regular });
    textRight(safe(value), totalsRight, totalY, { size, font: bold, color: opts.color ?? INK });
    totalY -= size + 7;
  };

  totalRow('Subtotal', money(invoice.subtotal));
  if (invoice.discount > 0) totalRow('Discount', `- ${money(invoice.discount)}`);
  if (invoice.tax_rate > 0) totalRow(`VAT (${invoice.tax_rate}%)`, money(invoice.tax_amount));
  page.drawRectangle({ x: totalsRight - 250, y: totalY + 9, width: 250, height: 0.8, color: FOREST });
  totalY -= 4;
  totalRow('Total', money(invoice.total), { strong: true, size: 13, color: FOREST });
  if (invoice.amount_paid > 0) {
    totalRow('Amount paid', money(invoice.amount_paid));
    totalRow('Balance due', money(balance), { strong: true, size: 10.5 });
  }
  y = totalY - 8;

  // ---- amount in words ----
  page.drawRectangle({ x: MARGIN, y: y - 26, width: A4.width - MARGIN * 2, height: 26, color: CREAM });
  page.drawRectangle({ x: MARGIN, y: y - 26, width: 2.6, height: 26, color: FOREST });
  text('Amount in words', MARGIN + 10, y - 11, { size: 7, font: bold, color: MUTED });
  for (const line of wrap(amountInWords(invoice.total), bold, 8.8, A4.width - MARGIN * 2 - 24, 1)) {
    text(line, MARGIN + 10, y - 21, { size: 8.8, font: bold });
  }
  y -= 42;

  // ---- payment + terms ----
  const cardWidth = (A4.width - MARGIN * 2 - 14) / 2;
  const cardTop = y;
  const drawCard = (x: number, title: string, bodyLines: string[]) => {
    const height = 22 + Math.max(1, bodyLines.length) * 11;
    page.drawRectangle({ x, y: cardTop - height, width: cardWidth, height, color: rgb(1, 1, 1), borderColor: LINE, borderWidth: 0.7 });
    text(title.toUpperCase(), x + 10, cardTop - 13, { size: 6.8, font: bold, color: MUTED });
    bodyLines.forEach((line, index) => text(line, x + 10, cardTop - 26 - index * 11, { size: 8.3 }));
    return height;
  };

  const bankLines = [invoice.bank_name, invoice.bank_account_name, invoice.bank_account_number]
    .filter(Boolean)
    .map((line) => safe(String(line)))
    .slice(0, 3);
  if (bankLines.length) bankLines.push(safe(`Reference: ${invoice.invoice_number}`));

  const termsLines = [
    ...wrap(invoice.terms || 'Payment is due by the date shown above.', regular, 8.3, cardWidth - 20, 3),
    ...(invoice.notes ? wrap(invoice.notes, regular, 8.3, cardWidth - 20, 2) : []),
  ];

  const leftHeight = drawCard(MARGIN, 'Payment details', bankLines.length ? bankLines : [safe('Bank details on request.')]);
  const rightHeight = drawCard(MARGIN + cardWidth + 14, 'Terms & notes', termsLines);

  y = cardTop - Math.max(leftHeight, rightHeight) - 26;

  page.drawRectangle({ x: MARGIN, y: y + 6, width: 150, height: 0.8, color: rgb(0.72, 0.74, 0.72) });
  text('Authorised signatory', MARGIN, y - 4, { size: 7.5, color: MUTED });
  text(safe(COMPANY.name), MARGIN, y - 14, { size: 8, font: bold });
  textRight('Thank you for your business.', A4.width - MARGIN, y - 4, { size: 8.5, font: bold, color: FOREST });

  drawFooter();

  const bytes = await pdf.save();
  return bytes;
}
