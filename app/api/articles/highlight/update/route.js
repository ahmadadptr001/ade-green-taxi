import { supabase_server_coolify as supabase_coolify } from '@/config/supabase-server';
import { NextResponse } from 'next/server';
import { requireAuth, ADMIN_ROLES } from '@/lib/api-auth';

export async function POST(req) {
  try {
    // Hanya admin/super admin yang boleh mengubah pesan highlight.
    const { error: authError } = requireAuth(req, { roles: ADMIN_ROLES });
    if (authError) return NextResponse.json({ message: authError }, { status: 403 });

    const { text } = await req.json();

    if (typeof text !== 'string' || !text.trim())
      return NextResponse.json(
        { message: 'Teks pesan tidak boleh kosong' },
        { status: 400 }
      );
    if (text.length > 500)
      return NextResponse.json(
        { message: 'Teks pesan maksimal 500 karakter' },
        { status: 400 }
      );

    const { error } = await supabase_coolify
      .from('highlight')
      .upsert({ id: 1, text: text.trim() });

    if (error) {
      console.log('[ERROR] highlight upsert:', error.message);
      return NextResponse.json({ message: 'Gagal mempublikasikan' }, { status: 500 });
    }

    return NextResponse.json(
      { message: 'Pesan Highlight berhasil dipublikasikan!' },
      { status: 200 }
    );
  } catch (err) {
    console.log('[ERROR] highlight upsert:', err.message);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}
