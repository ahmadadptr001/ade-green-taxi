'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Globe, LifeBuoy, Kanban } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import ID from '../locales/id.json';
import EN from '../locales/en.json';

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
      <header className="fixed top-0 z-100 w-full bg-white/90 backdrop-blur-md border-b border-black/5">
        <div className="mx-auto max-w-screen-xl px-6 h-16 flex items-center justify-between">
          <a href="/beranda">
            <p className='text-2xl font-semibold'>ADE<span className='text-emerald-500'>GREEN</span><sub className='text-sm'>TX</sub></p>
          </a>

          <button
            onClick={() => setOpen((v) => !v)}
            className="p-2 rounded-full hover:bg-black/5 transition"
            aria-label="Toggle Menu"
          >
            {open ? <X size={22} /> : <Kanban size={22} className='transform -rotate-90 rotate-x-180' />}
          </button>
        </div>
      </header>

      {/* SLIDE DOWN MENU */}
      <div
        className={`fixed top-16 left-0 right-0 z-40 bg-white border-b
        transition-transform duration-300 ease-out
        ${open ? 'translate-y-0' : '-translate-y-full'}`}
        style={{ height: '70vh' }}
      >
        <div className="h-full flex flex-col items-center justify-center gap-10">

          {/* MAIN NAV */}
          <nav className="flex flex-col items-center gap-6 text-2xl font-semibold">
            <a onClick={() => setOpen(false)} href="#layanan">
              {t.mainNavbar.service}
            </a>
            <a onClick={() => setOpen(false)} href="#tentang">
              {t.mainNavbar.about}
            </a>
            <a onClick={() => setOpen(false)} href="#fitur">
              {t.mainNavbar.feature}
            </a>
            <a onClick={() => setOpen(false)} href="#faq">
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
              <img src="/icon-playstore.png" className="h-5 w-5" />
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
