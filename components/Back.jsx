import { useLanguageStore } from '@/store/languageStore';
import { ChevronLeft } from 'lucide-react';

export default function Back() {
  const { language } = useLanguageStore();
  const isEn = language === 'en'
  return (
    <a href='/beranda' className='flex items-center gap-2'>
      <ChevronLeft />
      <span>{isEn ? 'Back' : 'Kembali'}</span>
    </a>
  );
}
