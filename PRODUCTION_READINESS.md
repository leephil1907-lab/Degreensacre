# Mobile refresh and launch status

## Implemented locally
- Softer green branding, neutral white surfaces and lighter hero overlay; readable 16px search controls.
- Mobile menu area search with real GET navigation, scroll containment and dark-mode tile contrast.
- Install Later/close and rejected native install prompts snoozed for 30 days in browser storage. Update Later snoozed for one day. Timers/listeners cleaned up; install suggestion waits for a cookie choice.
- Removed automatic geolocation solicitation: saved coordinates were not consumed by any search flow.
- Map remains accessible without published listings. Address no-match states explain OpenStreetMap coverage and offer an explicitly external Google Maps search. No guessed property coordinates.
- Owner/admin location picker accepts a simpler address or nearby landmark.
- Service-worker cache version advanced to v2.4.

## Verification
Production build and TypeScript passed. Lint: no errors, 239 existing warnings.
Isolated browser checks passed mobile menu search at 320/390/768px, horizontal-overflow checks at 320/390/768/1024/1440px, map no-match fallback, and install dismissal across reload. No browser page errors. API responses were intercepted in local UI tests; these are not live database tests.

## Live observations
Checked https://degreensacre.onrender.com/:
- /api/health: HTTP 200.
- /api/geocode?q=Lekki%20Lagos: HTTP 200 with real provider results.
- /api/properties?limit=1: HTTP 500, {"error":"Failed to fetch properties","success":false}.
The failing address reported by the owner has not yet been supplied; the exact reported case cannot yet be reproduced. No live Supabase writes, schema changes or resets were made.

## Launch blockers and next actions
1. Inspect Render logs for `GET /api/properties error` from a fresh request. Share only the error code/message, with credentials and personal data redacted. HTTP 500 alone does not establish whether this is configuration, paused service, schema, relationship or RLS failure.
2. Restore Supabase connector access. Verify the existing project is active, Render public URL/key refer to it, and the expected schema and RLS exist. Rehearse migrations on staging before live application; do not reset the database.
3. Set site/auth redirect URLs to the production domain and confirm actual email delivery, registration/recovery, owner submission/upload, admin moderation, RLS isolation, enquiries and messaging against live services.
4. Audit historical seeded database records without deleting genuine content; publish only reviewed real listings with confirmed coordinates.
5. Rotate previously exposed privileged credentials and verify production secrets remain server-only. Use shared rate limiting before horizontal scaling.
6. Deliver this commit to GitHub and redeploy Render, then rerun mobile and live-service acceptance checks. This local refresh has NOT been pushed or deployed.

A passing Render health check confirms that the web process is responding; it is not proof that listings, authentication or email work.
