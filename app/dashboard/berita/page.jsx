"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Search,
  CalendarDays,
  Eye,
  Filter,
  Heart,
  Bookmark,
  TrendingUp,
  X,
  ChevronDown,
  Megaphone,
  LayoutList,
  Globe,
  PenLine,
  RotateCcw,
} from "lucide-react";

const PLACEHOLDER_IMG = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'><rect width='100%' height='100%' fill='%23f1f5f9'/><g fill='%2394a3b8' font-family='Arial' font-size='22'><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'>Ade Green</text></g></svg>`
)}`;
import Swal from "sweetalert2";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getArticles,
  getCategories,
  getHighlight,
  getTopics,
  updateIsBookmarkedArticle,
  updateIsLikeArticle,
} from "@/services/articles";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

const GlobeNews = dynamic(() => import("@/components/dashboard/GlobeNews"), {
  ssr: false,
  loading: () => (
    <div className="mx-auto aspect-square w-full max-w-md animate-pulse rounded-full bg-slate-100" />
  ),
});

// --- Helper Components ---
const FilterSelect = ({ icon: Icon, value, onChange, placeholder, options }) => (
  <div className="relative group">
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors pointer-events-none">
      <Icon size={16} />
    </div>
    <select
      value={value}
      onChange={onChange}
      className="w-full appearance-none bg-white border border-slate-200 hover:border-emerald-200 focus:border-emerald-500 rounded-lg py-2.5 pl-9 pr-8 text-sm font-medium text-slate-700 focus:outline-none transition-colors cursor-pointer"
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
  const [highlight, setHighlight] = useState("");
  const [loading, setLoading] = useState(true);

  // --- View + Filter State ---
  const [view, setView] = useState("list"); // 'list' | 'globe'
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ category: "", topic: "" });

  const isAdmin = user?.role === "admin" || user?.role === "super admin";

  // --- Fetch Data ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resArt, resCat, resTop, resHigh] = await Promise.all([
        getArticles(),
        getCategories(),
        getTopics(),
        getHighlight(),
      ]);

      setArticles(resArt.articles ?? []);
      setCategories(resCat.categories ?? []);
      setTopics(resTop.topics ?? []);
      setHighlight(
        resHigh.highlight?.[0]?.text || "Selamat Datang di Portal Berita",
      );
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal memuat data berita.",
        confirmButtonColor: "#059669",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReload = () => fetchData();

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const catNames =
        article.article_categories?.map((c) => c.categories?.name) ?? [];
      const topicNames =
        article.article_topics?.map((t) => t.topics?.name) ?? [];

      const matchSearch = (article.title?.toLowerCase() || "").includes(
        search.toLowerCase(),
      );
      const matchCategory = filters.category
        ? catNames.includes(filters.category)
        : true;
      const matchTopic = filters.topic
        ? topicNames.includes(filters.topic)
        : true;
      return matchSearch && matchCategory && matchTopic;
    });
  }, [search, filters, articles]);

  const hasActiveFilter = search || filters.category || filters.topic;
  const resetFilters = () => {
    setSearch("");
    setFilters({ category: "", topic: "" });
  };

  const handleImgError = (e) => {
    if (e.currentTarget.src !== PLACEHOLDER_IMG)
      e.currentTarget.src = PLACEHOLDER_IMG;
  };

  const handleIsBookmarked = async (article) => {
    try {
      await updateIsBookmarkedArticle(article.id, user.id);
      handleReload();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Gagal Update Bookmark", text: err.message });
    }
  };
  const handleIsLiked = async (article) => {
    try {
      await updateIsLikeArticle(article.id, user.id);
      handleReload();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Gagal Update Favorit", text: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-20">
      {/* --- Header Marquee --- */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3 bg-emerald-50/50 border border-emerald-100 rounded-full px-4 py-1.5 overflow-hidden">
            <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-600 shrink-0">
              <Megaphone size={13} />
              Update
            </span>
            <div className="h-4 w-px bg-emerald-200 mx-1" />
            <marquee className="text-xs font-medium text-slate-600 w-full" scrollamount={5}>
              {highlight}
            </marquee>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12 flex flex-col gap-10 lg:flex-row">
        {/* --- Sidebar: filters + menu --- */}
        <aside className="w-full shrink-0 lg:w-72">
          <div className="lg:sticky lg:top-24 space-y-8">
            <div>
              <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900">
                Berita <span className="text-emerald-600">Terkini</span>
              </h1>
              <p className="mt-1.5 text-sm text-slate-500">
                Temukan wawasan terbaru hari ini.
              </p>
            </div>

            {/* Search */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-400">
                Pencarian
              </label>
              <div className="relative">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari judul artikel..."
                  className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm font-medium outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Filters */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-400">
                Filter
              </label>
              <div className="space-y-2.5">
                <FilterSelect
                  icon={Filter}
                  placeholder="Semua Kategori"
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  options={categories}
                />
                <FilterSelect
                  icon={TrendingUp}
                  placeholder="Semua Topik"
                  value={filters.topic}
                  onChange={(e) => setFilters({ ...filters, topic: e.target.value })}
                  options={topics}
                />
              </div>
              {hasActiveFilter && (
                <button
                  onClick={resetFilters}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-red-600"
                >
                  <RotateCcw size={13} /> Reset filter
                </button>
              )}
            </div>

            {/* View mode */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-400">
                Tampilan
              </label>
              <div className="grid grid-cols-2 gap-1 rounded-lg border border-slate-200 p-1">
                <button
                  onClick={() => setView("list")}
                  className={`inline-flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition-colors ${
                    view === "list"
                      ? "bg-emerald-600 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <LayoutList size={15} /> List
                </button>
                <button
                  onClick={() => setView("globe")}
                  className={`inline-flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition-colors ${
                    view === "globe"
                      ? "bg-emerald-600 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Globe size={15} /> Globe
                </button>
              </div>
            </div>

            {/* Quick action */}
            {isAdmin && (
              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-400">
                  Aksi
                </label>
                <Link
                  href="/dashboard/berita/tulis"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700"
                >
                  <PenLine size={15} /> Tulis Berita
                </Link>
              </div>
            )}
          </div>
        </aside>

        {/* --- Main content --- */}
        <main className="min-w-0 flex-1">
          {!loading && (
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-slate-400">
                Menampilkan{" "}
                <span className="font-medium text-slate-600">
                  {filteredArticles.length}
                </span>{" "}
                artikel
              </p>
            </div>
          )}

          {/* ===== GLOBE MODE ===== */}
          {view === "globe" ? (
            loading ? (
              <div className="mx-auto aspect-square w-full max-w-md animate-pulse rounded-full bg-slate-100" />
            ) : filteredArticles.length > 0 ? (
              <div className="py-6">
                <GlobeNews articles={filteredArticles} />
              </div>
            ) : (
              <EmptyState onReset={resetFilters} />
            )
          ) : /* ===== LIST MODE ===== */ loading ? (
            <div className="divide-y divide-slate-100 border-y border-slate-100">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex gap-6 py-8">
                  <Skeleton className="h-28 w-44 shrink-0 rounded-lg bg-slate-200" />
                  <div className="flex-1 space-y-3 py-1">
                    <Skeleton className="h-4 w-1/4 bg-slate-200" />
                    <Skeleton className="h-5 w-3/4 bg-slate-200" />
                    <Skeleton className="h-4 w-full bg-slate-200" />
                    <Skeleton className="h-4 w-2/3 bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="divide-y divide-slate-100 border-y border-slate-100">
              {filteredArticles.map((article) => {
                const categoryName =
                  article.article_categories?.[0]?.categories?.name;
                const isLiked = (article.article_likes ?? []).some(
                  (like) => like.profiles?.id === user.id,
                );
                const isBookmarked = (article.article_bookmarks ?? []).some(
                  (bookmark) => bookmark.profiles?.id === user.id,
                );
                return (
                  <article
                    key={article.id}
                    className="group flex flex-col gap-5 py-8 sm:flex-row"
                  >
                    <Link
                      href={`/dashboard/berita/${article.slug}`}
                      className="relative block aspect-[16/10] w-full shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:h-28 sm:w-44"
                    >
                      <img
                        src={article.img}
                        onError={handleImgError}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-400">
                        {categoryName && (
                          <span className="font-semibold text-emerald-600">
                            {categoryName}
                          </span>
                        )}
                        {categoryName && <span className="h-3 w-px bg-slate-200" />}
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays size={13} />
                          {new Date(article.published_at).toLocaleDateString(
                            "id-ID",
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
                        </span>
                        <span className="h-3 w-px bg-slate-200" />
                        <span className="inline-flex items-center gap-1">
                          <Eye size={13} /> {article.views}
                        </span>
                      </div>

                      <Link href={`/dashboard/berita/${article.slug}`}>
                        <h2 className="font-display text-lg font-semibold leading-snug text-slate-800 transition-colors group-hover:text-emerald-600">
                          {article.title}
                        </h2>
                        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-500">
                          {article.description}
                        </p>
                      </Link>

                      <div className="mt-4 flex items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-1.5">
                          {(article.article_tags ?? [])
                            .slice(0, 3)
                            .map((t, i) => (
                              <span
                                key={i}
                                className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500"
                              >
                                #{t.tags?.name}
                              </span>
                            ))}
                        </div>

                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            onClick={() => handleIsBookmarked(article)}
                            title={isBookmarked ? "Hapus simpan" : "Simpan"}
                            className={`rounded-lg p-2 transition-colors ${
                              isBookmarked
                                ? "text-emerald-600"
                                : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            }`}
                          >
                            <Bookmark
                              size={17}
                              className={isBookmarked ? "fill-current" : ""}
                            />
                          </button>
                          <button
                            onClick={() => handleIsLiked(article)}
                            title={isLiked ? "Batal suka" : "Suka"}
                            className={`rounded-lg p-2 transition-colors ${
                              isLiked
                                ? "text-rose-500"
                                : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            }`}
                          >
                            <Heart
                              size={17}
                              className={isLiked ? "fill-current" : ""}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <EmptyState onReset={resetFilters} />
          )}
        </main>
      </div>
    </div>
  );
}

function EmptyState({ onReset }) {
  return (
    <div className="py-24 text-center">
      <Search size={40} className="mx-auto mb-5 text-slate-300" />
      <h3 className="font-display text-lg font-semibold text-slate-700">
        Tidak ada artikel ditemukan
      </h3>
      <p className="text-slate-500">
        Coba ubah filter atau kata kunci pencarian Anda.
      </p>
      <button
        onClick={onReset}
        className="mt-4 font-medium text-emerald-600 hover:underline"
      >
        Reset Semua Filter
      </button>
    </div>
  );
}
