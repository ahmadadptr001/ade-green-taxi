'use client';
import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  ArrowRight,
  Leaf,
  Loader2,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function App() {
  const [view, setView] = useState('login');
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
          ? 'Login berhasil.'
          : `Pendaftaran berhasil. Selamat bergabung, ${formData.name}.`;
      alert(message);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col md:flex-row font-sans text-slate-900">
      {/* Sisi Visual (Desktop Only) */}
      <div className="hidden relative md:flex md:w-1/2 bg-slate-50 items-center justify-center p-12 border-r border-slate-100">
        <div className="absolute w-full h-full">
          <img
            src={'/bg-auth.jpg'}
            alt="background desktop"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Sisi Form */}
      <div className="flex-1 flex items-center justify-center md:p-6 md:p-12 overflow-y-auto">
        <div className="w-full h-full md:h-auto bg-white md:bg-transparent rounded-md md:shadow-none md:p-0 shadow-md/20 p-10 z-2 md:max-w-[360px] space-y-8">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">
              {view === 'login' ? 'Selamat Datang' : 'Buat Akun'}
            </h3>
            <p className="text-sm text-slate-500 mt-1.5">
              {view === 'login'
                ? 'Silakan masuk untuk melanjutkan akses.'
                : 'Daftar sekarang untuk menjadi bagian dari komunitas.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {view === 'register' && (
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-0.5">
                  Nama Lengkap
                </label>
                <div
                  className={`flex items-center border rounded-xl px-4 py-3 transition-all ${focusedField === 'name' ? 'border-emerald-500 ring-2 ring-emerald-50' : 'border-slate-200 bg-slate-50/50'}`}
                >
                  <User
                    className={`w-4 h-4 mr-3 ${focusedField === 'name' ? 'text-emerald-500' : 'text-slate-400'}`}
                  />
                  <input
                    type="text"
                    placeholder="Nama Lengkap"
                    className="flex-1 bg-transparent outline-none text-sm font-medium"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-0.5">
                Email
              </label>
              <div
                className={`flex items-center border rounded-xl px-4 py-3 transition-all ${focusedField === 'email' ? 'border-emerald-500 ring-2 ring-emerald-50' : 'border-slate-200 bg-slate-50/50'}`}
              >
                <Mail
                  className={`w-4 h-4 mr-3 ${focusedField === 'email' ? 'text-emerald-500' : 'text-slate-400'}`}
                />
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="flex-1 bg-transparent outline-none text-sm font-medium"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            {view === 'register' && (
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-0.5">
                  WhatsApp
                </label>
                <div
                  className={`flex items-center border rounded-xl px-4 py-3 transition-all ${focusedField === 'whatsapp' ? 'border-emerald-500 ring-2 ring-emerald-50' : 'border-slate-200 bg-slate-50/50'}`}
                >
                  <span className="text-xs font-bold text-slate-500 mr-3 border-r pr-3">
                    +62
                  </span>
                  <input
                    type="tel"
                    placeholder="8123456789"
                    className="flex-1 bg-transparent outline-none text-sm font-medium"
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
                  <Smartphone className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-0.5">
                  Password
                </label>
                {view === 'login' && (
                  <button
                    type="button"
                    className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700"
                  >
                    Lupa Password?
                  </button>
                )}
              </div>
              <div
                className={`flex items-center border rounded-xl px-4 py-3 transition-all ${focusedField === 'password' ? 'border-emerald-500 ring-2 ring-emerald-50' : 'border-slate-200 bg-slate-50/50'}`}
              >
                <Lock
                  className={`w-4 h-4 mr-3 ${focusedField === 'password' ? 'text-emerald-500' : 'text-slate-400'}`}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent outline-none text-sm font-medium"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isValid || isLoading}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 mt-4
                ${
                  isValid && !isLoading
                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }
              `}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{view === 'login' ? 'Masuk' : 'Daftar Sekarang'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-slate-500 font-medium">
              {view === 'login' ? 'Baru di sini?' : 'Sudah punya akun?'}{' '}
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
                className="text-emerald-600 font-bold hover:text-emerald-700 underline underline-offset-4"
              >
                {view === 'login' ? 'Buat Akun' : 'Masuk Akun'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
