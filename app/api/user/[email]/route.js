import { supabase_server_coolify as supabase_coolify } from '@/config/supabase-server';
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';

export async function GET(req, { params }) {
  try {
    const { email } = await params;
    const decodedEmail = decodeURIComponent(email).trim().toLowerCase();

    // Profil hanya untuk pemilik akun atau admin.
    const auth = await requireAuth(req, { selfEmail: decodedEmail });
    if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

    const { data, error } = await supabase_coolify
      .from('profiles')
      .select('id, fullname, email, phone, role, status, last_seen')
      .eq('email', decodedEmail)
      .maybeSingle();

    if (error)
      return NextResponse.json({ message: error.message }, { status: 500 });

    if (!data)
      return NextResponse.json(
        { message: 'Pengguna tidak ditemukan' },
        { status: 404 }
      );

    return NextResponse.json({
      message: 'Berhasil mendapatkan data pengguna!',
      data,
    });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
