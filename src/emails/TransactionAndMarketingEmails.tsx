import React from 'react';
import EmailLayout from './EmailLayout';

/* ============================================ */
/* 1. PAYMENT RECEIPT */
/* ============================================ */
interface PaymentReceiptProps { name: string; amount: number; reference: string; description: string; date: string; }
export function PaymentReceiptEmail({ name, amount, reference, description, date }: PaymentReceiptProps) {
  return (
    <EmailLayout previewText={`Payment receipt — ₦${amount.toLocaleString()}`}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
        Payment Received ✅
      </h1>
      <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.6', marginBottom: '24px' }}>Hi {name},</p>
      <p style={{ fontSize: '15px', color: '#1A1A1A', lineHeight: '1.7', marginBottom: '24px' }}>
        Your payment has been processed successfully. Here's your receipt:
      </p>
      <div style={{ backgroundColor: '#f0f7eb', padding: '24px', borderRadius: '8px', marginBottom: '24px', textAlign: 'center' as const }}>
        <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' as const, letterSpacing: '1px', marginBottom: '4px' }}>Amount Paid</div>
        <div style={{ fontSize: '36px', fontWeight: 700, color: '#283818' }}>₦{amount.toLocaleString()}</div>
      </div>
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '24px' }}>
        <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
          <tr><td style={{ fontSize: '13px', color: '#666', paddingBottom: '10px' }}>📋 Description:</td><td style={{ fontSize: '13px', color: '#1A1A1A', fontWeight: 600, paddingBottom: '10px' }}>{description}</td></tr>
          <tr><td style={{ fontSize: '13px', color: '#666', paddingBottom: '10px' }}>🔢 Reference:</td><td style={{ fontSize: '13px', color: '#1A1A1A', fontFamily: 'monospace', paddingBottom: '10px' }}>{reference}</td></tr>
          <tr><td style={{ fontSize: '13px', color: '#666' }}>📅 Date:</td><td style={{ fontSize: '13px', color: '#1A1A1A' }}>{date}</td></tr>
        </table>
      </div>
      <p style={{ fontSize: '13px', color: '#999', lineHeight: '1.6' }}>
        A copy of this receipt has been saved to your account dashboard.
      </p>
    </EmailLayout>
  );
}

/* ============================================ */
/* 2. PAYMENT FAILED */
/* ============================================ */
interface PaymentFailedProps { name: string; amount: number; reason: string; description: string; }
export function PaymentFailedEmail({ name, amount, reason, description }: PaymentFailedProps) {
  return (
    <EmailLayout previewText="Your payment could not be processed">
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
        Payment Failed
      </h1>
      <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.6', marginBottom: '24px' }}>Hi {name},</p>
      <p style={{ fontSize: '15px', color: '#1A1A1A', lineHeight: '1.7', marginBottom: '24px' }}>
        We were unable to process your payment of <strong>₦{amount.toLocaleString()}</strong> for <strong>{description}</strong>.
      </p>
      <div style={{ backgroundColor: '#fff0f0', borderLeft: '4px solid #ef4444', padding: '16px', borderRadius: '0 8px 8px 0', marginBottom: '24px' }}>
        <div style={{ fontSize: '13px', color: '#991b1b', lineHeight: '1.6' }}>
          <strong>Reason:</strong> {reason}
        </div>
      </div>
      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
        <tr><td align="center">
          <a href="https://degreenacres.com/dashboard/payments" style={{ display: 'inline-block', backgroundColor: '#C41E7A', color: '#ffffff', padding: '14px 40px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none' }}>
            Retry Payment
          </a>
        </td></tr>
      </table>
    </EmailLayout>
  );
}

/* ============================================ */
/* 3. SUBSCRIPTION RENEWAL */
/* ============================================ */
interface SubscriptionRenewalProps { name: string; plan: string; amount: number; renewalDate: string; }
export function SubscriptionRenewalEmail({ name, plan, amount, renewalDate }: SubscriptionRenewalProps) {
  return (
    <EmailLayout previewText={`Your ${plan} plan renews on ${renewalDate}`}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
        Subscription Renewal
      </h1>
      <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.6', marginBottom: '24px' }}>Hi {name},</p>
      <p style={{ fontSize: '15px', color: '#1A1A1A', lineHeight: '1.7', marginBottom: '24px' }}>
        Your <strong>{plan}</strong> subscription will automatically renew on <strong>{renewalDate}</strong>.
      </p>
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '24px', textAlign: 'center' as const }}>
        <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' as const, letterSpacing: '1px' }}>Renewal Amount</div>
        <div style={{ fontSize: '28px', fontWeight: 700, color: '#283818', marginTop: '4px' }}>₦{amount.toLocaleString()}</div>
      </div>
      <p style={{ fontSize: '13px', color: '#999', lineHeight: '1.6' }}>
        To manage your subscription, visit your account settings.
      </p>
    </EmailLayout>
  );
}

