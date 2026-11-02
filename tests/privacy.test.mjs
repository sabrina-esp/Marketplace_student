import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import jwt from 'jsonwebtoken';
import User from '../lib/models/User.js';
import { verifyAccessToken } from '../lib/auth/access-token.js';

const id = '507f1f77bcf86cd799439011';
function route(path, dependencies = {}) {
  const source = ts.transpileModule(readFileSync(new URL('../' + path, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const exports = {};
  vm.runInNewContext(source, { exports, console,
    require(name) {
      if (name === 'next/server') return { NextResponse: { json: (body, options) => ({ body, status: options?.status || 200 }) } };
      if (name === '@/lib/auth/access-token') return { verifyAccessToken: () => ({ userId: id }) };
      if (name === '@/lib/db/mongodb') return { default: async () => {}, connectDB: async () => {} };
      return { default: dependencies[name] };
    },
  });
  return exports;
}
const request = body => ({ headers: new Headers({ authorization: 'Bearer test' }), json: async () => body });

test('JWT verification rejects predictable fallback tokens and missing configuration', () => {
  const original = process.env.JWT_SECRET;
  try {
    const token = jwt.sign({ userId: id }, 'your-secret-key');
    delete process.env.JWT_SECRET;
    assert.throws(() => verifyAccessToken(token), /JWT_SECRET/);
    process.env.JWT_SECRET = 'a'.repeat(64);
    assert.throws(() => verifyAccessToken(token));
    assert.equal(verifyAccessToken(jwt.sign({ userId: id }, process.env.JWT_SECRET)).userId, id);
    assert.throws(() => verifyAccessToken(jwt.sign({ userId: 'invalid' }, process.env.JWT_SECRET)));
  } finally {
    if (original === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = original;
  }
});

test('settings changes mark the real Mongoose field for persistence', async () => {
  const user = new User({ email: 'test@example.com', password: 'test123' });
  user.$isNew = false; user.$__reset();
  let saved = false;
  user.save = async () => { saved = user.isModified('settings'); };
  const { PUT } = route('app/api/settings/update/route.ts', { '@/lib/models/User': { findById: async () => user } });
  assert.equal((await PUT(request({ emailNotifications: true }))).status, 200);
  assert.equal(saved, true);
  assert.equal(user.settings.emailNotifications, true);
  assert.equal((await PUT(request({ unknown: true }))).status, 400);
  assert.equal((await PUT(request({ emailNotifications: 'false' }))).status, 400);
});

test('visibility changes persist and reject non-booleans', async () => {
  const user = new User({ email: 'test@example.com', password: 'test123' });
  user.$isNew = false; user.$__reset();
  let saved = false;
  user.save = async () => { saved = user.isModified('privacySettings'); };
  const { PUT } = route('app/api/privacy/update-visibility/route.ts', { '@/lib/models/User': { findById: async () => user } });
  assert.equal((await PUT(request({ profileVisibility: false }))).status, 200);
  assert.equal(saved, true);
  assert.equal(user.privacySettings.profileVisibility, false);
  assert.equal((await PUT(request({ profileVisibility: 'false' }))).status, 400);
});

test('account deletion cleans relationships before deleting the user', async () => {
  const calls = [];
  const { DELETE } = route('app/api/profile/delete-account/route.ts', {
    '@/lib/models/User': {
      findByIdAndUpdate: async () => { calls.push('hide'); return {}; },
      findByIdAndDelete: async () => calls.push('delete user'),
    },
    '@/lib/models/Match': { deleteMany: async query => { assert.equal(query.users, id); calls.push('matches'); } },
    '@/lib/models/Like': { deleteMany: async query => { assert.equal(query.$or[0].from, id); assert.equal(query.$or[1].to, id); calls.push('likes'); } },
  });
  assert.equal((await DELETE(request())).status, 200);
  assert.deepEqual(calls, ['hide', 'matches', 'likes', 'delete user']);
});

test('cleanup failure does not delete the account and permits a retry', async () => {
  let deleted = false;
  const { DELETE } = route('app/api/profile/delete-account/route.ts', {
    '@/lib/models/User': { findByIdAndUpdate: async () => ({}), findByIdAndDelete: async () => { deleted = true; } },
    '@/lib/models/Match': { deleteMany: async () => { throw new Error('DB unavailable'); } },
  });
  assert.equal((await DELETE(request())).status, 500);
  assert.equal(deleted, false);
});

test('match lists tolerate deleted users and omit hidden profiles', async () => {
  const other = { _id: '507f1f77bcf86cd799439012', name: 'Visible' };
  const matches = [ { users: [{ _id: id }], _id: id },
    { users: [{ _id: id }, { ...other, privacySettings: { profileVisibility: false } }], _id: id },
    { users: [{ _id: id }, other], _id: id } ];
  const { GET } = route('app/api/match/list/route.js', { '@/lib/models/Match': {
    find: () => ({ populate: () => ({ sort: async () => matches }) }),
  } });
  const response = await GET(request());
  assert.equal(response.status, 200);
  assert.equal(response.body.matches.length, 1);
});

test('discovery filters hidden and unverified users and excludes email', async () => {
  let query;
  let selection;
  const { GET } = route('app/api/match/potentials/route.js', {
    '@/lib/models/User': {
      findById: () => ({ select: async () => ({}) }),
      find: input => { query = input; return { select: fields => { selection = fields; return { limit: async () => [] }; } }; },
    },
    '@/lib/models/Like': { find: () => ({ select: async () => [] }) },
    '@/lib/services/MatchingService': { sortByCompatibility: () => [] },
  });
  assert.equal((await GET(request())).status, 200);
  assert.equal(query['privacySettings.profileVisibility'].$ne, false);
  assert.equal(query.isEmailVerified, true);
  assert.equal(selection.includes('email'), false);
});

test('direct swipes on unavailable profiles are rejected before writing likes', async () => {
  const { POST } = route('app/api/match/swipe/route.js', {
    '@/lib/models/User': { exists: async query => query._id === id ? {} : null },
  });
  assert.equal((await POST(request({ targetUserId: '507f1f77bcf86cd799439012', action: 'like' }))).status, 404);
});
