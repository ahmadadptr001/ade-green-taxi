import { supabase_coolify } from '@/config/supabase';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const data = await req.json();
  try {
    const { data: dataPorfile, error } = await supabase_coolify
      .from('profiles')
      .insert(data)
      .select();

    if (error)
      return NextResponse.json({ message: error.message }, { status: 500 });
    return NextResponse.json(
      { message: 'Berhasil melakukan registrasi akun', data: dataPorfile },
      { status: 200 }
    );
  } catch (err) {
    console.log(err)
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
