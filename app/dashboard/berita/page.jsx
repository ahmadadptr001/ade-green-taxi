'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  CalendarDays,
  Eye,
  Hash,
  Filter,
  Heart,
  Bookmark,
  TrendingUp,
  X,
  ChevronDown,
} from 'lucide-react';
import Swal from 'sweetalert2';
import { Skeleton } from '@/components/ui/skeleton';
import {
  getArticles,
  getCategories,
  getHighlight,
  getTags,
  getTopics,
  updateIsBookmarkedArticle,
  updateIsLikeArticle,
} from '@/services/articles';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

// --- Helper Components ---
const FilterSelect = ({
  icon: Icon,
  value,
  onChange,
  placeholder,
  options,
}) => (
  <div className="relative group min-w-[150px] flex-1">
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none">
      <Icon size={16} />
    </div>
    <select
      value={value}
      onChange={onChange}
      className="w-full appearance-none bg-white border-2 border-slate-100 hover:border-indigo-100 focus:border-indigo-500 rounded-xl py-2.5 pl-9 pr-8 text-sm font-semibold text-slate-700 focus:outline-none transition-all cursor-pointer shadow-sm"
    >
      <option value="">{placeholder}</option>
      {options.map((opt, i) => (
        <option key={i} value={opt.name}>
          {opt.name}
        </option>
      ))}
    </select>
    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
      <ChevronDown size={14} />
    </div>
  </div>
);

