'use client';
import { useEffect, useRef } from 'react';
import { useLanguageStore } from '@/store/languageStore';
import ID from '../../locales/id.json';
import EN from '../../locales/en.json';
import { Zap, ShieldCheck, Smartphone, Globe } from 'lucide-react';

/**
 * Enhanced overlapping parallax sections
 * - No background images (color-only)
 * - Each section is sticky, full-screen and contains exactly one headline + one short line
 * - Real parallax: background / accent / content layers move at different speeds
 * - requestAnimationFrame + direct DOM transforms for performance
 */

const SECTIONS = [
  {
    bgColor: '#052E14', // deep green (high contrast)
    accentColor: 'rgba(90, 200, 140, 0.12)', // soft emerald glow
    Icon: Zap,
    titleEN: 'Electric Mobility',
    titleID: 'Mobilitas Listrik',
    descEN: 'Silent EVs optimized for city flow.',
    descID: 'EV senyap, dioptimalkan untuk kota.',
  },
  {
    bgColor: '#0B6A3A', // medium green
    accentColor: 'rgba(4, 120, 87, 0.10)',
    Icon: ShieldCheck,
    titleEN: 'Operational Safety',
    titleID: 'Keamanan Operasional',
    descEN: 'Fleet telemetry and real-time control.',
    descID: 'Telemetri armada & kontrol real-time.',
  },
  {
    bgColor: '#FFFFFF', // light (contrasting bright scene)
    textColor: '#0B6A3A',
    accentColor: 'rgba(16, 185, 129, 0.06)',
    Icon: Smartphone,
    titleEN: 'Smart Dispatch',
    titleID: 'Distribusi Pintar',
    descEN: 'Requests routed with city-scale logic.',
    descID: 'Permintaan diarahkan dengan logika kota.',
  },
  {
    bgColor: '#052E14', // reuse deep tone but can alternate
    accentColor: 'rgba(90, 200, 140, 0.10)',
    Icon: Globe,
    titleEN: 'Always Active',
    titleID: 'Selalu Aktif',
    descEN: 'Built to meet daily urban demand.',
    descID: 'Dirancang untuk kebutuhan kota setiap hari.',
  },
];

// utility
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easePow = (x, p = 0.8) => Math.sign(x) * Math.pow(Math.abs(x), p);

