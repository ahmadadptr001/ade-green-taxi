'use client';

import { useRef } from 'react';

/**
 * Tilt — lightweight 3D pointer-tilt wrapper (no deps).
 * Rotates its children in 3D toward the cursor and lifts a glare highlight.
 * Falls back to no motion when the user prefers reduced motion or on touch.
 */
export default function Tilt({
  children,
  className = '',
  max = 12,
  glare = true,
  ...props
}) {
  const ref = useRef(null);
  const raf = useRef(null);

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const handleMove = (e) => {
    const el = ref.current;
    if (!el || prefersReduced) return;
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rx = (0.5 - py) * max * 2;
      const ry = (px - 0.5) * max * 2;
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
      if (glare) {
        el.style.setProperty('--glare-x', `${px * 100}%`);
        el.style.setProperty('--glare-y', `${py * 100}%`);
        el.style.setProperty('--glare-o', '0.18');
      }
    });
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    if (raf.current) cancelAnimationFrame(raf.current);
    el.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale(1)';
    el.style.setProperty('--glare-o', '0');
  };

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`relative transition-transform duration-200 ease-out will-change-transform ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
      {...props}
    >
      {children}
      {glare && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            background:
              'radial-gradient(circle at var(--glare-x,50%) var(--glare-y,50%), rgba(255,255,255,var(--glare-o,0)), transparent 45%)',
            transition: 'opacity 200ms ease-out',
          }}
        />
      )}
    </div>
  );
}
