import { supabase_server_coolify as supabase_coolify } from '@/config/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { slug } = await req.json();

    // View dihitung server-side: nilai dari client tidak dipercaya.
    if (typeof slug !== 'string' || !slug)
      return NextResponse.json({ message: 'Slug tidak valid' }, { status: 400 });

    const { data: current, error: fetchError } = await supabase_coolify
      .from('articles')
      .select('id, views')
      .eq('slug', slug)
      .maybeSingle();

    if (fetchError) {
      console.log('[ERROR] update view fetch:', fetchError.message);
      return NextResponse.json({ message: fetchError.message }, { status: 500 });
    }
    if (!current)
      return NextResponse.json({ message: 'Artikel tidak ditemukan' }, { status: 404 });

    const nextViews = (Number(current.views) || 0) + 1;

    const { data, error } = await supabase_coolify
      .from('articles')
      .update({ views: nextViews })
      .select('id, views')
      .eq('id', current.id);

    if (error) {
      console.log('[ERROR] update view:', error.message);
      return NextResponse.json({ message: 'Terjadi kesalahan pada server' }, { status: 500 });
    }
    return NextResponse.json(
      { message: 'Berhasil update views pada artikel', data },
      { status: 200 }
    );
  } catch (err) {
    console.log('[ERROR] update view:', err.message);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
