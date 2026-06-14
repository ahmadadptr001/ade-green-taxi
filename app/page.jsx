"use client";

import { useRouter } from "next/navigation";
import { CinematicHero } from "@/components/ui/cinematic-hero";

export default function Landing() {
  const router = useRouter();

  const handleStart = () => {
    router.replace("/beranda"); // instant, no scroll transition
  };

  return (
    <div className="overflow-x-hidden">
      <CinematicHero onStart={handleStart} />
    </div>
  );
}
