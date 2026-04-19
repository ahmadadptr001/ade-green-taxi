export default function Footer({ categories, topics }) {
  return (
    <footer className="bg-slate-950 text-white pt-24 pb-12 rounded-t-[30px] mt-20">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 overflow-x-hidden mb-20">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-12 w-12 bg-slate-500 rounded-2xl flex items-center justify-center text-2xl font-black italic">
                A
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black tracking-tighter">
                  ADE<span className="text-emerald-500">GREEN</span>
                </span>
                <p className="font-bold tracking-[0.3rem]">BERITA</p>
              </div>
            </div>
            <div className="relative w-full h-[320px] rounded-2xl overflow-hidden shadow-lg bg-gray-200">
              <iframe
                title="maps overview"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1990.0006407518533!2d122.50281949575488!3d-4.020132934697751!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d988d7b9541caef%3A0x2cf821d07be9aef4!2sPT.%20ADE%20SULA%20KENDARI!5e0!3m2!1sid!2sid!4v1769315637039!5m2!1sid!2sid"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
          <div className="md:col-span-7 flex flex-wrap w-full gap-12">
            {[
              { categories, title: 'Kategori', name: 'categories' },
              { topics, title: 'Topik', name: 'topics' },
            ].map((items, i) => (
              <div key={i}>
                <h6 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8">
                  {items.title}
                </h6>
                <ul className="space-y-4 text-sm font-bold text-slate-300">
                  {items[items.name] &&
                    items[items.name].map((item, idx) => (
                      <li
                        key={idx}
                        className="hover:text-emerald-500 transition-colors"
                      >
                        <a
                          href={`/berita/${items.title.toLowerCase()}/${item.slug}`}
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col md:row items-center justify-between pt-12 border-t border-slate-900 gap-8">
          <p className="text-[10px] font-bold text-slate-600 tracking-widest uppercase">
            © {new Date().getFullYear()} ADE GREEN BERITA. All Rights Reversed.
          </p>
          <div className="flex gap-8">
            {['FB', 'TW', 'IG', 'LN'].map((s) => (
              <span
                key={s}
                className="text-[10px] font-black text-slate-600 hover:text-white transition-colors cursor-pointer"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
