"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CinematicHero } from "@/components/ui/cinematic-hero";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Landing() {
  const router = useRouter();

  // Smooth-scroll interpolation. The hero is one long scrubbed/pinned GSAP
  // timeline — native wheel events are discrete and steppy, which makes the
  // scrub stutter. Lenis feeds ScrollTrigger a momentum-smoothed scroll
  // position through GSAP's own ticker, so the timeline advances in buttery,
  // evenly-spaced increments instead of jumping frame to frame.
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false, // let mobile keep native momentum
      touchMultiplier: 1.4,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0); // Lenis drives the loop now

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33); // restore default for other routes
      lenis.destroy();
    };
  }, []);

  const handleStart = () => {
    router.replace("/beranda"); // instant, no scroll transition
  };

  return (
    <div className="overflow-x-hidden">
      <CinematicHero onStart={handleStart} />
    </div>
  );
}
