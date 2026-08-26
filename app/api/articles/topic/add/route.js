import { supabase_server_coolify as supabase_coolify } from '@/config/supabase-server';
import { requireAuth, ADMIN_ROLES } from '@/lib/api-auth';
import { NextResponse } from "next/server";

export async function POST(req) {
  // Hanya admin/super admin yang boleh melakukan aksi ini.
  const auth = requireAuth(req, { roles: ADMIN_ROLES });
  if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });
  const { name, slug } = await req.json();
  try {
    const { error } = await supabase_coolify
    .from ('topics')
    .insert ({
      name: name,
      slug: slug
    })
    .select();

    if (error) {
      console.log('[ERROR] gagal menambahkan topik baru: ', error.message);
      return NextResponse.json({message: error.message}, {status: 400})
    }

    return NextResponse.json({message: 'Topik baru berhasil ditambahkan!'}, {status: 200})
  } catch (err) {
    return NextResponse.json({message: err.message}, {status: 500})
  }
}
