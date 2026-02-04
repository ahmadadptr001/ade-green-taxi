'use client';
import { useLanguageStore } from '@/store/languageStore';
import ID from '../../locales/id.json';
import EN from '../../locales/en.json';
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
} from 'lucide-react';

export default function Footer() {
  const { language } = useLanguageStore();
  const t = language === 'en' ? EN : ID;

  return (
    <footer className="relative bg-gray-100 text-gray-800">
      {/* subtle background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 opacity-70" />

      <div className="relative max-w-7xl mx-auto px-8 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          {/* Brand */}
          <div className="lg:col-span-1">
            <p className="text-4xl mb-5 font-semibold">
              ADE<span className="text-emerald-500">GREEN</span>
              <sub className="text-sm">TX</sub>
            </p>

            <p className="text-xl text-gray-600 leading-relaxed">
              {language === 'en'
                ? 'Electric taxi service crafted for modern cities. Quiet rides, fair pricing, and cleaner streets.'
                : 'Layanan taksi listrik untuk kota modern. Perjalanan senyap, harga adil, dan jalanan lebih bersih.'}
            </p>

            <a
              href="#download"
              className="inline-flex items-center gap-2 mt-8 text-green-700 font-semibold hover:gap-4 transition-all"
            >
              {language === 'en' ? 'Get the App' : 'Unduh Aplikasi'}
              <ArrowUpRight className="w-5 h-5" />
            </a>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest text-gray-400 mb-6 uppercase">
              {language === 'en' ? 'Contact' : 'Kontak'}
            </h4>

            <ul className="space-y-5 text-lg text-gray-600">
              <li className="flex gap-3 items-start">
                <Phone className="w-5 h-5 text-green-600 mt-1" />
                +62 812-3456-7890
              </li>
              <li className="flex gap-3 items-start">
                <Mail className="w-5 h-5 text-green-600 mt-1" />
                support@adegreentaxi.com
              </li>
              <li className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 text-green-600 mt-1" />
                Kendari, Sulawesi Tenggara
              </li>
            </ul>

            <div className="flex gap-6 mt-8 text-gray-400">
              <a href="#" className="hover:text-green-600 transition">
                <Facebook />
              </a>
              <a href="#" className="hover:text-green-600 transition">
                <Instagram />
              </a>
              <a href="#" className="hover:text-green-600 transition">
                <Twitter />
              </a>
            </div>
          </div>

          {/* Map */}
          <div className="w-full">
            <h4 className="text-xs font-semibold tracking-widest text-gray-400 mb-6 uppercase">
              {language === 'en' ? 'Office Location' : 'Lokasi Kantor'}
            </h4>

            <div className="relative w-full h-[320px] rounded-2xl overflow-hidden shadow-lg bg-gray-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1990.0006407518533!2d122.50281949575488!3d-4.020132934697751!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d988d7b9541caef%3A0x2cf821d07be9aef4!2sPT.%20ADE%20SULA%20KENDARI!5e0!3m2!1sid!2sid!4v1769315637039!5m2!1sid!2sid"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-24 h-px bg-gray-300/60" />
      </div>

      {/* Bottom */}
      <div className="relative max-w-7xl mx-auto px-8 py-10 text-sm text-gray-500 flex flex-col md:flex-row gap-4 justify-between items-center">
        <span>
          © {new Date().getFullYear()} Ade Green TX. All rights reserved.
        </span>

        <div className="flex gap-6">
          <a href="/terms" className="hover:text-green-600 transition">
            {language === 'en' ? 'Terms' : 'Syarat'}
          </a>
          <a href="/privacy" className="hover:text-green-600 transition">
            {language === 'en' ? 'Privacy' : 'Privasi'}
          </a>
        </div>
      </div>
    </footer>
  );
}
