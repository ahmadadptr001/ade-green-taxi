'use client';
import { useLanguageStore } from '@/store/languageStore';
import Highlight from '@/components/Highlight';
import TOC from '@/components/TOC';
import Back from '@/components/Back';

export default function PrivacyPage() {
  const { language } = useLanguageStore();
  const isEN = language === 'en';

  const sections = [
    { id: 'intro', title: isEN ? 'Introduction' : 'Pendahuluan' },
    {
      id: 'data-collected',
      title: isEN ? 'Data we collect' : 'Data yang kami kumpulkan',
    },
    {
      id: 'use-of-data',
      title: isEN ? 'How we use data' : 'Cara kami menggunakan data',
    },
    { id: 'location', title: isEN ? 'Location and maps' : 'Lokasi dan peta' },
    {
      id: 'retention',
      title: isEN ? 'Retention and security' : 'Retensi dan keamanan',
    },
    { id: 'rights', title: isEN ? 'Your rights' : 'Hak Anda' },
    {
      id: 'sharing',
      title: isEN ? 'Sharing and disclosures' : 'Berbagi dan pengungkapan',
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
          {isEN ? 'Privacy Policy' : 'Kebijakan Privasi'}
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed mb-10">
          {isEN
            ? 'Your privacy matters. This policy explains what data we collect, how we use it, and your choices, tailored to an electric, cost-efficient ride-hailing experience.'
            : 'Privasi Anda penting. Kebijakan ini menjelaskan data yang kami kumpulkan, cara kami menggunakannya, dan pilihan Anda, disesuaikan dengan pengalaman taksi listrik yang hemat biaya.'}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
          <TOC sections={sections} />

          <div className="space-y-12">
            <section id="intro" className="space-y-4">
              <h2 className="text-2xl font-bold">
                {isEN ? 'Introduction' : 'Pendahuluan'}
              </h2>
              <Highlight title={isEN ? 'At a glance' : 'Sekilas'}>
                {isEN
                  ? 'We collect only what we need to operate the service: account info, ride details, and location for pickup and routing.'
                  : 'Kami hanya mengumpulkan data yang diperlukan untuk layanan: info akun, detail perjalanan, dan lokasi untuk penjemputan serta rute.'}
              </Highlight>
            </section>

            <section id="data-collected" className="space-y-4">
              <h2 className="text-2xl font-bold">
                {isEN ? 'Data we collect' : 'Data yang kami kumpulkan'}
              </h2>
              <ul className="space-y-2">
                <li className="text-lg leading-relaxed">
                  <span className="font-bold">
                    {isEN ? 'Account: ' : 'Akun: '}
                  </span>
                  {isEN
                    ? 'Phone number, name, and basic profile details to register and secure your account.'
                    : 'Nomor telepon, nama, dan detail profil dasar untuk pendaftaran dan keamanan akun.'}
                </li>
                <li className="text-lg leading-relaxed">
                  <span className="font-bold">
                    {isEN ? 'Ride: ' : 'Perjalanan: '}
                  </span>
                  {isEN
                    ? 'Pickup and destination addresses, timestamps, and fare estimates to provide service.'
                    : 'Alamat penjemputan dan tujuan, waktu, dan estimasi tarif untuk menyediakan layanan.'}
                </li>
                <li className="text-lg leading-relaxed">
                  <span className="font-bold">
                    {isEN ? 'Location: ' : 'Lokasi: '}
                  </span>
                  {isEN
                    ? 'Real-time location (with permission) used for pickup accuracy, routing, and safety.'
                    : 'Lokasi real-time (dengan izin) digunakan untuk akurasi penjemputan, rute, dan keselamatan.'}
                </li>
                <li className="text-lg leading-relaxed">
                  <span className="font-bold">
                    {isEN ? 'Support: ' : 'Dukungan: '}
                  </span>
                  {isEN
                    ? 'Messages and reports you send to customer support.'
                    : 'Pesan dan laporan yang Anda kirimkan ke dukungan pelanggan.'}
                </li>
              </ul>
            </section>

            <section id="use-of-data" className="space-y-4">
              <h2 className="text-2xl font-bold">
                {isEN ? 'How we use data' : 'Cara kami menggunakan data'}
              </h2>
              <p className="text-lg leading-relaxed text-gray-700">
                {isEN
                  ? 'We use data to operate rides, ensure safety, improve reliability, and provide support. We do not sell personal data.'
                  : 'Kami menggunakan data untuk menjalankan perjalanan, memastikan keselamatan, meningkatkan keandalan, dan menyediakan dukungan. Kami tidak menjual data pribadi.'}
              </p>
            </section>

            <section id="location" className="space-y-4">
              <h2 className="text-2xl font-bold">
                {isEN ? 'Location and maps' : 'Lokasi dan peta'}
              </h2>
              <p className="text-lg leading-relaxed text-gray-700">
                {isEN
                  ? 'Location access can be toggled in your device settings. Without location, some features (accurate pickup, routing) may be limited.'
                  : 'Akses lokasi dapat diubah di pengaturan perangkat Anda. Tanpa lokasi, beberapa fitur (akurasi penjemputan, rute) mungkin terbatas.'}
              </p>
            </section>

            <section id="retention" className="space-y-4">
              <h2 className="text-2xl font-bold">
                {isEN ? 'Retention and security' : 'Retensi dan keamanan'}
              </h2>
              <p className="text-lg leading-relaxed text-gray-700">
                {isEN
                  ? 'Data is retained only as long as necessary to operate the service or comply with applicable law. We apply reasonable safeguards to protect your information.'
                  : 'Data disimpan hanya selama diperlukan untuk menjalankan layanan atau memenuhi hukum yang berlaku. Kami menerapkan pengamanan yang wajar untuk melindungi informasi Anda.'}
              </p>
            </section>

            <section id="rights" className="space-y-4">
              <h2 className="text-2xl font-bold">
                {isEN ? 'Your rights' : 'Hak Anda'}
              </h2>
              <ul className="space-y-2">
                <li className="text-lg leading-relaxed">
                  <span className="font-bold">
                    {isEN ? 'Access: ' : 'Akses: '}
                  </span>
                  {isEN
                    ? 'You can request to view your personal data we hold.'
                    : 'Anda dapat meminta melihat data pribadi yang kami simpan.'}
                </li>
                <li className="text-lg leading-relaxed">
                  <span className="font-bold">
                    {isEN ? 'Correction: ' : 'Perbaikan: '}
                  </span>
                  {isEN
                    ? 'You may update inaccurate or incomplete information.'
                    : 'Anda dapat memperbarui informasi yang tidak akurat atau tidak lengkap.'}
                </li>
                <li className="text-lg leading-relaxed">
                  <span className="font-bold">
                    {isEN ? 'Choice: ' : 'Pilihan: '}
                  </span>
                  {isEN
                    ? 'You can adjust permissions (e.g., location) in settings.'
                    : 'Anda dapat mengatur izin (misalnya, lokasi) di pengaturan.'}
                </li>
              </ul>
            </section>

            <section id="sharing" className="space-y-4">
              <h2 className="text-2xl font-bold">
                {isEN ? 'Sharing and disclosures' : 'Berbagi dan pengungkapan'}
              </h2>
              <p className="text-lg leading-relaxed text-gray-700">
                {isEN
                  ? 'We share data only as needed to operate rides (e.g., driver receives pickup details) or when required by law.'
                  : 'Kami hanya membagikan data jika diperlukan untuk menjalankan perjalanan (misalnya pengemudi menerima detail penjemputan) atau bila diwajibkan oleh hukum.'}
              </p>
            </section>

            <section id="contact" className="space-y-4">
              <h2 className="text-2xl font-bold">
                {isEN ? 'Contact' : 'Kontak'}
              </h2>
              <p className="text-lg leading-relaxed text-gray-700">
                {isEN
                  ? 'For privacy questions or requests, contact us via the in-app support channel.'
                  : 'Untuk pertanyaan atau permintaan terkait privasi, hubungi kami melalui kanal dukungan dalam aplikasi.'}
              </p>
              <div className="flex items-center gap-3 text-lg">
                <a
                  href="/terms"
                  className="text-green-600 hover:text-teal-600 transition"
                >
                  {isEN ? 'Terms & Conditions' : 'Syarat dan Ketentuan'}
                </a>
                <span className="text-gray-400">|</span>
                <a
                  href="/legal"
                  className="text-green-600 hover:text-teal-600 transition"
                >
                  {isEN ? 'Legal Notices' : 'Pemberitahuan Hukum'}
                </a>
              </div>
              <Highlight title={isEN ? 'Important' : 'Penting'}>
                {isEN
                  ? 'AdeGreenTaxi currently supports cash-only payments and aims for 24/7 service, subject to availability.'
                  : 'AdeGreenTaxi saat ini mendukung pembayaran tunai dan menargetkan layanan 24/7, bergantung pada ketersediaan.'}
              </Highlight>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
