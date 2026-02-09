import { supabase_coolify } from '@/config/supabase';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { isBookmarked, slug } = await req.json();
  try {
    const { data, error } = await supabase_coolify
      .from('articles')
      .update({
        isBookmarked: isBookmarked,
      })
      .select()
      .eq('slug', slug);

    if (error)
      return NextResponse.json({ message: error.message }, { status: 500 });
    return NextResponse.json({message: 'Berhasil menyimpan artikel', data}, {status: 200})
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
