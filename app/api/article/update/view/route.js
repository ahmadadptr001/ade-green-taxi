import { supabase_coolify } from '@/config/supabase';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { view, slug } = await req.json();
  try {
    const { data, error } = await supabase_coolify
      .from('articles')
      .update({
        views: view + 1,
      })
      .select()
      .eq('slug', slug);

    if (error)
      return NextResponse.json({ message: error.message }, { status: 500 });
    return NextResponse.json({message: 'Berhasil update views pada artikel', data}, {status: 200})
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
