import {
  supabase_server_penumpang as supabase,
  supabase_server_coolify as supabase_coolify,
} from '@/config/supabase-server';
import { NextResponse } from 'next/server';
import { signToken } from '@/lib/api-auth';

const OTP_EXPIRE_MS = 5 * 60 * 1000; // 5 menit

export async function POST(req) {
  try {
    const { email, code } = await req.json();

    if (typeof email !== 'string' || typeof code !== 'string')
      return NextResponse.json(
        { message: 'Email dan kode OTP wajib diisi', success: false },
        { status: 400 }
      );

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedCode = code.trim();

    // Backend pengirim OTP eksternal bisa saja menulis ke tabel 'otps'
    // atau 'otp_codes' — cek keduanya agar validasi tidak pernah salah meja.
    let table = null;
    let data = null;
    for (const t of ['otps', 'otp_codes']) {
      const { data: row, error } = await supabase
        .from(t)
        .select('*')
        .eq('email', normalizedEmail)
        .eq('code', normalizedCode)
        .maybeSingle();
      if (error) {
        console.log(`[ERROR] otp validate (${t}):`, error.message);
        continue;
      }
      if (row) {
        table = t;
        data = row;
        break;
      }
    }

    if (!table || !data)
      return NextResponse.json(
        { message: 'OTP tidak ditemukan atau salah', success: false },
        { status: 401 }
      );

    if (data.used)
      return NextResponse.json(
        { message: 'OTP sudah digunakan', success: false },
        { status: 409 }
      );

    // Kedaluwarsa 5 menit — lewati hanya jika created_at tidak tersedia.
    const createdTime = data.created_at ? new Date(data.created_at).getTime() : NaN;
    if (!Number.isNaN(createdTime) && Date.now() - createdTime > OTP_EXPIRE_MS)
      return NextResponse.json(
        { message: 'OTP sudah kedaluwarsa, silakan kirim ulang', success: false },
        { status: 410 }
      );

    // Tandai used di tabel yang SAMA dengan tempat kode ditemukan,
    // sehingga kode tidak bisa dipakai ulang.
    const { error: updateError } = await supabase
      .from(table)
      .update({ used: true })
      .eq('id', data.id);
    if (updateError) {
      console.log('[ERROR] otp mark used:', updateError.message);
      return NextResponse.json(
        { message: 'Terjadi kesalahan pada server', success: false },
        { status: 500 }
      );
    }

    // Identitas terbukti via OTP → terbitkan sesi + profil (tanpa password).
    const { data: profile, error: profileError } = await supabase_coolify
      .from('profiles')
      .select('id, fullname, email, phone, role, status, last_seen')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (profileError || !profile) {
      console.log('[ERROR] otp profile lookup:', profileError?.message);
      return NextResponse.json({
        message: 'OTP valid namun akun tidak ditemukan',
        success: false,
      }, { status: 404 });
    }

    const token = signToken(profile);

    return NextResponse.json({
      message: 'OTP valid',
      success: true,
      token,
      data: profile,
    });
  } catch (err) {
    console.log('[ERROR] otp validate:', err.message);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server', success: false },
      { status: 500 }
    );
  }
}
