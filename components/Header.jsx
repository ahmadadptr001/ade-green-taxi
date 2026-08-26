"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, Globe, LifeBuoy, Search, Mail } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import { usePathname } from "next/navigation";
import ID from "../locales/id.json";
import EN from "../locales/en.json";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef(null); // desktop dropdown input
  const mobileInputRef = useRef(null); // mobile inline input
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const isBeranda = pathname === "/beranda" || pathname === "/";

  useEffect(() => {
    if (!isBeranda) return;
    const onScroll = () => setScrolled(window.scrollY > 200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isBeranda]);

  const showGlass = isBeranda && !scrolled;

  const { language, setLanguage } = useLanguageStore();
  const t = language === "id" ? ID : EN;
  const isID = language === "id";

  const navItems = [
    { label: t.mainNavbar.home, href: "/beranda" },
    { label: t.mainNavbar.service, href: "/beranda#layanan" },
    { label: t.mainNavbar.news, href: "/berita" },
    { label: t.mainNavbar.about, href: "/beranda/tentang" },
    { label: t.mainNavbar.faq, href: "/beranda#faq" },
  ];

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      const id = setTimeout(() => searchInputRef.current?.focus(), 100);
      return () => clearTimeout(id);
    }
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const runSearch = (value) => {
    if (!value) return;
    localStorage.setItem("query-search", value);
    window.location.href = "/beranda/pencarian";
  };

  return (
    <>
      {/* FLOATING LIGHT PILL */}
      <header className="fixed left-1/2 top-3 z-[120] w-[calc(100%-1rem)] -translate-x-1/2 md:w-auto">
        <div className={`flex items-center gap-2 rounded-full px-2 py-2 shadow-sm md:gap-4 md:px-4 transition-all duration-300 ${
          showGlass
            ? "border border-white/10 bg-white/5 backdrop-blur-xl shadow-black/20"
            : "border border-slate-200 bg-white/90 shadow-slate-900/5 backdrop-blur-md"
        }`}>
          {/* MOBILE: elongated search squeezing the menu icon */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              runSearch(mobileInputRef.current?.value);
            }}
            className={`flex flex-1 items-center gap-2 rounded-full px-3 py-1.5 md:hidden ${
              showGlass
                ? "bg-white/10"
                : "bg-slate-100"
            }`}
          >
            <Search size={17} className={`shrink-0 ${showGlass ? "text-white/50" : "text-slate-400"}`} />
            <input
              ref={mobileInputRef}
              type="text"
              placeholder={isID ? "Cari di ADEGREEN..." : "Search ADEGREEN..."}
              className={`w-full min-w-0 bg-transparent text-sm focus:outline-none ${
                showGlass
                  ? "text-white placeholder:text-white/40"
                  : "text-slate-800 placeholder:text-slate-400"
              }`}
            />
          </form>

          {/* DESKTOP: nav links */}
          <nav className="hidden items-center gap-5 px-2 md:flex lg:gap-7">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  showGlass
                    ? "text-white/70 hover:text-white"
                    : "text-slate-600 hover:text-emerald-600"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className={`mx-0.5 hidden h-4 w-px md:block ${showGlass ? "bg-white/10" : "bg-slate-200"}`} />

          {/* DESKTOP: search icon (opens dropdown) + language */}
          <button
            title={isID ? "Cari" : "Search"}
            onClick={() => setSearchOpen((v) => !v)}
            className={`hidden rounded-full p-1.5 transition-colors md:inline-flex ${
              searchOpen
                ? "bg-emerald-50 text-emerald-600"
                : showGlass
                  ? "text-white/60 hover:bg-white/10"
                  : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            <Search size={18} />
          </button>
          <button
            onClick={() => setLanguage(language === "id" ? "en" : "id")}
            className={`hidden items-center gap-1 text-sm font-medium transition-colors md:flex ${
              showGlass
                ? "text-white/60 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Globe size={15} />
            {language === "id" ? "ID" : "EN"}
          </button>

          {/* MOBILE: menu trigger */}
          <button
            title={open ? (isID ? "Tutup" : "Close") : "Menu"}
            onClick={() => setOpen((v) => !v)}
            className={`shrink-0 rounded-full p-1.5 transition-colors md:hidden ${
              showGlass
                ? "text-white/70 hover:bg-white/10"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* DESKTOP search dropdown */}
        <div
          className={`absolute left-1/2 top-full mt-2 hidden w-[min(92vw,36rem)] -translate-x-1/2 overflow-hidden rounded-2xl shadow-lg transition-all duration-300 md:block ${
            showGlass
              ? `border border-white/10 bg-black/60 backdrop-blur-xl shadow-black/30 ${
                  searchOpen
                    ? "max-h-24 opacity-100"
                    : "pointer-events-none max-h-0 border-transparent opacity-0"
                }`
              : `border border-slate-200 bg-white shadow-slate-900/5 ${
                  searchOpen
                    ? "max-h-24 opacity-100"
                    : "pointer-events-none max-h-0 border-transparent opacity-0"
                }`
          }`}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              runSearch(searchInputRef.current?.value);
            }}
            className="flex items-center gap-3 px-5 py-4"
          >
            <Search size={20} className={showGlass ? "text-white/40" : "text-slate-400"} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={
                isID ? "Cari di ADEGREEN..." : "Search in ADEGREEN..."
              }
              className={`w-full bg-transparent text-base focus:outline-none ${
                showGlass
                  ? "text-white placeholder:text-white/40"
                  : "text-slate-800 placeholder:text-slate-400"
              }`}
            />
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className={showGlass ? "text-white/40 hover:text-white" : "text-slate-400 hover:text-slate-600"}
            >
              <X size={18} />
            </button>
          </form>
        </div>
      </header>

      {/* MOBILE FULL-SCREEN MENU */}
      <div
        className={`fixed inset-0 z-[110] overflow-y-auto bg-white transition-transform duration-500 ease-in-out md:hidden ${
          open ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ paddingTop: "80px" }}
      >
        <div className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-md flex-col gap-8 px-6 pb-20">
          <nav className="flex flex-col">
            {navItems.map((item, idx) => (
              <a
                key={idx}
                onClick={() => setOpen(false)}
                href={item.href}
                className="border-b border-slate-100 py-4 text-center text-xl font-medium text-slate-700 last:border-0 hover:text-emerald-600"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-4 border-t border-slate-100 pt-6">
            <a
              href="/bantuan"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-3 rounded-lg py-3 text-slate-600 transition-colors hover:bg-slate-50"
            >
              <LifeBuoy size={20} /> {isID ? "Pusat Bantuan" : "Help Center"}
            </a>
            <a
              href="mailto:support@adegreentx.id"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-3 rounded-lg py-3 text-slate-600 transition-colors hover:bg-slate-50"
            >
              <Mail size={20} /> {isID ? "Hubungi Kami" : "Contact Us"}
            </a>
          </div>

          <button
            onClick={() => setLanguage(language === "id" ? "en" : "id")}
            className="mt-auto flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 py-3 font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            <Globe size={18} />
            {language === "id" ? "Ganti ke English" : "Switch to Indonesian"}
          </button>
        </div>
      </div>
    </>
  );
}
