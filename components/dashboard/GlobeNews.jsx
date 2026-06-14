'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import createGlobe from 'cobe';

// Spread world coordinates so pinned polaroids distribute around the sphere
// (article records have no real location, so we assign these).
const COORDS = [
  [-3.99, 122.51], // Kendari (home)
  [-6.21, 106.85], // Jakarta
  [35.68, 139.65], // Tokyo
  [-33.87, 151.21], // Sydney
  [51.51, -0.13], // London
  [40.71, -74.0], // New York
];
const ROT = ['-rotate-6', 'rotate-3', '-rotate-3', 'rotate-6', 'rotate-2', '-rotate-2'];

const PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='100%' height='100%' fill='%23f1f5f9'/><text x='50%' y='50%' fill='%2394a3b8' font-family='Arial' font-size='12' dominant-baseline='middle' text-anchor='middle'>Ade Green</text></svg>`
)}`;

// --- cobe's exact projection (replicated from node_modules/cobe v2.0.1) ---
const DEG = Math.PI / 180;
const EE = 0.8; // globe radius constant in cobe
const ELEV = 0; // markerElevation (must match the value passed to createGlobe)

function project(lat, lng, phi, theta) {
  const latR = lat * DEG;
  const lngR = lng * DEG - Math.PI;
  const cl = Math.cos(latR);
  const r = EE + ELEV;
  const X = -cl * Math.cos(lngR) * r;
  const Y = Math.sin(latR) * r;
  const Z = cl * Math.sin(lngR) * r;
  const cosP = Math.cos(phi);
  const sinP = Math.sin(phi);
  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);
  const c = cosP * X + sinP * Z;
  const s = sinP * sinT * X + cosT * Y - cosP * sinT * Z;
  const depth = -sinP * cosT * X + sinT * Y + cosP * cosT * Z;
  return { x: (c + 1) / 2, y: (1 - s) / 2, depth };
}

export default function GlobeNews({ articles = [] }) {
  const boxRef = useRef(null);
  const canvasRef = useRef(null);
  const pinRefs = useRef([]);

  const pointer = useRef(null);
  const drag = useRef({ phi: 0, theta: 0 });
  const phiOffset = useRef(0);
  const thetaOffset = useRef(0);
  const paused = useRef(false);
  const globeRef = useRef(null);

  const [size, setSize] = useState(360); // measured globe box size (px)
  const featured = articles.slice(0, 6);

  const pinW = Math.max(58, Math.min(132, size * 0.2));

  const onPointerDown = useCallback((e) => {
    pointer.current = { x: e.clientX, y: e.clientY };
    if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
    paused.current = true;
  }, []);

  const onPointerUp = useCallback(() => {
    if (pointer.current !== null) {
      phiOffset.current += drag.current.phi;
      thetaOffset.current += drag.current.theta;
      drag.current = { phi: 0, theta: 0 };
    }
    pointer.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
    paused.current = false;
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      if (pointer.current !== null) {
        drag.current = {
          phi: (e.clientX - pointer.current.x) / 300,
          theta: (e.clientY - pointer.current.y) / 1000,
        };
      }
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [onPointerUp]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const box = boxRef.current;
    if (!canvas || !box) return;
    let globe = null;
    let raf;
    let phi = -2.2; // start roughly over SE Asia / Indonesia

    const markers = featured.map((_, i) => ({
      location: COORDS[i % COORDS.length],
      size: 0.05,
    }));

    function positionPins(curPhi, curTheta) {
      featured.forEach((_, i) => {
        const el = pinRefs.current[i];
        if (!el) return;
        const [lat, lng] = COORDS[i % COORDS.length];
        const { x, y, depth } = project(lat, lng, curPhi, curTheta);
        const op = depth <= 0 ? 0 : Math.min(1, depth / 0.18);
        el.style.left = `${x * 100}%`;
        el.style.top = `${y * 100}%`;
        el.style.opacity = op.toFixed(3);
        el.style.zIndex = String(100 + Math.round(depth * 100));
        el.style.visibility = op <= 0.01 ? 'hidden' : 'visible';
        el.style.pointerEvents = op > 0.5 ? 'auto' : 'none';
      });
    }

    function init() {
      const width = canvas.offsetWidth;
      if (width === 0 || globe) return;
      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width,
        height: width,
        phi: 0,
        theta: 0.18,
        dark: 0,
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: 8,
        baseColor: [1, 1, 1],
        markerColor: [0.06, 0.72, 0.51],
        glowColor: [0.9, 0.95, 0.93],
        markerElevation: ELEV,
        markers,
        opacity: 0.9,
      });
      globeRef.current = globe;
      function animate() {
        if (!paused.current) phi += 0.0028;
        const curPhi = phi + phiOffset.current + drag.current.phi;
        const curTheta = 0.18 + thetaOffset.current + drag.current.theta;
        globe.update({ phi: curPhi, theta: curTheta });
        positionPins(curPhi, curTheta);
        raf = requestAnimationFrame(animate);
      }
      animate();
      setTimeout(() => canvas && (canvas.style.opacity = '1'));
    }

    // Measure + keep globe sized to its box
    const ro = new ResizeObserver((entries) => {
      const w = Math.round(entries[0]?.contentRect.width || 0);
      if (w > 0) {
        setSize(w);
        if (!globe) init();
        else globeRef.current?.update({ width: w, height: w });
      }
    });
    ro.observe(box);

    if (box.clientWidth > 0) init();

    return () => {
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      if (globe) globe.destroy();
      globeRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articles]);

  return (
    <div className="flex flex-col items-center pt-16 sm:pt-20">
      {/* Globe with surface-pinned polaroids */}
      <div ref={boxRef} className="relative aspect-square w-full max-w-xl">
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown}
          className="absolute inset-0 h-full w-full"
          style={{ cursor: 'grab', opacity: 0, transition: 'opacity 1s ease', touchAction: 'none' }}
        />

        {featured.map((article, i) => (
          <div
            key={article.id}
            ref={(el) => (pinRefs.current[i] = el)}
            className="absolute"
            style={{
              left: '50%',
              top: '50%',
              opacity: 0,
              transform: 'translate(-50%, calc(-100% - 6px))',
              willChange: 'left, top, opacity',
            }}
          >
            <Link href={`/dashboard/berita/${article.slug}`} title={article.title} className="group/p block">
              <div
                className={`relative bg-white shadow-[0_10px_30px_-10px_rgba(15,23,42,0.35)] ring-1 ring-slate-900/5 transition-transform duration-300 group-hover/p:scale-110 group-hover/p:!rotate-0 ${ROT[i % ROT.length]}`}
                style={{ width: pinW, padding: pinW * 0.08, paddingBottom: pinW * 0.3 }}
              >
                <span
                  className="block overflow-hidden bg-slate-100"
                  style={{ width: '100%', aspectRatio: '1 / 1' }}
                >
                  <img
                    src={article.img || PLACEHOLDER}
                    onError={(e) => {
                      if (e.currentTarget.src !== PLACEHOLDER) e.currentTarget.src = PLACEHOLDER;
                    }}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </span>
                <span
                  className="absolute inset-x-1 line-clamp-1 text-center font-hand leading-none text-slate-600"
                  style={{ bottom: pinW * 0.07, fontSize: Math.max(9, pinW * 0.12) }}
                >
                  {article.title}
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-slate-400">
        Tarik untuk memutar bola dunia · klik polaroid untuk membuka artikel
      </p>
    </div>
  );
}
