const SITE_URL = "https://adegreentx.id";

// Static public routes. Dynamic news articles can be appended here later by
// fetching slugs from the articles service.
const routes = [
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

export default function sitemap() {
  const now = new Date();
  return routes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
