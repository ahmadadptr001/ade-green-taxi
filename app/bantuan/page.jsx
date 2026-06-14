'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link'; // Import Link
import Header from '@/components/Header';
import Footer from '@/components/home/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import Alert from '@/components/Alert';
import { useLanguageStore } from '@/store/languageStore';
import { LifeBuoy, Send, User, Mail, UserX, ChevronRight } from 'lucide-react'; // Added icons
import { reportUser } from '@/services/reports';

export default function BantuanPage() {
  const { language } = useLanguageStore();

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    type: 'loading',
    message: '',
  });

  /* =========================
      FORM STATE (FINAL)
  ========================= */
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    screenshot_url: null,
    app_version: null,
    device: '',
    os: '',
    name: '',
    email: '',
    status: 'pending',
    customer_id: null,
  });

  /* =========================
      DETECT OS & DEVICE
  ========================= */
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.userAgentData) {
      setFormData((prev) => ({
        ...prev,
        os: navigator.userAgentData.platform,
        device: navigator.userAgentData.mobile
          ? 'Mobile Browser'
          : 'Desktop Browser',
      }));
    }
  }, []);

  /* =========================
      INPUT HANDLER
  ========================= */
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  /* =========================
      SUBMIT HANDLER
  ========================= */
  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setAlert({
      open: true,
      type: 'loading',
      message:
        language === 'en'
          ? 'Sending your report...'
          : 'Mengirim laporan Anda...',
    });

    try {
      const payload = { ...formData };

      console.log('PAYLOAD:', payload);
      await reportUser(payload);

      setAlert({
        open: true,
        type: 'success',
        message:
          language === 'en'
            ? 'Your report has been sent successfully.'
            : 'Laporan berhasil dikirim.',
      });

      setFormData((prev) => ({
        ...prev,
        title: '',
        description: '',
        name: '',
        email: '',
      }));
      return;
    } catch (error) {
      console.log('Error sending report:', error);
      setAlert({
        open: true,
        type: 'error',
        message:
          language === 'en'
            ? 'Failed to send report. Please try again.'
            : 'Laporan gagal dikirim. Silakan coba lagi.',
      });
    } finally {
      setLoading(false);
      setTimeout(() => setAlert({ open: false }), 2500);
    }
  }

  /* =========================
      TRANSLATION
  ========================= */
  const t = {
    titlePage: language === 'en' ? 'Help & Support' : 'Bantuan & Dukungan',
    subtitle:
      language === 'en'
        ? 'Tell us your issue and our team will assist you as soon as possible.'
        : 'Sampaikan kendala Anda dan tim kami akan segera membantu.',
    formTitle:
      language === 'en' ? 'Support Request Form' : 'Form Kontak / Permintaan Bantuan',
    desc:
      language === 'en'
        ? 'Fill out the form below with accurate information.'
        : 'Isi formulir berikut dengan informasi yang benar.',
    name: language === 'en' ? 'Your Name' : 'Nama Anda',
    email: language === 'en' ? 'Email Address' : 'Alamat Email',
    title: language === 'en' ? 'Issue Title' : 'Judul Masalah',
    description:
      language === 'en' ? 'Describe your issue' : 'Jelaskan kendala Anda',
    send: language === 'en' ? 'Send Report' : 'Kirim Laporan',
    // New Translations for Account Deletion
    delAccount: language === 'en' ? 'Delete Account' : 'Hapus Akun',
    delAccountDesc: language === 'en' ? 'Guide to delete your account' : 'Panduan menghapus akun Anda',
  };

  return (
    <main className="bg-white">
      <Header />
      <ScrollToTop />

      {/* HERO */}
      <section className="relative w-full">
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9]">
          <img
            src="/help/hero-support.png"
            alt="Help Center"
            loading='lazy'
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative -mt-28 pb-24">
          <div className="mx-auto max-w-3xl border border-slate-200 bg-white/95 px-6 py-16 text-center shadow-sm backdrop-blur">
            <LifeBuoy size={40} className="mx-auto mb-6 text-emerald-600" />
            <h1 className="mb-4 font-display text-4xl font-bold sm:text-5xl">
              {t.titlePage}
            </h1>
            <p className="mx-auto max-w-xl text-lg text-slate-600">{t.subtitle}</p>
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="pb-28">
        <div className="mx-auto max-w-xl px-6">
          {/* Link ke halaman hapus akun */}
          <Link href="/bantuan/akun" className="group mb-14 block">
            <div className="flex items-center justify-between gap-4 border border-slate-200 p-5 transition-colors hover:border-emerald-500">
              <div className="flex items-center gap-4">
                <UserX size={22} className="shrink-0 text-red-500" />
                <div>
                  <h3 className="font-semibold text-slate-900 transition group-hover:text-emerald-700">
                    {t.delAccount}
                  </h3>
                  <p className="text-sm text-slate-500">{t.delAccountDesc}</p>
                </div>
              </div>
              <ChevronRight
                size={20}
                className="text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-emerald-600"
              />
            </div>
          </Link>

          <h2 className="mb-2 font-display text-2xl font-bold">{t.formTitle}</h2>
          <p className="mb-10 text-slate-600">{t.desc}</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* NAME */}
            <div className="relative">
              <User
                className="absolute left-4 top-3.5 text-gray-400"
                size={18}
              />
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder={t.name}
                className="w-full pl-11 rounded-lg border border-slate-300 px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* EMAIL */}
            <div className="relative">
              <Mail
                className="absolute left-4 top-3.5 text-gray-400"
                size={18}
              />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder={t.email}
                className="w-full pl-11 rounded-lg border border-slate-300 px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* TITLE */}
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder={t.title}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500"
            />

            {/* DESCRIPTION */}
            <textarea
              name="description"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              required
              placeholder={t.description}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-emerald-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 text-white py-3.5 font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
            >
              <Send size={18} />
              {loading ? 'Sending...' : t.send}
            </button>
          </form>
        </div>
      </section>

      <Alert open={alert.open} type={alert.type} message={alert.message} />
      <Footer />
    </main>
  );
}