import test from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../lib/models/User.js';
import { createAuthService } from '../lib/auth/service.mjs';

function fixture() {
  let time = Date.now();
  const users = [];
  const emails = [];
  let failMail = false;
  const matches = (user, query) => Object.entries(query).every(([key, value]) => {
    if (key === '$or') return value.some((condition) => matches(user, condition));
    if (value && typeof value === 'object' && !(value instanceof Date)) {
      if ('$ne' in value) return user[key] !== value.$ne;
      if ('$gt' in value) return user[key] != null && user[key] > value.$gt;
      if ('$lte' in value) return user[key] != null && user[key] <= value.$lte;
    }
    return value === null ? user[key] == null : user[key] === value;
  });
  const User = {
    async findOne(query) { return users.find((user) => matches(user, query)) || null; },
    async create(input) {
      // Assert the service passes plain text to the real model's sole hashing hook.
      assert.ok(!input.password.startsWith('$2'));
      const user = { ...input, _id: String(users.length + 1),
        password: await bcrypt.hash(input.password, 4),
        async comparePassword(candidate) { return bcrypt.compare(candidate, this.password); },
        async save() { return this; },
        async createResetPasswordToken(token, expiry) {
          this.resetPasswordToken = token; this.resetPasswordExpiry = expiry;
        },
        async resetPassword(password) { this.password = await bcrypt.hash(password, 4); },
      };
      users.push(user);
      return user;
    },
    async findOneAndUpdate(query, update) {
      const user = await this.findOne(query);
      if (user) Object.assign(user, update.$set);
      return user;
    },
  };
  const mail = async (...args) => {
    if (failMail) throw new Error('SMTP unavailable');
    emails.push(args);
  };
  const service = createAuthService({ User, connectDB: async () => {},
    sendVerificationEmail: mail, sendPasswordResetEmail: mail, jwt,
    getSecret: () => 'test-only-secret', now: () => time });
  return { service, users, emails, advance: (ms) => { time += ms; }, failMail: () => { failMail = true; } };
}
const credentials = { email: ' Student@Example.com ', password: 'correct-password', name: 'Student' };

test('registration → verification → login, with normalized email and no leaked secrets', async () => {
  const { service, users, emails } = fixture();
  const registration = await service.register(credentials);
  assert.equal(registration.user.email, 'student@example.com');
  assert.equal(registration.user.password, undefined);
  assert.equal(registration.user.verificationToken, undefined);
  assert.equal(registration.requiresVerification, true);
  await assert.rejects(service.signIn(credentials), (error) => error.status === 403);
  await service.verifyEmail({ token: emails[0][1] });
  assert.equal(users[0].isEmailVerified, true);
  assert.equal(users[0].isVerified, true);
  const login = await service.signIn(credentials);
  assert.equal(jwt.verify(login.token, 'test-only-secret').userId, '1');
  await assert.rejects(service.verifyEmail({ token: emails[0][1] }), /invalide/);
});

test('rejects malformed input, duplicate accounts, and incorrect passwords', async () => {
  const { service } = fixture();
  await assert.rejects(service.register({ email: {}, password: 'password' }), /email/);
  await assert.rejects(service.register({ ...credentials, password: 'short' }), /passe/);
  await assert.rejects(service.register({ ...credentials, password: 'é'.repeat(40) }), /72/);
  await service.register(credentials);
  await assert.rejects(service.register(credentials), (error) => error.status === 409);
  await assert.rejects(service.signIn({ ...credentials, password: 'wrong' }), (error) => error.status === 401);
});

test('expired verification is rejected and resend rotates tokens with a cooldown', async () => {
  const { service, emails, advance } = fixture();
  await service.register(credentials);
  const original = emails[0][1];
  await service.resendVerificationEmail({ email: credentials.email });
  assert.equal(emails.length, 1);
  advance(60001);
  await service.resendVerificationEmail({ email: credentials.email });
  assert.equal(emails.length, 2);
  assert.notEqual(emails[1][1], original);
  await assert.rejects(service.verifyEmail({ token: original }), /invalide/);
  advance(86400001);
  await assert.rejects(service.verifyEmail({ token: emails[1][1] }), /expiré/);
});

test('failed email delivery preserves the account and reports a recoverable state', async () => {
  const f = fixture();
  f.failMail();
  const result = await f.service.register(credentials);
  assert.equal(result.success, true);
  assert.equal(result.emailSent, false);
  assert.equal(f.users.length, 1);
  f.advance(60001);
  await assert.rejects(f.service.resendVerificationEmail({ email: credentials.email }), (error) => error.status === 503);
});

test('password reset rejects expired tokens and changes the password only once', async () => {
  const { service, users, emails, advance } = fixture();
  await service.register(credentials);
  await service.verifyEmail({ token: emails[0][1] });
  await service.forgotPassword({ email: credentials.email });
  const expired = emails[1][1];
  advance(3600001);
  await assert.rejects(service.resetPassword({ token: expired, password: 'new-password' }), /expiré/);
  await service.forgotPassword({ email: credentials.email });
  const token = emails[2][1];
  await service.resetPassword({ token, password: 'new-password' });
  assert.equal(await users[0].comparePassword('new-password'), true);
  assert.equal(await users[0].comparePassword(credentials.password), false);
  await assert.rejects(service.resetPassword({ token, password: 'another-password' }), /invalide/);
  assert.equal((await service.signIn({ ...credentials, password: 'new-password' })).success, true);
});

test('unknown accounts get neutral resend/reset messages', async () => {
  const { service, emails } = fixture();
  assert.equal((await service.forgotPassword({ email: credentials.email })).success, true);
  assert.equal((await service.resendVerificationEmail({ email: credentials.email })).success, true);
  assert.equal(emails.length, 0);
});

test('actual Mongoose save hook hashes a plain password once and skips unchanged passwords', async () => {
  const user = new UserModel({ email: 'hook@example.com', password: 'plain-password' });
  const beforeSave = () => new Promise((resolve, reject) => {
    UserModel.schema.s.hooks.execPre('save', user, [], (error) => error ? reject(error) : resolve());
  });
  await beforeSave();
  assert.equal(await user.comparePassword('plain-password'), true);
  const hash = user.password;
  user.unmarkModified('password');
  await beforeSave();
  assert.equal(user.password, hash);
});
