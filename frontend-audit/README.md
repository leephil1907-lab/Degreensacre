# Frontend production QA

`qa.cjs` exercises the production core in Chromium at 320, 390, 1024 and 1440 pixels. It covers property grid/list/map layouts, filters, mobile navigation, homepage search, theme persistence, the Explore menu, property details, overflow/invisible-content checks and address-search states.

## Important data boundary

- Property records are intercepted **test fixtures only**. They are never imported by the website or written to Supabase.
- Multi-result and no-result geocoder responses are deterministic intercepted fixtures.
- The single-result `Ikeja, Lagos` search uses the live Nominatim integration and therefore depends on external availability.
- Run the test against a local server using non-production credentials. Do not point it at a public production database.

## Run

Start the website on `http://localhost:3000`, install Playwright/Chromium in the local test environment, then pass the Playwright module path to the script:

```bash
node frontend-audit/qa.cjs /absolute/path/to/node_modules/playwright
```

The script exits nonzero on a failed browser assertion. When piping output through `tee`, enable `set -o pipefail` so failures remain visible:

```bash
set -o pipefail
node frontend-audit/qa.cjs /absolute/path/to/node_modules/playwright | tee frontend-audit/final-production-qa.log
```

Screenshots and logs are local audit evidence and are ignored by Git. The repeatable script and this guide are tracked.
