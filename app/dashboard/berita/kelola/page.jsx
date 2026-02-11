'use client';

import React, { useEffect, useState } from 'react';
import {
  MoreHorizontal,
  Eye,
  Trash2,
  Edit,
  Search,
  Calendar,
  BarChart3,
  Heart,
  Bookmark,
  Image as ImageIcon,
  // Icon tambahan untuk Toolbar Tiptap
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading2,
  Undo,
  Redo,
} from 'lucide-react';

// --- TIPTAP IMPORTS ---
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link'; // Opsional jika butuh link
// Hapus import draft-js dan react-draft-wysiwyg

import { format } from 'date-fns';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { getArticles } from '@/services/articles';

// --- KOMPONEN EDITOR TIPTAP ---
const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50 rounded-t-md">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'bg-gray-200' : ''}
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'bg-gray-200' : ''}
      >
        <Italic className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}
      >
        <Heading2 className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
      >
        <List className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}
      >
        <ListOrdered className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'bg-gray-200' : ''}
      >
        <Quote className="w-4 h-4" />
      </Button>
      <div className="w-[1px] h-6 bg-gray-300 mx-1 self-center" />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo className="w-4 h-4" />
      </Button>
    </div>
  );
};

const TiptapEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({
        openOnClick: false,
      }),
    ],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none p-4 min-h-[300px] focus:outline-none',
      },
    },
  });

  // Update content jika prop content berubah secara eksternal (misal saat ganti artikel)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
       // Hanya set content jika benar-benar berbeda untuk menghindari cursor jumping
       // Namun untuk kasus "Open Modal" ini aman karena editor di-mount ulang atau content berubah drastis
       editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="border rounded-md bg-white w-full">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

// --- DATA MOCK ---
const MOCK_DATA = [
  {
    id: 1,
    title: 'Masa Depan AI dalam Pengembangan Web Modern',
    slug: 'masa-depan-ai-web-dev',
    content: `
      <h2>Pendahuluan</h2>
      <p>Kecerdasan Buatan (AI) telah mengubah cara kita membangun aplikasi web. Dari <strong>GitHub Copilot</strong> hingga <em>ChatGPT</em>, developer kini memiliki asisten pribadi.</p>
      <ul>
        <li>Peningkatan produktivitas</li>
        <li>Debugging otomatis</li>
        <li>Generasi konten dinamis</li>
      </ul>
      <blockquote>"AI tidak akan menggantikan programmer, tetapi programmer yang menggunakan AI akan menggantikan mereka yang tidak."</blockquote>
    `,
    description:
      'Artikel mendalam tentang bagaimana AI mengubah lanskap coding.',
    published_at: '2023-10-25T14:30:00Z',
    views: 1250,
    img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=300&h=200',
    article_likes: Array(45).fill({}),
    article_bookmarks: Array(12).fill({}),
    article_categories: [
      { categories: { id: 1, name: 'Technology', slug: 'tech' } },
    ],
    article_tags: [
      { tags: { id: 1, name: 'AI', slug: 'ai' } },
      { tags: { id: 2, name: 'Web Dev', slug: 'web-dev' } },
    ],
    article_topics: [
      { topics: { id: 1, name: 'Innovation', slug: 'innovation' } },
    ],
  },
  {
    id: 2,
    title: 'Panduan Lengkap Shadcn UI untuk Pemula',
    slug: 'panduan-shadcn-ui',
    content:
      '<p>Shadcn UI bukanlah component library biasa, ini adalah koleksi komponen yang bisa kamu copy-paste...</p>',
    description: 'Tutorial step-by-step mengimplementasikan Shadcn di Next.js.',
    published_at: null,
    views: 0,
    img: null,
    article_likes: [],
    article_bookmarks: [],
    article_categories: [
      { categories: { id: 2, name: 'Tutorial', slug: 'tutorial' } },
    ],
    article_tags: [{ tags: { id: 3, name: 'React', slug: 'react' } }],
    article_topics: [],
  },
];

