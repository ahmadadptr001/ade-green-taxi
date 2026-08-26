import crypto from 'crypto';

/**
 * Kompatibilitas password untuk kode lama.
 * - Akun baru dibuat dengan hash scrypt (format: scrypt$salt$hash)
 * - Akun lama mungkin masih plaintext -> didukung lalu di-rehash saat login
 */

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt$${salt}$${hash}`;
}

/** Return { ok: boolean, needsRehash?: boolean } */
export function verifyPassword(password, stored) {
  if (typeof stored !== 'string' || !stored) return { ok: false };

  if (stored.startsWith('scrypt$')) {
    const [, salt, hash] = stored.split('$');
    if (!salt || !hash) return { ok: false };
    const candidate = crypto.scryptSync(password, salt, 64);
    const expected = Buffer.from(hash, 'hex');
    if (candidate.length !== expected.length) return { ok: false };
    return { ok: crypto.timingSafeEqual(candidate, expected) };
  }

  // Legacy plaintext: cocokkan lewat sha256 agar panjang buffer selalu sama.
  const a = crypto.createHash('sha256').update(password).digest();
  const b = crypto.createHash('sha256').update(stored).digest();
  return { ok: crypto.timingSafeEqual(a, b), needsRehash: true };
}
