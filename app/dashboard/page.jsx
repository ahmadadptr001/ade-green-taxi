'use client';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/context/UserContext';
import {
  getArticles,
  getCountsAllArticle,
  getViewsAllArticle,
} from '@/services/articles';
import {
  getCountsAllUserByActive,
  getCountsAllUserBySuspended,
} from '@/services/users';
import { Eye, FileText, Users, UserMinus, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const CHART_TIP = {
  borderRadius: 10,
  border: '1px solid #e2e8f0',
  fontSize: 12,
  boxShadow: '0 8px 24px -12px rgba(15,23,42,0.25)',
};

export default function DashboardPage() {
  const user = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [stats, setStats] = useState({ views: 0, articles: 0, active: 0, suspended: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user.role !== 'admin' && user.role !== 'super admin') {
          Swal.fire({
            icon: 'warning',
            title: 'Anda tidak memiliki izin untuk mengakses halaman ini!',
          }).then((result) => {
            if (result.isConfirmed) router.replace('/dashboard/berita');
          });
        }
        const [views, counts, active, suspended, arts] = await Promise.all([
          getViewsAllArticle(),
          getCountsAllArticle(),
          getCountsAllUserByActive(),
          getCountsAllUserBySuspended(),
          getArticles(),
        ]);
        setStats({
          views: views.views ?? 0,
          articles: counts.counts ?? 0,
          active: active.counts ?? 0,
          suspended: suspended.counts ?? 0,
        });
        setArticles(arts.articles ?? []);
        setLoading(false);
      } catch (err) {
        Swal.fire({ icon: 'error', text: err.message });
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const statItems = [
    { name: 'Total Views', icon: Eye, total: stats.views },
    { name: 'Total Artikel', icon: FileText, total: stats.articles },
    { name: 'User Aktif', icon: Users, total: stats.active },
    { name: 'Ditangguhkan', icon: UserMinus, total: stats.suspended },
  ];

  // --- Publish & views trend (last 6 months) ---
  const monthly = useMemo(() => {
    const now = new Date();
    const buckets = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: d.toLocaleDateString('id-ID', { month: 'short' }),
        artikel: 0,
        views: 0,
      });
    }
    const map = Object.fromEntries(buckets.map((b) => [b.key, b]));
    for (const a of articles) {
      if (!a.published_at) continue;
      const d = new Date(a.published_at);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (map[key]) {
        map[key].artikel += 1;
        map[key].views += a.views || 0;
      }
    }
    return buckets;
  }, [articles]);

  // --- Articles per category ---
  const byCategory = useMemo(() => {
    const tally = {};
    for (const a of articles) {
      const cats =
        a.article_categories?.map((c) => c.categories?.name).filter(Boolean) ?? [];
      if (cats.length === 0) tally['Lainnya'] = (tally['Lainnya'] || 0) + 1;
      for (const c of cats) tally[c] = (tally[c] || 0) + 1;
    }
    return Object.entries(tally)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 6);
  }, [articles]);

  // --- User status donut ---
  const userPie = [
    { name: 'Aktif', value: stats.active, color: '#059669' },
    { name: 'Ditangguhkan', value: stats.suspended, color: '#cbd5e1' },
  ];
  const totalUsers = stats.active + stats.suspended;

  // --- Top articles ---
  const topArticles = useMemo(
    () => [...articles].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5),
    [articles],
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-14 md:px-10 md:py-20">
      {/* Header */}
      <header className="mb-12">
        <p className="text-sm text-slate-400">{today}</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-slate-900">
          Dashboard
        </h1>
        <p className="mt-3 text-slate-500">
          Halo, {user?.fullname}. Ringkasan & analisis hari ini.
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
        {statItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="bg-white p-8">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">{item.name}</span>
                <Icon size={18} strokeWidth={1.75} className="text-slate-300" />
              </div>
              <div className="mt-8">
                {loading ? (
                  <Skeleton className="h-10 w-24 bg-slate-100" />
                ) : (
                  <p className="font-display text-4xl font-semibold tracking-tight text-slate-900">
                    {item.total.toLocaleString('id-ID')}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Trend area chart */}
        <Panel
          className="lg:col-span-2"
          title="Tren Publikasi"
          subtitle="Jumlah artikel terbit per bulan (6 bulan terakhir)"
        >
          {loading ? (
            <ChartSkeleton />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={monthly} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="gArtikel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#059669" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  width={36}
                />
                <Tooltip contentStyle={CHART_TIP} cursor={{ stroke: '#e2e8f0' }} />
                <Area
                  type="monotone"
                  dataKey="artikel"
                  name="Artikel"
                  stroke="#059669"
                  strokeWidth={2}
                  fill="url(#gArtikel)"
                  dot={{ r: 3, fill: '#059669' }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Panel>

        {/* User status donut */}
        <Panel title="Status Pengguna" subtitle="Aktif vs ditangguhkan">
          {loading ? (
            <ChartSkeleton />
          ) : totalUsers === 0 ? (
            <Empty />
          ) : (
            <div className="relative">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={userPie}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={58}
                    outerRadius={82}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {userPie.map((e, i) => (
                      <Cell key={i} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={CHART_TIP} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-3xl font-semibold text-slate-900">
                  {totalUsers.toLocaleString('id-ID')}
                </span>
                <span className="text-xs text-slate-400">Total Pengguna</span>
              </div>
              <div className="mt-4 flex justify-center gap-6">
                {userPie.map((e) => (
                  <span key={e.name} className="inline-flex items-center gap-2 text-sm text-slate-500">
                    <span className="h-2.5 w-2.5 rounded-sm" style={{ background: e.color }} />
                    {e.name}
                    <span className="font-medium text-slate-700">{e.value}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </Panel>

        {/* Articles per category bar */}
        <Panel
          className="lg:col-span-2"
          title="Artikel per Kategori"
          subtitle="Distribusi konten berdasarkan kategori"
        >
          {loading ? (
            <ChartSkeleton />
          ) : byCategory.length === 0 ? (
            <Empty />
          ) : (
            <ResponsiveContainer width="100%" height={Math.max(200, byCategory.length * 46)}>
              <BarChart
                data={byCategory}
                layout="vertical"
                margin={{ top: 0, right: 16, left: 8, bottom: 0 }}
                barCategoryGap={14}
              >
                <CartesianGrid horizontal={false} stroke="#f1f5f9" />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  width={96}
                  tick={{ fontSize: 12, fill: '#475569' }}
                />
                <Tooltip contentStyle={CHART_TIP} cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="total" name="Artikel" fill="#059669" radius={[0, 6, 6, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Panel>

        {/* Top articles */}
        <Panel title="Artikel Terpopuler" subtitle="Berdasarkan jumlah views">
          {loading ? (
            <ChartSkeleton />
          ) : topArticles.length === 0 ? (
            <Empty />
          ) : (
            <ol className="space-y-1">
              {topArticles.map((a, i) => (
                <li key={a.id}>
                  <Link
                    href={`/dashboard/berita/${a.slug}`}
                    className="group flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-slate-50"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs font-semibold text-slate-500">
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-1 text-sm font-medium text-slate-700 group-hover:text-emerald-700">
                        {a.title}
                      </span>
                      <span className="mt-0.5 inline-flex items-center gap-1 text-xs text-slate-400">
                        <Eye size={12} /> {(a.views || 0).toLocaleString('id-ID')}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </Panel>
      </div>
    </div>
  );
}

function Panel({ title, subtitle, className = '', children }) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white p-6 ${className}`}>
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-semibold text-slate-900">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
        </div>
        <TrendingUp size={16} className="shrink-0 text-slate-300" />
      </div>
      {children}
    </section>
  );
}

function ChartSkeleton() {
  return <Skeleton className="h-[200px] w-full rounded-lg bg-slate-100" />;
}

function Empty() {
  return (
    <div className="flex h-[180px] items-center justify-center text-sm text-slate-400">
      Belum ada data.
    </div>
  );
}
