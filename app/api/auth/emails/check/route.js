import { supabase_coolify } from '@/config/supabase';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { email } = await req.json();
  try {
    const { data, error } = await supabase_coolify
      .from('profiles')
      .select('id, email, phone')
      .eq('email', email)
      .maybeSingle();

    if (error || !data )
      return NextResponse.json({ message: error.message }, { status: 500 });
    return NextResponse.json(
      { message: `User dengan email ${email} ditemukan!`, data },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
