'use client';

import Header from '@/components/Header';
import Footer from '@/components/home/Footer';
import { formatDate } from '@/utils/date';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const placeholderSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='700' height='438'><rect width='100%' height='100%' fill='%23f1f5f9'/><g fill='%2394a3b8' font-family='Arial' font-size='20'><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'>Ade Green</text></g></svg>`;
const PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(placeholderSvg)}`;

/**
 * Shared archive list for /berita/{kategori,tag,topik}/[slug].
 * `fetcher(slug)` should resolve `{ articles }`. `kind` is the label
 * (Kategori / Tag / Topik).
 */
export default function ArchiveList({ params, fetcher, kind }) {
  const [slug, setSlug] = useState('');
  const [query, setQuery] = useState('');
  const [articles, setArticles] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { slug: s } = await params;
        setSlug(s);
        const resp = await fetcher(s);
        // Draft (tanpa published_at) disembunyikan dari daftar publik.
        const all = resp?.articles || [];
        setArticles(all.filter((a) => a.published_at));
      } catch (e) {
        console.error(e);
        setArticles([]);
      }
    })();
  }, []);

  const label = slug.replace(/-/g, ' ');
  const display = kind === 'Tag' ? `#${label}` : label;

  const filtered = useMemo(() => {
    if (!articles) return null;
    const q = query.toLowerCase().trim();
    if (!q) return articles;
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.description?.toLowerCase().includes(q)
    );
  }, [articles, query]);

  const loading = articles === null;
  const onImgError = (e) => {
    if (e?.currentTarget && e.currentTarget.src !== PLACEHOLDER)
      e.currentTarget.src = PLACEHOLDER;
  };

  return (
    <main className="min-h-screen bg-[#f7faf8] text-slate-900">
      <Header />

      <section className="border-b border-slate-200 bg-white pt-24">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <nav className="mb-4 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/berita" className="hover:text-emerald-600">Berita</Link>
            <span>/</span>
            <span className="text-slate-400">{kind}</span>
            <span>/</span>
            <span className="capitalize text-slate-800">{label}</span>
          </nav>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-hand -rotate-2 text-2xl text-emerald-600">{kind.toLowerCase()}</p>
              <h1 className="font-display text-4xl font-medium capitalize text-slate-900 md:text-5xl">
                {display}
              </h1>
              <p className="mt-2 max-w-xl text-slate-500">
                Kumpulan berita terbaru seputar{' '}
                <span className="font-medium capitalize">{label}</span>.
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <Search size={16} className="absolute left-3 top-3.5 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Cari di ${label}...`}
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm focus:border-emerald-400 focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        {loading ? (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-28 text-center">
            <h3 className="text-xl font-semibold text-slate-900">Belum ada berita</h3>
            <p className="mt-2 text-sm text-slate-500">
              Saat ini belum tersedia berita untuk{' '}
              <span className="capitalize text-slate-700">{label}</span>.
            </p>
            <Link
              href="/berita"
              className="mt-5 inline-block rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
            >
              Lihat Semua Berita
            </Link>
          </div>
        ) : (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((article) => (
              <Link
                key={article.id}
                href={`/berita/${article.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={article.img}
                    onError={onImgError}
                    alt={article.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-2 text-xs text-slate-400">
                    {formatDate(article.published_at)}
                  </div>
                  <h2 className="font-display text-lg font-medium leading-snug text-slate-900 transition-colors group-hover:text-emerald-700 line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                    {article.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-emerald-600">
                    Baca selengkapnya →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
