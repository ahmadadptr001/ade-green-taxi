'use client';
import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Leaf,
  Loader2,
  Mail,
  ChevronLeft,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isValid, setIsValid] = useState(false);

  // Validasi: Format email dasar
  useEffect(() => {
    const isEmailValid = email.includes('@') && email.includes('.');
    setIsValid(isEmailValid);
  }, [email]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    
    window.location.href = '/lupa/otp'
    setIsLoading(true);
    // Simulasi pengiriman email pemulihan
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col md:flex-row font-sans text-slate-900">
      
      {/* Sisi Visual: Desktop Only */}
      <div className="hidden relative md:flex md:w-1/2 bg-slate-100 items-center justify-center overflow-hidden border-r border-slate-100">
        <img
          src="https://images.unsplash.com/photo-1473081556163-2a17de81fc97?q=80&w=1974&auto=format&fit=crop"
          alt="Nature Background"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/40 to-transparent"></div>
        <div className="relative z-10 text-center p-12">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-6 mx-auto border border-white/30">
            <Leaf className="w-8 h-8 text-white fill-white" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Tetap Terhubung</h2>
          <p className="text-emerald-50 mt-2 max-w-xs mx-auto opacity-90 font-medium">Jangan khawatir, kami akan membantu Anda kembali ke komunitas hijau kami.</p>
        </div>
      </div>

      {/* Sisi Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 bg-white overflow-y-auto">
        

        <div className="w-full max-w-[360px]">
          {!isSubmitted ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h3 className="text-3xl font-black tracking-tight text-slate-900">Lupa Password?</h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  Masukkan email Anda untuk menerima instruksi pemulihan kata sandi.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                    Alamat Email Terdaftar
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      required
                    />
                  </div>
                </div>

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
                      <span>Kirim Instruksi</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center space-y-6 animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">Email Terkirim!</h3>
                <p className="text-sm text-slate-500 mt-3 leading-relaxed">
                  Kami telah mengirimkan instruksi pemulihan ke <strong>{email}</strong>. 
                  Silakan periksa kotak masuk atau folder spam Anda.
                </p>
              </div>
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-emerald-600 font-bold text-sm hover:text-emerald-700 underline underline-offset-8"
              >
                Gunakan email lain
              </button>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-slate-50 text-center">
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
              Butuh bantuan lebih lanjut?
            </p>
            <button className="mt-2 text-emerald-600 font-bold hover:text-emerald-700 transition-colors">
              Hubungi Support Ade Green
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}