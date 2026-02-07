'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, Leaf } from 'lucide-react';

export default function LoadingScreen() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/beranda');
    }, 2000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100">
      
      {/* Logo */}
      <Leaf className="h-14 w-14 text-green-600 mb-6" />

      {/* Brand */}
      <h1 className="text-3xl font-bold tracking-wide text-green-700">
        Ade Green TX
      </h1>

      {/* Description */}
      <p className="mt-2 text-base text-gray-600 text-center">
        Aplikasi pemesanan lokasi dengan pengemudi ramah lingkungan 
        untuk mobilitas harian di Kota Kendari.
      </p>

      {/* Spinner */}
      <Loader2 className="mt-8 h-8 w-8 animate-spin text-green-500" />

      {/* Micro UX */}
      <span className="mt-3 text-sm text-gray-500">
        Menyiapkan pengalaman terbaik...
      </span>
    </div>
  );
}
