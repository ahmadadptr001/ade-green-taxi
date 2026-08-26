import { supabase_server_coolify as supabase_coolify } from "@/config/supabase-server";

const SITE_URL = "https://adegreentx.id";

// Metadata per artikel — halaman berita/[slug] adalah client component,
// sehingga generateMetadata diletakkan di layout server ini.
export async function generateMetadata({ params }) {
  const { slug } = await params;

  let article = null;
  try {
    const { data } = await supabase_coolify
      .from("articles")
      .select("title, description, img, published_at")
      .eq("slug", slug)
      .not("published_at", "is", null)
      .maybeSingle();
    article = data;
  } catch (err) {
    console.error("[metadata] gagal memuat artikel:", err.message);
  }

  if (!article) {
    return {
      title: "Artikel Tidak Ditemukan",
      robots: { index: false, follow: false },
    };
  }

  const title = article.title || "Artikel";
  const description = (article.description || "").slice(0, 160);
  const url = `${SITE_URL}/berita/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: `/berita/${slug}` },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: article.published_at,
      images: article.img ? [{ url: article.img }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: article.img ? [article.img] : undefined,
    },
  };
}

export default function BeritaSlugLayout({ children }) {
  return children;
}
