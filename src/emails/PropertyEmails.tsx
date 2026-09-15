import React from 'react';
import EmailLayout from './EmailLayout';

/* ============================================ */
/* 1. PROPERTY LISTING SUBMITTED (for sellers) */
/* ============================================ */
interface ListingSubmittedProps { name: string; propertyTitle: string; propertyLocation: string; }
export function ListingSubmittedEmail({ name, propertyTitle, propertyLocation }: ListingSubmittedProps) {
  return (
    <EmailLayout previewText={`Your property "${propertyTitle}" is under review`}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
        Listing Under Review 📋
      </h1>
      <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.6', marginBottom: '24px' }}>Hi {name},</p>
      <p style={{ fontSize: '15px', color: '#1A1A1A', lineHeight: '1.7', marginBottom: '24px' }}>
        Your property listing has been received and is currently under review by our team.
      </p>
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '24px' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A', marginBottom: '12px' }}>Property Details</div>
        <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
          <tr><td style={{ fontSize: '13px', color: '#666', paddingBottom: '8px' }}>🏠 Title:</td><td style={{ fontSize: '13px', color: '#1A1A1A', fontWeight: 600, paddingBottom: '8px' }}>{propertyTitle}</td></tr>
          <tr><td style={{ fontSize: '13px', color: '#666', paddingBottom: '8px' }}>📍 Location:</td><td style={{ fontSize: '13px', color: '#1A1A1A', paddingBottom: '8px' }}>{propertyLocation}</td></tr>
          <tr><td style={{ fontSize: '13px', color: '#666' }}>📋 Status:</td><td style={{ fontSize: '13px', color: '#f59e0b', fontWeight: 600 }}>Pending Review</td></tr>
        </table>
      </div>
      <div style={{ backgroundColor: '#f0f7eb', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
        <div style={{ fontSize: '13px', color: '#2D5016', lineHeight: '1.6' }}>
          <strong>What happens next?</strong><br />
          Our team will review your listing within 24-48 hours. You'll receive an email once it's approved and live on the platform.
        </div>
      </div>
      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
        <tr><td align="center">
          <a href="https://degreenacres.com/dashboard/listings" style={{ display: 'inline-block', backgroundColor: '#2D5016', color: '#ffffff', padding: '14px 40px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none' }}>
            View My Listings
          </a>
        </td></tr>
      </table>
    </EmailLayout>
  );
}

/* ============================================ */
/* 2. PROPERTY LISTING APPROVED */
/* ============================================ */
interface ListingApprovedProps { name: string; propertyTitle: string; propertyUrl: string; }
export function ListingApprovedEmail({ name, propertyTitle, propertyUrl }: ListingApprovedProps) {
  return (
    <EmailLayout previewText={`Your property "${propertyTitle}" is now live!`}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
        Your Listing is Live! 🎉
      </h1>
      <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.6', marginBottom: '24px' }}>Hi {name},</p>
      <p style={{ fontSize: '15px', color: '#1A1A1A', lineHeight: '1.7', marginBottom: '24px' }}>
        Great news! Your property <strong>{propertyTitle}</strong> has been approved and is now visible to thousands of potential buyers on De-Greenacres.
      </p>
      <div style={{ backgroundColor: '#f0f7eb', borderLeft: '4px solid #2D5016', padding: '16px', borderRadius: '0 8px 8px 0', marginBottom: '24px' }}>
        <div style={{ fontSize: '13px', color: '#2D5016', lineHeight: '1.6' }}>
          <strong>✅ Approved!</strong> Your listing meets our quality standards and is now searchable on the platform.
        </div>
      </div>
      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ marginBottom: '24px' }}>
        <tr><td align="center">
          <a href={propertyUrl} style={{ display: 'inline-block', backgroundColor: '#2D5016', color: '#ffffff', padding: '14px 40px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none' }}>
            View Live Listing
          </a>
        </td></tr>
      </table>
      <p style={{ fontSize: '13px', color: '#999', lineHeight: '1.6' }}>
        You'll receive notifications when buyers show interest in your property.
      </p>
    </EmailLayout>
  );
}