export default function FeedBeritaComponent() {
  const router = useRouter();
  const user = useUser();
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [tags, setTags] = useState([]);
  const [highlight, setHighlight] = useState('');
  const [loading, setLoading] = useState(true);

  // --- Filter State ---
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ category: '', topic: '', tag: '' });

  // --- Fetch Data ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resArt, resCat, resTop, resTag, resHigh] = await Promise.all([
        getArticles(),
        getCategories(),
        getTopics(),
        getTags(),
        getHighlight(),
      ]);

      setArticles(resArt.articles ?? []);
      setCategories(resCat.categories ?? []);
      setTopics(resTop.topics ?? []);
      setTags(resTag.tags ?? []);
      setHighlight(
        resHigh.highlight?.[0]?.text || 'Selamat Datang di Portal Berita'
      );
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Gagal memuat data berita.',
        confirmButtonColor: '#4f46e5',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReload = () => {
    fetchData();
  };

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const catNames =
        article.article_categories?.map((c) => c.categories?.name) ?? [];
      const topicNames =
        article.article_topics?.map((t) => t.topics?.name) ?? [];
      const tagNames = article.article_tags?.map((t) => t.tags?.name) ?? [];

      const matchSearch = (article.title?.toLowerCase() || '').includes(
        search.toLowerCase()
      );
      const matchCategory = filters.category
        ? catNames.includes(filters.category)
        : true;
      const matchTopic = filters.topic
        ? topicNames.includes(filters.topic)
        : true;
      const matchTag = filters.tag ? tagNames.includes(filters.tag) : true;
      return matchSearch && matchCategory && matchTopic && matchTag;
    });
  }, [search, filters, articles]);

  const resetFilters = () => {
    setSearch('');
    setFilters({ category: '', topic: '', tag: '' });
  };

  const handleImgError = (e) => {
    e.currentTarget.src = 'https://via.placeholder.com/800x600?text=No+Image';
  };

  const handleIsBookmarked = async (article) => {
    const article_id = article.id;
    try {
      await updateIsBookmarkedArticle(article_id, user.id);
      handleReload();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Update Bookmark',
        text: err.message,
      });
    }
  };
  const handleIsLiked = async (article) => {
    const article_id = article.id;
    try {
      await updateIsLikeArticle(article_id, user.id);
      handleReload();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Update Favorit',
        text: err.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-20">
      {/* --- Header Marquee --- */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-indigo-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3 bg-indigo-50/50 border border-indigo-100 rounded-full px-4 py-1.5 overflow-hidden">
            <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-indigo-600 shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              Update
            </span>
            <div className="h-4 w-[1px] bg-indigo-200 mx-1" />
            <marquee
              className="text-xs font-medium text-slate-600 w-full"
              scrollamount={5}
            >
              {highlight}
            </marquee>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-8">
        {/* --- Title & Search Section --- */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
            Berita{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Terkini
            </span>
          </h1>
          <p className="text-slate-500 mb-8 font-medium">
            Temukan wawasan terbaru hari ini.
          </p>

          <div className="bg-white p-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="relative flex-[2]">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari topik menarik..."
                  className="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-500 rounded-xl py-3 pl-11 pr-4 text-sm font-medium outline-none transition-all placeholder:text-slate-400"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 flex-[3]">
                <FilterSelect
                  icon={Filter}
                  placeholder="Kategori"
                  value={filters.category}
                  onChange={(e) =>
                    setFilters({ ...filters, category: e.target.value })
                  }
                  options={categories}
                />
                <FilterSelect
                  icon={TrendingUp}
                  placeholder="Topik"
                  value={filters.topic}
                  onChange={(e) =>
                    setFilters({ ...filters, topic: e.target.value })
                  }
                  options={topics}
                />
                <FilterSelect
                  icon={Hash}
                  placeholder="Tags"
                  value={filters.tag}
                  onChange={(e) =>
                    setFilters({ ...filters, tag: e.target.value })
                  }
                  options={tags}
                />

                {(search ||
                  filters.category ||
                  filters.topic ||
                  filters.tag) && (
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* --- Article Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-4">
                <Skeleton className="aspect-[16/10] w-full rounded-2xl bg-slate-200" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/3 bg-slate-200" />
                  <Skeleton className="h-6 w-full bg-slate-200" />
                  <Skeleton className="h-4 w-2/3 bg-slate-200" />
                </div>
              </div>
            ))
          ) : filteredArticles.length > 0 ? (
            filteredArticles.map((article) => {
              const categoryName =
                article.article_categories?.[0]?.categories?.name;
              const isLiked = article.article_likes.some(
                (like) => like.profiles.id === user.id
              );
              console.log(article.article_bookmarks);
              const isBookmarked = article.article_bookmarks.some(
                (bookmark) => bookmark.profiles.id === user.id
              );
              console.log(isLiked, isBookmarked);
              return (
                <section
                  key={article.id}
                  className="group relative flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.2)]"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={article.img}
                      onError={handleImgError}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Overlay Gradient (Hanya muncul dikit di bawah) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60" />

                    {/* Badge Category */}
                    {categoryName && (
                      <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-indigo-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        {categoryName}
                      </span>
                    )}

                    {/* Interaction Buttons (Floating) */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={async (e) => await handleIsBookmarked(article)}
                        className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 border border-white/20 shadow-lg ${
                          isBookmarked
                            ? 'bg-indigo-500 text-white shadow-indigo-500/40'
                            : 'bg-black/20 text-white hover:bg-white hover:text-indigo-600'
                        }`}
                      >
                        <Bookmark
                          size={18}
                          className={isBookmarked ? 'fill-current' : ''}
                        />
                      </button>
                      <button
                        onClick={async (e) => await handleIsLiked(article)}
                        className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 border border-white/20 shadow-lg ${
                          isLiked
                            ? 'bg-rose-500 text-white shadow-rose-500/40'
                            : 'bg-black/20 text-white hover:bg-white hover:text-rose-600'
                        }`}
                      >
                        <Heart
                          size={18}
                          className={isLiked ? 'fill-current' : ''}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-xs font-medium text-slate-400 mb-3">
                      <div className="flex items-center gap-1">
                        <CalendarDays size={14} />
                        {new Date(article.published_at).toLocaleDateString(
                          'id-ID',
                          { day: 'numeric', month: 'short', year: 'numeric' }
                        )}
                      </div>
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      <div className="flex items-center gap-1">
                        <Eye size={14} /> {article.views}
                      </div>
                    </div>

                    <Link href={`/dashboard/berita/${article.slug}`}>
                      <h2 className="text-xl font-bold text-slate-800 leading-snug mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {article.title}
                      </h2>

                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4 flex-1">
                        {article.description}
                      </p>
                    </Link>

                    {/* Footer Card: Tags & Visual Indicators */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex gap-1 overflow-hidden">
                        {(article.article_tags ?? [])
                          .slice(0, 2)
                          .map((t, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-semibold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md"
                            >
                              #{t.tags?.name}
                            </span>
                          ))}
                      </div>

                      {/* Mini Indicator Active State */}
                      <div className="flex gap-2 opacity-50">
                        {isLiked && (
                          <Heart
                            size={14}
                            className="text-rose-500 fill-rose-500"
                          />
                        )}
                        {isBookmarked && (
                          <Bookmark
                            size={14}
                            className="text-indigo-500 fill-indigo-500"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="inline-flex bg-slate-100 p-6 rounded-full text-slate-400 mb-4">
                <Search size={40} />
              </div>
              <h3 className="text-lg font-bold text-slate-700">
                Tidak ada artikel ditemukan
              </h3>
              <p className="text-slate-500">
                Coba ubah filter atau kata kunci pencarian Anda.
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 text-indigo-600 font-semibold hover:underline"
              >
                Reset Semua Filter
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
