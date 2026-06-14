'use client';

import { Search, MapPin, MapPinned, CreditCard } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import RadialOrbitalTimeline from '@/components/ui/radial-orbital-timeline';

export default function TutorialSection() {
  const { language } = useLanguageStore();
  const en = language === 'en';

  const STEPS = [
    {
      titleEN: 'Open App & Search',
      titleID: 'Buka & Cari',
      descEN: 'Open the app and search your destination.',
      descID: 'Buka aplikasi lalu cari tujuan Anda.',
      image: '/tutorial/step-1.png',
      Icon: Search,
    },
    {
      titleEN: 'Set Pickup & Destination',
      titleID: 'Jemput & Tujuan',
      descEN: 'Pick your pickup point and destination.',
      descID: 'Tentukan titik jemput dan tujuan.',
      image: '/tutorial/step-2.png',
      Icon: MapPin,
    },
    {
      titleEN: 'Confirm Pickup',
      titleID: 'Konfirmasi Jemput',
      descEN: 'Check the pin and confirm pickup.',
      descID: 'Periksa pin lalu konfirmasi penjemputan.',
      image: '/tutorial/step-3.png',
      Icon: MapPinned,
    },
    {
      titleEN: 'Confirm & Enjoy',
      titleID: 'Bayar & Nikmati',
      descEN: 'Confirm the fare and enjoy the ride.',
      descID: 'Konfirmasi tarif dan nikmati perjalanan.',
      image: '/tutorial/step-4.png',
      Icon: CreditCard,
    },
  ];

  const timelineData = STEPS.map((s, i) => ({
    id: i + 1,
    title: en ? s.titleEN : s.titleID,
    date: `${i + 1}/${STEPS.length}`,
    dateLabel: en ? `Step ${i + 1}` : `Langkah ${i + 1}`,
    content: en ? s.descEN : s.descID,
    icon: s.Icon,
    image: s.image,
    relatedIds: [i, i + 2].filter((n) => n >= 1 && n <= STEPS.length),
    status: 'completed',
    energy: Math.round(((i + 1) / STEPS.length) * 100),
    energyLabel: en ? 'Progress' : 'Kemajuan',
    relatedLabel: en ? 'Related steps' : 'Langkah terkait',
  }));

  return (
    <RadialOrbitalTimeline
      timelineData={timelineData}
      subtitle={en ? 'how it works' : 'cara menggunakan'}
      title={en ? 'Ride in 4 Simple Steps' : 'Pesan dalam 4 Langkah'}
    />
  );
}
