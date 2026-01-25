'use client';
import { useState } from 'react';
import { Menu, X, ChevronDown, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from './ui/dropdown-menu';
import { useLanguageStore } from '@/store/languageStore';
import ID from '../locales/id.json';
import EN from '../locales/en.json';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguageStore();

  const t = language === 'id' ? ID : EN;

  return (
    <header className="fixed top-0 z-250 w-full bg-white  border-b border-white">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
          <img
            src="/text-2.png"
            alt="Ade Green Taxi"
            className="h-8 w-auto object-contain"
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          <a href="#services" className="hover:text-green-600 transition">
            {t?.mainNavbar.service}
          </a>
          <a href="#about" className="hover:text-green-600 transition">
            {t?.mainNavbar.about}
          </a>
          <a href="#features" className="hover:text-green-600 transition">
            {t?.mainNavbar.feature}
          </a>
          <a href="/faq" className="hover:text-green-600 transition">
            {t?.mainNavbar.faq}
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button className="hidden md:flex items-center gap-2 rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700">
            <img src="/icon-playstore.png" className="h-5 w-5" />
            {t?.semiNavbar.buttonInstall}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-gray-700 hover:text-green-600">
              <Globe className="h-4 w-4" />
              {t?.semiNavbar.languageChoice}
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
                className="cursor-pointer"
              >
                {language === 'id' ? 'English' : 'Indonesia'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t bg-white px-6 py-6 space-y-4 text-gray-700">
          <a href="#services" className="block hover:text-green-600">
            {t?.mainNavbar.service}
          </a>
          <a href="#about" className="block hover:text-green-600">
            {t?.mainNavbar.about}
          </a>
          <a href="#features" className="block hover:text-green-600">
            {t?.mainNavbar.feature}
          </a>
          <a href="/faq" className="block hover:text-green-600">
            {t?.mainNavbar.faq}
          </a>

          <Button className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-green-600 py-3 text-white hover:bg-green-700">
            <img src="/icon-playstore.png" className="h-5 w-5" />
            {t?.semiNavbar.buttonInstall}
          </Button>
        </div>
      )}
    </header>
  );
}
