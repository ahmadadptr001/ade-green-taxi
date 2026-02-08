'use client';
import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  ArrowRight, 
  Mail, 
  User, 
  ChevronLeft,
  Leaf,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

export default function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isValid, setIsValid] = useState(false);

  // Validasi: Nama > 2, Email valid, WA minimal 9 digit
  useEffect(() => {
    const isNameValid = formData.name.length > 2;
    const isEmailValid = formData.email.includes('@') && formData.email.includes('.');
    const isWaValid = formData.whatsapp.length >= 9;
    setIsValid(isNameValid && isEmailValid && isWaValid);
  }, [formData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert(`Pendaftaran berhasil! Selamat bergabung, ${formData.name}.`);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col md:flex-row font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Sisi Kiri: Branding & Visual (Hanya Desktop) */}
      <div className="hidden md:flex md:w-[45%] bg-slate-900 relative overflow-hidden items-center justify-center p-12">
        {/* Dekorasi Abstract */}
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-emerald-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-emerald-900/30 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-sm">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl mb-8 rotate-3">
            <Leaf className="w-8 h-8 text-white fill-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-6 tracking-tight leading-tight">
            Mulai langkah hijau Anda bersama kami.
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-10">
            Bergabunglah dengan ribuan agen perubahan untuk masa depan yang lebih berkelanjutan.
          </p>
          
          <ul className="space-y-4 text-slate-300">
            {['Update Berita Lingkungan', 'Akses Eksklusif Event Hijau', 'Komunitas Peduli Alam'].map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sisi Kanan: Formulir */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto bg-white">
        
        <div className="w-full max-w-[400px] mt-12">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Daftar Akun</h2>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              Silakan isi detail di bawah ini untuk membuat profil Anda.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input: Nama */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-1">Nama Lengkap</label>
              <div className={`
                flex items-center border rounded-2xl px-4 py-4 transition-all duration-300
                ${focusedField === 'name' ? 'border-emerald-500 ring-4 ring-emerald-50' : 'border-slate-100 bg-slate-50'}
              `}>
                <User className={`w-5 h-5 mr-3 ${focusedField === 'name' ? 'text-emerald-500' : 'text-slate-400'}`} />
                <input
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  className="w-full bg-transparent outline-none text-slate-800 placeholder-slate-300 font-semibold"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            {/* Input: Email */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-1">Email</label>
              <div className={`
                flex items-center border rounded-2xl px-4 py-4 transition-all duration-300
                ${focusedField === 'email' ? 'border-emerald-500 ring-4 ring-emerald-50' : 'border-slate-100 bg-slate-50'}
              `}>
                <Mail className={`w-5 h-5 mr-3 ${focusedField === 'email' ? 'text-emerald-500' : 'text-slate-400'}`} />
                <input
                  type="email"
                  placeholder="nama@email.com"
                  className="w-full bg-transparent outline-none text-slate-800 placeholder-slate-300 font-semibold"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            {/* Input: WhatsApp */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-1">Nomor WhatsApp</label>
              <div className={`
                flex items-center border rounded-2xl px-4 py-4 transition-all duration-300
                ${focusedField === 'whatsapp' ? 'border-emerald-500 ring-4 ring-emerald-50' : 'border-slate-100 bg-slate-50'}
              `}>
                <div className="flex items-center gap-2 mr-3 pr-3 border-r border-slate-200">
                  <img src="https://flagcdn.com/w20/id.png" alt="ID" className="w-4 h-auto rounded-sm" />
                  <span className="text-xs font-bold text-slate-600">+62</span>
                </div>
                <input
                  type="tel"
                  placeholder="8123456789"
                  className="w-full bg-transparent outline-none text-slate-800 placeholder-slate-300 font-semibold"
                  value={formData.whatsapp}
                  onChange={(e) => handleChange('whatsapp', e.target.value.replace(/\D/g, ''))}
                  onFocus={() => setFocusedField('whatsapp')}
                  onBlur={() => setFocusedField(null)}
                />
                <Smartphone className={`w-5 h-5 ${focusedField === 'whatsapp' ? 'text-emerald-500' : 'text-slate-400'}`} />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={!isValid || isLoading}
                className={`
                  w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-500
                  ${isValid 
                    ? 'bg-slate-900 text-white hover:bg-emerald-600 shadow-xl shadow-slate-200 active:scale-95' 
                    : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  }
                `}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Memproses...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Daftar Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </button>
            </div>
          </form>

          <div className="mt-12 text-center">
            <p className="text-slate-400 text-sm font-medium">
              Sudah memiliki akun?{' '}
              <Link href={'/masuk'} className="text-emerald-600 font-bold hover:text-emerald-700 underline decoration-emerald-200 underline-offset-8 decoration-2 transition-all">
                Masuk ke Akun
              </Link>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}