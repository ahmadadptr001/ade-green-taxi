# Ade Green Taxi - Web Platform 🌱🚖

![Ade Green Taxi Banner](https://adegreentx.id/banner-about.png)

**Ade Green TX** adalah platform web modern yang mendukung ekosistem transportasi taksi listrik ramah lingkungan pertama di Kendari, Sulawesi Tenggara. Proyek ini mencakup *landing page* informatif, portal berita terintegrasi (**Ade Green Berita**), serta sistem manajemen konten (CMS) internal untuk administrator.

Website ini dibangun menggunakan **Next.js** dengan arsitektur yang responsif, performa tinggi, dan antarmuka pengguna yang elegan.

🔗 **Link Akses:**
- **Beranda:** [https://adegreentx.id/beranda](https://adegreentx.id/beranda)
- **Portal Berita:** [https://adegreentx.id/berita](https://adegreentx.id/berita)

---

## 🚀 Fitur Utama

### 1. Public Landing Page (`/beranda`)
Halaman presentasi layanan untuk calon penumpang dan mitra.
- **Informasi Layanan:** Penjelasan armada nol emisi dan keunggulan taksi listrik.
- **Cara Pemesanan:** Panduan langkah-langkah menggunakan aplikasi mobile Ade Green.
- **FAQ:** Tanya jawab interaktif untuk bantuan cepat pengguna.

### 2. Portal Berita & Artikel (`/berita`)
Media informasi seputar teknologi hijau, update perusahaan, dan berita lokal.
- **Kategori & Tags:** Pengelompokan berita (Tech, Transportasi, Inovasi).
- **Interaksi:** Fitur *Likes*, *Bookmarks*, dan penghitung jumlah tayangan (*Views*).
- **Responsive Design:** Pengalaman membaca yang optimal di mobile maupun desktop.

### 3. Admin CMS (Article Manager)
Dashboard khusus pengelola konten dengan fitur manajemen tingkat lanjut:
- **Rich Text Editor:** Menggunakan **Tiptap Editor** untuk kustomisasi konten artikel (Bold, Italic, Heading, Quote, dll).
- **CRUD Operations:** Kelola artikel secara penuh (Create, Read, Update, Delete).
- **Analytics Snapshot:** Pantau statistik performa tiap artikel langsung dari tabel utama.
- **Export Data:** Fitur ekspor daftar artikel ke format **CSV** untuk kebutuhan laporan.
- **Preview & Draft System:** Melihat tampilan artikel sebelum diterbitkan atau menyimpannya sebagai draf.

---

## 🛠️ Tech Stack

Daftar teknologi utama yang digunakan dalam pengembangan:

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/) (Radix UI)
- **Editor:** [Tiptap](https://tiptap.dev/) (Headless Rich Text Editor)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Notifications:** [SweetAlert2](https://sweetalert2.github.io/)
- **Date Handling:** [date-fns](https://date-fns.org/)
- **State Management:** React Hooks (useState, useEffect)

---

## 📂 Struktur Folder Utama

```bash
ade-green-taxi/
├── app/                    # Next.js App Router (Pages & Layouts)
│   ├── beranda/            # Halaman Landing Page
│   ├── berita/             # Halaman Portal Berita Publik
│   └── dashboard/          # Area Admin (Manajemen Konten)
├── components/             # Reusable UI Components
│   ├── ui/                 # Komponen dasar Shadcn (Button, Table, Dialog, dll)
│   ├── ArticleManager.jsx  # Komponen utama pengelola artikel
│   └── TiptapEditor.jsx    # Implementasi Rich Text Editor
├── services/               # Integrasi API (getArticles, deleteArticle, dsb)
├── public/                 # Aset statis (Gambar, Logo, Ikon)
├── lib/                    # Fungsi utilitas (cn, formatters)
└── tailwind.config.js      # Konfigurasi tema Tailwind
```

## 💻 Instalasi Lokal
Ingin menjalankan project ini di komputer Anda? Ikuti langkah berikut:

**Clone Repository:**
```bash
$ git clone https://github.com/ahmadadptr001/ade-green-taxi.git
$ cd ade-green-taxi

```
**Install Dependensi:**

```bash
$ npm install
# atau
$ yarn install

```
Buka http://localhost:3000 di browser Anda.


###
# 🤝 Kontribusi
Kami sangat terbuka untuk kontribusi. Jika Anda menemukan bug atau ingin menambahkan fitur:

Fork repository ini.

Buat branch fitur (git checkout -b fitur/FiturBaru).

Commit perubahan (git commit -m 'Menambahkan fitur baru').

Push ke branch (git push origin fitur/FiturBaru).

Buka Pull Request.

📝 Lisensi
Hak Cipta © 2026 Ade Green Taxi. Seluruh hak cipta dilindungi undang-undang.

Dibuat dengan ❤️ untuk masa depan Kendari yang lebih bersih dan modern.