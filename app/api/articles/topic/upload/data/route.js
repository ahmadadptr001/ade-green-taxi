import { supabase_coolify } from '@/config/supabase';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { artID, topic_id } = await req.json();
  try {
    const { error } = await supabase_coolify.from('article_topics').insert({
      article_id: artID,
      topic_id
    });

    // if (error) {
    //   return NextResponse.json({ message: error.message }, { status: 500 });
    // }

    return NextResponse.json(
      { message: 'Berhasil menautkan topik ke dalam artikel' },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
