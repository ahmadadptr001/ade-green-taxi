'use client';
import React, { useState } from 'react';
import { Megaphone, Save, Trash2, Info, Sparkles, Send } from 'lucide-react';
import { supabase_coolify } from '@/config/supabase';
import Swal from 'sweetalert2';

export default function HighlightPage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!message) return alert('Pesan tidak boleh kosong!');
    setLoading(true);

    const { error } = await supabase_coolify
      .from('highlight')
      .upsert({ id: 1, text: message });

    setLoading(false);
    Swal.fire({
      icon: 'success',
      title: 'Pesan Highlight berhasil dipublikasikan!',
      // Modernizing SweetAlert popup to match the theme
      customClass: {
        popup: 'rounded-3xl border border-slate-100 shadow-2xl',
        confirmButton: 'bg-indigo-600 rounded-xl px-6 py-3 font-medium shadow-lg shadow-indigo-200'
      },
      buttonsStyling: false
    });
    setMessage('');
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/40 p-4 md:p-8">
      {/* Container Full Width tapi tetap aesthetic */}
      <div className="w-full bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden relative">
        
        {/* Background Gradients (Subtle Decor) */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative p-6 md:p-10 space-y-8">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-slate-100 pb-8">
            <div className="flex gap-6">
              <div className="relative group shrink-0">
                <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 rounded-full group-hover:opacity-30 transition-opacity"></div>
                <div className="relative w-16 h-16 flex items-center justify-center bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-100 shadow-sm text-indigo-600">
                  <Megaphone size={32} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-500" />
                </div>
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  Broadcaster
                </h1>
                <p className="text-slate-500 text-lg font-light">
                  Kelola teks berjalan (Running Text) untuk halaman depan.
                </p>
              </div>
            </div>

            {/* Status Indicator (Optional Visual) */}
            <div className="hidden md:flex flex-col items-end">
               <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Status Sistem</span>
               <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-sm font-medium border border-emerald-100">
                 <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                 Online
               </div>
            </div>
          </div>

          {/* Main Input Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Input */}
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 ml-1">
                  <Sparkles size={16} className="text-indigo-500" />
                  Konten Pesan
                </label>
                
                <div className="relative group">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tulis pengumuman penting di sini..."
                    className="w-full h-64 p-6 text-lg text-slate-700 bg-slate-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all duration-300 resize-none shadow-inner placeholder:text-slate-400"
                  />
                  {/* Character Counter */}
                  <div className="absolute bottom-4 right-4 text-xs font-medium text-slate-400 bg-white/60 backdrop-blur px-2 py-1 rounded-md border border-slate-100">
                    {message.length} chars
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Info & Actions */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Modern Info Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100/60 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-100 rounded-full blur-2xl opacity-50"></div>
                <div className="relative z-10 flex flex-col gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-white rounded-xl text-amber-500 shadow-sm mb-1">
                    <Info size={20} />
                  </div>
                  <h3 className="font-bold text-amber-900">Information</h3>
                  <p className="text-sm text-amber-800/80 leading-relaxed">
                    Teks yang Anda masukkan akan langsung ditayangkan pada baris utama (headline) running text website. Pastikan ejaan sudah benar.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-auto space-y-3">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full group relative overflow-hidden px-6 py-4 flex items-center justify-center gap-3 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-semibold shadow-xl shadow-slate-200 hover:shadow-indigo-200 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                  {loading ? (
                    <span className="flex items-center gap-2">
                       <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                       Publishing...
                    </span>
                  ) : (
                    <>
                      <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                      <span>Publikasikan</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setMessage('')}
                  className="w-full px-6 py-3 flex items-center justify-center gap-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors duration-200"
                >
                  <Trash2 size={18} />
                  Bersihkan
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}