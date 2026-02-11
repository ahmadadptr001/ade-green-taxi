'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Search, Hash, Sparkles, XCircle } from 'lucide-react';

// Pastikan komponen Shadcn ini sudah terinstall
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { addTag, getTags, removeTag } from '@/services/articles';
import Swal from 'sweetalert2';
import { slugify } from '@/utils/slug';
import { Capitalize } from '@/utils/text';
import { Skeleton } from '@/components/ui/skeleton';

export default function TagsPage() {
  // Data Awal (Tanpa Count)
  const [tags, setTags] = useState([
    {
      id: '1',
      name: 'Artificial Intelligence',
      slug: 'artificial-intelligence',
    },
    { id: '2', name: 'Startup Lokal', slug: 'startup-lokal' },
    { id: '3', name: 'Crypto Currency', slug: 'crypto-currency' },
    { id: '4', name: 'Pemilu 2024', slug: 'pemilu-2024' },
    { id: '5', name: 'Gadget Terbaru', slug: 'gadget-terbaru' },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // fetch data
  const fetchTags = async () => {
    try {
      const tagResponse = await getTags();
      setTags(tagResponse.tags);
      setLoading(false);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: err.message,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleReload = () => {
    fetchTags();
  };

  // Filter Logic
  const filteredTags = tags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = async () => {
    if (!inputValue.trim()) return;

    try {
      Swal.fire({
        icon: 'info',
        title: 'Mohon tunggu...',
        didOpen: () => Swal.showLoading(),
      });

      const name = Capitalize(inputValue);
      const slug = slugify(name);

      const response = await addTag(name, slug);
      setInputValue('');
      Swal.fire({
        icon: 'success',
        text: response.message,
        didOpen: () => Swal.hideLoading(),
      }).then((result) => {
        if (result.isConfirmed) {
          handleReload();
        }
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: err.message,
        didOpen: () => Swal.hideLoading(),
      });
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    try {
      Swal.fire({
        icon: 'info',
        title: 'Mohon tunggu...',
        didOpen: () => Swal.showLoading(),
      });

      const response = await removeTag(id);
      setInputValue('');
      Swal.fire({
        icon: 'success',
        text: response.message,
        didOpen: () => Swal.hideLoading(),
      }).then((result) => {
        if (result.isConfirmed) {
          handleReload();
        }
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: err.message,
        didOpen: () => Swal.hideLoading(),
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 font-sans text-slate-900">
      <div className="mx-auto max-w-7xl space-y-10">
        {/* --- Header Section: Modern & Bold --- */}
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Tags
              </span>{' '}
              Management
            </h1>
            <p className="text-lg text-slate-500 font-medium">
              Kelola tag berita untuk memudahkan pencarian
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-400 bg-white px-4 py-2 rounded-full border shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            {tags.length} Active Tags
          </div>
        </div>

        {/* --- Action Bar: Floating Style --- */}
        <div className="sticky top-4 z-10">
          <div className="flex flex-col gap-3 p-2 bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl md:flex-row md:items-center">
            {/* Search Input */}
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <Input
                placeholder="Cari tag atau slug..."
                className="pl-12 h-12 border-transparent bg-transparent focus-visible:ring-0 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="w-[1px] h-8 bg-slate-200 hidden md:block"></div>

            {/* Add Input */}
            <div className="flex w-full md:w-auto gap-2 items-center p-1">
              <Input
                placeholder="Nama tag baru..."
                className="h-10 border-slate-200 bg-slate-50 md:w-64 focus-visible:ring-blue-500/20"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
              <Button
                onClick={handleAdd}
                disabled={!inputValue}
                className="h-10 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 transition-all hover:scale-105"
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <TagSkeleton />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTags.map((tag) => (
              <Card
                key={tag.id}
                className="group relative overflow-hidden border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50 hover:border-blue-200"
              >
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-blue-50 transition-all group-hover:bg-blue-100 group-hover:scale-150" />

                <CardHeader className="relative pb-2">
                  <div className="flex items-start justify-between">
                    <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">
                      <Hash className="h-5 w-5 text-slate-400 group-hover:text-blue-600" />
                    </div>

                    {/* Delete Dialog */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="opacity-100 transition-opacity p-2 bg-red-50 text-red-500 rounded-full">
                                                  <Trash2 className="h-6 w-6 font-bold" />
                                                </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus Tag?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Anda yakin ingin menghapus tag{' '}
                            <strong>{tag.name}</strong>? Tindakan ini tidak bisa
                            dibatalkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(tag.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Ya, Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>

                <CardContent className="relative space-y-3">
                  <h3 className="font-bold text-lg text-slate-800 leading-tight">
                    {tag.name}
                  </h3>

                  <div className="flex items-center">
                    <Badge
                      variant="secondary"
                      className="font-mono text-xs font-normal text-slate-500 bg-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors"
                    >
                      /{tag.slug}
                    </Badge>
                  </div>
                </CardContent>

                {/* Decorative Bottom Bar */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 group-hover:w-full" />
              </Card>
            ))}
          </div>
        )}

        {/* --- Empty State --- */}
        {filteredTags.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-slate-200 blur-xl opacity-50 rounded-full" />
              <div className="relative bg-white p-6 rounded-full shadow-sm border">
                <XCircle className="h-10 w-10 text-slate-300" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-slate-900">
              Tag tidak ditemukan
            </h3>
            <p className="text-slate-500 max-w-xs mt-2">
              Coba kata kunci lain atau tambahkan tag baru untuk memulai.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
function TagSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <Card key={i} className="border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
