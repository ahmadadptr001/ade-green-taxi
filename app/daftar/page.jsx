'use client'
import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  ArrowRight, 
  Mail, 
  User, 
  ChevronLeft,
  Leaf,
  Loader2
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
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-500 selection:text-white flex flex-col items-center justify-center p-4 md:p-8">
      
      {/* Tombol Kembali & Logo Atas */}
      <div className="w-full max-w-2xl mb-8 flex items-center justify-between">
        <button 
          onClick={() => window.history.back()}
          className="group flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors"
        >
          <div className="p-2 rounded-full bg-white border border-slate-200 group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-all shadow-sm">
            <ChevronLeft className="w-5 h-5" />
          </div>
          <span className="font-semibold text-sm">Kembali</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-md">
            <Leaf className="w-4 h-4 text-white fill-white" />
          </div>
        </div>
      </div>

      {/* Card Utama (Fokus Formulir) */}
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden transition-all duration-500">
        <div className="p-8 md:p-16">
          <div className="mb-10 text-center">
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">Daftar Akun Baru</h3>
            <p className="text-slate-500 mt-2 text-base">
              Lengkapi informasi di bawah untuk bergabung dalam ekosistem hijau kami.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Field: Nama */}
            <div className="group space-y-2">
              <label className="text-xs uppercase tracking-[0.15em] font-bold text-slate-400 ml-1">Nama Lengkap</label>
              <div className={`
                flex items-center border-b-2 transition-all duration-300 py-3
                ${focusedField === 'name' ? 'border-emerald-500' : 'border-slate-100 group-hover:border-slate-300'}
              `}>
                <User className={`w-6 h-6 mr-4 transition-colors ${focusedField === 'name' ? 'text-emerald-500' : 'text-slate-300'}`} />
                <input
                  type="text"
                  placeholder="Nama Lengkap Anda"
                  className="w-full bg-transparent outline-none text-lg text-slate-800 placeholder-slate-300 font-medium"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            {/* Field: Email */}
            <div className="group space-y-2">
              <label className="text-xs uppercase tracking-[0.15em] font-bold text-slate-400 ml-1">Alamat Email</label>
              <div className={`
                flex items-center border-b-2 transition-all duration-300 py-3
                ${focusedField === 'email' ? 'border-emerald-500' : 'border-slate-100 group-hover:border-slate-300'}
              `}>
                <Mail className={`w-6 h-6 mr-4 transition-colors ${focusedField === 'email' ? 'text-emerald-500' : 'text-slate-300'}`} />
                <input
                  type="email"
                  placeholder="nama@perusahaan.com"
                  className="w-full bg-transparent outline-none text-lg text-slate-800 placeholder-slate-300 font-medium"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            {/* Field: WhatsApp */}
            <div className="group space-y-2">
              <label className="text-xs uppercase tracking-[0.15em] font-bold text-slate-400 ml-1">Nomor WhatsApp</label>
              <div className={`
                flex items-center border-b-2 transition-all duration-300 py-3
                ${focusedField === 'whatsapp' ? 'border-emerald-500' : 'border-slate-100 group-hover:border-slate-300'}
              `}>
                <div className="flex items-center gap-2 mr-4 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                  <img src="https://flagcdn.com/w20/id.png" alt="ID" className="w-5 h-auto rounded-sm" />
                  <span className="text-sm font-bold text-slate-700">+62</span>
                </div>
                <input
                  type="tel"
                  placeholder="812 3456 7890"
                  className="w-full bg-transparent outline-none text-lg text-slate-800 placeholder-slate-300 font-medium"
                  value={formData.whatsapp}
                  onChange={(e) => handleChange('whatsapp', e.target.value.replace(/\D/g, ''))}
                  onFocus={() => setFocusedField('whatsapp')}
                  onBlur={() => setFocusedField(null)}
                />
                <Smartphone className={`w-6 h-6 ${focusedField === 'whatsapp' ? 'text-emerald-500' : 'text-slate-300'}`} />
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={!isValid || isLoading}
                className={`
                  w-full py-5 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl
                  ${isValid 
                    ? 'bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-1 active:scale-95' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                  }
                `}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Mendaftarkan...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Buat Akun Ade Green</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </button>
            </div>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-400 font-medium">
              Sudah memiliki akun?{' '}
              <Link href="/masuk" className="text-emerald-600 font-bold hover:underline decoration-2 underline-offset-4 transition-all">
                Masuk ke Akun
              </Link>
            </p>
          </div>
        </div>
      </div>

     
    </div>
  );
}