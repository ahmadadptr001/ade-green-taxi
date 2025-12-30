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
      icon: <Leaf className="w-12 h-12 text-green-600" />,
      title: language === 'en' ? 'Eco-Friendly' : 'Ramah Lingkungan',
      desc:
        language === 'en'
          ? 'All rides use electric cars to reduce emissions and protect the environment.'
          : 'Semua perjalanan menggunakan mobil listrik untuk mengurangi emisi dan menjaga lingkungan.',
    },
    {
      icon: <Car className="w-12 h-12 text-green-600" />,
      title: language === 'en' ? 'Affordable Mobility' : 'Mobilitas Hemat',
      desc:
        language === 'en'
          ? 'Enjoy cost-efficient taxi rides without hidden fees.'
          : 'Nikmati perjalanan taksi hemat biaya tanpa biaya tersembunyi.',
    },
    {
      icon: <CreditCard className="w-12 h-12 text-green-600" />,
      title:
        language === 'en' ? 'Easy Digital Payment' : 'Pembayaran Digital Mudah',
      desc:
        language === 'en'
          ? 'Pay securely and flexibly through the app.'
          : 'Bayar dengan aman dan fleksibel langsung dari aplikasi.',
    },
    {
      icon: <ShieldCheck className="w-12 h-12 text-green-600" />,
      title: language === 'en' ? 'Safe & Reliable' : 'Aman & Terpercaya',
      desc:
        language === 'en'
          ? 'High safety standards ensure every ride is comfortable and secure.'
          : 'Standar keselamatan tinggi memastikan setiap perjalanan nyaman dan aman.',
    },
  ];

  const rotations = ['-2deg', '1deg', '-3deg', '2deg'];

  return (
    <section id='about' className="py-32 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900">
      <div className="max-w-7xl mx-auto px-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div data-aos="fade-right" data-aos-duration="1200">
          <h2 className="text-5xl font-extrabold mb-8 leading-tight">
            {language === 'en' ? 'About AdeGreenTaxi' : 'Tentang AdeGreenTaxi'}
          </h2>
          <p className="text-xl text-gray-700 mb-12 leading-relaxed max-w-2xl">
            {language === 'en'
              ? 'AdeGreenTaxi is an online taxi application powered by electric cars. We provide eco-friendly, affordable, and safe rides for your daily mobility. Travel smarter while saving costs and helping the planet.'
              : 'AdeGreenTaxi adalah aplikasi taksi online berbasis mobil listrik. Kami menyediakan perjalanan ramah lingkungan, hemat biaya, dan aman untuk mobilitas harian Anda. Bepergian lebih cerdas sambil menghemat biaya dan menjaga bumi.'}
          </p>
          <a
            href="/"
            data-aos="zoom-in"
            data-aos-duration="1000"
            className="inline-block px-8 py-4 rounded-xl bg-green-600 text-white text-lg font-semibold hover:bg-green-700 transition"
          >
            {language === 'en' ? 'Download App' : 'Unduh Aplikasi'}
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              data-aos="fade-up"
              data-aos-duration="1200"
              data-aos-delay={i * 200}
              className={"relative group bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-500 clip-hexagon flex flex-col items-center text-center"}
              style={{
                transform: `rotate(${rotations[i % rotations.length]})`,
              }}
            >
              <div className="mb-6 transform group-hover:scale-110 transition">
                {f.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
              <p className="text-gray-600 text-sm">{f.desc}</p>
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-green-100 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
