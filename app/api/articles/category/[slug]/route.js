import { supabase_coolify } from '@/config/supabase';
import { NextResponse } from 'next/server';

export async function GET({ params }) {
  const  slug = await params;
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
        article_categories (
          categories (
            id,
            name,
            slug
          )
        )  
      `
      )
      .eq('article_categories.categories.slug', slug);

    if (error)
      return NextResponse.json({ message: error.message }, { status: 500 });
    return NextResponse.json(
      {
        message:
          'Berhasil mendapatkan data artikel berdasarkan slug kategori ->' +
          slug,
          articles: data
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
