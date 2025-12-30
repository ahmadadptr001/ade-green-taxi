'use client';
import Link from 'next/link';
import { useLanguageStore } from '@/store/languageStore';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  const { language } = useLanguageStore();
  const isEN = language === 'en';

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-gray-100">
      {/* Illustration */}
      <div className="relative mb-8">
        <div className="text-9xl font-extrabold text-green-500 drop-shadow-lg animate-bounce">
          404
        </div>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-400">
        {isEN ? 'Page Not Found' : 'Halaman Tidak Ditemukan'}
      </h1>

      {/* Description */}
      <p className="text-lg text-gray-300 max-w-md text-center mb-8">
        {isEN
          ? 'Oops! The page you are looking for does not exist or has been moved.'
          : 'Ups! Halaman yang Anda cari tidak ada atau telah dipindahkan.'}
      </p>

      {/* CTA button */}
      <Link
        href="/beranda"
        className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-800 hover:bg-green-500 text-white font-semibold shadow-lg transition"
      >
        <Home className="w-5 h-5" />
        {isEN ? 'Back to Home' : 'Kembali ke Beranda'}
      </Link>
    </div>
  );
}
