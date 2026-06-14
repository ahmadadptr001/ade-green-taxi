"use client";
import { useLanguageStore } from "@/store/languageStore";
import { MarkText } from "@/components/ui/Typo";
import { AnimatedRoadmap } from "@/components/ui/animated-roadmap";

export default function About() {
  const { language } = useLanguageStore();
  const en = language === "en";

  const milestones = [
    {
      id: 1,
      name: en ? "Eco-Friendly" : "Ramah Lingkungan",
      position: { top: "70%", left: "2%" },
    },
    {
      id: 2,
      name: en ? "Comfortable Ride" : "Perjalanan Nyaman",
      position: { top: "12%", left: "20%" },
    },
    {
      id: 3,
      name: en ? "Easy Payment" : "Pembayaran Mudah",
      position: { top: "46%", left: "50%" },
    },
    {
      id: 4,
      name: en ? "Safe & Trusted" : "Aman & Terpercaya",
      position: { top: "6%", right: "2%" },
    },
  ];

  return (
    <section id="tentang" className="bg-white py-28 pt-20 text-gray-900">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="mb-6 text-4xl font-bold leading-tight md:text-5xl">
          {en ? (
            <>
              Driving the Future of <MarkText>Green Transportation</MarkText>
            </>
          ) : (
            <>
              Menggerakkan Masa Depan <MarkText>Transportasi Hijau</MarkText>
            </>
          )}
        </h2>

        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600">
          <a className="text-sky-600 underline" href="/beranda/tentang">
            Ade Green TX
          </a>{" "}
          {en
            ? "is an electric-based ride-hailing service designed to deliver clean, affordable, and reliable mobility for the city of Kendari."
            : "adalah layanan transportasi berbasis kendaraan listrik yang menghadirkan mobilitas bersih, hemat, dan terpercaya untuk Kota Kendari."}
        </p>
      </div>

      <AnimatedRoadmap
        className="mt-6 px-6"
        milestones={milestones}
        mapImageSrc="/banner-about.png"
      />
    </section>
  );
}
