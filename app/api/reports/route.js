import { supabase_server_penumpang as supabase } from '@/config/supabase-server';
import { NextResponse } from 'next/server';

const REPORT_FIELDS = [
  'title',
  'description',
  'screenshot_url',
  'app_version',
  'device',
  'os',
  'name',
  'email',
  'status',
  'customer_id',
];

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object')
      return NextResponse.json({ message: 'Payload tidak valid' }, { status: 400 });

    // Whitelist kolom + status dipaksa 'pending' agar tidak bisa dipalsukan.
    const payload = {};
    for (const key of REPORT_FIELDS) {
      if (body[key] !== undefined) payload[key] = body[key];
    }
    payload.status = 'pending';

    if (!payload.title || !payload.description)
      return NextResponse.json(
        { message: 'Judul dan deskripsi laporan wajib diisi' },
        { status: 400 }
      );

    const { error } = await supabase.from('reports').insert(payload);

    if (error) {
      console.log('[LOG] Error inserting report:', error.message);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Berhasil mengirim laporan' }, { status: 200 });
  } catch (err) {
    console.log('[ERROR] reports:', err.message);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
