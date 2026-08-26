'use client';
import React, { useState, useEffect } from 'react';
import { Loader2, Eye, EyeOff } from 'lucide-react';
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
      localStorage.setItem('user', JSON.stringify(dataUser.data));
      if (dataUser.token) localStorage.setItem('token', dataUser.token);
      try {
        await updateLoginHostory(dataUser.data.id);
      } catch (activityErr) {
        console.error('Gagal mencatat aktivitas login:', activityErr);
      }
      Swal.fire({
        icon: 'success',
        title: 'Login Berhasil!',
        text: 'Berhasil login ke akun Anda',
        confirmButtonText: 'Masuk ke dashboard',
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
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
    <div className="flex min-h-screen flex-col bg-white md:flex-row">
      {/* Left form side */}
      <div className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-10 md:px-14 lg:px-20">
        <div className="mx-auto w-full max-w-md">
          {/* Heading */}
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Welcome back. Sign in to Ade Green TX
          </h1>

          <form onSubmit={handleSubmit} className="mt-10 space-y-5">
            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition-all duration-200 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 transition-all duration-200 focus-within:border-sky-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-100">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className="w-full bg-transparent px-5 py-3.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="shrink-0 px-4 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? 'Sembunyikan' : 'Tampilkan'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <Link href="/lupa" className="text-sm font-medium text-sky-500 hover:text-sky-600 transition-colors">
                Forgot Password?
              </Link>
            </div>

            {/* CTA */}
            <button
              type="submit"
              disabled={!isValid || isLoading}
              className={`group flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all duration-300 ${
                isValid && !isLoading
                  ? 'bg-gradient-to-r from-sky-500 to-sky-400 text-white shadow-lg shadow-sky-500/25 hover:from-sky-400 hover:to-sky-300 hover:shadow-sky-400/30'
                  : 'cursor-not-allowed bg-slate-100 text-slate-400'
              }`}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Sign up link */}
          <p className="mt-8 text-center text-sm text-slate-500">
            Don&rsquo;t have an account?{' '}
            <Link href="/daftar" className="font-semibold text-sky-500 hover:text-sky-600 transition-colors">
              Sign Up
            </Link>
          </p>

          {/* Footer links */}
          <div className="mt-12 flex items-center justify-center gap-6 border-t border-slate-100 pt-6">
            <Link href="/terms" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>

      {/* Right visual side */}
      <div className="relative h-56 w-full overflow-hidden sm:h-64 md:h-auto md:w-[45%] md:flex-shrink-0 lg:w-[50%]">
        <img
          src="/login-bg.jpeg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        {/* Bottom overlay text */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-6 pt-16 sm:p-8 sm:pt-20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm">
              <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Ade Green TX</p>
              <p className="text-xs text-white/60">Electric Taxi Mobility</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
