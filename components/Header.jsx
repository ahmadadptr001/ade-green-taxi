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
  Building2,
  Plus, // Icon trigger utama
  MessageSquare,
  Mail, // Contoh menu lain yang akan ditambahkan nanti
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
import Link from 'next/link';

export default function Header() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  
  // STATE BARU: Untuk buka/tutup container bottom left
  const [fabOpen, setFabOpen] = useState(false);
  
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

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = open || searchOpen ? 'hidden' : 'auto';
  }, [open, searchOpen]);

  const handleSubmitSearch = async (e) => {
    e.preventDefault();
    if (!searchInputRef.current?.value) return;
    const query = searchInputRef.current.value;
    localStorage.setItem('query-search', query)
    window.location.href = '/beranda/pencarian'
  };

  return (
    <>
      {/* HEADER BAR */}
      <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 bg-white backdrop-blur-md border-b border-slate-200/60`}>
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
            {/* DESKTOP COMPANY DROPDOWN */}
            <div className="hidden md:block mr-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-slate-600 hover:text-emerald-600 rounded-md transition-colors outline-none">
                    {language === 'id' ? 'Perusahaan' : 'Company'}
                    <ChevronDown size={14} className="opacity-70" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 animate-in fade-in zoom-in-95">
                  <DropdownMenuArrow className="fill-white" />
                  {perusahaanItems.map((item) => (
                    <DropdownMenuItem key={item.id} asChild>
                      <a href={item.url} className="flex w-full items-center gap-2 cursor-pointer text-slate-700 hover:text-emerald-600 hover:bg-emerald-50">
                        <item.icon className="h-4 w-4 opacity-70" />
                        <span>{item.name}</span>
                      </a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* SEARCH TRIGGER */}
            <button
              onClick={() => { setSearchOpen(!searchOpen); setOpen(false); }}
              className={`p-2.5 rounded-full transition-all duration-200 ${searchOpen ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <Search size={20} strokeWidth={2} />
            </button>

            <button
              onClick={() => { setOpen(!open); setSearchOpen(false); }}
              className="p-2.5 rounded-full text-slate-600 hover:bg-slate-100 ml-1"
            >
              {open ? <X size={22} /> : <MenuIcon size={22} />}
            </button>
          </nav>
        </div>

        {/* --- SEARCH OVERLAY --- */}
        <div className={`absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl transition-all duration-300 ${searchOpen ? 'opacity-100 max-h-[160px]' : 'opacity-0 max-h-0 pointer-events-none'}`}>
          <div className="max-w-screen-xl mx-auto px-4 py-6">
            <form onSubmit={handleSubmitSearch} className="relative flex items-center w-full">
              <Search className="absolute left-0 text-slate-400" size={24} />
              <input ref={searchInputRef} type="text" placeholder={isID ? 'Ketik kata kunci...' : 'Search...'} className="w-full pl-10 pr-12 py-2 text-xl font-medium focus:outline-none bg-transparent" />
              <button type="button" onClick={() => setSearchOpen(false)} className="p-2 text-slate-400"><X size={20} /></button>
            </form>
          </div>
        </div>
      </header>

      {/* --- FIXED BOTTOM LEFT CONTAINER (MOBILE/TABLET) --- */}
      <div className="md:hidden fixed bottom-6 left-6 z-[40] flex flex-col-reverse items-start gap-3">
        
        {/* Tombol Utama (Trigger) */}
        <button 
          onClick={() => setFabOpen(!fabOpen)}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 active:scale-90 ${
            fabOpen ? 'bg-slate-900 rotate-45' : 'bg-emerald-600'
          } text-white`}
        >
          <Plus size={28} />
        </button>

        {/* Child Menus (Muncul ke atas kalau fabOpen true) */}
        <div className={`flex flex-col items-start gap-3 transition-all duration-300 origin-bottom ${
          fabOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-10 pointer-events-none'
        }`}>
          
          {/* Menu Perusahaan */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 bg-white border border-slate-200 pl-3 pr-4 py-2.5 rounded-xl shadow-lg text-slate-700 font-bold active:bg-slate-50">
                <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                  <Building2 size={18} />
                </div>
                <span className="text-sm">{isID ? 'Perusahaan' : 'Company'}</span>
                <ChevronDown size={14} className="opacity-40" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" sideOffset={12} className="w-48 p-2 bg-slate-900 text-white rounded-xl border-none shadow-2xl z-60">
              {perusahaanItems.map((item) => (
                <DropdownMenuItem key={item.id} asChild>
                  <a href={item.url} className="flex items-center gap-2 p-2 focus:text-white focus:bg-white/10 rounded-lg cursor-pointer">
                    <item.icon size={16} className="text-emerald-400" />
                    <span className="text-sm">{item.name}</span>
                  </a>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* menu lainnya  */}
          <Link href={'mailto:support@adegreentx.id'} className="flex items-center gap-3 bg-white border border-slate-200 pl-3 pr-4 py-2.5 rounded-xl shadow-lg text-slate-700 font-bold active:bg-slate-50">
            <div className="w-8 h-8 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center">
              <Mail size={18} />
            </div>
            <span className="text-sm">{isID ? 'Hubungi' : 'Contact'}</span>
          </Link>

        </div>
      </div>

      {/* BACKDROP TIPIS */}
      {fabOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/10 backdrop-blur-[2px] z-[30] md:hidden"
          onClick={() => setFabOpen(false)}
        />
      )}

      {/* MOBILE FULL SCREEN MENU (HAMBURGER) */}
      <div className={`fixed inset-0 z-40 bg-white transition-transform duration-500 ${open ? 'translate-y-0' : '-translate-y-full'}`} style={{ paddingTop: '80px' }}>
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
                <a key={idx} onClick={() => setOpen(false)} href={link.href} className="text-2xl font-bold text-slate-800 hover:text-emerald-600">
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex flex-col items-center gap-4 w-full">
              <a href="/bantuan" className="flex items-center gap-2 text-slate-600 font-medium"><LifeBuoy size={18} /> {isID ? 'Pusat Bantuan' : 'Help Center'}</a>
              <button onClick={() => setLanguage(language === 'id' ? 'en' : 'id')} className="flex items-center justify-center gap-2 px-6 py-2 rounded-full border border-slate-200 text-slate-600 text-sm font-medium">
                <Globe size={16} /> {language === 'id' ? 'English' : 'Indonesia'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}