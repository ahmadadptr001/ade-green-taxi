import { supabase_coolify } from "@/config/supabase";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { id, name, slug } = await req.json();
  try {
    const { error } = await supabase_coolify
      .from("topics")
      .update({ name, slug })
      .eq("id", id);

    if (error) {
      console.log("[ERROR] gagal memperbarui topik: ", error.message);
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Topik berhasil diperbarui!" },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
