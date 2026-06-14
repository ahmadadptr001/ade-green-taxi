'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Search,
  Hash,
  Trash2,
  Pencil,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Swal from 'sweetalert2';
import { Capitalize } from '@/utils/text';
import { slugify } from '@/utils/slug';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

const PER_PAGE = 8;

/**
 * Paginated, editable taxonomy table shared by Kategori / Tag / Topik.
 * Flat surfaces, light weights, lots of whitespace.
 */
export default function TaxonomyManager({
  title,
  subtitle,
  label,
  fetcher,
  adder,
  remover,
  updater,
}) {
  const user = useUser();
  const router = useRouter();
  const [items, setItems] = useState(null);
  const [search, setSearch] = useState('');
  const [input, setInput] = useState('');
  const [page, setPage] = useState(1);

  // edit dialog state
  const [editing, setEditing] = useState(null);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      if (user.role !== 'admin' && user.role !== 'super admin') {
        Swal.fire({
          icon: 'warning',
          title: 'Anda tidak memiliki izin untuk mengakses halaman ini!',
        }).then((r) => r.isConfirmed && router.replace('/dashboard/berita'));
      }
      setItems((await fetcher()) ?? []);
    } catch (err) {
      Swal.fire({ icon: 'error', title: err.message });
      setItems([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleAdd = async () => {
    if (!input.trim()) return;
    try {
      Swal.fire({ icon: 'info', title: 'Mohon tunggu...', didOpen: () => Swal.showLoading() });
      const name = Capitalize(input);
      const resp = await adder(name, slugify(name));
      setInput('');
      Swal.fire({ icon: 'success', text: resp.message, didOpen: () => Swal.hideLoading() }).then(
        (r) => r.isConfirmed && load()
      );
    } catch (err) {
      Swal.fire({ icon: 'error', title: err.message, didOpen: () => Swal.hideLoading() });
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    try {
      Swal.fire({ icon: 'info', title: 'Mohon tunggu...', didOpen: () => Swal.showLoading() });
      const resp = await remover(id);
      Swal.fire({ icon: 'success', text: resp.message, didOpen: () => Swal.hideLoading() }).then(
        (r) => r.isConfirmed && load()
      );
    } catch (err) {
      Swal.fire({ icon: 'error', title: err.message, didOpen: () => Swal.hideLoading() });
    }
  };

  const openEdit = (item) => {
    setEditing(item);
    setEditName(item.name);
  };

  const handleUpdate = async () => {
    if (!editName.trim() || !editing || !updater) return;
    try {
      setSaving(true);
      const name = Capitalize(editName);
      const resp = await updater(editing.id, name, slugify(name));
      setSaving(false);
      setEditing(null);
      Swal.fire({ icon: 'success', text: resp.message }).then(
        (r) => r.isConfirmed && load()
      );
    } catch (err) {
      setSaving(false);
      Swal.fire({ icon: 'error', title: err.message });
    }
  };

  const loading = items === null;
  const filtered = useMemo(
    () =>
      (items ?? []).filter(
        (it) =>
          it.name.toLowerCase().includes(search.toLowerCase()) ||
          it.slug.toLowerCase().includes(search.toLowerCase())
      ),
    [items, search]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PER_PAGE;
  const paged = filtered.slice(start, start + PER_PAGE);

  return (
    <div className="mx-auto max-w-4xl px-6 py-14 md:px-10 md:py-16">
      {/* Header */}
      <header className="mb-12 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="mt-1.5 text-slate-500">{subtitle}</p>
        </div>
        {!loading && (
          <span className="hidden shrink-0 text-sm text-slate-400 sm:block">
            {items.length} {label.toLowerCase()}
          </span>
        )}
      </header>

      {/* Search + add */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Cari ${label.toLowerCase()}...`}
            className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />
        </div>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder={`${label} baru...`}
            className="h-11 flex-1 rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 sm:w-56 sm:flex-none"
          />
          <button
            onClick={handleAdd}
            disabled={!input.trim()}
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus size={16} /> Tambah
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center justify-between border-b border-slate-100 px-6 py-5 last:border-0">
              <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-12 animate-pulse rounded bg-slate-100" />
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs font-semibold text-slate-400">
                  <th className="w-12 px-6 py-3.5">#</th>
                  <th className="px-2 py-3.5">Nama</th>
                  <th className="hidden px-2 py-3.5 sm:table-cell">Slug</th>
                  <th className="w-24 px-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paged.map((item, i) => (
                  <tr key={item.id} className="group transition-colors hover:bg-slate-50/60">
                    <td className="px-6 py-4 text-slate-400">{start + i + 1}</td>
                    <td className="px-2 py-4">
                      <div className="flex items-center gap-2.5">
                        <Hash size={15} className="shrink-0 text-slate-300" />
                        <span className="font-medium text-slate-800">{item.name}</span>
                      </div>
                    </td>
                    <td className="hidden px-2 py-4 sm:table-cell">
                      <span className="font-mono text-xs text-slate-400">/{item.slug}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {updater && (
                          <button
                            aria-label="Edit"
                            onClick={() => openEdit(item)}
                            className="rounded-md p-2 text-slate-300 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
                          >
                            <Pencil size={15} />
                          </button>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              aria-label="Hapus"
                              className="rounded-md p-2 text-slate-300 transition-colors hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 size={15} />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hapus {label}?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Anda yakin ingin menghapus <strong>{item.name}</strong>? Tindakan
                                ini tidak bisa dibatalkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(item.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Ya, Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-5 flex items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              {start + 1}–{Math.min(start + PER_PAGE, filtered.length)} dari {filtered.length}
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronLeft size={15} />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm transition-colors ${
                      currentPage === i + 1
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-200 py-20 text-center">
          <p className="text-slate-500">{label} tidak ditemukan.</p>
        </div>
      )}

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {label}</DialogTitle>
            <DialogDescription>
              Perbarui nama {label.toLowerCase()}. Slug akan dibuat ulang otomatis.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
              autoFocus
              placeholder={`Nama ${label.toLowerCase()}`}
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
            <p className="px-1 font-mono text-xs text-slate-400">
              /{editName.trim() ? slugify(Capitalize(editName)) : '...'}
            </p>
          </div>
          <DialogFooter>
            <button
              onClick={() => setEditing(null)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              onClick={handleUpdate}
              disabled={saving || !editName.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
