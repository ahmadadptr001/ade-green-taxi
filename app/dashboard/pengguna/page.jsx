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
  Shield,
  ShieldAlert,
  Trash2,
  UserCog,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function UserManagementPage() {
  const currentUser = useUser();
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- LOGIC AREA (TIDAK ADA YANG DIUBAH) ---
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
      Swal.fire({ icon: 'success', text: resp.message });
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

  return (
    <main className="min-h-screen w-full bg-[#F8FAFC] p-4 lg:p-8 pt-24 lg:pt-12">
      <div className="max-w-6xl mx-auto">
        {/* Header Section with Modern Gradient Text */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h2 className="text-4xl pb-4 lg:mt-7 font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">
              Manajemen Pengguna
            </h2>
            <p className="text-slate-500 font-medium mt-1 text-sm lg:text-base">
              Kelola akses tim dan status akun dengan mudah.
            </p>
          </div>
          <div className="block px-4 py-2 bg-white rounded-full shadow-sm text-xs font-bold text-slate-500 border border-slate-100">
            Total Users: {users ? users.length : 0}
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-4">
          {loading ? (
            <CardSkeletonList />
          ) : (
            <>
              {/* Desktop Headers (Hidden on Mobile) */}
              <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <div className="col-span-4">User Profile</div>
                <div className="col-span-3">Role Access</div>
                <div className="col-span-3">Status</div>
                <div className="col-span-2 text-center">Actions</div>
              </div>

              {/* User List Render */}
              <div className="grid gap-4">
                {users &&
                  users.map((user) => (
                    <div
                      key={user.id}
                      className="group relative bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-100 transition-all duration-300"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-4 lg:gap-4 items-center">
                        
                        {/* 1. User Info Section */}
                        <div className="col-span-1 lg:col-span-4 flex items-center gap-4">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-full blur-[2px] opacity-0 group-hover:opacity-50 transition-opacity"></div>
                            <img
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullname.replace(
                                ' ',
                                '+'
                              )}`}
                              className="relative w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-slate-50 border-2 border-white shadow-sm object-cover"
                              alt=""
                            />
                            {/* Online Indicator Dot */}
                            <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white rounded-full ${user.status === 'aktif' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-800 truncate text-base lg:text-lg group-hover:text-indigo-600 transition-colors">
                              {user?.fullname}
                            </p>
                            <p className="text-xs text-slate-400 truncate font-medium">
                              {user?.email}
                            </p>
                          </div>
                        </div>

                        {/* 2. Role Selector Section */}
                        <div className="col-span-1 lg:col-span-3">
                          <div className="flex flex-col w-fit gap-1 lg:block">
                            <span className="lg:hidden text-xs font-bold text-slate-400 uppercase">Role Akses</span>
                            <div className="relative">
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
                                className={`w-full lg:w-auto appearance-none pl-9 pr-8 py-2.5 rounded-xl text-sm font-bold shadow-sm border outline-none transition-all cursor-pointer
                                    ${user?.role === 'super admin' 
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
                                <Shield className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${user?.role.includes('admin') ? 'text-indigo-500' : 'text-slate-400'}`} />
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                          </div>
                        </div>

                        {/* 3. Status Badge Section */}
                        <div className="col-span-1 lg:col-span-3">
                           <div className="flex flex-col w-fit gap-1 lg:block">
                             <span className="lg:hidden text-xs font-bold text-slate-400 uppercase">Status Akun</span>
                              {user.status === 'aktif' ? (
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold shadow-sm">
                                  <CheckCircle2 size={14} className="fill-emerald-200 text-emerald-600"/>
                                  <span>Akun Aktif</span>
                                </div>
                              ) : (
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold shadow-sm">
                                  <XCircle size={14} className="fill-rose-200 text-rose-600"/>
                                  <span>Ditangguhkan</span>
                                </div>
                              )}
                           </div>
                        </div>

                        {/* 4. Actions Section */}
                        <div className="col-span-1 lg:col-span-2 flex items-center justify-start lg:justify-center gap-2 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 mt-2 lg:mt-0">
                          {user?.id !== currentUser?.id ? (
                            <>
                              <button
                                onClick={() => onChangeStatus(user)}
                                className={`p-2.5 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm border
                                  ${user.status === 'aktif'
                                    ? 'bg-white text-slate-400 border-slate-200 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200'
                                    : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'
                                  }`}
                                title={user.status === 'aktif' ? 'Suspend User' : 'Activate User'}
                              >
                                {user.status === 'aktif' ? <ShieldAlert size={18} /> : <CheckCircle2 size={18} />}
                              </button>
                              
                              <button
                                onClick={() => onDelete(user.id)}
                                className="p-2.5 rounded-xl bg-white text-slate-400 border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm"
                                title="Delete User"
                              >
                                <Trash2 size={18} />
                              </button>
                            </>
                          ) : (
                            <span className="text-xs font-bold text-slate-300 italic px-4 py-2 rounded-lg bg-slate-50">Anda</span>
                          )}
                        </div>

                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

// Skeleton Loader yang disesuaikan dengan Layout Baru
const CardSkeletonList = ({ rows = 5 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
             
             {/* User Info */}
             <div className="col-span-1 lg:col-span-4 flex items-center gap-4">
               <Skeleton className="w-14 h-14 rounded-full" />
               <div className="space-y-2 w-full">
                 <Skeleton className="h-5 w-40 rounded-lg" />
                 <Skeleton className="h-3 w-32 rounded-lg" />
               </div>
             </div>

             {/* Role */}
             <div className="col-span-1 lg:col-span-3">
                <Skeleton className="h-10 w-32 rounded-xl" />
             </div>

             {/* Status */}
             <div className="col-span-1 lg:col-span-3">
                <Skeleton className="h-8 w-28 rounded-full" />
             </div>

             {/* Actions */}
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