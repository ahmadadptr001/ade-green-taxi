'use client';
import { useLanguageStore } from '@/store/languageStore';
import ID from '../../locales/id.json';
import EN from '../../locales/en.json';

export default function Services() {
  const { language } = useLanguageStore();
  const data = language === 'id' ? ID : EN;

  const servicesVisual = [
    {
      image: '/services/emisi-carbon.png',
      title: language === 'en' ? 'Zero Emission Fleet' : 'Armada Nol Emisi',
      desc:
        language === 'en'
          ? 'Electric vehicles for cleaner urban transport.'
          : 'Kendaraan listrik untuk transportasi kota yang lebih bersih.',
    },
    {
      image: '/services/mobilitas.png',
      title:
        language === 'en'
          ? 'Point-to-Point Ride'
          : 'Perjalanan Langsung Tujuan',
      desc:
        language === 'en'
          ? 'Direct routes without unnecessary stops.'
          : 'Rute langsung tanpa pemberhentian tidak perlu.',
    },
    {
      image: '/services/cash.png',
      title:
        language === 'en'
          ? 'Pay After Ride'
          : 'Bayar Setelah Perjalanan',
      desc:
        language === 'en'
          ? 'Cash payment with clear fare.'
          : 'Pembayaran tunai dengan tarif jelas.',
    },
    {
      image: '/services/pemesanan.png',
      title:
        language === 'en'
          ? 'On-Demand Booking'
          : 'Pemesanan Sesuai Kebutuhan',
      desc:
        language === 'en'
          ? 'Available when you need it.'
          : 'Tersedia saat Anda membutuhkannya.',
    },
  ];

  return (
    <section id="services" className="py-28 bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20" data-aos="fade-down">
          <h2 className="text-4xl font-bold mb-4">
            {data.servicesHeaderTitle}
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            {data.servicesHeaderDesc}
          </p>
        </div>

        {/* Services Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {servicesVisual.map((s, i) => (
            <div
              key={i}
              data-aos="fade-up"
              data-aos-delay={i * 150}
              className="group relative h-[420px] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <img
                src={s.image}
                alt={s.title}
                className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-700"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

              <div className="absolute bottom-0 p-6 text-white">
                <h3 className="text-xl font-semibold mb-1">
                  {s.title}
                </h3>
                <p className="text-sm text-white/80">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="mt-12 text-center text-sm text-gray-500">
          {language === 'en'
            ? 'Payment is currently accepted in cash. Digital payment options are in development.'
            : 'Saat ini pembayaran dilakukan secara tunai. Opsi pembayaran digital sedang dalam pengembangan.'}
        </p>
      </div>
    </section>
  );
}
