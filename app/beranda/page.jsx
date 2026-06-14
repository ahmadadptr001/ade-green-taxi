"use client";
import Header from "@/components/Header";
import Hero from "@/components/home/Hero";
import dynamic from "next/dynamic";

// Below-the-fold sections are split out of the initial bundle and streamed in
// as the user scrolls, keeping the hero's first paint lean.
const Marquee = dynamic(() => import("@/components/home/Marquee"));
const Stats = dynamic(() => import("@/components/home/Stats"));
const TutorialSection = dynamic(
  () => import("@/components/home/TutorialSection"),
);
const Services = dynamic(() => import("@/components/home/Services"));
const About = dynamic(() => import("@/components/home/About"));
const FeaturesShowcase = dynamic(
  () => import("@/components/home/FeaturesShowcase"),
  { ssr: false },
);
const Features = dynamic(() => import("@/components/home/Features"));
const FAQ = dynamic(() => import("@/components/home/FAQ"));
const Footer = dynamic(() => import("@/components/home/Footer"));
const ScrollToTop = dynamic(() => import("@/components/ScrollToTop"), {
  ssr: false,
});

export default function HomePage() {
  return (
    <main>
      <Header />
      <Hero />
      {/* <Marquee /> */}
      <Stats />
      <Services />
      <TutorialSection />
      <About />
      <FeaturesShowcase />
      {/* <Features /> */}
      <FAQ />
      <Footer />
      <ScrollToTop />
    </main>
  );
}
