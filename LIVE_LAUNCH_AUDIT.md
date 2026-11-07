# De-Greenacres live launch audit

Date: 7 November 2026
Site: https://degreensacre.onrender.com/
Scope: read-only public HTTP/browser checks and Supabase metadata/aggregate queries. No customer account was created, no form was submitted, no email was sent, and no live database row/schema/policy was changed.

## Repository delivery
The saved UI and email changes were merged with the repository's newer mobile-navigation and typography commits. Remote main had advanced to `3a11119`; its compact dropdown and four white BUY/RENT/LAND/COMMERCIAL buttons were preserved alongside the saved mobile search, lighter palette, persistent install dismissal and email system.

Application merge commit `514c361686f26fb2a1459699ef1cc6043dba577e` was successfully pushed. Merged-source type-check, lint and production build passed. Authentication used a per-command helper, not a saved Git credential or token-bearing remote.

The live service worker still reported `de-greenacres-v2.3` during this audit, while the pushed version is v2.4. Therefore the successful Git push is NOT evidence that Render has deployed the new application. Confirm the Render deployment commit and then repeat acceptance checks.

## Live checks that passed
- Homepage, properties, contact, inspection request, signin and signup pages: HTTP 200.
- `/api/health`: HTTP 200.
- `/api/properties?limit=1`: HTTP 200; total count 9. The earlier listings HTTP 500 is no longer reproduced.
- `/api/reviews?limit=1`: HTTP 200; count 6. Content integrity remains a blocker below.
- `/api/developments`, `/api/agencies`, `/api/agents`: HTTP 200 with empty lists. Empty lists are not necessarily errors; no sample content was inserted.
- `/api/geocode?q=Lekki%20Lagos`: HTTP 200 with 5 results.
- `/logo-icon.png`: HTTP 200.
- Anonymous `/admin/email-templates` navigation redirects to signin.
- Real browser homepage checks at 320, 390, 768, 1024 and 1440px: no horizontal overflow. Mobile menu opened and displayed the four category buttons.
- Live Land/Uyo filter produced one listing. Its map showed one marker; address search displayed multiple matching alternatives without guessing between them.
- No uncaught browser page errors in this public smoke test. This does not imply all backend requests succeeded: settings fails as noted below.

## Launch blockers / highest-priority work

### 1. Site settings and CMS schema mismatch — confirmed
`/api/site-settings` returns HTTP 503. The application selects `site_settings.settings`, but the live table has legacy individual columns and NO `settings` JSONB column. The live schema also lacks the `articles` table expected by the CMS.

Action: rehearse a non-destructive, reviewed compatibility migration, preserving existing company/contact settings; then apply to the existing project and verify public settings and all-content admin. Do not reset the database or blindly rerun a fresh-install schema. The current production CMS migration must be reconciled with the live schema rather than assumed applied.

### 2. Published legacy reviews — confirmed
There are six reviews total. All six are approved, and all six have `@example.com` addresses. The old repository review seed script explicitly inserted example-domain approved reviews. These are unsuitable as live customer testimonials without independent provenance; the user requires no fake/sample content.

Action: review and unpublish/quarantine legacy seeded reviews while preserving any genuine evidence and records. No review was deleted or modified in this audit. All 9 listings are flagged `sample=false`; that flag alone does not establish authenticity. Audit each listing's ownership, price, address, images and documentation separately. Public listing image URLs currently use Unsplash; confirm/replace them with authorised actual property photos rather than presenting stock photos as verified site photographs.

### 3. Review moderation can be bypassed at the database boundary — confirmed policy weakness
The live public review INSERT policy has `WITH CHECK (true)`, and no review trigger was found to enforce pending-only submissions. Setting pending in the website API does not by itself constrain direct anonymous Supabase inserts.

Action: constrain public inserts to unapproved, unverified reviews; retain publication authority for real administrators. Test with read-only analysis first, then controlled non-production positive/negative tests. No malicious review was inserted to demonstrate the weakness.

### 4. Admin profile access and publication guards need reconciliation — confirmed metadata gaps
The live profile SELECT policy is own-row only, with no administrator-wide SELECT policy. The live profile privilege guard freezes `is_admin` and `is_verified` for every session-authenticated update, including administrator actions. This conflicts with the application's RLS-scoped admin user-management and owner-recipient lookup flows.

The live property status default is still `available`. Its existing publication guard prevents a non-admin initial publication, but does not itself move edits to an already-public property back into moderation. Its public SELECT policy checks availability but not the `sample` flag. Application-side checks are not a substitute for database enforcement.

Action: reconcile admin-readable profile policies, privileged-field protection and pending/re-moderation defaults with the reviewed production design. Preserve prevention of self-promotion. Test actual ordinary-user/admin sessions and direct Supabase requests in a controlled environment before launch. No protected account mutation was attempted.

### 5. Property map coordinates — confirmed data gap
Read-only database inventory shows 9 available listings, of which only 1 has non-empty saved coordinates. Eight cannot honestly display an exact marker.

Action: confirm each property's entrance/location with the owner, save the actual coordinates through administration, and inspect the map on mobile. Do not invent markers or silently use a city-centre point as the property location.

## Email, account and operational acceptance still required
- Deploy the new 42-event branded email library and six Supabase auth templates. Templates exist in source; not every conditional event is automated.
- Verify `RESEND_API_KEY`, verified `EMAIL_FROM`, monitored `EMAIL_REPLY_TO` and `EMAIL_NOTIFICATIONS_TO` in Render. Do not expose private keys as NEXT_PUBLIC variables.
- Install branded auth HTML in Supabase and configure production SMTP/site URLs/redirects. Test signup confirmation and recovery using a controlled mailbox; do not assume application Resend configuration changes Supabase SMTP.
- Confirm actual core event mail delivery, bounce handling and reply routing. Provider acceptance is not proof of inbox delivery. Current post-response email tasks are best-effort, not a durable outbox; retries/outbox and webhook monitoring remain needed for recoverable delivery.
- Authenticated live QA remains pending for owner uploads/submission, moderation, user-management, saved properties, enquiries, private-message access and RLS isolation. Public page loading is not evidence those protected workflows work.
- Payment/refund automation, reminders, saved-search alerts and private-message email alerts remain conditional. Marketing requires consent records and an unsubscribe flow; do not present these as live integrations.
- Rotate credentials previously exposed in history/chat, including the chat-shared push token. Audit secret handling. Use shared rate limiting before horizontal scaling.

## Recommended order
1. Confirm Render deployed the pushed source.
2. Back up/rehearse and apply a reviewed, non-destructive schema/RLS compatibility migration.
3. Quarantine seeded testimonials after provenance review; verify real property content/photos and coordinates.
4. Configure verified email delivery and install branded auth templates.
5. Run controlled buyer/owner/admin acceptance tests and delivery tests, then monitor production errors and bounced emails.

No database reset, project recreation, record deletion, live migration or secret rotation was performed by this audit.
