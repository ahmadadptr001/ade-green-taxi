'use client';
import Link from 'next/link';
import { useLanguageStore } from '@/store/languageStore';
import { ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const { language } = useLanguageStore();
  const isEN = language === 'en';

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 text-gray-800">
      {/* soft background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-green-200/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />
      </div>

      <div className="flex max-w-lg flex-col items-center text-center px-6">
        {/* 404 */}
        <h1 className="text-[8rem] font-extrabold leading-none tracking-tight text-green-600">
          404
        </h1>

        {/* title */}
        <h2 className="mt-4 text-3xl font-semibold">
          {isEN ? 'Page Not Found' : 'Halaman Tidak Ditemukan'}
        </h2>

        {/* description */}
        <p className="mt-4 text-gray-600">
          {isEN
            ? 'The page you are trying to access does not exist or may have been moved.'
            : 'Halaman yang Anda tuju tidak tersedia atau mungkin telah dipindahkan.'}
        </p>

        {/* divider */}
        <div className="my-8 h-px w-24 bg-gradient-to-r from-transparent via-green-400 to-transparent" />

        {/* action */}
        <Link
          href="/beranda"
          className="inline-flex items-center gap-2 rounded-full border border-green-600 px-6 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-600 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {isEN ? 'Back to Home' : 'Kembali ke Beranda'}
        </Link>

        {/* brand hint */}
        <span className="mt-10 text-xs text-gray-400">
          © ADE Green Taxi
        </span>
      </div>
    </div>
  );
}
