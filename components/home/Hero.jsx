'use client';
import Image from 'next/image';
import Cursor from '../Cursor';
import { useLanguageStore } from '@/store/languageStore';
import ID from '../../locales/id.json';
import EN from '../../locales/en.json';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  const { language } = useLanguageStore();
  const t = language === 'en' ? EN : ID;

  return (
    <main className="relative w-full h-screen p-5">
      <video
        poster="/bg.png"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover brightness-90 contrast-105"
      >
        <source src='/bg.mp4' type='video/mp4'/>
      </video>
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-black/30"></div>

      <div className="relative z-10 flex flex-col md:pt-25 items-center justify-center text-start gap-y-7 p-3 text-white h-full">
        <p
          data-aos="fade-right"
          data-aos-duration="1500"
          className="md:max-w-4xl font-extrabold leading-tight text-4xl md:text-6xl"
        >
          {t?.textOpeningTitle}
        </p>
        <p
          data-aos="fade-right"
          data-aos-duration="1500"
          className="w-full md:max-w-4xl font-normal text-lg md:text-2xl text-white/85"
        >
          {t?.textOpeningDesc}
        </p>

        <div className="flex flex-wrap items-center gap-4 mt-12 w-full md:max-w-4xl">
          <a
            href="/"
            data-aos="zoom-out"
            data-aos-duration="500"
            className="px-8 py-4 bg-white/10 text-lg cursor-pointer hover:scale-105 flex items-center gap-2 rounded-lg backdrop-blur-md border border-white/30 text-white transition-transform shadow-lg"
          >
            <img src="/icon-playstore.png" className="w-6 h-6 object-cover" />
            <span>{t?.semiNavbar.buttonInstall}</span>
          </a>
        </div>
      </div>

      <Cursor />
    </main>
  );
}
