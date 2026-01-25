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
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="flex flex-col items-center gap-6 text-center">

        {/* Logo */}
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-600 shadow-xl shadow-green-200">
          <Leaf className="h-8 w-8 text-white" />
        </div>

        {/* Brand */}
        <h1 className="text-2xl font-semibold text-green-700">
          Green App
        </h1>

        {/* Description */}
        <p className="text-sm text-green-600">
          Preparing your experience
        </p>

        {/* Spinner */}
        <Loader2 className="h-7 w-7 animate-spin text-green-500" />

        {/* Micro UX */}
        <span className="text-xs text-green-500/70">
          Please wait a moment
        </span>
      </div>
    </div>
  );
}
