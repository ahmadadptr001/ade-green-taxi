import { supabase_coolify } from "@/config/supabase";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { name, slug } = await req.json();
  try {
    const { error } = await supabase_coolify
    .from ('categories')
    .insert ({
      name: name,
      slug: slug
    })
    .select();

    if (error) {
      console.log('[ERROR] gagal menambahkan kategori baru: ', error.message);
      return NextResponse.json({message: error.message}, {status: 400})
    }

    return NextResponse.json({message: 'Kategori baru berhasil ditambahkan!'}, {status: 200})
  } catch (err) {
    return NextResponse.json({message: err.message}, {status: 500})
  }
}