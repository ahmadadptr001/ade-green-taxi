'use client';
import { useState } from 'react';
import { useLanguageStore } from '@/store/languageStore';
import ID from '../../locales/id.json';
import EN from '../../locales/en.json';

export default function FAQ() {
  const { language } = useLanguageStore();
  const t = language === 'en' ? EN : ID;
  const [active, setActive] = useState(0);

  const faqs = [
    {
      qEN: 'What is AdeGreenTaxi?',
      qID: 'Apa itu AdeGreenTaxi?',
      aEN:
        'AdeGreenTaxi is an electric taxi service designed for daily urban mobility with lower emissions and efficient operations.',
      aID:
        'AdeGreenTaxi adalah layanan taksi listrik untuk mobilitas harian kota dengan emisi rendah dan operasional efisien.',
    },
    {
      qEN: 'How does booking work?',
      qID: 'Bagaimana cara pemesanan?',
      aEN:
        'You choose a pickup point and destination. The system assigns the nearest available electric vehicle.',
      aID:
        'Anda menentukan titik jemput dan tujuan. Sistem akan menugaskan kendaraan listrik terdekat.',
    },
    {
      qEN: 'Is the service available all day?',
      qID: 'Apakah layanan tersedia sepanjang hari?',
      aEN:
        'Yes. AdeGreenTaxi operates continuously to support daily city movement.',
      aID:
        'Ya. AdeGreenTaxi beroperasi terus untuk mendukung pergerakan kota setiap hari.',
    },
    {
      qEN: 'How do payments work?',
      qID: 'Bagaimana sistem pembayarannya?',
      aEN:
        'At the moment, all rides are paid in cash to keep transactions straightforward.',
      aID:
        'Saat ini semua perjalanan dibayar secara tunai agar transaksi tetap sederhana.',
    },
    {
      qEN: 'How safe is the service?',
      qID: 'Seberapa aman layanan ini?',
      aEN:
        'Vehicles are maintained regularly and operated under controlled standards.',
      aID:
        'Kendaraan dirawat secara rutin dan dioperasikan dengan standar terkontrol.',
    },
  ];

  return (
    <section
      id="faq"
      className="relative py-32 bg-white text-gray-900"
    >
      {/* subtle decorative accent */}
      <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-green-100 rounded-full blur-3xl opacity-60 -z-10" />

      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
        {/* LEFT — Editorial intro */}
        <div data-aos="fade-right">
          <span className="inline-block text-green-600 font-semibold tracking-wide mb-4">
            FAQ
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight">
            {language === 'en'
              ? 'Before you take your first ride'
              : 'Sebelum perjalanan pertama Anda'}
          </h2>
          <p className="mt-6 text-lg text-gray-600 max-w-md">
            {language === 'en'
              ? 'Straightforward answers about how Ade Green TX operates in the city.'
              : 'Jawaban singkat dan jelas tentang bagaimana Ade Green TX beroperasi di kota.'}
          </p>
        </div>

        {/* RIGHT — FAQ list */}
        <div className="space-y-5">
          {faqs.map((f, i) => {
            const isActive = i === active;
            return (
              <div
                key={i}
                onClick={() => setActive(i)}
                className={`cursor-pointer rounded-2xl border transition-all duration-500 p-6
                  ${
                    isActive
                      ? 'border-green-500 bg-green-50 shadow-lg'
                      : 'border-gray-200 hover:border-green-400 hover:bg-gray-50'
                  }`}
              >
                <h3
                  className={`text-lg sm:text-xl font-semibold transition-colors ${
                    isActive ? 'text-green-700' : 'text-gray-900'
                  }`}
                >
                  {language === 'en' ? f.qEN : f.qID}
                </h3>

                <div
                  className={`grid transition-all duration-500 ease-in-out ${
                    isActive
                      ? 'grid-rows-[1fr] opacity-100 mt-4'
                      : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <p className="overflow-hidden text-gray-700 leading-relaxed">
                    {language === 'en' ? f.aEN : f.aID}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
