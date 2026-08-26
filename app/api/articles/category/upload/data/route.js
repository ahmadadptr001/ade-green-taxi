import { supabase_server_coolify as supabase_coolify } from '@/config/supabase-server';
import { requireAuth, ADMIN_ROLES } from '@/lib/api-auth';
import { NextResponse } from 'next/server';

export async function POST(req) {
  // Hanya admin/super admin yang boleh melakukan aksi ini.
  const auth = requireAuth(req, { roles: ADMIN_ROLES });
  if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });
  const { categorie_id, artID } = await req.json();
  try {
    if (!categorie_id || !artID)
      return NextResponse.json({ message: 'Data penautan tidak valid' }, { status: 400 });

    const { error } = await supabase_coolify.from('article_categories').insert({
      categorie_id,
      article_id: artID,
    });

    if (error) {
      console.log('[ERROR] link category:', error.message);
      return NextResponse.json(
        { message: 'Gagal menautkan kategori ke dalam artikel' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Berhasil menautkan kategori ke dalam artikel' },
      { status: 200 }
    );
  } catch (err) {
    console.log('error log: ', err)
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
