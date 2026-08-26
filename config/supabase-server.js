import { createClient } from '@supabase/supabase-js';

/**
 * CLIENT SERVER-ONLY — jangan pernah diimpor dari component/page client.
 *
 * Memakai SERVICE ROLE KEY (non-publik) yang melewati RLS. Seluruh operasi
 * database hanya sah lewat API route yang memvalidasi sesi & role pemanggil.
 * RLS di kedua proyek Supabase dikunci penuh untuk anon.
 */

const COOLIFY_URL = process.env.NEXT_PUBLIC_SUPABASE_COOLIFY_URL;
const COOLIFY_SERVICE_KEY = process.env.SUPABASE_COOLIFY_SERVICE_KEY;
const COOLIFY_ANON_FALLBACK = process.env.NEXT_PUBLIC_SUPABASE_COOLIFY_ANON_KEY;

const PENUMPANG_URL = process.env.NEXT_PUBLIC_SUPABASE_PENUMPANG_URL;
const PENUMPANG_SERVICE_KEY = process.env.SUPABASE_PENUMPANG_SERVICE_KEY;
const PENUMPANG_ANON_FALLBACK =
  process.env.NEXT_PUBLIC_SUPABASE_PENUMPANG_ANON_KEY;

function warnFallback(name) {
  console.warn(
    `[KEAMANAN] Service role key untuk ${name} belum terisi di env — ` +
      `fallback ke anon key akan GAGAL karena RLS dikunci. ` +
      `Isi SUPABASE_*_SERVICE_KEY segera!`
  );
}

export const supabase_server_coolify = createClient(
  COOLIFY_URL,
  COOLIFY_SERVICE_KEY || (warnFallback('Coolify'), COOLIFY_ANON_FALLBACK),
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export const supabase_server_penumpang = createClient(
  PENUMPANG_URL,
  PENUMPANG_SERVICE_KEY || (warnFallback('Penumpang'), PENUMPANG_ANON_FALLBACK),
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
