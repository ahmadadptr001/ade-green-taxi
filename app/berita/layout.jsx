export const metadata = {
  title: {
    default: 'Ade Green News',
  },
  description:
    'Ade Green News menyediakan layanan berita untuk mendapatkan akses terkini mengenai kondisi sekitar Anda.',

  openGraph: {
    title: 'Ade Green News',
    description:
      'Ade Green News menyediakan layanan berita untuk mendapatkan akses terkini mengenai kondisi sekitar Anda.',
    url: 'https://adegreentx.id',
    siteName: 'Ade Green News',
    images: [
      {
        url: 'https://adegreentx.id/odgr.png',
        width: 1200,
        height: 630,
        alt: 'Ade Green News Preview',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },

};
export default function RootLayoutNews({children}) {
  return children
}