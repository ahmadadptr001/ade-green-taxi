'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  AtomicBlockUtils,
  convertToRaw,
  SelectionState,
} from 'draft-js';
import DOMPurify from 'dompurify';
const purify = DOMPurify(window);
import 'draft-js/dist/Draft.css';
import {
  Bold,
  ImagePlus,
  Italic,
  List,
  ListOrdered,
  Underline,
  Youtube,
  ChevronRight,
  ChevronLeft,
  Settings2,
  Eye,
  Send,
  X, // Tambahan icon untuk hapus preview
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
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
import Swal from 'sweetalert2';

const BASE_STYLE_MAP = {
  FONT_SIZE_SMALL: { fontSize: '12px' },
  FONT_SIZE_MEDIUM: { fontSize: '18px' },
  FONT_SIZE_LARGE: { fontSize: '24px' },
  FONT_SIZE_XL: { fontSize: '32px' },
  COLOR_RED: { color: '#ef4444' },
  COLOR_BLUE: { color: '#3b82f6' },
  COLOR_GREEN: { color: '#22c55e' },
  COLOR_PURPLE: { color: '#a855f7' },
  COLOR_BLACK: { color: '#000000' },
};

export default function RichEditorWithMeta() {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('Umum');
  const [deskripsi, setDeskripsi] = useState('');
  const [category, setCategory] = useState('Artikel');
  const [categories, setCategories] = useState([{ id: 1, name: '', slug: '' }]);
  const [topics, setTopics] = useState([{ id: 1, name: '', slug: '' }]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [dynamicStyleMap, setDynamicStyleMap] = useState(BASE_STYLE_MAP);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [fontSizeInput, setFontSizeInput] = useState(18);
  const [isEditorFocused, setIsEditorFocused] = useState(false);

  // --- STATE BARU UNTUK GAMBAR UTAMA ---
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);

  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const mainImageInputRef = useRef(null); // Ref untuk input gambar utama

  useEffect(() => {
    (async () => {
      try {
        const respCategories = await getCategories();
        const respTopics = await getTopics();
        setCategories(respCategories.categories);
        setTopics(respTopics.topics);
      } catch {
        Swal.fire({
          icon: 'error',
          title:
            'Gagal mengambl data kategori dan topik, periksa jaringan Anda!',
        });
      }
    })();
  }, []);

  // --- HANDLER GAMBAR UTAMA ---
  const handleMainImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMainImage = () => {
    setMainImage(null);
    setMainImagePreview(null);
    if (mainImageInputRef.current) mainImageInputRef.current.value = '';
  };

  // --- LOGIC HELPERS (UNCHANGED) ---
  const focusEditor = () => editorRef.current?.focus();
  const escapeHtml = (str = '') =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return '';
    try {
      const u = new URL(url, window.location.origin);
      if (u.hostname.includes('youtu.be'))
        return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
      if (
        u.hostname.includes('youtube.com') ||
        u.hostname.includes('www.youtube.com')
      ) {
        const v = u.searchParams.get('v');
        if (v) return `https://www.youtube.com/embed/${v}`;
      }
    } catch (e) {}
    return url;
  };

  const getSanitizedHtml = () => {
    try {
      const content = editorState.getCurrentContent();
      if (!content) return '';
      const raw = convertToRaw(content);
      const entityMap = raw.entityMap || {};
      let html = '';

      raw.blocks.forEach((block) => {
        if (block.type === 'atomic') {
          const range = (block.entityRanges && block.entityRanges[0]) || null;
          if (range != null) {
            const ent = entityMap[range.key];
            if (ent && ent.type === 'MEDIA') {
              const data = ent.data || {};
              if (data.type === 'image' && data.src) {
                html += `<div style="margin:16px 0;"><img src="${escapeHtml(data.src)}" alt="${escapeHtml(data.alt || '')}" style="max-width:100%;height:auto;border-radius:6px;" /></div>`;
                return;
              }
              if (data.type === 'video' && data.src) {
                const embed = getYoutubeEmbedUrl(data.src);
                html += `<div style="margin:16px 0; position:relative; padding-bottom:56.25%; height:0; overflow:hidden;"><iframe src="${escapeHtml(embed)}" style="position:absolute; top:0; left:0; width:100%; height:100%; border:0;" allowfullscreen></iframe></div>`;
                return;
              }
            }
          }
          return;
        }

        const text = block.text || '';
        const n = text.length;
        let segments = [{ start: 0, end: n, styles: new Set() }];

        (block.inlineStyleRanges || []).forEach((r) => {
          const offset = r.offset;
          const length = r.length;
          const style = r.style;
          const rangeStart = offset;
          const rangeEnd = offset + length;
          const newSegments = [];
          segments.forEach((seg) => {
            if (seg.end <= rangeStart || seg.start >= rangeEnd) {
              newSegments.push(seg);
            } else {
              if (seg.start < rangeStart) {
                newSegments.push({
                  start: seg.start,
                  end: rangeStart,
                  styles: new Set(seg.styles),
                });
              }
              const midStart = Math.max(seg.start, rangeStart);
              const midEnd = Math.min(seg.end, rangeEnd);
              const midStyles = new Set(seg.styles);
              midStyles.add(style);
              newSegments.push({
                start: midStart,
                end: midEnd,
                styles: midStyles,
              });
              if (seg.end > rangeEnd) {
                newSegments.push({
                  start: rangeEnd,
                  end: seg.end,
                  styles: new Set(seg.styles),
                });
              }
            }
          });
          segments = newSegments;
        });

        const merged = [];
        segments.forEach((s) => {
          const last = merged[merged.length - 1];
          const key = [...s.styles].sort().join('|');
          if (last && last.key === key && last.end === s.start) {
            last.end = s.end;
          } else {
            merged.push({ start: s.start, end: s.end, styles: s.styles, key });
          }
        });

        let blockHtml = '';
        merged.forEach((seg) => {
          if (seg.start >= seg.end) return;
          const slice = text.slice(seg.start, seg.end);
          let nodeHtml = escapeHtml(slice);
          if (seg.styles.has('BOLD')) nodeHtml = `<strong>${nodeHtml}</strong>`;
          if (seg.styles.has('ITALIC')) nodeHtml = `<em>${nodeHtml}</em>`;
          if (seg.styles.has('UNDERLINE')) nodeHtml = `<u>${nodeHtml}</u>`;

          const inlineStyles = [];
          seg.styles.forEach((s) => {
            if (s.startsWith('COLOR_')) {
              const hex = s.split('COLOR_')[1];
              if (hex) inlineStyles.push(`color:#${hex}`);
            } else if (s.startsWith('FONT_SIZE_')) {
              const size = s.split('FONT_SIZE_')[1];
              if (size) inlineStyles.push(`font-size:${size}px`);
            }
          });
          if (inlineStyles.length)
            nodeHtml = `<span style="${inlineStyles.join('; ')}">${nodeHtml}</span>`;
          blockHtml += nodeHtml;
        });

        if (block.type === 'header-one') html += `<h1>${blockHtml}</h1>`;
        else if (block.type === 'header-two') html += `<h2>${blockHtml}</h2>`;
        else if (block.type === 'unordered-list-item')
          html += `<li>${blockHtml}</li>`;
        else if (block.type === 'ordered-list-item')
          html += `<li>${blockHtml}</li>`;
        else html += `<p>${blockHtml || '&nbsp;'}</p>`;
      });

      return purify.sanitize(html, {
        ADD_TAGS: ['iframe'],
        ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
      });
    } catch (err) {
      console.error('convert/sanitize error', err);
      return '';
    }
  };

  // --- HANDLERS (UNCHANGED) ---
  const handleKeyCommand = (command, state) => {
    const newState = RichUtils.handleKeyCommand(state, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const toggleInlineStyle = (style) =>
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  const toggleBlockType = (block) =>
    setEditorState(RichUtils.toggleBlockType(editorState, block));

  const applyCustomStyle = (styleGroup, styleName) => {
    const selection = editorState.getSelection();
    const groupStyles = Object.keys(dynamicStyleMap).filter((k) =>
      k.startsWith(styleGroup)
    );

    if (selection.isCollapsed()) {
      const currentInlineStyle = editorState.getCurrentInlineStyle();
      let newStyle = currentInlineStyle;
      groupStyles.forEach((s) => {
        if (newStyle.has(s)) newStyle = newStyle.remove(s);
      });
      newStyle = newStyle.add(styleName);
      setEditorState(EditorState.setInlineStyleOverride(editorState, newStyle));
      return;
    }

    let content = editorState.getCurrentContent();
    groupStyles.forEach((s) => {
      content = Modifier.removeInlineStyle(content, selection, s);
    });
    content = Modifier.applyInlineStyle(content, selection, styleName);
    const newState = EditorState.push(
      editorState,
      content,
      'change-inline-style'
    );
    setEditorState(EditorState.forceSelection(newState, selection));
  };

  const applyFontSizeToSelection = (size) => {
    const n = parseInt(size, 10);
    if (Number.isNaN(n) || n <= 0) return;
    const key = `FONT_SIZE_${n}`;
    if (!dynamicStyleMap[key])
      setDynamicStyleMap((s) => ({ ...s, [key]: { fontSize: `${n}px` } }));

    const selection = editorState.getSelection();
    if (selection.isCollapsed()) {
      const content = editorState.getCurrentContent();
      const blockKey = selection.getStartKey();
      const block = content.getBlockForKey(blockKey);
      const blockSelection = SelectionState.createEmpty(blockKey).merge({
        anchorOffset: 0,
        focusOffset: block.getLength(),
        hasFocus: true,
      });
      let nextContent = content;
      Object.keys(dynamicStyleMap)
        .filter((k) => k.startsWith('FONT_SIZE_'))
        .forEach((k) => {
          nextContent = Modifier.removeInlineStyle(
            nextContent,
            blockSelection,
            k
          );
        });
      nextContent = Modifier.applyInlineStyle(nextContent, blockSelection, key);
      const pushed = EditorState.push(
        editorState,
        nextContent,
        'change-inline-style'
      );
      setEditorState(EditorState.forceSelection(pushed, selection));
      return;
    }

    let content = editorState.getCurrentContent();
    Object.keys(dynamicStyleMap)
      .filter((k) => k.startsWith('FONT_SIZE_'))
      .forEach((k) => {
        content = Modifier.removeInlineStyle(content, selection, k);
      });
    content = Modifier.applyInlineStyle(content, selection, key);
    const next = EditorState.push(editorState, content, 'change-inline-style');
    setEditorState(EditorState.forceSelection(next, selection));
  };

  const insertEmoji = (emoji) => {
    const content = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const newContent = selection.isCollapsed()
      ? Modifier.insertText(content, selection, emoji)
      : Modifier.replaceText(content, selection, emoji);
    const newState = EditorState.push(
      editorState,
      newContent,
      'insert-characters'
    );
    setEditorState(
      EditorState.forceSelection(newState, newContent.getSelectionAfter())
    );
    setShowEmojiPicker(false);
    setTimeout(() => editorRef.current?.focus(), 0);
  };

  useEffect(() => {
    const n = parseInt(fontSizeInput, 10);
    if (Number.isNaN(n) || n <= 0) return;
    const id = setTimeout(() => applyFontSizeToSelection(n), 250);
    return () => clearTimeout(id);
  }, [fontSizeInput]);

  const currentInlineStyle = editorState.getCurrentInlineStyle();
  const currentBlockType = RichUtils.getCurrentBlockType(editorState);

  const isStyleActive = (style) => currentInlineStyle.has(style);
  const isBlockActive = (type) => currentBlockType === type;

  const MediaBlock = (props) => {
    const { block, contentState } = props;
    const entity = contentState.getEntity(block.getEntityAt(0));
    const data = entity.getData();
    if (data.type === 'image')
      return (
        <div className="my-4">
          <img
            src={data.src}
            alt=""
            className="max-w-full rounded-lg shadow mx-auto"
          />
        </div>
      );
    if (data.type === 'video')
      return (
        <div className="my-4 aspect-video">
          <iframe
            src={data.src}
            title="Video"
            className="w-full h-full rounded-lg"
            frameBorder="0"
            allowFullScreen
          />
        </div>
      );
    return null;
  };

  const handleSubmit = async () => {
    if (!title) {
      Swal.fire({
        icon: 'warning',
        title: 'Judul tidak boleh kosong!',
      });
      return;
    }
    if (!deskripsi) {
      Swal.fire({
        icon: 'warning',
        title: 'Deskripsi tidak boleh kosong!',
      });
      return;
    }
    if (!mainImage) {
      Swal.fire({
        icon: 'warning',
        title: 'Gambar utama tidak boleh kosong!',
      });
      return;
    }
    Swal.fire({
      icon: 'info',
      title: 'Memuat gambar..',
      didOpen: () => Swal.showLoading(),
    });

    try {
      const content = getSanitizedHtml();
      const published_at = new Date().toISOString();
      const slug = slugify(deskripsi);
      const resultImage = await uploadMainImageArticle(mainImage);
      const img = resultImage.url;

      const payload = {
        title,
        content,
        published_at,
        views: 0,
        description: deskripsi,
        slug,
        img,
      };

      Swal.fire({
        icon: 'info',
        title: 'Memuat artikel..',
        didOpen: Swal.showLoading(),
      });

      console.log(payload);

      // insert ke database
      const resultInsertDataArticle = await insertDataArticle(payload);
      const newArticle = resultInsertDataArticle.article;
      Swal.fire({
        title: 'info',
        title: 'Menautkan semua tag ke artikel',
        didOpen: () => Swal.showLoading(),
      });

      const resultInsertDataTag = await insertDataTag(tags, newArticle.id);
      Swal.fire({
        title: 'info',
        title: 'Menautkan kateogri ke artikel',
        didOpen: () => Swal.showLoading(),
      });

      const resultInsertDataCategory = await insertDataArticleCategorie(
        category,
        newArticle.id
      );
      Swal.fire({
        title: 'info',
        title: 'Menautkan topik ke artikel',
        didOpen: () => Swal.showLoading(),
      });

      const resultInsertDataTopic = await insertDataArticleTopic(
        newArticle.id,
        topic
      );
      Swal.fire({
        title: 'success',
        title: 'Berhasil menambahkan artikel..',
        didOpen: () => Swal.hideLoading(),
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: err.message,
        didOpen: () => Swal.hideLoading,
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white text-slate-900 overflow-hidden">
      <style>{`
        .editor-content ::selection { background: rgba(99, 102, 241, 0.2); }
        .public-DraftEditorPlaceholder-root { color: #94a3b8; position: absolute; z-index: 0; }
        .DraftEditor-root { position: relative; z-index: 10; min-height: 200px; }
      `}</style>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* HEADER */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-white sticky top-0 z-50">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Judul Dokumen..."
            className="text-lg font-bold outline-none w-full mr-4 bg-transparent placeholder:text-slate-300"
          />
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`p-2 rounded-full transition md:hidden ${showPreview ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500'}`}
            >
              <Eye size={20} />
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full font-semibold text-sm hover:bg-indigo-700 transition"
            >
              <span className="hidden sm:inline">Publish</span>
              <Send size={16} />
            </button>
          </div>
        </header>

        {/* TOOLBAR */}
        <div className="flex items-center gap-1 p-2 border-b border-slate-100 overflow-x-auto no-scrollbar bg-slate-50/50 sticky top-[61px] z-40">
          <div className="flex items-center gap-1 pr-2 border-r border-slate-200 shrink-0">
            <ToolbarButton
              active={isStyleActive('BOLD')}
              onClick={() => toggleInlineStyle('BOLD')}
              icon={<Bold size={18} />}
            />
            <ToolbarButton
              active={isStyleActive('ITALIC')}
              onClick={() => toggleInlineStyle('ITALIC')}
              icon={<Italic size={18} />}
            />
            <ToolbarButton
              active={isStyleActive('UNDERLINE')}
              onClick={() => toggleInlineStyle('UNDERLINE')}
              icon={<Underline size={18} />}
            />
          </div>

          <div className="flex items-center gap-1 px-2 border-r border-slate-200 shrink-0">
            <ToolbarButton
              active={isBlockActive('unordered-list-item')}
              onClick={() => toggleBlockType('unordered-list-item')}
              icon={<List size={18} />}
            />
            <ToolbarButton
              active={isBlockActive('ordered-list-item')}
              onClick={() => toggleBlockType('ordered-list-item')}
              icon={<ListOrdered size={18} />}
            />
          </div>

          <div className="flex items-center gap-2 px-2 shrink-0">
            <input
              type="number"
              value={fontSizeInput}
              onChange={(e) => setFontSizeInput(e.target.value)}
              className="w-12 h-8 text-center text-sm border border-slate-200 rounded-md focus:ring-2 ring-indigo-500 outline-none"
            />
            <div className="relative">
              <input
                type="color"
                onChange={(e) =>
                  applyCustomStyle(
                    'COLOR',
                    `COLOR_${e.target.value.replace('#', '').toUpperCase()}`
                  )
                }
                className="w-8 h-8 p-0 border-0 bg-transparent cursor-pointer overflow-hidden rounded-md"
              />
            </div>
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-1.5 hover:bg-slate-200 rounded text-lg"
            >
              😊
            </button>
          </div>

          <div className="flex items-center gap-1 px-2 shrink-0 ml-auto">
            <ToolbarButton
              onClick={() => fileInputRef.current?.click()}
              icon={<ImagePlus size={18} />}
            />
            <ToolbarButton
              onClick={() => {
                const url = window.prompt('URL YouTube:');
                if (url) {
                  const contentState = editorState.getCurrentContent();
                  const contentStateWithEntity = contentState.createEntity(
                    'MEDIA',
                    'IMMUTABLE',
                    { src: getYoutubeEmbedUrl(url), type: 'video' }
                  );
                  const entityKey =
                    contentStateWithEntity.getLastCreatedEntityKey();
                  setEditorState(
                    AtomicBlockUtils.insertAtomicBlock(
                      EditorState.set(editorState, {
                        currentContent: contentStateWithEntity,
                      }),
                      entityKey,
                      ' '
                    )
                  );
                }
              }}
              icon={<Youtube size={18} />}
            />
          </div>
        </div>

        {/* EMOJI PICKER OVERLAY */}
        {showEmojiPicker && (
          <div className="absolute z-[100] top-32 left-4 p-3 bg-white border border-slate-200 shadow-2xl rounded-2xl grid grid-cols-6 gap-1">
            {[
              '😀',
              '😂',
              '😍',
              '🤔',
              '👍',
              '🔥',
              '✨',
              '🚀',
              '❤️',
              '🎉',
              '😭',
              '✅',
            ].map((em) => (
              <button
                key={em}
                onClick={() => insertEmoji(em)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                {em}
              </button>
            ))}
          </div>
        )}

        {/* EDITOR AREA */}
        <div
          className="flex-1 overflow-y-auto p-4 md:p-8"
          onClick={focusEditor}
        >
          <div
            className={`max-w-3xl mx-auto min-h-full transition-all duration-300 ${isEditorFocused ? 'translate-y-[-2px]' : ''}`}
          >
            <Editor
              ref={editorRef}
              editorState={editorState}
              onChange={setEditorState}
              handleKeyCommand={handleKeyCommand}
              customStyleMap={dynamicStyleMap}
              blockRendererFn={(block) =>
                block.getType() === 'atomic'
                  ? { component: MediaBlock, editable: false }
                  : null
              }
              blockStyleFn={(block) => {
                const type = block.getType();
                if (type === 'header-one')
                  return 'text-4xl font-extrabold text-slate-900 mb-6 leading-tight';
                if (type === 'header-two')
                  return 'text-2xl font-bold text-slate-800 mb-4 mt-6';
                if (type === 'blockquote')
                  return 'border-l-4 border-indigo-500 pl-6 italic text-slate-600 my-6 text-lg';
                return 'text-slate-700 leading-relaxed mb-4 text-lg';
              }}
              placeholder="Mulai menulis cerita Anda di sini..."
              onFocus={() => setIsEditorFocused(true)}
              onBlur={() => setIsEditorFocused(false)}
            />
          </div>
        </div>
      </div>

      {/* SIDEBAR / PREVIEW */}
      <aside
        className={`
        fixed inset-0 z-[60] bg-white transition-transform duration-300 md:static md:w-80 lg:w-96 md:border-l border-slate-100 md:translate-x-0
        ${showPreview ? 'translate-x-0' : 'translate-x-full'}
      `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <h3 className="font-bold flex items-center gap-2">
              <Settings2 size={18} /> Metadata
            </h3>
            <button
              onClick={() => setShowPreview(false)}
              className="md:hidden p-2 text-slate-400"
            >
              <ChevronRight />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {/* GAMBAR UTAMA SECTION */}
            <section>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                <span className="text-red-500 text-xs">*</span> Gambar Utama
              </label>

              <div
                onClick={() => mainImageInputRef.current?.click()}
                className="relative cursor-pointer group overflow-hidden border-2 border-dashed border-slate-200 rounded-xl hover:border-indigo-400 transition-colors bg-slate-50 aspect-video flex flex-col items-center justify-center"
              >
                {mainImagePreview ? (
                  <>
                    <img
                      src={mainImagePreview}
                      className="w-full h-full object-cover"
                      alt="Main Preview"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-white text-xs font-bold bg-indigo-600 px-3 py-1 rounded-full">
                        Ganti Gambar
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeMainImage();
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="p-3 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                      <ImagePlus className="text-indigo-500" size={24} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Upload Cover
                    </span>
                  </>
                )}
              </div>

              {/* Input Tersembunyi */}
              <input
                ref={mainImageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleMainImageChange}
              />
            </section>

            <section>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                <span className="text-red-500 text-sm">*</span> Deskripsi
              </label>
              <Textarea
                className={'placeholder:text-slate-500'}
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Deskripsi singkat.."
              ></Textarea>
            </section>

            <section>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                Topik & Kategori
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full p-2 bg-slate-50 border-0 rounded-lg text-sm focus:ring-2 ring-indigo-500 outline-none"
                >
                  {topics.map((t) => (
                    <option value={t.id} key={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 bg-slate-50 border-0 rounded-lg text-sm focus:ring-2 ring-indigo-500 outline-none"
                >
                  {categories.map((c) => (
                    <option value={c.id} key={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            <section>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium flex items-center gap-1 group"
                  >
                    {t}
                    <button
                      onClick={() => setTags(tags.filter((x) => x !== t))}
                      className="hover:text-red-500 transition"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
                    e.preventDefault();
                    if (!tags.includes(tagInput.trim()))
                      setTags([...tags, tagInput.trim()]);
                    setTagInput('');
                  }
                }}
                placeholder="Tekan enter untuk tambahkan..."
                className="w-full p-2 text-sm bg-slate-50 rounded-lg outline-none focus:ring-2 ring-indigo-500 transition"
              />
            </section>

            <section className="pt-6 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 block">
                Live Preview
              </label>
              <div
                className="prose prose-sm prose-slate max-w-none prose-img:rounded-xl"
                dangerouslySetInnerHTML={{ __html: getSanitizedHtml() }}
              />
            </section>
          </div>
        </div>
      </aside>

      {/* Editor Image Upload (Internal Content) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
              const contentState = editorState.getCurrentContent();
              const contentStateWithEntity = contentState.createEntity(
                'MEDIA',
                'IMMUTABLE',
                { src: ev.target.result, type: 'image' }
              );
              const entityKey =
                contentStateWithEntity.getLastCreatedEntityKey();
              setEditorState(
                AtomicBlockUtils.insertAtomicBlock(
                  EditorState.set(editorState, {
                    currentContent: contentStateWithEntity,
                  }),
                  entityKey,
                  ' '
                )
              );
            };
            reader.readAsDataURL(file);
          }
        }}
      />
    </div>
  );
}

function ToolbarButton({ active, onClick, icon, title }) {
  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={title}
      className={`
        p-2 rounded-lg transition-all duration-200
        ${
          active
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105'
            : 'text-slate-500 hover:bg-slate-200 hover:text-slate-800'
        }
      `}
    >
      {icon}
    </button>
  );
}
