'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import ID from '../locales/id.json';
import EN from '../locales/en.json';

export default function Header() {
  const [open, setOpen] = useState(false);
  const { language, setLanguage } = useLanguageStore();
  const t = language === 'id' ? ID : EN;

  // lock scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'auto';
  }, [open]);

  return (
    <>
      {/* HEADER BAR */}
      <header className="fixed top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-black/5">
        <div className="mx-auto max-w-screen-xl px-6 h-16 flex items-center justify-between">
          <a href="/beranda">
            <img src="/text-2.png" alt="Ade Green Taxi" className="h-7" />
          </a>

          <button
            onClick={() => setOpen((v) => !v)}
            className="p-2 rounded-full hover:bg-black/5 transition"
            aria-label="Toggle Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
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
          {/* NAV */}
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
