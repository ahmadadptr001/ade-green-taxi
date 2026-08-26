import { supabase_server_coolify as supabase_coolify } from '@/config/supabase-server';
import { requireAuth } from '@/lib/api-auth';
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Hanya admin/super admin yang boleh melihat daftar pengguna.
    const profile = await requireAuth(request, ['super admin', 'admin']);
    if (profile.error) {
      return NextResponse.json({ message: profile.error }, { status: profile.status });
    }

    // Kolom password (hash) tidak boleh keluar dari server.
    const {data, error} = await supabase_coolify
      .from('profiles')
      .select('id, fullname, email, phone, role, status, last_seen');
    if (error) return NextResponse.json({message: error.message}, {status: 500})
    return NextResponse.json({message: 'Berhasil mendapatkan semua data pengguna!', data})
  } catch (err) { 
    return NextResponse.json({message: err.message}, {status: 500})
  }
}
