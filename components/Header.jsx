'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  Globe,
  LifeBuoy,
  Search,
  MenuIcon,
  InfoIcon,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import ID from '../locales/id.json';
import EN from '../locales/en.json';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { DropdownMenuArrow } from '@radix-ui/react-dropdown-menu';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  const { language, setLanguage } = useLanguageStore();
  const t = language === 'id' ? ID : EN;
  const isID = language === 'id';

  const perusahaanItems = [
    {
      id: 1,
      name: isID ? 'Tentang' : 'About Us',
      url: '/beranda/tentang',
      icon: InfoIcon,
    },
  ];

  // Auto-focus input saat search dibuka
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [searchOpen]);

  // Prevent scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open || searchOpen ? 'hidden' : 'auto';
  }, [open, searchOpen]);

  const handleSubmitSearch = async (e) => {
    e.preventDefault();
    if (!searchInputRef.current?.value) return;

    const query = searchInputRef.current.value;
    localStorage.setItem('query-search', query)
    router.push('/beranda/pencarian')
  };

  return (
    <>
      {/* HEADER BAR */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 bg-white backdrop-blur-md border-b border-slate-200/60`}
      >
        <div className="relative mx-auto max-w-screen-xl px-4 sm:px-6 h-16 flex items-center justify-between z-50 bg-transparent">
          {/* LOGO */}
          <a href="/beranda" className="flex-shrink-0">
            <p className="text-2xl font-black tracking-tight text-slate-900">
              ADE<span className="text-emerald-600">GREEN</span>
              <sub className="text-xs font-bold text-slate-500 ml-0.5">TX</sub>
            </p>
          </a>

          {/* NAVBAR RIGHT SIDE */}
          <nav className="flex items-center gap-1 sm:gap-2 ml-auto">
            {/* COMPANY DROPDOWN (Hidden on mobile) */}
            <div className="hidden md:block mr-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-slate-600 hover:text-emerald-600 rounded-md transition-colors outline-none">
                    {language === 'id' ? 'Perusahaan' : 'Company'}
                    <ChevronDown size={14} className="opacity-70" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 animate-in fade-in zoom-in-95"
                >
                  <DropdownMenuArrow className="fill-white" />
                  {perusahaanItems.map((item) => (
                    <DropdownMenuItem key={item.id} asChild>
                      <a
                        href={item.url}
                        className="flex w-full items-center gap-2 cursor-pointer text-slate-700 hover:text-emerald-600 hover:bg-emerald-50"
                      >
                        <item.icon className="h-4 w-4 opacity-70" />
                        <span>{item.name}</span>
                      </a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* SEARCH TRIGGER BUTTON (NEW) */}
            <button
              onClick={() => {
                setSearchOpen(!searchOpen);
                setOpen(false); // Close mobile menu if open
              }}
              className={`p-2.5 rounded-full transition-all duration-200 focus:outline-none ${
                searchOpen
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
              aria-label="Search"
            >
              <Search size={20} strokeWidth={2} />
            </button>

            {/* HAMBURGER TOGGLE */}
            <button
              onClick={() => {
                setOpen(!open);
                setSearchOpen(false); // Close search if open
              }}
              className="p-2.5 rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors focus:outline-none ml-1"
              aria-label="Toggle Menu"
            >
              {open ? <X size={22} /> : <MenuIcon size={22} />}
            </button>
          </nav>
        </div>

        {/* --- FULL WIDTH SEARCH BAR OVERLAY --- */}
        <div
          className={`absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl overflow-hidden transition-all duration-300 ease-in-out origin-top ${
            searchOpen
              ? 'opacity-100 translate-y-0 max-h-[160px]'
              : 'opacity-0 -translate-y-4 max-h-0 pointer-events-none'
          }`}
        >
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
            <form
              onSubmit={handleSubmitSearch}
              className="relative flex items-center w-full"
            >
              <Search
                className="absolute left-0 text-slate-400 pointer-events-none"
                size={24}
              />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={
                  language === 'id'
                    ? 'Ketik kata kunci pencarian...'
                    : 'Type to search...'
                }
                className="w-full pl-10 pr-12 py-2 text-xl md:text-2xl font-medium text-slate-800 placeholder-slate-300 bg-transparent border-none focus:outline-none focus:ring-0"
              />
              {/* Close / Submit Action */}
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="hidden sm:flex items-center gap-1 px-4 py-1.5 bg-emerald-600 text-white rounded-full text-sm font-medium hover:bg-emerald-700 transition"
                >
                  {isID ? 'Cari' : 'Go'}
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                >
                  <X size={20} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </header>

      {/* BACKDROP FOR SEARCH (Optional: darkens the page when search is open) */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] transition-opacity duration-300"
          onClick={() => setSearchOpen(false)}
          style={{ top: '64px' }} // Start below header
        />
      )}

      <div
        className={`fixed inset-0 z-40 bg-white transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) ${
          open ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{ top: '0', paddingTop: '80px' }}
      >
        <div className="flex flex-col h-full w-full pb-10 px-6 overflow-y-auto">
          <div className="flex flex-col items-center justify-between h-full max-w-md mx-auto w-full gap-8">
            <nav className="flex flex-col items-center gap-6 w-full text-center">
              {[
                { label: t.mainNavbar.service, href: '/beranda#layanan' },
                { label: 'Blog', href: '/berita' },
                { label: t.mainNavbar.about, href: '/beranda#tentang' },
                { label: t.mainNavbar.feature, href: '/beranda#fitur' },
                { label: t.mainNavbar.faq, href: '/beranda#faq' },
              ].map((link, idx) => (
                <a
                  key={idx}
                  onClick={() => setOpen(false)}
                  href={link.href}
                  className="text-2xl font-bold text-slate-800 hover:text-emerald-600 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="w-16 h-px bg-slate-200" />

            <div className="flex flex-col items-center gap-4 w-full">
              <a
                href="/bantuan"
                className="flex items-center gap-2 text-slate-600 font-medium"
              >
                <LifeBuoy size={18} /> {isID ? 'Pusat Bantuan' : 'Help Center'}
              </a>
              <button
                onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
                className="flex items-center justify-center gap-2 px-6 py-2 rounded-full border border-slate-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-600 transition-all text-sm font-medium"
              >
                <Globe size={16} />
                {language === 'id' ? 'English' : 'Indonesia'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
