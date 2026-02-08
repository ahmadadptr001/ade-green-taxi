'use client';
import Link from 'next/link';
import { useLanguageStore } from '@/store/languageStore';
import { ArrowRight } from 'lucide-react';
import Ballpit from '@/components/ui/Ballpit';

export default function LandingPage() {
  const { language } = useLanguageStore();
  const isEN = language === 'en';

  return (
    <div className="flex px-2 relative overflow-hidden h-screen w-screen items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-gray-100">
      <div className="rounded-lg max-w-lg backdrop-blur-2xl z-30  flex-col items-center justify-center p-10">
        {/* Brand */}
        <img
          src="/text-2.png"
          alt=""
          className="mx-auto w-90 mb-2 object-cover"
          loading='lazy'
        />
        {/* Tagline */}
        <p className="text-xl text-gray-300 mb-10 max-w-xl text-center">
          {isEN
            ? 'Eco‑friendly rides with electric taxis. Affordable, safe, and always available.'
            : 'Perjalanan ramah lingkungan dengan taksi listrik. Hemat biaya, aman, dan selalu tersedia.'}
        </p>

        {/* CTA button */}
        <Link
          href="/beranda"
          className="flex animate-bounce justify-center items-center gap-2 px-8 py-4 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold shadow-lg transition text-lg"
        >
          {isEN ? 'Get Started' : 'Mulai Sekarang'}
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
      <div className="absolute inset-0">
        <Ballpit
          count={50}
          gravity={0}
          friction={1.4}
          wallBounce={1.95}
          followCursor={true}
          colors={['#5227FF', '#79137c', '#126bb0']}
        />
      </div>
    </div>
  );
}
