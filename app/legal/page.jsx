'use client';
import { useLanguageStore } from '@/store/languageStore';
import Highlight from '@/components/Highlight';
import TOC from '@/components/TOC';
import Header from '@/components/Header';
import Back from '@/components/Back';

export default function Page() {
  const { language } = useLanguageStore();
  const isEN = language === 'en';

  const sections = [
    { id: 'overview', title: isEN ? 'Overview' : 'Ringkasan' },
    {
      id: 'acceptable-use',
      title: isEN ? 'Acceptable use' : 'Penggunaan yang dapat diterima',
    },
    {
      id: 'liability',
      title: isEN
        ? 'Liability and disclaimers'
        : 'Tanggung jawab dan penyangkalan',
    },
    {
      id: 'ev-sustainability',
      title: isEN
        ? 'EV, sustainability, and efficiency'
        : 'Kendaraan listrik, keberlanjutan, dan efisiensi',
    },
    {
      id: 'availability',
      title: isEN ? 'Service availability' : 'Ketersediaan layanan',
    },
    {
      id: 'payments',
      title: isEN ? 'Payments and fares' : 'Pembayaran dan tarif',
    },
    {
      id: 'law-disputes',
      title: isEN
        ? 'Governing law and disputes'
        : 'Hukum yang berlaku dan sengketa',
    },
    { id: 'contact', title: isEN ? 'Contact' : 'Kontak' },
  ];

  return (
    <main className="bg-gray-50 text-gray-900">
      <section className="max-w-6xl mx-auto px-8 py-16">
        <div className="py-4">
          <Back />
        </div>
        <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-teal-500">
          {isEN ? 'Legal notices' : 'Pemberitahuan hukum'}
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed mb-10">
          {isEN
            ? 'This page outlines legal notices for AdeGreenTaxi, an electric-vehicle ride-hailing service focused on sustainability and cost efficiency. Please review each section carefully.'
            : 'Halaman ini memuat pemberitahuan hukum untuk AdeGreenTaxi, layanan taksi online berbasis kendaraan listrik yang berfokus pada keberlanjutan dan efisiensi biaya. Harap tinjau setiap bagian dengan saksama.'}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
          <TOC sections={sections} />

          <div className="space-y-12">
            <section id="overview" className="space-y-4">
              <h2 className="text-2xl font-bold">
                {isEN ? 'Overview' : 'Ringkasan'}
              </h2>
              <p className="text-lg leading-relaxed text-gray-700">
                {isEN
                  ? 'AdeGreenTaxi (“we”, “our”, “service”) provides urban mobility using electric vehicles. Users agree to comply with local regulations, these notices, and app-specific terms.'
                  : 'AdeGreenTaxi (“kami”, “layanan”) menyediakan mobilitas perkotaan dengan kendaraan listrik. Pengguna setuju mematuhi regulasi setempat, pemberitahuan ini, dan ketentuan khusus aplikasi.'}
              </p>
              <Highlight title={isEN ? 'Key points' : 'Poin utama'}>
                {isEN
                  ? 'Electric fleet, transparent fares, 24/7 service subject to availability, and cash-only payments for simplicity.'
                  : 'Armada listrik, tarif transparan, layanan 24/7 bergantung ketersediaan, dan pembayaran tunai demi kesederhanaan.'}
              </Highlight>
            </section>

            <section id="acceptable-use" className="space-y-4">
              <h2 className="text-2xl font-bold">
                {isEN ? 'Acceptable use' : 'Penggunaan yang dapat diterima'}
              </h2>
              <ul className="space-y-2">
                <li className="text-lg leading-relaxed">
                  <span className="font-bold">
                    {isEN ? 'Respectful conduct: ' : 'Perilaku sopan: '}
                  </span>
                  {isEN
                    ? 'Users must act respectfully, follow driver safety instructions, and avoid harmful or fraudulent activity.'
                    : 'Pengguna wajib bersikap sopan, mengikuti instruksi keselamatan dari pengemudi, dan menghindari aktivitas yang merugikan atau curang.'}
                </li>
                <li className="text-lg leading-relaxed">
                  <span className="font-bold">
                    {isEN ? 'No misuse: ' : 'Tanpa penyalahgunaan: '}
                  </span>
                  {isEN
                    ? 'Do not attempt reverse engineering, data scraping, or unauthorized access.'
                    : 'Dilarang melakukan pembongkaran balik, scraping data, atau akses tidak sah.'}
                </li>
                <li className="text-lg leading-relaxed">
                  <span className="font-bold">
                    {isEN ? 'Accurate info: ' : 'Info akurat: '}
                  </span>
                  {isEN
                    ? 'Provide accurate pickup, destination, and contact details to ensure reliable service.'
                    : 'Berikan detail penjemputan, tujuan, dan kontak yang akurat untuk memastikan layanan yang andal.'}
                </li>
              </ul>
            </section>

            <section id="liability" className="space-y-4">
              <h2 className="text-2xl font-bold">
                {isEN
                  ? 'Liability and disclaimers'
                  : 'Tanggung jawab dan penyangkalan'}
              </h2>
              <p className="text-lg leading-relaxed text-gray-700">
                {isEN
                  ? 'Service is provided on an “as available” basis. We are not liable for delays, route changes, or interruptions due to traffic, weather, regulations, or force majeure.'
                  : 'Layanan disediakan berdasarkan ketersediaan. Kami tidak bertanggung jawab atas keterlambatan, perubahan rute, atau gangguan karena lalu lintas, cuaca, regulasi, atau keadaan kahar.'}
              </p>
            </section>

            <section id="ev-sustainability" className="space-y-4">
              <h2 className="text-2xl font-bold">
                {isEN
                  ? 'EV, sustainability, and efficiency'
                  : 'Kendaraan listrik, keberlanjutan, dan efisiensi'}
              </h2>
              <p className="text-lg leading-relaxed text-gray-700">
                {isEN
                  ? 'Our electric fleet reduces emissions and operating costs. Lower energy and maintenance costs enable competitive fares while maintaining safety and comfort.'
                  : 'Armada listrik kami menurunkan emisi dan biaya operasional. Biaya energi dan perawatan yang lebih rendah memungkinkan tarif kompetitif sembari menjaga keamanan dan kenyamanan.'}
              </p>
            </section>

            <section id="availability" className="space-y-4">
              <h2 className="text-2xl font-bold">
                {isEN ? 'Service availability' : 'Ketersediaan layanan'}
              </h2>
              <p className="text-lg leading-relaxed text-gray-700">
                {isEN
                  ? 'We aim to operate 24/7, subject to driver availability and local conditions. High demand periods and maintenance may affect pickup times.'
                  : 'Kami menargetkan operasi 24/7, bergantung pada ketersediaan pengemudi dan kondisi setempat. Periode permintaan tinggi dan pemeliharaan dapat memengaruhi waktu penjemputan.'}
              </p>
              <Highlight
                title={isEN ? 'Availability note' : 'Catatan ketersediaan'}
              >
                {isEN
                  ? '24/7 refers to service availability, and cash payment is consistently supported.'
                  : '24/7 merujuk pada ketersediaan layanan, dan pembayaran tunai selalu didukung.'}
              </Highlight>
            </section>

            <section id="payments" className="space-y-4">
              <h2 className="text-2xl font-bold">
                {isEN ? 'Payments and fares' : 'Pembayaran dan tarif'}
              </h2>
              <p className="text-lg leading-relaxed text-gray-700">
                {isEN
                  ? 'Payments are currently cash-only. Prepare exact change where possible. Fare estimates are shown before confirmation and may adjust due to real-time conditions.'
                  : 'Pembayaran saat ini hanya tunai. Siapkan uang pas jika memungkinkan. Estimasi tarif ditampilkan sebelum konfirmasi dan dapat berubah sesuai kondisi real-time.'}
              </p>
            </section>

            <section id="law-disputes" className="space-y-4">
              <h2 className="text-2xl font-bold">
                {isEN
                  ? 'Governing law and disputes'
                  : 'Hukum yang berlaku dan sengketa'}
              </h2>
              <p className="text-lg leading-relaxed text-gray-700">
                {isEN
                  ? 'These notices are governed by applicable laws in Indonesia. Disputes are resolved through good-faith discussions and escalated as required.'
                  : 'Pemberitahuan ini diatur oleh hukum yang berlaku di Indonesia. Sengketa diselesaikan melalui diskusi itikad baik dan dinaikkan sesuai kebutuhan.'}
              </p>
            </section>

            <section id="contact" className="space-y-4">
              <h2 className="text-2xl font-bold">
                {isEN ? 'Contact' : 'Kontak'}
              </h2>
              <p className="text-lg leading-relaxed text-gray-700">
                {isEN
                  ? 'For legal inquiries or support, contact us via the in-app support channel.'
                  : 'Untuk pertanyaan hukum atau dukungan, hubungi kami melalui kanal dukungan dalam aplikasi.'}
              </p>
              <div className="flex items-center gap-3 text-lg">
                <a
                  href="/privacy"
                  className="text-green-600 hover:text-teal-600 transition"
                >
                  {isEN ? 'Privacy Policy' : 'Kebijakan Privasi'}
                </a>
                <span className="text-gray-400">|</span>
                <a
                  href="/terms"
                  className="text-green-600 hover:text-teal-600 transition"
                >
                  {isEN ? 'Terms & Conditions' : 'Syarat dan Ketentuan'}
                </a>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
