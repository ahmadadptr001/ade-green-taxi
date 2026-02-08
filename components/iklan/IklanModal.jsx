'use client';

import { useEffect, useState } from 'react';
import { X, Youtube, Smartphone, Leaf } from 'lucide-react';

export default function IklanModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 2500);
    return () => clearTimeout(t);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 px-4 sm:px-6">
      <div
        className="
        relative w-full 
        max-w-xl sm:max-w-2xl lg:max-w-5xl
        bg-white rounded-3xl shadow-2xl overflow-hidden
        flex flex-col lg:grid lg:grid-cols-2
      "
      >
        {/* IMAGE */}
        <div
          className="
          relative w-full 
          aspect-[4/3] sm:aspect-[16/9] 
          lg:aspect-auto lg:h-full
        "
        >
          <img
            src="/banner.png"
            alt="Ade Green TX"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />

          {/* Close */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-gray-700 hover:text-red-600 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <div
          className="
          flex flex-col justify-center gap-6
          p-5 sm:p-7 lg:p-10
        "
        >
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-green-600 flex items-center justify-center">
              <Leaf className="text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              Ade Green TX
            </h1>
          </div>

          {/* Desc */}
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Transportasi ramah lingkungan dengan pemesanan cepat, aman, dan
            transparan langsung dari aplikasi.
          </p>

          {/* Feature */}
          <div className="flex items-center gap-3 text-gray-600 text-sm sm:text-base">
            <Smartphone size={18} className="text-green-600" />
            Pesan perjalanan tanpa ribet, cukup beberapa tap.
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <a
              href="/"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl 
                         bg-green-600 text-white font-semibold 
                         hover:bg-green-700 active:scale-[0.98] transition"
            >
              <img
                src="/icon-playstore.png"
                alt="playstore icon"
                className="h-5 w-5"
                loading="lazy"
              />
              Download App
            </a>

            <a
              href="/"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl 
                         bg-red-600 text-white font-semibold 
                         hover:bg-red-700 active:scale-[0.98] transition"
            >
              <Youtube size={18} />
              Lihat Cara Daftar
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
