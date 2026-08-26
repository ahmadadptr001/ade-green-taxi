"use client";

import Header from "@/components/Header";
import Footer from "@/components/home/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { getArticlesByKeyword } from "@/services/articles";
import { useLanguageStore } from "@/store/languageStore";
import { Search, SearchX, Newspaper, Clock, TrendingUp, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

export default function PencarianPage() {
  const { language } = useLanguageStore();
  const isID = language === "id";

  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [searched, setSearched] = useState(false);

  const searchSeq = useRef(0);

  const runSearch = async (keyword) => {
    const k = (keyword ?? "").trim();
    if (!k) return;
    const seq = ++searchSeq.current;
    setLoading(true);
    setSearched(true);
    try {
      const resp = await getArticlesByKeyword(k);
      if (seq !== searchSeq.current) return;
      setResults(resp.articles || []);
    } catch (err) {
      if (seq !== searchSeq.current) return;
      Swal.fire({ icon: "error", title: err.message });
    } finally {
      if (seq === searchSeq.current) setLoading(false);
    }
  };

  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    const q = localStorage.getItem("query-search") ?? "";
    setQuery(q);
    localStorage.removeItem("query-search");
    if (q) runSearch(q);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    runSearch(query);
  };

  const getCategory = (c) => (typeof c === "object" && c ? c.name : c);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(isID ? "id-ID" : "en-US", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return "";
    }
  };

  const trendingTopics = [
    { label: "Taksi Listrik", query: "taksi listrik" },
    { label: "Kendari", query: "Kendari" },
    { label: "EV", query: "electric vehicle" },
    { label: "Lingkungan", query: "lingkungan" },
  ];

  return (
    <main className="flex min-h-screen flex-col bg-[#f7faf8]">
      <Header />

      {/* Search hero */}
      <section className="relative overflow-hidden border-b border-slate-100 bg-white">
        <div className="pointer-events-none absolute -top-24 right-[-10%] h-72 w-72 rounded-full bg-emerald-200/20 blur-[100px]" />
        <div className="pointer-events-none absolute -top-16 left-[-5%] h-48 w-48 rounded-full bg-teal-100/30 blur-[80px]" />
        <div className="mx-auto w-full max-w-5xl px-5 pb-10 pt-28 sm:pt-32">
          <div className="max-w-3xl">
            <p className="font-hand mb-1 -rotate-2 text-xl text-emerald-600">
              {isID ? "telusuri" : "explore"}
            </p>
            <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {isID ? "Cari Berita" : "Search News"}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {isID
                ? "Temukan kabar terbaru seputar Ade Green TX dan lingkungan."
                : "Find the latest stories about Ade Green TX and the environment."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 max-w-3xl">
            <div className="group flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm transition-all duration-200 focus-within:border-emerald-400 focus-within:shadow-md focus-within:ring-4 focus-within:ring-emerald-50">
              <Search size={20} className="ml-3 shrink-0 text-slate-400 transition-colors group-focus-within:text-emerald-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full min-w-0 bg-transparent px-1 py-2.5 text-slate-800 placeholder:text-slate-400 focus:outline-none"
                placeholder={isID ? "Cari sesuatu..." : "Search something..."}
                autoFocus
              />
              {query && (
                <button
                  type="button"
                  onClick={() => { setQuery(""); setResults(null); setSearched(false); }}
                  className="shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-700 hover:shadow-md active:scale-[0.98]"
              >
                {isID ? "Cari" : "Search"}
              </button>
            </div>
          </form>

          {/* Trending topics */}
          {!searched && (
            <div className="mt-6 max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-3">
                <TrendingUp size={14} />
                {isID ? "Topik populer" : "Trending topics"}
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingTopics.map((topic) => (
                  <button
                    key={topic.query}
                    onClick={() => { setQuery(topic.query); runSearch(topic.query); }}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer"
                  >
                    {topic.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto w-full max-w-5xl flex-1 px-5 py-8">
        <div className="flex gap-8">
          {/* Main results */}
          <div className="min-w-0 flex-1">
            {searched && !loading && (
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  {results && results.length > 0
                    ? isID
                      ? `${results.length} hasil untuk "${query}"`
                      : `${results.length} results for "${query}"`
                    : ""}
                </p>
                {results && results.length > 0 && (
                  <span className="text-xs text-slate-400">
                    {isID ? "Diurutkan relevansi" : "Sorted by relevance"}
                  </span>
                )}
              </div>
            )}

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-4">
                    <Skeleton className="hidden h-28 w-36 shrink-0 rounded-xl bg-slate-100 sm:block" />
                    <div className="flex-1 space-y-3 py-1">
                      <Skeleton className="h-3 w-24 rounded-full bg-slate-100" />
                      <Skeleton className="h-5 w-3/4 bg-slate-100" />
                      <Skeleton className="h-4 w-full bg-slate-100" />
                      <Skeleton className="h-4 w-1/2 bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : results && results.length > 0 ? (
              <div className="space-y-3">
                {results.map((item, idx) => (
                  <Link
                    key={item.id}
                    href={`/berita/${item.slug}`}
                    className="group flex gap-4 rounded-2xl border border-slate-100 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 cursor-pointer"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        className="hidden h-28 w-36 shrink-0 rounded-xl object-cover transition-transform duration-300 group-hover:scale-[1.02] sm:block"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        {getCategory(item.category) && (
                          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
                            {getCategory(item.category)}
                          </span>
                        )}
                        {item.created_at && (
                          <span className="flex items-center gap-1">
                            <Clock size={11} />
                            {formatDate(item.created_at)}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-2 line-clamp-2 text-base font-semibold text-slate-900 transition-colors duration-200 group-hover:text-emerald-600">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-500">{item.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : searched ? (
              <div className="flex flex-col items-center gap-4 py-20 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                  <SearchX size={32} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-800">
                    {isID ? "Tidak ada hasil ditemukan" : "No results found"}
                  </p>
                  <p className="mt-1 max-w-sm text-sm text-slate-500">
                    {isID
                      ? "Coba kata kunci yang berbeda, atau jelajahi semua berita kami."
                      : "Try a different keyword, or browse all our news."}
                  </p>
                </div>
                <div className="flex gap-3 mt-2">
                  <Link
                    href="/beranda"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    {isID ? "Kembali ke Beranda" : "Back to Home"}
                  </Link>
                  <Link
                    href="/berita"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-700 hover:shadow-md active:scale-[0.98]"
                  >
                    <Newspaper size={16} /> {isID ? "Lihat Semua Berita" : "Browse All News"}
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 py-20 text-center text-slate-400">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 ring-1 ring-slate-100">
                  <Search size={32} />
                </div>
                <p className="text-sm text-slate-500">{isID ? "Mulai dengan mengetik kata kunci." : "Start by typing a keyword."}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-28 space-y-6">
              {/* Quick links */}
              <div className="rounded-2xl border border-slate-100 bg-white p-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-4">
                  <Sparkles size={15} className="text-emerald-500" />
                  {isID ? "Jelajahi" : "Explore"}
                </h3>
                <div className="space-y-2">
                  {[
                    { label: isID ? "Semua Berita" : "All News", href: "/berita" },
                    { label: isID ? "Tentang Kami" : "About Us", href: "/beranda/tentang" },
                    { label: isID ? "Bantuan" : "Help Center", href: "/bantuan" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors duration-200 hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Trending */}
              <div className="rounded-2xl border border-slate-100 bg-white p-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-4">
                  <TrendingUp size={15} className="text-emerald-500" />
                  {isID ? "Topik Trending" : "Trending Topics"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {trendingTopics.map((topic) => (
                    <button
                      key={topic.query}
                      onClick={() => { setQuery(topic.query); runSearch(topic.query); }}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer"
                    >
                      {topic.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
