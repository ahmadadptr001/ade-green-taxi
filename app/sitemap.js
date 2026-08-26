import { supabase_server_coolify as supabase_coolify } from "@/config/supabase-server";

const SITE_URL = "https://adegreentx.id";

const staticRoutes = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/beranda", priority: 1.0, changeFrequency: "weekly" },
  { path: "/beranda/tentang", priority: 0.8, changeFrequency: "monthly" },
  { path: "/layanan", priority: 0.8, changeFrequency: "monthly" },
  { path: "/berita", priority: 0.9, changeFrequency: "daily" },
  { path: "/bantuan", priority: 0.6, changeFrequency: "monthly" },
  { path: "/bantuan/akun", priority: 0.5, changeFrequency: "monthly" },
  { path: "/legal", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

async function getDynamicEntries() {
  try {
    const entries = [];

    // Semua artikel yang sudah terbit
    const { data: articles } = await supabase_coolify
      .from("articles")
      .select("slug, published_at")
      .not("published_at", "is", null)
      .order("published_at", { ascending: false })
      .limit(5000);

    for (const a of articles ?? []) {
      entries.push({
        url: `${SITE_URL}/berita/${a.slug}`,
        lastModified: a.published_at,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }

    // Halaman arsip kategori / tag / topik
    const sources = [
      ["categories", "kategori"],
      ["tags", "tag"],
      ["topics", "topik"],
    ];
    for (const [table, prefix] of sources) {
      const { data } = await supabase_coolify
        .from(table)
        .select("slug")
        .limit(1000);
      for (const row of data ?? []) {
        entries.push({
          url: `${SITE_URL}/berita/${prefix}/${row.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.5,
        });
      }
    }

    return entries;
  } catch (err) {
    console.error("[sitemap] gagal memuat entri dinamis:", err.message);
    return [];
  }
}

export default async function sitemap() {
  const now = new Date();
  const staticEntries = staticRoutes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const dynamicEntries = await getDynamicEntries();
  return [...staticEntries, ...dynamicEntries];
}
