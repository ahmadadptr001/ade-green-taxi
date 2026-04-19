import React from 'react';
import {
  Trash2,
  Smartphone,
  Globe,
  ShieldAlert,
  Clock,
  Mail,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import Link from 'next/link';

export default function AccountingDeletion() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* --- Navbar / Header --- */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <Link href={'/bantuan'}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-1">
            <ChevronLeft /> Kembali
          </div>
        </Link>
      </nav>

      {/* --- Main Content --- */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            Pusat Privasi & Data
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Transparansi adalah prioritas kami. Halaman ini menjelaskan
            bagaimana Anda dapat mengelola, menghapus akun, dan memahami
            kebijakan data di aplikasi{' '}
            <span className="font-semibold text-emerald-700">Ade Green TX</span>
            .
          </p>
        </div>

        {/* Introduction Card */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex items-start gap-4">
          <div className="bg-white p-2 rounded-full shadow-sm shrink-0 text-emerald-600">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-emerald-900 text-lg mb-1">
              Komitmen Privasi
            </h3>
            <p className="text-emerald-800/80 text-sm leading-relaxed">
              Ade Green TX adalah aplikasi transportasi mobil listrik. Kami
              menghormati privasi Anda dan menyediakan kontrol penuh atas data
              pribadi Anda, termasuk opsi penghapusan permanen.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-200 my-8"></div>

        {/* Section: Cara Hapus Akun */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Trash2 className="text-red-500" />
            Cara Menghapus Akun
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Method 1: App */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                  <Smartphone size={24} />
                </div>
                <h3 className="font-bold text-lg">Via Aplikasi</h3>
              </div>

              <ol className="space-y-4 relative border-l border-slate-200 ml-3">
                <li className="ml-6 relative">
                  <span className="absolute -left-[31px] bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white">
                    1
                  </span>
                  <p className="text-sm text-slate-600">
                    Buka aplikasi <strong>Ade Green TX</strong>.
                  </p>
                </li>
                <li className="ml-6 relative">
                  <span className="absolute -left-[31px] bg-slate-200 text-slate-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white">
                    2
                  </span>
                  <p className="text-sm text-slate-600">
                    Masuk ke menu <strong>Profil</strong>.
                  </p>
                </li>
                <li className="ml-6 relative">
                  <span className="absolute -left-[31px] bg-slate-200 text-slate-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white">
                    3
                  </span>
                  <p className="text-sm text-slate-600">
                    Pilih opsi <strong>Hapus Akun</strong>.
                  </p>
                </li>
                <li className="ml-6 relative">
                  <span className="absolute -left-[31px] bg-red-100 text-red-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white">
                    4
                  </span>
                  <p className="text-sm text-slate-600">
                    Konfirmasi tindakan Anda.
                  </p>
                </li>
              </ol>
            </div>

            {/* Method 2: Web / Help Center */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                  <Globe size={24} />
                </div>
                <h3 className="font-bold text-lg">Via Halaman Bantuan</h3>
              </div>

              <p className="text-slate-600 text-sm mb-4 flex-grow">
                Jika Anda tidak dapat mengakses aplikasi (HP hilang/rusak),
                ajukan permintaan manual melalui website kami.
              </p>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm space-y-2 mb-6">
                <p className="font-medium text-slate-700">
                  Data yang diperlukan:
                </p>
                <ul className="list-disc list-inside text-slate-500 space-y-1 ml-1">
                  <li>Nama Lengkap</li>
                  <li>Email Terdaftar</li>
                  <li>Judul: "Permintaan Hapus Akun"</li>
                </ul>
              </div>

              <a
                href="https://adegreentx.id/bantuan"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-slate-900 text-white py-2.5 px-4 rounded-xl font-medium text-center hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                Buka Formulir Bantuan <ChevronRight size={16} />
              </a>
            </div>
          </div>
        </section>

        {/* Section: Data Policy Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Data Deleted */}
          <section className="bg-red-50 rounded-2xl p-6 border border-red-100">
            <h3 className="font-bold text-red-900 text-lg mb-4 flex items-center gap-2">
              <Trash2 size={20} /> Data yang Dihapus Permanen
            </h3>
            <ul className="space-y-3">
              {[
                'Informasi profil pengguna',
                'Riwayat perjalanan lengkap',
                'Data lokasi & GPS',
                'Log komunikasi chat/pesan',
              ].map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-red-800/80 text-sm"
                >
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Data Retained */}
          <section className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
            <h3 className="font-bold text-blue-900 text-lg mb-4 flex items-center gap-2">
              <AlertCircle size={20} /> Retensi Data Sementara
            </h3>
            <p className="text-sm text-blue-800/80 mb-4 leading-relaxed">
              Beberapa data non-identifikasi mungkin disimpan sementara untuk
              keperluan:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                'Kepatuhan Hukum & Regulasi',
                'Audit Keamanan',
                'Penyelesaian Sengketa Transaksi',
              ].map((item, idx) => (
                <li
                  key={idx}
                  className="inline-block bg-white text-blue-700 text-xs px-2 py-1 rounded-md border border-blue-200 mr-2"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Timeline & Retention */}
        <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-6">
          <div className="bg-orange-100 p-4 rounded-full text-orange-600 shrink-0">
            <Clock size={32} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">
              Periode Proses Penghapusan
            </h3>
            <p className="text-slate-600 mt-1">
              Permintaan Anda akan diverifikasi dan diproses hingga tuntas dalam
              waktu maksimal{' '}
              <span className="font-bold text-slate-900">30 hari kerja</span>{' '}
              sejak pengajuan diterima.
            </p>
          </div>
        </section>

        {/* Footer Contact */}
        <footer className="text-center pt-8 border-t border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-2">
            Butuh Bantuan Lebih Lanjut?
          </h4>
          <p className="text-slate-500 text-sm mb-4">
            Tim support kami siap membantu pertanyaan terkait privasi Anda.
          </p>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=support@adegreentx.id&su=Bantuan%20ADEGREEN%20TX"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-700 hover:underline"
          >
            <Mail size={18} /> Hubungi Support Center
          </a>
          <p className="text-slate-400 text-xs mt-8">
            © {new Date().getFullYear()} Ade Green TX. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
}
