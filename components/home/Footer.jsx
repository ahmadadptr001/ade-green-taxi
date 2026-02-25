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
  ChevronRight, // Ikon baru untuk mempercantik list menu
} from 'lucide-react';

export default function Footer() {
  const { language } = useLanguageStore();
  const t = language === 'en' ? EN : ID;
  const isID = language === 'id';

  // Data Menu Akses Cepat
  const quickLinks = [
    { name: 'ADE GREEN TX', href: '/' },
    { name: 'ADE GREEN NEWS', href: '/berita' },
    { name: 'ADE GREEN SEARCH', href: '/beranda/pencarian' },
    {
      name: language === 'en' ? 'Download App' : 'Unduh Aplikasi',
      href: '/beranda',
    },
    {
      name: language === 'en' ? 'Help Center' : 'Pusat Bantuan',
      href: '/bantuan',
    },
  ];

  return (
    <footer className="relative bg-gray-50 text-gray-800 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-gray-100 to-white opacity-80 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <p className="text-3xl mb-6 font-bold tracking-tight">
                ADE<span className="text-emerald-600">GREEN</span>
                <sub className="text-sm text-gray-500 ml-1 font-medium">TX</sub>
              </p>

              <p className="text-lg text-gray-500 leading-relaxed pr-4">
                {language === 'en'
                  ? 'Electric taxi service crafted for modern cities. Quiet rides, fair pricing, and cleaner streets.'
                  : 'Layanan taksi listrik untuk kota modern. Perjalanan senyap, harga adil, dan jalanan lebih bersih.'}
              </p>

              <a
                href="#download"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-white border border-gray-200 rounded-full shadow-sm text-emerald-700 font-semibold hover:bg-emerald-50 hover:border-emerald-200 hover:shadow-md transition-all group w-fit"
              >
                {language === 'en' ? 'Get the App' : 'Unduh Aplikasi'}
                <ArrowUpRight className="w-5 h-5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

            <div className="flex gap-5 mt-8 md:mt-10 text-gray-400">
              <a
                href="#"
                className="hover:text-emerald-600 transition-colors transform hover:scale-110"
              >
                <Facebook size={22} />
              </a>
              <a
                href="#"
                className="hover:text-emerald-600 transition-colors transform hover:scale-110"
              >
                <Instagram size={22} />
              </a>
              <a
                href="#"
                className="hover:text-emerald-600 transition-colors transform hover:scale-110"
              >
                <Twitter size={22} />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold tracking-widest text-gray-400 mb-6 uppercase">
              {language === 'en' ? 'Quick Access' : 'Akses Cepat'}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="group flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 transition-colors opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold tracking-widest text-gray-400 mb-6 uppercase">
              {language === 'en' ? 'Contact' : 'Kontak'}
            </h4>

            <ul className="space-y-6 text-gray-600">
              <li className="flex gap-4 items-start group">
                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                  <Phone className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <span className="block text-xs text-gray-400 mb-0.5">
                    {isID ? 'Hubungi' : 'Hotline'}
                  </span>
                  +62 812-3456-7890
                </div>
              </li>
              <li className="flex gap-4 items-start group">
                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                  <Mail className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <span className="block text-xs text-gray-400 mb-0.5">
                    Email
                  </span>
                  email@adegreentx.id
                </div>
              </li>
              <li className="flex gap-4 items-start group">
                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <span className="block text-xs text-gray-400 mb-0.5">
                    Location
                  </span>
                  Kendari, Sulawesi Tenggara
                </div>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold tracking-widest text-gray-400 mb-6 uppercase">
              {language === 'en' ? 'Office' : 'Kantor'}
            </h4>

            <div className="relative w-full h-[240px] rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-gray-200 border border-white">
              <iframe
                title="maps overview"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1990.0006407518533!2d122.50281949575488!3d-4.020132934697751!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d988d7b9541caef%3A0x2cf821d07be9aef4!2sPT.%20ADE%20SULA%20KENDARI!5e0!3m2!1sid!2sid!4v1769315637039!5m2!1sid!2sid"
                className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-gray-200" />

        <div className="relative py-8 flex flex-col md:flex-row gap-4 justify-between items-center text-sm text-gray-500">
          <span className="font-medium">
            © {new Date().getFullYear()} Ade Green TX.
          </span>

          <div className="flex gap-8">
            <a
              href="/terms"
              className="hover:text-emerald-600 transition-colors"
            >
              {language === 'en' ? 'Terms of Service' : 'Syarat & Ketentuan'}
            </a>
            <a
              href="/privacy"
              className="hover:text-emerald-600 transition-colors"
            >
              {language === 'en' ? 'Privacy Policy' : 'Kebijakan Privasi'}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
