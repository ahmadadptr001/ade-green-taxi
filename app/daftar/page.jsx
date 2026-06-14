'use client';
import React, { useState, useEffect } from 'react';
import { Smartphone, ArrowRight, Mail, User, ChevronLeft, Leaf, Loader2, CheckCircle2, Key, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { daftar } from '@/services/auth';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    password: '',
    role: 'pengunjung',
    status: 'aktif',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const nameOk = formData.name.length > 2;
    const emailOk = formData.email.includes('@') && formData.email.includes('.');
    const waOk = formData.whatsapp.length >= 9 && formData.whatsapp[0] === '8';
    const passOk = formData.password.length >= 6;
    setIsValid(nameOk && emailOk && waOk && passOk);
  }, [formData]);

  const handleChange = (field, value) => setFormData((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setIsLoading(true);
    Swal.fire({ icon: 'info', title: 'Mohon tunggu...', didOpen: () => Swal.showLoading() });
    try {
      const result = await daftar(formData);
      Swal.fire({ icon: 'success', title: 'Akun Berhasil ditambahkan!', didOpen: () => Swal.hideLoading() });
      localStorage.setItem('user', JSON.stringify(result.data));
      setIsLoading(false);
      router.push('/dashboard');
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Registrasi Akun Gagal!', text: err.message, didOpen: () => Swal.hideLoading() });
      setIsLoading(false);
    }
  };

  const field = (label, icon, node) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-600">{label}</label>
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 focus-within:border-emerald-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100">
        {icon}
        {node}
      </div>
    </div>
  );

  const inputCls = 'w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400';

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 md:flex-row">
      {/* Visual side */}
      <div className="relative hidden items-center justify-center overflow-hidden bg-slate-900 p-12 md:flex md:w-[45%]">
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-emerald-600/20 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-96 w-96 rounded-full bg-emerald-900/30 blur-3xl" />
        <div className="relative z-10 max-w-sm">
          <Leaf className="mb-8 h-10 w-10 text-emerald-400" />
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-white">
            Mulai bersama kami.
          </h1>
          <p className="mb-10 mt-6 text-lg leading-relaxed text-slate-400">
            Bergabunglah untuk masa depan mobilitas yang lebih hijau dan berkelanjutan.
          </p>
          <ul className="space-y-4 text-slate-300">
            {['Update Berita', 'Komunitas'].map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Form side */}
      <div className="flex flex-1 flex-col justify-center px-6 py-16 md:px-16">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/beranda" className="mb-12 inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-emerald-600">
            <ChevronLeft size={16} /> Kembali
          </Link>

          <h1 className="font-display text-3xl font-bold tracking-tight">Daftar Akun</h1>
          <p className="mt-3 text-slate-500">Isi detail di bawah untuk membuat profil Anda.</p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            {field('Nama Lengkap', <User className="h-5 w-5 shrink-0 text-slate-400" />, (
              <input type="text" placeholder="Contoh: Budi Santoso" className={inputCls} value={formData.name} onChange={(e) => handleChange('name', e.target.value)} />
            ))}
            {field('Email', <Mail className="h-5 w-5 shrink-0 text-slate-400" />, (
              <input type="email" placeholder="nama@email.com" className={inputCls} value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />
            ))}
            {field('Nomor WhatsApp', (
              <div className="flex shrink-0 items-center gap-2 border-r border-slate-200 pr-3">
                <img src="https://flagcdn.com/w20/id.png" alt="ID" loading="lazy" className="h-auto w-4 rounded-sm" />
                <span className="text-xs font-semibold text-slate-600">+62</span>
              </div>
            ), (
              <input type="tel" placeholder="8123456789" className={inputCls} value={formData.whatsapp} onChange={(e) => handleChange('whatsapp', e.target.value.replace(/\D/g, ''))} />
            ))}
            {field('Password', <Key className="h-5 w-5 shrink-0 text-slate-400" />, (
              <>
                <input type={showPassword ? 'text' : 'password'} placeholder="••••••" className={inputCls} value={formData.password} onChange={(e) => handleChange('password', e.target.value)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-slate-600" aria-label={showPassword ? 'Sembunyikan' : 'Tampilkan'}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </>
            ))}

            <button
              type="submit"
              disabled={!isValid || isLoading}
              className={`group flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-semibold transition-all ${
                isValid && !isLoading ? 'bg-slate-900 text-white hover:bg-emerald-600' : 'cursor-not-allowed bg-slate-100 text-slate-400'
              }`}
            >
              {isLoading ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Memproses...</>
              ) : (
                <>Daftar Sekarang <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>
              )}
            </button>
          </form>

          <p className="mt-12 text-center text-sm text-slate-500">
            Sudah memiliki akun?{' '}
            <Link href="/masuk" className="font-semibold text-emerald-600 hover:text-emerald-700">
              Masuk ke Akun
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
