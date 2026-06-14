"use client";

import { MapPin, Phone, Building2, Mail, Target, Rocket, ArrowRight } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";

export default function AboutUs() {
  const { language } = useLanguageStore();
  const isID = language === "id";

  const info = [
    {
      icon: Building2,
      label: isID ? "Kategori" : "Category",
      value: isID
        ? "Aplikasi Transportasi Ramah Lingkungan"
        : "Eco-Friendly Transportation Application",
    },
    {
      icon: MapPin,
      label: isID ? "Lokasi" : "Location",
      value: "Kendari, Sulawesi Tenggara",
    },
    {
      icon: Phone,
      label: isID ? "Kontak" : "Contact",
      value: "(0401) 3195233",
    },
  ];

  const missions = isID
    ? [
        "Menghadirkan solusi transportasi berbasis teknologi yang efisien dan ramah lingkungan.",
        "Mendukung pertumbuhan ekonomi lokal melalui inovasi digital.",
        "Membangun ekosistem mobilitas yang berkelanjutan.",
      ]
    : [
        "Deliver technology-based transportation that is efficient and eco-friendly.",
        "Support local economic growth through digital innovation.",
        "Build a sustainable mobility ecosystem.",
      ];

  return (
    <div className="bg-white text-slate-900">
      {/* Hero Image */}
      <section className="relative h-[300px]">
        <img
          className="w-full h-full object-cover"
          src="https://sunpevece.co.id/uploads/spvc/240213kGMCrpl5SctxHW47D91nzT2gYKZs8AjQy3fUEJ6qmIP0NXLBbeRFaOwudohi.jpg"
          alt="Ade Green TX"
        />
      </section>

      {/* Intro */}
      <section className="mx-auto grid max-w-6xl gap-16 px-6 py-24 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
            {isID ? "Profil Perusahaan" : "Company Profile"}
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Ade Green TX
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-600">
            {isID
              ? "Ade Green TX adalah brand aplikasi Eco Mobility yang dikembangkan untuk menghadirkan solusi transportasi ramah lingkungan di Kendari. Kami mengintegrasikan teknologi dan mobilitas berkelanjutan untuk mendukung pergerakan masyarakat yang lebih efisien, modern, dan peduli lingkungan."
              : "Ade Green TX is an Eco Mobility application brand developed to provide sustainable transportation solutions in Kendari. We integrate technology and green mobility to create efficient, modern, and environmentally responsible movement for the community."}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="mailto:support@adegreentx.id?subject=Inquiry Ade Green TX"
              className="inline-flex items-center gap-2 bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
            >
              <Mail size={16} /> {isID ? "Hubungi Kami" : "Contact Us"}
            </a>
            <a
              href="#more"
              className="inline-flex items-center gap-2 border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-900"
            >
              {isID ? "Pelajari Lebih Lanjut" : "Learn More"} <ArrowRight size={16} />
            </a>
          </div>
        </div>

        {/* Info list */}
        <div className="border border-slate-200">
          {info.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="flex items-start gap-4 border-slate-200 p-6 [&:not(:last-child)]:border-b"
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                  <p className="mt-1 text-slate-600">{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* About */}
      <section id="more" className="mx-auto max-w-3xl space-y-20 px-6 pb-28">
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tight">
            {isID ? "Tentang Ade Green TX" : "About Ade Green TX"}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-600">
            {isID
              ? "Ade Green TX hadir sebagai inisiatif transformasi digital dalam mendukung ekosistem mobilitas yang lebih hijau di Kendari. Platform ini dirancang untuk menjawab kebutuhan transportasi modern yang efisien sekaligus mengurangi dampak lingkungan."
              : "Ade Green TX was created as a digital transformation initiative to support a greener mobility ecosystem in Kendari. The platform is designed to meet modern transportation needs while reducing environmental impact."}
          </p>
        </div>

        <div className="grid gap-14 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-emerald-600" />
              <h3 className="font-display text-xl font-semibold">{isID ? "Visi" : "Vision"}</h3>
            </div>
            <p className="mt-4 leading-relaxed text-slate-600">
              {isID
                ? "Menjadi platform eco mobility terdepan di Kendari yang mendorong mobilitas berkelanjutan dan transformasi digital di sektor transportasi."
                : "To become the leading eco mobility platform in Kendari, driving sustainable transportation and digital transformation."}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <Rocket className="h-5 w-5 text-emerald-600" />
              <h3 className="font-display text-xl font-semibold">{isID ? "Misi" : "Mission"}</h3>
            </div>
            <ul className="mt-4 space-y-3 text-slate-600">
              {missions.map((m, i) => (
                <li key={i} className="flex gap-3">
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                  <span className="leading-relaxed">{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h2 className="font-display text-3xl font-bold tracking-tight">
            {isID ? "Perusahaan Pengembang" : "Developed By"}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-600">
            {isID
              ? "Ade Green TX dikembangkan dan dikelola oleh PT Ade Sula sebagai bagian dari komitmen perusahaan dalam melakukan transformasi bisnis menuju sektor teknologi dan mobilitas berkelanjutan. PT Ade Sula berperan sebagai entitas legal dan pendukung operasional dalam pengembangan platform ini."
              : "Ade Green TX is developed and managed by PT Ade Sula as part of the company’s commitment to business transformation into the technology and sustainable mobility sector. PT Ade Sula acts as the legal entity and operational supporter behind this platform."}
          </p>
        </div>
      </section>
    </div>
  );
}
