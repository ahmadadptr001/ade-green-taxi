'use client';

import { useEffect, useState } from 'react';
import {
  X,
  Youtube,
  Zap,
  Clock,
  Banknote,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';

export default function IklanModal() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowModal(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!showModal) return null;

  return (
    <main className="fixed inset-0 z-[300] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setShowModal(false)}
      />

      {/* Modal */}
      <div
        data-aos="zoom-in"
        data-aos-duration="400"
        className="relative mx-5 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* HERO IMAGE */}
        <div className="relative w-full h-[500px]">
          <img
            src="/banner.png"
            alt="Ade Green Taxi App"
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {/* Close */}
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-gray-700 hover:text-red-500 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6">

          {/* Value statement */}
          <div className="flex items-center gap-3 text-sm text-gray-600 pt-1">
            <Smartphone className="w-4 h-4 text-gray-400" />
            <span>
              Pesan perjalanan langsung dari aplikasi, tanpa proses rumit.
            </span>
          </div>

          {/* CTA */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <a
              href="/"
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
            >
              <img
                src="/icon-playstore.png"
                className="w-5 h-5"
                loading="lazy"
              />
              Download App
            </a>

            <a
              href="/"
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition"
            >
              <Youtube size={18} />
              Lihat Cara Daftar
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
