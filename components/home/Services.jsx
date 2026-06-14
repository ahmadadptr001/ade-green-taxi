'use client';

import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { useLanguageStore } from '@/store/languageStore';
import ID from '../../locales/id.json';
import EN from '../../locales/en.json';

export default function Services() {
  const { language } = useLanguageStore();
  const data = language === 'id' ? ID : EN;
  const en = language === 'en';

  // Our services + relevant, Indonesia-context images from /public.
  const projects = [
    {
      color: '#052e16',
      src: '/features/mobil-listrik.png',
      title: en ? 'Zero-Emission Fleet' : 'Armada Nol Emisi',
      tag: en ? 'Electric' : 'Listrik',
    },
    {
      color: '#1e293b',
      src: '/jakarta.png',
      title: en ? 'Point-to-Point Ride' : 'Perjalanan Langsung',
      tag: en ? 'City' : 'Perkotaan',
    },
    {
      color: '#0f766e',
      src: '/services/cash.png',
      title: en ? 'Pay After Ride' : 'Bayar Setelah Perjalanan',
      tag: en ? 'Fare' : 'Tarif',
    },
    {
      color: '#334155',
      src: '/services/pemesanan.png',
      title: en ? 'On-Demand Booking' : 'Pemesanan Mudah',
      tag: en ? 'App' : 'Aplikasi',
    },
  ];

  const [modal, setModal] = useState({ active: false, index: 0 });

  return (
    <section id="layanan" className="overflow-hidden bg-[#f9f9f9] py-20 text-gray-900 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="font-display text-5xl font-bold tracking-tight md:text-7xl">
            {en ? 'Services.' : 'Layanan.'}
          </h2>
          <p className="max-w-md font-medium text-neutral-500">
            {data.servicesHeaderDesc}
          </p>
        </div>

        {/* List */}
        <div className="mt-12 flex flex-col">
          {projects.map((project, index) => (
            <ProjectRow
              key={project.title}
              index={index}
              project={project}
              setModal={setModal}
            />
          ))}
        </div>

        {/* Cursor-follow modal (desktop / hover devices only) */}
        <div className="hidden md:block">
          <Modal modal={modal} projects={projects} label={en ? 'View' : 'Lihat'} />
        </div>
      </div>
    </section>
  );
}

function ProjectRow({ index, project, setModal }) {
  return (
    <div
      className="group flex cursor-pointer items-center justify-between gap-4 border-t border-neutral-300 py-6 transition-opacity duration-200 last:border-b hover:opacity-60 md:py-10"
      onMouseEnter={() => setModal({ active: true, index })}
      onMouseLeave={() => setModal({ active: false, index })}
    >
      {/* mobile thumbnail */}
      <img
        src={project.src}
        alt={project.title}
        loading="lazy"
        className="h-14 w-20 shrink-0 rounded-lg object-cover md:hidden"
        style={{ backgroundColor: project.color }}
      />
      <h3 className="m-0 flex-1 text-2xl font-normal transition-transform duration-300 group-hover:translate-x-2 sm:text-4xl md:text-6xl">
        {project.title}
      </h3>
      <p className="shrink-0 text-sm font-light text-neutral-500 transition-transform duration-300 group-hover:translate-x-2">
        {project.tag}
      </p>
    </div>
  );
}

function Modal({ modal, projects, label }) {
  const { active, index } = modal;
  const modalContainer = useRef(null);
  const cursor = useRef(null);
  const cursorLabel = useRef(null);

  useEffect(() => {
    const xC = gsap.quickTo(modalContainer.current, 'left', { duration: 0.8, ease: 'power3' });
    const yC = gsap.quickTo(modalContainer.current, 'top', { duration: 0.8, ease: 'power3' });
    const xCur = gsap.quickTo(cursor.current, 'left', { duration: 0.5, ease: 'power3' });
    const yCur = gsap.quickTo(cursor.current, 'top', { duration: 0.5, ease: 'power3' });
    const xLab = gsap.quickTo(cursorLabel.current, 'left', { duration: 0.45, ease: 'power3' });
    const yLab = gsap.quickTo(cursorLabel.current, 'top', { duration: 0.45, ease: 'power3' });

    const onMove = (e) => {
      const { clientX, clientY } = e;
      xC(clientX); yC(clientY);
      xCur(clientX); yCur(clientY);
      xLab(clientX); yLab(clientY);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const scale = active ? 1 : 0;
  const baseStyle = {
    transform: `translate(-50%, -50%) scale(${scale})`,
    transition: 'transform 0.4s cubic-bezier(0.76,0,0.24,1)',
  };

  return (
    <>
      <div
        ref={modalContainer}
        className="pointer-events-none fixed left-0 top-0 z-[60] flex h-[260px] w-[340px] items-center justify-center overflow-hidden rounded-lg bg-white shadow-2xl"
        style={baseStyle}
      >
        <div
          className="absolute h-full w-full transition-[top] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
          style={{ top: `${index * -100}%` }}
        >
          {projects.map((project) => (
            <div
              key={project.title}
              className="flex h-full w-full items-center justify-center"
              style={{ backgroundColor: project.color }}
            >
              <img src={project.src} alt={project.title} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      <div
        ref={cursor}
        className="pointer-events-none fixed left-0 top-0 z-[61] flex h-20 w-20 items-center justify-center rounded-full bg-emerald-600"
        style={baseStyle}
      />
      <div
        ref={cursorLabel}
        className="pointer-events-none fixed left-0 top-0 z-[61] flex h-20 w-20 items-center justify-center rounded-full bg-transparent text-sm font-light text-white"
        style={baseStyle}
      >
        {label}
      </div>
    </>
  );
}
