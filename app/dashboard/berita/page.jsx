'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  CalendarDays,
  Eye,
  X,
  ChevronDown,
  Hash,
  Layers,
  BookOpen,
  Radio,
} from 'lucide-react';
import Swal from 'sweetalert2';
import { Skeleton } from '@/components/ui/skeleton';
import {
  getArticles,
  getCategories,
  getTags,
  getTopics,
} from '@/services/articles';
import Link from 'next/link';

/* =========================
   Helpers (LOGIKA TETAP)
========================= */
const getCategoryNames = (article) =>
  article.article_categories?.map((i) => i.categories?.name) ?? [];

const getTopicNames = (article) =>
  article.article_topics?.map((i) => i.topics?.name) ?? [];

const getTagNames = (article) =>
  article.article_tags?.map((i) => i.tags?.name) ?? [];

export default function FeedBeritaComponent() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);

  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [tags, setTags] = useState([]);
  const [articles, setArticles] = useState([]);

  const [loading, setLoading] = useState(true);

  /* =========================
      Fetch data (LOGIKA TETAP)
  ========================= */
  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      try {
        const articles_ = await getArticles();
        const categories_ = await getCategories();
        const topics_ = await getTopics();
        const tags_ = await getTags();

        if (!mounted) return;

        setArticles(articles_.articles ?? []);
        setCategories(categories_.categories ?? []);
        setTopics(topics_.topics ?? []);
        setTags(tags_.tags ?? []);
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal memuat data',
          text: err?.message || 'Terjadi kesalahan',
          confirmButtonColor: '#171717',
        });
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => (mounted = false);
  }, []);

  /* =========================
      Filtering (LOGIKA TETAP)
  ========================= */
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const title = article.title?.toLowerCase() ?? '';
      const description = article.description?.toLowerCase() ?? '';

      const matchSearch =
        title.includes(search.toLowerCase()) ||
        description.includes(search.toLowerCase());

      const matchCategory = selectedCategory
        ? getCategoryNames(article).includes(selectedCategory)
        : true;

      const matchTopic = selectedTopic
        ? getTopicNames(article).includes(selectedTopic)
        : true;

      const matchTag = selectedTag
        ? getTagNames(article).includes(selectedTag)
        : true;

      return matchSearch && matchCategory && matchTopic && matchTag;
    });
  }, [search, selectedCategory, selectedTopic, selectedTag, articles]);

  const imgFallback = (e) => {
    e.currentTarget.src = 'https://via.placeholder.com/800x600?text=No+Image';
  };

  // Helper component untuk Dropdown agar lebih rapi
  const SelectWrapper = ({
    icon: Icon,
    value,
    onChange,
    placeholder,
    options,
  }) => (
    <div className="relative group w-full">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-black transition-colors">
        <Icon size={16} />
      </div>
      <select
        value={value}
        onChange={onChange}
        className="w-full appearance-none bg-neutral-50 hover:bg-white border border-transparent hover:border-neutral-200 focus:border-black rounded-xl py-2.5 pl-10 pr-10 text-sm font-medium text-neutral-700 focus:outline-none focus:ring-0 transition-all cursor-pointer"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.name}>
            {opt.name}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
        <ChevronDown size={14} />
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-40px)] bg-sky-50/50 overflow-auto text-neutral-900 font-sans selection:bg-black selection:text-white">
      {/* ================= HEADER ================= */}
      <div className="relative pt-16 pb-6 px-4 text-center overflow-hidden">
        <div className="flex items-center gap-4 bg-white/80 backdrop-blur-xl border border-white/60 shadow-lg shadow-indigo-100/50 rounded-2xl p-2 mb-2 overflow-hidden relative">
          {/* Badge Live */}
          <div className="flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 shadow-md animate-pulse">
            <Radio size={14} className="relative inline-flex" />
            Live Update
          </div>
          <marquee behavior="scroll" direction="right" scrollamount={4}>
            <p className="font-bold text-xs text-slate-700">
              Kota kendari memiliki ikonik bersejarah dan dinamai tugu
            </p>
          </marquee>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* ================= FILTER BAR (Floating Glass) ================= */}
        <div className="sticky top-4 z-40 mb-12">
          <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-3 md:p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Search Input */}
              <div className="relative w-full">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                  size={18}
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Temukan artikel..."
                  className="w-full bg-white border border-neutral-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:border-black focus:ring-0 outline-none transition-all placeholder:text-neutral-400"
                />
              </div>

              {/* Custom Select Inputs */}
              <SelectWrapper
                icon={BookOpen}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                placeholder="Semua Kategori"
                options={categories}
              />

              <SelectWrapper
                icon={Layers}
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                placeholder="Semua Topik"
                options={topics}
              />

              <SelectWrapper
                icon={Hash}
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                placeholder="Semua Tag"
                options={tags}
              />
            </div>
          </div>
        </div>

        {/* ================= CONTENT GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-4">
                <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20 rounded-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))
          ) : filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <Link
                href={`/berita/${article.slug}`}
                key={article.id}
                // onClick={() => setSelectedArticle(article)}
                className="group cursor-pointer flex flex-col gap-4"
              >
                {/* Image Container with Zoom Effect */}
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-neutral-100 shadow-sm">
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors z-10" />
                  <img
                    src={article.img}
                    onError={imgFallback}
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  {/* Category Pill Over Image */}
                  <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1">
                    {getCategoryNames(article)
                      .slice(0, 1)
                      .map((cat) => (
                        <span
                          key={cat}
                          className="bg-white/95 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black rounded-full shadow-sm"
                        >
                          {cat}
                        </span>
                      ))}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 text-xs font-medium text-neutral-400">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={14} className="text-neutral-300" />
                      {new Date(article.published_at).toLocaleDateString(
                        'id-ID',
                        { day: 'numeric', month: 'long', year: 'numeric' }
                      )}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-neutral-300" />
                    <span className="flex items-center gap-1.5">
                      <Eye size={14} className="text-neutral-300" />
                      {article.views}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold leading-tight text-neutral-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                    {article.title}
                  </h2>

                  <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed">
                    {article.description}
                  </p>

                  {/* Topics/Tags small footer */}
                  <div className="pt-2 flex flex-wrap gap-2">
                    {getTagNames(article)
                      .slice(0, 2)
                      .map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-neutral-100 mb-4">
                <Search className="text-neutral-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900">
                Tidak ada artikel ditemukan
              </h3>
              <p className="text-neutral-500">
                Coba sesuaikan kata kunci atau filter pencarian Anda.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ================= MODAL (Reading Mode) ================= */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
          <div
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedArticle(null)}
          />

          <div className="relative bg-white w-full max-w-3xl h-full max-h-[90vh] rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header Actions */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-20 pointer-events-none">
              <div /> {/* Spacer */}
              <button
                onClick={() => setSelectedArticle(null)}
                className="pointer-events-auto bg-white/80 backdrop-blur-md hover:bg-white text-neutral-500 hover:text-red-500 p-2 rounded-full shadow-sm transition-all border border-black/5"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1 bg-white">
              {/* Hero Image */}
              <div className="relative h-64 md:h-80 w-full">
                <img
                  src={selectedArticle.img}
                  onError={imgFallback}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white w-full">
                  <div className="flex gap-2 mb-3">
                    {getCategoryNames(selectedArticle).map((cat) => (
                      <span
                        key={cat}
                        className="bg-blue-600/90 backdrop-blur-md px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-2xl md:text-4xl font-bold leading-tight shadow-black drop-shadow-lg">
                    {selectedArticle.title}
                  </h2>
                </div>
              </div>

              {/* Article Meta & Body */}
              <div className="p-6 md:p-10 max-w-2xl mx-auto">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-6 mb-8">
                  <div className="flex items-center gap-4 text-sm text-neutral-500">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={16} />
                      {new Date(
                        selectedArticle.published_at
                      ).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Eye size={16} />
                      {selectedArticle.views}
                    </span>
                  </div>
                  {/* Topic Pills */}
                  <div className="hidden md:flex gap-2">
                    {getTopicNames(selectedArticle).map((t) => (
                      <span
                        key={t}
                        className="text-xs font-medium text-neutral-600 bg-neutral-100 px-2 py-1 rounded-md"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  className="prose prose-lg prose-neutral max-w-none 
                  prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-neutral-900 
                  prose-p:leading-relaxed prose-p:text-neutral-600 
                  prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                  prose-img:rounded-xl prose-img:shadow-md"
                  dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                />

                {/* Footer Tags */}
                <div className="mt-10 pt-6 border-t border-neutral-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                    Tags Terkait
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {getTagNames(selectedArticle).map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-full text-sm text-neutral-600 font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
