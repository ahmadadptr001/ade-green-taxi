"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  // Promote everything to GPU layers and keep the scrub catch-up from stalling
  // on a single janky frame.
  gsap.config({ force3D: true });
  gsap.ticker.lagSmoothing(500, 33);
  // Mobile browsers fire a resize every time the address bar shows/hides while
  // scrolling — without this each one would refresh + re-pin the timeline,
  // which is the #1 cause of mobile scroll stutter here.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

const PLAYSTORE_URL =
  "https://play.google.com/store/apps/details?id=com.test211111.CustomerAdeTaxi&pcampaignid=web_share";

const INJECTED_STYLES = `
  .gsap-reveal { visibility: hidden; }
  .film-grain {
    position: absolute; inset: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 50; opacity: 0.045;
    background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
  }
  .bg-grid-theme {
    background-size: 60px 60px;
    background-image:
      linear-gradient(to right, color-mix(in srgb, var(--color-foreground) 5%, transparent) 1px, transparent 1px),
      linear-gradient(to bottom, color-mix(in srgb, var(--color-foreground) 5%, transparent) 1px, transparent 1px);
    mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
    -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
  }
  .text-3d-matte {
    color: var(--color-foreground);
    text-shadow: 0 10px 30px color-mix(in srgb, var(--color-foreground) 20%, transparent), 0 2px 4px color-mix(in srgb, var(--color-foreground) 10%, transparent);
  }
  .text-silver-matte {
    background: linear-gradient(180deg, var(--color-foreground) 0%, color-mix(in srgb, var(--color-foreground) 40%, transparent) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    transform: translateZ(0);
    filter: drop-shadow(0 10px 20px color-mix(in srgb, var(--color-foreground) 15%, transparent)) drop-shadow(0 2px 4px color-mix(in srgb, var(--color-foreground) 10%, transparent));
  }
  .text-card-silver-matte {
    background: linear-gradient(180deg, #FFFFFF 0%, #9fb8af 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    transform: translateZ(0);
    filter: drop-shadow(0 12px 24px rgba(0,0,0,0.8)) drop-shadow(0 4px 8px rgba(0,0,0,0.6));
  }
  .premium-depth-card {
    background: linear-gradient(145deg, #0c3b2c 0%, #04130e 100%);
    box-shadow: 0 40px 100px -20px rgba(0,0,0,0.9), 0 20px 40px -20px rgba(0,0,0,0.8),
      inset 0 1px 2px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.8);
    border: 1px solid rgba(255,255,255,0.04); position: relative;
  }
  .card-sheen {
    position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 50;
    background: radial-gradient(800px circle at var(--mouse-x,50%) var(--mouse-y,50%), rgba(110,231,183,0.08) 0%, transparent 40%);
    mix-blend-mode: screen; transition: opacity .3s ease;
  }
  .iphone-bezel {
    background-color: #0a0f0d;
    box-shadow: inset 0 0 0 2px #4a554f, inset 0 0 0 7px #000, 0 40px 80px -15px rgba(0,0,0,0.9), 0 15px 25px -5px rgba(0,0,0,0.7);
    transform-style: preserve-3d;
  }
  .hardware-btn {
    background: linear-gradient(90deg, #404040 0%, #171717 100%);
    box-shadow: -2px 0 5px rgba(0,0,0,0.8), inset -1px 0 1px rgba(255,255,255,0.15), inset 1px 0 2px rgba(0,0,0,0.8);
    border-left: 1px solid rgba(255,255,255,0.05);
  }
  .screen-glare { background: linear-gradient(110deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 45%); }
  .widget-depth {
    background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
    box-shadow: 0 10px 20px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.05), inset 0 -1px 1px rgba(0,0,0,0.5);
    border: 1px solid rgba(255,255,255,0.03);
  }
  .floating-ui-badge {
    background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.01) 100%);
    backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
    box-shadow: 0 0 0 1px rgba(255,255,255,0.1), 0 25px 50px -12px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.2), inset 0 -1px 1px rgba(0,0,0,0.5);
  }
  .btn-modern-light { transition: all .4s cubic-bezier(0.25,1,0.5,1); background: linear-gradient(180deg,#FFFFFF 0%,#F1F5F9 100%); color:#0F172A;
    box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.1), 0 12px 24px -4px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,1), inset 0 -3px 6px rgba(0,0,0,0.06); }
  .btn-modern-light:hover { transform: translateY(-3px); }
  .btn-modern-light:active { transform: translateY(1px); }
  .progress-ring { transform: rotate(-90deg); transform-origin: center; stroke-dasharray: 402; stroke-dashoffset: 402; stroke-linecap: round; }

  /* --- Mobile / low-power: strip the most GPU-expensive effects --- */
  @media (max-width: 768px) {
    .film-grain { display: none; }
    .floating-ui-badge {
      backdrop-filter: none; -webkit-backdrop-filter: none;
      background: rgba(8, 20, 16, 0.82);
      box-shadow: 0 0 0 1px rgba(255,255,255,0.08), 0 12px 24px -8px rgba(0,0,0,0.7);
    }
    .premium-depth-card {
      box-shadow: 0 24px 60px -20px rgba(0,0,0,0.9), inset 0 1px 1px rgba(255,255,255,0.12);
    }
    .iphone-bezel {
      box-shadow: inset 0 0 0 2px #4a554f, inset 0 0 0 7px #000, 0 20px 40px -12px rgba(0,0,0,0.8);
    }
    .card-sheen { display: none; }
  }
  @media (prefers-reduced-motion: reduce) {
    .film-grain { display: none; }
  }
`;

