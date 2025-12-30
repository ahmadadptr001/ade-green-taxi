'use client';

import { useEffect, useState } from 'react';
import { X, YoutubeIcon } from 'lucide-react';

export default function IklanModal() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowModal(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showModal && (
        <main className="fixed inset-0 z-99999999 overflow-hidden">
          <div className="bg-black/40 h-full backdrop-blur-sm flex items-center justify-center min-h-screen overflow-y-auto p-4">
            <div
              data-aos-duration='500'
              data-aos="fade-down"
              data-aos-anchor-placement="top-bottom"
              className="relative w-full max-w-lg bg-background rounded-lg p-6 flex flex-col gap-4"
            >
              {/* Banner */}
              <img
                src="/banner.png"
                alt="Banner"
                className="w-full h-120 rounded-md object-contain"
                loading="lazy"
              />

              {/* Buttons */}
              <div className="w-full flex flex-nowrap text-white gap-2 mt-4">
                <a
                  href="/"
                  className="w-full flex items-center justify-center gap-2 p-3 bg-green-500 rounded-lg"
                >
                  <img
                    loading="lazy"
                    src="/icon-playstore.png"
                    className="w-7 h-7 object-cover"
                  />
                  <p>Download</p>
                </a>
                <a
                  href="/"
                  className="flex w-full items-center justify-center gap-2 p-3 bg-red-500 rounded-lg"
                >
                  <YoutubeIcon size={28} fill="white" stroke="red" />
                  <p>Cara Daftar</p>
                </a>
              </div>

              {/* Close button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute cursor-pointer -right-3 -top-3 p-2 w-10 h-10 flex items-center justify-center rounded-full bg-red-500 text-white shadow-md"
              >
                <X />
              </button>
            </div>
          </div>
        </main>
      )}
    </>
  );
}