/* ============================================ */
/* 4. REFUND PROCESSED */
/* ============================================ */
interface RefundProps { name: string; amount: number; reference: string; reason: string; }
export function RefundProcessedEmail({ name, amount, reference, reason }: RefundProps) {
  return (
    <EmailLayout previewText={`Refund of ₦${amount.toLocaleString()} has been processed`}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
        Refund Processed
      </h1>
      <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.6', marginBottom: '24px' }}>Hi {name},</p>
      <p style={{ fontSize: '15px', color: '#1A1A1A', lineHeight: '1.7', marginBottom: '24px' }}>
        A refund of <strong>₦{amount.toLocaleString()}</strong> has been processed for transaction <strong>{reference}</strong>.
      </p>
      <div style={{ backgroundColor: '#f0f7eb', padding: '20px', borderRadius: '8px', marginBottom: '24px', textAlign: 'center' as const }}>
        <div style={{ fontSize: '12px', color: '#666' }}>Refund Amount</div>
        <div style={{ fontSize: '28px', fontWeight: 700, color: '#283818' }}>₦{amount.toLocaleString()}</div>
      </div>
      <p style={{ fontSize: '13px', color: '#999', lineHeight: '1.6' }}>
        <strong>Reason:</strong> {reason}<br />
        Please allow 5-7 business days for the refund to reflect in your account.
      </p>
    </EmailLayout>
  );
}

