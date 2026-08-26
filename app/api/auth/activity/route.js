import { supabase_server_coolify as supabase_coolify } from '@/config/supabase-server';
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';

export async function POST(req) {
  try {
    const { id } = await req.json();

    // Hanya pemilik akun sendiri yang boleh memperbarui last_seen-nya.
    const { error: authError } = requireAuth(req, { self: id });
    if (authError) return NextResponse.json({ message: authError }, { status: 403 });

    if (!id)
      return NextResponse.json({ message: 'ID tidak valid' }, { status: 400 });

    const now = new Date().toISOString();
    const { error } = await supabase_coolify
      .from('profiles')
      .update({
        last_seen: now,
      })
      .eq('id', id);

    if (error) {
      console.log('[ERROR LOG] Gagal mengupdate riwayat waktu login:', error.message);
      return NextResponse.json({ message: 'Gagal mengupdate riwayat login' }, { status: 500 });
    }
    return NextResponse.json(
      { message: 'Berhasil mengupdate riwayat terakhir login' },
      { status: 200 }
    );
  } catch (err) {
    console.log('[ERROR LOG] Gagal mengupdate riwayat waktu login:', err.message);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}
