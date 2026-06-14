'use client';

import { Activity, Map as MapIcon, MessageCircle } from 'lucide-react';
import DottedMap from 'dotted-map';
import { Area, AreaChart, CartesianGrid } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useLanguageStore } from '@/store/languageStore';
import { Scribble } from '@/components/ui/Typo';

/**
 * FeaturesShowcase — adapted from the 21st.dev "features-9" block, rewritten
 * with Ade Green TX data (Kendari service area, in-app/email support, electric
 * fleet) and brand colors. Trip-activity numbers are illustrative placeholders.
 */
export default function FeaturesShowcase() {
  const { language } = useLanguageStore();
  const en = language === 'en';

  return (
    <section className="bg-[#f7faf8] px-4 py-20 md:py-28">
      <div className="mx-auto mb-12 max-w-5xl">
        <p className="font-hand mb-2 -rotate-2 text-3xl text-emerald-600">
          {en ? 'under the hood' : 'di balik layar'}
        </p>
        <h2 className="font-display text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
          {en ? (
            <>The technology behind <Scribble>every ride</Scribble></>
          ) : (
            <>Teknologi di balik <Scribble>setiap perjalanan</Scribble></>
          )}
        </h2>
      </div>

      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white md:grid-cols-2">
        {/* Live tracking */}
        <div>
          <div className="p-6 sm:p-12">
            <span className="text-muted-foreground flex items-center gap-2">
              <MapIcon className="size-4" />
              {en ? 'Real-time location tracking' : 'Pelacakan lokasi real-time'}
            </span>
            <p className="mt-8 text-2xl font-semibold text-slate-900">
              {en
                ? 'Know exactly where your driver is, from pickup to drop-off.'
                : 'Tahu persis posisi pengemudi Anda, dari penjemputan hingga tujuan.'}
            </p>
          </div>

          <div aria-hidden className="relative">
            <div className="absolute inset-0 z-10 m-auto size-fit">
              <div className="rounded-xl bg-background z-[1] relative flex size-fit items-center gap-2 border px-3 py-1 text-xs font-medium shadow-md shadow-black/5">
                <span className="text-lg">🇮🇩</span>{' '}
                {en ? 'Last connection from Kendari' : 'Koneksi terakhir dari Kendari'}
              </div>
              <div className="rounded-xl bg-background absolute inset-2 -bottom-2 mx-auto border px-3 py-4 text-xs font-medium shadow-md shadow-black/5"></div>
            </div>
            <div className="relative overflow-hidden">
              <div className="[background-image:radial-gradient(var(--tw-gradient-stops))] z-[1] to-background absolute inset-0 from-transparent to-75%"></div>
              <Map />
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="overflow-hidden border-t bg-zinc-50 p-6 sm:p-12 md:border-0 md:border-l">
          <div className="relative z-10">
            <span className="text-muted-foreground flex items-center gap-2">
              <MessageCircle className="size-4" />
              {en ? 'In-app & email support' : 'Dukungan aplikasi & email'}
            </span>
            <p className="my-8 text-2xl font-semibold text-slate-900">
              {en
                ? 'Need help? Reach us in the app or at support@adegreentx.id.'
                : 'Butuh bantuan? Hubungi kami lewat aplikasi atau support@adegreentx.id.'}
            </p>
          </div>
          <div aria-hidden className="flex flex-col gap-8">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded-full border">
                  <span className="size-3 rounded-full bg-primary" />
                </span>
                <span className="text-muted-foreground text-xs">
                  {en ? 'Sat 14 Jun' : 'Sab 14 Jun'}
                </span>
              </div>
              <div className="rounded-xl bg-background mt-1.5 w-3/5 border p-3 text-xs">
                {en
                  ? "Hi, I'm having trouble with my account."
                  : 'Halo, saya kesulitan masuk ke akun saya.'}
              </div>
            </div>
            <div>
              <div className="rounded-xl mb-1 ml-auto w-3/5 bg-emerald-600 p-3 text-xs text-white">
                {en
                  ? 'No problem! Our team will verify your number and help you sign in right away.'
                  : 'Tenang! Tim kami akan memverifikasi nomor Anda dan membantu masuk segera.'}
              </div>
              <span className="text-muted-foreground block text-right text-xs">
                {en ? 'Now' : 'Sekarang'}
              </span>
            </div>
          </div>
        </div>

        {/* Big stat — from our copy (100% electric) */}
        <div className="col-span-full border-y p-12">
          <p className="text-center text-4xl font-semibold text-slate-900 lg:text-7xl">
            {en ? '100% Electric' : '100% Listrik'}
          </p>
        </div>

        {/* Activity */}
        <div className="relative col-span-full">
          <div className="absolute z-10 max-w-lg px-6 pr-12 pt-6 md:px-12 md:pt-12">
            <span className="text-muted-foreground flex items-center gap-2">
              <Activity className="size-4" />
              {en ? 'Trip activity' : 'Aktivitas perjalanan'}
            </span>
            <p className="my-8 text-2xl font-semibold text-slate-900">
              {en ? 'Daily rides across the city. ' : 'Perjalanan harian di seluruh kota. '}
              <span className="text-muted-foreground">
                {en
                  ? 'Demand routed to the nearest electric vehicle.'
                  : 'Permintaan diarahkan ke kendaraan listrik terdekat.'}
              </span>
            </p>
          </div>
          <MonitoringChart en={en} />
          <p className="px-6 pb-4 text-right text-[10px] text-muted-foreground md:px-12">
            {en ? '* illustrative data' : '* data ilustrasi'}
          </p>
        </div>
      </div>
    </section>
  );
}

