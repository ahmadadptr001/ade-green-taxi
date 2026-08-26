'use client';
import React, { useEffect, useState } from 'react';
import { Megaphone, Trash2, Info, Send } from 'lucide-react';
import Swal from 'sweetalert2';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { updateHighlightMessage } from '@/services/articles';

export default function HighlightPage() {
  const user = useUser();
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user.role !== 'admin' && user.role !== 'super admin') {
      Swal.fire({
        icon: 'warning',
        title: 'Anda tidak memiliki izin untuk mengakses halaman ini!',
      }).then((result) => {
        if (result.isConfirmed) router.replace('/dashboard/berita');
      });
      return;
    }
  }, []);

  const handleSave = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      // Tulis lewat API (server memvalidasi token & role) — client tidak
      // lagi menulis langsung ke database.
      const result = await updateHighlightMessage(message);
      Swal.fire({ icon: 'success', title: result.message });
      setMessage('');
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal mempublikasikan', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-14 md:px-10 md:py-16">
      <header className="mb-10 flex items-center gap-4">
        <Megaphone size={26} strokeWidth={1.75} className="text-slate-400" />
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900">
            Pesan Highlight
          </h1>
          <p className="mt-1 text-slate-500">
            Teks berjalan (running text) untuk halaman depan.
          </p>
        </div>
      </header>

      <div className="rounded-xl border border-slate-200 bg-white p-6 md:p-8">
        <label className="text-sm font-medium text-slate-600">Konten Pesan</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tulis pengumuman penting di sini..."
          className="mt-2 h-44 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
        />
        <div className="mt-1.5 text-right text-xs text-slate-400">{message.length} karakter</div>

        <div className="mt-4 flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
          <Info size={16} className="mt-0.5 shrink-0 text-slate-400" />
          <p className="leading-relaxed">
            Teks ini langsung tayang pada baris utama running text website. Pastikan ejaan sudah benar.
          </p>
        </div>

        <div className="mt-8 flex items-center justify-end gap-4">
          <button
            onClick={() => setMessage('')}
            className="text-sm font-medium text-slate-500 transition-colors hover:text-red-600"
          >
            <span className="inline-flex items-center gap-1.5">
              <Trash2 size={15} /> Bersihkan
            </span>
          </button>
          <button
            onClick={handleSave}
            disabled={loading || !message.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Publishing...
              </>
            ) : (
              <>
                <Send size={16} /> Publikasikan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
