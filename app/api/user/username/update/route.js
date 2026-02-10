import { supabase_coolify } from "@/config/supabase";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { id, newFullname } = await req.json();
    const { data: user, error } = await supabase_coolify
      .from('profiles')
      .update({
        fullname: newFullname
      })
      .select()
      .eq('id', id)
      .maybeSingle()

      console.log('user log: ', user)
    if (error) {
      console.log('[ERROR DEBUG] gagal mengubah nama pengguna : ', error.message )
      return NextResponse.json({message: error.message}, {status: 400})
    }

    return NextResponse.json({message: `Berhasil mengubah nama pengguna!`, user: user}, {status: 200})

  } catch (err) {
    console.log(err)
    return NextResponse.json({message: err.message}, {status: 500})
  }
}