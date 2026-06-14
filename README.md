<div align="center">

<img src="https://adegreentx.id/banner-about.png" alt="Ade Green Taxi" width="100%" />

# Ade Green Taxi — Web Platform 🌱🚖

### _Taksi listrik ramah lingkungan pertama di Kendari, Sulawesi Tenggara_

<br/>

[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

<br/>

![Status](https://img.shields.io/badge/status-production-success?style=flat-square)
![Internal](https://img.shields.io/badge/akses-internal_perusahaan-0f172a?style=flat-square)
![Made in](https://img.shields.io/badge/dibuat_di-Kendari-059669?style=flat-square)

<br/>

🔗 **[ Beranda ](https://adegreentx.id/beranda)** &nbsp;•&nbsp; **[ Portal Berita ](https://adegreentx.id/berita)**

</div>

---

<div align="center">

> [!NOTE]
> Repositori ini merupakan **properti internal Ade Green TX**.
> Ditujukan untuk tim pengembang & pengelola perusahaan — bukan untuk distribusi publik.

</div>

---

## ✨ Tentang Platform

**Ade Green TX** adalah platform web modern yang mendukung ekosistem transportasi taksi listrik nol emisi di Kendari. Satu kode, tiga wajah produk:

```
🚖  Landing Page  ───▶  Presentasi layanan untuk calon penumpang & mitra
📰  Portal Berita ───▶  Media informasi teknologi hijau & kabar perusahaan
🛠️  Admin CMS     ───▶  Pusat kendali konten, taksonomi, & pengguna
```

Dibangun di atas **Next.js 16 (App Router)** + **React 19** + **Tailwind v4**, dengan fokus pada performa, desain bersih & minimalis, dan sentuhan interaktif (hero 3D, bola dunia berita).

---

## 🎯 Fitur Unggulan

<table>
<tr>
<td width="33%" valign="top">

### 🚖 Landing Page
`/beranda`

- Hero **3D interaktif** (three.js + GSAP)
- Informasi armada nol emisi
- Panduan pemesanan aplikasi
- FAQ interaktif
- Multi-bahasa **ID / EN**

</td>
<td width="33%" valign="top">

### 📰 Portal Berita
`/berita`

- Kategori, Topik & Tag
- Pencarian & arsip artikel
- **Likes · Bookmarks · Views**
- SEO siap produksi
- Responsif di semua layar

</td>
<td width="33%" valign="top">

### 🛠️ Admin CMS
`/dashboard`

- Editor **Tiptap v3**
- Feed **List + Globe 3D**
- Tabel taksonomi berpaginasi
- Analytics **Recharts**
- Manajemen peran & pengguna

</td>
</tr>
</table>

---

## 🧰 Tech Stack

<div align="center">

| Lapisan | Teknologi |
| :---: | :--- |
| 🏗️ **Framework** | Next.js 16 (App Router) · React 19 |
| 🎨 **Styling & UI** | Tailwind CSS v4 · shadcn/ui (Radix) |
| ✍️ **Editor** | Tiptap v3 _(seluruh paket di-pin `3.26.1`)_ |
| 📊 **Charts** | Recharts |
| 🌐 **3D & Animasi** | three.js · GSAP · cobe |
| 🔌 **Backend & Auth** | Supabase |
| 🧠 **State** | Zustand · React Context |
| 🔗 **HTTP** | Axios |
| 🛡️ **Sanitasi** | isomorphic-dompurify |
| 🔔 **UX** | Lucide React · SweetAlert2 · date-fns |

</div>

---

## 🗂️ Arsitektur Folder

```bash
web-ade-green-taxi/
│
├── app/                      # 🧭 App Router — Pages, Layouts & API Routes
│   ├── beranda/              #    Landing page publik
│   ├── berita/               #    Portal berita (kategori · topik · tag · [slug])
│   ├── dashboard/            #    Area admin (berita · taksonomi · pengguna · aktivitas)
│   ├── api/                  #    Route handlers (articles · users · auth · otp · reports)
│   ├── sitemap.js            #    Sitemap dinamis  ·  robots.js — SEO
│   └── ...
│
├── components/
│   ├── ui/                   # 🧩 Komponen dasar shadcn
│   ├── dashboard/            # 🛠️ RichEditor · GlobeNews · TaxonomyManager · ...
│   ├── home/                 # 🏠 Seksi landing (Hero · Services · FAQ · Footer)
│   ├── three/                # 🎲 Komponen 3D
│   └── berita/               # 📰 Komponen portal berita
│
├── services/                 # 🔌 Integrasi API (articles · users · auth · reports)
├── config/                   # ⚙️ Konfigurasi Supabase
├── context/ · store/         # 🧠 State global (User · Search · languageStore)
├── locales/                  # 🌍 Terjemahan i18n (id · en)
├── utils/ · hooks/ · lib/    # 🧮 Utilitas, custom hooks & helper
└── public/                   # 🖼️ Aset statis
```

---

<div align="center">

### 🌿 Untuk masa depan Kendari yang lebih bersih & modern

<br/>

**Hak Cipta © 2026 Ade Green Taxi** — Seluruh hak cipta dilindungi undang-undang.

_Internal Project · Dibuat dengan ❤️ oleh Tim Ade Green TX_

</div>
