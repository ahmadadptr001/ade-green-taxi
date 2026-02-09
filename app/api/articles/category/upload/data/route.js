import { supabase_coolify } from '@/config/supabase';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { categorie_id, artID } = await req.json();
  try {
    const { error } = await supabase_coolify.from('article_categories').insert({
      categorie_id,
      article_id: artID,
    });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: 'Berhasil menautkan kategori ke dalam artikel' },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
