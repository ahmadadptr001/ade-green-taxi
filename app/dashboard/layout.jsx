import { SidebarProvider } from "@/components/ui/sidebar";

export const metadata = {
  title: {
    default: 'DASHBOARD - ADEGREENTX ',
    template: '%s | Ade Green TX',
  },
  description:
    'Anlisis dan dapatkan akses berita terupdate.',

  openGraph: {
    title: 'DASHBOARD - ADEGREENTX',
    description:
      'Analisis dan dapatkan akses berita terupdate',
    url: 'https://adegreentx.id/dashboard',
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
    title: 'DASHBOARD - ADEGREENTX',
    description:
    'Analisis dan dapatkan akses berita terupdate',
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
          name="og:image"
          content="https://adegreentx.id/odgr.png"
        ></meta>
      </head>
      <body>
        <SidebarProvider>{children}</SidebarProvider>
      </body>
    </html>
  );
}
