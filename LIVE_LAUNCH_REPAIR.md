# Launch repair — 7 November 2026

## What is repaired in the existing live database

Five focused transactional migrations were applied to the existing Supabase project. No reset, recreation, record deletion, synthetic account creation or email sending occurred.

- **Site settings:** migrated existing company/contact values into the JSON settings structure; public endpoint now returns **200**, previously **503**. Existing settings have a private before-image.
- **Reviews:** all six known example-domain seed reviews retained but unpublished. Public endpoint now reports **zero**. Public submissions cannot approve or verify themselves. Reviewer emails/account identifiers are excluded from a dedicated public projection; anonymous email-column reads are denied.
- **Inventory:** all **nine** property records preserved. **Eight** historically documented stock-photo listings without confirmed coordinates are pending verification, not classified as proven fake or deleted. **One** existing listing remains public. Before-images were preserved privately. Republish the eight only after checking ownership, current pricing, real photos, documents and coordinates.
- **Profiles/admin:** removed public profile-directory access; ordinary users cannot grant themselves administrator/verified status or forge their Auth email. Signup metadata cannot select an administrator role. Administrator visibility preserved.
- **CMS compatibility:** articles, agency/agent/development publication controls and missing compatibility columns added. Old development inspection text preserved before conversion. Draft content stays private. No agencies, agents, developments or articles were fabricated.
- **Messaging:** sender/recipient and conversation membership policies repaired, unsafe participant self-joining removed, read updates restricted to read state, and a restricted profile-summary RPC added.
- **Storage/documents:** image bucket and owner/admin policies installed; sensitive document buckets private; document metadata defaults private. Public raw analytics reads removed. Active viewing slots have an atomic uniqueness constraint.

Private database before-images are in `launch_repair_private.snapshots`, inaccessible to public application roles. They are an in-database preservation aid, **not an independent disaster-recovery backup**.

## Application repairs prepared in this workspace

- Anonymous enquiry inserts no longer request a private SELECT result that privacy RLS must reject.
- Messages use the restricted correspondent summary RPC rather than reopening public profile access.
- Uploaded image metadata is written with the authenticated user context, so owner edits really trigger re-moderation; administrators may manage other owners' images through the authorized upload route.
- Public review reads use the privacy projection. Invalid administrator account-type actions return validation errors instead of violating the legacy constraint.
- Empty/null coordinates no longer become an invented `0,0` map pin. Missing plot inventory and size no longer produce made-up availability or per-square-metre pricing.
- Removed hard-coded Coastal Highway offer/bank-transfer panels from homepage and land page; live CMS listings remain. No automatic payment assertion or fabricated replacement offer was added.
- Known stock-library listing images are withheld from public listing cards/galleries, location pages and widgets; neutral photo placeholders are used. Original database records remain available for administrator verification. Hero imagery is explicitly illustrative.
- Diaspora page reads saved JSON company settings correctly. Service-worker version advanced to **v2.5** for this repair release.

**These application changes are not a claim of a successful push or Render deployment.** Deployment status is recorded separately below.

## Verification

- Clean synthetic PostgreSQL 17 fixture: all five migrations applied, all five reapplied, behavioral security assertions passed after both passes. No production fixture execution.
- Read-only live role checks: anonymous profiles/documents/raw analytics hidden; settings available; existing administrator can still read all nine properties and six preserved reviews.
- Latest public GET smoke: settings, reviews, properties, agencies, agents, developments and health return **200**.
- Node 22 type check and production build passed. ESLint: **0 errors, 237 warnings**; not a warning-free codebase.
- Local browser UI rehearsal using actual production public GET responses: **20 route/viewport checks**, widths **320, 390, 768, 1024, 1440**; no horizontal overflow or page exceptions; mobile navigation opened/closed; no stock listing photos or old hard-coded bank panel on the checked pages. This is **not deployed-browser or authenticated end-to-end acceptance**.

Machine-readable results: `frontend-audit/launch-repair-results.json`. Synthetic tests and their limitations: `scripts/rehearsal/README.md`.

## Remaining external dependencies / acceptance

1. **Push and deployment:** changes need authenticated repository push and Render deployment, followed by a live **v2.5** worker check and authenticated smoke test. The previous one-time GitHub credential was not retained. GitHub and Render connectors are unsupported here. The currently observed live worker is **v2.4**; an earlier push has deployed, but that does not prove this repair has deployed.
2. **Email:** Supabase Auth has no custom SMTP host/user/password/sender configured and still uses default templates. Configure a verified sender/provider and install the supplied Auth templates; configure application Resend sender, reply-to and monitored team inbox. No provider credentials were invented and email confirmation was not disabled. Test confirmation, reset and actual inbox receipt with authorized real accounts.
3. **Content verification:** administrator must supply/confirm real property photographs and locations and review the eight unpublished listings. Do not invent pins or republish unverifiable material. Empty agency/development/agent sections are honest, not a reason to insert sample content.
4. **Controlled authenticated acceptance:** no ordinary production account existed for a two-account live isolation test. Real signup, login, owner submission, moderation, upload, messaging and email-receipt acceptance still require authorized accounts and deployed application changes. Local policy tests do not replace this.
5. **Previously documented email limitations:** template availability is not universal automation; the existing `after()` dispatcher is best-effort rather than a durable queue. Conditional/payment/reminder/marketing workflows are not claimed complete.

The project is materially repaired, **not declared fully launch-ready while these dependencies remain**. Preserve the original `LIVE_LAUNCH_AUDIT.md` as the historical pre-repair evidence.
