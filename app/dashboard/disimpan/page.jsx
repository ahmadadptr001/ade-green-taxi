'use client';
import { useEffect, useMemo, useState } from 'react';
import { Bookmark, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getArticles } from '@/services/articles';
import { useUser } from '@/context/UserContext';
import { Skeleton } from '@/components/ui/skeleton';

export default function DisimpanPage() {
  const user = useUser();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarked = async () => {
      try {
        const res = await getArticles();

        setArticles(res.articles);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarked();
  }, []);

  const articleFiltered = useMemo(() => {
    if (!articles || !user) return;
    return articles.filter((a) =>
      a.article_bookmarks.some((bookmark) => bookmark.profiles.id === user?.id)
    );
  }, [articles]);
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600">
            <Bookmark size={32} className="fill-current" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Disimpan</h1>
            <p className="text-slate-500">
              Baca kembali artikel yang sudah kamu simpan
            </p>
          </div>
        </div>

        {articleFiltered?.length === 0 && !loading && (
          <div className="text-center py-20 bg-white rounded-3xl">
            <Bookmark size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-500">Daftar bacaanmu masih kosong.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading
            ? [1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-64 w-full rounded-3xl" />
              ))
            : articleFiltered.map((article, i) => (
                <Link
                  href={`/berita/${article.slug}`}
                  key={i}
                  className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md"
                >
                  <img
                    src={article.img}
                    className="rounded-2xl mb-4 aspect-video object-cover"
                  />
                  <h3 className="font-bold text-lg line-clamp-2">
                    {article.title}
                  </h3>
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
}