export function CinematicHero({
  onStart,
  brandName = "ADE GREEN TX",
  tagline1 = "Bergerak lebih bersih,",
  tagline2 = "setiap hari.",
  cardHeading = "Mobilitas hijau, didefinisikan ulang.",
  cardDescription = (
    <>
      <span className="text-white font-semibold">Ade Green TX</span>{" "}
      menghadirkan taksi listrik untuk Kota Kendari, perjalanan senyap, tarif
      adil, dan jejak karbon lebih rendah, langsung dari aplikasi.
    </>
  ),
  metricValue = 100,
  metricLabel = "% Listrik",
  ctaHeading = "Siap berkendara hijau?",
  ctaDescription = "Mulai jelajahi Ade Green TX dan rasakan mobilitas listrik untuk Kendari.",
  className,
  ...props
}) {
  const containerRef = useRef(null);
  const mainCardRef = useRef(null);
  const mockupRef = useRef(null);
  const requestRef = useRef(0);

  useEffect(() => {
    // Pointer parallax is a "nice to have" — it must never compete with the
    // scroll scrub. Pause it on coarse pointers (touch) and while scrolling.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let lastScroll = 0;
    const onScroll = () => {
      lastScroll = performance.now();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const handleMouseMove = (e) => {
      if (window.scrollY > window.innerHeight * 2) return;
      if (performance.now() - lastScroll < 160) return; // mid-scroll: skip
      cancelAnimationFrame(requestRef.current);
      requestRef.current = requestAnimationFrame(() => {
        if (mainCardRef.current && mockupRef.current) {
          const rect = mainCardRef.current.getBoundingClientRect();
          mainCardRef.current.style.setProperty(
            "--mouse-x",
            `${e.clientX - rect.left}px`,
          );
          mainCardRef.current.style.setProperty(
            "--mouse-y",
            `${e.clientY - rect.top}px`,
          );
          const xVal = (e.clientX / window.innerWidth - 0.5) * 2;
          const yVal = (e.clientY / window.innerHeight - 0.5) * 2;
          gsap.to(mockupRef.current, {
            rotationY: xVal * 10,
            rotationX: -yVal * 10,
            ease: "power3.out",
            duration: 0.9,
            overwrite: "auto",
          });
        }
      });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    // The card's base size is 85vw×85vh (92 on mobile); this uniform factor
    // scales it to exactly fill the viewport — letting us expand it with a GPU
    // transform instead of animating width/height (which reflows every frame).
    const fullScale = isMobile ? 100 / 92 : 100 / 85;
    // Gaussian blur is priced per painted pixel; on high-DPI phones that's 2-3x
    // the work, so we skip blur reveals entirely on mobile (opacity/scale carry
    // the effect just fine).
    const blur = (px) => `blur(${isMobile ? 0 : px}px)`;
    const ctx = gsap.context(() => {
      gsap.set(".text-track", {
        autoAlpha: 0,
        y: 60,
        scale: 0.85,
        filter: blur(10),
        rotationX: -20,
      });
      gsap.set(".text-days", { autoAlpha: 1, clipPath: "inset(0 100% 0 0)" });
      gsap.set(".main-card", {
        y: window.innerHeight + 200,
        autoAlpha: 1,
        willChange: "transform",
      });
      gsap.set(
        [
          ".card-left-text",
          ".card-right-text",
          ".mockup-scroll-wrapper",
          ".floating-badge",
          ".phone-widget",
        ],
        { autoAlpha: 0 },
      );
      gsap.set(".cta-wrapper", {
        autoAlpha: 0,
        scale: 0.8,
        filter: blur(14),
      });

      const introTl = gsap.timeline({ delay: 0.3 });
      introTl
        .to(".text-track", {
          duration: 1.8,
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          rotationX: 0,
          ease: "expo.out",
          clearProps: "filter",
        })
        .to(
          ".text-days",
          { duration: 1.4, clipPath: "inset(0 0% 0 0)", ease: "power4.inOut" },
          "-=1.0",
        );

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: isMobile ? "+=3800" : "+=7000",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      scrollTl
        // Grid covers the whole viewport — animating a blur on it every frame
        // is the heaviest paint in the scene, so it only scales + fades.
        .to(
          ".bg-grid-theme",
          { scale: 1.15, opacity: 0.2, ease: "power2.inOut", duration: 2 },
          0,
        )
        .to(
          ".hero-text-wrapper",
          {
            scale: 1.15,
            opacity: 0.2,
            ease: "power2.inOut",
            duration: 2,
            ...(isMobile ? {} : { filter: "blur(8px)" }),
          },
          0,
        )
        .to(".main-card", { y: 0, ease: "power3.inOut", duration: 2 }, 0)
        .to(".main-card", {
          scale: fullScale,
          borderRadius: "0px",
          ease: "power3.inOut",
          duration: 1.5,
        })
        .fromTo(
          ".mockup-scroll-wrapper",
          {
            y: 300,
            z: -500,
            rotationX: 50,
            rotationY: -30,
            autoAlpha: 0,
            scale: 0.6,
          },
          {
            y: 0,
            z: 0,
            rotationX: 0,
            rotationY: 0,
            autoAlpha: 1,
            scale: 1,
            ease: "expo.out",
            duration: 2.5,
          },
          "-=0.8",
        )
        .fromTo(
          ".phone-widget",
          { y: 40, autoAlpha: 0, scale: 0.95 },
          {
            y: 0,
            autoAlpha: 1,
            scale: 1,
            stagger: 0.15,
            ease: "back.out(1.2)",
            duration: 1.5,
          },
          "-=1.5",
        )
        .to(
          ".progress-ring",
          { strokeDashoffset: 60, duration: 2, ease: "power3.inOut" },
          "-=1.2",
        )
        .to(
          ".counter-val",
          {
            innerHTML: metricValue,
            snap: { innerHTML: 1 },
            duration: 2,
            ease: "expo.out",
          },
          "-=2.0",
        )
        .fromTo(
          ".floating-badge",
          { y: 100, autoAlpha: 0, scale: 0.7, rotationZ: -10 },
          {
            y: 0,
            autoAlpha: 1,
            scale: 1,
            rotationZ: 0,
            ease: "back.out(1.5)",
            duration: 1.5,
            stagger: 0.2,
          },
          "-=2.0",
        )
        .fromTo(
          ".card-left-text",
          { x: -50, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, ease: "power4.out", duration: 1.5 },
          "-=1.5",
        )
        .fromTo(
          ".card-right-text",
          { x: 50, autoAlpha: 0, scale: 0.8 },
          { x: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 1.5 },
          "<",
        )
        .to({}, { duration: 2.5 })
        .set(".hero-text-wrapper", { autoAlpha: 0 })
        .set(".cta-wrapper", { autoAlpha: 1 })
        .to({}, { duration: 1.5 })
        .to(
          [
            ".mockup-scroll-wrapper",
            ".floating-badge",
            ".card-left-text",
            ".card-right-text",
          ],
          {
            scale: 0.9,
            y: -40,
            z: -200,
            autoAlpha: 0,
            ease: "power3.in",
            duration: 1.2,
            stagger: 0.05,
          },
        )
        .to(
          ".main-card",
          {
            scale: 1,
            borderRadius: isMobile ? "32px" : "40px",
            ease: "expo.inOut",
            duration: 1.8,
          },
          "pullback",
        )
        .to(
          ".cta-wrapper",
          {
            scale: 1,
            ease: "expo.inOut",
            duration: 1.8,
            ...(isMobile ? {} : { filter: "blur(0px)" }),
          },
          "pullback",
        )
        .to(".main-card", {
          y: -window.innerHeight - 300,
          ease: "power3.in",
          duration: 1.5,
        });
    }, containerRef);

    return () => ctx.revert();
  }, [metricValue]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-screen h-screen overflow-hidden flex items-center justify-center bg-background text-foreground font-sans antialiased",
        className,
      )}
      style={{ perspective: "1500px" }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />
      <div className="film-grain" aria-hidden="true" />
      <div
        className="bg-grid-theme absolute inset-0 z-0 pointer-events-none opacity-50"
        aria-hidden="true"
      />

      {/* Hero texts */}
      <div className="hero-text-wrapper absolute z-10 flex flex-col items-center justify-center text-center w-screen px-4 will-change-transform">
        <h1 className="text-track gsap-reveal text-3d-matte text-5xl md:text-7xl lg:text-[6rem] font-bold tracking-tight mb-2">
          {tagline1}
        </h1>
        <h1 className="text-days gsap-reveal text-silver-matte text-5xl md:text-7xl lg:text-[6rem] font-extrabold tracking-tighter">
          {tagline2}
        </h1>
      </div>

      {/* CTA with Mulai button */}
      <div className="cta-wrapper absolute z-10 flex flex-col items-center justify-center text-center w-screen px-4 gsap-reveal pointer-events-auto will-change-transform">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight text-silver-matte">
          {ctaHeading}
        </h2>
        <p className="text-muted-foreground text-lg md:text-xl mb-12 max-w-xl mx-auto font-light leading-relaxed">
          {ctaDescription}
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={onStart}
            className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-emerald-600 px-9 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-600/30 transition-all hover:-translate-y-0.5 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
          >
            Mulai Sekarang
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
          <a
            href={PLAYSTORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 rounded-full border border-foreground/15 bg-background/60 px-6 py-3 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-foreground/30"
          >
            <img
              src="/icon-playstore.png"
              alt=""
              className="h-6 w-6 object-contain"
            />
            <span className="text-left leading-tight">
              <span className="block text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Tersedia di
              </span>
              <span className="block text-sm font-bold text-foreground">
                Google Play
              </span>
            </span>
          </a>
        </div>
      </div>

      {/* The deep card */}
      <div
        className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
        style={{ perspective: "1500px" }}
      >
        <div
          ref={mainCardRef}
          className="main-card premium-depth-card relative overflow-hidden gsap-reveal flex items-center justify-center pointer-events-auto w-[92vw] md:w-[85vw] h-[92vh] md:h-[85vh] rounded-[32px] md:rounded-[40px]"
        >
          <div className="card-sheen" aria-hidden="true" />
          <div className="relative w-full h-full max-w-7xl mx-auto px-4 lg:px-12 flex flex-col justify-evenly lg:grid lg:grid-cols-3 items-center lg:gap-8 z-10 py-6 lg:py-0">
            {/* Brand */}
            <div className="card-right-text gsap-reveal order-1 lg:order-3 flex justify-center lg:justify-end z-20 w-full">
              <h2 className="text-5xl md:text-[5rem] lg:text-[6.5rem] font-black uppercase tracking-tighter text-card-silver-matte">
                {brandName}
              </h2>
            </div>

            {/* Phone mockup */}
            <div
              className="mockup-scroll-wrapper order-2 lg:order-2 relative w-full h-[380px] lg:h-[600px] flex items-center justify-center z-10"
              style={{ perspective: "1000px" }}
            >
              <div className="relative w-full h-full flex items-center justify-center transform scale-[0.65] md:scale-85 lg:scale-100">
                <div
                  ref={mockupRef}
                  className="relative w-[280px] h-[580px] rounded-[3rem] iphone-bezel flex flex-col will-change-transform"
                >
                  <div
                    className="absolute top-[120px] -left-[3px] w-[3px] h-[25px] hardware-btn rounded-l-md z-0"
                    aria-hidden="true"
                  />
                  <div
                    className="absolute top-[160px] -left-[3px] w-[3px] h-[45px] hardware-btn rounded-l-md z-0"
                    aria-hidden="true"
                  />
                  <div
                    className="absolute top-[220px] -left-[3px] w-[3px] h-[45px] hardware-btn rounded-l-md z-0"
                    aria-hidden="true"
                  />
                  <div
                    className="absolute top-[170px] -right-[3px] w-[3px] h-[70px] hardware-btn rounded-r-md z-0 scale-x-[-1]"
                    aria-hidden="true"
                  />
                  <div className="absolute inset-[7px] bg-[#04130e] rounded-[2.5rem] overflow-hidden shadow-[inset_0_0_15px_rgba(0,0,0,1)] text-white z-10">
                    <div
                      className="absolute inset-0 screen-glare z-40 pointer-events-none"
                      aria-hidden="true"
                    />
                    <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-black rounded-full z-50 flex items-center justify-end px-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
                    </div>
                    <div className="relative w-full h-full pt-12 px-5 pb-8 flex flex-col">
                      <div className="phone-widget flex justify-between items-center mb-8">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold mb-1">
                            Hari Ini
                          </span>
                          <span className="text-xl font-bold tracking-tight text-white drop-shadow-md">
                            Perjalanan
                          </span>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-white/5 text-neutral-200 flex items-center justify-center font-bold text-sm border border-white/10">
                          AG
                        </div>
                      </div>
                      <div className="phone-widget relative w-44 h-44 mx-auto flex items-center justify-center mb-8 drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]">
                        <svg
                          className="absolute inset-0 w-full h-full"
                          aria-hidden="true"
                        >
                          <circle
                            cx="88"
                            cy="88"
                            r="64"
                            fill="none"
                            stroke="rgba(255,255,255,0.03)"
                            strokeWidth="12"
                          />
                          <circle
                            className="progress-ring"
                            cx="88"
                            cy="88"
                            r="64"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="12"
                          />
                        </svg>
                        <div className="text-center z-10 flex flex-col items-center">
                          <span className="counter-val text-4xl font-extrabold tracking-tighter text-white">
                            0
                          </span>
                          <span className="text-[8px] text-emerald-200/50 uppercase tracking-[0.1em] font-bold mt-0.5">
                            {metricLabel}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="phone-widget widget-depth rounded-2xl p-3 flex items-center">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 flex items-center justify-center mr-3 border border-emerald-400/20 shadow-inner">
                            <svg
                              className="w-4 h-4 text-emerald-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="h-2 w-20 bg-neutral-300 rounded-full mb-2" />
                            <div className="h-1.5 w-12 bg-neutral-600 rounded-full" />
                          </div>
                        </div>
                        <div className="phone-widget widget-depth rounded-2xl p-3 flex items-center">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-teal-600/5 flex items-center justify-center mr-3 border border-teal-400/20 shadow-inner">
                            <svg
                              className="w-4 h-4 text-teal-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="h-2 w-16 bg-neutral-300 rounded-full mb-2" />
                            <div className="h-1.5 w-24 bg-neutral-600 rounded-full" />
                          </div>
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[120px] h-[4px] bg-white/20 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="floating-badge absolute flex top-6 lg:top-12 left-[-15px] lg:left-[-80px] floating-ui-badge rounded-xl lg:rounded-2xl p-3 lg:p-4 items-center gap-3 lg:gap-4 z-30">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-b from-emerald-500/20 to-emerald-900/10 flex items-center justify-center border border-emerald-400/30 shadow-inner">
                    <span className="text-base lg:text-xl" aria-hidden="true">
                      🍃
                    </span>
                  </div>
                  <div>
                    <p className="text-white text-xs lg:text-sm font-bold tracking-tight">
                      100% Listrik
                    </p>
                    <p className="text-emerald-200/50 text-[10px] lg:text-xs font-medium">
                      Armada hijau
                    </p>
                  </div>
                </div>
                <div className="floating-badge absolute flex bottom-12 lg:bottom-20 right-[-15px] lg:right-[-80px] floating-ui-badge rounded-xl lg:rounded-2xl p-3 lg:p-4 items-center gap-3 lg:gap-4 z-30">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-b from-teal-500/20 to-teal-900/10 flex items-center justify-center border border-teal-400/30 shadow-inner">
                    <span className="text-base lg:text-lg" aria-hidden="true">
                      ⚡
                    </span>
                  </div>
                  <div>
                    <p className="text-white text-xs lg:text-sm font-bold tracking-tight">
                      Nol Emisi
                    </p>
                    <p className="text-emerald-200/50 text-[10px] lg:text-xs font-medium">
                      Perjalanan bersih
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Accountability text */}
            <div className="card-left-text gsap-reveal order-3 lg:order-1 flex flex-col justify-center text-center lg:text-left z-20 w-full lg:max-w-none px-4 lg:px-0">
              <h3 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-0 lg:mb-5 tracking-tight">
                {cardHeading}
              </h3>
              <p className="hidden md:block text-emerald-100/70 text-sm md:text-base lg:text-lg font-normal leading-relaxed mx-auto lg:mx-0 max-w-sm lg:max-w-none">
                {cardDescription}
              </p>
              <a
                href={PLAYSTORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-auto mt-6 inline-flex w-fit items-center gap-3 rounded-full bg-white px-6 py-3 text-slate-900 shadow-lg transition-transform hover:-translate-y-0.5 lg:mx-0"
              >
                <img
                  src="/icon-playstore.png"
                  alt=""
                  className="h-6 w-6 object-contain"
                />
                <span className="text-left leading-tight">
                  <span className="block text-[10px] font-medium uppercase tracking-wide text-slate-500">
                    Tersedia di
                  </span>
                  <span className="block text-sm font-bold">Google Play</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CinematicHero;
