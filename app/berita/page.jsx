'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, ChevronLeft, ChevronRight, ArrowRight, Mail, X, Tag, LayoutDashboard, LogIn } from 'lucide-react';
import {
  getArticles,
  getCategories,
  getHighlight,
  getTags,
  getTopics,
} from '@/services/articles';
import Header from '@/components/Header';
import Footer from '@/components/home/Footer';
import { MarkText } from '@/components/ui/Typo';
import { formatDate } from '@/utils/date';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';

const placeholderSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='700' height='500'><rect width='100%' height='100%' fill='%23eef2f0'/><g fill='%2394a3b8' font-family='Georgia,serif' font-size='22' font-style='italic'><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'>Ade Green</text></g></svg>`;
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
  }));
};

const getPopularArticles = (articles = [], minViews = 100) =>
  Array.isArray(articles)
    ? articles
        .filter((a) => (a.views ?? 0) >= minViews)
        .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
    : [];

function CategoryTag({ children }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
      <Tag size={12} className="text-emerald-500" />
      {children}
    </span>
  );
}

export default function NewsPage() {
  const router = useRouter();
  const carouselRef = useRef(null);

  const [activeCategory, setActiveCategory] = useState('Semua');
  const [activeTopic, setActiveTopic] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState(null);
  const [categories, setCategories] = useState(null);
  const [tags, setTags] = useState(null);
  const [topics, setTopics] = useState(null);
  const [popularArticles, setPopularArticles] = useState(null);
  const [highlight, setHighlight] = useState('');
  const [isLogin, setIsLogin] = useState(false);

  const isLoading = articles === null;

  useEffect(() => {
    setIsLogin(!!localStorage.getItem('user'));
  }, []);

  const goDashboard = () =>
    router.push(isLogin ? '/dashboard/berita' : '/masuk');

  useEffect(() => {
    (async () => {
      try {
        const data = await getArticles();
        const [cat, tag, top, hi] = await Promise.all([
          getCategories(),
          getTags(),
          getTopics(),
          getHighlight(),
        ]);
        if (hi?.highlight?.[0]) setHighlight(hi.highlight[0].text);
        // Hanya artikel terbit yang tayang publik — draft disembunyikan.
        const published = (data?.articles ?? []).filter((a) => a.published_at);
        setArticles(mapArticlesToNews(published));
        setPopularArticles(
          mapArticlesToNews(getPopularArticles(published, 100))
        );
        setTags(tag.tags);
        setTopics(top.topics ?? []);
        setCategories(cat.categories);
      } catch (err) {
        console.error(err);
        setArticles([]);
      }
    })();
  }, []);

  const filteredNews = useMemo(() => {
    let list = articles ?? [];
    if (activeTopic) {
      list = list.filter((item) =>
        item.topics?.some((t) => t.topics?.name === activeTopic)
      );
    }
    const q = searchQuery.toLowerCase();
    return list.filter((item) => {
      const matchesCategory =
        activeCategory === 'Semua' || item.category === activeCategory;
      const matchesSearch =
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, activeTopic, searchQuery, articles]);

  const hasNews = Array.isArray(articles) && articles.length > 0;
  const primary = hasNews ? articles[0] : null;
  const secondary = hasNews ? articles.slice(1, 4) : [];
  const editorPicks = hasNews ? articles.slice(4, 12) : [];
  const showHero = !searchQuery && activeCategory === 'Semua' && !activeTopic;

  const onImgError = (e) => {
    if (e?.currentTarget && e.currentTarget.src !== PLACEHOLDER)
      e.currentTarget.src = PLACEHOLDER;
  };
  const scrollCarousel = (dir) => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-white text-slate-900 selection:bg-emerald-100">
      <Header />

      <div className="mx-auto max-w-screen-xl px-4 pt-28 sm:px-6 lg:px-8">
        {/* Masthead */}
        <div className="flex items-end justify-between gap-4 border-b-2 border-slate-900 pb-8">
          <div>
            <p className="mb-3 text-sm text-slate-400">Ade Green · Berita Terkini</p>
            <h1 className="font-display text-5xl font-medium leading-none md:text-7xl">
              Kabar <MarkText>Hijau</MarkText>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {hasNews && (
              <p className="hidden text-sm text-slate-400 lg:block">
                {articles.length} artikel
              </p>
            )}
            <button
              onClick={goDashboard}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
            >
              {isLogin ? <LayoutDashboard size={16} /> : <LogIn size={16} />}
              {isLogin ? 'Dashboard' : 'Masuk'}
            </button>
          </div>
        </div>

        {/* Trending strip */}
        {highlight && (
          <div className="flex items-center gap-3 overflow-hidden border-b border-slate-200 py-3 text-sm">
            <span className="shrink-0 font-semibold text-emerald-700">Terkini</span>
            <span className="h-4 w-px bg-slate-200" />
            <div className="overflow-hidden">
              <div className="animate-marquee whitespace-nowrap text-slate-500">{highlight}</div>
            </div>
          </div>
        )}

        {showHero && (
          <>
            {/* HERO — image with text beside it (not on it) */}
            <section className="grid grid-cols-1 gap-10 py-16 lg:grid-cols-12 lg:gap-16 lg:py-20">
              {isLoading ? (
                <Skeleton className="aspect-[3/2] bg-slate-200 lg:col-span-7" />
              ) : primary ? (
                <>
                  <Link
                    href={`/berita/${primary.slug}`}
                    className="group relative overflow-hidden lg:col-span-7"
                  >
                    <div className="aspect-[3/2] overflow-hidden bg-slate-100">
                      <img
                        src={primary.image}
                        onError={onImgError}
                        alt={primary.title}
                        loading="eager"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    </div>
                    <span className="absolute left-0 top-0 bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-slate-950">
                      Utama
                    </span>
                  </Link>

                  <div className="flex flex-col justify-center lg:col-span-5">
                    <CategoryTag>{primary.category}</CategoryTag>
                    <Link href={`/berita/${primary.slug}`} className="group mt-3">
                      <h2 className="font-display text-3xl font-medium leading-tight transition-colors group-hover:text-emerald-700 md:text-5xl">
                        {primary.title}
                      </h2>
                    </Link>
                    <p className="mt-4 text-base leading-relaxed text-slate-600 line-clamp-3">
                      {primary.excerpt}
                    </p>
                    <div className="mt-5 flex items-center gap-3 text-sm text-slate-400">
                      <span>{primary.date}</span>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <span>{primary.views.toLocaleString()} pembaca</span>
                    </div>
                    <Link
                      href={`/berita/${primary.slug}`}
                      className="mt-6 inline-flex w-fit items-center gap-2 border-b-2 border-slate-900 pb-1 text-sm font-semibold transition-colors hover:border-emerald-600 hover:text-emerald-700"
                    >
                      Baca selengkapnya <ArrowRight size={15} />
                    </Link>
                  </div>
                </>
              ) : null}
            </section>

            {/* Secondary trio */}
            {secondary.length > 0 && (
              <section className="grid grid-cols-1 gap-10 border-t border-slate-200 py-16 sm:grid-cols-3">
                {secondary.map((item) => (
                  <Link key={item.id} href={`/berita/${item.slug}`} className="group">
                    <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                      <img
                        src={item.image}
                        onError={onImgError}
                        alt={item.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-4">
                      <CategoryTag>{item.category}</CategoryTag>
                      <h3 className="mt-2 font-display text-base font-medium leading-snug transition-colors group-hover:text-emerald-700 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-400">{item.date}</p>
                    </div>
                  </Link>
                ))}
              </section>
            )}

            {/* Editor picks carousel */}
            {editorPicks.length > 0 && (
              <section className="border-t border-slate-200 py-16">
                <div className="mb-6 flex items-end justify-between">
                  <h2 className="font-display text-2xl font-medium">Pilihan Redaksi</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => scrollCarousel(-1)}
                      aria-label="Sebelumnya"
                      className="flex h-9 w-9 items-center justify-center border border-slate-300 text-slate-600 transition-colors hover:border-slate-900 hover:text-slate-900"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() => scrollCarousel(1)}
                      aria-label="Berikutnya"
                      className="flex h-9 w-9 items-center justify-center border border-slate-300 text-slate-600 transition-colors hover:border-slate-900 hover:text-slate-900"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
                <div ref={carouselRef} className="no-scrollbar flex snap-x snap-mandatory gap-8 overflow-x-auto pb-2">
                  {editorPicks.map((item) => (
                    <Link key={item.id} href={`/berita/${item.slug}`} className="group w-[260px] shrink-0 snap-start sm:w-[300px]">
                      <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                        <img
                          src={item.image}
                          onError={onImgError}
                          alt={item.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="mt-3">
                        <CategoryTag>{item.category}</CategoryTag>
                        <h3 className="mt-1.5 font-display text-sm font-medium leading-snug transition-colors group-hover:text-emerald-700 line-clamp-2">
                          {item.title}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* Category tabs */}
        <div className="sticky top-16 z-30 border-y border-slate-200 bg-white/95 backdrop-blur">
          <div className="no-scrollbar -mx-4 flex items-center gap-7 overflow-x-auto px-4">
            {!categories
              ? [1, 2, 3, 4].map((i) => <Skeleton key={i} className="my-4 h-4 w-16 bg-slate-200" />)
              : [{ id: 0, name: 'Semua' }, ...categories].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`relative shrink-0 whitespace-nowrap py-4 text-sm transition-colors ${
                      activeCategory === cat.name
                        ? 'font-semibold text-slate-900'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    {cat.name}
                    {activeCategory === cat.name && (
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-emerald-500" />
                    )}
                  </button>
                ))}
          </div>
        </div>

        {/* MAIN: feed + sidebar */}
        <div className="grid grid-cols-1 gap-16 py-16 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-display text-2xl font-medium">
                {activeTopic || (activeCategory !== 'Semua' ? activeCategory : 'Terbaru')}
              </h2>
              <div className="relative w-full sm:w-56">
                <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari berita..."
                  className="w-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-8 text-sm focus:border-emerald-400 focus:bg-white focus:outline-none"
                />
                {searchQuery && (
                  <X size={15} onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 cursor-pointer text-slate-400 hover:text-slate-700" />
                )}
              </div>
            </div>

            <div className="divide-y divide-slate-200 border-t border-slate-200">
              {isLoading ? (
                [1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-6 py-12">
                    <Skeleton className="aspect-[4/3] w-32 shrink-0 bg-slate-200 sm:w-44" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-3 w-24 bg-slate-200" />
                      <Skeleton className="h-6 w-3/4 bg-slate-200" />
                      <Skeleton className="h-4 w-full bg-slate-200" />
                    </div>
                  </div>
                ))
              ) : filteredNews.length > 0 ? (
                filteredNews.map((news) => (
                  <article key={news.id} className="group">
                    <Link href={`/berita/${news.slug}`} className="flex gap-6 py-12">
                      <div className="aspect-[4/3] w-32 shrink-0 overflow-hidden bg-slate-100 sm:w-44">
                        <img
                          src={news.image}
                          onError={onImgError}
                          alt={news.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1.5 flex items-center gap-3">
                          <CategoryTag>{news.category}</CategoryTag>
                          <span className="text-xs text-slate-400">{news.date}</span>
                        </div>
                        <h3 className="font-display text-base font-medium leading-snug transition-colors group-hover:text-emerald-700 md:text-lg">
                          {news.title}
                        </h3>
                        <p className="mt-2 hidden text-sm leading-relaxed text-slate-500 line-clamp-2 sm:block">
                          {news.excerpt || 'Baca rangkuman terbaru mengenai topik ini.'}
                        </p>
                      </div>
                    </Link>
                  </article>
                ))
              ) : (
                <p className="py-16 text-center text-sm text-slate-400">Tidak ada berita yang cocok.</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-10 lg:col-span-4">
            <div className="relative overflow-hidden bg-slate-900 p-8 text-white">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/20 blur-3xl" />
              <Mail className="mb-4 h-6 w-6 text-emerald-400" />
              <h3 className="font-display text-xl font-medium">Briefing Hijau</h3>
              <p className="mb-6 mt-2 text-sm leading-relaxed text-slate-400">
                Kurasi berita transportasi hijau langsung ke inbox Anda.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Alamat email"
                  className="w-full border border-white/10 bg-white/5 px-4 py-3 text-sm placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                />
                <button
                  onClick={() => router.push('/daftar')}
                  className="w-full bg-emerald-600 py-3 text-sm font-semibold transition-colors hover:bg-emerald-500"
                >
                  Langganan
                </button>
              </div>
            </div>

            <div>
              <h4 className="mb-5 border-b-2 border-slate-900 pb-3 font-display text-lg font-medium">Terpopuler</h4>
              <div className="flex flex-col">
                {isLoading ? (
                  [1, 2, 3].map((i) => (
                    <div key={i} className="border-b border-slate-100 py-4">
                      <Skeleton className="h-5 w-full bg-slate-200" />
                    </div>
                  ))
                ) : popularArticles?.length > 0 ? (
                  popularArticles.slice(0, 5).map((item, i) => (
                    <Link key={item.id} href={`/berita/${item.slug}`} className="group flex items-start gap-4 border-b border-slate-100 py-4">
                      <span className="font-display text-3xl font-medium text-slate-200 transition-colors group-hover:text-emerald-500">
                        {i + 1}
                      </span>
                      <div>
                        <h5 className="font-display text-base font-medium leading-snug transition-colors group-hover:text-emerald-700 line-clamp-2">
                          {item.title}
                        </h5>
                        <p className="mt-1 text-xs text-slate-400">{item.views.toLocaleString()} pembaca</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="py-4 text-sm text-slate-400">Belum ada yang populer.</p>
                )}
              </div>
            </div>

            {topics?.length > 0 && (
              <div>
                <h4 className="mb-4 border-b-2 border-slate-900 pb-3 font-display text-lg font-medium">Topik</h4>
                <div className="flex flex-wrap gap-2">
                  {topics.slice(0, 8).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTopic((p) => (p === t.name ? '' : t.name))}
                      className={`border px-3 py-1.5 text-xs font-medium transition-colors ${
                        activeTopic === t.name
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 text-slate-600 hover:border-slate-400'
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {tags?.length > 0 && (
              <div>
                <h4 className="mb-4 border-b-2 border-slate-900 pb-3 font-display text-lg font-medium">Tags</h4>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500">
                  {tags.slice(0, 12).map((tag) => (
                    <Link key={tag.id} href={`/berita/tag/${tag.slug}`} className="transition-colors hover:text-emerald-600">
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      <Footer />
    </main>
  );
}
