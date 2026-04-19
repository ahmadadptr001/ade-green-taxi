'use client';
import { useEffect, useState } from 'react';

export default function TOC({ sections }) {
  const [active, setActive] = useState(sections?.[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav className="sticky bg-white h-fit top-2 shadow-md  p-3 rounded-md space-y-2">
      <div className="text-sm uppercase tracking-wide text-gray-400 mb-2">Contents</div>
      <ul className="space-y-2">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={`block text-base transition ${
                active === s.id ? 'text-green-600 font-semibold' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {s.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
