import { supabase_coolify } from '@/config/supabase';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { payload } = await req.json();
  try {
    const { data, error } = await supabase_coolify
      .from('articles')
      .insert(payload)
      .select()
      .maybeSingle();

    if (error)
      return NextResponse.json({ message: error.message }, { status: 500 });
    return NextResponse.json({message: 'Berhasil menambahkan artikel', article: data}, {status: 200})
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
