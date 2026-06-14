"use client";

import { useEffect, useRef } from "react";

/**
 * CarModel — loads a glTF SUV (Quaternius, CC0) for a calm, elegant dark hero.
 *
 * Interaction: the car sits still (no looping wheel/road motion). It starts
 * facing AWAY from the viewer and smoothly rotates to face FORWARD as the user
 * scrolls through the hero. Gentle pointer parallax only. Body paint is
 * recolored + glossed with a RoomEnvironment for premium reflections.
 *
 * Guards: lazy three import, capped DPR, paused off-screen / tab-hidden,
 * prefers-reduced-motion safe, full GPU disposal on unmount.
 */
export default function CarModel({ src = "/models/car.glb", className = "" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer, scene, camera, frame, pmrem, envRT;
    let disposed = false;
    const cleanups = [];
    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    Promise.all([
      import("three"),
      import("three/examples/jsm/loaders/GLTFLoader.js"),
      import("three/examples/jsm/environments/RoomEnvironment.js"),
    ]).then(([THREE, { GLTFLoader }, { RoomEnvironment }]) => {
      if (disposed || !mount) return;

      const W = () => mount.clientWidth || 1;
      const H = () => mount.clientHeight || 1;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(36, W() / H(), 0.1, 100);

      // Intro: start zoomed right up to the car, then ease out to a framing
      // that fits the device width (further back on portrait screens).
      const camLook = new THREE.Vector3(0, 0.5, 0);
      const fitDistance = () => {
        const a = W() / H();
        return a < 1 ? 7.6 * (1 + (1 - a) * 1.05) : 7.6;
      };
      const camStart = new THREE.Vector3(0.15, 1.0, 2.7);
      const camEnd = () => new THREE.Vector3(0.4, 1.7, fitDistance());
      const intro = { active: false, t0: 0, dur: 15000 };

      camera.position.copy(reduceMotion ? camEnd() : camStart);
      camera.lookAt(camLook);

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.setSize(W(), H());
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
      mount.appendChild(renderer.domElement);

      pmrem = new THREE.PMREMGenerator(renderer);
      envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
      scene.environment = envRT.texture;

      // Elegant lighting: warm key + cool teal rim for edge glow on dark.
      const key = new THREE.DirectionalLight(0xffffff, 2.2);
      key.position.set(5, 8, 5);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0x5eead4, 2.0);
      rim.position.set(-6, 3, -5);
      scene.add(rim);
      scene.add(new THREE.HemisphereLight(0x334155, 0x0b1220, 0.6));

      // Soft light pool on the floor behind the car (elegant glow on dark).
      const gc = document.createElement("canvas");
      gc.width = gc.height = 256;
      const gg = gc.getContext("2d");
      const grad = gg.createRadialGradient(128, 128, 10, 128, 128, 128);
      grad.addColorStop(0, "rgba(94,234,212,0.22)");
      grad.addColorStop(0.5, "rgba(45,212,191,0.08)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      gg.fillStyle = grad;
      gg.fillRect(0, 0, 256, 256);
      const pool = new THREE.Mesh(
        new THREE.PlaneGeometry(12, 9),
        new THREE.MeshBasicMaterial({
          map: new THREE.CanvasTexture(gc),
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      );
      pool.rotation.x = -Math.PI / 2;
      pool.position.y = 0.01;
      scene.add(pool);

      // ── Car ──────────────────────────────────────────────────────────────
      const carPivot = new THREE.Group();
      scene.add(carPivot);

      const BODY_COLOR = new THREE.Color("#f3f5f8"); // white
      const FRONT = Math.PI * 1.82; // 3/4 front view
      const REAR = FRONT + Math.PI; // facing away
      let car = null;

      const loader = new GLTFLoader();
      loader.load(
        src,
        (gltf) => {
          if (disposed) return;
          const model = gltf.scene;
          const box = new THREE.Box3().setFromObject(model);
          const size = new THREE.Vector3();
          const center = new THREE.Vector3();
          box.getSize(size);
          box.getCenter(center);
          const scale = 4 / Math.max(size.x, size.z);
          model.scale.setScalar(scale);
          model.position.sub(center.multiplyScalar(scale));
          model.position.y += (size.y * scale) / 2;

          model.traverse((o) => {
            if (!o.isMesh) return;
            o.frustumCulled = false;
            const mats = Array.isArray(o.material) ? o.material : [o.material];
            mats.forEach((m) => {
              if (!m) return;
              const name = (m.name || "").toLowerCase();
              if (name === "white") {
                m.color = BODY_COLOR.clone();
                m.metalness = 0.85;
                m.roughness = 0.22;
              } else if (name === "windows") {
                m.color = new THREE.Color("#070b12");
                m.metalness = 0.9;
                m.roughness = 0.06;
              } else {
                m.metalness = Math.max(m.metalness ?? 0, 0.35);
                m.roughness = Math.min(m.roughness ?? 1, 0.55);
              }
              m.envMapIntensity = 1.2;
              m.needsUpdate = true;
            });
          });

          model.rotation.y = FRONT; // fixed 3/4 front view
          car = model;
          carPivot.add(model);

          // Kick off the zoom-out once the car is actually on screen.
          if (!reduceMotion) {
            intro.active = true;
            intro.t0 = performance.now();
          }
        },
        undefined,
        () => {},
      );

      // ── Scroll-driven facing rotation ───────────────────────────────────
      const heroEl = mount.closest("section") || mount;
      const state = { p: 0, tp: 0, mx: 0, tmx: 0 };
      const readScroll = () => {
        const h = heroEl.offsetHeight || window.innerHeight;
        state.tp = Math.max(0, Math.min(1, window.scrollY / (h * 0.9)));
      };
      readScroll();
      window.addEventListener("scroll", readScroll, { passive: true });
      cleanups.push(() => window.removeEventListener("scroll", readScroll));
      const onPointer = (e) => {
        const r = mount.getBoundingClientRect();
        state.tmx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      };
      window.addEventListener("pointermove", onPointer, { passive: true });
      cleanups.push(() => window.removeEventListener("pointermove", onPointer));
      const onResize = () => {
        camera.aspect = W() / H();
        camera.updateProjectionMatrix();
        renderer.setSize(W(), H());
        if (!intro.active) {
          camera.position.copy(camEnd());
          camera.lookAt(camLook);
        }
      };
      const ro = new ResizeObserver(onResize);
      ro.observe(mount);
      cleanups.push(() => ro.disconnect());

      const lerp = (a, b, t) => a + (b - a) * t;
      const easeInOut = (x) =>
        x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;

      const render = () => {
        state.p += (state.tp - state.p) * 0.08;
        state.mx += (state.tmx - state.mx) * 0.05;
        if (car) {
          // No scroll rotation — fixed facing, only gentle pointer parallax.
          car.rotation.y = FRONT + state.mx * 0.12;
        }

        // Cinematic zoom-out intro (close → device-fit framing).
        if (intro.active) {
          const k = Math.min((performance.now() - intro.t0) / intro.dur, 1);
          const eased = 1 - Math.pow(1 - k, 3); // easeOutCubic
          camera.position.lerpVectors(camStart, camEnd(), eased);
          camera.lookAt(camLook);
          if (k >= 1) intro.active = false;
        }

        renderer.render(scene, camera);
      };

      const loop = () => {
        render();
        frame = requestAnimationFrame(loop);
      };
      const start = () => {
        if (frame == null) frame = requestAnimationFrame(loop);
      };
      const stop = () => {
        if (frame != null) {
          cancelAnimationFrame(frame);
          frame = null;
        }
      };

      let visible = true;
      const io = new IntersectionObserver(
        ([en]) => {
          visible = en.isIntersecting;
          if (visible) start();
          else stop();
        },
        { threshold: 0 },
      );
      io.observe(mount);
      cleanups.push(() => io.disconnect());
      const onVis = () => {
        if (document.hidden) stop();
        else if (visible) start();
      };
      document.addEventListener("visibilitychange", onVis);
      cleanups.push(() =>
        document.removeEventListener("visibilitychange", onVis),
      );

      start();

      cleanups.push(() => {
        stop();
        scene.traverse((o) => {
          if (o.isMesh || o.isPoints) {
            o.geometry?.dispose?.();
            const m = o.material;
            if (Array.isArray(m)) m.forEach((x) => x.dispose?.());
            else m?.dispose?.();
          }
        });
        envRT?.dispose?.();
        pmrem?.dispose?.();
        renderer.dispose();
        if (renderer.domElement?.parentNode === mount)
          mount.removeChild(renderer.domElement);
      });
    });

    return () => {
      disposed = true;
      cleanups.forEach((fn) => fn());
    };
  }, [src]);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
