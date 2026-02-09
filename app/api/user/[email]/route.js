import { supabase_coolify } from '@/config/supabase';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { email } = await params;
  try {
    const { data, error } = await supabase_coolify
      .from('profiles')
      .select()
      .eq('email', email)
      .maybeSingle();
    if (error)
      return NextResponse.json({ message: error.message }, { status: 500 });
    return NextResponse.json({
      message: 'Berhasil mendapatkan data pengguna!',
      data,
    });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
