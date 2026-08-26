import { supabase_server_coolify as supabase_coolify } from '@/config/supabase-server';
import { NextResponse } from 'next/server';
import { requireAuth, ADMIN_ROLES } from '@/lib/api-auth';

export async function POST(req) {
  try {
    // Hanya admin/super admin yang boleh menghapus artikel.
    const { error: authError } = requireAuth(req, { roles: ADMIN_ROLES });
    if (authError) return NextResponse.json({ message: authError }, { status: 403 });

    const { id } = await req.json();
    if (!id)
      return NextResponse.json({ message: 'ID artikel tidak valid' }, { status: 400 });

    const { error } = await supabase_coolify
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) {
      console.log('[ERROR LOG] gagal menghapus artikel ini:', error.message);
      return NextResponse.json({ message: 'Gagal menghapus artikel' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Artikel berhasil dihapus!' }, { status: 200 });
  } catch (err) {
    console.log('[ERROR] delete article:', err.message);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}
