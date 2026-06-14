'use client';

import { useEffect, useRef, useState } from 'react';

function useInViewOnce(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView, threshold]);
  return [ref, inView];
}

const spanStyle = (inView, i) => ({
  display: 'inline-block',
  transform: inView ? 'translateY(0)' : 'translateY(20px)',
  opacity: inView ? 1 : 0,
  transition: `transform 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.08}s, opacity 0.6s ${i * 0.08}s`,
  willChange: 'transform, opacity',
});

/** Words rise + fade in with a stagger when scrolled into view. */
export function WordsPullUp({ text, className = '', showAsterisk = false, style }) {
  const [ref, inView] = useInViewOnce();
  const words = text.split(' ');

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <span
            key={i}
            className="relative inline-block"
            style={{ ...spanStyle(inView, i), marginRight: isLast ? 0 : '0.25em' }}
          >
            {word}
            {showAsterisk && isLast && (
              <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em]">*</span>
            )}
          </span>
        );
      })}
    </div>
  );
}

/** Same pull-up, but each segment can carry its own className. */
export function WordsPullUpMultiStyle({ segments, className = '', style }) {
  const [ref, inView] = useInViewOnce();

  const words = [];
  segments.forEach((seg) => {
    seg.text.split(' ').forEach((w) => {
      if (w) words.push({ word: w, className: seg.className });
    });
  });

  return (
    <div
      ref={ref}
      className={`inline-flex flex-wrap justify-center ${className}`}
      style={style}
    >
      {words.map((w, i) => (
        <span
          key={i}
          className={`inline-block ${w.className ?? ''}`}
          style={{ ...spanStyle(inView, i), marginRight: '0.25em' }}
        >
          {w.word}
        </span>
      ))}
    </div>
  );
}
