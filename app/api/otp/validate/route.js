import { supabase } from "@/config/supabase"
import { NextResponse } from "next/server"

export async function POST(req) {
  const { email, code } = await req.json()

  const { data, error } = await supabase
    .from('otps')
    .select('*')
    .eq('email', email)
    .eq('code', code)
    .single()

  if (error || !data) {
    return NextResponse.json(
      { message: 'OTP tidak ditemukan' },
      { status: 200 }
    )
  }

  const now = new Date()
  const createdTime = new Date(data.created_at).getTime();

  if (data.used) {
    return NextResponse.json(
      { message: 'OTP sudah digunakan' },
      { status: 200 }
    )
  }

  // const OTP_EXPIRE_MS = 5 * 60 * 1000 // 5 menit
  // if (now - createdTime > OTP_EXPIRE_MS) {
  //   return NextResponse.json(
  //     { message: 'OTP sudah kedaluwarsa' },
  //     { status: 200 }
  //   )
  // }

  // tandai OTP sebagai used
  await supabase
    .from('otp_codes')
    .update({ used: true })
    .eq('id', data.id)

  return NextResponse.json({
    message: 'OTP valid',
    success: true,
  })
}