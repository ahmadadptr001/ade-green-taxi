import { supabase_server_coolify as supabase_coolify } from '@/config/supabase-server';
import { requireAuth, ADMIN_ROLES } from '@/lib/api-auth';
import { slugify } from '@/utils/slug';
import { NextResponse } from 'next/server';

export async function POST(req) {
  // Hanya admin/super admin yang boleh melakukan aksi ini.
  const auth = requireAuth(req, { roles: ADMIN_ROLES });
  if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });
  const { tags, article_id } = await req.json();
  try {
    if (!Array.isArray(tags) || !article_id)
      return NextResponse.json({ message: 'Data penautan tidak valid' }, { status: 400 });

    const tagSlugs = tags.map(slugify);
    const { data: existingTags, error: tagFetchError } = await supabase_coolify
      .from('tags')
      .select('id, name, slug')
      .in('slug', tagSlugs);

    if (tagFetchError) {
      console.log('tagFetchError log: ', tagFetchError);
      return NextResponse.json(
        { message: tagFetchError.message },
        { status: 500 }
      );
    }

    const existingSlugs = existingTags.map((t) => t.slug);

    const newTagsPayload = tags
      .map((name, i) => ({
        name,
        slug: tagSlugs[i],
      }))
      .filter((tag) => !existingSlugs.includes(tag.slug));

    let newTags = [];
    if (newTagsPayload.length > 0) {
      const { data, error } = await supabase_coolify
        .from('tags')
        .insert(newTagsPayload)
        .select();

      if (error) {
        console.log('ERROR LOG: ', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
      }
      newTags = data;
    }
    const allTags = [...existingTags, ...newTags];
    const articleTagsPayload = allTags.map((tag) => ({
      article_id: article_id,
      tag_id: tag.id,
    }));

    // Cek error hasil penautan — jangan diam-diam dianggap sukses.
    const { error: linkError } = await supabase_coolify
      .from('article_tags')
      .insert(articleTagsPayload);

    if (linkError) {
      console.log('[ERROR] link tags:', linkError.message);
      return NextResponse.json(
        { message: 'Gagal menautkan tags ke artikel' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Berhasil menautkan tags ke artikel' },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
