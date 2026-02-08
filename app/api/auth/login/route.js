import { supabase_coolify } from '@/config/supabase';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const data = req.body;
  try {
    const { data: dataPorfile, error } = await supabase_coolify
      .from('profiles')
      .eq('password', data.passowrd)
      .eq('email', data.email)
      .select()
      .maybeSingle();

    if (error)
      return NextResponse.json({ message: error.message }, { status: 500 });
    return NextResponse.json(
      { message: 'Berhasil masuk ke akun anda', data: dataPorfile },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