export default function ArticleManager() {
  const [articles, setArticles] = useState(MOCK_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  
  // GANTI: EditorState DraftJS menjadi string HTML biasa untuk Tiptap
  const [editorContentHtml, setEditorContentHtml] = useState('');

  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const filteredArticles = articles.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Buka Preview
  const handleView = (article) => {
    setSelectedArticle(article);
    setIsSheetOpen(true);
  };

  // Konfirmasi Hapus
  const confirmDelete = (id) => {
    setDeleteId(id);
    setIsAlertOpen(true);
  };

  // Eksekusi Hapus
  const handleDelete = () => {
    setArticles((prev) => prev.filter((a) => a.id !== deleteId));
    setIsAlertOpen(false);
    console.log(`Article ${deleteId} deleted`);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Title', 'Slug', 'Views', 'Published At'];
    const rows = articles.map((a) => [
      a.id,
      `"${a.title.replace(/"/g, '""')}"`,
      a.slug,
      a.views,
      a.published_at || 'Draft',
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `articles_report_${new Date().toISOString().split('T')[0]}.csv`
    );
    link.click();
  };

  // --- FUNGSI EDIT ---
  const openEditModal = (article) => {
    setEditingArticle(article);

    // GANTI: Tidak perlu konversi htmlToDraftjs, Tiptap menerima HTML string langsung
    setEditorContentHtml(article.content || '');
    
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    // GANTI: Ambil langsung dari state string (karena Tiptap mengupdate state ini onUpdate)
    const htmlContent = editorContentHtml;

    const updatedArticles = articles.map((a) =>
      a.id === editingArticle.id
        ? { ...editingArticle, content: htmlContent }
        : a
    );

    setArticles(updatedArticles);
    setIsEditDialogOpen(false);
    console.log('Saved HTML:', htmlContent);
  };
  
  // fetch data
  const fetchData = async() => {
    try {
      const artResponse = await getArticles();
      setArticles(artResponse.articles);
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: err.message }) 
    }
  }

  useEffect(() => {
    fetchData() 
  }, []);

  const handleReload = () => {
    fetchData()
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 bg-gray-50/50 min-h-screen">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Articles
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola, edit, dan pantau performa konten berita kamu.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            Export CSV
          </Button>
          <Link href={'/dashboard/berita/tulis'}>
            <Button className="bg-black hover:bg-gray-800 text-white">
              + Buat Artikel
            </Button>
          </Link>
        </div>
      </div>

      {/* --- FILTERS --- */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari judul artikel..."
            className="pl-9 bg-gray-50 border-gray-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/80">
            <TableRow>
              <TableHead className="w-[400px]">Artikel</TableHead>
              <TableHead>Status & Kategori</TableHead>
              <TableHead>Statistik</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <TableRow
                  key={article.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  {/* Kolom 1: Image & Title */}
                  <TableCell>
                    <div className="flex items-start gap-4">
                      <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-gray-100">
                        {article.img ? (
                          <img
                            src={article.img}
                            alt={article.title}
                            className="h-full w-full object-cover transition-transform hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-400">
                            <ImageIcon size={24} />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <span className="font-semibold text-gray-900 line-clamp-2 leading-tight">
                          {article.title}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {article.article_tags.map((t) => (
                            <span
                              key={t.tags.id}
                              className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded"
                            >
                              #{t.tags.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Kolom 2: Taxonomy & Status */}
                  <TableCell>
                    <div className="flex flex-col gap-2 items-start">
                      {article.published_at ? (
                        <Badge
                          variant="default"
                          className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200 shadow-none"
                        >
                          Published
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200"
                        >
                          Draft
                        </Badge>
                      )}
                      {article.article_categories.map((c) => (
                        <span
                          key={c.categories.id}
                          className="text-xs font-medium text-gray-600"
                        >
                          {c.categories.name}
                        </span>
                      ))}
                    </div>
                  </TableCell>

                  {/* Kolom 3: Stats */}
                  <TableCell>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1" title="Views">
                        <BarChart3 className="h-4 w-4 text-blue-500" />
                        <span>{article.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1" title="Likes">
                        <Heart className="h-4 w-4 text-rose-500" />
                        <span>{article.article_likes.length}</span>
                      </div>
                      <div
                        className="flex items-center gap-1"
                        title="Bookmarks"
                      >
                        <Bookmark className="h-4 w-4 text-amber-500" />
                        <span>{article.article_bookmarks.length}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Kolom 4: Date */}
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                          {article.published_at
                            ? format(
                                new Date(article.published_at),
                                'dd MMM yyyy'
                              )
                            : '-'}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground ml-5.5">
                        {article.published_at
                          ? format(new Date(article.published_at), 'HH:mm')
                          : 'Belum rilis'}
                      </span>
                    </div>
                  </TableCell>

                  {/* Kolom 5: Actions */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-gray-200"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleView(article)}>
                          <Eye className="mr-2 h-4 w-4" /> Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openEditModal(article)}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => confirmDelete(article.id)}
                          className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Tidak ada artikel yang ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit Artikel</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 flex-1 overflow-y-auto pr-2">
            <div>
              <label className="text-sm font-medium">Judul</label>
              <Input
                value={editingArticle?.title || ''}
                onChange={(e) =>
                  setEditingArticle({
                    ...editingArticle,
                    title: e.target.value,
                  })
                }
              />
            </div>

            <div className="min-h-[400px]">
              <label className="text-sm font-medium mb-2 block">
                Konten (Rich Text)
              </label>
              
              {/* GANTI: Menggunakan Component Wrapper Tiptap */}
              <TiptapEditor 
                content={editorContentHtml} 
                onChange={setEditorContentHtml} 
              />
              
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Batal
            </Button>
            <Button onClick={handleSaveEdit}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* --- SHEET PREVIEW (VIEW DETAIL) --- */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-xl w-full overflow-y-auto">
          {selectedArticle && (
            <div className="space-y-6">
              <SheetHeader>
                <div className="flex items-center gap-2 mb-2">
                  {selectedArticle.article_categories.map((c) => (
                    <Badge key={c.categories.id} variant="outline">
                      {c.categories.name}
                    </Badge>
                  ))}
                </div>
                <SheetTitle className="text-2xl leading-snug">
                  {selectedArticle.title}
                </SheetTitle>
                <SheetDescription>
                  {selectedArticle.description ||
                    'Tidak ada deskripsi singkat.'}
                </SheetDescription>
              </SheetHeader>

              <Separator />

              {/* Render Image */}
              {selectedArticle.img && (
                <div className="rounded-lg overflow-hidden border">
                  <img
                    src={selectedArticle.img}
                    alt="Preview"
                    className="w-full object-cover max-h-[300px]"
                  />
                </div>
              )}

              {/* Render HTML Content */}
              <div className="prose px-4 prose-sm prose-slate max-w-none dark:prose-invert">
                <div
                  dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                />
              </div>

              <Separator />

              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-500 space-y-2">
                <p>
                  <strong>Slug:</strong> {selectedArticle.slug}
                </p>
                <p>
                  <strong>Views:</strong> {selectedArticle.views}
                </p>
                <p>
                  <strong>Created:</strong> {selectedArticle.published_at}
                </p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* --- DELETE CONFIRMATION DIALOG --- */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah kamu yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Artikel ini akan dihapus
              secara permanen dari database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Hapus Artikel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}