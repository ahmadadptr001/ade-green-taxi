import { supabase_coolify } from "@/config/supabase";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { id } = await req.json();
  try {
    const { error } = await supabase_coolify
    .from ('topics')
    .delete()
    .eq('id', id);

    if (error) {
      console.log('[ERROR] gagal menghapus topik: ', error.message);
      return NextResponse.json({message: error.message}, {status: 400})
    }

    return NextResponse.json({message: 'Topik berhasil dihapus!'}, {status: 200})
  } catch (err) {
    return NextResponse.json({message: err.message}, {status: 500})
  }
}