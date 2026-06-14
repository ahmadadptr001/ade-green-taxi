"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { useLanguageStore } from "@/store/languageStore";

export default function Stats() {
  const { language } = useLanguageStore();
  const en = language === "en";
  const heroRef = useRef(null);

  const revealVariants = {
    visible: (i) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { delay: i * 0.25, duration: 0.7 },
    }),
    hidden: { filter: "blur(10px)", y: 40, opacity: 0 },
  };
  const textVariants = {
    visible: (i) => ({
      filter: "blur(0px)",
      opacity: 1,
      transition: { delay: i * 0.25, duration: 0.7 },
    }),
    hidden: { filter: "blur(10px)", opacity: 0 },
  };

  return (
    <section className="bg-[#f7faf8] px-4 py-28 md:py-50">
      <div className="mx-auto max-w-6xl" ref={heroRef}>
        <p className="font-hand mb-3 -rotate-2 text-3xl text-emerald-600">
          {en ? "why ade green" : "kenapa ade green"}
        </p>

        <TimelineContent
          as="h2"
          animationNum={0}
          timelineRef={heroRef}
          customVariants={revealVariants}
          className="font-display text-2xl font-semibold !leading-[120%] text-slate-900 sm:text-4xl md:text-5xl"
        >
          {en ? "We are " : "Kami "}
          <TimelineContent
            as="span"
            animationNum={1}
            timelineRef={heroRef}
            customVariants={textVariants}
            className="mx-1 inline-block rounded-md border-2 border-dotted border-emerald-500 px-2 text-emerald-600"
          >
            {en ? "rethinking" : "memikirkan ulang"}
          </TimelineContent>
          {en
            ? " the way the city moves — cleaner, fairer, and always you-first. Our goal is to keep raising the bar and "
            : " cara kota bergerak — lebih bersih, adil, dan selalu mengutamakan Anda. Tujuan kami terus menaikkan standar dan "}
          <TimelineContent
            as="span"
            animationNum={2}
            timelineRef={heroRef}
            customVariants={textVariants}
            className="mx-1 inline-block rounded-md border-2 border-dotted border-teal-500 px-2 text-teal-600"
          >
            {en ? "challenge" : "menantang"}
          </TimelineContent>
          {en ? " how mobility should " : " bagaimana mobilitas seharusnya "}
          <TimelineContent
            as="span"
            animationNum={3}
            timelineRef={heroRef}
            customVariants={textVariants}
            className="mx-1 inline-block rounded-md border-2 border-dotted border-emerald-500 px-2 text-emerald-600"
          >
            {en ? "work for you." : "bekerja untuk Anda."}
          </TimelineContent>
        </TimelineContent>

        <div className="mt-12 flex items-center justify-between gap-2">
          <TimelineContent
            as="div"
            animationNum={4}
            timelineRef={heroRef}
            customVariants={textVariants}
            className="text-xs sm:text-xl"
          >
            <div className="mb-1 font-medium capitalize text-slate-900">
              {en
                ? "We are Ade Green TX and we will"
                : "Kami Ade Green TX dan akan"}
            </div>
            <div className="font-semibold uppercase text-slate-500">
              {en ? "take you further" : "membawa Anda lebih jauh"}
            </div>
          </TimelineContent>

          <TimelineContent
            as={Link}
            href="/beranda/tentang"
            animationNum={5}
            timelineRef={heroRef}
            customVariants={textVariants}
            className="group inline-flex items-center gap-2 border-b border-slate-300 pb-1.5 text-sm font-medium uppercase tracking-[0.15em] text-slate-900 transition-colors hover:border-slate-900"
          >
            {en ? "About Ade Green" : "Tentang Ade Green"}
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </TimelineContent>
        </div>
      </div>
    </section>
  );
}
