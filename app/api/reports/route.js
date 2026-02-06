import { supabase } from '@/config/supabase';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = req.json();
    const { error } = await supabase
      .from('reports')
      .insert(body)
      .select()
      .single();

    if (error)
      return NextResponse.json({ message: error.message }, { status: 500 });

    return NextResponse.json(
      { message: 'Berhasil mengirim laporan' },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