/* ============================================ */
/* 5. WEEKLY PROPERTY DIGEST */
/* ============================================ */
interface DigestProps { name: string; newCount: number; topProperties: Array<{ title: string; price: number; location: string; url: string }>; marketUpdate?: string; }
export function WeeklyDigestEmail({ name, newCount, topProperties, marketUpdate }: DigestProps) {
  return (
    <EmailLayout previewText={`This week: ${newCount} new properties + market insights`}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
        Weekly Property Digest 📰
      </h1>
      <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.6', marginBottom: '24px' }}>Hi {name},</p>
      <p style={{ fontSize: '15px', color: '#1A1A1A', lineHeight: '1.7', marginBottom: '24px' }}>
        Here's what happened this week at De-Greenacres:
      </p>
      <div style={{ backgroundColor: '#f0f7eb', padding: '20px', borderRadius: '8px', marginBottom: '24px', textAlign: 'center' as const }}>
        <div style={{ fontSize: '36px', fontWeight: 700, color: '#283818' }}>{newCount}</div>
        <div style={{ fontSize: '13px', color: '#666' }}>New properties listed this week</div>
      </div>
      <div style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A', marginBottom: '12px' }}>🔥 Top Picks This Week</div>
      {topProperties.map((p, i) => (
        <div key={i} style={{ border: '1px solid #e5e5e5', borderRadius: '8px', padding: '14px', marginBottom: '8px' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A' }}>{p.title}</div>
          <div style={{ fontSize: '12px', color: '#666', margin: '4px 0' }}>📍 {p.location}</div>
          <a href={p.url} style={{ fontSize: '16px', fontWeight: 700, color: '#283818', textDecoration: 'none' }}>₦{p.price.toLocaleString()} →</a>
        </div>
      ))}
      {marketUpdate && (
        <div style={{ backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '8px', marginTop: '16px', marginBottom: '24px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '6px' }}>📊 Market Update</div>
          <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.6' }}>{marketUpdate}</div>
        </div>
      )}
      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
        <tr><td align="center">
          <a href="https://degreenacres.com/properties" style={{ display: 'inline-block', backgroundColor: '#283818', color: '#ffffff', padding: '14px 40px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none' }}>
            Explore All Properties
          </a>
        </td></tr>
      </table>
    </EmailLayout>
  );
}

/* ============================================ */
/* 6. RE-ENGAGEMENT (inactive users) */
/* ============================================ */
interface ReEngagementProps { name: string; daysSinceLastVisit: number; newCount: number; }
export function ReEngagementEmail({ name, daysSinceLastVisit, newCount }: ReEngagementProps) {
  return (
    <EmailLayout previewText={`We miss you! ${newCount} new properties waiting for you`}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
        We've Missed You! 👋
      </h1>
      <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.6', marginBottom: '24px' }}>Hi {name},</p>
      <p style={{ fontSize: '15px', color: '#1A1A1A', lineHeight: '1.7', marginBottom: '24px' }}>
        It's been <strong>{daysSinceLastVisit} days</strong> since your last visit. A lot has changed!
      </p>
      <div style={{ backgroundColor: '#f0f7eb', padding: '20px', borderRadius: '8px', marginBottom: '24px', textAlign: 'center' as const }}>
        <div style={{ fontSize: '36px', fontWeight: 700, color: '#283818' }}>{newCount}</div>
        <div style={{ fontSize: '13px', color: '#666' }}>New properties listed since your last visit</div>
      </div>
      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ marginBottom: '24px' }}>
        <tr><td align="center">
          <a href="https://degreenacres.com/properties" style={{ display: 'inline-block', backgroundColor: '#C41E7A', color: '#ffffff', padding: '14px 40px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none' }}>
            See What's New
          </a>
        </td></tr>
      </table>
      <p style={{ fontSize: '13px', color: '#999', lineHeight: '1.6' }}>
        Don't miss out on great investment opportunities. Update your alert preferences to get notified about properties that match your criteria.
      </p>
    </EmailLayout>
  );
}

/* ============================================ */
/* 7. REFERRAL INVITATION */
/* ============================================ */
interface ReferralProps { name: string; referralCode: string; referralUrl: string; bonusAmount: number; }
export function ReferralInvitationEmail({ name, referralCode, referralUrl, bonusAmount }: ReferralProps) {
  return (
    <EmailLayout previewText={`Refer friends and earn ₦${bonusAmount.toLocaleString()} per signup`}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
        Refer & Earn 🎁
      </h1>
      <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.6', marginBottom: '24px' }}>Hi {name},</p>
      <p style={{ fontSize: '15px', color: '#1A1A1A', lineHeight: '1.7', marginBottom: '24px' }}>
        Love De-Greenacres? Share it with friends and earn <strong>₦{bonusAmount.toLocaleString()}</strong> for every person who signs up using your referral link.
      </p>
      <div style={{ backgroundColor: '#f0f7eb', padding: '24px', borderRadius: '8px', marginBottom: '24px', textAlign: 'center' as const }}>
        <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' as const, letterSpacing: '1px', marginBottom: '8px' }}>Your Referral Code</div>
        <div style={{ fontSize: '28px', fontWeight: 700, color: '#283818', fontFamily: 'monospace', letterSpacing: '2px' }}>{referralCode}</div>
      </div>
      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
        <tr><td align="center">
          <a href={referralUrl} style={{ display: 'inline-block', backgroundColor: '#C41E7A', color: '#ffffff', padding: '14px 40px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none' }}>
            Share My Link
          </a>
        </td></tr>
      </table>
    </EmailLayout>
  );
}

/* ============================================ */
/* 8. CONTACT FORM SUBMISSION (to admin) */
/* ============================================ */
interface ContactFormProps { name: string; email: string; phone?: string; subject: string; message: string; }
export function ContactFormEmail({ name, email, phone, subject, message }: ContactFormProps) {
  return (
    <EmailLayout previewText={`New contact form: ${subject}`}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
        New Contact Form Submission
      </h1>
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '24px' }}>
        <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
          <tr><td style={{ fontSize: '13px', color: '#666', paddingBottom: '10px' }}>👤 Name:</td><td style={{ fontSize: '13px', color: '#1A1A1A', fontWeight: 600, paddingBottom: '10px' }}>{name}</td></tr>
          <tr><td style={{ fontSize: '13px', color: '#666', paddingBottom: '10px' }}>📧 Email:</td><td style={{ fontSize: '13px', paddingBottom: '10px' }}><a href={`mailto:${email}`} style={{ color: '#283818' }}>{email}</a></td></tr>
          {phone && <tr><td style={{ fontSize: '13px', color: '#666', paddingBottom: '10px' }}>📞 Phone:</td><td style={{ fontSize: '13px', paddingBottom: '10px' }}>{phone}</td></tr>}
          <tr><td style={{ fontSize: '13px', color: '#666', paddingBottom: '10px' }}>📋 Subject:</td><td style={{ fontSize: '13px', color: '#1A1A1A', fontWeight: 600, paddingBottom: '10px' }}>{subject}</td></tr>
        </table>
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e5e5' }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>Message:</div>
          <div style={{ fontSize: '14px', color: '#1A1A1A', lineHeight: '1.6' }}>{message}</div>
        </div>
      </div>
    </EmailLayout>
  );
}