/* ============================================ */
/* 3. PROPERTY LISTING REJECTED */
/* ============================================ */
interface ListingRejectedProps { name: string; propertyTitle: string; reason: string; }
export function ListingRejectedEmail({ name, propertyTitle, reason }: ListingRejectedProps) {
  return (
    <EmailLayout previewText={`Action needed for your property "${propertyTitle}"`}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
        Listing Needs Attention
      </h1>
      <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.6', marginBottom: '24px' }}>Hi {name},</p>
      <p style={{ fontSize: '15px', color: '#1A1A1A', lineHeight: '1.7', marginBottom: '24px' }}>
        Your listing <strong>{propertyTitle}</strong> could not be approved at this time. Here's why:
      </p>
      <div style={{ backgroundColor: '#fff8e1', borderLeft: '4px solid #f59e0b', padding: '16px', borderRadius: '0 8px 8px 0', marginBottom: '24px' }}>
        <div style={{ fontSize: '13px', color: '#92400e', lineHeight: '1.6' }}>
          <strong>Reason:</strong> {reason}
        </div>
      </div>
      <p style={{ fontSize: '15px', color: '#1A1A1A', lineHeight: '1.7', marginBottom: '24px' }}>
        Please update your listing and resubmit. Our team is happy to help if you have questions.
      </p>
      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
        <tr><td align="center">
          <a href="https://degreenacres.com/dashboard/listings" style={{ display: 'inline-block', backgroundColor: '#2D5016', color: '#ffffff', padding: '14px 40px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none' }}>
            Edit Listing
          </a>
        </td></tr>
      </table>
    </EmailLayout>
  );
}

/* ============================================ */
/* 4. PROPERTY INQUIRY RECEIVED (for sellers) */
/* ============================================ */
interface InquiryReceivedProps { sellerName: string; buyerName: string; propertyTitle: string; buyerPhone?: string; buyerEmail: string; message: string; }
export function InquiryReceivedEmail({ sellerName, buyerName, propertyTitle, buyerPhone, buyerEmail, message }: InquiryReceivedProps) {
  return (
    <EmailLayout previewText={`New inquiry from ${buyerName} about "${propertyTitle}"`}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
        New Property Inquiry 🔔
      </h1>
      <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.6', marginBottom: '24px' }}>Hi {sellerName},</p>
      <p style={{ fontSize: '15px', color: '#1A1A1A', lineHeight: '1.7', marginBottom: '24px' }}>
        <strong>{buyerName}</strong> is interested in your property <strong>{propertyTitle}</strong>.
      </p>
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '24px' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A', marginBottom: '12px' }}>Buyer Details</div>
        <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
          <tr><td style={{ fontSize: '13px', color: '#666', paddingBottom: '8px' }}>👤 Name:</td><td style={{ fontSize: '13px', color: '#1A1A1A', fontWeight: 600, paddingBottom: '8px' }}>{buyerName}</td></tr>
          <tr><td style={{ fontSize: '13px', color: '#666', paddingBottom: '8px' }}>📧 Email:</td><td style={{ fontSize: '13px', paddingBottom: '8px' }}><a href={`mailto:${buyerEmail}`} style={{ color: '#2D5016' }}>{buyerEmail}</a></td></tr>
          {buyerPhone && <tr><td style={{ fontSize: '13px', color: '#666', paddingBottom: '8px' }}>📞 Phone:</td><td style={{ fontSize: '13px', paddingBottom: '8px' }}><a href={`tel:${buyerPhone}`} style={{ color: '#2D5016' }}>{buyerPhone}</a></td></tr>}
        </table>
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e5e5' }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>💬 Message:</div>
          <div style={{ fontSize: '14px', color: '#1A1A1A', lineHeight: '1.6' }}>{message}</div>
        </div>
      </div>
      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
        <tr><td align="center">
          <a href={`https://wa.me/${buyerPhone?.replace(/\D/g, '')}`} style={{ display: 'inline-block', backgroundColor: '#25D366', color: '#ffffff', padding: '14px 40px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', marginRight: '12px' }}>
            💬 Reply on WhatsApp
          </a>
        </td></tr>
      </table>
    </EmailLayout>
  );
}

/* ============================================ */
/* 5. INQUIRY SENT CONFIRMATION (for buyers) */
/* ============================================ */
interface InquirySentProps { name: string; propertyTitle: string; agentName: string; }
export function InquirySentEmail({ name, propertyTitle, agentName }: InquirySentProps) {
  return (
    <EmailLayout previewText={`Your inquiry about "${propertyTitle}" has been sent`}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
        Inquiry Sent ✅
      </h1>
      <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.6', marginBottom: '24px' }}>Hi {name},</p>
      <p style={{ fontSize: '15px', color: '#1A1A1A', lineHeight: '1.7', marginBottom: '24px' }}>
        Your inquiry about <strong>{propertyTitle}</strong> has been sent to <strong>{agentName}</strong>. They typically respond within 24 hours.
      </p>
      <div style={{ backgroundColor: '#f0f7eb', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
        <div style={{ fontSize: '13px', color: '#2D5016', lineHeight: '1.6' }}>
          <strong>💡 Tip:</strong> For faster responses, you can also reach the agent directly via WhatsApp from the property listing page.
        </div>
      </div>
      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
        <tr><td align="center">
          <a href="https://degreenacres.com/dashboard/enquiries" style={{ display: 'inline-block', backgroundColor: '#2D5016', color: '#ffffff', padding: '14px 40px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none' }}>
            View My Enquiries
          </a>
        </td></tr>
      </table>
    </EmailLayout>
  );
}
