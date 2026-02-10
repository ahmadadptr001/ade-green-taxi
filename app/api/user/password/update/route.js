import { supabase_coolify } from "@/config/supabase"
import { NextResponse } from "next/server"

export async function POST(req) {
  const { id, newPassword } = await req.json()
  try {
    const { error } = await supabase_coolify
      .from('profiles')
      .update({
        password: newPassword
      })
      .eq('id', id)
    
    if (error) {
      console.log('[ERROR DEBUG] gagal mengubah password : ', error.message )
      return NextResponse.json({message: error.message}, {status: 400})
    }
    return NextResponse.json({message: 'Passsword berhasil diubah!'}, {status: 200})

  } catch (err) {
    return NextResponse.json({message: err.message}, {status: 500})
  }
}