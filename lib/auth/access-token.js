import jwt from 'jsonwebtoken';

// Never accept a token using a built-in or missing signing secret.
export function verifyAccessToken(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must contain at least 32 characters');
  }
  const payload = jwt.verify(token, secret, { algorithms: ['HS256'] });
  if (typeof payload === 'string' || !/^[a-f\d]{24}$/i.test(payload.userId || '')) {
    throw new jwt.JsonWebTokenError('Invalid user ID');
  }
  return payload;
}
