import { supabase_coolify } from "@/config/supabase";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { id, status, email } = await req.json();
    const { error } = await supabase_coolify
      .from('profiles')
      .update({
        status: status
      })
      .select()
      .eq('id', id)

    if (error) return NextResponse.json({message: error.message}, {status: 500})

    return NextResponse.json({message: `status ${email} telah ${status}`}, {status: 200})

  } catch (err) {
    console.log(err)
    return NextResponse.json({message: err.message}, {status: 500})
  }
}