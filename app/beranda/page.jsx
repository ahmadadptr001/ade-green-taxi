'use client';
import Header from '@/components/Header';
import Hero from '@/components/home/Hero';
import IklanModal from '@/components/iklan/IklanModal';
import { useEffect } from 'react';
import AOS from 'aos';
import Services from '@/components/home/Services';
import ScrollToTop from '@/components/ScrollToTop';
import Features from '@/components/home/Features';
import About from '@/components/home/About';
import FAQ from '@/components/home/FAQ';
import Footer from '@/components/home/Footer';
import TutorialSection from '@/components/home/TutorialSection';
import 'aos/dist/aos.css';

export default function HomePage() {
  useEffect(() => {
    AOS.init();
  }, []);
  return (
    <main>
      <IklanModal />
      <ScrollToTop />

      <Header />
      <Hero />
      <TutorialSection />
      <Services />
      <About />
      <Features />
      <FAQ />
      <Footer />
    </main>
  );
}
