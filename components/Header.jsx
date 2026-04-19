"use client";

import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Globe,
  LifeBuoy,
  Search,
  MenuIcon,
  InfoIcon, // Tetap diimpor, bisa berguna untuk icon di mobile menu jika diperlukan
  Mail,
} from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import ID from "../locales/id.json";
import EN from "../locales/en.json";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false); // State untuk efek scroll header

  const searchInputRef = useRef(null);

  const { language, setLanguage } = useLanguageStore();
  const t = language === "id" ? ID : EN;
  const isID = language === "id";

  // Data untuk link ke halaman "Tentang Kami" (dedicated page)
  const aboutUsPageLink = {
    id: 1,
    name: isID ? "Tentang Kami" : "About Us", // Nama yang jelas untuk halaman
    url: "/beranda/tentang",
    icon: InfoIcon,
  };

  // Efek untuk mengubah tampilan header saat scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Efek untuk fokus pada input search saat search overlay terbuka
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [searchOpen]);

  // Efek untuk menonaktifkan scroll body saat menu atau search terbuka
  useEffect(() => {
    document.body.style.overflow = open || searchOpen ? "hidden" : "auto";
  }, [open, searchOpen]);

  // Handler untuk submit form pencarian
  const handleSubmitSearch = async (e) => {
    e.preventDefault();
    if (!searchInputRef.current?.value) return;
    const query = searchInputRef.current.value;
    localStorage.setItem("query-search", query);
    window.location.href = "/beranda/pencarian";
  };

  return (
    <>
      {/* HEADER BAR - Rombakan Total Sesuai Desain Medvi */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/95 shadow-md backdrop-blur-md"
            : "bg-white/90 backdrop-blur-sm border-b border-slate-100"
        }`}
      >
        <div className="mx-auto max-w-screen-xl px-6 h-20 flex items-center justify-between">
          {/* LOGO */}
          <a href="/beranda" className="flex-shrink-0 group">
            <p className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
              ADE<span className="text-emerald-600">GREEN</span>
              <sub className="text-[10px] font-bold text-slate-400 ml-1 align-middle">
                TX
              </sub>
            </p>
          </a>

          {/* NAVBAR KANAN */}
          <nav className="flex items-center gap-3">
            {/* DESKTOP: Link "Tentang Kami" (dedicated page) */}
            <div className="hidden md:block">
              <a
                href={aboutUsPageLink.url}
                className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
              >
                {aboutUsPageLink.name}
              </a>
            </div>

            {/* Language Toggle (Desktop) */}
            <button
              onClick={() => setLanguage(language === "id" ? "en" : "id")}
              className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              <Globe size={16} />
              {language === "id" ? "ID" : "EN"}
            </button>

            {/* SEARCH TRIGGER */}
            <button
              title={isID ? "Cari sesuatu" : "Search something"}
              onClick={() => {
                setSearchOpen(!searchOpen);
                setOpen(false); // Tutup menu mobile jika terbuka
              }}
              className={`p-2 rounded-full transition-all duration-200 ${searchOpen ? "text-emerald-600" : "text-slate-500 hover:bg-slate-50"}`}
            >
              <Search size={20} strokeWidth={2} />
            </button>

            {/* MOBILE MENU TRIGGER */}
            <button
              title={
                open
                  ? isID
                    ? "Tutup menu"
                    : "Close menu"
                  : isID
                    ? "Buka menu"
                    : "Open menu"
              }
              onClick={() => {
                setOpen(!open);
                setSearchOpen(false); // Tutup search overlay jika terbuka
              }}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-50 "
            >
              {open ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </nav>
        </div>

        {/* --- SEARCH OVERLAY --- */}
        <div
          className={`absolute top-full left-0 w-full bg-white border-b border-slate-100 transition-all duration-300 ${searchOpen ? "opacity-100 max-h-24" : "opacity-0 max-h-0 pointer-events-none"}`}
        >
          <div className="max-w-screen-xl mx-auto px-6 py-4">
            <form
              onSubmit={handleSubmitSearch}
              className="relative flex items-center w-full"
            >
              <Search className="absolute left-0 text-slate-400" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={
                  isID ? "Cari di ADEGREEN..." : "Search in ADEGREEN..."
                }
                className="w-full pl-8 pr-10 py-2 text-lg text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent border-none"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute right-0 p-2 text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* --- MOBILE FULL SCREEN MENU (Menggantikan FAB) --- */}
      <div
        className={`fixed inset-0 z-40 bg-white transition-transform duration-500 ease-in-out ${open ? "translate-y-0" : "-translate-y-full"}`}
        style={{ paddingTop: "80px" }}
      >
        {/* Tombol Tutup di Atas Kanan */}
        <div className="absolute top-5 right-5 z-10">
          <button
            onClick={() => setOpen(false)}
            className="p-3 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col h-full w-full pb-20 px-6 overflow-y-auto">
          <div className="flex flex-col items-center gap-8 w-full max-w-md mx-auto">
            {/* MENU UTAMA MOBILE */}
            <nav className="flex flex-col items-center w-full gap-2">
              {[
                { label: t.mainNavbar.service, href: "/beranda#layanan" },
                { label: "Berita", href: "/berita" },
                { label: t.mainNavbar.about, href: "/beranda#tentang" }, // Link ke anchor "Tentang"
                { label: t.mainNavbar.feature, href: "/beranda#fitur" },
                { label: t.mainNavbar.faq, href: "/beranda#faq" },
              ].map((link, idx) => (
                <a
                  key={idx}
                  onClick={() => setOpen(false)}
                  href={link.href}
                  className="w-full text-center py-4 text-xl font-medium text-slate-700 hover:text-emerald-600 border-b border-slate-50 last:border-0"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* MENU TAMBAHAN (Contact & Help) */}
            <div className="w-full pt-8 border-t border-slate-100 flex flex-col gap-4">
              <a
                href="/bantuan"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-3 text-slate-600 font-medium py-3 px-4 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <LifeBuoy size={20} /> {isID ? "Pusat Bantuan" : "Help Center"}
              </a>

              <Link
                href={"mailto:support@adegreentx.id"}
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-3 text-slate-600 font-medium py-3 px-4 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Mail size={20} />
                <span>{isID ? "Hubungi Kami" : "Contact Us"}</span>
              </Link>
            </div>

            {/* LANGUAGE SWITCHER MOBILE */}
            <div className="mt-auto">
              <button
                onClick={() => setLanguage(language === "id" ? "en" : "id")}
                className="px-4   flex items-center justify-center gap-2 w-full py-3 rounded-full border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
              >
                <Globe size={18} />{" "}
                {language === "id"
                  ? "Ganti ke English"
                  : "Switch to Indonesian"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
