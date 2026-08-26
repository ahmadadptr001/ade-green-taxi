import { supabase_server_coolify as supabase_coolify } from '@/config/supabase-server';
import { NextResponse } from "next/server"
import { requireAuth, ADMIN_ROLES, ALLOWED_STATUSES } from "@/lib/api-auth"

export async function POST(req) {
  try {
    // Hanya admin/super admin yang boleh menangguhkan / mengaktifkan akun.
    const { error: authError } = requireAuth(req, { roles: ADMIN_ROLES });
    if (authError) return NextResponse.json({ message: authError }, { status: 403 });

    const { id, status, email } = await req.json();
    if (!id || !ALLOWED_STATUSES.includes(status))
      return NextResponse.json({ message: 'Status tidak valid' }, { status: 400 });

    const { error } = await supabase_coolify
      .from('profiles')
      .update({
        status: status
      })
      .select('id, fullname, email, phone, role, status, last_seen')
      .eq('id', id)

    if (error) {
      console.log('[ERROR] update status:', error.message);
      return NextResponse.json({ message: 'Gagal mengubah status' }, { status: 500 });
    }

    return NextResponse.json({message: `status ${email} telah ${status}`}, {status: 200})

  } catch (err) {
    console.log('[ERROR] update status:', err.message);
    return NextResponse.json({message: 'Terjadi kesalahan pada server'}, {status: 500})
  }
}
