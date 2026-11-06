/* eslint-disable @typescript-eslint/no-require-imports */
// TEST-ONLY browser fixtures. These are intercepted in Playwright and never
// imported by the website or written to a database.
const assert = require('node:assert/strict');
const { chromium } = require(process.argv[2]);

const fixtures = [
  { id: '00000000-0000-4000-8000-000000000001', slug: 'qa-detached-lekki', title: 'QA Detached Family Home', type: 'sale', property_type: 'Detached Duplex', price: 180000000, price_period: 'one-time', bedrooms: 5, bathrooms: 6, parking: 4, sqm: 450, address: '15 Test Close', area: 'Lekki Phase 1', city: 'Lagos', state: 'Lagos', description: 'A long test description designed to verify that buyers can understand the property layout, condition, documentation and inspection options without opening every result card.', features: ['All rooms ensuite'], amenities: ['Security'], images: ['/properties/property-1.jpg'], verification_status: 'verified', documentation: 'C of O', gated_estate: true, serviced: true, featured: true, coordinates: { lat: 6.4474, lng: 3.4550 }, date_added: '2026-10-01', views: 120 },
  { id: '00000000-0000-4000-8000-000000000002', slug: 'qa-apartment-ikoyi', title: 'QA Serviced Apartment', type: 'rent', property_type: 'Apartment', price: 6000000, price_period: 'per-year', bedrooms: 3, bathrooms: 4, parking: 2, sqm: 180, address: '10 Test Avenue', area: 'Ikoyi', city: 'Lagos', state: 'Lagos', description: 'A representative rental listing used only to test description spacing, responsive facts, documentation labels and clear actions across desktop and mobile screens.', features: ['Fitted kitchen'], amenities: ['Gym'], images: ['/properties/property-2.jpg'], verification_status: 'verified', documentation: "Governor's Consent", furnished: true, serviced: true, featured: true, coordinates: { lat: 6.4519, lng: 3.4297 }, date_added: '2026-09-28', views: 95 },
  { id: '00000000-0000-4000-8000-000000000003', slug: 'qa-land-uyo', title: 'QA Residential Land Parcel', type: 'sale', property_type: 'Land', price: 25000000, price_period: 'one-time', bedrooms: 0, bathrooms: 0, parking: 0, sqm: 500, address: '', area: 'Shelter Afrique', city: 'Uyo', state: 'Akwa Ibom', description: 'A test land result without saved coordinates. The interface must label the location as pending instead of placing an invented marker in the state.', features: [], amenities: [], images: [], verification_status: 'pending', documentation: 'Registered Survey', gated_estate: false, featured: false, coordinates: null, date_added: '2026-09-20', views: 75 },
  { id: '00000000-0000-4000-8000-000000000004', slug: 'qa-office-abuja', title: 'QA Office Building', type: 'sale', property_type: 'Office Space', price: 350000000, price_period: 'one-time', bedrooms: 0, bathrooms: 6, parking: 20, sqm: 650, address: '25 Test District', area: 'Maitama', city: 'Abuja', state: 'FCT', description: 'A commercial test listing with enough descriptive content to check line wrapping, price presentation, map actions and accessible card layouts.', features: ['Lift'], amenities: ['Backup power'], images: ['/properties/property-3.jpg'], verification_status: 'verified', documentation: 'C of O', featured: true, coordinates: { lat: 9.0833, lng: 7.4913 }, date_added: '2026-09-18', views: 60 },
  { id: '00000000-0000-4000-8000-000000000005', slug: 'qa-short-let-enugu', title: 'QA Furnished Short Let', type: 'short-let', property_type: 'Flat', price: 85000, price_period: 'per-night', bedrooms: 2, bathrooms: 2, parking: 1, sqm: 110, address: '8 Test Layout', area: 'Independence Layout', city: 'Enugu', state: 'Enugu', description: 'A short-let test listing used to verify that nightly pricing, smaller values, mobile card content and map markers remain clear and accurate.', features: ['Wi-Fi'], amenities: ['Air conditioning'], images: ['/properties/property-4.jpg'], verification_status: 'unverified', documentation: 'Deed of Assignment', furnished: true, featured: false, coordinates: { lat: 6.4461, lng: 7.5015 }, date_added: '2026-09-12', views: 45 },
  { id: '00000000-0000-4000-8000-000000000006', slug: 'qa-terrace-lekki', title: 'QA Terrace Duplex', type: 'sale', property_type: 'Terrace Duplex', price: 120000000, price_period: 'one-time', bedrooms: 4, bathrooms: 5, parking: 2, sqm: 320, address: '5 Test Street', area: 'Chevron Drive', city: 'Lagos', state: 'Lagos', description: 'A second unmapped test property used to check mapped and awaiting-location counts, address search entry and honest empty-map messaging.', features: ['Family lounge'], amenities: ['Security'], images: ['/properties/property-5.jpg'], verification_status: 'pending', documentation: 'C of O', gated_estate: true, featured: false, coordinates: null, date_added: '2026-09-08', views: 30 },
];

