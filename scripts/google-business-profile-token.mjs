#!/usr/bin/env node
/**
 * One-time sign-in that lets the `googleReviews` function read every Google review through the
 * Business Profile API. Sign in with a Google account that is an owner or manager of the
 * centre's Business Profile; the refresh token goes straight into a Firebase secret.
 *
 * Usage:
 *   node scripts/google-business-profile-token.mjs --client ~/Downloads/client_secret_XXX.json
 *   node scripts/google-business-profile-token.mjs --client <file> --no-secret   (check only)
 *
 * The client file is an OAuth client of type "Desktop app" from Google Cloud console
 * (project nagina-social-welfare-uk). See docs/google-reviews-setup.md.
 */
import { execFileSync } from 'node:child_process';
import { createHash, randomBytes } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const PROJECT = 'nagina-social-welfare-uk';
const SECRET = 'GOOGLE_BUSINESS_PROFILE_OAUTH';
const SCOPE = 'https://www.googleapis.com/auth/business.manage';

const args = process.argv.slice(2);
const clientIdx = args.indexOf('--client');
const writeSecret = !args.includes('--no-secret');
if (clientIdx < 0 || !args[clientIdx + 1]) {
  console.error('Pass the downloaded OAuth client JSON: --client ~/Downloads/client_secret_XXX.json');
  process.exit(1);
}

const file = JSON.parse(readFileSync(args[clientIdx + 1].replace(/^~/, process.env.HOME ?? '~'), 'utf8'));
const client = file.installed ?? file.web;
if (!client?.client_id || !client?.client_secret) {
  console.error('That file is not an OAuth client JSON (expected an "installed" Desktop app client).');
  process.exit(1);
}

const verifier = randomBytes(32).toString('base64url');
const challenge = createHash('sha256').update(verifier).digest('base64url');
const state = randomBytes(16).toString('hex');

const code = await new Promise((resolve, reject) => {
  const server = createServer((req, res) => {
    const url = new URL(req.url ?? '/', 'http://127.0.0.1');
    if (url.pathname !== '/') return void res.writeHead(404).end();
    const ok = url.searchParams.get('state') === state && url.searchParams.get('code');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(ok ? '<p>Signed in. You can close this tab and return to the terminal.</p>' : '<p>Sign-in failed.</p>');
    server.close();
    server.closeAllConnections();
    ok ? resolve({ code: url.searchParams.get('code'), redirect: redirectUri }) : reject(new Error(url.searchParams.get('error') ?? 'bad state'));
  });
  let redirectUri = '';
  server.listen(0, '127.0.0.1', () => {
    redirectUri = `http://127.0.0.1:${server.address().port}`;
    const auth = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    auth.search = new URLSearchParams({
      client_id: client.client_id,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: SCOPE,
      access_type: 'offline',
      prompt: 'consent',
      code_challenge: challenge,
      code_challenge_method: 'S256',
      state,
    }).toString();
    console.log('\nOpening Google sign-in. Use an owner or manager of the centre Business Profile.\n');
    console.log(`If the browser does not open, visit:\n${auth}\n`);
    try {
      execFileSync('open', [auth.toString()]);
    } catch {
      /* not macOS; the link above works */
    }
  });
});

const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code: code.code,
    redirect_uri: code.redirect,
    client_id: client.client_id,
    client_secret: client.client_secret,
    code_verifier: verifier,
  }),
});
const token = await tokenRes.json();
if (!tokenRes.ok || !token.refresh_token) {
  console.error('Token exchange failed:', token.error_description ?? token.error ?? tokenRes.status);
  process.exit(1);
}

// Show which profiles this login manages so a wrong account is obvious before saving anything.
const headers = { Authorization: `Bearer ${token.access_token}` };
const accountsRes = await fetch('https://mybusinessaccountmanagement.googleapis.com/v1/accounts', { headers });
if (!accountsRes.ok) {
  console.error(`Listing Business Profile accounts failed (HTTP ${accountsRes.status}).`);
  console.error('Check the My Business Account Management API is enabled in the project.');
  process.exit(1);
}
const accounts = (await accountsRes.json()).accounts ?? [];
let found = 0;
for (const account of accounts) {
  const locRes = await fetch(
    `https://mybusinessbusinessinformation.googleapis.com/v1/${account.name}/locations?readMask=name,title,metadata&pageSize=100`,
    { headers },
  );
  const locations = locRes.ok ? (await locRes.json()).locations ?? [] : [];
  for (const loc of locations) {
    found++;
    console.log(`  ${loc.title}  (${account.name}/${loc.name})  ${loc.metadata?.mapsUri ?? ''}`);
  }
  if (!locRes.ok) console.error(`  ${account.name}: locations HTTP ${locRes.status} (is the Business Information API enabled?)`);
}
if (!found) {
  console.error('\nThis Google account does not manage any Business Profile. Sign in with the centre profile owner.');
  process.exit(1);
}

if (!writeSecret) {
  console.log('\nSign-in works (--no-secret: nothing saved).');
  process.exit(0);
}

const dir = mkdtempSync(join(tmpdir(), 'gbp-'));
const path = join(dir, 'oauth.json');
try {
  writeFileSync(
    path,
    JSON.stringify({ clientId: client.client_id, clientSecret: client.client_secret, refreshToken: token.refresh_token }),
    { mode: 0o600 },
  );
  execFileSync('firebase', ['functions:secrets:set', SECRET, '--data-file', path, '--project', PROJECT], {
    stdio: 'inherit',
  });
  console.log(`\nSaved ${SECRET}. Redeploy the function so it picks up the new version:`);
  console.log('  firebase deploy --only functions:donations:googleReviews');
} finally {
  rmSync(dir, { recursive: true, force: true });
}
