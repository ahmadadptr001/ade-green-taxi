"use client";

import { useLanguageStore } from "@/store/languageStore";
import ID from "../../locales/id.json";
import EN from "../../locales/en.json";
import { ArrowRight } from "lucide-react";
import { WordsPullUp } from "@/components/ui/words-pull-up";

const CREAM = "#E7E5D8";

export default function Hero() {
  const { language } = useLanguageStore();
  const t = language === "en" ? EN : ID;
  const en = language === "en";

  const description = en
    ? "Electric taxi service for the city of Kendari — cleaner, quieter, and dependable rides, booked in seconds from the app."
    : "Layanan taksi listrik untuk Kota Kendari — perjalanan yang lebih bersih, tenang, dan andal, dipesan dalam hitungan detik lewat aplikasi.";

  return (
    <section
      id="hero"
      className="relative h-screen w-full overflow-hidden bg-[#07090e]"
    >
      {/* Fullscreen video background */}
      <div className="absolute inset-0">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0b1018] via-[#08090f] to-[#050608]" />
        <div className="pointer-events-none absolute -top-32 right-[8%] h-[34rem] w-[34rem] rounded-full bg-teal-500/10 blur-[130px]" />
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/opening-car-image.jpg"
          src="/opening-car.mp4"
        />
      </div>

      {/* Noise + gradient overlays */}
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.5] mix-blend-overlay" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />

      {/* Hero content (bottom) */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 sm:px-6 md:px-10">
        <div className="grid grid-cols-12 items-end gap-4">
          <div className="col-span-12 lg:col-span-8">
            <h1
              className="font-display font-semibold leading-[0.85] tracking-[-0.05em] text-[19vw] sm:text-[16vw] md:text-[13vw] lg:text-[11vw] xl:text-[10.5vw]"
              style={{ color: CREAM }}
            >
              <WordsPullUp text="Ade Green TX" showAsterisk />
            </h1>
          </div>

          <div className="col-span-12 flex flex-col gap-5 pb-6 lg:col-span-4 lg:pb-10">
            <p
              className="text-sm leading-snug sm:text-base md:text-lg"
              style={{ color: "rgba(231,229,216,0.74)" }}
            >
              {description}
            </p>

            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://play.google.com/store/apps/details?id=com.test211111.CustomerAdeTaxi&pcampaignid=web_share"
              className="group inline-flex items-center gap-2 self-start rounded-full py-1 pl-5 pr-1 text-sm font-medium text-black transition-all hover:gap-3 sm:text-xl"
              style={{ backgroundColor: CREAM }}
            >
              {t?.semiNavbar?.buttonInstall ||
                (en ? "Download App" : "Unduh Aplikasi")}
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
                <ArrowRight className="h-4 w-4" style={{ color: CREAM }} />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
