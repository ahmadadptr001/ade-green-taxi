'use client';
import { useLanguageStore } from '@/store/languageStore';
import ID from '../../locales/id.json';
import EN from '../../locales/en.json';
import { ShieldCheck, Zap, Smartphone, Globe } from 'lucide-react';

export default function Features() {
  const { language } = useLanguageStore();
  const t = language === 'en' ? EN : ID;

  const features = [
    {
      icon: <Zap className="w-10 h-10 text-green-600" />,
      title: language === 'en' ? 'Electric Fleet' : 'Armada Listrik',
    },
    {
      icon: <ShieldCheck className="w-10 h-10 text-green-600" />,
      title: language === 'en' ? 'Trusted Safety' : 'Keamanan Terpercaya',
    },
    {
      icon: <Smartphone className="w-10 h-10 text-green-600" />,
      title: language === 'en' ? 'Smart App' : 'Aplikasi Pintar',
    },
    {
      icon: <Globe className="w-10 h-10 text-green-600" />,
      title: language === 'en' ? '24/7 Availability' : 'Tersedia 24/7',
    },
  ];

  return (
    <section id="features" className="overflow-x-hidden py-18 pt-36 bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto px-8 flex flex-col-reverse lg:flex-row gap-16">
        <div className="grid grid-cols-3 gap-4 relative">
          {features.map((f, i) => (
            <div
              key={i}
              data-aos="zoom-in"
              data-aos-duration="1000"
              data-aos-delay={i * 200}
              className="w-32 h-32 flex items-center justify-center bg-white shadow-lg clip-hexagon hover:scale-105 transition-transform duration-300"
            >
              <div className="flex flex-col items-center gap-2 text-center">
                {f.icon}
                <span className="text-xs font-semibold">{f.title}</span>
              </div>
            </div>
          ))}
        </div>

        <div
          className="flex-1 text-left"
          data-aos="fade-left"
          data-aos-duration="1200"
        >
          <h2 className="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-teal-500">
            {language === 'en' ? 'Features' : 'Fitur'}
          </h2>
          <p className="text-lg text-gray-600 max-w-xl">
            {language === 'en'
              ? 'Discover what makes AdeGreenTaxi the future of urban mobility. Our honeycomb of features ensures every ride is eco‑friendly, safe, smart, and always available.'
              : 'Temukan apa yang menjadikan AdeGreenTaxi masa depan mobilitas perkotaan. Sarang fitur kami memastikan setiap perjalanan ramah lingkungan, aman, pintar, dan selalu tersedia.'}
          </p>
        </div>
      </div>
    </section>
  );
}
