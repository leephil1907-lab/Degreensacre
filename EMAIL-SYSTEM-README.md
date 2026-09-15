# 📧 De-Greenacres Email System

Complete email notification system with **20+ branded templates** powered by Resend.

---

## 🚀 Setup (5 Minutes)

### Step 1: Sign Up for Resend
1. Go to [resend.com](https://resend.com) and create a free account
2. Verify your email address
3. Go to **API Keys** in the dashboard and create a new key

### Step 2: Add API Key
Add this to your `.env.local`:

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
```

### Step 3: Install Dependencies
```bash
npm install resend @react-email/render
```

### Step 4: Done!
The system will use `onboarding@resend.dev` as the sender until you add your own domain.

---

## 📋 All Email Templates (21 Total)

### 🔐 Authentication (4 templates)

| # | Template | File | When It Sends |
|---|----------|------|---------------|
| 1 | **Welcome & Verify** | `WelcomeVerificationEmail.tsx` | After user signs up — contains verification link |
| 2 | **Password Reset Request** | `PasswordResetEmail.tsx` | When user clicks "Forgot Password" |
| 3 | **Password Reset Success** | `PasswordResetSuccessEmail.tsx` | After password is successfully changed |
| 4 | **Login Alert** | `LoginAlertEmail.tsx` | When sign-in detected from new device/location |

### 🏠 Property (5 templates)

| # | Template | File | When It Sends |
|---|----------|------|---------------|
| 5 | **Listing Submitted** | `PropertyEmails.tsx` | When seller submits a new property listing |
| 6 | **Listing Approved** | `PropertyEmails.tsx` | When admin approves a listing |
| 7 | **Listing Rejected** | `PropertyEmails.tsx` | When admin rejects a listing (includes reason) |
| 8 | **Inquiry Received** | `PropertyEmails.tsx` | When buyer sends inquiry to seller (includes buyer details + message) |
| 9 | **Inquiry Sent Confirmation** | `PropertyEmails.tsx` | Confirmation to buyer that their inquiry was sent |

### 📅 Viewing & Alerts (4 templates)

| # | Template | File | When It Sends |
|---|----------|------|---------------|
| 10 | **Viewing Scheduled** | `ViewingAndAlertEmails.tsx` | When property viewing is booked (date, time, address, agent) |
| 11 | **Viewing Reminder** | `ViewingAndAlertEmails.tsx` | 24 hours before scheduled viewing |
| 12 | **Price Drop Alert** | `ViewingAndAlertEmails.tsx` | When saved property's price drops (shows old vs new price) |
| 13 | **New Property Match** | `ViewingAndAlertEmails.tsx` | When new properties match user's saved criteria |

### 💳 Transactions (4 templates)

| # | Template | File | When It Sends |
|---|----------|------|---------------|
| 14 | **Payment Receipt** | `TransactionAndMarketingEmails.tsx` | After successful payment |
| 15 | **Payment Failed** | `TransactionAndMarketingEmails.tsx` | When payment fails (includes reason) |
| 16 | **Subscription Renewal** | `TransactionAndMarketingEmails.tsx` | Before subscription auto-renews |
| 17 | **Refund Processed** | `TransactionAndMarketingEmails.tsx` | When refund is initiated |

### 📢 Engagement & Support (4 templates)

| # | Template | File | When It Sends |
|---|----------|------|---------------|
| 18 | **Weekly Digest** | `TransactionAndMarketingEmails.tsx` | Weekly newsletter with new properties + market insights |
| 19 | **Re-engagement** | `TransactionAndMarketingEmails.tsx` | When user hasn't visited in a while |
| 20 | **Referral Invitation** | `TransactionAndMarketingEmails.tsx` | When user shares referral link |
| 21 | **Contact Form** | `TransactionAndMarketingEmails.tsx` | When someone submits contact form (sent to admin) |

### 🎫 Support (2 templates)

| # | Template | File | When It Sends |
|---|----------|------|---------------|
| 22 | **Support Ticket Created** | `TransactionAndMarketingEmails.tsx` | When user submits support request |
| 23 | **Support Ticket Resolved** | `TransactionAndMarketingEmails.tsx` | When support team resolves a ticket |

### 📊 Reports (1 template)

| # | Template | File | When It Sends |
|---|----------|------|---------------|
| 24 | **Performance Report** | `TransactionAndMarketingEmails.tsx` | Weekly/monthly listing analytics for sellers |

---

## 🎨 Email Design

Every template includes:

- **Header**: Forest green gradient with De-Greenacres logo + company name
- **Body**: Clean white card with professional typography
- **Footer**: RC: 1856064, contact info, WhatsApp button, privacy links
- **Mobile responsive**: Looks great on all devices
- **Brand colors**: Forest green (#2D5016), magenta (#C41E7A), ivory (#FAF9F6)

---

## 💻 Usage Examples

### Send Welcome Email
```typescript
import { sendEmail } from '@/lib/email';
import { WelcomeVerificationEmail } from '@/emails';

await sendEmail({
  to: 'john@example.com',
  subject: 'Welcome to De-Greenacres! Verify your email',
  template: WelcomeVerificationEmail({
    name: 'John',
    verificationUrl: 'https://degreenacres.com/verify?token=xxx',
  }),
});
```

### Send Password Reset
```typescript
import { PasswordResetEmail } from '@/emails';

await sendEmail({
  to: user.email,
  subject: 'Reset your De-Greenacres password',
  template: PasswordResetEmail({
    name: user.firstName,
    resetUrl: `https://degreenacres.com/reset-password?token=${token}`,
  }),
});
```

### Send Property Inquiry
```typescript
import { InquiryReceivedEmail } from '@/emails';

await sendEmail({
  to: seller.email,
  subject: `New inquiry from ${buyer.name} about "${property.title}"`,
  template: InquiryReceivedEmail({
    sellerName: seller.name,
    buyerName: buyer.name,
    propertyTitle: property.title,
    buyerPhone: buyer.phone,
    buyerEmail: buyer.email,
    message: 'I am interested in this property. When can I schedule a viewing?',
  }),
  replyTo: buyer.email,
});
```

### Schedule Email
```typescript
import { scheduleEmail } from '@/lib/email';
import { ViewingReminderEmail } from '@/emails';

// Send reminder 24 hours before viewing
await scheduleEmail({
  to: user.email,
  subject: 'Reminder: Property viewing tomorrow',
  template: ViewingReminderEmail({ ... }),
  scheduledAt: new Date(viewingDate.getTime() - 24 * 60 * 60 * 1000),
});
```

### Send Bulk (Newsletter)
```typescript
import { sendBulkEmail } from '@/lib/email';
import { WeeklyDigestEmail } from '@/emails';

await sendBulkEmail({
  recipients: subscriberEmails, // array of emails
  subject: 'This Week at De-Greenacres',
  template: WeeklyDigestEmail({ ... }),
});
```

---

## 🌐 Domain Setup (For Production)

When you get your domain (e.g., `degreenacres.com`):

1. Go to Resend dashboard → **Domains** → **Add Domain**
2. Add these DNS records to your domain:
   - **MX** record (for receiving)
   - **TXT** record (for SPF)
   - **CNAME** record (for DKIM)
3. Wait for verification (usually instant)
4. Add to `.env.local`:
   ```bash
   EMAIL_FROM_PRODUCTION="De-Greenacres <hello@degreenacres.com>"
   ```

---

## 📁 File Structure

```
src/
├── emails/
│   ├── EmailLayout.tsx              ← Shared header/footer/branding
│   ├── WelcomeVerificationEmail.tsx  ← Welcome + email verification
│   ├── PasswordResetEmail.tsx        ← Password reset request
│   ├── PasswordResetSuccessEmail.tsx ← Password changed confirmation
│   ├── LoginAlertEmail.tsx           ← New device/location alert
│   ├── PropertyEmails.tsx            ← 5 property-related templates
│   ├── ViewingAndAlertEmails.tsx     ← 4 viewing & alert templates
│   ├── TransactionAndMarketingEmails.tsx ← 11 transaction/marketing/support templates
│   └── index.ts                      ← All exports in one place
├── lib/
│   └── email.ts                     ← Resend sending utility
└── app/
    └── api/
        └── email/
            └── route.ts             ← API endpoint for sending
```

---

## 🔧 Environment Variables

```bash
# Required
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx

# Optional (defaults provided)
EMAIL_FROM="De-Greenacres <onboarding@resend.dev>"
EMAIL_FROM_PRODUCTION="De-Greenacres <hello@degreenacres.com>"
```

---

## 📊 Free Tier Limits

| Plan | Emails/Month | Cost |
|------|-------------|------|
| **Free** | 3,000 | $0 |
| **Pro** | 50,000 | $20/month |
| **Business** | Custom | Custom |

The free tier is more than enough to start!
