'use client';
import React from 'react';
import { ArrowLeft, Home, Search } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import Link from 'next/link';

export default function NotFoundPage() {
  const { language } = useLanguageStore();
  const isEN = language === 'en';

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-zinc-50 text-zinc-800 selection:bg-emerald-100 selection:text-emerald-900">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-emerald-50/50 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-20 brightness-100 contrast-150"
          style={{
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%221%22/%3E%3C/svg%3E')",
          }}
        ></div>
      </div>

      <div className="relative z-10 flex max-w-md flex-col items-center px-6 text-center">
        <div className="mb-8 flex items-center gap-2 rounded-full border border-emerald-100 bg-white/80 px-4 py-1.5 shadow-sm backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
          </span>
          <span className="font-mono text-xs font-medium tracking-widest text-zinc-500">
            ERROR 404
          </span>
        </div>

        <h1 className="mb-3 text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
          {isEN ? 'Page Not Found' : 'Halaman Tidak Ditemukan'}
        </h1>

        <p className="mb-10 max-w-xs text-sm leading-relaxed text-zinc-500 md:text-base">
          {isEN
            ? "We couldn't find the page you're looking for. It might have been removed or renamed."
            : 'Kami tidak dapat menemukan halaman yang Anda cari. Mungkin telah dihapus atau dipindahkan.'}
        </p>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/beranda"
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-zinc-200/50 transition-all hover:bg-emerald-900 hover:shadow-emerald-200/50 hover:-translate-y-0.5"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            <span>{isEN ? 'Return Home' : 'Kembali ke Beranda'}</span>
          </Link>

          <button
            className="group inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-medium text-zinc-600 transition-all hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900"
            onClick={() => window.history.back()}
          >
            <span>{isEN ? 'Go Back' : 'Halaman Sebelumnya'}</span>
          </button>
        </div>

        <div className="mt-16 flex items-center gap-2 opacity-40 mix-blend-multiply">
          <div className="h-px w-8 bg-zinc-400"></div>
          <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-500">
            ADE GREEN TX
          </span>
          <div className="h-px w-8 bg-zinc-400"></div>
        </div>
      </div>
    </div>
  );
}
