'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  Leaf,
  Loader2,
  ChevronLeft,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

export default function App() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timer, setTimer] = useState(59);
  const inputRefs = useRef([]);

  // Countdown timer untuk kirim ulang OTP
  useEffect(() => {
    let interval;
    if (timer > 0 && !isVerified) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer, isVerified]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Pindah ke input berikutnya jika ada value
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Kembali ke input sebelumnya jika backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) return;

    setIsLoading(true);
    // Simulasi verifikasi server
    setTimeout(() => {
      setIsLoading(false);
      setIsVerified(true);
    }, 2000);
  };

  const handleResend = () => {
    setTimer(59);
    // Logika kirim ulang kode di sini
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col md:flex-row font-sans text-slate-900">
      {/* Sisi Visual: Desktop Only */}
      <div className="hidden relative md:flex md:w-1/2 bg-slate-900 items-center justify-center overflow-hidden border-r border-slate-100">
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-emerald-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-emerald-900/30 rounded-full blur-3xl"></div>

        <div className="relative z-10 text-center p-12">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-2xl rotate-3">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight italic">
            Keamanan Adalah Prioritas
          </h2>
          <p className="text-slate-400 mt-4 max-w-xs mx-auto leading-relaxed">
            Kami menjaga akun Anda tetap aman dengan verifikasi dua langkah.
          </p>
        </div>
      </div>

      {/* Sisi Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 bg-white overflow-y-auto">
        <div className="w-full max-w-[400px]">
          {!isVerified ? (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center md:text-left">
                <h3 className="text-3xl font-black tracking-tight text-slate-900">
                  Verifikasi Kode
                </h3>
                <p className="text-sm text-slate-500 mt-3 leading-relaxed">
                  Masukkan 6 digit kode OTP yang telah kami kirimkan ke nomor
                  WhatsApp atau Email Anda.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex justify-between gap-2">
                  {otp.map((data, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      ref={(el) => (inputRefs.current[index] = el)}
                      value={data}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className={`w-12 h-16 md:w-14 md:h-20 text-center text-2xl font-black rounded-2xl border-2 transition-all duration-300 outline-none
                        ${
                          otp[index]
                            ? 'border-emerald-500 bg-emerald-50/30 text-emerald-600'
                            : 'border-slate-100 bg-slate-50 text-slate-400 focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-50'
                        }
                      `}
                    />
                  ))}
                </div>

                <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={otp.some((v) => v === '') || isLoading}
                    className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3
                      ${
                        !otp.some((v) => v === '') && !isLoading
                          ? 'bg-slate-900 text-white hover:bg-emerald-600 shadow-xl shadow-slate-200 active:scale-95'
                          : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                      }
                    `}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>Verifikasi Sekarang</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    {timer > 0 ? (
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Kirim ulang kode dalam{' '}
                        <span className="text-emerald-600">{timer} detik</span>
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResend}
                        className="text-xs font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-[0.2em] underline underline-offset-4"
                      >
                        Kirim Ulang OTP
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <div className="text-center space-y-8 animate-in zoom-in duration-500">
              <div className="relative mx-auto w-24 h-24">
                <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-20"></div>
                <div className="relative w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-200">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900">
                  Berhasil Diverifikasi!
                </h3>
                <p className="text-sm text-slate-500 mt-4 leading-relaxed px-4">
                  Identitas Anda telah dikonfirmasi. Anda akan diarahkan ke
                  dashboard dalam beberapa saat.
                </p>
              </div>
              <Link href={'/dashboard'} className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl">
                Masuk ke Dashboard
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
