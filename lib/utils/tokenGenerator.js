import crypto from 'crypto';

export function generateVerificationToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getExpirationDate(hours = 24) {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  return date;
}