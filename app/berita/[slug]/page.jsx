'use client';

import { useEffect, useState } from 'react';
import { Clock, Eye } from 'lucide-react';
import { getArticles } from '@/services/articles';
import { formatDate } from '@/utils/date';
import parse from 'html-react-parser';
import Link from 'next/link';

export default function BeritaContent({ params }) {
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { slug } = await params;

      const data = await getArticles();
      const found = data?.articles?.find((item) => item.slug === slug);

      setArticle(found || null);
    };

    fetchData();
  }, [params]);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Memuat artikel...
      </div>
    );
  }

  const category =
    article?.article_categories?.[0]?.categories?.name ?? 'Politik';

  const topics = article?.article_topics?.map((t) => t.topics) ?? [];

  const tags = article?.article_tags?.map((t) => t.tags) ?? [];

  return (
    <main className="bg-[#fafafa] min-h-screen">
      <article className="max-w-4xl mx-auto px-4 py-16">
        {/* CATEGORY */}
        <div className="mb-6">
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-emerald-600">
            {category}
          </span>
        </div>

        {/* TITLE */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.1] text-slate-900 mb-6">
          {article.title}
        </h1>

        {/* META */}
        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 mb-10">
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {formatDate(article.published_at)}
          </span>
          <span className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            {article.views?.toLocaleString()} views
          </span>

          {topics.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {topics.map((topic) => (
                <span
                  key={topic.id}
                  className="text-[10px] font-bold uppercase tracking-widest text-slate-400"
                >
                  #{topic.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* HERO IMAGE */}
        {article.img && (
          <div className="relative overflow-hidden rounded-[28px] mb-14 aspect-[16/9] bg-slate-200">
            <img
              src={article.img}
              alt={article.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        )}

        {/* content */}
        {parse(article.content)}

        {/* DIVIDER */}
        <div className="my-16 border-t border-slate-200" />

        {/* TAGS */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <Link
                href={`/berita/tag/${tag.slug}`}
                key={tag.id}
                className="
                  px-4 py-2
                  rounded-full
                  bg-white
                  border
                  border-slate-200
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-widest
                  text-slate-500
                  hover:border-emerald-500
                  hover:text-emerald-600
                  transition
                "
              >
                {tag.name}
              </Link>
            ))}
          </div>
        )}
      </article>
    </main>
  );
}
