import { supabase_coolify } from "@/config/supabase";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { slug } = await params;
  try {
    const { data, error } = await supabase_coolify
      .from('articles')
      .select('*')
      .or(`title.ilike.%${slug}%,description.ilike.%${slug}%`);

    if (error) {
      console.log(
        '[ERROR] Gagal mendapatkan artikel by keyword: ',
        error.message
      );
      console.log(error)
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json(
      {
        message:
          'Berhasil mendapatkan data artikel berdasarkan keyword -> ' +
          slug,
        articles: data,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log('[ERROR] Gagal mendapatkan artikel by keyword: ', err.message);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
