'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Progress } from "@/components/ui/progress";

export default function LoadingScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let value = 0;
    const interval = setInterval(() => {
      value += 10;
      setProgress(value);
      if (value >= 100) {
        clearInterval(interval);
        router.push('/beranda'); // ⬅️ setelah selesai, ke landing page
      }
    }, 300); // 300ms per step → total ~3 detik
    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="flex flex-col items-center space-y-6 w-72">
        <img src="/text-2.png" alt="" className='w-50 object-cover'/>
        <Progress value={progress} className="w-full" />
      </div>
    </div>
  );
}
