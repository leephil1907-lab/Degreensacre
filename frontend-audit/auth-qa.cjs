/* eslint-disable @typescript-eslint/no-require-imports */
// TEST-ONLY auth fixtures. No real accounts, passwords or production services.
const assert = require('node:assert/strict');
const { chromium } = require(process.argv[2]);

const base = 'http://localhost:3000';
const authBase = 'https://placeholder.supabase.co';
const user = {
  id: 'qa-auth-user', aud: 'authenticated', role: 'authenticated', email: 'qa@example.com',
  email_confirmed_at: '2026-01-01T00:00:00Z',
  app_metadata: { provider: 'email', providers: ['email'] }, user_metadata: {}, identities: [],
  created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z',
};
const session = {
  access_token: 'qa-access-token', refresh_token: 'qa-refresh-token', token_type: 'bearer',
  expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, user,
};
const profile = {
  id: user.id, email: user.email, first_name: 'QA', last_name: 'User', country: 'Nigeria',
  account_type: 'buyer', is_admin: false, is_verified: false,
};

(async () => {
  const browser = await chromium.launch({ headless: true });
  const errors = [];

  async function prepare(width = 390, height = 844) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.addInitScript(() => {
      localStorage.setItem('cookie-consent', 'declined');
      localStorage.setItem('theme', 'light');
    });
    page.on('pageerror', (error) => errors.push(error.message));
    return page;
  }

  async function mockProfile(page) {
    await page.route(`${authBase}/rest/v1/profiles**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(profile) });
    });
  }

  async function layout(page, name) {
    await page.waitForTimeout(700);
    const result = await page.evaluate(() => ({
      viewport: innerWidth,
      body: document.body.scrollWidth,
      html: document.documentElement.scrollWidth,
    }));
    assert.ok(result.body <= result.viewport && result.html <= result.viewport, `${name} overflow: ${JSON.stringify(result)}`);
    console.log(`${name}_LAYOUT_OK`, true);
  }

  // Complete signup, client validation and email-confirmation branch.
  const signup = await prepare();
  let registrationPayload;
  await signup.route('**/api/auth/register', async (route) => {
    registrationPayload = route.request().postDataJSON();
    await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ success: true, user: { id: user.id, email: user.email }, requires_email_confirmation: true }) });
  });
  await signup.goto(`${base}/signup`, { waitUntil: 'domcontentloaded' });
  await layout(signup, 'SIGNUP_MOBILE');
  await signup.getByLabel('First Name').fill('QA');
  await signup.getByLabel('Last Name').fill('User');
  await signup.getByLabel('Email Address').fill(user.email);
  await signup.getByLabel(/Phone/).fill('+2348012345678');
  await signup.getByLabel(/State/).selectOption('FCT');
  await signup.getByRole('button', { name: 'Continue', exact: true }).click();
  await signup.getByLabel('Password', { exact: true }).fill('StrongPass1!');
  await signup.getByLabel('Confirm Password').fill('DifferentPass1!');
  await signup.getByRole('button', { name: 'Continue', exact: true }).click();
  await signup.getByText('Passwords do not match').waitFor();
  await signup.getByLabel('Confirm Password').fill('StrongPass1!');
  await signup.getByRole('button', { name: 'Show password' }).click();
  assert.equal(await signup.getByLabel('Password', { exact: true }).getAttribute('type'), 'text');
  await signup.getByRole('button', { name: 'Hide password' }).click();
  await signup.getByRole('button', { name: 'Continue', exact: true }).click();
  const ownerType = signup.getByRole('button', { name: /Property Owner/ });
  await ownerType.click();
  assert.equal(await ownerType.getAttribute('aria-pressed'), 'true');
  await signup.getByRole('button', { name: 'Create Account', exact: true }).click();
  await signup.getByText('Please agree to the terms and conditions').waitFor();
  await signup.getByRole('checkbox').check();
  await signup.getByRole('button', { name: 'Create Account', exact: true }).click();
  await signup.waitForURL('**/signin?verified=pending');
  await signup.getByText(/Check your inbox to confirm your email/).waitFor();
  assert.equal(registrationPayload.account_type, 'seller');
  assert.equal(registrationPayload.state, 'FCT');
  assert.equal(registrationPayload.is_admin, undefined);
  console.log('SIGNUP_CONFIRMATION_FLOW_OK', true);
  await signup.close();

  // Invalid login feedback, then a successful safe redirect to a public page.
  const signin = await prepare();
  let loginSucceeds = false;
  await mockProfile(signin);
  await signin.route(`${authBase}/auth/v1/token**`, async (route) => {
    console.log('MOCK_LOGIN_RESPONSE', loginSucceeds ? 'success' : 'invalid');
    if (!loginSucceeds) {
      await route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({ error: 'invalid_grant', error_description: 'Invalid login credentials' }) });
    } else {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(session) });
    }
  });
  await signin.goto(`${base}/signin`, { waitUntil: 'domcontentloaded' });
  await signin.waitForTimeout(1000);
  assert.equal(await signin.getByText('Remember me', { exact: true }).count(), 0);
  await signin.getByLabel('Email Address').fill(user.email);
  await signin.getByLabel('Password', { exact: true }).fill('WrongPass1!');
  await signin.getByRole('button', { name: 'Show password' }).click();
  assert.equal(await signin.getByLabel('Password', { exact: true }).getAttribute('type'), 'text');
  await signin.getByRole('button', { name: 'Sign In', exact: true }).click();
  await signin.getByText(/Invalid login credentials/).waitFor();
  console.log('SIGNIN_ERROR_FEEDBACK_OK', true);

  loginSucceeds = true;
  await signin.goto(`${base}/signin?redirect=%2Fproperties%3Ftype%3Dsale`, { waitUntil: 'domcontentloaded' });
  await signin.waitForTimeout(1000);
  await signin.getByLabel('Email Address').fill(user.email);
  await signin.getByLabel('Password', { exact: true }).fill('StrongPass1!');
  await signin.getByRole('button', { name: 'Sign In', exact: true }).click();
  await signin.waitForURL('**/properties?type=sale', { timeout: 12000 }).catch(async (error) => {
    console.log('SIGNIN_FAILURE_URL', signin.url());
    console.log('SIGNIN_FAILURE_TEXT', (await signin.locator('main').innerText()).slice(0, 1800));
    throw error;
  });
  console.log('SIGNIN_SAFE_REDIRECT_OK', true);
  await signin.setViewportSize({ width: 1440, height: 1000 });
  await signin.goto(`${base}/signin?verified=confirmed`, { waitUntil: 'domcontentloaded' });
  await signin.getByText(/Your email is confirmed/).waitFor();
  await layout(signin, 'SIGNIN_DESKTOP');
  await signin.screenshot({ path: 'frontend-audit/auth-signin-desktop.png', fullPage: true });
  await signin.close();

  // Recovery request and resend through the application API.
  const forgot = await prepare();
  let resetRequests = 0;
  await forgot.route('**/api/auth/reset-password', async (route) => {
    resetRequests += 1;
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
  });
  await forgot.goto(`${base}/forgot-password`, { waitUntil: 'domcontentloaded' });
  await forgot.waitForTimeout(1000);
  await forgot.getByLabel('Email Address').fill(user.email);
  await forgot.getByRole('button', { name: 'Send Reset Instructions' }).click();
  await forgot.getByText('Check Your Email', { exact: true }).waitFor();
  await forgot.getByRole('button', { name: 'Resend Email' }).click();
  await forgot.waitForFunction(() => document.querySelector('button[disabled]') === null);
  assert.equal(resetRequests, 2);
  await layout(forgot, 'RECOVERY_MOBILE');
  console.log('RECOVERY_REQUEST_AND_RESEND_OK', true);
  await forgot.close();

  // Missing/invalid recovery sessions cannot submit a new password.
  const invalidReset = await prepare();
  await invalidReset.goto(`${base}/auth/reset-password`, { waitUntil: 'domcontentloaded' });
  await invalidReset.getByText(/This reset link is invalid, expired or already used/).waitFor();
  assert.equal(await invalidReset.getByRole('button', { name: /Update Password/ }).isDisabled(), true);
  await invalidReset.getByRole('link', { name: 'Request a new reset link' }).waitFor();
  console.log('INVALID_RECOVERY_LINK_BLOCKED', true);
  await invalidReset.close();

  // Token-hash recovery, update and local-session cleanup.
  const reset = await prepare();
  await mockProfile(reset);
  await reset.route(`${authBase}/auth/v1/verify**`, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(session) });
  });
  await reset.route(`${authBase}/auth/v1/user**`, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(user) });
  });
  await reset.route(`${authBase}/auth/v1/logout**`, async (route) => {
    await route.fulfill({ status: 204, body: '' });
  });
  await reset.goto(`${base}/auth/reset-password?token_hash=qa-recovery-token&type=recovery`, { waitUntil: 'domcontentloaded' });
  await reset.waitForFunction(() => {
    const button = document.querySelector('button[type="submit"]');
    return button && !button.disabled;
  });
  await reset.getByLabel('New Password').fill('NewStrongPass1!');
  await reset.getByLabel('Confirm Password').fill('NewStrongPass1!');
  await reset.getByRole('button', { name: 'Update Password' }).click();
  await reset.getByText('Password Updated!', { exact: true }).waitFor();
  console.log('TOKEN_HASH_PASSWORD_RESET_OK', true);
  await reset.close();

  assert.deepEqual(errors, []);
  console.log('AUTH_BROWSER_QA_PASS PAGE_ERRORS []');
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
