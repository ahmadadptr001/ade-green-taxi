import './globals.css';
import 'aos/dist/aos.css';
import './app.css';
import Script from 'next/script';

export const metadata = {
  title: {
    default: 'Ade Green TX',
    template: '%s | Ade Green TX',
  },
  description:
    'Ade Green TX adalah layanan transportasi hijau yang ramah lingkungan dan informatif di Kota Kendari.',

  openGraph: {
    title: 'Ade Green TX',
    description:
      'Ade Green TX adalah layanan transportasi hijau yang ramah lingkungan dan informatif di Kota Kendari.',
    url: 'https://adegreentx.id',
    siteName: 'Ade Green TX',
    images: [
      {
        url: 'https://adegreentx.id/odgr.png',
        width: 1200,
        height: 630,
        alt: 'Ade Green TX Preview',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Ade Green TX',
    description:
      'Ade Green TX adalah layanan transportasi hijau yang ramah lingkungan dan informatif di Kota Kendari.',
    images: ['https://adegreentx.id/odgr.png'],
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <meta
          name="google-site-verification"
          content="iaxa3swed2EWX89v3HlPrfTpYgVsHKLHPVwBIDZOh3c"
        />
        <Script
          id="schema-website"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Ade Green TX',
              url: 'https://adegreentx.id',
              image: 'https://adegreentx.id/odgr.png',
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