async function prepare(browser, width, height) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.addInitScript(() => localStorage.setItem('cookie-consent', 'declined'));
  await page.route(/\/api\/properties\?.*$/, async (route) => {
    const url = new URL(route.request().url());
    let items = [...fixtures];
    if (url.searchParams.get('type')) items = items.filter((item) => item.type === url.searchParams.get('type'));
    if (url.searchParams.get('propertyType')) items = items.filter((item) => item.property_type.toLowerCase() === url.searchParams.get('propertyType').toLowerCase());
    if (url.searchParams.get('featured') === 'true') items = items.filter((item) => item.featured);
    const count = items.length;
    const offset = Number(url.searchParams.get('offset') || 0);
    const limit = Number(url.searchParams.get('limit') || 50);
    items = items.slice(offset, offset + limit);
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ properties: items, count, success: true }) });
  });
  await page.route('**/api/properties/qa-detached-lekki', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ property: fixtures[0], success: true }) });
  });
  return page;
}

async function waitReady(page) {
  await page.waitForTimeout(2500);
}

async function metrics(page) {
  return page.evaluate(() => ({
    viewport: innerWidth,
    bodyWidth: document.body.scrollWidth,
    htmlWidth: document.documentElement.scrollWidth,
    articles: document.querySelectorAll('article').length,
    invisibleMainText: [...document.querySelectorAll('main *')].filter((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.opacity === '0' && rect.height > 20 && element.textContent && element.children.length === 0;
    }).length,
  }));
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  const watch = (page, name) => page.on('pageerror', (error) => { errors.push(`${name}: ${error.message}`); console.log('PAGEERROR', name, error.message); });

  const desktop = await prepare(browser, 1440, 1000);
  watch(desktop, 'desktop');
  await desktop.goto('http://localhost:3000/properties', { waitUntil: 'domcontentloaded' });
  await waitReady(desktop);
  console.log('DESKTOP_GRID', await metrics(desktop));
  await desktop.screenshot({ path: 'frontend-audit/after-properties-grid-desktop.png', fullPage: true });
  await desktop.screenshot({ path: 'frontend-audit/after-properties-grid-desktop-viewport.png' });

  await desktop.locator('[aria-controls="advanced-property-filters"]').click();
  await desktop.getByLabel(/Verification/).selectOption('verified');
  await desktop.waitForTimeout(300);
  console.log('VERIFIED_CARDS', await desktop.locator('article').count());
  await desktop.getByLabel(/Documentation/).selectOption('C of O');
  await desktop.waitForTimeout(300);
  console.log('VERIFIED_COO_CARDS', await desktop.locator('article').count());
  await desktop.getByRole('button', { name: /Clear/i }).first().click();
  const categoryGroup = desktop.getByRole('group', { name: 'Listing category' });
  await categoryGroup.getByRole('button', { name: 'Land', exact: true }).click();
  await desktop.waitForTimeout(300);
  assert.equal(await desktop.locator('article').count(), 1);
  assert.equal(await desktop.getByText('QA Residential Land Parcel', { exact: true }).count(), 1);
  console.log('LAND_CATEGORY_USES_PROPERTY_TYPE', true);
  await categoryGroup.getByRole('button', { name: 'Commercial', exact: true }).click();
  await desktop.waitForTimeout(300);
  assert.equal(await desktop.locator('article').count(), 1);
  assert.equal(await desktop.getByText('QA Office Building', { exact: true }).count(), 1);
  console.log('COMMERCIAL_CATEGORY_USES_PROPERTY_TYPE', true);
  await categoryGroup.getByRole('button', { name: 'All', exact: true }).click();
  await desktop.getByRole('group', { name: 'Results layout' }).getByRole('button', { name: 'List', exact: true }).click();
  await desktop.waitForTimeout(300);
  await desktop.screenshot({ path: 'frontend-audit/after-properties-list-desktop.png', fullPage: true });
  await desktop.getByRole('group', { name: 'Results layout' }).getByRole('button', { name: 'Map', exact: true }).click();
  await desktop.locator('.leaflet-container').waitFor({ timeout: 15000 });
  await desktop.waitForTimeout(3000);
  await desktop.screenshot({ path: 'frontend-audit/after-properties-map-desktop.png', fullPage: true });
  console.log('DESKTOP_MAP', await metrics(desktop));

  const addressInput = desktop.getByLabel('Find an address or landmark in Nigeria');
  await addressInput.fill('Ikeja, Lagos');
  const geocodeResponse = desktop.waitForResponse((response) => response.url().includes('/api/geocode'), { timeout: 25000 }).catch(() => null);
  await desktop.getByRole('button', { name: 'Search', exact: true }).last().click();
  const geocode = await geocodeResponse;
  console.log('GEOCODE_STATUS', geocode ? geocode.status() : 'no response');
  await desktop.waitForTimeout(2000);
  console.log('GEOCODE_RESULT_VISIBLE', await desktop.getByText('Address search result', { exact: true }).count());
  await desktop.screenshot({ path: 'frontend-audit/after-address-search-desktop.png', fullPage: true });
  assert.equal(geocode?.status(), 200);
  assert.equal(await desktop.getByText('Address search result', { exact: true }).count(), 1);

  // Deterministic geocoder fixtures verify that ambiguous matches are never
  // auto-selected and that a genuine empty result remains an explicit state.
  await desktop.route(/\/api\/geocode\?.*$/, async (route) => {
    const query = new URL(route.request().url()).searchParams.get('q');
    const results = query === 'QA Multiple' ? [
      { id: 'qa-place-1', name: 'QA Choice One', displayName: 'QA Choice One, Lagos, Nigeria', lat: 6.52, lng: 3.37, category: 'place', type: 'neighbourhood', address: { state: 'Lagos' } },
      { id: 'qa-place-2', name: 'QA Choice Two', displayName: 'QA Choice Two, Abuja, Nigeria', lat: 9.07, lng: 7.48, category: 'place', type: 'suburb', address: { state: 'FCT' } },
    ] : [];
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ results, success: true }) });
  });
  await addressInput.fill('QA Multiple');
  await desktop.getByRole('button', { name: 'Search', exact: true }).last().click();
  await desktop.getByText('Choose the correct match', { exact: true }).waitFor();
  const choices = desktop.getByRole('button', { name: /QA Choice (One|Two)/ });
  assert.equal(await choices.count(), 2);
  assert.equal(await desktop.getByText('Address search result', { exact: true }).count(), 0);
  console.log('GEOCODE_MULTI_REQUIRES_SELECTION', true);
  await desktop.screenshot({ path: 'frontend-audit/after-address-multiple-desktop.png', fullPage: true });
  await desktop.getByRole('button', { name: /QA Choice Two/ }).click();
  await desktop.getByText('Address search result', { exact: true }).waitFor();
  assert.ok(await desktop.getByText('QA Choice Two', { exact: false }).count() >= 1);

  await addressInput.fill('QA No Match');
  await desktop.getByRole('button', { name: 'Search', exact: true }).last().click();
  await desktop.getByText(/No Nigerian match was found/).waitFor();
  assert.equal(await desktop.getByText('Address search result', { exact: true }).count(), 0);
  console.log('GEOCODE_NO_MATCH_VISIBLE', true);
  await desktop.screenshot({ path: 'frontend-audit/after-address-no-match-desktop.png', fullPage: true });
  await desktop.close();

  const mobile = await prepare(browser, 390, 844);
  watch(mobile, 'mobile');
  await mobile.goto('http://localhost:3000/properties?type=sale&propertyType=Detached%20Duplex', { waitUntil: 'domcontentloaded' });
  await waitReady(mobile);
  console.log('MOBILE_URL_FILTER_CARDS', await mobile.locator('article').count());
  await mobile.getByRole('button', { name: /Clear/i }).first().click();
  await mobile.waitForTimeout(300);
  console.log('MOBILE_GRID', await metrics(mobile));
  await mobile.screenshot({ path: 'frontend-audit/after-properties-grid-mobile.png', fullPage: true });
  await mobile.screenshot({ path: 'frontend-audit/after-properties-grid-mobile-viewport.png' });
  await mobile.getByRole('group', { name: 'Results layout' }).getByRole('button', { name: 'Map', exact: true }).click();
  await mobile.locator('.leaflet-container').waitFor({ timeout: 15000 });
  await mobile.waitForTimeout(2000);
  await mobile.screenshot({ path: 'frontend-audit/after-properties-map-mobile.png', fullPage: true });
  await mobile.getByRole('button', { name: 'Back to listings' }).click();
  await mobile.getByRole('button', { name: 'Open navigation menu' }).click();
  await mobile.screenshot({ path: 'frontend-audit/after-mobile-menu.png' });
  console.log('MOBILE_MENU_VISIBLE', await mobile.locator('#mobile-navigation').isVisible());
  await mobile.close();

  const home = await prepare(browser, 390, 844);
  watch(home, 'home-mobile');
  await home.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await waitReady(home);
  console.log('HOME_MOBILE', await metrics(home));
  await home.screenshot({ path: 'frontend-audit/after-home-mobile.png', fullPage: true });
  await home.screenshot({ path: 'frontend-audit/after-home-mobile-viewport.png' });
  await home.close();

  const homeDesktop = await prepare(browser, 1440, 1000);
  watch(homeDesktop, 'home-desktop');
  await homeDesktop.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await waitReady(homeDesktop);
  console.log('HOME_DESKTOP', await metrics(homeDesktop));
  await homeDesktop.screenshot({ path: 'frontend-audit/after-home-desktop.png', fullPage: true });
  await homeDesktop.screenshot({ path: 'frontend-audit/after-home-desktop-viewport.png' });
  await homeDesktop.getByRole('button', { name: 'Switch to dark mode' }).click();
  assert.equal(await homeDesktop.evaluate(() => document.documentElement.classList.contains('dark') && localStorage.getItem('theme') === 'dark'), true);
  await homeDesktop.getByRole('button', { name: 'Switch to light mode' }).click();
  assert.equal(await homeDesktop.evaluate(() => !document.documentElement.classList.contains('dark') && localStorage.getItem('theme') === 'light'), true);
  console.log('THEME_TOGGLE_PERSISTS', true);
  await homeDesktop.getByRole('button', { name: 'Explore', exact: true }).click();
  await homeDesktop.locator('#explore-menu').getByRole('link', { name: /Property insights/ }).waitFor();
  await homeDesktop.keyboard.press('Escape');
  assert.equal(await homeDesktop.locator('#explore-menu').count(), 0);
  console.log('EXPLORE_MENU_AND_ESCAPE', true);
  await homeDesktop.getByRole('button', { name: 'Land', exact: true }).click();
  assert.equal(await homeDesktop.getByLabel('Property type').inputValue(), 'Land');
  await homeDesktop.getByRole('button', { name: 'Buy', exact: true }).click();
  assert.equal(await homeDesktop.getByLabel('Property type').inputValue(), '');
  console.log('HERO_LAND_CATEGORY_SYNC', true);
  await homeDesktop.getByLabel('State / region').selectOption('Lagos');
  await homeDesktop.getByRole('button', { name: 'Search properties' }).click();
  await homeDesktop.waitForURL(/\/properties\?type=sale&state=Lagos/);
  await waitReady(homeDesktop);
  assert.equal(await homeDesktop.locator('article').count(), 2);
  console.log('HOME_SEARCH_CARDS', 2);
  await homeDesktop.close();

  const detail = await prepare(browser, 1440, 1000);
  watch(detail, 'detail');
  await detail.goto('http://localhost:3000/properties/qa-detached-lekki', { waitUntil: 'domcontentloaded' });
  await detail.waitForTimeout(4000);
  await detail.locator('.leaflet-container').waitFor({ timeout: 15000 }).catch(() => undefined);
  await detail.screenshot({ path: 'frontend-audit/after-property-detail-desktop.png', fullPage: true });
  console.log('DETAIL', await metrics(detail));
  let enquiryPayload;
  await detail.route('**/api/enquiries', async (route) => {
    enquiryPayload = route.request().postDataJSON();
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ enquiry: { id: 'qa-enquiry' }, success: true }) });
  });
  await detail.getByRole('button', { name: 'Send Enquiry', exact: true }).click();
  await detail.getByLabel('Your name').fill('QA Buyer');
  await detail.getByLabel('Your email address').fill('buyer@example.com');
  await detail.getByLabel('Your phone number').fill('+2348012345678');
  await detail.getByLabel('Your property enquiry').fill('Please confirm the documentation and available inspection dates.');
  await detail.locator('#property-enquiry-form').getByRole('button', { name: 'Send Enquiry', exact: true }).click();
  await detail.getByText('Enquiry sent successfully!', { exact: true }).waitFor();
  assert.equal(enquiryPayload.buyer_name, 'QA Buyer');
  assert.equal(enquiryPayload.buyer_email, 'buyer@example.com');
  assert.equal(enquiryPayload.buyer_phone, '+2348012345678');
  assert.equal(enquiryPayload.property_id, fixtures[0].id);
  assert.equal(enquiryPayload.name, undefined);
  console.log('PROPERTY_ENQUIRY_PAYLOAD_OK', true);
  await detail.close();

  const tablet = await prepare(browser, 1024, 768);
  watch(tablet, 'tablet');
  await tablet.goto('http://localhost:3000/properties', { waitUntil: 'domcontentloaded' });
  await waitReady(tablet);
  console.log('TABLET', await metrics(tablet));
  await tablet.screenshot({ path: 'frontend-audit/after-properties-tablet-viewport.png' });
  await tablet.close();

  const narrow = await prepare(browser, 320, 700);
  watch(narrow, 'narrow');
  await narrow.goto('http://localhost:3000/properties', { waitUntil: 'domcontentloaded' });
  await waitReady(narrow);
  console.log('NARROW', await metrics(narrow));
  await narrow.screenshot({ path: 'frontend-audit/after-properties-320-viewport.png' });
  await narrow.close();

  console.log('PAGE_ERRORS', JSON.stringify(errors));
  assert.deepEqual(errors, []);
  await browser.close();
})().catch((error) => { console.error(error); process.exit(1); });
