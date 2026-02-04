import './globals.css';
import 'aos/dist/aos.css';
import './app.css';

export const metadata = {
  title: {
    default: 'Ade Green TX',
    template: '%s | Ade Green TX',
  },
  description: {
    default:
      'Ade Green TX adalah layanan transportasi hijau yang ramah lingkungan dan informatif di Kota Kendari. Nikmati perjalanan yang nyaman, aman dan ramah',
  },
  openGraph: {
    title: 'Ade Green TX',
    description:
      'Ade Green TX adalah layanan transportasi hijau yang ramah lingkungan dan informatif di Kota Kendari. Nikmati perjalanan yang nyaman, aman dan ramah',
    url: 'https://www.adegreentx.id/',
    siteName: 'AdeGreenTaxi',
    images: [
      {
        url: '/banner-about.png',
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
      'Ade Green TX adalah layanan transportasi hijau yang ramah lingkungan dan informatif di Kota Kendari. Nikmati perjalanan yang nyaman, aman dan ramah',
    images: ['/banner-about.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <meta
        name="google-site-verification"
        content="FLaXMLYMU2j_mxzMak239JwzFYR7h3OmPoeU0d_K2mE"
      />
      <meta
        name="google-site-verification"
        content="iaxa3swed2EWX89v3HlPrfTpYgVsHKLHPVwBIDZOh3c"
      />
      <body>{children}</body>
    </html>
  );
}
