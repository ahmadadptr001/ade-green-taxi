'use client';

import { useLanguageStore } from '@/store/languageStore';

export default function Marquee() {
  const { language } = useLanguageStore();
  const en = language === 'en';

  const words = en
    ? ['Electric Taxi', 'Zero Emission', 'Kendari', '24/7', 'Quiet Rides', 'Cleaner City']
    : ['Taksi Listrik', 'Nol Emisi', 'Kendari', '24/7', 'Perjalanan Senyap', 'Kota Bersih'];

  // Duplicated track for a seamless -50% loop.
  const track = [...words, ...words];

  return (
    <section className="relative overflow-hidden border-y border-slate-200 bg-white py-4">
      <div className="flex w-max animate-marquee-loop items-center gap-8 whitespace-nowrap will-change-transform">
        {track.map((w, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="text-sm font-medium tracking-wide text-slate-500 sm:text-base">
              {w}
            </span>
            <span className="inline-block h-1.5 w-1.5 rotate-45 bg-emerald-500/70" />
          </span>
        ))}
      </div>
    </section>
  );
}
