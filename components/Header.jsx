'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Globe, LifeBuoy, Kanban, Search } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import ID from '../locales/id.json';
import EN from '../locales/en.json';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import Link from 'next/link';

export default function Header() {
  const [open, setOpen] = useState(false);
  const { language, setLanguage } = useLanguageStore();
  const t = language === 'id' ? ID : EN;

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'auto';
  }, [open]);

  return (
    <>
      {/* HEADER BAR */}
      <header className="fixed py-2 top-0 z-100 w-full bg-white/100  border-b border-black/5">
        <div className="mx-auto max-w-screen-xl px-6 h-16 flex items-center justify-between">
          <a href="/beranda">
            <p className="text-2xl font-black">
              ADE<span className="text-emerald-500">GREEN</span>
              <sub className="text-sm">TX</sub>
            </p>
          </a>

          {/* navbar center */}
          <nav className="w-full flex px-4 items-center justify-between gap-4">
            <div className="group flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2 border border-transparent transition-all duration-800 ease-in-out focus-within:w-[400px] focus-within:bg-white focus-within:border-emerald-500 w-[44px] hover:w-[400px] hover:bg-white hover:border-emerald-500 w-[44px] overflow-hidden cursor-text">
              {/* Ikon Search (shrink-0 agar tidak gepeng saat animasi) */}
              <Search
                size={20}
                className="text-gray-500 group-hover:text-emerald-500 group-focus-within:text-emerald-500 shrink-0"
              />

              <input
                type="text"
                placeholder={language === 'id' ? 'Cari...' : 'Search...'}
                className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
              />
            </div>

            {/* MENU LAINNYA */}
            <ul className="uppercase font-semibold flex items-center justify-end w-full">
              <li className="p-4 py-2 rounded-md cursor-pointer">
                <Link href={'/perusahaan'} className='hover:underline hover:text-emerald-500 underline-offset-4'>{language === 'id' ? 'Perusaahan' : 'Company'}</Link>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {/* Hamburger */}
            <button
              onClick={() => setOpen((v) => !v)}
              className="p-2 rounded-full hover:bg-black/5 transition"
              aria-label="Toggle Menu"
            >
              {open ? (
                <X size={22} />
              ) : (
                <Kanban size={22} className="-rotate-90" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* SLIDE DOWN MENU */}
      <div
        className={`fixed top-16 left-0 right-0 z-40 bg-white border-b
      transition-transform h-[70vh] md:h-[90vh] py-6 duration-300 ease-out
        ${open ? 'translate-y-0' : '-translate-y-[150%]'}`}
      >
        <div className="h-full overflow-auto flex flex-col items-center md:justify-center  gap-5 md:gap-10">
          {/* MAIN NAV */}
          <nav className="flex flex-col items-center gap-6 text-2xl font-semibold">
            <a onClick={() => setOpen(false)} href="/beranda#layanan">
              {t.mainNavbar.service}
            </a>

            <a onClick={() => setOpen(false)} href="/berita">
              Blog
            </a>

            <a onClick={() => setOpen(false)} href="/beranda#tentang">
              {t.mainNavbar.about}
            </a>
            <a onClick={() => setOpen(false)} href="/beranda#fitur">
              {t.mainNavbar.feature}
            </a>
            <a onClick={() => setOpen(false)} href="/beranda#faq">
              {t.mainNavbar.faq}
            </a>
          </nav>

          {/* DIVIDER */}
          <div className="w-24 h-px bg-black/10" />

          {/* SUPPORT / HELP (SEPARATE) */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-xs uppercase tracking-wider text-gray-400">
              {language === 'id' ? 'Butuh Bantuan?' : 'Need Help?'}
            </span>

            <a
              href="/bantuan"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 text-base font-medium text-gray-700
              hover:text-green-600 transition"
            >
              <LifeBuoy size={18} />
              {language === 'id' ? 'Pusat Bantuan' : 'Help Center'}
            </a>
          </div>

          {/* ACTION */}
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <a
              href="/beranda"
              className="flex items-center justify-center gap-2 py-3 rounded-xl
              bg-green-600 text-white font-semibold"
            >
              <img
                src="/icon-playstore.png"
                alt="playstore icon"
                className="h-5 w-5"
                loading="lazy"
              />
              {t.semiNavbar.buttonInstall}
            </a>

            <button
              onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
              className="flex items-center justify-center gap-2 py-3 rounded-xl border"
            >
              <Globe size={18} />
              {language === 'id' ? 'English' : 'Indonesia'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
