# De-Greenacres branded email system

## What is included
- 42 event templates in `src/emails/events.ts`, rendered by `EventEmail.tsx`.
- One shared, responsive, inline-styled, table-based `EmailLayout.tsx` with the existing logo, soft forest-green identity, company name, RC number, support contacts and safety footer. No webfont dependency; text branding remains visible when images are blocked.
- Configurable links based on `NEXT_PUBLIC_SITE_URL`. Event call-to-action URLs cannot navigate to an unrelated domain or a javascript URL.
- HTML and plain-text bodies, individual recipient envelopes, validated headers, and provider idempotency keys for workflow events.
- An admin-only preview catalogue at `/admin/email-templates`, linked in the administration sidebar. It does not send messages. The HTML-preview API independently verifies administrator access.
- Six Supabase-ready authentication HTML files under `email-deliverables/supabase-auth`.
- An offline design library at `email-deliverables/preview.html`. These previews contain no customer records and are not seeded website content.

## Events connected to real application actions
Email work is scheduled after a successful database mutation using Next.js `after()`. No submission is described as emailed unless the provider accepts it, and a secondary email failure does not roll back a successful request.

| Workflow | Emails | Source |
| --- | --- | --- |
| Validated contact form | Acknowledgement to submitter, notice to configured team inbox | `/api/contact`; legacy `/api/email` only delegates validated contact requests here |
| Public inspection request | Pending-confirmation acknowledgement and team notice | `/api/book-inspection` |
| Signed-in viewing request | Pending-confirmation acknowledgement and team notice | `/api/viewings` |
| Property enquiry | Acknowledgement and team notice | `/api/enquiries` |
| Owner listing submission | Pending-review acknowledgement and moderation notice | `/api/properties` |
| Listing publication/status transition | Published, pending-review, withdrawn, sold or rented notice to DB-owned owner address | Admin property PUT/PATCH and authorised property update route; only when status actually changes |
| Admin/owner listing deletion | Removal notice to DB-owned owner address after deletion succeeds | Admin property DELETE and authorised owner DELETE |
| Review submission | Pending-moderation acknowledgement and team notice | `/api/reviews` |
| Review approval/rejection | Moderation outcome, only on status transition | Both admin reviews and all-content CMS review update routes |
| Account profile update | Profile-change notice to authenticated account email | `/api/profile` PATCH, never GET |
| Password-change API | Password-change security notice | `/api/auth/change-password` |
| Admin-authored service message | Shared branded shell, real subject/body, individual envelopes | `/api/admin/send-email` |

Admin-created listings are not described as owner submissions. Read/unread toggles, page visits, saved-card clicks, failed validation and failed writes do not trigger acknowledgement emails.

## Provider-owned authentication emails — installation required
In the existing Supabase project, open Authentication → Email Templates. Copy the matching file from `email-deliverables/supabase-auth/` and set the matching subject from the template catalogue:

| File | Supabase template |
| --- | --- |
| `confirmation.html` | Confirm signup |
| `recovery.html` | Reset password |
| `magic_link.html` | Magic link |
| `invite.html` | Invite user |
| `email_change.html` | Change email address |
| `reauthentication.html` | Reauthentication |

The files preserve Supabase's `{{ .ConfirmationURL }}` or `{{ .Token }}` variables. Never replace these with a sample link, token or static user URL. Expiry wording deliberately follows provider configuration rather than inventing a duration.

Configure Supabase Site URL and allowed authentication redirects for `https://degreensacre.onrender.com`, including the actual recovery route `/auth/reset-password`. Use the existing PKCE/session recovery flow and test it end to end. Configure custom SMTP for production authentication delivery; the application's `RESEND_API_KEY` alone does not configure Supabase Auth SMTP.

The app also provides templates for password/email-change notices. Direct browser recovery currently calls Supabase Auth; that path needs the provider password-change notification enabled/configured, or a verified provider event handler. Avoid enabling two senders for the same password-change event. This change does NOT claim all authentication provider events are wired or installed.

