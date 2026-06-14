'use client';
import React, { useState, useEffect } from 'react';
import { ArrowRight, Leaf, Loader2, Mail, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { emailCheck } from '@/services/auth';

export default function LupaPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    localStorage.removeItem('email');
  }, []);

  useEffect(() => {
    setIsValid(email.includes('@') && email.includes('.'));
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setIsLoading(true);
    Swal.fire({ icon: 'info', title: 'Mohon tunggu...', didOpen: () => Swal.showLoading() });
    try {
      await emailCheck(email);
      Swal.fire({ icon: 'success', title: 'Email Anda ditemukan!', didOpen: () => Swal.hideLoading() });
      localStorage.setItem('email', email);
      setIsLoading(false);
      router.push('/lupa/otp');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Email tidak ditemukan!',
        text: 'Tolong gunakan email yang lain',
        didOpen: () => Swal.hideLoading(),
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 md:flex-row">
      {/* Visual side */}
      <div className="relative hidden items-center justify-center overflow-hidden border-r border-slate-100 bg-slate-100 md:flex md:w-1/2">
        <img src="/bg-auth.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/60 to-transparent" />
        <div className="relative z-10 max-w-xs px-12 text-center">
          <Leaf className="mx-auto mb-6 h-10 w-10 text-white" />
          <h2 className="font-display text-3xl font-bold tracking-tight text-white">Tetap Terhubung</h2>
          <p className="mt-3 leading-relaxed text-emerald-50/80">
            Jangan khawatir, kami bantu Anda kembali ke akun.
          </p>
        </div>
      </div>

      {/* Form side */}
      <div className="flex flex-1 flex-col justify-center px-6 py-16 md:px-16">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/masuk" className="mb-12 inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-emerald-600">
            <ChevronLeft size={16} /> Kembali ke Masuk
          </Link>

          <h1 className="font-display text-3xl font-bold tracking-tight">Lupa Password?</h1>
          <p className="mt-3 text-slate-500">
            Masukkan email Anda untuk menerima instruksi pemulihan kata sandi.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Alamat Email Terdaftar</label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 focus-within:border-emerald-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100">
                <Mail className="h-5 w-5 shrink-0 text-slate-400" />
                <input
                  type="email"
                  placeholder="nama@email.com"
                  className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!isValid || isLoading}
              className={`group flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-semibold transition-all ${
                isValid && !isLoading ? 'bg-slate-900 text-white hover:bg-emerald-600' : 'cursor-not-allowed bg-slate-100 text-slate-400'
              }`}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>Kirim Instruksi <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>
              )}
            </button>
          </form>

          <div className="mt-12 border-t border-slate-100 pt-8 text-center">
            <p className="text-sm text-slate-400">Butuh bantuan lebih lanjut?</p>
            <Link href="/bantuan" className="mt-1 inline-block font-semibold text-emerald-600 hover:text-emerald-700">
              Hubungi Support Ade Green
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