export default function Features() {
  const { language } = useLanguageStore();
  const containerRef = useRef(null);
  const sectionRefs = useRef([]);
  const stateRef = useRef({
    raf: null,
    lastScroll: 0,
    smooth: SECTIONS.map(() => ({ cY: 0, bgY: 0, accY: 0, op: 1 })),
  });

  useEffect(() => {
    // rAF loop
    const loop = () => {
      const winH = window.innerHeight;
      const scrollY = window.scrollY || window.pageYOffset;
      stateRef.current.lastScroll = scrollY;

      sectionRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        // center distance normalized [-1..1], 0 when center of sec = center of viewport
        const mid = rect.top + rect.height / 2;
        let norm = (mid - winH / 2) / (winH / 2);
        norm = clamp(norm, -2, 2); // allow some range
        const eased = easePow(norm, 0.85);

        // Targets for layers (positive -> move down)
        // Background: slow (small factor)
        const targetBg = eased * 40; // px
        // Accent (decorative shape): medium speed
        const targetAcc = eased * 80; // px
        // Content: larger subtle shift to feel depth
        const targetContent = eased * 120; // px

        // Opacity target: when near center, opacity ~1
        const targetOp = clamp(1 - Math.abs(norm) * 1.2, 0, 1);

        const s = stateRef.current.smooth[i];
        s.bgY = lerp(s.bgY, targetBg, 0.12);
        s.accY = lerp(s.accY, targetAcc, 0.10);
        s.cY = lerp(s.cY, targetContent, 0.12);
        s.op = lerp(s.op, targetOp, 0.14);

        // apply transforms: use dataset to reduce DOM reads; write only style props changed
        const bg = el.querySelector('[data-role="bg"]');
        const acc = el.querySelector('[data-role="acc"]');
        const fg = el.querySelector('[data-role="fg"]');

        if (bg) {
          bg.style.transform = `translateY(${s.bgY}px) scale(${1 + Math.abs(s.bgY) / 300})`;
        }
        if (acc) {
          // accent also subtle rotate for more depth
          acc.style.transform = `translateY(${s.accY}px) rotate(${s.accY / 30}deg)`;
          acc.style.opacity = String(clamp(0.18 + s.op * 0.85, 0, 1));
        }
        if (fg) {
          // content moves opposite direction slightly for stronger effect
          fg.style.transform = `translateY(${ -s.cY / 2 }px)`;
          fg.style.opacity = String(clamp(s.op, 0, 1));
          fg.style.filter = `drop-shadow(0 20px 60px rgba(2,6,23,${0.06 * s.op}))`;
        }
      });

      stateRef.current.raf = requestAnimationFrame(loop);
    };

    stateRef.current.raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(stateRef.current.raf);
      stateRef.current.raf = null;
    };
  }, []);

  return (
    <section ref={containerRef} id="fitur" className="relative">
      {/* each section is a sticky full-screen panel; panels stack and cover each other */}
      {SECTIONS.map((s, i) => {
        const Icon = s.Icon;
        const textIsDark = s.textColor ? true : false;
        const textColor = s.textColor || (i === 2 ? '#064E3B' : '#FFFFFF');

        return (
          <div
            key={i}
            ref={(el) => (sectionRefs.current[i] = el)}
            className="sticky top-0 h-screen w-full overflow-hidden"
            aria-hidden={false}
            style={{ zIndex: 100 + i }}
          >
            {/* BG layer (color block that moves slowly) */}
            <div
              data-role="bg"
              style={{
                background: s.bgColor,
                position: 'absolute',
                inset: 0,
                willChange: 'transform',
                transform: 'translateY(0px)',
              }}
              aria-hidden="true"
            />

            {/* Accent decorative layer */}
            <div
              data-role="acc"
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                willChange: 'transform, opacity',
                transform: 'translateY(0px)',
                opacity: 0.0,
              }}
              aria-hidden="true"
            >
              {/* decorative geometric / glow block bottom-right */}
              <div
                style={{
                  position: 'absolute',
                  right: '6%',
                  bottom: '8%',
                  width: '36vw',
                  maxWidth: 520,
                  height: '36vw',
                  maxHeight: 520,
                  borderRadius: 28,
                  background: s.accentColor,
                  filter: 'blur(36px)',
                  transformOrigin: 'center',
                }}
              />
            </div>

            {/* Foreground content */}
            <div
              data-role="fg"
              style={{
                position: 'relative',
                zIndex: 200,
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                willChange: 'transform, opacity',
                paddingLeft: '6%',
                paddingRight: '6%',
              }}
            >
              <div style={{ maxWidth: 920 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
                  <div style={{
                    background: textIsDark ? '#fff' : 'rgba(255,255,255,0.08)',
                    padding: 12,
                    borderRadius: 12,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Icon style={{ width: 36, height: 36, color: textIsDark ? '#064E3B' : '#10B981' }} />
                  </div>
                  <div style={{ color: textIsDark ? '#064E3B' : '#E6FFEF', fontWeight: 700 }}>
                    ADE GREEN TAXI
                  </div>
                </div>

                <h2 style={{
                  fontSize: 'clamp(28px, 5vw, 48px)',
                  lineHeight: 1.05,
                  margin: 0,
                  marginBottom: 16,
                  color: textColor,
                  fontWeight: 800,
                  textShadow: textIsDark ? 'none' : '0 10px 30px rgba(2,6,23,0.25)'
                }}>
                  {language === 'en' ? s.titleEN : s.titleID}
                </h2>

                <p style={{
                  color: textIsDark ? '#064E3B' : 'rgba(230,255,239,0.92)',
                  fontSize: 18,
                  marginTop: 10,
                  maxWidth: 720,
                }}>
                  {language === 'en' ? s.descEN : s.descID}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
