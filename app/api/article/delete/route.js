import { supabase_coolify } from '@/config/supabase';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { id } = await req.json();
  try {
    const { error } = await supabase_coolify
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) {
      console.log('[ERROR LOG] gagal menghapus artikel ini:', error.message);
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

      return NextResponse.json({ message: 'Artikel berhasil dihapus!' }, { status: 200 });

  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
