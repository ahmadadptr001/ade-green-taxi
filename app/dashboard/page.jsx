'use client';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/context/UserContext';
import { getCountsAllArticle, getViewsAllArticle } from '@/services/articles';
import {
  getCountsAllUser,
  getCountsAllUserByActive,
  getCountsAllUserBySuspended,
} from '@/services/users';
import {
  Eye,
  FileText,
  SplinePointer,
  ArrowUpRight,
  Activity,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function DashboardPage() {
  const user = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboardItems, setDashboardItems] = useState([
    {
      name: 'Total Views',
      icon: Eye,
      iconColor: 'text-sky-600',
      backgroundColor: 'bg-sky-50',
      borderColor: 'border-sky-100',
      decorationColor: 'bg-sky-500',
      total: 0,
    },
    {
      name: 'Total Artikel',
      icon: FileText,
      iconColor: 'text-violet-600',
      backgroundColor: 'bg-violet-50',
      borderColor: 'border-violet-100',
      decorationColor: 'bg-violet-500',
      total: 0,
    },
    {
      name: 'User Aktif',
      icon: Users,
      iconColor: 'text-emerald-600',
      backgroundColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
      decorationColor: 'bg-emerald-500',
      total: 0,
    },
    {
      name: 'Ditangguhkan',
      icon: Users,
      iconColor: 'text-amber-600',
      backgroundColor: 'bg-amber-50',
      borderColor: 'border-amber-100',
      decorationColor: 'bg-amber-500',
      total: 0,
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // cek permission role
        if (user.role !== 'admin' || user.role !== 'super admin') {
          Swal.fire({
            icon: 'warning',
            title: 'Anda tidak memiliki izin untuk mengakses halaman ini!',
          }).then((result) => {
            if (result.isConfirmed) {
              router.replace('/dashboard/berita');
            }
          });
        }
        const dataViewsResp = await getViewsAllArticle();
        const dataCountsResp = await getCountsAllArticle();
        const dataCountsUserActiveResp = await getCountsAllUserByActive();
        const dataCountsUserSuspendedResp = await getCountsAllUserBySuspended();
        setDashboardItems((prev) =>
          prev.map((item) =>
            item.name === 'Total Views'
              ? { ...item, total: dataViewsResp.views }
              : item.name === 'Total Artikel'
                ? { ...item, total: dataCountsResp.counts }
                : item.name === 'User Aktif'
                  ? { ...item, total: dataCountsUserActiveResp.counts }
                  : item.name === 'Ditangguhkan'
                    ? { ...item, total: dataCountsUserSuspendedResp.counts }
                    : item
          )
        );
        setLoading(false);
      } catch (err) {
        Swal.fire({
          icon: 'error',
          text: err.message,
          customClass: {
            popup: 'rounded-2xl font-sans',
          },
        });
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Mendapatkan tanggal hari ini untuk UI Header
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="relative min-h-screen overflow-hidden w-full bg-slate-50 font-sans selection:bg-slate-200">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>
        <div className="absolute left-0 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-blue-100/40 blur-[100px]"></div>
        <div className="absolute right-0 bottom-0 -z-10 h-[500px] w-[500px] rounded-full bg-purple-100/40 blur-[100px]"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-10 md:px-10 lg:py-16">
        {/* Header Section */}
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {today}
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Dashboard
            </h1>
            <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
              Halo,{' '}
              <span className="font-semibold text-slate-900">
                {user?.fullname}
              </span>
              . Berikut adalah ringkasan dashboard Anda.
            </p>
          </div>

          <button className="group flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-200 active:scale-95">
            <Activity size={18} />
            <span>Anlisis</span>
          </button>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {dashboardItems.map((item, i) => (
            <div
              key={i}
              className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-white bg-white/60 p-8 shadow-sm backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200/60"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-slate-400">
                    {item.name}
                  </p>
                  <div className="mt-4 flex items-baseline gap-1">
                    {loading ? (
                      <Skeleton className={'w-full h-5'} />
                    ) : (
                      <h2 className="text-5xl font-extrabold tracking-tight text-slate-900">
                        {item.total.toLocaleString('id-ID')}
                      </h2>
                    )}
                  </div>
                </div>

                {/* Icon Container Modern */}
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl ${item.backgroundColor} ${item.iconColor} transition-all duration-500 group-hover:rotate-12 group-hover:scale-110`}
                >
                  <item.icon size={32} strokeWidth={1.5} />
                </div>
              </div>

              {/* Footer Card & Decoration */}
              <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 group-hover:text-slate-600 transition-colors">
                  <span>Lihat detail</span>
                  <ArrowUpRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </div>

                {/* Decorative Line that animates */}
                <div
                  className={`h-1.5 w-12 rounded-full ${item.decorationColor || 'bg-slate-200'} opacity-20 transition-all duration-500 group-hover:w-24 group-hover:opacity-100`}
                ></div>
              </div>

              {/* Gradient Glow effect on Hover */}
              <div
                className={`absolute -right-10 -top-10 h-32 w-32 rounded-full ${item.decorationColor || 'bg-slate-400'} opacity-0 blur-[60px] transition-opacity duration-500 group-hover:opacity-20`}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