/* ============================================ */
/* 9. SUPPORT TICKET CREATED */
/* ============================================ */
interface SupportTicketProps { name: string; ticketId: string; subject: string; }
export function SupportTicketEmail({ name, ticketId, subject }: SupportTicketProps) {
  return (
    <EmailLayout previewText={`Support ticket #${ticketId} created`}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
        Support Ticket Created
      </h1>
      <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.6', marginBottom: '24px' }}>Hi {name},</p>
      <p style={{ fontSize: '15px', color: '#1A1A1A', lineHeight: '1.7', marginBottom: '24px' }}>
        Your support request has been received. Our team will respond within 24 hours.
      </p>
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '24px' }}>
        <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
          <tr><td style={{ fontSize: '13px', color: '#666', paddingBottom: '8px' }}>🔢 Ticket ID:</td><td style={{ fontSize: '13px', color: '#1A1A1A', fontWeight: 600, fontFamily: 'monospace', paddingBottom: '8px' }}>#{ticketId}</td></tr>
          <tr><td style={{ fontSize: '13px', color: '#666' }}>📋 Subject:</td><td style={{ fontSize: '13px', color: '#1A1A1A', fontWeight: 600 }}>{subject}</td></tr>
        </table>
      </div>
      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
        <tr><td align="center">
          <a href={`https://degreenacres.com/dashboard/support/${ticketId}`} style={{ display: 'inline-block', backgroundColor: '#283818', color: '#ffffff', padding: '14px 40px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none' }}>
            Track Ticket
          </a>
        </td></tr>
      </table>
    </EmailLayout>
  );
}

/* ============================================ */
/* 10. SUPPORT TICKET RESOLVED */
/* ============================================ */
interface SupportResolvedProps { name: string; ticketId: string; subject: string; resolution: string; }
export function SupportResolvedEmail({ name, ticketId, subject, resolution }: SupportResolvedProps) {
  return (
    <EmailLayout previewText={`Ticket #${ticketId} has been resolved`}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
        Ticket Resolved ✅
      </h1>
      <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.6', marginBottom: '24px' }}>Hi {name},</p>
      <p style={{ fontSize: '15px', color: '#1A1A1A', lineHeight: '1.7', marginBottom: '24px' }}>
        Your support ticket <strong>#{ticketId}</strong> regarding <strong>{subject}</strong> has been resolved.
      </p>
      <div style={{ backgroundColor: '#f0f7eb', padding: '20px', borderRadius: '8px', marginBottom: '24px' }}>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>Resolution:</div>
        <div style={{ fontSize: '14px', color: '#1A1A1A', lineHeight: '1.6' }}>{resolution}</div>
      </div>
      <p style={{ fontSize: '13px', color: '#999', lineHeight: '1.6' }}>
        If you're not satisfied with the resolution, you can reopen the ticket from your dashboard.
      </p>
    </EmailLayout>
  );
}

/* ============================================ */
/* 11. LISTING PERFORMANCE REPORT */
/* ============================================ */
interface PerformanceReportProps { name: string; totalViews: number; totalEnquiries: number; topListing: string; period: string; }
export function PerformanceReportEmail({ name, totalViews, totalEnquiries, topListing, period }: PerformanceReportProps) {
  return (
    <EmailLayout previewText={`Your ${period} listing performance report`}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
        Listing Performance Report 📊
      </h1>
      <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.6', marginBottom: '24px' }}>Hi {name},</p>
      <p style={{ fontSize: '15px', color: '#1A1A1A', lineHeight: '1.7', marginBottom: '24px' }}>
        Here's how your listings performed this {period}:
      </p>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <div style={{ flex: 1, backgroundColor: '#f0f7eb', padding: '20px', borderRadius: '8px', textAlign: 'center' as const }}>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#283818' }}>{totalViews}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>Total Views</div>
        </div>
        <div style={{ flex: 1, backgroundColor: '#fff0f7', padding: '20px', borderRadius: '8px', textAlign: 'center' as const }}>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#C41E7A' }}>{totalEnquiries}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>Enquiries</div>
        </div>
      </div>
      <div style={{ backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
        <div style={{ fontSize: '13px', color: '#666' }}>🏆 Top Performing:</div>
        <div style={{ fontSize: '15px', fontWeight: 600, color: '#1A1A1A', marginTop: '4px' }}>{topListing}</div>
      </div>
      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
        <tr><td align="center">
          <a href="https://degreenacres.com/dashboard/analytics" style={{ display: 'inline-block', backgroundColor: '#283818', color: '#ffffff', padding: '14px 40px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none' }}>
            View Full Analytics
          </a>
        </td></tr>
      </table>
    </EmailLayout>
  );
}
