/**
 * Email sending utility using Resend
 * 
 * Setup:
 * 1. Sign up at https://resend.com (free)
 * 2. Get your API key from the dashboard
 * 3. Add to .env.local: RESEND_API_KEY=re_xxxxxxxxx
 * 4. Install: npm install resend react react-dom @react-email/render
 */

import { Resend } from 'resend';
import { render } from '@react-email/render';

// Initialize Resend with API key
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null;

// Default sender (uses Resend's dev domain until you verify your own)
const FROM_EMAIL = process.env.EMAIL_FROM || 'De-Greenacres <onboarding@resend.dev>';
const FROM_EMAIL_PRODUCTION = process.env.EMAIL_FROM_PRODUCTION || 'De-Greenacres <hello@degreenacres.com>';

/**
 * Send an email using a React template
 * 
 * @param to - Recipient email address
 * @param subject - Email subject
 * @param template - React email component
 * @param replyTo - Optional reply-to address
 */
export async function sendEmail({
  to,
  subject,
  template,
  replyTo,
}: {
  to: string;
  subject: string;
  template: React.ReactElement;
  replyTo?: string;
}) {
  // Check if Resend is configured
  if (!resend) {
    console.warn('⚠️ Resend API key not configured. Email not sent.');
    console.log(`📧 Would have sent to: ${to}`);
    console.log(`📋 Subject: ${subject}`);
    return { success: false, error: 'Resend not configured' };
  }

  try {
    // Render React component to HTML
    const html = await render(template);

    // Determine sender based on environment
    const from = process.env.NODE_ENV === 'production' 
      ? FROM_EMAIL_PRODUCTION 
      : FROM_EMAIL;

    // Send email
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      replyTo: replyTo || 'support@degreenacres.com',
    });

    if (error) {
      console.error('❌ Email send error:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Email sent successfully:', data?.id);
    return { success: true, id: data?.id };
  } catch (error) {
    console.error('❌ Email send failed:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

/**
 * Send email to multiple recipients
 */
export async function sendBulkEmail({
  recipients,
  subject,
  template,
}: {
  recipients: string[];
  subject: string;
  template: React.ReactElement;
}) {
  if (!resend) {
    console.warn('⚠️ Resend not configured. Bulk email not sent.');
    return { success: false, error: 'Resend not configured' };
  }

  try {
    const html = await render(template);
    const from = process.env.NODE_ENV === 'production' 
      ? FROM_EMAIL_PRODUCTION 
      : FROM_EMAIL;

    // Resend allows up to 100 recipients per request
    const { data, error } = await resend.emails.send({
      from,
      to: recipients,
      subject,
      html,
    });

    if (error) {
      console.error('❌ Bulk email error:', error);
      return { success: false, error: error.message };
    }

    console.log(`✅ Bulk email sent to ${recipients.length} recipients`);
    return { success: true, id: data?.id };
  } catch (error) {
    console.error('❌ Bulk email failed:', error);
    return { success: false, error: 'Failed to send bulk email' };
  }
}

/**
 * Schedule an email to be sent later
 */
export async function scheduleEmail({
  to,
  subject,
  template,
  scheduledAt,
}: {
  to: string;
  subject: string;
  template: React.ReactElement;
  scheduledAt: Date;
}) {
  if (!resend) {
    console.warn('⚠️ Resend not configured. Email not scheduled.');
    return { success: false, error: 'Resend not configured' };
  }

  try {
    const html = await render(template);
    const from = process.env.NODE_ENV === 'production' 
      ? FROM_EMAIL_PRODUCTION 
      : FROM_EMAIL;

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      scheduledAt: scheduledAt.toISOString(),
    });

    if (error) {
      console.error('❌ Schedule email error:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Email scheduled:', data?.id);
    return { success: true, id: data?.id };
  } catch (error) {
    console.error('❌ Schedule email failed:', error);
    return { success: false, error: 'Failed to schedule email' };
  }
}
