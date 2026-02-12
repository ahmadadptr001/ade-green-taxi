'use client';
import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  ArrowRight,
  Leaf,
  Loader2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ChevronLeft,
} from 'lucide-react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { login, updateLoginHostory } from '@/services/auth';
import { useRouter } from 'next/navigation';

export default function LoginPaeg() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isValid, setIsValid] = useState(false);

  // Validasi Login: Email valid & Password minimal 6 karakter
  useEffect(() => {
    const isEmailValid =
      formData.email.includes('@') && formData.email.includes('.');
    const isPasswordValid = formData.password.length >= 6;
    setIsValid(isEmailValid && isPasswordValid);
  }, [formData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setIsLoading(true);

    Swal.fire({
      icon: 'info',
      title: 'Sedang Masuk',
      didOpen: () => Swal.showLoading(),
    });

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
    <div className="fixed inset-0 bg-white flex flex-col md:flex-row font-sans text-slate-900">
      {/* Sisi Visual: Menampilkan gambar penuh di desktop */}
      <div className="hidden relative md:flex md:w-1/2 bg-slate-100 items-center justify-center overflow-hidden border-r border-slate-100">
        <img
          src="/bg-auth.jpg"
          alt="Environmental Background"
          className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-10000 hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 to-transparent"></div>
        <div className="relative z-10 text-center p-12">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 mx-auto border border-white/30">
            <Leaf className="w-8 h-8 text-white fill-white" />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            ADE<span className="text-emerald-500">GREEN</span>TX
          </h2>
          <p className="text-emerald-50 mt-2 max-w-xs mx-auto opacity-90">
            Masuk untuk mendapatkan pembaruan eksklusif tentang ekosistem
            lingkungan.
          </p>
        </div>
      </div>

      {/* Sisi Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 bg-white overflow-y-auto">
        <div className="w-full max-w-[360px] space-y-8">
          <div>
            <h3 className="text-3xl font-black tracking-tight text-slate-900">
              Selamat Datang
            </h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Silakan masukkan email dan kata sandi Anda untuk melanjutkan
              akses.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                Alamat Email
              </label>
              <div
                className={`flex items-center border rounded-2xl px-4 py-4 transition-all duration-300 ${
                  focusedField === 'email'
                    ? 'border-emerald-500 ring-4 ring-emerald-50 bg-white'
                    : 'border-slate-100 bg-slate-50'
                }`}
              >
                <Mail
                  className={`w-5 h-5 mr-3 transition-colors ${focusedField === 'email' ? 'text-emerald-500' : 'text-slate-300'}`}
                />
                <input
                  type="email"
                  placeholder="nama@email.com"
                  className="flex-1 bg-transparent outline-none text-sm font-bold text-slate-800 placeholder-slate-300"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Kata Sandi
                </label>
                <Link
                  href={'/lupa'}
                  type="button"
                  className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest"
                >
                  Lupa?
                </Link>
              </div>
              <div
                className={`flex items-center border rounded-2xl px-4 py-4 transition-all duration-300 ${
                  focusedField === 'password'
                    ? 'border-emerald-500 ring-4 ring-emerald-50 bg-white'
                    : 'border-slate-100 bg-slate-50'
                }`}
              >
                <Lock
                  className={`w-5 h-5 mr-3 transition-colors ${focusedField === 'password' ? 'text-emerald-500' : 'text-slate-300'}`}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent outline-none text-sm font-bold text-slate-800 placeholder-slate-300"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-300 hover:text-slate-500 p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isValid || isLoading}
              className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 mt-4
                ${
                  isValid && !isLoading
                    ? 'bg-slate-900 text-white hover:bg-emerald-600 shadow-xl shadow-slate-200 active:scale-95'
                    : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                }
              `}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Masuk Sekarang</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Footer Form */}
          <div className="pt-8 border-t border-slate-50 text-center">
            <p className="text-sm text-slate-400 font-medium">
              Belum memiliki akun?{' '}
              <Link
                href={'/daftar'}
                className="text-emerald-600 font-bold hover:text-emerald-700 underline underline-offset-8 decoration-2 decoration-emerald-100 transition-all"
              >
                Daftar Akun Baru
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
