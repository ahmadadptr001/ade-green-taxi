export const metadata = {
  title: {
    default: 'Ade Green Search',
  },
  description:
    'Cari berita terkini mengenai lingkungan sekitar Anda melalui Ade Green Search.',

  openGraph: {
    title: 'Ade Green Search',
    description:
      'Cari berita terkini mengenai lingkungan sekitar Anda melalui Ade Green Search..',
    url: 'https://adegreentx.id',
    siteName: 'Ade Green Search',
    images: [
      {
        url: 'https://adegreentx.id/odgr.png',
        width: 1200,
        height: 630,
        alt: 'Ade Green Search Preview',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
};
export default function RootLayoutSearch({ children }) {
  return children;
}
