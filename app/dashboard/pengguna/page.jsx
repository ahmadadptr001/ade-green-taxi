'use client';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/context/UserContext';
import {
  deleteUser,
  getUsers,
  updateRoleUser,
  updateStatusUser,
} from '@/services/users';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  MoreHorizontal,
  Search, // Import icon Search
  Shield,
  ShieldAlert,
  Trash2,
  UserCog,
  XCircle,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function UserManagementPage() {
  const currentUser = useUser();
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const users_ = await getUsers();
        setUsers(users_.data);
        setLoading(false);
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message,
        });
      }
    })();
  }, []);

  const onChangeRole = async (id, role, email) => {
    try {
      setLoading(true);
      const resp = await updateRoleUser(id, role, email);
      Swal.fire({ icon: 'success', text: resp.message }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
      setLoading(false);
    } catch (err) {
      Swal.fire({ icon: 'error', text: err.message });
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
      Swal.fire({ icon: 'error', text: err.message });
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
      Swal.fire({ icon: 'error', text: err.message });
      setLoading(false);
    }
  };
  // --- END LOGIC AREA ---

  // --- FILTERING LOGIC ---
  const filteredUsers = users?.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.fullname.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  return (
    <main className="min-h-screen w-full bg-slate-50/50 p-4 lg:p-8 pt-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER AREA */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Manajemen Pengguna
            </h2>
            <p className="text-slate-500 font-medium text-sm max-w-md">
              Kelola akses tim, peran, dan status akun dalam satu tampilan terpusat.
            </p>
            <div className="flex items-center gap-2 mt-2">
               <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
                 <Users size={14} /> 
                 Total: {users ? users.length : 0}
               </span>
               <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                 Aktif: {users ? users.filter(u => u.status === 'aktif').length : 0}
               </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="w-full lg:w-96 relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 font-medium"
            />
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <CardSkeletonList />
          ) : (
            <>
              {filteredUsers && filteredUsers.length > 0 && (
                <div className="hidden lg:grid grid-cols-12 gap-6 px-6 pb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <div className="col-span-4">Profil Pengguna</div>
                  <div className="col-span-3">Akses & Role</div>
                  <div className="col-span-3">Status</div>
                  <div className="col-span-2 text-center">Tindakan</div>
                </div>
              )}

              {/* User List */}
              <div className="grid gap-3">
                {filteredUsers && filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="group relative bg-white rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 hover:border-indigo-200 hover:shadow-[0_8px_24px_rgba(99,102,241,0.1)] transition-all duration-300"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-5 lg:gap-6 items-center">
                        
                        {/* 1. User Info */}
                        <div className="col-span-1 lg:col-span-4 flex items-center gap-4">
                          <div className="relative shrink-0">
                            <img
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullname.replace(' ', '+')}`}
                              className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-slate-50 border-2 border-white shadow-sm"
                              alt=""
                            />
                            <span
                              className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white rounded-full ${
                                user.status === 'aktif' ? 'bg-emerald-500' : 'bg-rose-500'
                              }`}
                            ></span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-800 text-base lg:text-lg truncate group-hover:text-indigo-600 transition-colors">
                              {user?.fullname}
                            </p>
                            <p className="text-sm text-slate-500 truncate font-medium">
                              {user?.email}
                            </p>
                          </div>
                        </div>

                        <div className="col-span-1 lg:col-span-3">
                          <div className="flex flex-col gap-1.5">
                            <span className="lg:hidden text-xs font-bold text-slate-400 uppercase">Role Akses</span>
                            <div className="relative w-fit">
                              <select
                                value={user?.role}
                                onChange={(e) =>
                                  onChangeRole(user?.id, e.target.value.toLowerCase(), user?.email)
                                }
                                disabled={user.id === currentUser.id}
                                className={`w-full lg:w-48 appearance-none pl-10 pr-8 py-2.5 rounded-xl text-sm font-bold shadow-sm border outline-none transition-all cursor-pointer
                                  ${
                                    user?.role === 'super admin'
                                      ? 'bg-indigo-50 text-indigo-700 border-indigo-100 focus:ring-2 focus:ring-indigo-200'
                                      : user?.role === 'admin'
                                      ? 'bg-blue-50 text-blue-700 border-blue-100 focus:ring-2 focus:ring-blue-200'
                                      : 'bg-slate-50 text-slate-600 border-slate-200 focus:ring-2 focus:ring-slate-200'
                                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                              >
                                <option value="pengunjung">Pengunjung</option>
                                <option value="admin">Admin</option>
                                <option value="super admin">Super Admin</option>
                              </select>
                              <Shield
                                size={16}
                                className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                                  user?.role.includes('admin') ? 'text-current opacity-70' : 'text-slate-400'
                                }`}
                              />
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-current opacity-50 pointer-events-none" />
                            </div>
                          </div>
                        </div>

                        {/* 3. Status Badge */}
                        <div className="col-span-1 lg:col-span-3">
                          <div className="flex flex-col gap-1.5">
                            <span className="lg:hidden text-xs font-bold text-slate-400 uppercase">Status Akun</span>
                            {user.status === 'aktif' ? (
                              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/50 border border-emerald-200 text-emerald-700 text-xs font-bold w-fit">
                                <CheckCircle2 size={14} className="text-emerald-600" />
                                <span>Akun Aktif</span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-100/50 border border-rose-200 text-rose-700 text-xs font-bold w-fit">
                                <XCircle size={14} className="text-rose-600" />
                                <span>Ditangguhkan</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 4. Actions */}
                        <div className="col-span-1 lg:col-span-2 flex items-center justify-start lg:justify-center pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 mt-2 lg:mt-0">
                          {user?.id !== currentUser?.id ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => onChangeStatus(user)}
                                className={`p-2.5 rounded-xl transition-all duration-200 border shadow-sm group/btn
                                  ${
                                    user.status === 'aktif'
                                      ? 'bg-white border-slate-200 text-slate-400 hover:text-amber-600 hover:bg-amber-50 hover:border-amber-200'
                                      : 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100'
                                  }`}
                                title={user.status === 'aktif' ? 'Suspend User' : 'Activate User'}
                              >
                                {user.status === 'aktif' ? (
                                  <ShieldAlert size={18} />
                                ) : (
                                  <CheckCircle2 size={18} />
                                )}
                              </button>

                              <button
                                onClick={() => onDelete(user.id)}
                                className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-all duration-200 shadow-sm"
                                title="Delete User"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-4 py-2 rounded-lg select-none">
                              Akun Anda
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // Empty State
                  <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                      <Search size={32} className="text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Tidak ada pengguna ditemukan</h3>
                    <p className="text-slate-500 text-sm mt-1">
                      Coba cari dengan kata kunci nama atau email yang berbeda.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

// Skeleton Loader Moderen
const CardSkeletonList = ({ rows = 5 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="col-span-1 lg:col-span-4 flex items-center gap-4">
              <Skeleton className="w-14 h-14 rounded-full" />
              <div className="space-y-2 w-full max-w-[200px]">
                <Skeleton className="h-5 w-full rounded-lg" />
                <Skeleton className="h-3 w-2/3 rounded-lg" />
              </div>
            </div>
            <div className="col-span-1 lg:col-span-3">
              <Skeleton className="h-10 w-32 rounded-xl" />
            </div>
            <div className="col-span-1 lg:col-span-3">
              <Skeleton className="h-8 w-28 rounded-full" />
            </div>
            <div className="col-span-1 lg:col-span-2 flex gap-2 justify-start lg:justify-center">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};