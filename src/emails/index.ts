// Email template index - import all templates from here

// Layout
export { default as EmailLayout } from './EmailLayout';

// Authentication
export { default as WelcomeVerificationEmail } from './WelcomeVerificationEmail';
export { default as PasswordResetEmail } from './PasswordResetEmail';
export { default as PasswordResetSuccessEmail } from './PasswordResetSuccessEmail';
export { default as LoginAlertEmail } from './LoginAlertEmail';

// Property
export {
  ListingSubmittedEmail,
  ListingApprovedEmail,
  ListingRejectedEmail,
  InquiryReceivedEmail,
  InquirySentEmail,
} from './PropertyEmails';

// Viewing & Alerts
export {
  ViewingScheduledEmail,
  ViewingReminderEmail,
  PriceDropEmail,
  NewPropertyAlertEmail,
} from './ViewingAndAlertEmails';

// Transactions & Marketing
export {
  PaymentReceiptEmail,
  PaymentFailedEmail,
  SubscriptionRenewalEmail,
  RefundProcessedEmail,
  WeeklyDigestEmail,
  ReEngagementEmail,
  ReferralInvitationEmail,
  ContactFormEmail,
  SupportTicketEmail,
  SupportResolvedEmail,
  PerformanceReportEmail,
} from './TransactionAndMarketingEmails';

export { default as EventEmail } from './EventEmail';
export { EMAIL_EVENTS } from './events';
export type { EmailEvent, EventEmailData } from './events';
