'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const language = 'id'; 
  const isEN = language === 'en';

  const handleNavigateHome = (e) => {
    e.preventDefault();
    console.log("Navigasi ke /beranda");
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white font-sans text-neutral-900 selection:bg-emerald-50 selection:text-emerald-900">
      
      <div className="relative z-10 flex w-full max-w-lg flex-col items-center px-8 text-center">
        
        <div className="mb-12 flex items-center gap-3">
          <div className="h-px w-6 bg-emerald-200" />
          <span className="font-mono text-[10px] font-bold tracking-[0.3em] text-emerald-600/60 uppercase">
            Error Code 404
          </span>
          <div className="h-px w-6 bg-emerald-200" />
        </div>

        <h1 className="mb-6 text-4xl font-light tracking-tight text-neutral-900 md:text-5xl">
          {isEN ? 'Lost in Nature' : 'Halaman Tak Ditemukan'}
        </h1>

        {/* Tombol Aksi: Minimalis & Fungsional */}
        <div className="flex w-full mt-7 flex-col items-center gap-6">
          <a
            href="/beranda"
            onClick={handleNavigateHome}
            className="group flex items-center gap-3 text-xs font-bold tracking-widest text-neutral-800 uppercase transition-colors hover:text-emerald-700"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            <span>{isEN ? 'Return Home' : 'Kembali ke Beranda'}</span>
          </a>

          <button
            onClick={() => window.history.back()}
            className="text-[10px] font-medium tracking-widest text-neutral-300 uppercase transition-colors hover:text-neutral-500"
          >
            {isEN ? 'Go Back' : 'Halaman Sebelumnya'}
          </button>
        </div>

        {/* Branding: Tanda Tangan Minimalis */}
        <div className="mt-24">
          <span className="text-[10px] font-bold tracking-[0.4em] text-neutral-200 uppercase">
            Ade Green TX
          </span>
        </div>
      </div>
    </div>
  );
}