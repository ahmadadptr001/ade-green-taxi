'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Building2, Info, Target, Rocket } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';

export default function AboutUs() {
  const lang = useLanguageStore();
  const isID = lang.language === 'id';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <section className="relative h-[300px]">
        <img
          className="w-full h-full object-cover"
          src="https://sunpevece.co.id/uploads/spvc/240213kGMCrpl5SctxHW47D91nzT2gYKZs8AjQy3fUEJ6qmIP0NXLBbeRFaOwudohi.jpg"
        />
      </section>

      {/* Hero Content */}
      <section className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <Badge className="w-fit">
              {isID ? 'Profil Perusahaan' : 'Company Profile'}
            </Badge>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              ADE GREEN TX
            </h1>

            <p className="text-gray-600 text-lg leading-relaxed">
              {isID
                ? 'Ade Green TX adalah brand aplikasi Eco Mobility yang dikembangkan untuk menghadirkan solusi transportasi ramah lingkungan di Kendari. Kami mengintegrasikan teknologi dan mobilitas berkelanjutan untuk mendukung pergerakan masyarakat yang lebih efisien, modern, dan peduli lingkungan.'
                : 'Ade Green TX is an Eco Mobility application brand developed to provide sustainable transportation solutions in Kendari. We integrate technology and green mobility to create efficient, modern, and environmentally responsible movement for the community.'}
            </p>

            <div className="flex gap-4">
              <Button size="lg">
                <a href="mailto:support@adegreentx.id?subject=Inquiry Ade Green TX">
                  {isID ? 'Hubungi Kami' : 'Contact Us'}
                </a>
              </Button>
              <Button size="lg" variant="outline">
                <a href="#more">
                  {isID ? 'Pelajari Lebih Lanjut' : 'Learn More'}
                </a>
              </Button>
            </div>
          </div>

          {/* Company Info Card */}
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6 space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 mt-1 text-gray-500" />
                <div>
                  <p className="font-medium">
                    {isID ? 'Kategori' : 'Category'}
                  </p>
                  <p className="text-gray-600">
                    {isID
                      ? 'Aplikasi Transportasi Ramah Lingkungan'
                      : 'Eco-Friendly Transportation Application'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-1 text-gray-500" />
                <div>
                  <p className="font-medium">{isID ? 'Lokasi' : 'Location'}</p>
                  <p className="text-gray-600">Kendari, Sulawesi Tenggara</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 mt-1 text-gray-500" />
                <div>
                  <p className="font-medium">
                    {isID ? 'Kontak Perusahaan' : 'Company Contact'}
                  </p>
                  <p className="text-gray-600">(0401) 3195233</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 space-y-12" id="more">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-gray-500" />
            <h2 className="text-2xl font-semibold">
              {isID ? 'Tentang Ade Green TX' : 'About Ade Green TX'}
            </h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            {isID
              ? 'Ade Green TX hadir sebagai inisiatif transformasi digital dalam mendukung ekosistem mobilitas yang lebih hijau di Kendari. Platform ini dirancang untuk menjawab kebutuhan transportasi modern yang efisien sekaligus mengurangi dampak lingkungan.'
              : 'Ade Green TX was created as a digital transformation initiative to support a greener mobility ecosystem in Kendari. The platform is designed to meet modern transportation needs while reducing environmental impact.'}
          </p>
        </div>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-gray-500" />
              <h3 className="text-xl font-semibold">
                {isID ? 'Visi' : 'Vision'}
              </h3>
            </div>
            <p className="text-gray-600">
              {isID
                ? 'Menjadi platform eco mobility terdepan di Kendari yang mendorong mobilitas berkelanjutan dan transformasi digital di sektor transportasi.'
                : 'To become the leading eco mobility platform in Kendari, driving sustainable transportation and digital transformation.'}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-gray-500" />
              <h3 className="text-xl font-semibold">
                {isID ? 'Misi' : 'Mission'}
              </h3>
            </div>
            <ul className="text-gray-600 space-y-2 list-disc list-inside">
              <li>
                {isID
                  ? 'Menghadirkan solusi transportasi berbasis teknologi yang efisien dan ramah lingkungan.'
                  : 'Deliver technology-based transportation solutions that are efficient and eco-friendly.'}
              </li>
              <li>
                {isID
                  ? 'Mendukung pertumbuhan ekonomi lokal melalui inovasi digital.'
                  : 'Support local economic growth through digital innovation.'}
              </li>
              <li>
                {isID
                  ? 'Membangun ekosistem mobilitas yang berkelanjutan.'
                  : 'Build a sustainable mobility ecosystem.'}
              </li>
            </ul>
          </div>
        </div>

        {/* Parent Company */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">
            {isID ? 'Perusahaan Pengembang' : 'Developed By'}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {isID
              ? 'Ade Green TX dikembangkan dan dikelola oleh PT Ade Sula sebagai bagian dari komitmen perusahaan dalam melakukan transformasi bisnis menuju sektor teknologi dan mobilitas berkelanjutan. PT Ade Sula berperan sebagai entitas legal dan pendukung operasional dalam pengembangan platform ini.'
              : 'Ade Green TX is developed and managed by PT Ade Sula as part of the company’s commitment to business transformation into the technology and sustainable mobility sector. PT Ade Sula acts as the legal entity and operational supporter behind this platform.'}
          </p>
        </div>
      </section>
    </div>
  );
}
