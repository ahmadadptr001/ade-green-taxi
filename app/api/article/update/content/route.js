import { supabase_server_coolify as supabase_coolify } from '@/config/supabase-server';
import { NextResponse } from 'next/server';
import DOMPurify from 'isomorphic-dompurify';
import { requireAuth, ADMIN_ROLES } from '@/lib/api-auth';

export async function POST(req) {
  try {
    // Hanya admin/super admin yang boleh mengubah konten artikel.
    const { error: authError } = requireAuth(req, { roles: ADMIN_ROLES });
    if (authError) return NextResponse.json({ message: authError }, { status: 403 });

    const { id, content } = await req.json();

    if (!id || typeof content !== 'string')
      return NextResponse.json({ message: 'Payload tidak valid' }, { status: 400 });

    // Sanitasi di sisi server — konten apa pun yang masuk dibersihkan
    // sebelum disimpan (mencegah stored XSS via jalur edit).
    const clean = DOMPurify.sanitize(content);

    const { error } = await supabase_coolify
      .from('articles')
      .update({
        content: clean,
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
