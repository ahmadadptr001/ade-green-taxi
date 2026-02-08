import { supabase_coolify } from '@/config/supabase';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const data = req.body;
  try {
    const { data, error } = supabase_coolify.from('profiles').insert({
      email: data.email,
      password: data.email
    });
    return NextResponse.json(
      { message: 'Berhasil membuat akun', data: data },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
