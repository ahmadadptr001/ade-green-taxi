import { supabase_server_coolify as supabase_coolify } from '@/config/supabase-server';
import { NextResponse } from "next/server"
import { requireAuth, hashPassword } from "@/lib/api-auth"

export async function POST(req) {
  try {
    const { id, newPassword } = await req.json()

    // Hanya pemilik akun atau admin yang boleh mengubah password.
    const { error: authError } = requireAuth(req, { self: id })
    if (authError) return NextResponse.json({ message: authError }, { status: 403 })

    if (!id || typeof newPassword !== 'string' || newPassword.length < 6)
      return NextResponse.json(
        { message: 'Password baru minimal 6 karakter' },
        { status: 400 }
      )

    // Simpan sebagai hash scrypt, bukan plaintext.
    const { error } = await supabase_coolify
      .from('profiles')
      .update({
        password: hashPassword(newPassword)
      })
      .eq('id', id)

    if (error) {
      console.log('[ERROR DEBUG] gagal mengubah password : ', error.message)
      return NextResponse.json({ message: 'Gagal mengubah password' }, { status: 500 })
    }
    return NextResponse.json({ message: 'Passsword berhasil diubah!' }, { status: 200 })

  } catch (err) {
    console.log('[ERROR DEBUG] gagal mengubah password : ', err.message)
    return NextResponse.json({ message: 'Terjadi kesalahan pada server' }, { status: 500 })
  }
}
