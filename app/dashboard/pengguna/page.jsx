'use client';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/context/UserContext';
import {
  deleteUser,
  getUsers,
  updateRoleUser,
  updateStatusUser,
} from '@/services/users';
import { Search, Trash2, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function UserManagementPage() {
  const router = useRouter();
  const currentUser = useUser();
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (currentUser.role !== 'admin' && currentUser.role !== 'super admin') {
      Swal.fire({
        icon: 'warning',
        title: 'Anda tidak memiliki izin untuk mengakses halaman ini!',
      }).then((result) => {
        if (result.isConfirmed) router.replace('/dashboard/berita');
      });
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const users_ = await getUsers();
        setUsers(users_.data);
        setLoading(false);
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: err.message });
        setLoading(false);
      }
    })();
  }, []);

  const onChangeRole = async (id, role, email) => {
    try {
      setLoading(true);
      const resp = await updateRoleUser(id, role, email);
      Swal.fire({ icon: 'success', text: resp.message }).then((result) => {
        if (result.isConfirmed) window.location.reload();
      });
      setLoading(false);
    } catch (err) {
      Swal.fire({ icon: 'error', text: err.message });
      setLoading(false);
    }
  };

  const onSetStatus = async (user, nextStatus) => {
    if (!nextStatus || nextStatus === user.status) return;
    const confirm = await Swal.fire({
      icon: 'question',
      title: 'Konfirmasi',
      text:
        nextStatus === 'ditangguhkan'
          ? 'Pengguna akan ditangguhkan'
          : 'Pengguna akan diaktifkan',
      showCancelButton: true,
      confirmButtonText: 'Ya',
      confirmButtonColor: '#059669',
    });
    if (!confirm.isConfirmed) return;

    const prevStatus = user.status;
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
    );
    try {
      await updateStatusUser(user.id, nextStatus, user.email);
      Swal.fire({
        icon: 'success',
        text: `Pengguna berhasil ${nextStatus}`,
        confirmButtonColor: '#059669',
      });
    } catch (err) {
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: prevStatus } : u))
      );
      Swal.fire({ icon: 'error', text: err.message });
    }
  };

  const onDelete = async (id) => {
    const confirm = await Swal.fire({
      icon: 'question',
      title: 'Konfirmasi',
      text: 'Apakah anda yakin ingin menghapus akun ini?',
      showCancelButton: true,
      confirmButtonText: 'Ya',
    });
    if (!confirm.isConfirmed) return;
    try {
      setLoading(true);
      await deleteUser(id);
      Swal.fire({ icon: 'success', text: 'Pengguna berhasil dihapus' }).then(
        (result) => {
          if (!result.isConfirmed) setLoading(false);
        }
      );
      setLoading(false);
      window.location.reload();
    } catch (err) {
      Swal.fire({ icon: 'error', text: err.message });
      setLoading(false);
    }
  };

  const filteredUsers = users?.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.fullname.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  const activeCount = users ? users.filter((u) => u.status === 'aktif').length : 0;

  return (
    <main className="min-h-screen w-full bg-slate-50/50 px-6 py-12 md:px-10 md:py-16">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Header */}
        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900">
              Manajemen Pengguna
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Kelola peran dan status akun tim Anda.
            </p>
            {!loading && (
              <p className="mt-3 text-xs text-slate-400">
                Total{' '}
                <span className="font-medium text-slate-600">{users?.length ?? 0}</span> ·
                Aktif <span className="font-medium text-emerald-600">{activeCount}</span>
              </p>
            )}
          </div>

          <div className="relative w-full sm:w-72">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </header>

        {/* Table */}
        {loading ? (
          <TableSkeleton />
        ) : filteredUsers && filteredUsers.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs font-medium text-slate-400">
                    <th className="px-6 py-3.5">Pengguna</th>
                    <th className="px-3 py-3.5">Role</th>
                    <th className="px-3 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => {
                    const isSelf = user.id === currentUser.id;
                    return (
                      <tr key={user.id} className="transition-colors hover:bg-slate-50/60">
                        {/* Profile */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullname?.replace(' ', '+')}`}
                              className="h-9 w-9 shrink-0 rounded-full border border-slate-200 bg-slate-50"
                              alt=""
                            />
                            <div className="min-w-0">
                              <p className="truncate font-medium text-slate-800">
                                {user?.fullname}
                              </p>
                              <p className="truncate text-xs text-slate-500">
                                {user?.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-3 py-4">
                          {isSelf ? (
                            <span className="text-xs text-slate-400">—</span>
                          ) : (
                            <SelectPill
                              value={user?.role}
                              onChange={(e) =>
                                onChangeRole(user?.id, e.target.value.toLowerCase(), user?.email)
                              }
                              tone={user?.role?.includes('admin') ? 'emerald' : 'slate'}
                            >
                              <option value="pengunjung">Pengunjung</option>
                              <option value="admin">Admin</option>
                              <option value="super admin">Super Admin</option>
                            </SelectPill>
                          )}
                        </td>

                        {/* Status (select, not icon) */}
                        <td className="px-3 py-4">
                          {isSelf ? (
                            <span className="text-xs text-slate-400">—</span>
                          ) : (
                            <SelectPill
                              value={user.status}
                              onChange={(e) => onSetStatus(user, e.target.value)}
                              tone={user.status === 'aktif' ? 'emerald' : 'rose'}
                            >
                              <option value="aktif">Aktif</option>
                              <option value="ditangguhkan">Ditangguhkan</option>
                            </SelectPill>
                          )}
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4 text-right">
                          {isSelf ? (
                            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                              Akun Anda
                            </span>
                          ) : (
                            <button
                              onClick={() => onDelete(user.id)}
                              title="Hapus pengguna"
                              className="rounded-md p-2 text-slate-300 transition-colors hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 py-20 text-center">
            <Search size={32} className="mx-auto mb-4 text-slate-300" />
            <h3 className="font-display text-base font-semibold text-slate-700">
              Tidak ada pengguna ditemukan
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Coba kata kunci nama atau email yang berbeda.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

function SelectPill({ value, onChange, tone = 'slate', children }) {
  const tones = {
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700 focus:ring-emerald-100',
    rose: 'border-rose-200 bg-rose-50 text-rose-700 focus:ring-rose-100',
    slate: 'border-slate-200 bg-white text-slate-600 focus:ring-slate-100',
  };
  return (
    <div className="relative w-fit">
      <select
        value={value}
        onChange={onChange}
        className={`w-40 cursor-pointer appearance-none rounded-lg border px-3 py-2 pr-8 text-sm font-medium capitalize outline-none transition-colors focus:ring-2 ${tones[tone]}`}
      >
        {children}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 opacity-50"
      />
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b border-slate-100 px-6 py-4 last:border-0"
        >
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-40 rounded" />
            <Skeleton className="h-3 w-56 rounded" />
          </div>
          <Skeleton className="h-9 w-32 rounded-lg" />
          <Skeleton className="h-9 w-32 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      ))}
    </div>
  );
}
