import { supabase_coolify } from '@/config/supabase';
import { NextResponse } from 'next/server';
import { verifyPassword, hashPassword } from '@/lib/password-compat';

export async function POST(req) {
  try {
    const data = await req.json();
    const { data: dataPorfile, error } = await supabase_coolify
      .from('profiles')
      .select()
      .eq('email', data.email)
      .maybeSingle();

    if (error) {
      console.log('[ERROR] login:', error.message);
      return NextResponse.json({ message: 'Terjadi kesalahan pada server' }, { status: 500 });
    }

    // Verifikasi mendukung hash scrypt (akun baru) dan plaintext legacy.
    // Verifikasi tetap dijalankan saat akun tidak ada untuk meratakan waktu respons.
    const { ok, needsRehash } = dataPorfile
      ? verifyPassword(data.password, dataPorfile.password)
      : verifyPassword(data.password, 'scrypt$00$00');

    if (!dataPorfile || !ok)
      return NextResponse.json(
        { message: 'Email atau password yang Anda masukkan salah' },
        { status: 401 }
      );

    // Migrasi otomatis: password legacy plaintext di-rehash.
    if (needsRehash) {
      await supabase_coolify
        .from('profiles')
        .update({ password: hashPassword(data.password) })
        .eq('id', dataPorfile.id);
    }

    // Jangan pernah kirim kolom password (kini berisi hash) ke client.
    delete dataPorfile.password;

    return NextResponse.json(
      { message: 'Berhasil masuk ke akun anda', data: dataPorfile },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
