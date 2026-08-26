import { supabase_server_coolify as supabase_coolify } from '@/config/supabase-server';
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';

export async function POST(req) {
  try {
    const { article_id } = await req.json();

    // Identitas bookmark diambil dari sesi token, BUKAN dari body.
    const { auth, error: authError } = requireAuth(req);
    if (authError) return NextResponse.json({ message: authError }, { status: 401 });
    const profile_id = auth.sub;

    if (!article_id)
      return NextResponse.json({ message: 'ID artikel tidak valid' }, { status: 400 });

    const { data, error } = await supabase_coolify
      .from('article_bookmarks')
      .select()
      .eq('profile_id', profile_id)
      .eq('article_id', article_id);

    if (error) {
      console.log('[ERROR LOG] gagal mengambil data tabel article_bookmarks : ', error.message);
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    // Toggle: jika sudah ada maka hapus, jika belum maka tambahkan.
    if (data && data.length !== 0) {
      const { error: errorRemoved } = await supabase_coolify
        .from('article_bookmarks')
        .delete()
        .eq('profile_id', profile_id)
        .eq('article_id', article_id);

      if (errorRemoved) {
        console.log('[ERROR LOG] gagal menghapus dari bookmark : ', errorRemoved.message);
        return NextResponse.json({ message: errorRemoved.message }, { status: 400 });
      }
      return NextResponse.json(
        { message: 'Berhasil menghapus artikel dari bookmark' },
        { status: 200 }
      );
    }

    const { error: errorBookmark } = await supabase_coolify
      .from('article_bookmarks')
      .insert({
        article_id: article_id,
        profile_id: profile_id,
      })
      .select();

    if (errorBookmark) {
      console.log('[ERROR LOG] gagal menambahkan ke bookmark: ', errorBookmark.message);
      return NextResponse.json({ message: errorBookmark.message }, { status: 400 });
    }
    return NextResponse.json(
      { message: 'Berhasil menambahkan artikel ke bookmark' },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
