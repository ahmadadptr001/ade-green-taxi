import { supabase_server_coolify as supabase_coolify } from '@/config/supabase-server';
import { requireAuth, ADMIN_ROLES } from '@/lib/api-auth';
import { NextResponse } from 'next/server';

export async function POST(req) {
  // Hanya admin/super admin yang boleh melakukan aksi ini.
  const auth = requireAuth(req, { roles: ADMIN_ROLES });
  if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });
  const { artID, topic_id } = await req.json();
  try {
    if (!artID || !topic_id)
      return NextResponse.json({ message: 'Data penautan tidak valid' }, { status: 400 });

    const { error } = await supabase_coolify.from('article_topics').insert({
      article_id: artID,
      topic_id
    });

    if (error) {
      console.log('[ERROR] link topic:', error.message);
      return NextResponse.json(
        { message: 'Gagal menautkan topik ke dalam artikel' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Berhasil menautkan topik ke dalam artikel' },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
