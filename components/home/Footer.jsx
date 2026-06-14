"use client";

import { Facebook, Instagram, Twitter, Mail, Car } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import { Footer as AnimatedFooter } from "@/components/ui/modem-animated-footer";

export default function Footer() {
  const { language } = useLanguageStore();
  const en = language === "en";

  const socialLinks = [
    { icon: <Facebook className="h-6 w-6" />, href: "#", label: "Facebook" },
    { icon: <Instagram className="h-6 w-6" />, href: "#", label: "Instagram" },
    { icon: <Twitter className="h-6 w-6" />, href: "#", label: "Twitter" },
    {
      icon: <Mail className="h-6 w-6" />,
      href: "mailto:support@adegreentx.id",
      label: "Email",
    },
  ];

  const navLinks = [
    { label: en ? "Services" : "Layanan", href: "/beranda#layanan" },
    { label: en ? "News" : "Berita", href: "/berita" },
    { label: en ? "About" : "Tentang", href: "/beranda/tentang" },
    { label: "FAQ", href: "/beranda#faq" },
    { label: en ? "Help Center" : "Pusat Bantuan", href: "/bantuan" },
    { label: en ? "Terms" : "Syarat & Ketentuan", href: "/terms" },
    { label: en ? "Privacy" : "Kebijakan Privasi", href: "/privacy" },
  ];

  return (
    <AnimatedFooter
      brandName="Ade Green TX"
      brandDescription={
        en
          ? "Electric taxi service for the city of Kendari — quiet rides, fair pricing, and cleaner streets."
          : "Layanan taksi listrik untuk Kota Kendari — perjalanan senyap, harga adil, dan jalanan lebih bersih."
      }
      socialLinks={socialLinks}
      navLinks={navLinks}
      brandIcon={
        <Car className="h-8 w-8 text-background drop-shadow-lg sm:h-10 sm:w-10 md:h-14 md:w-14" />
      }
    />
  );
}
