import { supabase_coolify } from '@/config/supabase';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file')
  try {
    console.log('file debug: ', file);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `images/${fileName}`;

    const { data, error } = await supabase_coolify.storage
      .from('articles') //
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error.message);
      return NextResponse.json({ message: err.message }, { status: 500 });
    }

    // ambil public url
    const { data: publicData } = supabase_coolify.storage
      .from('articles')
      .getPublicUrl(data.path);

    return NextResponse.json(
      {
        message: 'Berhasil mengupload gambar utama berita',
        url: publicData.publicUrl,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
