import { supabase_coolify } from '@/config/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data, error } = await supabase_coolify.from('articles').select(`
      id,
      title,
      slug,
      content,
      description,
      published_at,
      views,
      img,
      article_likes (profiles(id, fullname, role, status, email)),
      article_bookmarks (profiles(id, fullname, role, status, email )),
      article_categories (
        categories( id, name, slug )
      ),
      article_tags (
        tags ( id, name, slug)
      ),
      article_topics (
        topics ( id, name, slug)
      )
      `);
    if (error) {
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
