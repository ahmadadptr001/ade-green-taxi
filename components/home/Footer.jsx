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
} from 'lucide-react';

export default function Footer() {
  const { language } = useLanguageStore();
  const t = language === 'en' ? EN : ID;

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand Section */}
        <div>
          <img
            src="/text-2.png"
            alt=""
            loading="lazy"
            className="object-contain mb-4 w-60"
          />
          <p className="text-lg leading-relaxed text-gray-300">
            {language === 'en'
              ? 'Eco‑friendly rides with electric taxis. Affordable, safe, and always available for your urban journey.'
              : 'Perjalanan ramah lingkungan dengan taksi listrik. Hemat biaya, aman, dan selalu tersedia untuk mobilitas Anda.'}
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xl font-semibold mb-4">
            {language === 'en' ? 'Quick Links' : 'Tautan Cepat'}
          </h4>
          <ul className="space-y-2 text-lg">
            <li>
              <a href="#features" className="hover:text-green-400 transition">
                {language === 'en' ? 'Features' : 'Fitur'}
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-green-400 transition">
                {language === 'en' ? 'FAQ' : 'FAQ'}
              </a>
            </li>
            <li>
              <a href="#download" className="hover:text-green-400 transition">
                {language === 'en' ? 'Download App' : 'Unduh Aplikasi'}
              </a>
            </li>
            <li>
              <a href="#support" className="hover:text-green-400 transition">
                {language === 'en' ? 'Support' : 'Dukungan'}
              </a>
            </li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h4 className="text-xl font-semibold mb-4">
            {language === 'en' ? 'Contact Us' : 'Hubungi Kami'}
          </h4>
          <ul className="space-y-3 text-lg">
            <li className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-green-400" /> +62 812‑3456‑7890
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-green-400" />{' '}
              support@adegreentaxi.com
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-400" /> Kendari, Sulawesi
              Tenggara
            </li>
          </ul>
          <div className="flex gap-4 mt-6">
            <a href="#" className="hover:text-green-400 transition">
              <Facebook className="w-6 h-6" />
            </a>
            <a href="#" className="hover:text-green-400 transition">
              <Instagram className="w-6 h-6" />
            </a>
            <a href="#" className="hover:text-green-400 transition">
              <Twitter className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 text-center py-6 pb-0 text-gray-400 text-sm">
        © {new Date().getFullYear()} AdeGreenTaxi.{' '}
        {language === 'en' ? 'All rights reserved.' : 'Hak cipta dilindungi.'}
      </div>
      <div className="flex mt-1 items-center gap-2 justify-center pb-6 text-sm text-blue-500">
        <a href="/terms" className="hover:text-green-400 transition">
          {language === 'en' ? 'Terms & Conditions' : 'Syarat dan Ketentuan'}
        </a>
        <span className='text-gray-400'>|</span>
        <a href="/privacy" className="hover:text-green-400 transition">
          {language === 'en' ? 'Privacy Policy' : 'Kebijakan Privasi'}
        </a>
      </div>
    </footer>
  );
}
