import { supabase_server_coolify as supabase_coolify } from '@/config/supabase-server';
import { NextResponse } from 'next/server';
import { requireAuth, ADMIN_ROLES } from '@/lib/api-auth';

const ARTICLE_COLUMNS = ['title', 'content', 'description', 'slug', 'img', 'views', 'published_at'];

export async function POST(req) {
  try {
    // Hanya admin/super admin yang boleh membuat artikel.
    const { error: authError } = requireAuth(req, { roles: ADMIN_ROLES });
    if (authError) return NextResponse.json({ message: authError }, { status: 403 });

    const body = await req.json().catch(() => null);
    if (!body || typeof body.payload !== 'object' || !body.payload)
      return NextResponse.json({ message: 'Payload tidak valid' }, { status: 400 });

    // Whitelist kolom — body mentah tidak pernah masuk DB langsung.
    const payload = {};
    for (const key of ARTICLE_COLUMNS) {
      if (body.payload[key] !== undefined && body.payload[key] !== null)
        payload[key] = body.payload[key];
    }

    if (!payload.title || !payload.content || !payload.slug)
      return NextResponse.json(
        { message: 'Judul, konten, dan slug wajib diisi' },
        { status: 400 }
      );

    const { data, error } = await supabase_coolify
      .from('articles')
      .insert(payload)
      .select()
      .maybeSingle();

    if (error || !data) {
      console.log('[ERROR] upload article:', error?.message);
      return NextResponse.json(
        { message: 'Gagal menyimpan artikel' },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: 'Berhasil menambahkan artikel', article: data },
      { status: 200 }
    );
  } catch (err) {
    console.log('[ERROR] upload article:', err.message);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}
