'use client';

import { useEffect, useRef, useState } from 'react';

function useInView(threshold = 0.6) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen, threshold]);
  return [ref, seen];
}

/** Highlighter marker swipe behind inline text, animates on scroll-in. */
export function MarkText({ children, className = '', as: Tag = 'span' }) {
  const [ref, seen] = useInView(0.7);
  return (
    <Tag
      ref={ref}
      className={`mark-text ${seen ? 'is-marked' : ''} ${className}`}
    >
      {children}
    </Tag>
  );
}

/** Hand-drawn ("coretan") underline that draws itself when scrolled into view. */
export function Scribble({ children, className = '' }) {
  const [ref, seen] = useInView(0.7);
  return (
    <span
      ref={ref}
      className={`scribble-underline ${seen ? 'is-drawn' : ''} ${className}`}
    >
      {children}
      <svg viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true">
        <path d="M3 13 C 60 4, 120 18, 180 9 S 270 5, 297 12" />
      </svg>
    </span>
  );
}
