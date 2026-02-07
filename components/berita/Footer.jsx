export default function Footer({ tags, categories, topics }) {
  return (
    <footer className="bg-slate-950 text-white pt-24 pb-12 rounded-t-[60px] mt-20">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 items-center md:grid-cols-12 gap-12 mb-20">
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
          </div>
          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            {[
              { categories, title: 'Kategori', name: 'categories' },
              { tags, title: 'Tag', name: 'tags' },
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
                        <a href={`/berita/${items.title.toLowerCase()}/${item.name}`}>{item.name}</a>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col md:row items-center justify-between pt-12 border-t border-slate-900 gap-8">
          <p className="text-[10px] font-bold text-slate-600 tracking-widest uppercase">
            © {new Date().getFullYear()} ADE GREEN BERITA. All Rights
            Reversed.
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
