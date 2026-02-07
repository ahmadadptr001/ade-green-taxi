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
  Globe,
  MenuIcon,
} from 'lucide-react';
import {
  getArticles,
  getCategories,
  getTags,
  getTopics,
} from '@/services/articles';
import Footer from '@/components/berita/Footer';
import { formatDate } from '@/utils/date';
import Link from 'next/link';

const placeholderSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='700' height='500'><rect width='100%' height='100%' fill='%23f8fafc'/><g fill='%239ca3af' font-family='Arial, Helvetica, sans-serif' font-size='20'><text x='50%' y='48%' dominant-baseline='middle' text-anchor='middle'>No image</text><text x='50%' y='62%' dominant-baseline='middle' text-anchor='middle' font-size='14'>image unavailable</text></g></svg>`;
const PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(placeholderSvg)}`;

const mapArticlesToNews = (articles = []) => {
  if (!Array.isArray(articles)) return [];

  return articles.map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    excerpt: a.description,
    category: a?.article_categories?.[0]?.categories?.name ?? 'Umum',
    topics: a?.article_topics,
    date: formatDate(a.published_at),
    image: a.img,
    views: a.views ?? 0,
    raw: a,
  }));
};

const getPopularArticles = (articles = [], minViews = 100) => {
  if (!Array.isArray(articles)) return [];

  return articles
    .filter((a) => (a.views ?? 0) >= minViews)
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
};

const CATEGORIES = [
  'Semua',
  'Teknologi',
  'Bisnis',
  'Green Energy',
  'Desain',
  'Life',
];

const NOTIFICATIONS = [
  {
    id: 1,
    text: 'Berita utama hari ini telah terbit.',
    time: '2 mnt lalu',
    unread: true,
  },
  {
    id: 2,
    text: 'Sarah Wijaya mengomentari artikel Anda.',
    time: '1 jam lalu',
    unread: true,
  },
  {
    id: 3,
    text: 'Update sistem berhasil diselesaikan.',
    time: '5 jam lalu',
    unread: false,
  },
];

