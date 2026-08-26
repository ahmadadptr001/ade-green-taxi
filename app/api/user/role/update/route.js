import { supabase_server_coolify as supabase_coolify } from '@/config/supabase-server';
import { NextResponse } from 'next/server';
import { requireAuth, ALLOWED_ROLES } from '@/lib/api-auth';

export async function POST(req) {
  try {
    // Hanya super admin yang boleh mengubah role.
    const { error: authError } = requireAuth(req, { roles: ['super admin'] });
    if (authError) return NextResponse.json({ message: authError }, { status: 403 });

    const { id, role, email } = await req.json();
    if (!id || !ALLOWED_ROLES.includes(role))
      return NextResponse.json({ message: 'Role tidak valid' }, { status: 400 });

    const { error } = await supabase_coolify
      .from('profiles')
      .update({
        role: role
      })
      .select('id, fullname, email, phone, role, status, last_seen')
      .eq('id', id)

    if (error) {
      console.log('[ERROR] update role:', error.message);
      return NextResponse.json({ message: 'Gagal mengubah role' }, { status: 500 });
    }

    return NextResponse.json({message: `${email} telah diubah menjadi ${role}`}, {status: 200})

  } catch (err) {
    console.log('[ERROR] update role:', err.message);
    return NextResponse.json({message: 'Terjadi kesalahan pada server'}, {status: 500})
  }
}
