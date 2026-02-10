import { supabase_coolify } from '@/config/supabase';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { categorie_id, artID } = await req.json();
  try {
    const { error } = await supabase_coolify.from('article_categories').insert({
      categorie_id,
      article_id: artID,
    });
    console.log(categorie_id, artID);

    console.log('error log: ', error);
    // if (error) {
    //   return NextResponse.json({ message: error.message }, { status: 400 });
    // }
    
    return NextResponse.json(
      { message: 'Berhasil menautkan kategori ke dalam artikel' },
      { status: 200 }
    );
  } catch (err) {
    console.log('error log: ', err)
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
