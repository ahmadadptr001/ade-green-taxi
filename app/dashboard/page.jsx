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
      backgroundColor: 'bg-sky-600/20',
      total: 0,
    },
    {
      name: 'Total Aritkel',
      icon: FileText,
      iconColor: 'text-purple-600',
      backgroundColor: 'bg-purple-600/20',
      total: 0,
    },
    {
      name: 'User Aktif',
      icon: FileText,
      iconColor: 'text-emerald-600',
      backgroundColor: 'bg-emerald-600/20',
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
    <main className="p-12 w-full h-full z-30 bg-sky-50/50">
      <h1 className="text-3xl mb-2 font-bold">Ringkasan Dashboard</h1>
      <p className="text-slate-600">
        Selamat datang kembali,{' '}
        <span className="text-sky-600 font-semibold">{user?.fullname}</span>.
        Berikut adalah data statistik hari ini
      </p>

      {/* card grid informasi statistik */}
      <div className="grid grid-cols-3 gap-5 w-full mt-5">
        {dashboardItems.map((item, i) => (
          <section
            key={i}
            className="p-4 bg-white rounded-md hover:shadow-md/20 shadow-md/5 hover:scale-103 transition-all duration-400"
          >
            <div className="flex flex-nowrap gap-3 p-4">
              <div
                className={`p-2 rounded-md ${item.backgroundColor} w-20 h-15 grid place-items-center`}
              >
                <item.icon size={26} className={`${item.iconColor}`} />
              </div>
              <div>
                <p className="font-semibold text-slate-600">{item.name}</p>
                <p className="mt-2">{item?.total}</p>
                {console.log(item)}
              </div>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
