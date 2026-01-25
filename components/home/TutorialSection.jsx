'use client';

import { useState } from 'react';
import { useLanguageStore } from '@/store/languageStore';
import {
  Search,
  MapPin,
  MapPinned,
  CreditCard,
  PlayCircle,
} from 'lucide-react';

export default function TutorialSection() {
  const { language } = useLanguageStore();
  const [activeStep, setActiveStep] = useState(0);

  const STEPS = [
    {
      titleEN: 'Open App & Tap Search',
      titleID: 'Masuk Aplikasi & Klik Pencarian',
      descEN: 'Open the app and tap the search feature.',
      descID: 'Masuk ke aplikasi lalu klik fitur pencarian.',
      image: '/tutorial/step-1.png',
      Icon: Search,
    },
    {
      titleEN: 'Set Pickup & Destination',
      titleID: 'Masukkan Lokasi Jemput & Tujuan',
      descEN: 'Enter pickup and destination locations.',
      descID: 'Masukkan lokasi penjemputan dan tujuan.',
      image: '/tutorial/step-2.png',
      Icon: MapPin,
    },
    {
      titleEN: 'Confirm Pickup Location',
      titleID: 'Konfirmasi Lokasi Penjemputan',
      descEN: 'Review and confirm your pickup point.',
      descID: 'Periksa dan konfirmasi lokasi penjemputan.',
      image: '/tutorial/step-3.png',
      Icon: MapPinned,
    },
    {
      titleEN: 'Confirm Payment & Enjoy',
      titleID: 'Konfirmasi Pembayaran & Nikmati Perjalanan',
      descEN: 'Confirm payment and enjoy the ride.',
      descID: 'Konfirmasi pembayaran dan nikmati perjalanan.',
      image: '/tutorial/step-4.png',
      Icon: CreditCard,
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-gradient-to-b from-green-50/30 via-white to-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center">
        {/* LEFT */}
        <div>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100/70 text-green-700 text-sm font-medium mb-6">
            <PlayCircle size={16} />
            {language === 'en' ? 'How It Works' : 'Cara Menggunakan'}
          </span>

          <h2 className="text-3xl sm:text-4xl xl:text-5xl font-semibold mb-5 leading-tight">
            {language === 'en'
              ? 'Ride in 4 Simple Steps'
              : 'Perjalanan dalam 4 Langkah'}
          </h2>

          <p className="text-gray-600 text-base sm:text-lg mb-10 max-w-xl">
            {language === 'en'
              ? 'A calm, simple flow designed for your daily mobility.'
              : 'Alur sederhana dan nyaman untuk mobilitas harian Anda.'}
          </p>

          {/* STEPS */}
          <div className="space-y-4">
            {STEPS.map((s, i) => {
              const Icon = s.Icon;
              const active = i === activeStep;

              return (
                <button
                  key={i}
                  onClick={() => setActiveStep(i)}
                  className="w-full text-left focus:outline-none"
                >
                  <div
                    className={`flex gap-4 p-4 sm:p-5 rounded-2xl border transition-all duration-300
                      ${
                        active
                          ? 'bg-white border-green-500/60 shadow-sm'
                          : 'bg-white/70 border-transparent hover:bg-white'
                      }
                    `}
                  >
                    <div
                      className={`shrink-0 p-3 h-fit rounded-xl transition-colors
                        ${
                          active
                            ? 'bg-green-600 text-white'
                            : 'bg-green-100 text-green-600'
                        }
                      `}
                    >
                      <Icon size={20} />
                    </div>

                    <div>
                      <h4 className="font-medium mb-1 text-gray-900">
                        {language === 'en' ? s.titleEN : s.titleID}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {language === 'en' ? s.descEN : s.descID}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative flex justify-center">
          <div className="relative w-[240px] sm:w-[300px] md:w-[340px] lg:w-[360px] xl:w-[400px]">
            {/* Soft glow */}
            <div className="absolute inset-0 rounded-3xl bg-green-400/10 blur-2xl scale-105" />

            <img
              key={activeStep}
              src={STEPS[activeStep].image}
              alt=""
              className="relative w-full rounded-3xl shadow-xl transition-all duration-500"
            />

            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur px-4 py-1 rounded-full text-xs font-medium shadow-sm">
              {language === 'en'
                ? `Step ${activeStep + 1} of 4`
                : `Langkah ${activeStep + 1} dari 4`}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
