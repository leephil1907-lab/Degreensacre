/* eslint-disable @typescript-eslint/no-require-imports */
// Local production-core HTTP smoke test. No credentials or production data.
const assert = require('node:assert/strict');

const base = process.env.QA_BASE_URL || 'http://localhost:3000';
const publicRoutes = [
  '/', '/properties', '/land', '/developments', '/agencies', '/agents',
  '/insights', '/locations', '/location/lagos', '/location/abuja',
  '/location/akwa-ibom', '/location/enugu', '/location/port-harcourt',
  '/diaspora', '/about', '/contact', '/book-inspection', '/signin',
  '/signup', '/forgot-password', '/auth/reset-password', '/privacy', '/terms',
  '/sitemap', '/sitemap.xml', '/robots.txt', '/manifest.json', '/offline.html',
  '/sw.js', '/api/health',
];
const redirects = [
  ['/home', '/'],
  ['/auth/login', '/signin'],
  ['/auth/register', '/signup'],
  ['/auth/forgot-password', '/forgot-password'],
];
const protectedRoutes = [
  '/dashboard?tab=saved', '/submit-property', '/messages', '/notifications', '/admin',
];

async function request(path, options) {
  return fetch(new URL(path, base), {
    redirect: 'manual',
    signal: AbortSignal.timeout(25000),
    ...options,
  });
}

async function checkPublic(path) {
  const response = await request(path);
  const result = `${path} -> ${response.status}`;
  assert.equal(response.status, 200, result);
  return result;
}

async function checkRedirect([path, destination]) {
  const response = await request(path);
  const location = new URL(response.headers.get('location'), base);
  const result = `${path} -> ${response.status} ${location.pathname}`;
  assert.ok([301, 308].includes(response.status), result);
  assert.equal(location.pathname, destination, result);
  return result;
}

async function checkProtected(path) {
  const response = await request(path);
  const location = new URL(response.headers.get('location'), base);
  const result = `${path} -> ${response.status} ${location.pathname}`;
  assert.equal(response.status, 307, result);
  assert.equal(location.pathname, '/signin', result);
  assert.equal(location.searchParams.get('redirect'), path, result);
  return result;
}

async function checkApi(path, expected, options) {
  const response = await request(path, options);
  const result = `${options?.method || 'GET'} ${path} -> ${response.status}`;
  assert.equal(response.status, expected, result);
  return result;
}

(async () => {
  const jobs = [
    ...publicRoutes.map((path) => () => checkPublic(path)),
    ...redirects.map((item) => () => checkRedirect(item)),
    ...protectedRoutes.map((path) => () => checkProtected(path)),
    () => checkApi('/store', 404),
    () => checkApi('/api/profile', 401),
    () => checkApi('/api/messages', 401),
    () => checkApi('/api/admin/content/articles', 401),
    () => checkApi('/api/auth/register', 400, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'bad' }) }),
    () => checkApi('/api/auth/reset-password', 400, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'bad' }) }),
    () => checkApi('/api/geocode?q=x', 400),
  ];

  const results = [];
  let index = 0;
  async function worker() {
    while (index < jobs.length) {
      const job = jobs[index++];
      results.push(await job());
    }
  }
  await Promise.all(Array.from({ length: 6 }, worker));
  results.sort().forEach((result) => console.log(result));
  console.log(`ROUTE_SMOKE_PASS ${results.length}`);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
