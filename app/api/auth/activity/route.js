import { supabase_coolify } from '@/config/supabase';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { id } = await req.json();
  const now = new Date().toISOString();
  try {
    const { data, error } = await supabase_coolify
      .from('profiles')
      .update({
        last_seen: now,
      })
      .eq('id', id);

    if (error) {
      console.log(
        '[ERROR LOG] Gagal mengupdate riwayat waktu login:',
        error.message
      );
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { message: 'Berhasil mengupdate riwayat terakhir login' },
      { staus: 200 }
    );
  } catch (err) {
    return NextResponse.json({ message: err.message }, { staus: 500 });
  }
}
