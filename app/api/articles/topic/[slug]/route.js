import { supabase_coolify } from '@/config/supabase';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { slug } = await params;
  try {
    const { data, error } = await supabase_coolify
      .from('articles')
      .select(
        `
        id,
        title,
        img,
        published_at,
        description,
        article_topics!inner (
          topics!inner (
            id,
            name,
            slug
          )
        )  
      `
      )
      .eq('article_topics.topics.slug', slug);

    if (error)
      return NextResponse.json({ message: error.message }, { status: 500 });
    return NextResponse.json(
      {
        message:
          'Berhasil mendapatkan data artikel berdasarkan slug topik -> ' +
          slug,
        articles: data,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
