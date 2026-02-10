'use client';

// import { useRouter } from 'next/navigation'; // Dinonaktifkan untuk preview
import { useEffect, useState } from 'react';
import { Leaf } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoadingScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 2));
    }, 30);

    const timeout = setTimeout(() => {
      router.replace('/beranda');
    }, 2000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [router]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-neutral-50 font-sans text-neutral-900">
      
      <div className="flex flex-col items-center gap-8">
        
        <div className="relative flex items-center justify-center">
          <div className="absolute h-16 w-16 animate-ping rounded-full bg-emerald-100 opacity-75 duration-1000" />
          <Leaf 
            className="relative z-10 h-12 w-12 text-emerald-800" 
            strokeWidth={1.5} 
            fill="currentColor" 
            fillOpacity={0.1}
          />
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-[0.2em] text-neutral-800 uppercase">
            Ade Green TX
          </h1>
          <p className="mt-2 text-[10px] font-medium tracking-widest text-neutral-400 uppercase">
            Eco Mobility Kendari
          </p>
        </div>

        <div className="mt-4 h-[2px] w-24 overflow-hidden bg-neutral-200 rounded-full">
          <div 
            className="h-full bg-emerald-800 transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }} 
          />
        </div>

      </div>

      <div className="fixed bottom-10 text-[10px] text-neutral-300">
        © {new Date().getFullYear()} ADE GREEN TX
      </div>
    </div>
  );
}