import { supabase_coolify } from '@/config/supabase';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const data = await req.json();
  try {
    const { data: dataPorfile, error } = await supabase_coolify
      .from('profiles')
      .select()
      .eq('password', data.password)
      .eq('email', data.email)
      .maybeSingle();

    if (error || !dataPorfile)
      return NextResponse.json({ message: error.message }, { status: 500 });
    return NextResponse.json(
      { message: 'Berhasil masuk ke akun anda', data: dataPorfile },
      { status: 200 }
    );
  } catch (err) {
    console.log(err)
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
