import React from 'react';
import EmailLayout from './EmailLayout';
import { EMAIL_BRAND as brand, emailUrl } from './brand';

export type AuthEmailKind = 'confirm_signup' | 'reset_password' | 'confirm_email_change';

const COPY: Record<AuthEmailKind, { subject: string; eyebrow: string; title: string; body: string; action: string; fallbackPath: string; note: string }> = {
  confirm_signup: {
    subject: 'Confirm your De-Greenacres account',
    eyebrow: 'One step left',
    title: 'Confirm your e-mail address',
    body: 'Welcome to De-Greenacres. Confirm this e-mail address to activate your account and start saving properties, booking inspections and tracking your enquiries.',
    action: 'Confirm my e-mail',
    fallbackPath: '/signin',
    note: 'This link expires in one hour. If you did not create an account, ignore this message and nothing will happen.',
  },
  reset_password: {
    subject: 'Reset your De-Greenacres password',
    eyebrow: 'Account security',
    title: 'Choose a new password',
    body: 'We received a request to reset the password on your De-Greenacres account. Use the button below to choose a new one.',
    action: 'Reset my password',
    fallbackPath: '/forgot-password',
    note: 'This link expires in one hour and can only be used once. If you did not ask for a reset, no action is needed — your password stays the same.',
  },
  confirm_email_change: {
    subject: 'Confirm your new De-Greenacres e-mail',
    eyebrow: 'Account security',
    title: 'Confirm your new e-mail address',
    body: 'Use the button below to confirm this address as the new sign-in e-mail for your De-Greenacres account.',
    action: 'Confirm new e-mail',
    fallbackPath: '/dashboard',
    note: 'If you did not request this change, contact us immediately so we can secure your account.',
  },
};

export default function AuthEmail({ kind, actionLink, name }: { kind: AuthEmailKind; actionLink: string; name?: string }) {
  const copy = COPY[kind];
  const safeLink = actionLink || emailUrl(copy.fallbackPath);

  return (
    <EmailLayout previewText={`${copy.title} — ${brand.legalName}`}>
      <p style={{ margin: '0 0 14px', color: brand.muted, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
        {copy.eyebrow}
      </p>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 30, lineHeight: '38px', fontWeight: 400, margin: '0 0 22px', color: '#253e31' }}>
        {copy.title}
      </h1>
      <p style={{ margin: '0 0 12px', fontSize: 15, lineHeight: '25px' }}>Hello{name ? ` ${name}` : ''},</p>
      <p style={{ margin: '0 0 24px', fontSize: 15, lineHeight: '26px', color: '#495b50' }}>{copy.body}</p>

      <table role="presentation" cellPadding={0} cellSpacing={0} style={{ marginBottom: 22 }}>
        <tbody>
          <tr>
            <td style={{ backgroundColor: brand.green, borderRadius: 8, textAlign: 'center' }}>
              <a
                href={safeLink}
                style={{
                  display: 'inline-block', padding: '15px 26px', backgroundColor: brand.green, border: `1px solid ${brand.green}`,
                  borderRadius: 8, color: '#ffffff', fontSize: 14, lineHeight: '20px', fontWeight: 700, textDecoration: 'none',
                }}
              >
                {copy.action} →
              </a>
            </td>
          </tr>
        </tbody>
      </table>

      <p style={{ fontSize: 12, lineHeight: '20px', color: '#627569', margin: '0 0 18px' }}>
        Button not working? Paste this address into your browser:<br />
        <a href={safeLink} style={{ color: brand.green, overflowWrap: 'anywhere' }}>{safeLink}</a>
      </p>

      <p style={{ margin: '0 0 10px', fontSize: 13, lineHeight: '22px', color: '#6b7d72' }}>{copy.note}</p>

      <p style={{ margin: 0, fontSize: 14, lineHeight: '24px', color: '#495b50' }}>
        Here to help you find, verify and own.<br />
        <strong>The De-Greenacres team</strong>
      </p>
    </EmailLayout>
  );
}
