'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function MilestoneMarker({ milestone, index, inView }) {
  return (
    <div
      className="absolute flex items-center gap-3"
      style={{
        ...milestone.position,
        opacity: inView ? 1 : 0,
        transform: inView ? 'scale(1)' : 'scale(0.5)',
        transition: `opacity 0.5s ${index * 0.25}s ease-out, transform 0.5s ${index * 0.25}s ease-out`,
      }}
    >
      <span className="relative flex h-6 w-6 items-center justify-center sm:h-8 sm:w-8">
        <span className="absolute h-full w-full rounded-full bg-emerald-500/10" />
        <span className="h-2.5 w-2.5 rounded-full border-2 border-emerald-700 bg-emerald-500 sm:h-3 sm:w-3" />
      </span>
      <span className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-800 shadow-sm sm:px-4 sm:py-2 sm:text-sm">
        {milestone.name}
      </span>
    </div>
  );
}

/**
 * AnimatedRoadmap — dependency-free port of the 21st.dev hero-section-5 block.
 * A winding SVG path "draws itself" as the section scrolls through the viewport
 * (strokeDashoffset), and milestone markers reveal with a stagger.
 */
export function AnimatedRoadmap({ className, milestones = [], mapImageSrc }) {
  const targetRef = useRef(null);
  const pathRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = targetRef.current;
    const path = pathRef.current;
    if (!el || !path) return;

    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    path.style.strokeDashoffset = reduce ? '0' : `${len}`;

    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setInView(true),
      { threshold: 0.2 }
    );
    io.observe(el);

    if (reduce) return () => io.disconnect();

    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const raw = (vh - rect.top) / (vh + rect.height);
        const p = clamp((raw - 0.15) / 0.55, 0, 1);
        path.style.strokeDashoffset = `${len * (1 - p)}`;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={targetRef}
      className={cn('relative mx-auto w-full max-w-4xl py-16', className)}
    >
      {mapImageSrc && (
        <div className="absolute inset-0 top-6">
          <img
            src={mapImageSrc}
            alt=""
            aria-hidden="true"
            className="h-full w-full rounded-3xl object-cover opacity-[0.08]"
          />
        </div>
      )}

      <div className="relative h-[260px] sm:h-[360px] md:h-[400px]">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 800 400"
          preserveAspectRatio="none"
          className="absolute left-0 top-0"
        >
          <path
            ref={pathRef}
            d="M 50 350 Q 200 50 400 200 T 750 100"
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeDasharray="10 5"
            strokeLinecap="round"
          />
        </svg>

        {milestones.map((m, i) => (
          <MilestoneMarker key={m.id} milestone={m} index={i} inView={inView} />
        ))}
      </div>
    </div>
  );
}

export default AnimatedRoadmap;
