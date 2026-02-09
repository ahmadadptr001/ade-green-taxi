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
  LogIn,
} from 'lucide-react';
import {
  getArticles,
  getCategories,
  getHighlight,
  getTags,
  getTopics,
} from '@/services/articles';
import Footer from '@/components/berita/Footer';
import animationData from '@/public/lottie/success.json';
import { formatDate } from '@/utils/date';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DialogContent } from '@radix-ui/react-dialog';
import Lottie from 'lottie-react';

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
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNav, setActiveNav] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [articles, setArticles] = useState(null);
  const [categories, setCategories] = useState(null);
  const [tags, setTags] = useState(null);
  const [topics, setTopics] = useState(null);
  const [popularArticles, setPopularArticles] = useState(null);
  const [highlight, setHighlight] = useState('');

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
        const hightlight_ = await getHighlight();
        setHighlight(hightlight_.highlight[0].text);

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
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Bar - Lebih Minimalis */}
      <div className="hidden lg:block border-b border-slate-100 bg-white py-2 text-[10px] font-medium tracking-wide text-slate-500 uppercase">
        <div className="container mx-auto flex items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-emerald-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <span>Trending</span>
            </div>
            <div className="overflow-hidden whitespace-nowrap max-w-lg">
              <div className="animate-marquee inline-block text-slate-900">
                {highlight}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 cursor-pointer hover:text-emerald-600 transition-colors">
              <Globe className="h-3 w-3" /> ID / EN
            </span>
            <div className="h-3 w-px bg-slate-200"></div>
            <div className="flex gap-4 text-slate-400">
              <Facebook className="h-3.5 w-3.5 cursor-pointer hover:text-blue-600 transition-colors" />
              <Twitter className="h-3.5 w-3.5 cursor-pointer hover:text-sky-500 transition-colors" />
              <Instagram className="h-3.5 w-3.5 cursor-pointer hover:text-pink-600 transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* Header Utama */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm py-3'
            : 'bg-white py-5'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo - Lebih Clean */}
            <a href="/beranda" className="flex items-center gap-2 group">
              <div className="flex items-center justify-center h-9 w-9 bg-slate-900 rounded-lg text-white group-hover:bg-emerald-600 transition-colors duration-300">
                <span className="font-serif font-black italic text-lg">A</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-black tracking-tighter text-slate-900">
                  ADE<span className="text-emerald-600">GREEN</span>
                </span>
              </div>
            </a>

            {/* Main Nav - Minimalist */}
            <nav className="hidden lg:flex items-center gap-8">
              {topics &&
                topics.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveNav(item.name)}
                    className={`relative text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:text-emerald-600 py-1 ${
                      activeNav === item.name
                        ? 'text-emerald-600'
                        : 'text-slate-500'
                    }`}
                  >
                    {item.name}
                    {activeNav === item.name && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-full" />
                    )}
                  </button>
                ))}
            </nav>

            {/* Header Actions */}
            <div className="flex items-center gap-3">
              {/* Search Bar - Expandable */}
              <div className="relative hidden md:block group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="h-9 w-32 rounded-full border border-slate-200 bg-slate-50 px-9 text-xs font-medium transition-all focus:w-56 focus:border-emerald-500 focus:bg-white focus:outline-none group-hover:bg-white"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                {searchQuery && (
                  <X
                    className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 cursor-pointer hover:text-red-500"
                    onClick={() => setSearchQuery('')}
                  />
                )}
              </div>

              <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block"></div>

              <button
                onClick={() => setShowModal(true)}
                className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold tracking-wide transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Sign In
              </button>

              <button
                className="flex items-center justify-center lg:hidden p-2 text-slate-900"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <MenuIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Modal Auth */}
      <div
        className={`${showModal ? 'block' : 'hidden'} fixed inset-0 z-[100]`}
      >
        <div
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          onClick={() => setShowModal(false)}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="relative bg-white w-full h-full sm:max-h-[80%] md:max-h-[90%] max-w-md rounded-2xl shadow-2xl overflow-hidden p-8 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div
                className="w-40 h-40 sm:h-60 sm:w-60  md:h-80 md:w-80 mb-6"
                id="container-lottie"
              >
                <Lottie animationData={animationData} />
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Selamat Datang
              </h3>
              <p className="text-slate-500 text-sm mb-8 px-6">
                Masuk untuk mengakses konten premium dan fitur personalisasi.
              </p>

              <div className="w-full space-y-3">
                <Link
                  href={'/daftar'}
                  className="flex items-center justify-center w-full py-3.5 bg-slate-900 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all duration-300"
                >
                  Buat Akun Baru
                </Link>
                <Link
                  href={'/masuk'}
                  className="flex items-center justify-center w-full py-3.5 bg-white border border-slate-200 hover:border-slate-900 text-slate-700 hover:text-slate-900 font-semibold rounded-xl transition-all duration-300"
                >
                  Masuk
                </Link>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50 w-full">
                <p className="text-xs text-slate-400">
                  Butuh bantuan? Hubungi{' '}
                  <Link
                    href={'mailto:support@adegreentx.id'}
                    className="text-emerald-600 hover:underline"
                  >
                    support@adegreentx.id
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="absolute right-0 top-0 bottom-0 w-3/4 max-w-sm bg-white p-8 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-8">
              <span className="font-black text-xl">MENU</span>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-6 w-6 text-slate-400" />
              </button>
            </div>
            <div className="flex flex-col gap-6">
              {topics &&
                topics.map((item) => (
                  <button
                    key={item.id}
                    className={`text-left text-lg font-bold tracking-tight ${activeNav === item.name ? 'text-emerald-600' : 'text-slate-900'}`}
                    onClick={() => {
                      setActiveNav(item.name);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {item.name}
                  </button>
                ))}
              <hr className="border-slate-100 my-2" />
              <button
                onClick={() => {
                  setShowModal(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold"
              >
                Masuk / Daftar
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8 lg:px-8">
        {/* --- HERO SECTION: Clean & Modern --- */}
        {!searchQuery && activeCategory === 'Semua' && (
          <section className="mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
              {/* Main Featured Article */}
              {hasNews ? (
                <Link
                  href={`/berita/${primary.slug}`}
                  className="lg:col-span-8 relative group overflow-hidden rounded-2xl bg-slate-100 aspect-[16/10] md:aspect-[2/1] lg:aspect-auto"
                >
                  <img
                    src={primary.image}
                    onError={handleImgError}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    alt="Main"
                    loading="lazy"
                  />
                  {/* Modern Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90" />

                  <div className="absolute bottom-0 left-0 p-6 lg:p-10 w-full max-w-4xl">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-white/10 backdrop-blur-md text-white border border-white/20 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                        {primary.category}
                      </span>
                      <span className="text-white/70 text-xs font-medium tracking-wide">
                        {primary.date}
                      </span>
                    </div>

                    <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-[1.1] tracking-tight mb-4 group-hover:text-emerald-400 transition-colors">
                      {primary.title}
                    </h2>

                    <p className="text-slate-300 text-sm md:text-base max-w-xl line-clamp-2 hidden sm:block leading-relaxed">
                      {primary.excerpt}
                    </p>
                  </div>
                </Link>
              ) : (
                <div className="lg:col-span-8 relative rounded-2xl bg-slate-50 border border-slate-100 aspect-[2/1] flex items-center justify-center">
                  <div className="text-center">
                    <Search className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-400 font-medium">
                      Belum ada berita utama
                    </p>
                  </div>
                </div>
              )}

              {/* Side Articles (Right Column) */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                {hasNews
                  ? sideItems.map((item) => (
                      <Link
                        href={`/berita/${item.slug}`}
                        key={item.id}
                        className="group relative flex-1 rounded-2xl bg-white border border-slate-100 p-6 hover:border-emerald-500/30 transition-all hover:shadow-lg hover:shadow-slate-100 overflow-hidden flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-emerald-700 text-[10px] font-black uppercase tracking-widest">
                              {item.category}
                            </span>
                            <span className="text-slate-400 text-[10px]">
                              {item.date}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-3">
                            {item.title}
                          </h3>
                        </div>
                        <div className="mt-4 flex items-center text-xs font-bold text-slate-400 group-hover:text-emerald-600 transition-colors">
                          Baca Selengkapnya{' '}
                          <ChevronRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Link>
                    ))
                  : [0, 1].map((i) => <div key={i}></div>)}
              </div>
            </div>
          </section>
        )}

        {/* --- CONTENT AREA --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Feed */}
          <div className="lg:col-span-8">
            {/* Filter Tabs - Clean Pill Style */}
            <div className="flex items-center gap-2 mb-10 overflow-x-auto no-scrollbar pb-2">
              {categories &&
                categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold transition-all border ${
                      activeCategory === cat.name
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
            </div>

            {/* List Artikel - Editorial Layout */}
            <div className="space-y-12">
              {filteredNews?.length > 0 ? (
                filteredNews.map((news) => (
                  <article
                    key={news.id}
                    className="group border-b border-slate-100 pb-12 last:border-0"
                  >
                    <Link
                      href={'/berita/' + news.slug}
                      className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start"
                    >
                      <div className="md:col-span-5 relative overflow-hidden rounded-xl aspect-[16/10] bg-slate-100">
                        <img
                          src={news.image}
                          onError={handleImgError}
                          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105 opacity-95 group-hover:opacity-100"
                          alt={news.title}
                          loading="lazy"
                        />
                      </div>

                      <div className="md:col-span-7 flex flex-col h-full justify-center">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                            {news.category}
                          </span>
                          <span className="text-[11px] font-medium text-slate-400">
                            {news.date}
                          </span>
                        </div>

                        <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-emerald-700 transition-colors">
                          {news.title}
                        </h3>

                        <p className="text-slate-500 text-sm leading-relaxed mb-5 line-clamp-2">
                          {news.excerpt ||
                            'Temukan analisis mendalam dan rangkuman terbaru mengenai topik ini.'}
                        </p>

                        <div className="flex items-center gap-4 mt-auto">
                          <div className="flex items-center gap-1 text-slate-400 text-xs">
                            <Clock className="h-3 w-3" />{' '}
                            <span>3 min read</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))
              ) : (
                <div>
                  <p className="text-gray-500 text-center text-sm">
                    Tidak ada berita
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-10 pl-0 lg:pl-4">
            {/* Newsletter - Lebih Elegan */}
            <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <Mail className="h-6 w-6 text-emerald-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Subscribe to Briefing</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Dapatkan kurasi berita pilihan redaksi langsung di inbox Anda
                setiap pagi.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Alamat Email"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-colors placeholder:text-slate-500"
                />
                <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-3 rounded-lg transition-colors">
                  Langganan
                </button>
              </div>
            </div>

            {/* Trending / Popular */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">
                  Terpopuler
                </h4>
                <div className="h-px bg-slate-200 flex-1"></div>
              </div>

              <div className="flex flex-col gap-6">
                {popularArticles?.length > 0 ? (
                  popularArticles.slice(0, 4).map((item, index) => (
                    <Link
                      href={`/berita/${item.slug}`}
                      key={item.id}
                      className="group flex gap-5 items-start"
                    >
                      <img
                        src={item.image}
                        alt={item.slug}
                        className="w-10 h-10 rounded-md"
                        loading="lazy"
                      />
                      <div className="flex-1">
                        <h5 className="font-bold text-slate-900 leading-snug text-base mb-1 group-hover:text-emerald-700 transition-colors line-clamp-2">
                          {item.title}
                        </h5>
                        <p className="text-[11px] text-slate-400 font-medium">
                          {item.views.toLocaleString()} Pembaca
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-slate-400 text-sm text-center py-4">
                    Memuat data populer...
                  </div>
                )}
              </div>
            </div>

            {/* Tags Cloud (Optional visual filler) */}
            {tags && tags.length > 0 && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">
                    Topik Hangat
                  </h4>
                  <div className="h-px bg-slate-200 flex-1"></div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 8).map((tag) => (
                    <Link
                      href={'/berita/tag/' + tag.slug}
                      key={tag.id}
                      className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-md text-slate-600 font-medium"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </section>
      </main>

      <Footer topics={topics} categories={categories} tags={tags} />

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
          animation: marquee 30s linear infinite;
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
