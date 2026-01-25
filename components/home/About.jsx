'use client';
import { useLanguageStore } from '@/store/languageStore';
import ID from '../../locales/id.json';
import EN from '../../locales/en.json';
import { Leaf, Car, CreditCard, ShieldCheck } from 'lucide-react';

export default function About() {
  const { language } = useLanguageStore();
  const t = language === 'en' ? EN : ID;

  const features = [
    {
      icon: <Leaf className="w-6 h-6 text-green-600" />,
      title: language === 'en' ? 'Eco Friendly' : 'Ramah Lingkungan',
      desc:
        language === 'en'
          ? '100% electric vehicles to reduce emissions.'
          : '100% kendaraan listrik untuk mengurangi emisi.',
    },
    {
      icon: <Car className="w-6 h-6 text-green-600" />,
      title: language === 'en' ? 'Comfortable Ride' : 'Perjalanan Nyaman',
      desc:
        language === 'en'
          ? 'Clean, quiet, and modern vehicles.'
          : 'Kendaraan bersih, senyap, dan modern.',
    },
    {
      icon: <CreditCard className="w-6 h-6 text-green-600" />,
      title: language === 'en' ? 'Digital Payment' : 'Pembayaran Digital',
      desc:
        language === 'en'
          ? 'Easy and secure cashless payment.'
          : 'Pembayaran non-tunai yang mudah dan aman.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-green-600" />,
      title: language === 'en' ? 'Safe & Reliable' : 'Aman & Terpercaya',
      desc:
        language === 'en'
          ? 'Professional drivers and safety standards.'
          : 'Pengemudi profesional dan standar keselamatan tinggi.',
    },
  ];

  return (
    <section id="about" className="py-28 bg-white text-gray-900">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Image */}
        <div className="relative">
          <img
            src="/banner-about.png"
            alt="Ade Green Taxi Electric Vehicle"
            className="rounded-3xl shadow-xl w-full object-cover"
          />
          <div className="absolute inset-0 rounded-3xl ring-1 ring-black/5"></div>
        </div>
        {/* Text */}
        <div>
          <span className="inline-block mb-4 px-4 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium">
            About Ade Green Taxi
          </span>

          <h2 className="text-4xl font-bold leading-tight mb-6">
            {language === 'en'
              ? 'Driving the Future of Green Transportation'
              : 'Menggerakkan Masa Depan Transportasi Hijau'}
          </h2>

          <p className="text-lg text-gray-600 leading-relaxed mb-10 max-w-xl">
            {language === 'en'
              ? 'Ade Green Taxi is an electric-based ride-hailing service designed to deliver clean, affordable, and reliable mobility for urban life.'
              : 'Ade Green Taxi adalah layanan transportasi berbasis kendaraan listrik yang menghadirkan mobilitas bersih, hemat, dan terpercaya.'}
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="p-3 rounded-xl bg-green-50">{item.icon}</div>
                <div>
                  <h4 className="font-semibold mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
