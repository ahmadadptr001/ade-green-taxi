'use client';

import { useLanguageStore } from '@/store/languageStore';
import ScrollFAQAccordion from '@/components/ui/scroll-faqaccordion';

export default function FAQ() {
  const { language } = useLanguageStore();
  const en = language === 'en';

  const faqs = [
    {
      qEN: 'What is Ade Green TX?',
      qID: 'Apa itu Ade Green TX?',
      aEN: 'Ade Green TX is an electric taxi service designed for daily urban mobility with lower emissions and efficient operations.',
      aID: 'Ade Green TX adalah layanan taksi listrik untuk mobilitas harian kota dengan emisi rendah dan operasional efisien.',
    },
    {
      qEN: 'How does booking work?',
      qID: 'Bagaimana cara pemesanan?',
      aEN: 'You choose a pickup point and destination. The system assigns the nearest available electric vehicle.',
      aID: 'Anda menentukan titik jemput dan tujuan. Sistem akan menugaskan kendaraan listrik terdekat.',
    },
    {
      qEN: 'Is the service available all day?',
      qID: 'Apakah layanan tersedia sepanjang hari?',
      aEN: 'Yes. Ade Green TX operates continuously to support daily city movement.',
      aID: 'Ya. Ade Green TX beroperasi terus untuk mendukung pergerakan kota setiap hari.',
    },
    {
      qEN: 'How do payments work?',
      qID: 'Bagaimana sistem pembayarannya?',
      aEN: 'At the moment, all rides are paid in cash to keep transactions straightforward.',
      aID: 'Saat ini semua perjalanan dibayar secara tunai agar transaksi tetap sederhana.',
    },
    {
      qEN: 'How safe is the service?',
      qID: 'Seberapa aman layanan ini?',
      aEN: 'Vehicles are maintained regularly and operated under controlled standards.',
      aID: 'Kendaraan dirawat secara rutin dan dioperasikan dengan standar terkontrol.',
    },
  ];

  const data = faqs.map((f, i) => ({
    id: i + 1,
    question: en ? f.qEN : f.qID,
    answer: en ? f.aEN : f.aID,
  }));

  return (
    <section id="faq" className="bg-white text-gray-900">
      <ScrollFAQAccordion
        data={data}
        subtitle={en ? 'questions?' : 'pertanyaan?'}
        title={en ? 'Frequently Asked Questions' : 'Pertanyaan yang Sering Diajukan'}
      />
    </section>
  );
}
