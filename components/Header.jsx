'use client';
import { useState } from 'react';
import { Menu, X, Search, ChevronDown, Globe, ALargeSmall } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
    <header className="fixed w-full top-0 z-50 bg-background shadow-sm">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4 px-6">
        {/* Left: Brand + Hamburger */}
        <div className="flex items-center gap-3">
          {/* Hamburger hanya muncul di mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          {/* <span className="text-xl font-extrabold text-green-600 md:text-4xl">
            AdeGreenTaxi
          </span> */}
          <img
            src="/text-2.png"
            alt=""
            loading="lazy"
            className="object-contain w-32 sm:w-40 sm:w-50"
          />
        </div>

        {/* Center: Navigation (hilang di mobile) */}
        <nav className="hidden md:flex items-center gap-6 text-lg font-medium text-foreground">
          <a href="#services" className="hover:text-green-600">
            {t?.mainNavbar.service}
          </a>
          <a href="#about" className="hover:text-green-600">
            {t?.mainNavbar.about}
          </a>
          <a href="#features" className="hover:text-green-600">
            {t?.mainNavbar.feature}
          </a>
          <a href="/faq" className="hover:text-green-600">
            {t?.mainNavbar.faq}
          </a>
        </nav>

        {/* Right: Search + Button */}
        <div className="flex items-center gap-5">
          <Button className="items-center md:flex gap-1 bg-green-600 text-white hover:bg-green-700 text-sm px-4 py-3 rounded-md hidden">
            <img src="/icon-playstore.png" className="w-6 h-6 object-cover" />
            <span className="text-lg">{t?.semiNavbar.buttonInstall}</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex gap-1 sm:gap-2 items-center">
                <Globe className="size-[13px] sm:size-[18px]" />
                <span>{t?.semiNavbar.languageChoice}</span>
                <ChevronDown className="size-[13px] sm:size-[18px]" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className={'cursor-pointer'}
                onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
              >
                <ALargeSmall /> {language === 'id' ? 'English' : 'Indonesia'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t px-4 py-3 space-y-3 text-gray-700 font-medium">
          <a href="#services" className="block">
            {t?.mainNavbar.service}
          </a>
          <a href="#about" className="block">
            {t?.mainNavbar.about}
          </a>
          <a href="#features" className="block">
            {t?.mainNavbar.feature}
          </a>
          <a href="/faq" className="hover:text-green-600">
            {t?.mainNavbar.faq}
          </a>
          <Button className="flex mt-4 items-center gap-1 p-6 w-full bg-green-600 text-white hover:bg-green-700 text-sm">
            <img
              src="/icon-playstore.png"
              className="w-4 h-4 object-cover"
              loading="lazy"
            />
            <span>{t?.semiNavbar.buttonInstall}</span>
          </Button>
        </div>
      )}
    </header>
  );
}
