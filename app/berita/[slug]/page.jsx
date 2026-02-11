'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Clock,
  Eye,
  Share2,
  ChevronLeft,
  ArrowRight,
  Bookmark,
  TrendingUp,
  Quote,
  ExternalLink,
  Heart,
} from 'lucide-react';
import {
  getArticles,
  updateIsBookmarkedArticle,
  updateIsLikeArticle,
  updateViewArticle,
} from '@/services/articles';
import { formatDate } from '@/utils/date';
import parse, { domToReact } from 'html-react-parser';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { useUser } from '@/context/UserContext';

async function shareLink(title, description, url) {
  if (!url) return;

  try {
    if (navigator.share) {
      await navigator.share({
        title: title,
        text: description,
        url: url,
      });
    } else {
      await navigator.clipboard.writeText(url);
    }
  } catch (e) {
    console.error(e);
  }
}

export default function BeritaContent({ params }) {
  const router = useRouter();
  const user = useUser();
  const [slug, setSlug] = useState(null);
  const [allArticles, setAllArticles] = useState([]);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const contentParserOptions = {
    replace: (domNode) => {
      // Handle Blockquotes
      if (domNode.name === 'blockquote') {
        return (
          <div className="my-8 pl-6 border-l-4 border-emerald-500 bg-slate-50 py-4 pr-4 rounded-r-lg relative overflow-hidden group">
            <Quote className="absolute top-2 left-2 w-6 h-6 text-emerald-100 -z-0 transform -scale-x-100" />
            <div className="relative z-10 font-serif text-lg italic text-slate-700 leading-relaxed">
              {domToReact(domNode.children, contentParserOptions)}
            </div>
          </div>
        );
      }

      // Handle Images
      if (domNode.name === 'img') {
        return (
          <figure className="my-10 group">
            <div className="rounded-xl overflow-hidden shadow-lg border border-slate-100 bg-slate-50">
              <img
                {...domNode.attribs}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                loading="lazy"
              />
            </div>
            {domNode.attribs.alt && (
              <figcaption className="mt-3 text-center text-xs text-slate-400 font-medium tracking-wide uppercase">
                {domNode.attribs.alt}
              </figcaption>
            )}
          </figure>
        );
      }

      // Handle Links
      if (domNode.name === 'a') {
        const href = domNode.attribs.href || '#';
        const isInternal = href.startsWith('/');
        const className =
          'inline-flex items-center gap-0.5 text-emerald-600 font-semibold border-b border-emerald-200 hover:border-emerald-600 hover:bg-emerald-50 transition-all decoration-0';

        if (isInternal) {
          return (
            <Link href={href} className={className}>
              {domToReact(domNode.children, contentParserOptions)}
            </Link>
          );
        }
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
          >
            {domToReact(domNode.children, contentParserOptions)}
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
          </a>
        );
      }

      // Handle Lists
      if (domNode.name === 'ul') {
        return (
          <ul className="my-6 pl-6 space-y-2 list-disc list-outside text-slate-700 marker:text-slate-400">
            {domToReact(domNode.children, contentParserOptions)}
          </ul>
        );
      }
      if (domNode.name === 'ol') {
        return (
          <ol className="my-6 pl-6 space-y-2 list-decimal list-outside text-slate-700 marker:text-emerald-600 marker:font-bold">
            {domToReact(domNode.children, contentParserOptions)}
          </ol>
        );
      }
      if (domNode.name === 'li') {
        return (
          <li className="pl-1 leading-relaxed">
            {domToReact(domNode.children, contentParserOptions)}
          </li>
        );
      }
    },
  };

  useEffect(() => {
    let mounted = true;
    const resolveParams = async () => {
      try {
        const resolved = await params;
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getArticles();
      const articles = Array.isArray(data?.articles) ? data.articles : [];
      setAllArticles(articles);

      if (slug) {
        const found = articles.find((a) => a.slug === slug) || null;
        setArticle(found);
        setIsLiked(
          found.article_likes.some((like) => like.profiles.id === user?.id)
        );
        setIsBookmarked(
          found.article_bookmarks.some(
            (bookmark) => bookmark.profiles.id === user?.id
          )
        );
        if (!Boolean(found)) {
          setNotFound(false);
          return;
        }
        await updateViewArticle(found.views, found.slug);
      } else {
        setArticle(null);
        setNotFound(true);
      }
    } catch (err) {
      console.error('Failed fetching articles', err);
      setAllArticles([]);
      setArticle(null);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug !== null) {
      fetchData();
    }
  }, [slug]);

  const handleReload = () => {
    if (!slug) return;
    fetchData();
  };

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

  const category = useMemo(
    () => article?.article_categories?.[0]?.categories?.name ?? 'Politik',
    [article]
  );

  const topics = useMemo(
    () => article?.article_topics?.map((t) => t.topics) ?? [],
    [article]
  );
  const tags = useMemo(
    () => article?.article_tags?.map((t) => t.tags) ?? [],
    [article]
  );

  const readingTime = useMemo(() => {
    if (!article?.content) return 1;
    const text = article.content
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
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
          (a.article_categories?.some((c) => c.categories?.name === category) ??
            false)
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
          a.article_tags?.reduce(
            (acc, at) => acc + (tagIds.has(at.tags?.id) ? 1 : 0),
            0
          ) || 0;
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

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return window.location.href;
  }, []);

  // ---------------------------------------------------------------------------
  // RENDER UI
  // ---------------------------------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
        <div className="text-slate-400 font-medium tracking-wide animate-pulse">
          Memuat artikel...
        </div>
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-slate-50">
        <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl text-center border border-slate-100">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 text-red-500 rounded-full mb-6">
            <Bookmark className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-3">
            Artikel Tidak Ditemukan
          </h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Halaman yang Anda cari mungkin telah dihapus atau tautannya
            kedaluwarsa.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/berita"
              className="w-full inline-flex justify-center items-center px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
            >
              Kembali ke Beranda
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="w-full inline-flex justify-center items-center px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Coba Muat Ulang
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleBookmarked = async () => {
    if (!user) {
      Swal.fire({
        icon: 'warning',
        text: 'Silhakan login terlebih dahulu!',
        showCancelButton: true,
        confirmButtonText: 'Login',
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/masuk');
        }
      });
      return;
    }
    try {
      await updateIsBookmarkedArticle(article.id, user.id);
      handleReload();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: err.message,
      });
    }
  };
  const handleIsLiked = async () => {
    if (!user) {
      Swal.fire({
        icon: 'warning',
        text: 'Silhakan login terlebih dahulu!',
        showCancelButton: true,
        confirmButtonText: 'Login',
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/masuk');
        }
      });
      return;
    }
    try {
      await updateIsLikeArticle(article.id, user.id);
      handleReload();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: err.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-[100] bg-transparent">
        <div
          style={{
            width: `${scrollProgress}%`,
            transition: 'width 150ms ease-out',
          }}
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
        />
      </div>

      <main className="container mx-auto px-4 lg:px-8 py-8 lg:py-16">
        {/* Navigation */}
        <div className="max-w-7xl mx-auto mb-12">
          <button
            onClick={() => history.back()}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-emerald-600 transition-colors"
          >
            <div className="p-2 rounded-full bg-slate-50 group-hover:bg-emerald-50 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </div>
            <span>Kembali ke Berita</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20 max-w-7xl mx-auto">
          {/* Main Content Column */}
          <article className="lg:col-span-8">
            {/* Article Header */}
            <header className="mb-10 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[11px] font-bold uppercase tracking-widest mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {category}
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1] mb-8">
                {article.title}
              </h1>

              {/* Metadata Row */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-y-4 gap-x-6 text-sm text-slate-500 font-medium border-y border-slate-100 py-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  <span>{formatDate(article.published_at)}</span>
                </div>
                <div className="hidden md:block w-1 h-1 rounded-full bg-slate-300" />
                <div className="flex items-center gap-2">
                  <div className="text-slate-400">Waktu baca</div>
                  <span className="text-slate-900">{readingTime} menit</span>
                </div>
                <div className="hidden md:block w-1 h-1 rounded-full bg-slate-300" />
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-slate-400" />
                  <span>{(article.views ?? 0).toLocaleString()} pembaca</span>
                </div>
              </div>
            </header>

            {/* Hero Image */}
            {article.img && (
              <figure className="relative mb-12 group rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50">
                <div className="aspect-[16/9] w-full bg-slate-100 overflow-hidden">
                  <img
                    src={article.img}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                  />
                </div>
              </figure>
            )}

            {/* Article Body */}
            <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
              {/* Left Side: Share & Actions (Desktop Sticky) */}
              <div className="hidden md:block md:w-12 flex-shrink-0">
                <div className="sticky top-32 flex flex-col gap-4 items-center">
                  <div className="flex flex-col gap-3 pb-6 border-b border-slate-100 w-full items-center">
                    <button
                      onClick={handleIsLiked}
                      className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all shadow-sm ${
                        isLiked
                          ? 'bg-red-50 border-red-200 text-red-500'
                          : 'bg-white border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200'
                      }`}
                      title="Suka artikel ini"
                    >
                      <Heart
                        className={`w-5 h-5 ${isLiked ? 'fill-red-500' : ''}`}
                      />
                    </button>

                    <button
                      onClick={handleBookmarked}
                      className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all shadow-sm ${
                        isBookmarked
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                          : 'bg-white border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200'
                      }`}
                      title="Simpan artikel"
                    >
                      <Bookmark
                        className={`w-5 h-5 ${isBookmarked ? 'fill-indigo-600' : ''}`}
                      />
                    </button>
                  </div>
                  {/* ------------------------------------- */}

                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest vertical-rl py-4">
                    Bagikan
                  </div>
                  <button
                    onClick={() =>
                      shareLink(
                        article.title,
                        article.description,
                        window.location.href
                      )
                    }
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-slate-200 text-slate-500 hover:bg-black hover:text-white hover:border-black transition-all shadow-sm"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <a
                    aria-label="Share on Facebook"
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-slate-200 text-slate-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Content Rendering Area */}
              <div className="flex-1 min-w-0">
                <div
                  className="font-normal text-lg md:text-[1.15rem] leading-[1.8] text-slate-800
                      [&>p]:mb-8 [&>p]:text-slate-700
                      [&>h1]:text-4xl [&>h1]:font-black [&>h1]:text-slate-900 [&>h1]:mt-12 [&>h1]:mb-6 [&>h1]:tracking-tight
                      [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:text-slate-900 [&>h2]:mt-14 [&>h2]:mb-6 [&>h2]:tracking-tight [&>h2]:leading-snug
                      [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:text-slate-900 [&>h3]:mt-10 [&>h3]:mb-4 [&>h3]:tracking-tight
                      [&>h4]:text-xl [&>h4]:font-bold [&>h4]:text-slate-900 [&>h4]:mt-8 [&>h4]:mb-4
                      [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-8 [&_ul]:marker:text-slate-400
                      [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-8 [&_ol]:marker:text-emerald-600 [&_ol]:marker:font-bold
                      [&_li]:pl-2 [&_li]:mb-2
                      [&_strong]:font-bold [&_strong]:text-slate-900
                      [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-xl [&_iframe]:my-10 [&_iframe]:shadow-lg
                    "
                >
                  {parse(article.content, contentParserOptions)}
                </div>

                {/* Topics / Tags */}
                {topics.length > 0 && (
                  <div className="mt-12 flex flex-wrap gap-2 pt-8 border-t border-slate-100">
                    {topics.map((t) => (
                      <span
                        key={t.id}
                        className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 py-1 bg-slate-100 rounded"
                      >
                        #{t.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Mobile Actions & Share */}
                <div className="md:hidden mt-8 py-6 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-slate-900">
                      Interaksi
                    </span>
                    <div className="flex gap-2 sm:gap-3">
                      <button
                        onClick={handleIsLiked}
                        className={`flex items-center gap-2 px-2 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                          isLiked
                            ? 'bg-red-50 text-red-600'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Heart
                          className={`w-5 h-5 ${isLiked ? 'fill-red-600' : ''}`}
                        />
                      </button>
                      <button
                        onClick={handleBookmarked}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                          isBookmarked
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Bookmark
                          className={`w-5 h-5 ${isBookmarked ? 'fill-emerald-600' : ''}`}
                        />
                      </button>
                    </div>
                    {/* -------------------------------------- */}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">
                      Bagikan
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          shareLink(
                            article.title,
                            article.description,
                            window.location.href
                          )
                        }
                        className="p-2 bg-slate-100 rounded-lg text-slate-600"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-slate-100 rounded-lg text-slate-600"
                      >
                        <svg
                          className="w-5 h-5 fill-current"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Newsletter Box */}
                <div className="mt-16 relative overflow-hidden bg-slate-900 rounded-2xl p-8 lg:p-10 text-white">
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-600/20 blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-blue-600/20 blur-3xl"></div>

                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-2xl font-black tracking-tight mb-2">
                        Briefing Pagi
                      </h3>
                      <p className="text-slate-300">
                        Dapatkan ringkasan berita politik terpanas langsung di
                        inbox Anda. Tanpa spam.
                      </p>
                    </div>
                    <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                      <input
                        type="email"
                        placeholder="Alamat Email"
                        className="bg-white/10 border border-white/20 text-white placeholder-slate-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full md:w-64 backdrop-blur-sm"
                      />
                      <button
                        onClick={() => router.push('/masuk')}
                        className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-emerald-900/20"
                      >
                        Daftar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations Section */}
            <div className="mt-20 lg:mt-32">
              <div className="flex items-end justify-between mb-8">
                <h3 className="text-2xl font-black tracking-tight text-slate-900">
                  Bacaan Selanjutnya
                </h3>
                <div className="h-px flex-1 bg-slate-100 ml-6 hidden sm:block"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {recommendedByCategory.length > 0 ? (
                  recommendedByCategory.map((item) => (
                    <Link
                      key={item.id}
                      href={`/berita/${item.slug}`}
                      className="group flex flex-col h-full bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 hover:border-emerald-100 transition-all duration-300"
                    >
                      <div className="h-48 overflow-hidden bg-slate-100 relative">
                        <img
                          src={item.img}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest mb-3">
                          {item.article_categories?.[0]?.categories?.name ??
                            category}
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 leading-snug mb-3 group-hover:text-emerald-700 transition-colors">
                          {item.title}
                        </h4>
                        <div className="mt-auto pt-4 flex items-center justify-between text-xs font-medium text-slate-400 border-t border-slate-50">
                          <span>{formatDate(item.published_at)}</span>
                          <span className="flex items-center gap-1 group-hover:text-emerald-600 transition-colors">
                            Baca <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-2 py-12 text-center border-2 border-dashed border-slate-100 rounded-2xl text-slate-400">
                    Tidak ada rekomendasi tambahan saat ini.
                  </div>
                )}
              </div>
            </div>

            {/* Related by Tags */}
            <div className="mt-16">
              <h3 className="text-xl font-bold text-slate-900 mb-6">
                Terkait Topik Ini
              </h3>
              <div className="space-y-4">
                {relatedByTags.length > 0 ? (
                  relatedByTags.map((item) => (
                    <Link
                      key={item.id}
                      href={`/berita/${item.slug}`}
                      className="group block p-4 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg bg-slate-200 overflow-hidden flex-shrink-0">
                          <img
                            src={item.img}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 line-clamp-2">
                            {item.title}
                          </h4>
                          <div className="text-xs text-slate-500 mt-1">
                            {formatDate(item.published_at)}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-slate-400 italic">
                    Tidak ada artikel terkait tags.
                  </p>
                )}
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-12">
            {/* Sticky Container */}
            <div className="sticky top-24 space-y-10">
              {/* Popular Widget */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 lg:p-8">
                <div className="flex items-center gap-2 mb-6 text-slate-900">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  <h4 className="font-black text-lg tracking-tight">
                    Terpopuler
                  </h4>
                </div>

                <div className="flex flex-col gap-6">
                  {popularArticles.length > 0 ? (
                    popularArticles.map((item, idx) => (
                      <Link
                        key={item.id}
                        href={`/berita/${item.slug}`}
                        className="group flex gap-4 items-start"
                      >
                        <img
                          className="w-12 h-12 rounded-md object-cover"
                          src={item.img}
                          alt={item.name}
                          loading="lazy"
                        />
                        <div>
                          <h5 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-3">
                            {item.title}
                          </h5>
                          <div className="mt-2 flex items-center gap-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                            <span>
                              {(item.views ?? 0).toLocaleString()} Views
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-slate-400 text-sm py-4">
                      Data belum tersedia
                    </div>
                  )}
                </div>
              </div>

              {/* Tags Cloud */}
              {tags.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                    Tags
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((t) => (
                      <Link
                        key={t.id}
                        href={`/berita/tag/${t.slug}`}
                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-medium hover:border-emerald-500 hover:text-emerald-600 transition-colors"
                      >
                        #{t.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>

      {/* Modern Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 mt-20">
        <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="max-w-sm">
              <div className="font-black text-2xl tracking-tighter mb-4">
                ADE<span className="text-emerald-600">GREEN</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Platform jurnalisme independen yang menyajikan perspektif
                mendalam tentang politik, kebijakan, dan masa depan demokrasi.
              </p>
            </div>

            <div className="flex gap-12 lg:gap-24">
              <div>
                <h6 className="font-bold text-slate-900 mb-4">Editorial</h6>
                <ul className="space-y-3 text-sm text-slate-500">
                  <li>
                    <Link href="/berita" className="hover:text-emerald-600">
                      Berita Utama
                    </Link>
                  </li>
                  <li>
                    <Link href="/analisis" className="hover:text-emerald-600">
                      Analisis Mendalam
                    </Link>
                  </li>
                  <li>
                    <Link href="/opini" className="hover:text-emerald-600">
                      Opini & Esai
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h6 className="font-bold text-slate-900 mb-4">Perusahaan</h6>
                <ul className="space-y-3 text-sm text-slate-500">
                  <li>
                    <Link href="/tentang" className="hover:text-emerald-600">
                      Tentang Kami
                    </Link>
                  </li>
                  <li>
                    <Link href="/karir" className="hover:text-emerald-600">
                      Karir
                    </Link>
                  </li>
                  <li>
                    <Link href="/kontak" className="hover:text-emerald-600">
                      Kontak
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
            <div>
              &copy; {new Date().getFullYear()} AdeGreenTX. All rights reserved.
            </div>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-slate-600">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-slate-600">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
