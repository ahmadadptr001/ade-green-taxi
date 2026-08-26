'use client';
import React, { useState, useEffect } from 'react';
import { ArrowRight, Leaf, Loader2, Lock, Mail, Eye, EyeOff, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { login, updateLoginHostory } from '@/services/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const emailOk = formData.email.includes('@') && formData.email.includes('.');
    setIsValid(emailOk && formData.password.length >= 6);
  }, [formData]);

  const handleChange = (field, value) => setFormData((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setIsLoading(true);
    Swal.fire({ icon: 'info', title: 'Sedang Masuk', didOpen: () => Swal.showLoading() });
    try {
      const dataUser = await login(formData.email, formData.password);
      setIsLoading(false);
      if (dataUser.data.status == 'ditangguhkan') {
        Swal.fire({
          icon: 'warning',
          title: 'Akun Ditangguhkan',
          text: 'Akun Anda sementara ditangguhkan dan tidak dapat masuk ke sistem. Silakan hubungi Customer Service untuk informasi lebih lanjut.',
          confirmButtonText: 'Mengerti',
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        return;
      }
      await updateLoginHostory(dataUser.data.id);
      Swal.fire({
        icon: 'success',
        title: 'Login Berhasil!',
        text: 'Berhasil login ke akun Anda',
        confirmButtonText: 'Masuk ke dashboard',
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.setItem('user', JSON.stringify(dataUser.data));
          router.replace('/dashboard/berita');
        }
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Login Gagal!',
        text: 'Email atau password yang Anda masukkan salah',
        didOpen: () => Swal.hideLoading(),
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 md:flex-row">
      {/* Visual side */}
      <div className="relative hidden items-center justify-center overflow-hidden border-r border-slate-100 bg-slate-100 md:flex md:w-1/2">
        <img
          src="/bg-auth.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-emerald-900/20 to-transparent" />
        <div className="relative z-10 max-w-xs px-12 text-center">
          <Leaf className="mx-auto mb-6 h-10 w-10 text-white" />
          <h2 className="font-display text-3xl font-bold tracking-tight text-white">
            Ade<span className="text-emerald-400">Green</span> TX
          </h2>
          <p className="mt-3 leading-relaxed text-emerald-50/80">
            Masuk untuk mengelola konten dan mendapatkan pembaruan ekosistem hijau.
          </p>
        </div>
      </div>

      {/* Form side */}
      <div className="flex flex-1 flex-col justify-center px-6 py-16 md:px-16">
        <div className="mx-auto w-full max-w-sm">
          <Link
            href="/beranda"
            className="mb-12 inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-emerald-600"
          >
            <ChevronLeft size={16} /> Kembali
          </Link>

          <h1 className="font-display text-3xl font-bold tracking-tight">Selamat Datang</h1>
          <p className="mt-3 text-slate-500">
            Masukkan email dan kata sandi Anda untuk melanjutkan.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Alamat Email</label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 focus-within:border-emerald-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100">
                <Mail className="h-5 w-5 shrink-0 text-slate-400" />
                <input
                  type="email"
                  placeholder="nama@email.com"
                  className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-600">Kata Sandi</label>
                <Link href="/lupa" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                  Lupa?
                </Link>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 focus-within:border-emerald-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100">
                <Lock className="h-5 w-5 shrink-0 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? 'Sembunyikan' : 'Tampilkan'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isValid || isLoading}
              className={`group flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-semibold transition-all ${
                isValid && !isLoading
                  ? 'bg-slate-900 text-white hover:bg-emerald-600'
                  : 'cursor-not-allowed bg-slate-100 text-slate-400'
              }`}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Masuk Sekarang
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <p className="mt-12 text-center text-sm text-slate-500">
            Belum memiliki akun?{' '}
            <Link href="/daftar" className="font-semibold text-emerald-600 hover:text-emerald-700">
              Daftar Akun Baru
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
