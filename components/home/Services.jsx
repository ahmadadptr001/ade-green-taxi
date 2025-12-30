import { useLanguageStore } from '@/store/languageStore';
import { Car, Leaf, CreditCard, Clock } from 'lucide-react';
import ID from '../../locales/id.json';
import EN from '../../locales/en.json';

export default function Services() {
  const { language } = useLanguageStore();
  const data = language === 'id' ? ID : EN;

  const dataIcon = [
    { icon: <Leaf className="w-12 h-12 text-green-600" /> },
    { icon: <Car className="w-12 h-12 text-green-600" /> },
    { icon: <CreditCard className="w-12 h-12 text-green-600" /> },
    { icon: <Clock className="w-12 h-12 text-green-600" /> },
  ];

  return (
    <section id="services" className="py-24 bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto px-8">
        <div
          className="text-center mb-16"
          data-aos="fade-down"
          data-aos-duration="1000"
        >
          <h2 className="text-4xl font-bold mb-4">
            {data.servicesHeaderTitle}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {data.servicesHeaderDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.services.map((s, i) => (
            <div
              key={i}
              data-aos="zoom-in"
              data-aos-duration="1000"
              data-aos-delay={i * 200}
              className="bg-white rounded-xl p-8 flex flex-col items-start gap-6 shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="p-4 bg-green-100 rounded-lg">
                {dataIcon[i].icon}
              </div>
              <h3 className="text-xl font-semibold">{s.title}</h3>
              <p className="text-gray-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
