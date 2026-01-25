'use client';

import Header from '@/components/Header';
import Footer from '@/components/home/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import { useLanguageStore } from '@/store/languageStore';
import { Car, Leaf, Clock, ShieldCheck, Smartphone } from 'lucide-react';

export default function LayananPage() {
  const { language } = useLanguageStore();

  const SERVICES = [
    {
      icon: Car,
      titleEN: 'Electric Taxi Service',
      titleID: 'Layanan Taksi Listrik',
      descEN: 'Comfortable city rides using 100% electric vehicles.',
      descID: 'Perjalanan nyaman di dalam kota menggunakan kendaraan listrik.',
    },
    {
      icon: Leaf,
      titleEN: 'Eco-Friendly Mobility',
      titleID: 'Mobilitas Ramah Lingkungan',
      descEN: 'Reduce emissions and support sustainable urban transport.',
      descID: 'Mengurangi emisi dan mendukung transportasi berkelanjutan.',
    },
    {
      icon: Clock,
      titleEN: 'On-Demand & Scheduled',
      titleID: 'Pesan Langsung & Terjadwal',
      descEN: 'Book instantly or schedule your ride ahead of time.',
      descID: 'Pesan langsung atau jadwalkan perjalanan Anda.',
    },
    {
      icon: ShieldCheck,
      titleEN: 'Safe & Monitored',
      titleID: 'Aman & Terpantau',
      descEN: 'Drivers and vehicles monitored in real time.',
      descID: 'Pengemudi dan kendaraan dipantau secara real-time.',
    },
    {
      icon: Smartphone,
      titleEN: 'Smart Application',
      titleID: 'Aplikasi Pintar',
      descEN: 'All services controlled directly from the mobile app.',
      descID: 'Semua layanan dikontrol langsung dari aplikasi.',
    },
  ];

  return (
    <main className="bg-white">
      <Header />
      <ScrollToTop />
      {/* HERO */}
      <section className="bg-white overflow-hidden">
        {/* FULL WIDTH HERO IMAGE */}
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] bg-green-50">
          <img
            src="/services/hero-layanan.png"
            alt="Ade Green Taxi Electric Service"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* subtle overlay biar teks kebaca kalau perlu */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-white" />
        </div>

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto px-6 pt-16 pb-24 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-6">
            🌱 Ade Green Taxi
          </span>

          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-semibold leading-tight mb-6">
            {language === 'en'
              ? 'Smart & Eco-Friendly Urban Mobility'
              : 'Mobilitas Perkotaan yang Cerdas & Ramah Lingkungan'}
          </h1>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-10">
            {language === 'en'
              ? 'Clean transportation services powered by electric vehicles and smart technology.'
              : 'Layanan transportasi bersih berbasis kendaraan listrik dan teknologi pintar.'}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#"
              className="px-6 py-3 rounded-xl bg-green-600 text-white font-medium shadow-lg hover:bg-green-700 transition"
            >
              {language === 'en' ? 'Download App' : 'Unduh Aplikasi'}
            </a>

            <a
              href="#layanan"
              className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
            >
              {language === 'en' ? 'View Services' : 'Lihat Layanan'}
            </a>
          </div>
        </div>
      </section>

      {/* SERVICES SPLIT SECTION */}
      <section id="layanan" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-14 items-start">
          {/* A — LEFT CONTENT */}
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <span className="inline-block mb-4 px-4 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
              {language === 'en'
                ? 'Our Capabilities'
                : 'Kemampuan Layanan Kami'}
            </span>

            <h2 className="text-3xl sm:text-4xl font-semibold leading-tight mb-6">
              {language === 'en'
                ? 'Designed for Clean, Modern Urban Mobility'
                : 'Dirancang untuk Mobilitas Perkotaan yang Bersih & Modern'}
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed">
              {language === 'en'
                ? 'Ade Green Taxi provides integrated electric transportation services that prioritize comfort, safety, and sustainability in every journey.'
                : 'Ade Green Taxi menghadirkan layanan transportasi listrik terintegrasi yang mengutamakan kenyamanan, keamanan, dan keberlanjutan di setiap perjalanan.'}
            </p>
          </div>

          {/* B — RIGHT SERVICES */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {SERVICES.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={i}
                  className="group rounded-3xl border border-gray-100 bg-white p-7 sm:p-8 transition
              hover:shadow-xl hover:-translate-y-1"
                >
                  <div
                    className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-6
              group-hover:bg-green-600 group-hover:text-white transition"
                  >
                    <Icon size={22} />
                  </div>

                  <h3 className="text-lg font-medium mb-2">
                    {language === 'en' ? s.titleEN : s.titleID}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {language === 'en' ? s.descEN : s.descID}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SIMPLE FLOW */}
      <section className="py-24 bg-green-50/40">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-12">
            {language === 'en'
              ? 'How Our Service Works'
              : 'Cara Kerja Layanan Kami'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            {[
              {
                en: 'Order via App',
                id: 'Pesan Lewat Aplikasi',
              },
              {
                en: 'Driver Picks You Up',
                id: 'Pengemudi Menjemput',
              },
              {
                en: 'Arrive Comfortably',
                id: 'Tiba dengan Nyaman',
              },
            ].map((step, i) => (
              <div key={i}>
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-600 text-white flex items-center justify-center font-medium">
                  {i + 1}
                </div>
                <p className="font-medium">
                  {language === 'en' ? step.en : step.id}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
