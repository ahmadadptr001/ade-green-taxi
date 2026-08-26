"use client";

import Header from "@/components/Header";
import Footer from "@/components/home/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { getArticlesByKeyword } from "@/services/articles";
import { useLanguageStore } from "@/store/languageStore";
import { ChevronRight, Search, SearchX, ArrowLeft, Newspaper } from "lucide-react";
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

  // Penanda urutan permintaan: respons lama tidak boleh menimpa yang baru.
  const searchSeq = useRef(0);

  const runSearch = async (keyword) => {
    const k = (keyword ?? "").trim();
    if (!k) return;
    const seq = ++searchSeq.current;
    setLoading(true);
    setSearched(true);
    try {
      const resp = await getArticlesByKeyword(k);
      if (seq !== searchSeq.current) return; // sudah ada pencarian lebih baru
      setResults(resp.articles || []);
    } catch (err) {
      if (seq !== searchSeq.current) return;
      Swal.fire({ icon: "error", title: err.message });
    } finally {
      if (seq === searchSeq.current) setLoading(false);
    }
  };

  // Pick up a query handed over from the header search (once).
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

  return (
    <main className="flex min-h-screen flex-col bg-[#f7faf8]">
      <Header />

      {/* Search hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="pointer-events-none absolute -top-24 right-[-10%] h-72 w-72 rounded-full bg-emerald-200/30 blur-[100px]" />
        <div className="mx-auto w-full max-w-3xl px-5 pb-10 pt-28 sm:pt-32">
          <p className="font-hand mb-1 -rotate-2 text-2xl text-emerald-600">
            {isID ? "telusuri" : "explore"}
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {isID ? "Cari Berita" : "Search News"}
          </h1>
          <p className="mt-2 text-slate-500">
            {isID
              ? "Temukan kabar terbaru seputar Ade Green TX dan lingkungan."
              : "Find the latest stories about Ade Green TX and the environment."}
          </p>

          <form onSubmit={handleSubmit} className="mt-6">
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1.5 shadow-sm focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100">
              <Search size={20} className="ml-3 shrink-0 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full min-w-0 bg-transparent px-1 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none"
                placeholder={isID ? "Cari sesuatu..." : "Search something..."}
                autoFocus
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                {isID ? "Cari" : "Search"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto w-full max-w-3xl flex-1 px-5 py-10">
        {searched && !loading && (
          <p className="mb-5 text-sm text-slate-500">
            {results && results.length > 0
              ? isID
                ? `${results.length} hasil untuk “${query}”`
                : `${results.length} results for “${query}”`
              : ""}
          </p>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4">
                <Skeleton className="hidden h-24 w-32 shrink-0 rounded-xl bg-slate-200 sm:block" />
                <div className="w-full space-y-2">
                  <Skeleton className="h-3 w-40 bg-slate-200" />
                  <Skeleton className="h-5 w-3/4 bg-slate-200" />
                  <Skeleton className="h-4 w-full bg-slate-200" />
                  <Skeleton className="h-4 w-2/3 bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : results && results.length > 0 ? (
          <div className="space-y-4">
            {results.map((item) => (
              <Link
                key={item.id}
                href={`/berita/${item.slug}`}
                className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="hidden h-24 w-32 shrink-0 rounded-xl object-cover sm:block"
                  />
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <img src="/favicon.ico" alt="" className="h-3.5 w-3.5 rounded-full" />
                    adegreentx.id <ChevronRight size={12} /> {isID ? "berita" : "news"}
                  </div>
                  {getCategory(item.category) && (
                    <span className="mt-2 inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                      {getCategory(item.category)}
                    </span>
                  )}
                  <h3 className="mt-1.5 line-clamp-2 text-lg font-semibold text-slate-900 transition-colors group-hover:text-emerald-600">
                    {item.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : searched ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <SearchX size={28} className="text-slate-400" />
            </div>
            <p className="text-lg font-semibold text-slate-700">
              {isID ? "Tidak ada hasil" : "No results found"}
            </p>
            <p className="max-w-sm text-sm text-slate-500">
              {isID
                ? "Coba kata kunci lain, atau jelajahi semua berita kami."
                : "Try a different keyword, or browse all our news."}
            </p>
            <Link
              href="/berita"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
            >
              <Newspaper size={16} /> {isID ? "Lihat Semua Berita" : "Browse All News"}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-16 text-center text-slate-400">
            <Search size={36} />
            <p>{isID ? "Mulai dengan mengetik kata kunci." : "Start by typing a keyword."}</p>
          </div>
        )}

        <Link
          href="/beranda"
          className="mt-10 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-emerald-600"
        >
          <ArrowLeft size={16} /> {isID ? "Kembali ke Beranda" : "Back to Home"}
        </Link>
      </section>

      <Footer />
    </main>
  );
}
