'use client';

import { useEffect, useMemo, useState } from 'react';
import { Clock, Eye, Share2, ChevronLeft } from 'lucide-react';
import { getArticles } from '@/services/articles';
import { formatDate } from '@/utils/date';
import parse from 'html-react-parser';
import Link from 'next/link';

export default function BeritaContent({ params }) {
  // -----------------------
  // ALL HOOKS MUST BE HERE
  // -----------------------
  const [slug, setSlug] = useState(null);
  const [allArticles, setAllArticles] = useState([]);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Resolve params (Next.js passes params as a Promise to client components)
  useEffect(() => {
    let mounted = true;
    const resolveParams = async () => {
      try {
        const resolved = await params; // important: await params
        if (!mounted) return;
        setSlug(resolved?.slug ?? null);
      } catch (err) {
        console.error('Failed to resolve params', err);
        if (mounted) setSlug(null);
      }
    };
    resolveParams();
    return () => {
      mounted = false;
    };
  }, [params]);

  // Fetch articles once slug is known
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getArticles();
        if (!mounted) return;
        const articles = Array.isArray(data?.articles) ? data.articles : [];
        setAllArticles(articles);

        if (slug) {
          const found = articles.find((a) => a.slug === slug) || null;
          setArticle(found);
          setNotFound(!Boolean(found));
        } else {
          setArticle(null);
          setNotFound(true);
        }
      } catch (err) {
        console.error('Failed fetching articles', err);
        if (mounted) {
          setAllArticles([]);
          setArticle(null);
          setNotFound(true);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    // Only fetch when slug is resolved (you can also fetch earlier if you want)
    if (slug !== null) {
      fetchData();
    }

    return () => {
      mounted = false;
    };
  }, [slug]);

  // Reading progress
  useEffect(() => {
    const handleScroll = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop || 0;
      const height = doc.scrollHeight - doc.clientHeight || 1;
      const progress = Math.min(100, Math.round((scrollTop / height) * 100));
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // -----------------------
  // Derived data (useMemo)
  // -----------------------
  const category = useMemo(
    () => article?.article_categories?.[0]?.categories?.name ?? 'Politik',
    [article]
  );

  const topics = useMemo(() => article?.article_topics?.map((t) => t.topics) ?? [], [article]);
  const tags = useMemo(() => article?.article_tags?.map((t) => t.tags) ?? [], [article]);

  const readingTime = useMemo(() => {
    if (!article?.content) return 1;
    const text = article.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = text ? text.split(' ').length : 0;
    return Math.max(1, Math.ceil(words / 200));
  }, [article]);

  const popularArticles = useMemo(() => {
    return [...allArticles]
      .filter((a) => a && a.id !== article?.id)
      .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
      .slice(0, 6);
  }, [allArticles, article]);

  const recommendedByCategory = useMemo(() => {
    if (!article) return [];
    return [...allArticles]
      .filter(
        (a) =>
          a &&
          a.id !== article.id &&
          (a.article_categories?.some((c) => c.categories?.name === category) ?? false)
      )
      .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
      .slice(0, 4);
  }, [allArticles, article, category]);

  const relatedByTags = useMemo(() => {
    if (!article || !tags.length) return [];
    const tagIds = new Set(tags.map((t) => t.id));
    return [...allArticles]
      .filter((a) => a && a.id !== article.id)
      .map((a) => {
        const matchCount =
          a.article_tags?.reduce((acc, at) => acc + (tagIds.has(at.tags?.id) ? 1 : 0), 0) || 0;
        return { item: a, matchCount };
      })
      .filter((x) => x.matchCount > 0)
      .sort((x, y) => {
        if (y.matchCount !== x.matchCount) return y.matchCount - x.matchCount;
        return new Date(y.item.published_at) - new Date(x.item.published_at);
      })
      .slice(0, 4)
      .map((x) => x.item);
  }, [allArticles, article, tags]);

  // safe share URL (client-only)
  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return window.location.href;
  }, []);

  // -----------------------
  // RENDER (after all hooks)
  // -----------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Memuat artikel...
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-xl text-center">
          <h2 className="text-2xl font-bold mb-4">Artikel tidak ditemukan</h2>
          <p className="text-slate-500 mb-6">
            Kami tidak dapat menemukan artikel yang Anda cari. Mungkin telah dipindahkan atau slug salah.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/berita" className="px-4 py-2 bg-emerald-600 text-white rounded">Kembali ke Berita</Link>
            <button onClick={() => window.location.reload()} className="px-4 py-2 border rounded">Muat ulang</button>
          </div>
        </div>
      </div>
    );
  }

  // final article UI (you can keep your original markup)
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* progress */}
      <div style={{ height: 3 }} className="w-full fixed left-0 top-0 z-[60] bg-transparent">
        <div
          style={{ width: `${scrollProgress}%`, height: '100%', transition: 'width 120ms linear' }}
          className="bg-emerald-600"
        />
      </div>

      {/* main */}
      <main className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <div className="mb-6 flex items-center gap-4">
              <Link href="/berita" className="text-sm text-slate-500 inline-flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" /> Kembali
              </Link>
            </div>

            <div className="mb-4">
              <span className="inline-block text-[11px] font-black uppercase tracking-[0.25em] text-emerald-600 px-3 py-1 rounded-full bg-emerald-50">
                {category}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 mb-6">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-8">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{formatDate(article.published_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{(article.views ?? 0).toLocaleString()} views</span>
              </div>
              <div className="px-2 py-1 bg-slate-50 rounded text-xs text-slate-600">
                {readingTime} min baca
              </div>

              {topics.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {topics.map((t) => (
                    <span key={t.id} className="text-[11px] text-slate-400 uppercase tracking-widest">
                      #{t.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {article.img && (
              <div className="relative rounded-xl overflow-hidden mb-8">
                <img src={article.img} alt={article.title} className="w-full h-[420px] object-cover" loading="lazy" />
                <div className="absolute left-6 bottom-6 bg-gradient-to-t from-black/60 to-transparent px-4 py-2 rounded">
                  <span className="text-xs text-white">{category}</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <span className="font-bold">Bagikan</span>
                <a aria-label="share-twitter" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 bg-slate-50 rounded hover:bg-slate-100">
                  <Share2 className="w-4 h-4" /> Twitter
                </a>
                <a aria-label="share-facebook" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 bg-slate-50 rounded hover:bg-slate-100">
                  <Share2 className="w-4 h-4" /> Facebook
                </a>
              </div>
              <div className="text-xs text-slate-400">Sumber: Editorial ADEGREEN</div>
            </div>

            <article className="prose prose-slate max-w-none">
              {parse(article.content)}
            </article>

            <div className="mt-12 p-6 bg-emerald-50 border border-emerald-100 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="text-slate-900 font-black text-lg">Ingin selalu up-to-date?</div>
                <div className="text-slate-600 text-sm">Dapatkan ringkasan harian berita politik pilihan redaksi ke inbox Anda.</div>
              </div>
              <div className="flex gap-2">
                <input type="email" placeholder="Email Anda" className="px-4 py-3 rounded-lg border border-slate-200" />
                <button className="bg-emerald-600 text-white px-4 py-3 rounded-lg font-bold">Daftar</button>
              </div>
            </div>

            <div className="my-12 border-t border-slate-200" />

            <section className="mb-8">
              <h3 className="text-xl font-black mb-6">Rekomendasi berdasarkan kategori: {category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendedByCategory.length > 0 ? (
                  recommendedByCategory.map((item) => (
                    <Link key={item.id} href={`/berita/${item.slug}`} className="block group p-4 bg-white rounded-lg border border-slate-100 hover:shadow-lg transition">
                      <div className="flex gap-4">
                        <div className="w-28 h-20 bg-slate-200 rounded overflow-hidden flex-shrink-0">
                          <img src={item.img} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                        <div>
                          <div className="text-[11px] text-slate-400 mb-1 uppercase tracking-widest">{item.article_categories?.[0]?.categories?.name ?? category}</div>
                          <h4 className="font-bold text-slate-900 leading-tight line-clamp-2">{item.title}</h4>
                          <div className="text-xs text-slate-500 mt-2">{formatDate(item.published_at)} • {(item.views ?? 0).toLocaleString()} views</div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-slate-400">Belum ada rekomendasi untuk kategori ini.</div>
                )}
              </div>
            </section>

            <section className="mb-20">
              <h3 className="text-xl font-black mb-6">Berita terkait</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedByTags.length > 0 ? (
                  relatedByTags.map((item) => (
                    <Link key={item.id} href={`/berita/${item.slug}`} className="block group p-4 bg-white rounded-lg border border-slate-100 hover:shadow-lg transition">
                      <div className="flex gap-4">
                        <div className="w-28 h-20 bg-slate-200 rounded overflow-hidden flex-shrink-0">
                          <img src={item.img} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                        <div>
                          <div className="text-[11px] text-slate-400 mb-1 uppercase tracking-widest">{item.article_categories?.[0]?.categories?.name ?? 'Politik'}</div>
                          <h4 className="font-bold text-slate-900 leading-tight line-clamp-2">{item.title}</h4>
                          <div className="text-xs text-slate-500 mt-2">{formatDate(item.published_at)} • {(item.views ?? 0).toLocaleString()} views</div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-slate-400">Tidak ditemukan artikel terkait berdasarkan tags.</div>
                )}
              </div>
            </section>
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white border border-slate-100 rounded-xl p-4">
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-4">Terpopuler</h4>
                <div className="space-y-4">
                  {popularArticles.length > 0 ? (
                    popularArticles.map((item, idx) => (
                      <Link key={item.id} href={`/berita/${item.slug}`} className="flex items-start gap-3 group">
                        <div className="flex-shrink-0 w-16 h-12 rounded overflow-hidden bg-slate-100">
                          <img src={item.img} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                        <div className="flex-1">
                          <div className="text-[13px] font-bold text-slate-900 line-clamp-2">{item.title}</div>
                          <div className="text-xs text-slate-400 mt-1">{(item.views ?? 0).toLocaleString()} views • {formatDate(item.published_at)}</div>
                        </div>
                        <div className="text-2xl font-black text-slate-200">{String(idx + 1).padStart(2, '0')}</div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-slate-400 text-sm">Belum ada data populer</div>
                  )}
                </div>
              </div>

              {tags.length > 0 && (
                <div className="bg-white border border-slate-100 rounded-xl p-4">
                  <h5 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-3">Tags</h5>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((t) => (
                      <Link key={t.id} href={`/berita/tag/${t.slug}`} className="px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-xs">
                        {t.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>

      {/* footer */}
      <footer className="bg-white border-t border-slate-100 mt-20">
        <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row items-start justify-between gap-6">
          <div>
            <div className="font-black text-lg">ADE<span style={{ color: '#059669' }}>GREEN</span></div>
            <div className="text-sm text-slate-500 mt-2">Portal berita independen — liputan politik, kebijakan publik, dan analisis mendalam.</div>
          </div>
          <div className="flex gap-8">
            <div>
              <h6 className="font-bold text-sm mb-2">Jelajahi</h6>
              <ul className="text-sm text-slate-500 space-y-1">
                <li><Link href="/berita">Berita</Link></li>
                <li><Link href="/analisis">Analisis</Link></li>
                <li><Link href="/opini">Opini</Link></li>
              </ul>
            </div>
            <div>
              <h6 className="font-bold text-sm mb-2">Kontak</h6>
              <div className="text-sm text-slate-500">redaksi@adegreen.id</div>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-100 text-sm text-slate-400 py-4 text-center">© {new Date().getFullYear()} ADEGREEN. Semua hak cipta dilindungi.</div>
      </footer>
    </div>
  );
}
