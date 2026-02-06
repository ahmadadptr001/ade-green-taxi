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
    } catch (error) {
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
      language === 'en' ? 'Support Request Form' : 'Form Permintaan Bantuan',
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
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative -mt-32 pb-24">
          <div className="max-w-3xl mx-auto px-6 text-center bg-white/90 backdrop-blur rounded-3xl shadow py-14">
            <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-green-600 text-white flex items-center justify-center">
              <LifeBuoy size={28} />
            </div>

            <h1 className="text-4xl sm:text-5xl font-semibold mb-4">
              {t.titlePage}
            </h1>
            <p className="text-gray-600 text-lg">{t.subtitle}</p>
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="py-24">
        <div className="max-w-xl mx-auto px-6">
          
          {/* UI LINK KE HALAMAN HAPUS AKUN (New Section) */}
          <Link href="/bantuan/akun" className="group block mb-12">
            <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 bg-white shadow-sm hover:border-green-600 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center group-hover:bg-red-100 transition">
                  <UserX size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition">
                    {t.delAccount}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {t.delAccountDesc}
                  </p>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-300 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
          {/* END NEW SECTION */}

          <h2 className="text-2xl font-semibold mb-2">{t.formTitle}</h2>
          <p className="text-gray-600 mb-8">{t.desc}</p>

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
                className="w-full pl-11 rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-green-600"
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
                className="w-full pl-11 rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-green-600"
              />
            </div>

            {/* TITLE */}
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder={t.title}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-green-600"
            />

            {/* DESCRIPTION */}
            <textarea
              name="description"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              required
              placeholder={t.description}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-green-600"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-600 text-white py-3 font-medium hover:bg-green-700 transition disabled:opacity-60"
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