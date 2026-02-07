import { supabase_coolify } from '@/config/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data, error } = await supabase_coolify.from('articles').select(`
      id,
      title,
      description,
      published_at,
      views,
      img,
      article_categories (
        categories(
          id,
          name,
          slug
        )
      ),
      article_tags (
        tags (
        id,
        name,
        slug
        )
      ),
      article_topics (
        topics (
          id,
          name,
          slug
        )
      )
      `);
    if (error) {
      console.log('[GET] ARTIKEL ERROR: ', error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: 'Berhasil mengambil data artikel', articles: data },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
