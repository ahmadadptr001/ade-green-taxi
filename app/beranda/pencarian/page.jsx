"use client";

import Header from "@/components/Header";
import Footer from "@/components/home/Footer";
import BrandSearch from "@/components/home/search/BrandSearch";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearch } from "@/context/SearchContext";
import { getArticles, getArticlesByKeyword } from "@/services/articles";
import { useLanguageStore } from "@/store/languageStore";
import { ChevronRight, Image, Search, SearchX } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

export default function PencarianPage() {
  const lang = useLanguageStore();
  const isID = lang.language === "id";

  const [loading, setLoading] = useState(false);
  const [thisQuerySearch, setThisQuerySearch] = useState("");
  const [resultSearchData, setResultSearchData] = useState(null);

  useEffect(() => {
    setLoading(true);
    const query = localStorage.getItem("query-search");
    setThisQuerySearch(query ?? "");
    setTimeout(() => {
      localStorage.removeItem("query-search");
    }, 1000);
    setLoading(false);
  }, []);

  const mountRef = useRef(1);
  useEffect(() => {
    (async () => {
      mountRef.current++;
      if (mountRef.current >= 4) return;
      if (!thisQuerySearch) return;
      try {
        setLoading(true);
        const resp = await getArticlesByKeyword(thisQuerySearch);
        setResultSearchData(resp.articles);
        setLoading(false);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: err.message,
        });
        setLoading(false);
      }
    })();
  }, [thisQuerySearch]);

  // handle data pencarian
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!thisQuerySearch) return;

    setLoading(true);
    try {
      const respArticles = await getArticlesByKeyword(thisQuerySearch);
      setResultSearchData(respArticles.articles);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: err.message,
      });
    }
  };

  return (
    <main className=" min-h-screen bg-sky-50 w-full h-full ">
      <Header />

      <div className="max-w-3xl pt-20 p-4">
        {/* brand */}
        <BrandSearch />

        {/* form pencarian */}
        <form onSubmit={handleSubmit} className="py-8">
          <div className="flex flex-nowrap font-semibold items-center gap-3 border border-slate-300 justify-between">
            <input
              value={thisQuerySearch}
              onChange={(e) => setThisQuerySearch(e.target?.value)}
              className="w-full px-3 outline-none border-none"
              placeholder={isID ? "Cari sesuatu..." : "Search something..."}
            />
            <button className="p-3 cursor-pointer bg-emerald-500 h-full">
              <Search size={20} />
            </button>
          </div>
        </form>

        {loading ? (
          <>
            {[1, 2, 3].map((item) => (
              <Skeleton
                key={item}
                className={
                  "px-4 md:p-12 py-8 bg-slate-200 mt-3 w-full flex items-center gap-6 justify-between flex-nowrap"
                }
              >
                <div className="w-full">
                  <Skeleton className="h-4 max-w-[140px] bg-slate-300 rounded-0"></Skeleton>
                  <Skeleton className="h-7 max-w-lg mt-2 bg-slate-300 rounded-0"></Skeleton>
                  <div className="flex items-center gap-1 mt-2">
                    <Skeleton className="h-4 w-full bg-slate-300 rounded-0"></Skeleton>
                  </div>
                  <div className="mt-1">
                    <Skeleton className="h-4 w-full bg-slate-300 rounded-0"></Skeleton>
                  </div>
                </div>
                <div className="hidden md:block">
                  <Skeleton
                    className={
                      "w-40 h-30 bg-slate-300 flex items-center p-4 justify-center"
                    }
                  >
                    <Image className="text-slate-500" />
                  </Skeleton>
                </div>
              </Skeleton>
            ))}
          </>
        ) : (
          <>
            {resultSearchData && resultSearchData.length > 0 ? (
              <article>
                {resultSearchData.map((item) => (
                  <section
                    key={item.id}
                    className="p-3 border-t border-b border-slate-300 flex flex-col gap-2"
                  >
                    <Link
                      href={`/berita/${item.slug}`}
                      className="line-clamp-1 flex-nowrap flex text-sm gap-1 items-center"
                    >
                      <img
                        src="/favicon.ico"
                        alt="favicon"
                        className="w-4 h-4 rounded-full object-cover"
                      />{" "}
                      www.adegreentx.id <ChevronRight size={20} /> berita{" "}
                      <ChevronRight size={20} />
                      <span className="line-clamp-1">{item.slug}</span>
                    </Link>
                    <Link
                      href={`/berita/${item.slug}`}
                      className="text-blue-500 font-normal text-xl"
                    >
                      {item.title}
                    </Link>
                    <p>{item.description}</p>
                  </section>
                ))}
              </article>
            ) : (
              <div className="flex items-center flex-col gap-2 mt-5 md:mt-10">
                <SearchX size={50} className="text-red-300 font-light" />
                <p className="text-slate-500">
                  {isID ? "Pencarian tidak ditemukan" : "No results found"}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-20">
        <Footer />
      </div>
    </main>
  );
}
