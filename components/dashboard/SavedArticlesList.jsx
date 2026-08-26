'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getArticles } from '@/services/articles';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/context/UserContext';

const PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='338'><rect width='100%' height='100%' fill='%23f1f5f9'/></svg>`
)}`;

/**
 * Clean, spacious grid of saved/liked articles. `relationKey` picks the
 * relation to filter by ('article_likes' or 'article_bookmarks').
 */
export default function SavedArticlesList({ title, subtitle, icon: Icon, relationKey }) {
  const user = useUser();
  const [articles, setArticles] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getArticles();
        setArticles(res.articles ?? []);
      } catch {
        setArticles([]);
      }
    })();
  }, []);

  const list = useMemo(() => {
    if (!articles) return null;
    // Tanpa user yang valid, jangan cocokkan apa pun (mencegah baris orphan
    // dengan profiles null dianggap milik pengguna).
    const uid = user?.id;
    if (!uid) return [];
    return articles.filter((a) =>
      a[relationKey]?.some((x) => x.profiles?.id === uid)
    );
  }, [articles, relationKey, user]);

  const loading = list === null;
  const onImgError = (e) => {
    if (e.currentTarget.src !== PLACEHOLDER) e.currentTarget.src = PLACEHOLDER;
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-14 md:px-10 md:py-16">
      <header className="mb-12 flex items-center gap-4">
        {Icon && <Icon size={26} strokeWidth={1.75} className="text-slate-400" />}
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="mt-1 text-slate-500">{subtitle}</p>
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="aspect-[4/3] w-full rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : list.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((article) => (
            <Link
              key={article.id}
              href={`/berita/${article.slug}`}
              className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors hover:border-emerald-300"
            >
              <div className="aspect-video overflow-hidden bg-slate-100">
                <img
                  src={article.img}
                  onError={onImgError}
                  alt={article.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="line-clamp-2 font-medium leading-snug text-slate-800 transition-colors group-hover:text-emerald-700">
                  {article.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-200 py-20 text-center">
          {Icon && <Icon size={36} className="mx-auto mb-4 text-slate-200" />}
          <p className="text-slate-500">Belum ada artikel di sini.</p>
        </div>
      )}
    </div>
  );
}
