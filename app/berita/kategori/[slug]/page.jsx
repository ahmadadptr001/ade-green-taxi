import Footer from '@/components/berita/Footer';
import Link from 'next/link';

// simulasi fetch (ganti dengan API / DB lo)
async function getArticlesByCategory(slug) {
  // contoh dummy data
  return [
    {
      id: 1,
      title: 'Transformasi Energi Hijau di Indonesia',
      excerpt:
        'Bagaimana teknologi dan kebijakan mendorong percepatan energi terbarukan.',
      image: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231',
      date: '3 Feb 2026',
      category: slug,
    },
    {
      id: 2,
      title: 'Startup Climate Tech Mulai Dilirik Investor',
      excerpt:
        'Pendanaan hijau meningkat seiring fokus global pada keberlanjutan.',
      image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a',
      date: '2 Feb 2026',
      category: slug,
    },
  ];
}

export default async function BeritaKategori({ params }) {
  const { slug } = await params;
  const articles = await getArticlesByCategory(slug);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ===== Header Kategori ===== */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/beranda" className="hover:underline">
              Beranda
            </Link>
            <span className="mx-2">/</span>
            <Link href="/berita" className="hover:underline">
              Berita
            </Link>
            <span className="mx-2">/</span>
            <span className="capitalize text-gray-700">
              {slug.replace('-', ' ')}
            </span>
          </nav>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            {/* Title & desc */}
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 capitalize">
                {slug.replace('-', ' ')}
              </h1>
              <p className="mt-3 max-w-xl text-gray-600">
                Kumpulan berita dan insight terbaru seputar{' '}
                <span className="font-medium capitalize">
                  {slug.replace('-', ' ')}
                </span>
                .
              </p>
            </div>

            {/* Search */}
            <form
              action={`/berita/kategori/${slug}`}
              method="GET"
              className="w-full md:w-[360px]"
            >
              <div className="relative">
                <input
                  type="search"
                  name="q"
                  placeholder={`Cari di ${slug.replace('-', ' ')}...`}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 pr-12 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  Cari
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ===== Konten Artikel ===== */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        {articles.length === 0 ? (
          // Empty State
          <div className="text-center py-24">
            <h3 className="text-xl font-semibold text-gray-800">
              Belum ada artikel
            </h3>
            <p className="text-gray-500 mt-2">
              Artikel untuk kategori ini akan segera hadir.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
              >
                {/* Thumbnail */}
                <div className="h-48 bg-gray-200">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="text-xs text-gray-500 mb-2">
                    {article.date}
                  </div>

                  <h2 className="text-lg font-bold text-gray-900 leading-snug mb-2">
                    {article.title}
                  </h2>

                  <p className="text-gray-600 text-sm line-clamp-3">
                    {article.excerpt}
                  </p>

                  <Link
                    href={`/berita/${article.id}`}
                    className="inline-block mt-4 text-sm font-medium text-green-600 hover:underline"
                  >
                    Baca selengkapnya →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <footer className="border-t bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {/* Brand */}
            <div>
              <h3 className="text-lg font-bold text-gray-900">AdeGreen</h3>
              <p className="text-sm text-gray-500 mt-1">
                Media berita & insight seputar teknologi, bisnis, dan
                keberlanjutan.
              </p>
            </div>

            {/* Links */}
            <nav className="flex gap-6 text-sm text-gray-600">
              <a href="/beranda#tentang" className="hover:text-gray-900">
                Tentang
              </a>
              <a href="/bantuan" className="hover:text-gray-900">
                bantuan
              </a>
              <a href="/privacy" className="hover:text-gray-900">
                Privasi
              </a>
            </nav>
          </div>

          {/* Bottom */}
          <div className="mt-8 border-t pt-4 text-sm text-gray-500 flex justify-between">
            <span>© {new Date().getFullYear()} AdeGreen</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
