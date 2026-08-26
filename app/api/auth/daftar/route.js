import { supabase_coolify } from '@/config/supabase';
import { NextResponse } from 'next/server';
import { hashPassword } from '@/lib/password-compat';

export async function POST(req) {
  const body = await req.json();
  try {
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

    if (!payload.fullname || !payload.email || !body.password)
      return NextResponse.json({ message: 'Data registrasi tidak lengkap' }, { status: 400 });

    const { data: dataPorfile, error } = await supabase_coolify
      .from('profiles')
      .insert(payload)
      .select()
      .maybeSingle()

    if (error)
      return NextResponse.json({ message: error.message }, { status: 500 });

    // Jangan kirim kolom password ke client.
    if (dataPorfile) delete dataPorfile.password;

    return NextResponse.json(
      { message: 'Berhasil melakukan registrasi akun', data: dataPorfile },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
