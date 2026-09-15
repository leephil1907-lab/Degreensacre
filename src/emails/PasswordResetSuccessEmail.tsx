import React from 'react';
import EmailLayout from './EmailLayout';

interface Props { name: string; }
export default function PasswordResetSuccessEmail({ name }: Props) {
  return (
    <EmailLayout previewText="Your De-Greenacres password has been changed">
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
        Password Changed ✅
      </h1>
      <p style={{ fontSize: '15px', color: '#666666', lineHeight: '1.6', marginBottom: '24px' }}>Hi {name},</p>
      <p style={{ fontSize: '15px', color: '#1A1A1A', lineHeight: '1.7', marginBottom: '24px' }}>
        Your password has been successfully changed. You can now sign in to your De-Greenacres account with your new password.
      </p>
      <div style={{ backgroundColor: '#fff0f0', borderLeft: '4px solid #ef4444', padding: '16px', borderRadius: '0 8px 8px 0', marginBottom: '24px' }}>
        <div style={{ fontSize: '13px', color: '#991b1b', lineHeight: '1.6' }}>
          <strong>🔒 Didn't make this change?</strong><br />
          If you did not change your password, please contact us immediately at +234 806 501 9971 or reply to this email.
        </div>
      </div>
      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
        <tr><td align="center">
          <a href="https://degreenacres.com/signin" style={{ display: 'inline-block', backgroundColor: '#2D5016', color: '#ffffff', padding: '14px 40px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none' }}>
            Sign In Now
          </a>
        </td></tr>
      </table>
    </EmailLayout>
  );
}
