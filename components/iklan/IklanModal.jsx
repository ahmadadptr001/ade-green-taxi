"use client";

import { useEffect, useState, useCallback } from "react";
import { X, Smartphone, Leaf, PlayCircle } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";

const SEEN_KEY = "iklan-modal-seen";
const PLAYSTORE_URL =
  "https://play.google.com/store/apps/details?id=com.test211111.CustomerAdeTaxi&pcampaignid=web_share";

export default function IklanModal() {
  const { language } = useLanguageStore();
  const en = language === "en";
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  const close = useCallback(() => {
    setVisible(false);
    try {
      // Don't show again for ~24h.
      localStorage.setItem(SEEN_KEY, String(Date.now()));
    } catch {}
    setTimeout(() => setMounted(false), 300);
  }, []);

  useEffect(() => {
    let last = 0;
    try {
      last = Number(localStorage.getItem(SEEN_KEY)) || 0;
    } catch {}
    if (Date.now() - last < 24 * 60 * 60 * 1000) return; // shown recently

    const t = setTimeout(() => {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    }, 2500);
    return () => clearTimeout(t);
  }, []);

  // Lock scroll + Escape to close while open.
  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [mounted, close]);

  if (!mounted) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={en ? "Ade Green TX promotion" : "Promosi Ade Green TX"}
      onClick={close}
      className={`fixed inset-0 z-[300] flex items-center justify-center px-4 transition-opacity duration-300 ${
        visible ? "bg-black/60 opacity-100" : "bg-black/0 opacity-0"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative flex w-full max-w-xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-300 sm:max-w-2xl lg:max-w-4xl lg:grid lg:grid-cols-2 ${
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* IMAGE */}
        <div className="relative aspect-[4/3] w-full sm:aspect-video lg:aspect-auto lg:h-full">
          <img
            src="/banner.png"
            alt="Ade Green TX"
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent lg:bg-gradient-to-r" />
        </div>

        {/* Close */}
        <button
          onClick={close}
          aria-label={en ? "Close" : "Tutup"}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 backdrop-blur transition hover:bg-white hover:text-emerald-600"
        >
          <X size={18} />
        </button>

        {/* CONTENT */}
        <div className="flex flex-col justify-center gap-5 p-6 sm:p-8 lg:p-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600">
              <Leaf className="text-white" size={22} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl lg:text-3xl">
              Ade Green TX
            </h2>
          </div>

          <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
            {en
              ? "Eco-friendly transport with fast, safe, and transparent booking — right from the app."
              : "Transportasi ramah lingkungan dengan pemesanan cepat, aman, dan transparan langsung dari aplikasi."}
          </p>

          <div className="flex items-center gap-3 text-sm text-slate-600 sm:text-base">
            <Smartphone size={18} className="text-emerald-600" />
            {en
              ? "Book a ride in just a few taps."
              : "Pesan perjalanan tanpa ribet, cukup beberapa tap."}
          </div>

          <div className="flex flex-col gap-3 pt-1 sm:flex-row">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={PLAYSTORE_URL}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 font-semibold text-white transition hover:bg-emerald-600 active:scale-[0.98]"
            >
              <img
                src="/icon-playstore.png"
                alt=""
                className="h-5 w-auto"
                loading="lazy"
              />
              {en ? "Download App" : "Unduh Aplikasi"}
            </a>

            <a
              href="/bantuan/akun"
              onClick={close}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 active:scale-[0.98]"
            >
              <PlayCircle size={18} className="text-emerald-600" />
              {en ? "How to Register" : "Lihat Cara Daftar"}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
