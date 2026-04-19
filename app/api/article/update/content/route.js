import { supabase_coolify } from '@/config/supabase';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { id, content } = await req.json();
  try {
    const { error } = await supabase_coolify
      .from('articles')
      .update({
        content: content,
      })
      .eq('id', id);

    if (error) {
      console.log('[ERROR LOG] gagal update content artikel:', error.message);
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

      return NextResponse.json({ message: 'Konten artikel berhasil diperbarui!' }, { status: 200 });

  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
