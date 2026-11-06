/* eslint-disable @typescript-eslint/no-require-imports */
// TEST-ONLY authenticated workflow fixtures. No real accounts, passwords,
// listings, messages, notifications or uploads reach an external service.
const assert = require('node:assert/strict');
const { chromium } = require(process.argv[2]);

const base = process.env.QA_BASE_URL || 'http://localhost:3000';
const authBase = process.env.QA_SUPABASE_URL || 'https://placeholder.supabase.co';
const user = {
  id: '00000000-0000-4000-8000-000000000101', aud: 'authenticated', role: 'authenticated', email: 'owner@example.com',
  email_confirmed_at: '2026-01-01T00:00:00Z', app_metadata: { provider: 'email', providers: ['email'] },
  user_metadata: {}, identities: [], created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z',
};
const session = {
  access_token: 'qa-owner-access-token', refresh_token: 'qa-owner-refresh-token', token_type: 'bearer',
  expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, user,
};
const profile = {
  id: user.id, email: user.email, first_name: 'QA', last_name: 'Owner', country: 'Nigeria',
  account_type: 'seller', is_admin: false, is_verified: false,
};
const otherUserId = '00000000-0000-4000-8000-000000000102';
const conversationId = '00000000-0000-4000-8000-000000000201';
const initialMessage = {
  id: '00000000-0000-4000-8000-000000000301', conversation_id: conversationId,
  sender_id: otherUserId, recipient_id: user.id, content: 'Hello QA Owner, your listing is being reviewed.',
  is_read: false, created_at: '2026-11-06T10:00:00Z',
};

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 320, height: 720 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    localStorage.setItem('cookie-consent', 'declined');
    localStorage.setItem('theme', 'light');
  });

  const waitReady = async (milliseconds = 1000) => page.waitForTimeout(milliseconds);
  const layout = async (name) => {
    const dimensions = await page.evaluate(() => ({ viewport: innerWidth, body: document.body.scrollWidth, html: document.documentElement.scrollWidth }));
    assert.ok(dimensions.body <= dimensions.viewport && dimensions.html <= dimensions.viewport, `${name}: ${JSON.stringify(dimensions)}`);
    console.log(`${name}_LAYOUT_OK`, true);
  };

  await page.route(`${authBase}/auth/v1/token**`, async (route) => {
    console.log('ACCOUNT_MOCK_TOKEN', new URL(route.request().url()).search);
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(session) });
  });
  await page.route(`${authBase}/auth/v1/user**`, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(user) });
  });
  await page.route(`${authBase}/auth/v1/logout**`, async (route) => {
    await route.fulfill({ status: 204, body: '' });
  });
  await page.route(`${authBase}/rest/v1/profiles**`, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(profile) });
  });

  let propertyPayload;
  let uploadCount = 0;
  await page.route('**/api/properties', async (route) => {
    if (route.request().method() !== 'POST') return route.continue();
    propertyPayload = route.request().postDataJSON();
    await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ property: { id: '00000000-0000-4000-8000-000000000401' }, success: true }) });
  });
  await page.route('**/api/properties/upload-image', async (route) => {
    uploadCount += 1;
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ image: { id: 'qa-image', url: '/property-placeholder.svg' }, success: true }) });
  });
  await page.route('**/api/geocode?**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, results: [{ id: 'qa-address', name: 'QA confirmed address', displayName: '15 Test Close, Uyo, Akwa Ibom, Nigeria', lat: 5.0378, lng: 7.9085, type: 'house', category: 'place' }] }) });
  });

  let notificationPatch;
  const notifications = [
    { id: '00000000-0000-4000-8000-000000000501', type: 'property_update', title: 'Listing update', message: 'Your listing review status has changed.', is_read: false, created_at: '2026-11-06T10:30:00Z', data: { url: '/properties' } },
    { id: '00000000-0000-4000-8000-000000000502', type: 'system', title: 'Account notice', message: 'Review your account details.', is_read: false, created_at: '2026-11-06T10:45:00Z', data: { url: '//invalid.example' } },
  ];
  await page.route('**/api/saved', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ properties: [{ id: '00000000-0000-4000-8000-000000000401', slug: 'qa-saved-home', title: 'QA Saved Home', area: 'Lekki', state: 'Lagos', price: 85000000, property_images: [] }], success: true }) });
  });
  await page.route('**/api/enquiries', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ enquiries: [], success: true }) });
  });
  await page.route('**/api/viewings', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ viewings: [], success: true }) });
  });
  await page.route('**/api/properties/mine', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ properties: [], success: true }) });
  });
  await page.route('**/api/notifications', async (route) => {
    if (route.request().method() === 'PATCH') {
      notificationPatch = route.request().postDataJSON();
      if (notificationPatch.mark_all) notifications.forEach((notification) => { notification.is_read = true; });
      else notifications.forEach((notification) => { if (notification.id === notificationPatch.notification_id) notification.is_read = true; });
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ notifications, unreadCount: notifications.filter((notification) => !notification.is_read).length, success: true }) });
  });

  // Sign in through the real React form to establish the mocked SSR cookie.
  await page.goto(`${base}/signin?redirect=%2Fsubmit-property`, { waitUntil: 'domcontentloaded' });
  await waitReady();
  await page.getByLabel('Email Address').fill(user.email);
  await page.getByLabel('Password', { exact: true }).fill('OwnerPass1!');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await page.waitForURL('**/submit-property', { timeout: 12000 }).catch(async (error) => {
    console.log('ACCOUNT_LOGIN_FAILURE_URL', page.url());
    console.log('ACCOUNT_LOGIN_FAILURE_TEXT', (await page.locator('main').innerText()).slice(0, 1800));
    throw error;
  });
  await waitReady(1400);
  await layout('SUBMIT_STEP_ONE_320');

  await page.getByLabel('Property Title').fill('QA Residential Land Parcel');
  await page.getByLabel('Description', { exact: true }).fill('A detailed owner listing description used to verify that the complete submission flow includes useful property information for review.');
  await page.getByLabel('Property Type', { exact: true }).selectOption('Land');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByLabel('Street Address').fill('15 Test Close');
  await page.getByLabel('Area', { exact: true }).fill('Shelter Afrique');
  await page.getByLabel('State', { exact: true }).selectOption('Akwa Ibom');
  await page.getByLabel('City', { exact: true }).fill('Uyo');
  await page.getByLabel('LGA', { exact: true }).fill('Uyo');
  await page.getByRole('button', { name: 'Locate address' }).click();
  await page.getByText('Geocoder match:', { exact: false }).waitFor();
  assert.equal(await page.getByLabel('Latitude').inputValue(), '5.0378');
  assert.equal(await page.getByLabel('Longitude').inputValue(), '7.9085');
  await layout('SUBMIT_LOCATION_320');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByLabel('Price in naira').fill('2500000');
  await page.getByLabel('Size in square metres').fill('464');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByLabel('Select property images').setInputFiles({
    name: 'plot.png', mimeType: 'image/png',
    buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9ZrX8AAAAASUVORK5CYII=', 'base64'),
  });
  await page.getByText('1 image(s) selected', { exact: true }).waitFor();
  assert.equal(await page.getByRole('button', { name: 'Remove image 1' }).isVisible(), true);
  await layout('SUBMIT_IMAGE_320');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByText('Map coordinates included: 5.0378, 7.9085.', { exact: false }).waitFor();
  await page.getByRole('button', { name: 'Submit Property', exact: true }).click();
  await page.getByText('Property Submitted!', { exact: true }).waitFor();
  assert.equal(propertyPayload.property_type, 'Land');
  assert.equal(propertyPayload.type, 'sale');
  assert.deepEqual(propertyPayload.coordinates, { lat: 5.0378, lng: 7.9085 });
  assert.equal(propertyPayload.latitude, undefined);
  assert.equal(propertyPayload.longitude, undefined);
  assert.equal(propertyPayload.status, undefined);
  assert.equal(uploadCount, 1);
  console.log('OWNER_SUBMISSION_PAYLOAD_AND_UPLOAD_OK', true);

  await page.waitForURL('**/dashboard', { timeout: 10000 });
  await page.goto(`${base}/dashboard?tab=saved`, { waitUntil: 'domcontentloaded' });
  await waitReady(1200);
  await page.getByRole('heading', { name: 'Saved Properties', exact: true }).waitFor();
  await page.getByText('QA Saved Home', { exact: true }).waitFor();
  console.log('DASHBOARD_SAVED_TAB_RESTORED', true);

  let messagePayload;
  await page.route(`${authBase}/rest/v1/messages**`, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([initialMessage]) });
  });
  await page.route('**/api/messages', async (route) => {
    if (route.request().method() === 'POST') {
      messagePayload = route.request().postDataJSON();
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, message: { ...initialMessage, id: '00000000-0000-4000-8000-000000000302', sender_id: user.id, recipient_id: otherUserId, content: messagePayload.content, is_read: true, created_at: '2026-11-06T11:00:00Z' } }) });
    }
    if (route.request().method() === 'PATCH') return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, conversations: [{ id: conversationId, lastMessage: initialMessage, unreadCount: 1, otherUser: { id: otherUserId, first_name: 'QA', last_name: 'Agent', avatar_url: null } }] }) });
  });
  await page.goto(`${base}/messages`, { waitUntil: 'domcontentloaded' });
  await waitReady(1200);
  await page.getByRole('button', { name: /QA Agent/ }).click();
  await page.getByLabel('Message', { exact: true }).fill('Thank you. Please let me know if you need more documents.');
  await page.getByRole('button', { name: 'Send message', exact: true }).click();
  await page.getByText('Thank you. Please let me know if you need more documents.', { exact: true }).waitFor();
  assert.equal(messagePayload.conversation_id, conversationId);
  assert.equal(messagePayload.recipient_id, otherUserId);
  await layout('MESSAGES_320');
  console.log('MESSAGE_SEND_PAYLOAD_OK', true);

  await page.goto(`${base}/notifications`, { waitUntil: 'domcontentloaded' });
  await waitReady(1000);
  await page.getByRole('heading', { name: 'Notifications', exact: true }).waitFor();
  assert.equal(await page.getByRole('link', { name: 'View →', exact: true }).count(), 1);
  const listingNotification = page.getByRole('article').filter({ hasText: 'Listing update' });
  await listingNotification.getByRole('button', { name: 'Mark read', exact: true }).click();
  await listingNotification.getByText('read', { exact: true }).waitFor();
  assert.equal(notificationPatch.notification_id, notifications[0].id);
  const markAllResponse = page.waitForResponse((response) => response.url().endsWith('/api/notifications') && response.request().method() === 'PATCH');
  await page.getByRole('button', { name: 'Mark all read', exact: true }).click();
  await markAllResponse;
  assert.equal(notificationPatch.mark_all, true);
  assert.equal(notifications.every((notification) => notification.is_read), true);
  console.log('NOTIFICATION_READ_AND_SAFE_LINK_OK', true);

  await page.goto(`${base}/admin/dashboard`, { waitUntil: 'domcontentloaded' });
  await page.waitForURL('**/dashboard', { timeout: 15000 });
  assert.equal(new URL(page.url()).pathname, '/dashboard');
  console.log('NON_ADMIN_REDIRECTED_FROM_ADMIN', true);

  await waitReady(1000);
  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  await page.locator('#mobile-navigation').getByRole('button', { name: 'Sign out', exact: true }).click();
  await page.waitForURL(/\/signin\?redirect=/, { timeout: 15000 });
  await page.getByRole('heading', { name: 'Welcome back', exact: true }).waitFor();
  console.log('LOGOUT_AND_PROTECTED_RETURN_OK', true);

  assert.deepEqual(errors, []);
  console.log('ACCOUNT_BROWSER_QA_PASS PAGE_ERRORS []');
  await browser.close();
})().catch((error) => { console.error(error); process.exit(1); });
