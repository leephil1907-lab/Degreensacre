import { Resend } from 'resend';
import { render, toPlainText } from '@react-email/render';
import type { ReactElement } from 'react';
import { isEmail } from './validation';

export type EmailResult = { success: boolean; id?: string; error?: string };

type SendOptions = { to: string; subject: string; template: ReactElement; replyTo?: string; idempotencyKey?: string; scheduledAt?: Date };

/** Provider acceptance is not proof of inbox delivery. Never log recipient PII or tokens. */
export async function sendEmail({ to, subject, template, replyTo, idempotencyKey, scheduledAt }: SendOptions): Promise<EmailResult> {
  if (!process.env.RESEND_API_KEY) return { success: false, error: 'Email delivery is not configured' };
  if (process.env.NODE_ENV === 'production' && (!process.env.EMAIL_FROM || !process.env.EMAIL_REPLY_TO)) {
    return { success: false, error: 'Verified EMAIL_FROM and monitored EMAIL_REPLY_TO are required' };
  }
  if (!isEmail(to) || /[\r\n]/.test(subject) || subject.length > 200 || (replyTo && !isEmail(replyTo))) return { success: false, error: 'Invalid email fields' };
  try {
    const html = await render(template);
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'De-Greenacres <onboarding@resend.dev>',
      to: [to], subject, html, text: toPlainText(html),
      replyTo: replyTo || process.env.EMAIL_REPLY_TO,
      ...(scheduledAt ? { scheduledAt: scheduledAt.toISOString() } : {}),
    }, idempotencyKey ? { idempotencyKey } : undefined);
    if (error) {
      console.error('[email] Provider rejected email:', error.name);
      return { success: false, error: 'Email provider rejected the message' };
    }
    return { success: true, id: data?.id };
  } catch {
    console.error('[email] Rendering or delivery failed');
    return { success: false, error: 'Email delivery failed' };
  }
}

/** Individual envelopes prevent disclosure of other recipients' addresses. */
export async function sendBulkEmail({ recipients, subject, template }: { recipients: string[]; subject: string; template: ReactElement }) {
  const unique = [...new Set(recipients.map(value => value.trim().toLowerCase()))];
  if (!unique.length || unique.length > 100) return { success: false, error: 'Send to 1–100 recipients at a time' };
  let accepted = 0;
  for (const to of unique) { const result = await sendEmail({ to, subject, template }); if (result.success) accepted++; }
  return { success: accepted === unique.length, accepted, failed: unique.length - accepted };
}

export async function scheduleEmail(options: SendOptions & { scheduledAt: Date }) {
  if (!Number.isFinite(options.scheduledAt.getTime()) || options.scheduledAt.getTime() <= Date.now()) return { success: false, error: 'A future schedule time is required' };
  return sendEmail(options);
}
