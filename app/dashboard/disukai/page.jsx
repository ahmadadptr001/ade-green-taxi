'use client';
import { useEffect, useMemo, useState } from 'react';
import { Heart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getArticles } from '@/services/articles';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/context/UserContext';

export default function DisukaiPage() {
  const user = useUser();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiked = async () => {
      try {
        const res = await getArticles();
        // Filter hanya yang isLiked = true
        setArticles(res.articles)
      } finally {
        setLoading(false);
      }
    };
    fetchLiked();
  }, []);

  const articleFiltered = useMemo(() => {
      if (!articles || !user) return;
      return articles.filter((a) =>
        a.article_likes.some((bookmark) => bookmark.profiles.id === user?.id)
      );
    }, [articles]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-7xl mx-auto">

        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-rose-100 rounded-2xl text-rose-600">
            <Heart size={32} className="fill-current" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Artikel Disukai
            </h1>
            <p className="text-slate-500">
              Koleksi berita yang kamu beri tanda cinta
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-3xl" />
            ))}
          </div>
        ) : articleFiltered?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Gunakan komponen card yang sama seperti di Feed Berita */}
            {articleFiltered.map((article, i) => (
              <Link
                href={`/berita/${article.slug}`}
                key={i}
                className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm"
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
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <Heart size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-500">Belum ada artikel yang disukai.</p>
          </div>
        )}
      </div>
    </div>
  );
}