const map = new DottedMap({ height: 55, grid: 'diagonal' });
const points = map.getPoints();
const svgOptions = {
  backgroundColor: 'var(--color-background)',
  color: 'currentColor',
  radius: 0.15,
};

const Map = () => {
  const viewBox = `0 0 120 60`;
  return (
    <svg viewBox={viewBox} style={{ background: svgOptions.backgroundColor }}>
      {points.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r={svgOptions.radius}
          fill={svgOptions.color}
        />
      ))}
    </svg>
  );
};

const chartConfig = {
  permintaan: { label: 'Permintaan', color: '#0d9488' },
  selesai: { label: 'Selesai', color: '#34d399' },
};

const chartData = [
  { month: 'Jan', permintaan: 56, selesai: 48 },
  { month: 'Feb', permintaan: 126, selesai: 110 },
  { month: 'Mar', permintaan: 205, selesai: 180 },
  { month: 'Apr', permintaan: 200, selesai: 176 },
  { month: 'Mei', permintaan: 320, selesai: 290 },
  { month: 'Jun', permintaan: 410, selesai: 372 },
];

const MonitoringChart = () => {
  return (
    <ChartContainer className="h-[30rem] aspect-auto md:h-96" config={chartConfig}>
      <AreaChart accessibilityLayer data={chartData} margin={{ left: 0, right: 0 }}>
        <defs>
          <linearGradient id="fillPermintaan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-permintaan)" stopOpacity={0.8} />
            <stop offset="55%" stopColor="var(--color-permintaan)" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="fillSelesai" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-selesai)" stopOpacity={0.8} />
            <stop offset="55%" stopColor="var(--color-selesai)" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <ChartTooltip active cursor={false} content={<ChartTooltipContent />} />
        <Area
          strokeWidth={2}
          dataKey="selesai"
          type="stepBefore"
          fill="url(#fillSelesai)"
          fillOpacity={0.1}
          stroke="var(--color-selesai)"
          stackId="a"
        />
        <Area
          strokeWidth={2}
          dataKey="permintaan"
          type="stepBefore"
          fill="url(#fillPermintaan)"
          fillOpacity={0.1}
          stroke="var(--color-permintaan)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
};
