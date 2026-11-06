/* eslint-disable @typescript-eslint/no-require-imports */
// LOCAL TEST FIXTURE ONLY. This is not part of the Next.js application and
// must never be deployed or pointed at a real Supabase project. It validates
// one synthetic account in memory so protected server routes can be exercised.
const http = require('node:http');

const host = '127.0.0.1';
const port = Number(process.env.MOCK_AUTH_PORT || 4444);
const accessToken = 'qa-owner-access-token';
const refreshToken = 'qa-owner-refresh-token';
const user = {
  id: '00000000-0000-4000-8000-000000000101',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'owner@example.com',
  email_confirmed_at: '2026-01-01T00:00:00Z',
  app_metadata: { provider: 'email', providers: ['email'] },
  user_metadata: {},
  identities: [],
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};
const profile = {
  id: user.id,
  email: user.email,
  first_name: 'QA',
  last_name: 'Owner',
  country: 'Nigeria',
  account_type: 'seller',
  is_admin: false,
  is_verified: false,
};

function session() {
  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    user,
  };
}

function send(response, status, body) {
  response.writeHead(status, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info, x-supabase-api-version, prefer',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json',
  });
  response.end(body === undefined ? '' : JSON.stringify(body));
}

async function jsonBody(request) {
  let text = '';
  for await (const chunk of request) text += chunk;
  if (!text) return {};
  return JSON.parse(text);
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url || '/', `http://${host}:${port}`);
  console.log('MOCK_AUTH_REQUEST', request.method, url.pathname);

  if (request.method === 'OPTIONS') return send(response, 204);
  if (url.pathname === '/auth/v1/token' && request.method === 'POST') {
    const body = await jsonBody(request);
    const grantType = url.searchParams.get('grant_type');
    if (grantType === 'refresh_token' && body.refresh_token === refreshToken) return send(response, 200, session());
    if (grantType === 'password' && body.email === user.email && body.password === 'OwnerPass1!') return send(response, 200, session());
    return send(response, 400, { error: 'invalid_grant', error_description: 'Invalid test credentials.' });
  }
  if (url.pathname === '/auth/v1/user' && request.method === 'GET') {
    if (request.headers.authorization !== `Bearer ${accessToken}`) {
      return send(response, 401, { error: 'invalid_token', error_description: 'Invalid test token.' });
    }
    return send(response, 200, user);
  }
  if (url.pathname === '/auth/v1/logout' && request.method === 'POST') return send(response, 204);
  if (url.pathname === '/rest/v1/profiles' && request.method === 'GET') {
    const singular = String(request.headers.accept || '').includes('application/vnd.pgrst.object+json');
    return send(response, 200, singular ? profile : [profile]);
  }

  return send(response, 404, { error: 'not_implemented', error_description: 'This local auth fixture does not provide database tables.' });
});

server.listen(port, host, () => console.log(`LOCAL_AUTH_FIXTURE_READY http://${host}:${port}`));
for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
