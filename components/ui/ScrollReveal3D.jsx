'use client';

import { useEffect, useRef } from 'react';

/**
 * ScrollReveal3D — scroll-driven 3D entrance.
 * As the element passes through the viewport its progress (0→1) drives a
 * rotateX / translateZ / opacity transform, giving content a tactile "tilt
 * up into place" feel. Uses a single rAF gated by IntersectionObserver and
 * respects prefers-reduced-motion.
 */
export default function ScrollReveal3D({
  children,
  className = '',
  rotate = 14, // starting rotateX in deg
  lift = 60, // starting translateY in px
  depth = 120, // starting translateZ (negative) in px
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (reduce) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      return;
    }

    let raf = null;
    let active = false;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // progress: 0 when entering bottom, 1 when comfortably in view
      let p = (vh - rect.top) / (vh * 0.6);
      p = Math.max(0, Math.min(1, p));
      const eased = 1 - Math.pow(1 - p, 3);
      el.style.transform = `perspective(1100px) rotateX(${(1 - eased) * rotate}deg) translateY(${(1 - eased) * lift}px) translateZ(${-(1 - eased) * depth}px)`;
      el.style.opacity = String(0.2 + eased * 0.8);
      raf = null;
    };

    const onScroll = () => {
      if (raf == null && active) raf = requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        active = e.isIntersecting;
        if (active) {
          window.addEventListener('scroll', onScroll, { passive: true });
          update();
        } else {
          window.removeEventListener('scroll', onScroll);
        }
      },
      { threshold: 0 }
    );
    io.observe(el);
    update();

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [rotate, lift, depth]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity', opacity: 0.2 }}
    >
      {children}
    </div>
  );
}
