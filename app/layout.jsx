import './globals.css';
import './app.css';
import { TooltipProvider } from '@/components/ui/tooltip';

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
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
        <meta
          name="google-site-verification"
          content="iaxa3swed2EWX89v3HlPrfTpYgVsHKLHPVwBIDZOh3c"
        />
        <meta name="og:image" content="https://adegreentx.id/odgr.png"></meta>
        <meta
          name="google-site-verification"
          content="eY-JG6TjovipkId0gTSPuu9nvt_YoJFnwPMl93YnV8k"
        />
      </head>
      <body>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
