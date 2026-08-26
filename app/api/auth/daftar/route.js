import { supabase_server_coolify as supabase_coolify } from '@/config/supabase-server';
import { NextResponse } from 'next/server';
import { hashPassword, signToken, isValidEmail } from '@/lib/api-auth';

export async function POST(req) {
  try {
    const body = await req.json();
    // Whitelist field agar role/status tidak bisa dipalsukan lewat body.
    // Password disimpan sebagai hash scrypt (sesuai format akun di database).
    const payload = {
      fullname: typeof body.fullname === 'string' ? body.fullname.trim() : '',
      email: typeof body.email === 'string' ? body.email.trim().toLowerCase() : '',
      password: hashPassword(typeof body.password === 'string' ? body.password : ''),
      phone: typeof body.phone === 'string' ? body.phone.replace(/\D/g, '') : '',
      role: 'pengunjung',
      status: 'aktif',
    };

    if (!payload.fullname || !isValidEmail(payload.email) || typeof body.password !== 'string')
      return NextResponse.json({ message: 'Data registrasi tidak lengkap' }, { status: 400 });

    // Cegah duplikat email
    const { data: existing } = await supabase_coolify
      .from('profiles')
      .select('id')
      .eq('email', payload.email)
      .maybeSingle();
    if (existing)
      return NextResponse.json(
        { message: 'Email sudah terdaftar. Silakan masuk atau gunakan email lain.' },
        { status: 409 }
      );

    const { data: dataPorfile, error } = await supabase_coolify
      .from('profiles')
      .insert(payload)
      .select('id, fullname, email, phone, role, status, last_seen')
      .maybeSingle()

    if (error || !dataPorfile) {
      console.log('[ERROR] daftar:', error?.message);
      return NextResponse.json(
        { message: 'Gagal membuat akun. Silakan coba lagi.' },
        { status: 500 }
      );
    }

    // Langsung terbitkan sesi — registrasi tanpa verifikasi email.
    const token = signToken(dataPorfile);

    return NextResponse.json(
      { message: 'Berhasil melakukan registrasi akun', token, data: dataPorfile },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
