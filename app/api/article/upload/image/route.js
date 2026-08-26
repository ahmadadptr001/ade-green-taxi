import { supabase_server_coolify as supabase_coolify } from '@/config/supabase-server';
import { NextResponse } from 'next/server';
import { requireAuth, ADMIN_ROLES } from '@/lib/api-auth';

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const EXT_BY_MIME = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

export async function POST(req) {
  try {
    // Hanya admin/super admin yang boleh mengunggah gambar.
    const { error: authError } = requireAuth(req, { roles: ADMIN_ROLES });
    if (authError) return NextResponse.json({ message: authError }, { status: 403 });

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string')
      return NextResponse.json({ message: 'File tidak ditemukan' }, { status: 400 });

    if (!ALLOWED_MIME.includes(file.type))
      return NextResponse.json(
        { message: 'Tipe file harus JPG, PNG, WebP, atau GIF' },
        { status: 415 }
      );

    if (file.size > MAX_SIZE_BYTES)
      return NextResponse.json(
        { message: 'Ukuran file maksimal 5MB' },
        { status: 413 }
      );

    // Ekstensi diturunkan dari MIME yang sudah divalidasi (bukan nama file).
    const fileName = `${Date.now()}.${EXT_BY_MIME[file.type]}`;
    const filePath = `images/${fileName}`;

    const { data, error } = await supabase_coolify.storage
      .from('articles') //
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      console.error('Upload error:', error.message);
      return NextResponse.json({ message: 'Gagal mengupload gambar' }, { status: 500 });
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
