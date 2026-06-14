import "./globals.css";
import "./app.css";
import LayoutSearch from "./LayoutSearch";
import { Sora, Inter, Caveat, Playfair_Display } from "next/font/google";

// Clean-modern geometric display face for headings.
const display = Sora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
});

// Editorial serif for news headlines.
const editorial = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800"],
});

// Neutral, highly legible body face.
const body = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

// Handwritten accent for "coretan" / marker captions.
const hand = Caveat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-hand",
  weight: ["400", "600", "700"],
});

const fontVars = `${display.variable} ${body.variable} ${hand.variable} ${editorial.variable}`;

const SITE_URL = "https://adegreentx.id";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ade Green TX — Taksi Listrik Ramah Lingkungan di Kendari",
    template: "%s | Ade Green TX",
  },
  description:
    "Ade Green TX adalah layanan transportasi hijau yang ramah lingkungan dan informatif di Kota Kendari.",
  keywords: [
    "Ade Green TX",
    "taksi listrik",
    "taksi Kendari",
    "transportasi hijau",
    "kendaraan listrik",
    "eco mobility Kendari",
  ],
  alternates: {
    canonical: "/",
  },
  applicationName: "Ade Green TX",
  authors: [{ name: "Ade Green TX" }],
  openGraph: {
    title: "Ade Green TX — Taksi Listrik Ramah Lingkungan di Kendari",
    description:
      "Ade Green TX adalah layanan transportasi hijau yang ramah lingkungan dan informatif di Kota Kendari.",
    url: SITE_URL,
    siteName: "Ade Green TX",
    images: [
      {
        url: "/odgr.png",
        width: 1200,
        height: 630,
        alt: "Ade Green TX Preview",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ade Green TX",
    description:
      "Ade Green TX adalah layanan transportasi hijau yang ramah lingkungan dan informatif di Kota Kendari.",
    images: ["/odgr.png"],
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Ade Green TX",
      url: SITE_URL,
      logo: `${SITE_URL}/odgr.png`,
      description:
        "Layanan taksi listrik ramah lingkungan di Kota Kendari, Sulawesi Tenggara.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kendari",
        addressRegion: "Sulawesi Tenggara",
        addressCountry: "ID",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Ade Green TX",
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "id-ID",
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={fontVars}>
      <head>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <meta
          name="google-site-verification"
          content="iaxa3swed2EWX89v3HlPrfTpYgVsHKLHPVwBIDZOh3c"
        />
        <meta
          name="google-site-verification"
          content="eY-JG6TjovipkId0gTSPuu9nvt_YoJFnwPMl93YnV8k"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <LayoutSearch>{children}</LayoutSearch>
      </body>
    </html>
  );
}
