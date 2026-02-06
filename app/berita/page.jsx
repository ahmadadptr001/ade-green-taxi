'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Menu, 
  Bell, 
  ChevronRight, 
  Clock, 
  TrendingUp, 
  ArrowUpRight, 
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  PlayCircle,
  X,
  User,
  ChevronDown,
  Globe
} from 'lucide-react';

// --- MOCK DATA ---
const CATEGORIES = ["Semua", "Teknologi", "Bisnis", "Green Energy", "Desain", "Life"];

const ALL_NEWS = [
  {
    id: 1,
    title: "Masa Depan Energi Hijau: Transformasi Kota Pintar di Indonesia",
    excerpt: "Bagaimana integrasi panel surya dan AI mengubah lanskap arsitektur perkotaan Jakarta menuju net-zero emission.",
    category: "Green Energy",
    author: "Sarah Wijaya",
    date: "12 Feb 2024",
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=1000&auto=format&fit=crop",
    featured: true
  },
  {
    id: 2,
    title: "Startup Unicorn Baru Muncul di Sektor Agritech",
    category: "Bisnis",
    date: "11 Feb 2024",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=500&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Revolusi Desain Minimalis dalam Aplikasi Finansial",
    category: "Desain",
    date: "10 Feb 2024",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=500&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "AI Generatif: Ancaman atau Peluang bagi Kreator?",
    excerpt: "Diskusi mendalam mengenai dampak kecerdasan buatan terhadap industri kreatif lokal.",
    category: "Teknologi",
    author: "Budi Santoso",
    date: "10 Feb 2024",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=500&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "Tips Mengelola Keuangan untuk Gen Z",
    excerpt: "Panduan praktis investasi dan menabung di era ketidakpastian ekonomi.",
    category: "Life",
    author: "Rina A.",
    date: "09 Feb 2024",
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=500&auto=format&fit=crop"
  }
];

const NOTIFICATIONS = [
  { id: 1, text: "Berita utama hari ini telah terbit.", time: "2 mnt lalu", unread: true },
  { id: 2, text: "Sarah Wijaya mengomentari artikel Anda.", time: "1 jam lalu", unread: true },
  { id: 3, text: "Update sistem berhasil diselesaikan.", time: "5 jam lalu", unread: false },
];

