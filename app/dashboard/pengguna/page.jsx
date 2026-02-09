'use client';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/context/UserContext';
import {
  deleteUser,
  getUsers,
  updateRoleUser,
  updateStatusUser,
} from '@/services/users';
import { AlertCircle, CheckCircle, Trash2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function UserManagemnetPage() {
  const currentUser = useUser();
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const users_ = await getUsers();
        setUsers(users_.data);
        setLoading(false);
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: err.message,
        });
      }
    })();
  }, []);

  // ubah role
  const onChangeRole = async (id, role, email) => {
    try {
      setLoading(true);
      const resp = await updateRoleUser(id, role, email);
      Swal.fire({
        icon: 'success',
        text: resp.message,
      });
      setLoading(false);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        text: err.message,
      });
      setLoading(false);
    }
  };
  const getNextStatus = (currentStatus) =>
    currentStatus === 'aktif' ? 'ditangguhkan' : 'aktif';

  const onChangeStatus = async (user) => {
    const nextStatus = getNextStatus(user.status);

    const confirm = await Swal.fire({
      icon: 'question',
      title: 'Konfirmasi',
      text:
        nextStatus === 'ditangguhkan'
          ? 'Pengguna akan ditangguhkan'
          : 'Pengguna akan diaktifkan',
      showCancelButton: true,
      confirmButtonText: 'Ya',
    });

    if (!confirm.isConfirmed) return;

    try {
      // optimistic UI
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
      );
      setLoading(true);
      await updateStatusUser(user.id, nextStatus, user.email);

      Swal.fire({
        icon: 'success',
        text: `Pengguna berhasil ${nextStatus}`,
      }).then((result) => {
        if (!result.isConfirmed) setLoading(false);
      });
      setLoading(false);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        text: err.message,
      });

      // rollback kalau gagal
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: user.status } : u))
      );
      setLoading(false);
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
      // optimistic UI
      setLoading(true);
      await deleteUser(id);

      Swal.fire({
        icon: 'success',
        text: `Pengguna berhasil dihapus`,
      }).then((result) => {
        if (!result.isConfirmed) setLoading(false);
      });
      setLoading(false);
      window.location.reload();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        text: err.message,
      });

      setLoading(false);
    }
  };

  return (
    <main className="overflow-auto bg-sky-50/70 w-full h-full pt-20 md:pt-0">
      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
          Kontrol Pengguna
        </h2>
        <p className="text-slate-500 mt-1">
          Kelola akses dan status pengguna sistem
        </p>
        {loading ? (
          <CardSkeletonTable />
        ) : (
          <table className="bg-white shadow-md/5 rounded-md mt-5 w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/50 text-slate-800 font-bold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Nama Pengguna</th>
                <th className="px-6 py-4">Role Akses</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users &&
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullname.replace(' ', '+')}`}
                          className="w-10 h-10 rounded-full bg-slate-100"
                          alt=""
                        />
                        <div>
                          <p className="font-bold text-slate-900">
                            {user?.fullname}
                          </p>
                          <p className="text-xs text-slate-400">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user?.role}
                        onChange={(e) =>
                          onChangeRole(
                            user?.id,
                            e.target.value.toLowerCase(),
                            user?.email
                          )
                        }
                        disabled={user.id === currentUser.id}
                        className="bg-white border border-slate-200 text-slate-700 text-xs rounded-lg p-2 outline-none focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
                      >
                        <option value="pengunjung">Pengunjung</option>
                        <option value="admin">Admin</option>
                        <option value="super admin">Super Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      {user.status === 'aktif' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                          <CheckCircle size={12} /> Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                          <XCircle size={12} /> Ditangguhkan
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {user?.id !== currentUser?.id && (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => onChangeStatus(user)}
                            className={`p-2 rounded-lg transition-colors ${
                              user.status === 'aktif'
                                ? 'text-orange-400 hover:bg-orange-50'
                                : 'text-emerald-500 hover:bg-emerald-50'
                            }`}
                            title={
                              user.status === 'aktif'
                                ? 'Pengguna Ditangguhkan'
                                : 'Pengguna Diaktifkan'
                            }
                          >
                            <AlertCircle size={18} />
                          </button>
                          <button
                            onClick={() => onDelete(user.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Permanently"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}

const CardSkeletonTable = ({ rows = 5 }) => {
  return (
    <table className="bg-white shadow-md/5 rounded-md mt-5 w-full text-left text-sm text-slate-600">
      <thead className="bg-slate-50/50 text-slate-800 font-bold border-b border-slate-100">
        <tr>
          <th className="px-6 py-4">Nama Pengguna</th>
          <th className="px-6 py-4">Role Akses</th>
          <th className="px-6 py-4">Status</th>
          <th className="px-6 py-4 text-center">Aksi</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-slate-50">
        {Array.from({ length: rows }).map((_, i) => (
          <tr key={i}>
            {/* Nama Pengguna */}
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
            </td>

            {/* Role Akses */}
            <td className="px-6 py-4">
              <Skeleton className="h-8 w-28 rounded-lg" />
            </td>

            {/* Status */}
            <td className="px-6 py-4">
              <Skeleton className="h-6 w-24 rounded-full" />
            </td>

            {/* Aksi */}
            <td className="px-6 py-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <Skeleton className="h-9 w-9 rounded-lg" />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
