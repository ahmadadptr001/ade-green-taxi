'use client';
import { useLanguageStore } from '@/store/languageStore';
import ID from '../../locales/id.json';
import EN from '../../locales/en.json';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

export default function FAQ() {
  const { language } = useLanguageStore();
  const t = language === 'en' ? EN : ID;

  const faqs = [
    {
      question:
        language === 'en' ? 'What is AdeGreenTaxi?' : 'Apa itu AdeGreenTaxi?',
      answer:
        language === 'en'
          ? 'AdeGreenTaxi is an eco‑friendly ride‑hailing service powered entirely by electric vehicles. It is designed for sustainable urban mobility while also being cost‑efficient. With lower operating costs compared to fuel taxis, AdeGreenTaxi offers affordable fares without compromising comfort and safety.'
          : 'AdeGreenTaxi adalah layanan taksi ramah lingkungan yang sepenuhnya menggunakan kendaraan listrik. Dirancang untuk mobilitas perkotaan berkelanjutan sekaligus hemat biaya. Dengan biaya operasional lebih rendah dibanding taksi berbahan bakar, AdeGreenTaxi menawarkan tarif terjangkau tanpa mengurangi kenyamanan dan keamanan.',
    },
    {
      question:
        language === 'en'
          ? 'How do I use the app?'
          : 'Bagaimana cara menggunakan aplikasi?',
      answer:
        language === 'en'
          ? 'Download the AdeGreenTaxi app, register with your phone number, set your destination, and confirm your ride. The interface is simple, clear, and designed for instant booking.'
          : 'Unduh aplikasi AdeGreenTaxi, daftar dengan email Anda, tentukan tujuan, lalu konfirmasi perjalanan. Antarmuka aplikasi sederhana, jelas, dan dirancang untuk pemesanan instan.',
    },
    {
      question:
        language === 'en' ? 'How do I register?' : 'Bagaimana cara mendaftar?',
      answer:
        language === 'en'
          ? 'Open the app, choose “Sign Up,” enter your personal details, verify your phone number, and you are ready to ride.'
          : 'Buka aplikasi, pilih “Daftar,” masukkan email, verifikasi email, dan Anda siap menggunakan layanan.',
    },
    {
      question:
        language === 'en'
          ? 'Is AdeGreenTaxi available 24/7?'
          : 'Apakah AdeGreenTaxi tersedia 24/7?',
      answer:
        language === 'en'
          ? 'Yes, our service operates 24/7. You can request a ride anytime, and cash payment is always accepted.'
          : 'Ya, layanan kami beroperasi 24/7. Anda dapat memesan perjalanan kapan saja, dan pembayaran tunai selalu tersedia.',
    },
    {
      question:
        language === 'en'
          ? 'What payment methods are supported?'
          : 'Metode pembayaran apa yang didukung?',
      answer:
        language === 'en'
          ? 'Currently, AdeGreenTaxi supports cash payments for all rides, ensuring simplicity and accessibility.'
          : 'Saat ini, AdeGreenTaxi mendukung pembayaran tunai untuk semua perjalanan, memastikan kemudahan dan aksesibilitas.',
    },
    {
      question:
        language === 'en'
          ? 'Are there promotions or discounts?'
          : 'Apakah ada promo atau diskon?',
      answer:
        language === 'en'
          ? 'Yes, AdeGreenTaxi regularly offers promotional fares and seasonal discounts. Check the app for the latest deals.'
          : 'Ya, AdeGreenTaxi secara rutin menawarkan tarif promo dan diskon musiman. Lihat aplikasi untuk penawaran terbaru.',
    },
    {
      question:
        language === 'en'
          ? 'Can I book a ride for someone else?'
          : 'Bisakah saya memesan untuk orang lain?',
      answer:
        language === 'en'
          ? 'Yes, you can book a ride for family or friends by entering their pickup location and sharing ride details with them.'
          : 'Ya, Anda dapat memesan perjalanan untuk keluarga atau teman dengan memasukkan lokasi penjemputan mereka dan membagikan detail perjalanan.',
    },
    {
      question:
        language === 'en'
          ? 'Is customer support available?'
          : 'Apakah ada layanan dukungan pelanggan?',
      answer:
        language === 'en'
          ? 'Absolutely. AdeGreenTaxi provides customer support through the app, available 24/7 to assist with any issues or questions.'
          : 'Tentu. AdeGreenTaxi menyediakan dukungan pelanggan melalui aplikasi, tersedia 24/7 untuk membantu segala masalah atau pertanyaan.',
    },
    {
      question:
        language === 'en'
          ? 'How safe is the service?'
          : 'Seberapa aman layanan ini?',
      answer:
        language === 'en'
          ? 'We prioritize trusted safety with trained drivers, secure systems, and electric vehicles maintained to the highest standards.'
          : 'Kami mengutamakan keamanan terpercaya dengan pengemudi terlatih, sistem yang aman, dan kendaraan listrik yang dirawat dengan standar tertinggi.',
    },
  ];

  return (
    <section
      id="faq"
      className="overflow-hidden py-20 bg-gray-100 text-gray-900"
    >
      <div className="max-w-4xl mx-auto px-8">
        <h2
          className="text-5xl font-extrabold pb-3 mb-10 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-teal-500"
          data-aos="fade-up"
          data-aos-duration="1200"
        >
          {language === 'en'
            ? 'Frequently Asked Questions'
            : 'Pertanyaan yang Sering Diajukan'}
        </h2>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay={i * 150}
              className="border rounded-lg shadow-sm bg-white"
            >
              <AccordionTrigger className="text-xl font-semibold px-4 py-3">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-lg text-gray-700 px-4 pb-4 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
