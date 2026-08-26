import { supabase_server_coolify as supabase_coolify } from '@/config/supabase-server';
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

export async function POST(req) {
  try {
    const { id } = await req.json();
    if (!id)
      return NextResponse.json({ message: 'ID tidak valid' }, { status: 400 });

    // Pemilik akun boleh menghapus akunnya sendiri; admin boleh hapus siapa pun.
    const { error: authError } = requireAuth(req, { self: id });
    if (authError) return NextResponse.json({ message: authError }, { status: 403 });

    const { error } = await supabase_coolify
      .from('profiles')
      .delete()
      .eq('id', id)

    if (error) {
      console.log('[ERROR] delete user:', error.message);
      return NextResponse.json({ message: 'Gagal menghapus akun' }, { status: 500 });
    }

    return NextResponse.json({message: `Akun berhasil dihapus`}, {status: 200})

  } catch (err) {
    console.log('[ERROR] delete user:', err.message);
    return NextResponse.json({message: 'Terjadi kesalahan pada server'}, {status: 500})
  }
}