## Conditional templates — deliberately not auto-sent
The catalogue includes welcome after confirmed registration, login alerts, confirmed/rescheduled/cancelled inspections, reminders, private-message alerts, saved-search matches, price changes, support replies, payment receipts/failures, refunds, service notices and marketing.

These require their actual verified workflows first:
- An inspection request is NOT a confirmed visit. A `replied` inbox flag is not evidence of a scheduled inspection.
- There is no verified payment/refund integration here. Never use a status toggle to send a payment receipt or imply title transfer.
- Private-message recipient addresses must be resolved by a trusted server worker/trigger with minimal privileges. Current profile RLS is not weakened to expose other users' emails. Message bodies should not be embedded in notification email.
- Reminders, saved-search matches and price alerts need a scheduler, user notification preferences and deduplication tied to real record changes.
- Marketing requires affirmative consent records and a working unsubscribe/suppression flow. Newsletter sending is blocked in the admin API until that exists. Admin service email must not be used to bypass this restriction.
- Login notices need verified provider sign-in events, not an anonymous public endpoint accepting an email address.

Legacy template exports remain compatible and inherit the new layout, colours and configured website links. The new event catalogue is the supported basis for future automation.

## Required production environment
Set these privately in Render (no `NEXT_PUBLIC_` prefix on mail-provider credentials):

```text
RESEND_API_KEY = actual Resend API key
EMAIL_FROM = De-Greenacres <noreply@your-verified-domain>
EMAIL_REPLY_TO = an actual monitored support mailbox
EMAIL_NOTIFICATIONS_TO = an actual monitored team inbox
NEXT_PUBLIC_SITE_URL = https://degreensacre.onrender.com
```

`EMAIL_NOTIFICATIONS_TO` falls back to `EMAIL_REPLY_TO`; if neither is valid, team notifications are skipped rather than sent to an invented address. In production, sendEmail requires both `EMAIL_FROM` and `EMAIL_REPLY_TO` as well as the Resend key. The publishable Supabase key belongs in the existing Supabase public-key variable; a service-role key is NOT needed for these application-email changes.

Verify your domain/sender in Resend and install its supplied DNS records. Configure SPF/DKIM and an appropriate DMARC policy for the real sending domain. The logo and display name provide visual branding; DNS authentication and domain ownership establish sender authenticity. Image loading is ultimately controlled by the recipient's email client.

## Delivery semantics and remaining production work
- Provider acceptance is not inbox delivery. Admin responses now say accepted, not delivered. Existing `sent_emails.status = sent` means the provider accepted the request, not that the mailbox received it.
- Event dispatch uses best-effort post-response tasks, not a durable database outbox. A process crash can lose an email. Failed tasks are logged without recipients, body content or security tokens. A durable outbox, retries/backoff, bounce/complaint webhook handling and an operator dashboard remain needed for guaranteed/recoverable production delivery.
- Resend deduplication lasts only for its provider retention window; this is not permanent exactly-once delivery. Source-record status comparisons reduce repeated moderation notices, but concurrent updates still require transactional/outbox deduplication for strict guarantees.
- The legacy anonymous email relay no longer sends arbitrary templates or unpersisted email requests. It delegates only validated, rate-limited contact requests.
- No live database reset, customer-data update, SMTP change or test customer email was performed as part of this implementation.

## Validation / regeneration
Run from the repository root:

```sh
NEXT_PUBLIC_SITE_URL=https://degreensacre.onrender.com npx tsx scripts/build-email-preview.tsx
NEXT_PUBLIC_SITE_URL=https://degreensacre.onrender.com npx tsx scripts/test-email.tsx
npm run type-check
npm run lint
npm run build
```

The render suite checks all 42 event templates, six Supabase placeholders, logo presence, plain-text output, HTML escaping and trusted navigation. The send suite intercepts all provider requests: it tests configuration failures, HTML/text payloads, idempotency, separate recipient envelopes, header validation, invalid schedules and provider rejection without sending real emails. Generated previews are review artifacts, not a new public email-sending API.

Before launch, test Gmail/Outlook/mobile rendering and a controlled mailbox, then confirm contact, inspection, listing moderation and auth recovery delivery using the real verified sender. No live inbox-delivery claim is made by local rendering/mocked-send tests.
