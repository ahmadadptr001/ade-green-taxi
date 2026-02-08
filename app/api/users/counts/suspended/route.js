import { supabase_coolify } from '@/config/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data, error } = await supabase_coolify.rpc('count_all_profiles_by_suspended');
    if (error) 
      return NextResponse.json({ message: error.message }, { status: 500 });

    return NextResponse.json(
      { message: 'Berhasil mengambil data jumlah user yang ditangguhkan', counts: data },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
