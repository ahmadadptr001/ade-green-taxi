const { createClient } = require('@supabase/supabase-js');
const SUPABASE_COOLIFY_URL = process.env.NEXT_PUBLIC_SUPABASE_COOLIFY_URL;
const SUPABASE_COOLIFY_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_COOLIFY_ANON_KEY;

const SUPABASE_PENUMPANG_URL = process.env.NEXT_PUBLIC_SUPABASE_PENUMPANG_URL;
const SUPABASE_PENUMPANG_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PENUMPANG_ANON_KEY;

export const supabase = createClient(
  SUPABASE_PENUMPANG_URL,
  SUPABASE_PENUMPANG_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  }
);

export const supabase_coolify = createClient(
  SUPABASE_COOLIFY_URL,
  SUPABASE_COOLIFY_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  }
);
