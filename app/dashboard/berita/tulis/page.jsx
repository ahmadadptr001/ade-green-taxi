'use client';

import React, { useState, useRef, useEffect } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import {
  Settings2, Eye, Send, ImagePlus, X, Plus, PanelRightClose, PanelRightOpen,
} from 'lucide-react';
import { slugify } from '@/utils/slug';
import {
  getCategories,
  getTopics,
  insertDataArticle,
  insertDataArticleCategorie,
  insertDataArticleTopic,
  insertDataTag,
  uploadMainImageArticle,
} from '@/services/articles';
import RichEditor from '@/components/dashboard/RichEditor';
import Swal from 'sweetalert2';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

export default function WriteArticlePage() {
  const user = useUser();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [category, setCategory] = useState('');
  const [topic, setTopic] = useState('');
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user.role !== 'admin' && user.role !== 'super admin') {
      Swal.fire({
        icon: 'warning',
        title: 'Anda tidak memiliki izin untuk mengakses halaman ini!',
      }).then((r) => r.isConfirmed && router.replace('/dashboard/berita'));
    }
    (async () => {
      try {
        const [cat, top] = await Promise.all([getCategories(), getTopics()]);
        setCategories(cat.categories ?? []);
        setTopics(top.topics ?? []);
      } catch {
        Swal.fire({ icon: 'error', title: 'Gagal mengambil kategori & topik.' });
      }
    })();
  }, []);

  const handleMainImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMainImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setMainImagePreview(reader.result);
    reader.readAsDataURL(file);
  };
  const removeMainImage = () => {
    setMainImage(null);
    setMainImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const addTag = () => {
    const v = tagInput.trim();
    if (!v) return;
    if (!tags.includes(v)) setTags((p) => [...p, v]);
    setTagInput('');
  };
  const removeTag = (t) => setTags((p) => p.filter((x) => x !== t));

  const handleSubmit = async () => {
    if (!title) return Swal.fire({ icon: 'warning', title: 'Judul tidak boleh kosong!' });
    if (!category) return Swal.fire({ icon: 'warning', title: 'Kategori harus dipilih!' });
    if (!topic) return Swal.fire({ icon: 'warning', title: 'Topik harus dipilih!' });
    if (!deskripsi) return Swal.fire({ icon: 'warning', title: 'Deskripsi tidak boleh kosong!' });
    if (!mainImage) return Swal.fire({ icon: 'warning', title: 'Gambar utama tidak boleh kosong!' });

    setPublishing(true);
    Swal.fire({ icon: 'info', title: 'Mengunggah gambar…', didOpen: () => Swal.showLoading() });
    try {
      const html = DOMPurify.sanitize(content);
      const published_at = new Date().toISOString();
      const slug = slugify(deskripsi);
      const resultImage = await uploadMainImageArticle(mainImage);

      Swal.update({ title: 'Menyimpan artikel…' });
      const payload = {
        title,
        content: html,
        published_at,
        views: 0,
        description: deskripsi,
        slug,
        img: resultImage.url,
      };
      const resultInsert = await insertDataArticle(payload);
      const newArticle = resultInsert.article;

      Swal.update({ title: 'Menautkan tag, kategori & topik…' });
      await insertDataTag(tags, newArticle.id);
      await insertDataArticleCategorie(category, newArticle.id);
      await insertDataArticleTopic(newArticle.id, topic);

      setPublishing(false);
      Swal.fire({
        icon: 'success',
        title: 'Artikel berhasil dipublikasikan!',
        confirmButtonText: 'Ke Kelola Berita',
      }).then(() => router.replace('/dashboard/berita/kelola'));
    } catch (err) {
      setPublishing(false);
      Swal.fire({ icon: 'error', title: err.message, didOpen: () => Swal.hideLoading() });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Top bar */}
      <div className="sticky top-14 z-30 flex items-center justify-between border-b border-slate-200 bg-white/90 px-5 py-3 backdrop-blur-md">
        <h1 className="font-display text-base font-semibold text-slate-900">Tulis Berita</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            <Eye size={16} /> <span className="hidden sm:inline">Pratinjau</span>
          </button>
          <button
            onClick={() => setShowSidebar((v) => !v)}
            title="Setelan"
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-50"
          >
            {showSidebar ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
          </button>
          <button
            onClick={handleSubmit}
            disabled={publishing}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
          >
            <Send size={16} /> Publikasikan
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Writing canvas */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-6 py-12">
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              rows={1}
              placeholder="Judul artikel…"
              className="mb-8 w-full resize-none border-0 font-display text-3xl font-semibold leading-tight tracking-tight text-slate-900 placeholder:text-slate-300 focus:outline-none md:text-4xl"
            />
            <RichEditor onChange={setContent} />
          </div>
        </div>

        {/* Settings sidebar */}
        {showSidebar && (
          <aside className="w-full shrink-0 space-y-8 border-t border-slate-200 bg-slate-50 p-6 lg:w-80 lg:border-l lg:border-t-0">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <Settings2 size={16} /> Setelan Artikel
            </div>

            {/* Main image */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Gambar Utama</label>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleMainImageChange} className="hidden" />
              {mainImagePreview ? (
                <div className="relative overflow-hidden rounded-lg border border-slate-200">
                  <img src={mainImagePreview} alt="" className="aspect-video w-full object-cover" />
                  <button onClick={removeMainImage} className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 text-slate-400 transition-colors hover:border-emerald-400 hover:text-emerald-600"
                >
                  <ImagePlus size={22} />
                  <span className="text-sm">Pilih gambar</span>
                </button>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Deskripsi singkat</label>
              <textarea
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                rows={3}
                placeholder="Ringkasan artikel (juga dipakai untuk URL)…"
                className="w-full resize-none rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-emerald-400 focus:outline-none"
              >
                <option value="">Pilih kategori…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Topic */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Topik</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-emerald-400 focus:outline-none"
              >
                <option value="">Pilih topik…</option>
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Tag</label>
              <div className="flex gap-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Tambah tag…"
                  className="h-10 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
                <button onClick={addTag} className="inline-flex h-10 items-center rounded-lg bg-slate-900 px-3 text-white hover:bg-slate-800">
                  <Plus size={16} />
                </button>
              </div>
              {tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      #{t}
                      <button onClick={() => removeTag(t)} className="text-emerald-500 hover:text-emerald-800"><X size={12} /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* Preview overlay */}
      {showPreview && (
        <div className="fixed inset-0 z-[200] overflow-y-auto bg-white">
          <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white/90 px-5 py-3 backdrop-blur">
            <span className="text-sm font-medium text-slate-500">Pratinjau</span>
            <button onClick={() => setShowPreview(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
              <X size={18} />
            </button>
          </div>
          <article className="mx-auto max-w-3xl px-6 py-12">
            {mainImagePreview && (
              <img src={mainImagePreview} alt="" className="mb-8 aspect-video w-full rounded-xl object-cover" />
            )}
            <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              {title || 'Judul artikel'}
            </h1>
            {deskripsi && <p className="mt-4 text-lg text-slate-500">{deskripsi}</p>}
            <div
              className="mt-8 text-[1.05rem] leading-[1.8] text-slate-800 [&_h1]:font-display [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:mt-8 [&_h1]:mb-3 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mt-7 [&_h2]:mb-3 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-600 [&_blockquote]:my-5 [&_a]:text-emerald-600 [&_a]:underline [&_img]:rounded-lg [&_img]:my-5 [&_mark]:bg-yellow-200"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content || '<p class="text-slate-400">Belum ada konten.</p>') }}
            />
          </article>
        </div>
      )}
    </div>
  );
}
