'use client';
import Back from '@/components/Back';
import { useLanguageStore } from '@/store/languageStore';

export default function TermsPage() {
  const { language } = useLanguageStore();
  const isEN = language === 'en';

  return (
    <main className="bg-gray-50 text-gray-900">
      <section className="max-w-5xl mx-auto px-8 py-16">
        <div className="py-4">
          <Back />
        </div>
        <h1 className="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-teal-500">
          {isEN ? 'Terms & Conditions' : 'Syarat dan Ketentuan'}
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed mb-10">
          {isEN
            ? 'Welcome to AdeGreenTaxi. By accessing or using our app and services, you agree to the following Terms & Conditions. Please read carefully, especially regarding our electric vehicle fleet, cost efficiency, availability, and cash-only payment method.'
            : 'Selamat datang di AdeGreenTaxi. Dengan mengakses atau menggunakan aplikasi dan layanan kami, Anda menyetujui Syarat dan Ketentuan berikut. Harap membaca dengan saksama, terutama terkait armada kendaraan listrik, efisiensi biaya, ketersediaan layanan, dan metode pembayaran tunai.'}
        </p>

        {/* 1. Definitions & scope */}
        <section className="space-y-3 mb-10">
          <h2 className="text-2xl font-bold">
            {isEN
              ? '1. Definitions and scope'
              : '1. Definisi dan ruang lingkup'}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {isEN
              ? 'AdeGreenTaxi (“we”, “our”, “service”) is a ride-hailing platform using electric vehicles. The “User” refers to riders who create accounts, request trips, and use features within the app.'
              : 'AdeGreenTaxi (“kami”, “layanan”) adalah platform taksi online yang menggunakan kendaraan listrik. “Pengguna” merujuk pada penumpang yang membuat akun, memesan perjalanan, dan menggunakan fitur dalam aplikasi.'}
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            {isEN
              ? 'The service includes booking, trip management, and support features provided through the AdeGreenTaxi app. This document governs your use of the app and associated services.'
              : 'Layanan mencakup pemesanan, pengelolaan perjalanan, dan fitur dukungan yang disediakan melalui aplikasi AdeGreenTaxi. Dokumen ini mengatur penggunaan aplikasi dan layanan terkait oleh Anda.'}
          </p>
        </section>

        {/* 2. Account, registration, and app use */}
        <section className="space-y-3 mb-10">
          <h2 className="text-2xl font-bold">
            {isEN
              ? '2. Account, registration, and app use'
              : '2. Akun, pendaftaran, dan penggunaan aplikasi'}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {isEN
              ? 'To use core features, you must register with a valid phone number, provide accurate personal information, and keep your account secure. You are responsible for all activities under your account.'
              : 'Untuk menggunakan fitur inti, Anda harus mendaftar dengan nomor telepon yang valid, memberikan informasi pribadi yang akurat, dan menjaga keamanan akun Anda. Anda bertanggung jawab atas seluruh aktivitas pada akun Anda.'}
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            {isEN
              ? 'The app interface is designed for simple and instant booking: set pickup and destination, review fare estimates, and confirm your ride.'
              : 'Antarmuka aplikasi dirancang sederhana untuk pemesanan instan: tentukan lokasi jemput dan tujuan, tinjau estimasi tarif, lalu konfirmasi perjalanan.'}
          </p>
        </section>

        {/* 3. Service availability and booking */}
        <section className="space-y-3 mb-10">
          <h2 className="text-2xl font-bold">
            {isEN
              ? '3. Service availability and booking'
              : '3. Ketersediaan layanan dan pemesanan'}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {isEN
              ? 'Our service operates 24/7, subject to driver availability, local regulations, and operational conditions. Periods of high demand, maintenance, or force majeure may affect availability and pickup times.'
              : 'Layanan kami beroperasi 24/7, bergantung pada ketersediaan pengemudi, regulasi setempat, dan kondisi operasional. Periode permintaan tinggi, pemeliharaan, atau keadaan kahar dapat memengaruhi ketersediaan dan waktu penjemputan.'}
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            {isEN
              ? 'You may book rides for yourself or, where permitted, for others by providing accurate pickup and ride details. You must ensure the rider acknowledges these Terms.'
              : 'Anda dapat memesan perjalanan untuk diri sendiri atau, jika diizinkan, untuk orang lain dengan memberikan detail penjemputan dan perjalanan yang akurat. Anda harus memastikan penumpang menyetujui Syarat ini.'}
          </p>
        </section>

        {/* 4. Electric vehicles, sustainability, and cost efficiency */}
        <section className="space-y-3 mb-10">
          <h2 className="text-2xl font-bold">
            {isEN
              ? '4. Electric vehicles, sustainability, and cost efficiency'
              : '4. Kendaraan listrik, keberlanjutan, dan efisiensi biaya'}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {isEN
              ? 'AdeGreenTaxi uses electric vehicles to reduce emissions and operating costs. Lower energy and maintenance costs can translate into competitive fares without compromising safety or comfort.'
              : 'AdeGreenTaxi menggunakan kendaraan listrik untuk menurunkan emisi dan biaya operasional. Biaya energi dan perawatan yang lebih rendah memungkinkan tarif kompetitif tanpa mengurangi keamanan atau kenyamanan.'}
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            {isEN
              ? 'While we strive for affordable rides, actual fares depend on distance, time, demand, and local conditions. We aim for transparent pricing and clear fare estimates in-app.'
              : 'Walau kami berupaya menghadirkan perjalanan hemat, tarif aktual bergantung pada jarak, waktu, permintaan, dan kondisi setempat. Kami mengutamakan harga transparan dan estimasi tarif yang jelas di dalam aplikasi.'}
          </p>
        </section>

        {/* 5. Fares, payments (cash-only), and promotions */}
        <section className="space-y-3 mb-10">
          <h2 className="text-2xl font-bold">
            {isEN
              ? '5. Fares, payments (cash-only), and promotions'
              : '5. Tarif, pembayaran (tunai), dan promosi'}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {isEN
              ? 'Payment is currently accepted in cash only. Please prepare exact change where possible. Any updates to payment methods will be communicated in-app.'
              : 'Pembayaran saat ini hanya diterima dalam bentuk tunai. Mohon siapkan uang pas jika memungkinkan. Setiap pembaruan metode pembayaran akan diinformasikan melalui aplikasi.'}
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            {isEN
              ? 'Fare estimates are shown before confirmation and may adjust due to real-time conditions (traffic, route changes). Promotional fares or discounts may be offered periodically and are subject to specific terms.'
              : 'Estimasi tarif ditampilkan sebelum konfirmasi dan dapat berubah karena kondisi real-time (lalu lintas, perubahan rute). Tarif promo atau diskon dapat ditawarkan secara berkala dan tunduk pada ketentuan khusus.'}
          </p>
        </section>

        {/* 6. Safety, conduct, and cancellations */}
        <section className="space-y-3 mb-10">
          <h2 className="text-2xl font-bold">
            {isEN
              ? '6. Safety, conduct, and cancellations'
              : '6. Keamanan, etika, dan pembatalan'}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {isEN
              ? 'We prioritize trusted safety: trained drivers, maintained EVs, and secure systems. Users must behave respectfully, comply with driver instructions for safety, and follow local regulations.'
              : 'Kami mengutamakan keamanan: pengemudi terlatih, kendaraan listrik terawat, dan sistem yang aman. Pengguna wajib berperilaku sopan, mengikuti arahan pengemudi demi keselamatan, dan mematuhi regulasi setempat.'}
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            {isEN
              ? 'Cancellations should be made promptly through the app. Frequent or late cancellations may affect your access or incur fees where applicable.'
              : 'Pembatalan harus dilakukan segera melalui aplikasi. Pembatalan yang sering atau terlambat dapat memengaruhi akses Anda atau dikenakan biaya jika berlaku.'}
          </p>
        </section>

        {/* 7. Support and communication */}
        <section className="space-y-3 mb-10">
          <h2 className="text-2xl font-bold">
            {isEN
              ? '7. Support and communication'
              : '7. Dukungan dan komunikasi'}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {isEN
              ? 'Customer support is available in-app and strives to respond 24/7. For urgent matters (safety, lost items), use the dedicated support channel inside the app.'
              : 'Dukungan pelanggan tersedia di dalam aplikasi dan berupaya merespons 24/7. Untuk hal mendesak (keamanan, barang tertinggal), gunakan kanal dukungan khusus di dalam aplikasi.'}
          </p>
        </section>

        {/* 8. Data, privacy, and location usage */}
        <section className="space-y-3 mb-10">
          <h2 className="text-2xl font-bold">
            {isEN
              ? '8. Data, privacy, and location usage'
              : '8. Data, privasi, dan penggunaan lokasi'}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {isEN
              ? 'We collect and use data necessary to operate the service (including location for pickup, routing, and safety). Please review our Privacy Policy for details on data handling, retention, and your rights.'
              : 'Kami mengumpulkan dan menggunakan data yang diperlukan untuk mengoperasikan layanan (termasuk lokasi untuk penjemputan, rute, dan keselamatan). Silakan tinjau Kebijakan Privasi kami untuk detail penanganan data, retensi, dan hak Anda.'}
          </p>
        </section>

        {/* 9. Limitations of liability and disclaimers */}
        <section className="space-y-3 mb-10">
          <h2 className="text-2xl font-bold">
            {isEN
              ? '9. Limitations of liability and disclaimers'
              : '9. Batasan tanggung jawab dan penyangkalan'}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {isEN
              ? 'We provide the service on an “as available” basis. We are not liable for delays, route changes, or disruptions caused by traffic, weather, regulations, or force majeure. Nothing here limits rights under applicable law.'
              : 'Kami menyediakan layanan berdasarkan ketersediaan. Kami tidak bertanggung jawab atas keterlambatan, perubahan rute, atau gangguan yang disebabkan oleh lalu lintas, cuaca, regulasi, atau keadaan kahar. Ketentuan ini tidak membatasi hak yang diatur oleh hukum yang berlaku.'}
          </p>
        </section>

        {/* 10. Intellectual property and acceptable use */}
        <section className="space-y-3 mb-10">
          <h2 className="text-2xl font-bold">
            {isEN
              ? '10. Intellectual property and acceptable use'
              : '10. Kekayaan intelektual dan penggunaan yang dapat diterima'}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {isEN
              ? 'App content, branding, and materials are protected. You may not misuse, reverse engineer, or copy the app or services. You agree not to engage in fraudulent or harmful activities.'
              : 'Konten aplikasi, branding, dan materi dilindungi. Anda tidak boleh menyalahgunakan, membongkar balik, atau menyalin aplikasi atau layanan. Anda setuju untuk tidak melakukan aktivitas yang curang atau merugikan.'}
          </p>
        </section>

        {/* 11. Changes, governing law, and dispute resolution */}
        <section className="space-y-3 mb-10">
          <h2 className="text-2xl font-bold">
            {isEN
              ? '11. Changes, governing law, and dispute resolution'
              : '11. Perubahan, hukum yang berlaku, dan penyelesaian sengketa'}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {isEN
              ? 'We may update these Terms from time to time. Changes take effect upon publication in the app. These Terms are governed by applicable laws in Indonesia.'
              : 'Kami dapat memperbarui Syarat ini dari waktu ke waktu. Perubahan berlaku saat dipublikasikan di dalam aplikasi. Syarat ini diatur oleh hukum yang berlaku di Indonesia.'}
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            {isEN
              ? 'Disputes will be resolved through good-faith discussions. If unresolved, they may be escalated according to applicable procedures and jurisdiction.'
              : 'Sengketa akan diselesaikan melalui diskusi itikad baik. Jika tidak terselesaikan, dapat dinaikkan sesuai prosedur dan yurisdiksi yang berlaku.'}
          </p>
        </section>

        {/* 12. Contact and legal links */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold">
            {isEN
              ? '12. Contact and legal links'
              : '12. Kontak dan tautan hukum'}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {isEN
              ? 'For questions, assistance, or complaints, please contact support via the app. You may also review our Privacy Policy and Legal Notices in the links provided.'
              : 'Untuk pertanyaan, bantuan, atau keluhan, silakan hubungi dukungan melalui aplikasi. Anda juga dapat meninjau Kebijakan Privasi dan Pemberitahuan Hukum melalui tautan yang tersedia.'}
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
              href="/legal"
              className="text-green-600 hover:text-teal-600 transition"
            >
              {isEN ? 'Legal Notices' : 'Pemberitahuan Hukum'}
            </a>
          </div>
        </section>
      </section>
    </main>
  );
}
