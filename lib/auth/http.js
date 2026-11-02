import { NextResponse } from 'next/server';
import { AuthError } from './service.mjs';

// All auth routes share JSON parsing and the same public error contract.
export function authPost(operation, status = 200) {
  return async function POST(request) {
    try {
      let input;
      try { input = await request.json(); }
      catch { throw new AuthError('JSON invalide'); }
      if (!input || typeof input !== 'object' || Array.isArray(input)) throw new AuthError('Objet JSON requis');
      return NextResponse.json(await operation(input), { status });
    } catch (error) {
      const expected = error instanceof AuthError;
      if (!expected) console.error('Auth operation failed:', error.name);
      return NextResponse.json({ success: false, message: expected ? error.message : 'Erreur serveur' },
        { status: expected ? error.status : 500 });
    }
  };
}
