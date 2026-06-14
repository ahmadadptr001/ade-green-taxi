'use client';
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { otpValidate, sendOTP } from '@/services/auth';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { getUserByEmail } from '@/services/users';

export default function OTP() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timer, setTimer] = useState(59);
  const [email, setEmail] = useState(null);
  const inputRefs = useRef([]);
  const sentRef = useRef(false);

  useEffect(() => {
    const email_ = localStorage.getItem('email');
    if (!email_) {
      Swal.fire({
        icon: 'warning',
        title: 'Credential tidak valid!',
        text: 'Anda akan diarahkan ke halaman form email',
        confirmButtonText: 'Saya mengerti',
      }).then((action) => action.isConfirmed && router.replace('/lupa'));
      return;
    }
    setEmail(email_);
    if (sentRef.current) return;
    sentRef.current = true;
    Swal.fire({
      title: 'Mohon tunggu..',
      text: 'Kami sedang mengirim kode OTP ke email Anda',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
    (async () => {
      try {
        await sendOTP(email_);
        Swal.fire({
          icon: 'success',
          title: 'Berhasil mengirim kode OTP!',
          text: 'Silakan cek email Anda untuk melihat kode OTP.',
          didOpen: () => Swal.hideLoading(),
        });
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Gagal menerima kode OTP', text: err.message, didOpen: () => Swal.hideLoading() });
      }
    })();
  }, [router]);

  useEffect(() => {
    if (timer <= 0 || isVerified) return;
    const interval = setInterval(() => setTimer((p) => p - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, isVerified]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) return;
    try {
      setIsLoading(true);
      const result = await otpValidate(email, otpCode);
      setIsLoading(false);
      const dataUser = await getUserByEmail(email);
      localStorage.setItem('user', JSON.stringify(dataUser.data));
      if (!result) return;
      setIsVerified(true);
    } catch (err) {
      Swal.fire({ icon: 'error', title: err.message });
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setTimer(59);
      await sendOTP(email);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal menerima kode OTP', text: err.message });
    }
  };

  const allFilled = !otp.some((v) => v === '');

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 md:flex-row">
      {/* Visual side */}
      <div className="relative hidden items-center justify-center overflow-hidden border-r border-slate-100 bg-slate-900 md:flex md:w-1/2">
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-emerald-600/20 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-96 w-96 rounded-full bg-emerald-900/30 blur-3xl" />
        <div className="relative z-10 max-w-xs px-12 text-center">
          <ShieldCheck className="mx-auto mb-6 h-10 w-10 text-emerald-400" />
          <h2 className="font-display text-3xl font-bold tracking-tight text-white">Keamanan Prioritas</h2>
          <p className="mt-4 leading-relaxed text-slate-400">
            Kami menjaga akun Anda tetap aman dengan verifikasi dua langkah.
          </p>
        </div>
      </div>

      {/* Form side */}
      <div className="flex flex-1 flex-col justify-center px-6 py-16 md:px-16">
        <div className="mx-auto w-full max-w-sm">
          {!isVerified ? (
            <>
              <h1 className="font-display text-3xl font-bold tracking-tight">Verifikasi Kode</h1>
              <p className="mt-3 text-slate-500">
                Masukkan 6 digit kode OTP yang kami kirim ke email Anda.
              </p>

              <form onSubmit={handleSubmit} className="mt-10 space-y-8">
                <div className="flex justify-between gap-2">
                  {otp.map((data, index) => (
                    <input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      maxLength="1"
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      value={data}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className={`h-16 w-12 rounded-xl border text-center text-2xl font-semibold outline-none transition-all md:h-20 md:w-14 ${
                        otp[index]
                          ? 'border-emerald-500 bg-emerald-50/40 text-emerald-700'
                          : 'border-slate-200 bg-slate-50 text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100'
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={!allFilled || isLoading}
                  className={`group flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-semibold transition-all ${
                    allFilled && !isLoading ? 'bg-slate-900 text-white hover:bg-emerald-600' : 'cursor-not-allowed bg-slate-100 text-slate-400'
                  }`}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>Verifikasi Sekarang <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>
                  )}
                </button>

                <div className="text-center text-sm">
                  {timer > 0 ? (
                    <p className="text-slate-400">
                      Kirim ulang kode dalam <span className="font-semibold text-emerald-600">{timer} detik</span>
                    </p>
                  ) : (
                    <button type="button" onClick={handleResend} className="font-semibold text-emerald-600 underline underline-offset-4 hover:text-emerald-700">
                      Kirim Ulang OTP
                    </button>
                  )}
                </div>
              </form>
            </>
          ) : (
            <div className="space-y-8 text-center">
              <CheckCircle2 className="mx-auto h-20 w-20 text-emerald-500" />
              <div>
                <h1 className="font-display text-3xl font-bold tracking-tight">Berhasil Diverifikasi!</h1>
                <p className="mt-4 leading-relaxed text-slate-500">
                  Identitas Anda telah dikonfirmasi. Lanjutkan ke dashboard.
                </p>
              </div>
              <Link
                href="/dashboard"
                className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 py-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
              >
                Masuk ke Dashboard
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
