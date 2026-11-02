import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8');
function setup() {
  const handlers = {};
  const calls = { fetch: [], writes: [], deleted: [] };
  const cache = {
    match: async () => undefined,
    put: async (...args) => calls.writes.push(args),
  };
  vm.runInNewContext(source, {
    URL, console: { log() {} },
    self: { location: { origin: 'https://example.com' },
      addEventListener: (name, fn) => { handlers[name] = fn; },
      clients: { claim: async () => {} } },
    caches: {
      open: async () => cache,
      match: async () => 'offline page',
      keys: async () => ['marketplace-v3-brand', 'marketplace-v4-public-only'],
      delete: async key => calls.deleted.push(key),
    },
    fetch: async (request, options) => {
      calls.fetch.push({ request, options });
      return new Response('current user', { status: 200 });
    },
  });
  return { handlers, calls };
}

 test('API requests for different accounts always use the network without caching', async () => {
  const { handlers, calls } = setup();
  for (const token of ['account-a', 'account-b']) {
    let response;
    handlers.fetch({ request: new Request('https://example.com/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    }), respondWith(promise) { response = promise; } });
    assert.equal(await (await response).text(), 'current user');
  }
  assert.equal(calls.fetch.length, 2);
  assert.ok(calls.fetch.every(call => call.options.cache === 'no-store'));
  assert.equal(calls.writes.length, 0);
});

test('authenticated asset requests also bypass caching', async () => {
  const { handlers, calls } = setup();
  let response;
  handlers.fetch({ request: new Request('https://example.com/icons/private.png', {
    headers: { Authorization: 'Bearer account-a' },
  }), respondWith(promise) { response = promise; } });
  await response;
  assert.equal(calls.fetch[0].options.cache, 'no-store');
  assert.equal(calls.writes.length, 0);
});

test('public icons can still be cached', async () => {
  const { handlers, calls } = setup();
  let response;
  handlers.fetch({ request: new Request('https://example.com/icons/icon-192x192.png'),
    respondWith(promise) { response = promise; } });
  await response;
  assert.equal(calls.writes.length, 1);
});

test('activation removes the old cache containing private responses', async () => {
  const { handlers, calls } = setup();
  let completion;
  handlers.activate({ waitUntil(promise) { completion = promise; } });
  await completion;
  assert.deepEqual(calls.deleted, ['marketplace-v3-brand']);
});

test('API responses have server-side no-store headers', async () => {
  const { default: config } = await import('../next.config.js');
  const rules = await config.headers();
  assert.ok(rules.find(rule => rule.source === '/api/:path*').headers.some(
    header => header.key === 'Cache-Control' && header.value.includes('no-store')));
});
