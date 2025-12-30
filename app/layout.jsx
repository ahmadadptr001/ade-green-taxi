import './globals.css';
import 'aos/dist/aos.css';
import './app.css'

export const metadata = {
  title: {
    default: 'AdeGreenTaxi',
    template: '%s | AdeGreenTaxi',
  },
  description: {
    default:
      'AdeGreenTaxi adalah layanan transportasi hijau yang ramah lingkungan dan informatif.',
  },
  openGraph: {
    title: 'AdeGreenTaxi',
    description:
      'AdeGreenTaxi adalah layanan transportasi hijau yang ramah lingkungan dan informatif.',
    url: 'https://www.adebgs.com/ade-green-taxi/',
    siteName: 'AdeGreenTaxi',
    images: [
      {
        url: 'https://raw.githubusercontent.com/USERNAME/REPO_NAME/BRANCH/public/default.png',
        width: 1200,
        height: 630,
        alt: 'AdeGreenTaxi Preview',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AdeGreenTaxi',
    description:
      'AdeGreenTaxi adalah layanan transportasi hijau yang ramah lingkungan dan informatif.',
    images: ['https://raw.githubusercontent.com/USERNAME/REPO_NAME/BRANCH/public/default.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