export default function PremiumNewsPage() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNav, setActiveNav] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [articles, setArticles] = useState(null);
  const [categories, setCategories] = useState(null);
  const [tags, setTags] = useState(null);
  const [topics, setTopics] = useState(null);
  const [popularArticles, setPopularArticles] = useState(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getArticles();
        const categories_resp = await getCategories();
        const tags_resp = await getTags();
        const topics_resp = await getTopics();

        // filter artikel jadi data yang lebih simpel
        const mappedArticles = mapArticlesToNews(data?.articles);

        // filter artikel yang paling populer
        const popularRaw = getPopularArticles(data?.articles, 100);
        const mappedPopular = mapArticlesToNews(popularRaw);

        setArticles(mappedArticles);
        setPopularArticles(mappedPopular);

        setTags(tags_resp.tags);
        setTopics(topics_resp.topics);
        setCategories(categories_resp.categories);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const filteredNews = useMemo(() => {
    // if (!articles) return;

    if (activeNav.length !== 0) {
      const filter_by_topics = articles?.filter((item) => {
        return item.topics?.some(
          (item_article) => item_article.topics.name === activeNav
        );
      });

      return filter_by_topics?.filter((item) => {
        const matchesCategory =
          activeCategory === 'Semua' || item.category === activeCategory;
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          item.title.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q);
        return matchesCategory && matchesSearch;
      });
    } else {
      return articles?.filter((item) => {
        const matchesCategory =
          activeCategory === 'Semua' || item.category === activeCategory;
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          item.title.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q);
        return matchesCategory && matchesSearch;
      });
    }
  }, [activeCategory, searchQuery, articles, activeNav]);

  // safety flags and safe references for hero items
  const hasNews = Array.isArray(articles) && articles?.length > 0;
  const primary = hasNews ? articles[0] : null;
  const sideItems = hasNews ? [articles[1], articles[2]].filter(Boolean) : [];

  // small helper for img onError (keeps consistent fallback)
  const handleImgError = (e) => {
    if (!e?.currentTarget) return;
    if (e.currentTarget.src === PLACEHOLDER) return;
    e.currentTarget.src = PLACEHOLDER;
  };

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
                Laporan Khusus: Transisi Energi Terbarukan di Asia Tenggara •
                Indeks Saham Gabungan Menguat 0.5% •
              </div>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <Globe className="h-3 w-3" /> ID / EN
            </span>
            <div className="flex gap-4">
              <Facebook className="h-3.5 w-3.5 cursor-pointer hover:text-white transition-colors" />
              <Twitter className="h-3.5 w-3.5 cursor-pointer hover:text-white transition-colors" />
              <Instagram className="h-3.5 w-3.5 cursor-pointer hover:text-white transition-colors" />
            </div>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 w-full transition-all duration-500 ${
          isScrolled
            ? 'bg-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl py-3'
            : 'bg-white border-b border-slate-100 py-5'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between">
            <a
              href="/beranda"
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white transition-transform group-hover:rotate-6">
                <span className="text-xl font-black italic">A</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-black tracking-tighter text-slate-950">
                  ADE<span className="text-emerald-600">GREEN</span>
                </span>
                <span className="text-[10px] font-bold tracking-[0.3em] text-slate-400">
                  BERITA
                </span>
              </div>
            </a>

            {/* Main Nav - Functional */}
            <nav className="hidden lg:flex items-center gap-10">
              {topics &&
                topics.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveNav(item.name)}
                    className={`relative text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:text-emerald-600 ${
                      activeNav === item.name
                        ? 'text-emerald-600'
                        : 'text-slate-500'
                    }`}
                  >
                    {item.name}
                    {activeNav === item.name && (
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
                  placeholder="Cari berita..."
                  className="h-10 w-40 rounded-full border border-slate-100 bg-slate-50/50 px-10 text-xs font-medium transition-all focus:w-64 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/5 group-hover:bg-slate-50"
                />
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 group-focus-within:text-emerald-600" />
                {searchQuery && (
                  <X
                    className="absolute right-3.5 top-3 h-4 w-4 text-slate-400 cursor-pointer hover:text-red-500"
                    onClick={() => setSearchQuery('')}
                  />
                )}
              </div>

              <button
                className="flex items-center justify-center lg:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <MenuIcon />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* --- MOBILE MENU OVERLAY --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden animate-in slide-in-from-top duration-300">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="absolute top-0 w-full bg-white p-8 rounded-b-[40px] shadow-2xl">
            <div className="flex flex-col gap-6 text-center">
              {topics &&
                topics.map((item) => (
                  <button
                    key={item.id}
                    className="text-2xl font-black text-slate-900 tracking-tighter"
                    onClick={() => {
                      setActiveNav(item.name);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {item.name}
                  </button>
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
        {!searchQuery && activeCategory === 'Semua' && (
          <section className="mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Primary Feature */}
              {hasNews ? (
                <div className="lg:col-span-8 relative group overflow-hidden rounded-[32px] bg-slate-200 aspect-[4/3] md:aspect-[18/9]">
                  <img
                    src={primary.image}
                    onError={handleImgError}
                    className="absolute inset-0 h-full w-full object-cover transition duration-1000 group-hover:scale-110 group-hover:rotate-1"
                    alt="Main"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-green-600/50" />
                  <div className="absolute bottom-0 p-10 lg:p-14 w-full">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg">
                        {primary.category}
                      </span>
                      <span className="text-white/60 text-xs font-medium">
                        {primary.date}
                      </span>
                    </div>
                    <h2 className="line-clamp-3 text-2xl lg:text-4xl font-black text-white leading-[1.1] tracking-tighter mb-6 transition-transform duration-500 group-hover:-translate-y-2">
                      {primary.title}
                    </h2>
                    <div className="flex items-center justify-between">
                      <p className="text-slate-300 text-sm max-w-md line-clamp-2 hidden sm:block">
                        {primary.excerpt}
                      </p>
                      <button className="h-14 w-14 rounded-full bg-white flex items-center justify-center text-slate-900 transition-transform group-hover:scale-110 shadow-xl">
                        <ArrowUpRight className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // Placeholder / Empty state that preserves layout & design
                <div className="lg:col-span-8 relative overflow-hidden rounded-[32px] bg-white border border-dashed border-slate-200 aspect-[16/10] lg:aspect-auto flex items-center justify-center">
                  <div className="text-center p-10">
                    <div className="h-28 w-28 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">
                      Belum ada berita terbaru
                    </h3>
                    <p className="text-sm text-slate-400 max-w-md mx-auto">
                      Tim redaksi sedang menyiapkan konten. Coba lagi nanti atau
                      gunakan fitur pencarian untuk menemukan topik lain.
                    </p>
                  </div>
                </div>
              )}

              {/* Side Features */}
              <div className="lg:col-span-4 flex flex-col gap-8">
                {hasNews
                  ? // original side items when data exists
                    sideItems.map((item) => (
                      <div
                        key={item.id}
                        className="group relative flex-1 rounded-[32px] bg-white border border-slate-100 p-6 transition-all hover:shadow-2xl hover:shadow-slate-200/50 flex flex-col justify-between overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-100">
                          <TrendingUp className="h-20 w-20 text-emerald-600 -mr-4 -mt-4" />
                        </div>
                        <div className="relative">
                          <span className="text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                            {item.category}
                          </span>
                          <h3 className="text-2xl font-bold tracking-tight text-slate-900 mt-3 leading-snug group-hover:text-emerald-700 transition-colors">
                            {item.title}
                          </h3>
                        </div>
                        <div className="mt-8 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400">
                            {item.date}
                          </span>
                          <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                            <ChevronRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    ))
                  : // two small placeholder cards to preserve layout
                    [0, 1].map((i) => (
                      <div
                        key={i}
                        className="relative flex-1 rounded-[32px] bg-white border border-dashed border-slate-200 p-6 flex flex-col justify-center items-center text-center"
                      >
                        <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                          <PlayCircle className="h-6 w-6 text-slate-300" />
                        </div>
                        <h4 className="font-bold text-slate-900 mb-2">
                          Konten segera
                        </h4>
                        <p className="text-[12px] text-slate-400">
                          Kami sedang menyiapkan artikel terbaru
                        </p>
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
                {categories &&
                  categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setActiveCategory(cat.name);
                      }}
                      className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                        activeCategory === cat.name
                          ? 'bg-slate-950 text-white shadow-xl shadow-slate-200 scale-105'
                          : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
              </div>
            </div>

            {/* List Berita */}
            <div className="space-y-16">
              {filteredNews?.length > 0 ? (
                filteredNews.map((news) => (
                  <article key={news.id}>
                    {console.log(news)}
                    <Link href={'/berita/' + news.slug}>
                      <div className="group grid grid-cols-1 md:grid-cols-12 gap-8 items-start cursor-pointer">
                        <div className="md:col-span-5 relative overflow-hidden rounded-[24px] aspect-[4/3]">
                          <img
                            src={news.image}
                            onError={handleImgError}
                            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                            alt={news.title}
                          />
                        </div>
                        <div className="md:col-span-7 pt-2">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
                              {news.category}
                            </span>
                            <span className="h-1 w-1 rounded-full bg-slate-200"></span>
                            <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                              {news.date}
                            </span>
                          </div>
                          <h3 className="text-2xl lg:text-3xl font-bold tracking-tighter text-slate-900 mb-4 group-hover:text-emerald-700 transition-colors">
                            {news.title}
                          </h3>
                          <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                            {news.excerpt ||
                              'Ketahui lebih dalam mengenai analisis mendalam dan rangkuman editorial terbaik kami hari ini.'}
                          </p>
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 group-hover:gap-4 transition-all uppercase tracking-widest">
                            Selengkapnya <ChevronRight className="h-3 w-3" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-slate-200">
                  <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="h-8 w-8 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">
                    Tidak ada berita ditemukan
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Coba sesuaikan kata kunci atau kategori pencarian Anda.
                  </p>
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
              <h3 className="text-2xl font-black tracking-tight mb-3 italic">
                Insights di Inbox Anda.
              </h3>
              <p className="text-emerald-50 text-sm mb-8 leading-relaxed">
                Berlangganan kurasi berita pilihan redaksi setiap pagi.
              </p>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-4 text-sm placeholder:text-white/50 focus:outline-none focus:bg-white focus:text-slate-900 transition-all"
                />
                <button className="absolute right-2 top-2 bottom-2 bg-white text-emerald-600 px-4 rounded-xl text-[10px] font-black tracking-widest hover:bg-emerald-50 transition-colors">
                  DAFTAR
                </button>
              </div>
            </div>

            {/* Trending Section */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">
                  Paling Populer
                </h4>
                <div className="h-px bg-slate-100 flex-1 ml-6"></div>
              </div>
              <div className="space-y-8">
                {popularArticles?.length > 0 ? (
                  popularArticles.slice(0, 3).map((item, index) => (
                    <div
                      key={item.id}
                      className="flex gap-6 group cursor-pointer"
                    >
                      {/* Ranking */}
                      <span className="text-4xl font-black text-slate-200 group-hover:text-primary transition-colors duration-500">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      <div>
                        <h5 className="font-bold text-slate-900 leading-tight group-hover:underline">
                          {item.title}
                        </h5>
                        <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">
                          {item.category} • {item.views.toLocaleString()} Views
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-slate-400 text-sm">
                    Belum ada berita populer
                  </div>
                )}
              </div>
            </div>
          </aside>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <Footer topics={topics} categories={categories} tags={tags} />

      {/* Global CSS for marquee and scrollbar */}
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
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
