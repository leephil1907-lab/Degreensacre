# Isolated migration rehearsal — never production seed data

`legacy-fixture.sql` is synthetic security-test input, not site content and not a production migration. **Never execute it against Supabase.** It contains only a partial approximation of the legacy schema; it is not a full production clone.

Rehearsal used PostgreSQL 17 on `127.0.0.1:55432`, a new empty local database, the fixture, the five numbered `migrations/20261107_*.sql` files in order, then `security-tests.sql`. Each migration was applied inside its own transaction (`psql -v ON_ERROR_STOP=1 -1 -f ...`). All five were then repeated to test re-application; assertions passed again. Tests roll back their DML.

Coverage: preserved settings and rows; pending/unverified public review submission; profile self-elevation and forged-email protection; safe signup metadata; owner edits requiring reapproval; administrator reads and verification; pair-restricted messaging; read-state-only message updates; outsider denial, participant self-join denial, safe profile summaries; owner/outsider storage writes; notification spoof denial; article-draft privacy. Separate local assertions checked anonymous reviewer-email access is denied.

These are database-policy tests, **not real browser signups, uploads, inbox-delivery tests, or authenticated production end-to-end acceptance**. Live checks were read-only anonymous/administrator role probes and public GET requests. No synthetic accounts or content were installed in production.
