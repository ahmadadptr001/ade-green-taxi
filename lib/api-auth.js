import crypto from 'crypto';

const AUTH_SECRET =
  process.env.AUTH_SECRET || 'insecure-dev-secret-change-me';
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 hari

export const ADMIN_ROLES = ['admin', 'super admin'];
export const ALLOWED_ROLES = ['pengunjung', 'admin', 'super admin'];
export const ALLOWED_STATUSES = ['aktif', 'ditangguhkan'];

/* ------------------------- Password (scrypt) ------------------------- */

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt$${salt}$${hash}`;
}

/** Verifikasi hash scrypt baru + plaintext legacy; { ok, needsRehash? } */
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

  // Legacy plaintext: bandingkan lewat sha256 agar panjang buffer sama.
  const a = crypto.createHash('sha256').update(password).digest();
  const b = crypto.createHash('sha256').update(stored).digest();
  return { ok: crypto.timingSafeEqual(a, b), needsRehash: true };
}

/* ------------------------------ Token HMAC --------------------------- */

function b64url(buf) {
  return Buffer.from(buf)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function sign(data) {
  return b64url(
    crypto.createHmac('sha256', AUTH_SECRET).update(data).digest()
  );
}

export function signToken(user, ttlMs = TOKEN_TTL_MS) {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    status: user.status,
    exp: Date.now() + ttlMs,
  };
  const body = b64url(JSON.stringify(payload));
  return `${body}.${sign(body)}`;
}

export function verifyToken(token) {
  if (typeof token !== 'string') return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const a = Buffer.from(sig);
  const b = Buffer.from(sign(body));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(
      Buffer.from(body.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString()
    );
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

/* ----------------------------- Request guard -------------------------- */

export function getAuth(req) {
  const header = req.headers.get('authorization') || '';
  const [scheme, token] = header.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null;
  return verifyToken(token);
}

function unauthorized(message = 'Tidak terautentikasi') {
  return { error: message, status: 401 };
}

function forbidden(message = 'Anda tidak memiliki izin untuk aksi ini') {
  return { error: message, status: 403 };
}

/**
 * requireAuth(req)                        → user login apa pun
 * requireAuth(req, { self: id })          → diri sendiri ATAU admin
 * requireAuth(req, { selfEmail: email })  → email sendiri ATAU admin
 * requireAuth(req, { roles: [...] })      → harus punya salah satu role
 *
 * Return: { auth }  atau  { error: string, status: number }
 *
 * Pattern A (destructure):
 *   const { error: authError } = requireAuth(req, { roles: ADMIN_ROLES });
 *   if (authError) return NextResponse.json({ message: authError }, { status: ... });
 *
 * Pattern B (direct):
 *   const auth = requireAuth(req, { roles: ADMIN_ROLES });
 *   if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });
 */
export function requireAuth(req, opts = {}) {
  const auth = getAuth(req);
  if (!auth) return unauthorized();
  if (opts.roles && !opts.roles.includes(auth.role)) return forbidden();
  if (opts.self != null || opts.selfEmail != null) {
    const isAdmin = ADMIN_ROLES.includes(auth.role);
    const isSelf =
      (opts.self != null && auth.sub === opts.self) ||
      (opts.selfEmail != null &&
        typeof auth.email === 'string' &&
        auth.email.toLowerCase() === opts.selfEmail);
    if (!isSelf && !isAdmin) return forbidden();
  }
  return { auth };
}

/* ------------------------------- Helpers ------------------------------ */

export function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
