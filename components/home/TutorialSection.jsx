"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  MapPin,
  MapPinned,
  CreditCard,
} from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import { cn } from "@/lib/utils";

const AUTO_PLAY_DURATION = 5000; // ms per langkah

export default function TutorialSection() {
  const { language } = useLanguageStore();
  const en = language === "en";

  const STEPS = [
    {
      id: "01",
      titleEN: "Open App & Search",
      titleID: "Buka & Cari",
      descEN: "Open the Ade Green app and search for your destination.",
      descID: "Buka aplikasi Ade Green lalu cari tujuan perjalanan Anda.",
      image: "/tutorial/step-1.png",
      Icon: Search,
    },
    {
      id: "02",
      titleEN: "Set Pickup & Destination",
      titleID: "Jemput & Tujuan",
      descEN: "Choose your pickup point and confirm where you want to go.",
      descID: "Tentukan titik jemput dan konfirmasi ke mana Anda ingin pergi.",
      image: "/tutorial/step-2.png",
      Icon: MapPin,
    },
    {
      id: "03",
      titleEN: "Confirm Pickup",
      titleID: "Konfirmasi Jemput",
      descEN: "Check the pin on the map and confirm your pickup location.",
      descID: "Periksa pin pada peta lalu konfirmasi lokasi penjemputan.",
      image: "/tutorial/step-3.png",
      Icon: MapPinned,
    },
    {
      id: "04",
      titleEN: "Pay & Enjoy",
      titleID: "Bayar & Nikmati",
      descEN: "Confirm the fare and enjoy a clean, zero-emission ride.",
      descID: "Konfirmasi tarif dan nikmati perjalanan nol emisi yang nyaman.",
      image: "/tutorial/step-4.png",
      Icon: CreditCard,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const handleNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % STEPS.length);
  }, [STEPS.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + STEPS.length) % STEPS.length);
  }, [STEPS.length]);

  const handleTabClick = (index) => {
    if (index === activeIndex) return;
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
    setIsPaused(false);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(handleNext, AUTO_PLAY_DURATION);
    return () => clearInterval(interval);
  }, [activeIndex, isPaused, handleNext]);

  const active = STEPS[activeIndex];

  return (
    <section className="w-full bg-white py-20 md:py-28 lg:py-32">
      {/* keyframes for the progress bar + image enter (no motion dependency) */}
      <style>{`
        @keyframes tutProgress { from { height: 0% } to { height: 100% } }
        @keyframes tutEnterUp { from { transform: translateY(36px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        @keyframes tutEnterDown { from { transform: translateY(-36px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>

      <div className="mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-12">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left — steps */}
          <div className="order-2 flex flex-col justify-center lg:order-1 lg:col-span-5">
            <div className="mb-10">
              <span className="mb-3 block text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-600">
                {en ? "How it works" : "Cara menggunakan"}
              </span>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-balance text-slate-900 md:text-4xl">
                {en ? "Ride in 4 simple steps" : "Pesan dalam 4 langkah"}
              </h2>
            </div>

            <div className="flex flex-col">
              {STEPS.map((step, index) => {
                const isActive = activeIndex === index;
                const Icon = step.Icon;
                return (
                  <button
                    key={step.id}
                    onClick={() => handleTabClick(index)}
                    className={cn(
                      "group relative flex items-start gap-4 border-t border-slate-200/70 py-6 text-left transition-colors duration-300 first:border-0 md:py-7",
                      isActive
                        ? "text-slate-900"
                        : "text-slate-400 hover:text-slate-700",
                    )}
                  >
                    {/* progress rail */}
                    <span className="absolute -left-4 top-0 bottom-0 w-0.5 bg-slate-100 md:-left-6">
                      {isActive && (
                        <span
                          key={`p-${index}-${isPaused}`}
                          className="absolute left-0 top-0 w-full origin-top bg-emerald-600"
                          style={{
                            animation: `tutProgress ${AUTO_PLAY_DURATION}ms linear forwards`,
                            animationPlayState: isPaused ? "paused" : "running",
                          }}
                        />
                      )}
                    </span>

                    <span
                      className={cn(
                        "mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors duration-300",
                        isActive
                          ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                          : "border-slate-200 bg-white text-slate-400 group-hover:text-slate-600",
                      )}
                    >
                      <Icon size={18} strokeWidth={1.75} />
                    </span>

                    <div className="flex flex-1 flex-col gap-1.5">
                      <span className="flex items-baseline gap-2">
                        <span className="text-[10px] font-medium tabular-nums text-slate-300">
                          {step.id}
                        </span>
                        <span className="font-display text-xl font-medium tracking-tight md:text-2xl">
                          {en ? step.titleEN : step.titleID}
                        </span>
                      </span>

                      <div
                        className={cn(
                          "grid transition-all duration-500 ease-out",
                          isActive
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0",
                        )}
                      >
                        <p className="overflow-hidden text-sm leading-relaxed text-slate-500">
                          {en ? step.descEN : step.descID}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right — gallery */}
          <div className="order-1 flex h-full flex-col justify-center lg:order-2 lg:col-span-7">
            <div
              className="relative"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="relative aspect-4/5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 md:aspect-4/3 lg:aspect-16/11">
                <img
                  key={activeIndex}
                  src={active.image}
                  alt={en ? active.titleEN : active.titleID}
                  onClick={handleNext}
                  className="absolute inset-0 h-full w-full cursor-pointer object-contain"
                  style={{
                    animation: `${direction > 0 ? "tutEnterUp" : "tutEnterDown"} 0.55s cubic-bezier(0.22,1,0.36,1)`,
                  }}
                />

                {/* nav */}
                <div className="absolute bottom-5 right-5 z-20 flex gap-2 md:bottom-6 md:right-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    aria-label={en ? "Previous step" : "Langkah sebelumnya"}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/85 text-slate-700 backdrop-blur-md transition-all hover:bg-white active:scale-90 md:h-11 md:w-11"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    aria-label={en ? "Next step" : "Langkah berikutnya"}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/85 text-slate-700 backdrop-blur-md transition-all hover:bg-white active:scale-90 md:h-11 md:w-11"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
