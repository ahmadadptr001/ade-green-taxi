import { supabase_server_coolify as supabase_coolify } from '@/config/supabase-server';
import { NextResponse } from "next/server";
import { requireAuth } from '@/lib/api-auth';

export async function POST(req) {
  try {
    const { id, newFullname } = await req.json();

    // Hanya pemilik akun atau admin yang boleh mengubah nama.
    const { error: authError } = requireAuth(req, { self: id });
    if (authError) return NextResponse.json({ message: authError }, { status: 403 });

    if (!id || typeof newFullname !== 'string' || newFullname.trim().length < 3)
      return NextResponse.json(
        { message: 'Nama pengguna minimal 3 karakter' },
        { status: 400 }
      );

    const { data: user, error } = await supabase_coolify
      .from('profiles')
      .update({
        fullname: newFullname.trim()
      })
      // Kolom password (hash) tidak boleh ikut dalam response.
      .select('id, fullname, email, phone, role, status, last_seen')
      .eq('id', id)
      .maybeSingle()

    if (error) {
      console.log('[ERROR DEBUG] gagal mengubah nama pengguna : ', error.message )
      return NextResponse.json({message: error.message}, {status: 400})
    }

    return NextResponse.json({message: `Berhasil mengubah nama pengguna!`, user: user}, {status: 200})

  } catch (err) {
    console.log(err)
    return NextResponse.json({message: err.message}, {status: 500})
  }
}
