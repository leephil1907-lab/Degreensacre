import React from 'react';
import EmailLayout from './EmailLayout';

interface Props { name: string; resetUrl: string; }

export default function PasswordResetEmail({ name, resetUrl }: Props) {
  return (
    <EmailLayout previewText="Reset your De-Greenacres password">
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
        Password Reset Request
      </h1>
      <p style={{ fontSize: '15px', color: '#666666', lineHeight: '1.6', marginBottom: '24px' }}>
        Hi {name},
      </p>
      <p style={{ fontSize: '15px', color: '#1A1A1A', lineHeight: '1.7', marginBottom: '24px' }}>
        We received a request to reset the password for your De-Greenacres account. Click the button below to create a new password:
      </p>
      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ marginBottom: '24px' }}>
        <tr>
          <td align="center">
            <a href={resetUrl} style={{ display: 'inline-block', backgroundColor: '#C41E7A', color: '#ffffff', padding: '14px 40px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none' }}>
              Reset Password
            </a>
          </td>
        </tr>
      </table>
      <div style={{ backgroundColor: '#fff8e1', borderLeft: '4px solid #f59e0b', padding: '16px', borderRadius: '0 8px 8px 0', marginBottom: '24px' }}>
        <div style={{ fontSize: '13px', color: '#92400e', lineHeight: '1.6' }}>
          <strong>⚠️ Security Notice:</strong> This link expires in <strong>1 hour</strong>. If you didn't request this reset, please secure your account immediately.
        </div>
      </div>
      <p style={{ fontSize: '13px', color: '#999999', lineHeight: '1.6' }}>
        If you didn't request a password reset, someone may have entered your email by mistake. You can safely ignore this email and your password will remain unchanged.
      </p>
    </EmailLayout>
  );
}
