"use client";

import { useRouter } from "next/navigation";
import { CinematicHero } from "@/components/ui/cinematic-hero";

export default function Landing() {
  const router = useRouter();

  const handleStart = () => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });

    const time = setTimeout(() => {
      router.replace("/beranda"); // instant, no scroll transition
    }, 100);

    return () => clearTimeout(time);
  };

  return (
    <div className="overflow-x-hidden">
      <CinematicHero onStart={handleStart} />
    </div>
  );
}