export default function PremiumNewsPage() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNav, setActiveNav] = useState("Beranda");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredNews = useMemo(() => {
    return ALL_NEWS.filter(item => {
      const matchesCategory = activeCategory === "Semua" || item.category === activeCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      
      <div className="hidden lg:block bg-slate-950 py-2.5 text-[11px] font-medium tracking-widest text-slate-400 uppercase">
        <div className="container mx-auto flex items-center justify-between px-8">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="text-slate-200">Live</span>
            </div>
            <div className="overflow-hidden whitespace-nowrap">
              <div className="animate-marquee inline-block">
                Laporan Khusus: Transisi Energi Terbarukan di Asia Tenggara • Indeks Saham Gabungan Menguat 0.5% • 
              </div>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5"><Globe className="h-3 w-3"/> ID / EN</span>
            <div className="flex gap-4">
              <Facebook className="h-3.5 w-3.5 cursor-pointer hover:text-white transition-colors" />
              <Twitter className="h-3.5 w-3.5 cursor-pointer hover:text-white transition-colors" />
              <Instagram className="h-3.5 w-3.5 cursor-pointer hover:text-white transition-colors" />
            </div>
          </div>
        </div>
      </div>

      <header className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        isScrolled ? 'bg-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl py-3' : 'bg-white border-b border-slate-100 py-5'
      }`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between">
            
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveNav("Beranda")}>
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white transition-transform group-hover:rotate-6">
                <span className="text-xl font-black italic">A</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-black tracking-tighter text-slate-950">ADE<span className="text-emerald-600">GREEN</span></span>
                <span className="text-[10px] font-bold tracking-[0.3em] text-slate-400">BERITA</span>
              </div>
            </div>

            {/* Main Nav - Functional */}
            <nav className="hidden lg:flex items-center gap-10">
              {['Beranda', 'Nasional', 'Internasional', 'Opini'].map((item) => (
                <button 
                  key={item} 
                  onClick={() => setActiveNav(item)}
                  className={`relative text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:text-emerald-600 ${
                    activeNav === item ? 'text-emerald-600' : 'text-slate-500'
                  }`}
                >
                  {item}
                  {activeNav === item && (
                    <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-emerald-600 rounded-full" />
                  )}
                </button>
              ))}
            </nav>

            {/* Header Actions */}
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative hidden md:block group">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari perspektif..." 
                  className="h-10 w-40 rounded-full border border-slate-100 bg-slate-50/50 px-10 text-xs font-medium transition-all focus:w-64 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/5 group-hover:bg-slate-50"
                />
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 group-focus-within:text-emerald-600" />
                {searchQuery && (
                  <X className="absolute right-3.5 top-3 h-4 w-4 text-slate-400 cursor-pointer hover:text-red-500" onClick={() => setSearchQuery("")} />
                )}
              </div>

              {/* Notification & Profile */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button 
                    onClick={() => setIsNotifyOpen(!isNotifyOpen)}
                    className={`rounded-full p-2.5 transition-all ${isNotifyOpen ? 'bg-slate-100 text-emerald-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-2.5 top-2.5 flex h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
                  </button>

                  {/* Notification Dropdown */}
                  {isNotifyOpen && (
                    <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl animate-in fade-in zoom-in duration-200">
                      <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-900">Notifikasi</span>
                        <span className="text-[10px] text-emerald-600 font-bold cursor-pointer hover:underline">Tandai dibaca</span>
                      </div>
                      <div className="max-h-[300px] overflow-y-auto">
                        {NOTIFICATIONS.map(n => (
                          <div key={n.id} className="p-4 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                            <p className={`text-xs ${n.unread ? 'font-bold text-slate-900' : 'text-slate-500'}`}>{n.text}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="h-8 w-[1px] bg-slate-100 mx-1 hidden sm:block"></div>
                
                <button className="hidden sm:flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-slate-200">
                  <User className="h-3.5 w-3.5" />
                  <span>MASUK</span>
                </button>

                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden rounded-xl bg-slate-50 p-2.5 text-slate-900"
                >
                  {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- MOBILE MENU OVERLAY --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden animate-in slide-in-from-top duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="absolute top-0 w-full bg-white p-8 rounded-b-[40px] shadow-2xl">
            <div className="flex flex-col gap-6 text-center">
              {['Beranda', 'Nasional', 'Internasional', 'Opini', 'Teknologi', 'Bisnis'].map((item) => (
                <a key={item} href="#" className="text-2xl font-black text-slate-900 tracking-tighter" onClick={() => setIsMobileMenuOpen(false)}>
                  {item}
                </a>
              ))}
              <hr className="border-slate-100" />
              <div className="flex justify-center gap-8">
                <Facebook className="text-slate-400" />
                <Twitter className="text-slate-400" />
                <Instagram className="text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN LAYOUT --- */}
      <main className="container mx-auto px-4 py-10 lg:px-8">
        
        {/* Featured Hero Grid */}
        {!searchQuery && activeCategory === "Semua" && (
          <section className="mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Primary Feature */}
              <div className="lg:col-span-8 relative group overflow-hidden rounded-[32px] bg-slate-200 aspect-[16/10] lg:aspect-auto">
                <img 
                  src={ALL_NEWS[0].image} 
                  className="absolute inset-0 h-full w-full object-cover transition duration-1000 group-hover:scale-110 group-hover:rotate-1" 
                  alt="Main"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent" />
                <div className="absolute bottom-0 p-10 lg:p-14 w-full">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg">
                      {ALL_NEWS[0].category}
                    </span>
                    <span className="text-white/60 text-xs font-medium">12 Feb 2024</span>
                  </div>
                  <h2 className="text-4xl lg:text-6xl font-black text-white leading-[1.1] tracking-tighter mb-6 transition-transform duration-500 group-hover:-translate-y-2">
                    {ALL_NEWS[0].title}
                  </h2>
                  <div className="flex items-center justify-between">
                    <p className="text-slate-300 text-sm max-w-md line-clamp-2 hidden sm:block">
                      {ALL_NEWS[0].excerpt}
                    </p>
                    <button className="h-14 w-14 rounded-full bg-white flex items-center justify-center text-slate-900 transition-transform group-hover:scale-110 shadow-xl">
                      <ArrowUpRight className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Side Features */}
              <div className="lg:col-span-4 flex flex-col gap-8">
                {[ALL_NEWS[1], ALL_NEWS[2]].map(item => (
                  <div key={item.id} className="group relative flex-1 rounded-[32px] bg-white border border-slate-100 p-6 transition-all hover:shadow-2xl hover:shadow-slate-200/50 flex flex-col justify-between overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-100">
                      <TrendingUp className="h-20 w-20 text-emerald-600 -mr-4 -mt-4" />
                    </div>
                    <div className="relative">
                      <span className="text-emerald-600 text-[10px] font-black uppercase tracking-widest">{item.category}</span>
                      <h3 className="text-2xl font-bold tracking-tight text-slate-900 mt-3 leading-snug group-hover:text-emerald-700 transition-colors">
                        {item.title}
                      </h3>
                    </div>
                    <div className="mt-8 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400">{item.date}</span>
                      <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* --- CATEGORY & CONTENT --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          <div className="lg:col-span-8">
            {/* Category Filter */}
            <div className="flex items-center justify-between mb-12 overflow-x-auto no-scrollbar pb-2">
              <div className="flex gap-4">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      activeCategory === cat 
                      ? 'bg-slate-950 text-white shadow-xl shadow-slate-200 scale-105' 
                      : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* List Berita */}
            <div className="space-y-16">
              {filteredNews.length > 0 ? (
                filteredNews.map(news => (
                  <article key={news.id} className="group grid grid-cols-1 md:grid-cols-12 gap-8 items-start cursor-pointer">
                    <div className="md:col-span-5 relative overflow-hidden rounded-[24px] aspect-[4/3]">
                      <img src={news.image} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" alt={news.title}/>
                    </div>
                    <div className="md:col-span-7 pt-2">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">{news.category}</span>
                        <span className="h-1 w-1 rounded-full bg-slate-200"></span>
                        <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">{news.date}</span>
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-bold tracking-tighter text-slate-900 mb-4 group-hover:text-emerald-700 transition-colors">
                        {news.title}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                        {news.excerpt || "Ketahui lebih dalam mengenai analisis mendalam dan rangkuman editorial terbaik kami hari ini."}
                      </p>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-900 group-hover:gap-4 transition-all uppercase tracking-widest">
                        Selengkapnya <ChevronRight className="h-3 w-3" />
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-slate-200">
                  <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="h-8 w-8 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Tidak ada berita ditemukan</h3>
                  <p className="text-slate-400 text-sm">Coba sesuaikan kata kunci atau kategori pencarian Anda.</p>
                </div>
              )}
            </div>
          </div>

          {/* --- SIDEBAR --- */}
          <aside className="lg:col-span-4 space-y-12">
            
            {/* Newsletter Premium */}
            <div className="bg-emerald-600 rounded-[32px] p-8 text-white relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
              <Mail className="h-10 w-10 mb-6" />
              <h3 className="text-2xl font-black tracking-tight mb-3 italic">Insights di Inbox Anda.</h3>
              <p className="text-emerald-50 text-sm mb-8 leading-relaxed">Berlangganan kurasi berita pilihan redaksi setiap pagi.</p>
              <div className="relative">
                <input type="email" placeholder="Email" className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-4 text-sm placeholder:text-white/50 focus:outline-none focus:bg-white focus:text-slate-900 transition-all"/>
                <button className="absolute right-2 top-2 bottom-2 bg-white text-emerald-600 px-4 rounded-xl text-[10px] font-black tracking-widest hover:bg-emerald-50 transition-colors">
                  DAFTAR
                </button>
              </div>
            </div>

            {/* Trending Section */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">Paling Populer</h4>
                <div className="h-px bg-slate-100 flex-1 ml-6"></div>
              </div>
              <div className="space-y-8">
                {[1,2,3].map(i => (
                  <div key={i} className="flex gap-6 group cursor-pointer">
                    <span className="text-4xl font-black text-slate-100 group-hover:text-emerald-500 transition-colors duration-500">0{i}</span>
                    <div>
                      <h5 className="font-bold text-slate-900 leading-tight group-hover:underline">Tren Investasi Properti di Tahun 2024 Bagi Kaum Millenial</h5>
                      <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Bisnis • 2.4k Views</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </aside>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-950 text-white pt-24 pb-12 rounded-t-[60px] mt-20">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
            <div className="md:col-span-5">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-12 w-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-2xl font-black italic">A</div>
                <span className="text-3xl font-black tracking-tighter">ADE<span className="text-emerald-500">NEWS</span></span>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed max-w-sm font-medium">
                Mendefinisikan ulang jurnalisme modern dengan akurasi, integritas, dan kecepatan.
              </p>
            </div>
            <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
              {['Kategori', 'Perusahaan', 'Bantuan'].map(col => (
                <div key={col}>
                  <h6 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8">{col}</h6>
                  <ul className="space-y-4 text-sm font-bold text-slate-300">
                    <li className="hover:text-emerald-500 transition-colors"><a href="#">Nasional</a></li>
                    <li className="hover:text-emerald-500 transition-colors"><a href="#">Teknologi</a></li>
                    <li className="hover:text-emerald-500 transition-colors"><a href="#">Tentang</a></li>
                    <li className="hover:text-emerald-500 transition-colors"><a href="#">Karir</a></li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col md:row items-center justify-between pt-12 border-t border-slate-900 gap-8">
            <p className="text-[10px] font-bold text-slate-600 tracking-widest uppercase">© 2024 ADE GREEN TX MEDIA. GLOBAL STANDARD JURNALISME.</p>
            <div className="flex gap-8">
              {['FB', 'TW', 'IG', 'LN'].map(s => (
                <span key={s} className="text-[10px] font-black text-slate-600 hover:text-white transition-colors cursor-pointer">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Global CSS for marquee and scrollbar */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}