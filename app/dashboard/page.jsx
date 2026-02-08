'use client';
import { useUser } from '@/context/UserContext';
import { getViewsAllArticle } from '@/services/articles';
import { Eye, FileText, SplinePointer } from 'lucide-react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function DashboardPage() {
  const user = useUser();
  const [dashboardItems, setDashboardItems] = useState([
    {
      name: 'Total Views',
      icon: Eye,
      iconColor: 'text-sky-600',
      backgroundColor: 'bg-sky-100', // Sedikit penyesuaian opacity untuk kontras
      total: 0,
    },
    {
      name: 'Total Artikel', // Typo fix: Aritkel -> Artikel
      icon: FileText,
      iconColor: 'text-purple-600',
      backgroundColor: 'bg-purple-100',
      total: 0,
    },
    {
      name: 'User Aktif',
      icon: SplinePointer, // UX fix: Menggunakan icon SplinePointer yang sudah diimport agar beda dengan artikel
      iconColor: 'text-emerald-600',
      backgroundColor: 'bg-emerald-100',
      total: 0,
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataViewsResp = await getViewsAllArticle();
        setDashboardItems((prev) =>
          prev.map((item) =>
            item.name === 'Total Views'
              ? { ...item, total: dataViewsResp.views }
              : item
          )
        );
      } catch (err) {
        Swal.fire({
          icon: 'error',
          text: err.message,
        });
      }
    };
    fetchData();
  }, []);

  return (
    <main className="relative min-h-screen w-full p-6 md:p-10 lg:p-12 font-sans text-slate-800">
      <img
        src={
          'https://plus.unsplash.com/premium_photo-1702217998652-b9b795f52d5f?q=80&w=2232&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        }
        alt="gambar background dashboard"
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-50"
      />
      {/* Header Section */}
      <div className="mb-10 flex flex-col gap-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Ringkasan Dashboard
        </h1>
        <p className="text-base text-slate-600 max-w-2xl leading-relaxed">
          Selamat datang kembali,{' '}
          <span className="font-semibold text-sky-600">{user?.fullname}</span>.
          Berikut adalah pantauan statistik performa konten Anda hari ini.
        </p>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dashboardItems.map((item, i) => (
          <section
            key={i}
            className={`group relative overflow-hidden rounded-2xl border ${item.borderColor} bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50`}
          >
            <div className="flex items-start justify-between relative z-10">
              {/* Text & Stats */}
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {item.name}
                </p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">
                    {item.total.toLocaleString('id-ID')}
                  </h2>
                  {/* Indikator kenaikan dummy untuk visualisasi tambahan */}
                </div>
              </div>

              {/* Icon Container */}
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.backgroundColor} ${item.iconColor} transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-6 shadow-sm`}
              >
                <item.icon size={26} strokeWidth={2} />
              </div>
            </div>

            {/* Decorative Bottom Line Animation */}
            <div
              className={`absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100 ${item.decorativeColor}`}
            />

            {/* Subtle Gradient Blob for Depth */}
            <div
              className={`absolute -right-6 -bottom-6 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20 ${item.decorativeColor}`}
            />
          </section>
        ))}
      </div>
    </main>
  );
}
