'use client';
import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  ArrowRight,
  ChevronLeft,
  Leaf,
  Loader2,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function App() {
  const [view, setView] = useState('login'); // 'login' atau 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isValid, setIsValid] = useState(false);

  // Validasi Login: Email valid & Password minimal 6 karakter
  // Validasi Daftar: Nama > 2, Email valid, WA minimal 9 digit, Password minimal 6 karakter
  useEffect(() => {
    const isEmailValid =
      formData.email.includes('@') && formData.email.includes('.');
    const isPasswordValid = formData.password.length >= 6;

    if (view === 'login') {
      setIsValid(isEmailValid && isPasswordValid);
    } else {
      const isNameValid = formData.name.length > 2;
      const isWaValid = formData.whatsapp.length >= 9;
      setIsValid(isNameValid && isEmailValid && isWaValid && isPasswordValid);
    }
  }, [formData, view]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const message =
        view === 'login'
          ? 'Berhasil masuk! Mengalihkan ke dashboard...'
          : `Pendaftaran berhasil! Selamat bergabung, ${formData.name}.`;
      alert(message);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-500 selection:text-white flex flex-col items-center justify-center p-4 md:p-8">
      {/* Tombol Kembali & Logo Atas */}
      <div className="w-full max-w-2xl mb-8 flex items-center justify-between">
        <button
          onClick={() =>
            view === 'register' ? setView('login') : window.history.back()
          }
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

      {/* Card Utama */}
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden transition-all duration-500">
        <div className="p-8 md:p-16">
          <div className="mb-10 text-center">
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {view === 'login' ? 'Masuk ke Akun' : 'Daftar Akun Baru'}
            </h3>
            <p className="text-slate-500 mt-2 text-base">
              {view === 'login'
                ? 'Gunakan email dan kata sandi Anda untuk masuk.'
                : 'Lengkapi informasi di bawah untuk bergabung dalam ekosistem hijau kami.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {view === 'register' && (
              <>
                {/* Field: Nama */}
                <div className="group space-y-2">
                  <label className="text-xs uppercase tracking-[0.15em] font-bold text-slate-400 ml-1 text-[10px]">
                    Nama Lengkap
                  </label>
                  <div
                    className={`
                    flex items-center border-b-2 transition-all duration-300 py-3
                    ${focusedField === 'name' ? 'border-emerald-500' : 'border-slate-100 group-hover:border-slate-300'}
                  `}
                  >
                    <div className="w-10 flex justify-center">
                      <User
                        className={`w-5 h-5 transition-colors ${focusedField === 'name' ? 'text-emerald-500' : 'text-slate-300'}`}
                      />
                    </div>
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
              </>
            )}

            {/* Field: Email (Selalu Ada) */}
            <div className="group space-y-2">
              <label className="text-xs uppercase tracking-[0.15em] font-bold text-slate-400 ml-1 text-[10px]">
                Alamat Email
              </label>
              <div
                className={`
                flex items-center border-b-2 transition-all duration-300 py-3
                ${focusedField === 'email' ? 'border-emerald-500' : 'border-slate-100 group-hover:border-slate-300'}
              `}
              >
                <div className="w-10 flex justify-center">
                  <Mail
                    className={`w-5 h-5 transition-colors ${focusedField === 'email' ? 'text-emerald-500' : 'text-slate-300'}`}
                  />
                </div>
                <input
                  type="email"
                  placeholder="nama@email.com"
                  className="w-full bg-transparent outline-none text-lg text-slate-800 placeholder-slate-300 font-medium"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            {view === 'register' && (
              /* Field: WhatsApp (Hanya di Register) */
              <div className="group space-y-2">
                <label className="text-xs uppercase tracking-[0.15em] font-bold text-slate-400 ml-1 text-[10px]">
                  Nomor WhatsApp
                </label>
                <div
                  className={`
                  flex items-center border-b-2 transition-all duration-300 py-3
                  ${focusedField === 'whatsapp' ? 'border-emerald-500' : 'border-slate-100 group-hover:border-slate-300'}
                `}
                >
                  <div className="flex items-center gap-2 mr-4 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                    <img
                      src="https://flagcdn.com/w20/id.png"
                      alt="ID"
                      className="w-5 h-auto rounded-sm"
                    />
                    <span className="text-sm font-bold text-slate-700">
                      +62
                    </span>
                  </div>
                  <input
                    type="tel"
                    placeholder="812 3456 7890"
                    className="w-full bg-transparent outline-none text-lg text-slate-800 placeholder-slate-300 font-medium"
                    value={formData.whatsapp}
                    onChange={(e) =>
                      handleChange(
                        'whatsapp',
                        e.target.value.replace(/\D/g, '')
                      )
                    }
                    onFocus={() => setFocusedField('whatsapp')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <Smartphone
                    className={`w-6 h-6 ${focusedField === 'whatsapp' ? 'text-emerald-500' : 'text-slate-300'}`}
                  />
                </div>
              </div>
            )}

            {/* Field: Password (Selalu Ada) */}
            <div className="group space-y-2">
              <label className="text-xs uppercase tracking-[0.15em] font-bold text-slate-400 ml-1 text-[10px]">
                Kata Sandi
              </label>
              <div
                className={`
                flex items-center border-b-2 transition-all duration-300 py-3
                ${focusedField === 'password' ? 'border-emerald-500' : 'border-slate-100 group-hover:border-slate-300'}
              `}
              >
                <div className="w-10 flex justify-center">
                  <Lock
                    className={`w-5 h-5 transition-colors ${focusedField === 'password' ? 'text-emerald-500' : 'text-slate-300'}`}
                  />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full bg-transparent outline-none text-lg text-slate-800 placeholder-slate-300 font-medium"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-300 hover:text-emerald-500 transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={!isValid || isLoading}
                className={`
                  w-full py-5 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl
                  ${
                    isValid
                      ? 'bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-1 active:scale-95'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                  }
                `}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Memproses...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>
                      {view === 'login'
                        ? 'Masuk Sekarang'
                        : 'Daftar Akun Ade Green'}
                    </span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </button>
            </div>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-400 font-medium">
              {view === 'login'
                ? 'Belum memiliki akun?'
                : 'Sudah memiliki akun?'}{' '}
              <button
                onClick={() => {
                  setView(view === 'login' ? 'register' : 'login');
                  setFormData({
                    name: '',
                    email: '',
                    whatsapp: '',
                    password: '',
                  });
                }}
                className="text-emerald-600 font-bold hover:underline decoration-2 underline-offset-4 transition-all"
              >
                {view === 'login' ? 'Daftar Akun Baru' : 'Masuk ke Akun'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
