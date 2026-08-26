import { supabase_coolify } from "@/config/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Kolom password (hash) tidak boleh keluar dari server.
    const {data, error} = await supabase_coolify
      .from('profiles')
      .select('id, fullname, email, phone, role, status, last_seen');
    if (error) return NextResponse.json({message: error.message}, {status: 500})
    return NextResponse.json({message: 'Berhasil mendapatkan semua data pengguna!', data})
  } catch (err) { 
    return NextResponse.json({message: err.message}, {status: 500})
  }
}