'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  Search,
  Shield,
  Smartphone,
  Mail,
  Users,
  UserCheck,
  UserX,
  Filter,
  RefreshCcw,
  ChevronDown,
  Loader2,
  MoreVertical,
} from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import Swal from 'sweetalert2';
import { getUsers } from '@/services/users';

// --- UI COMPONENTS ---

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    destructive: 'bg-rose-50 text-rose-700 border-rose-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-[10px] md:text-xs font-semibold border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

const Card = ({ children, className = '' }) => (
  <div
    className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}
  >
    {children}
  </div>
);

const StatCard = ({ title, value, icon, subtitle, colorClass }) => (
  <Card className="p-5 flex items-start justify-between hover:shadow-md transition-shadow duration-200">
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h3 className="text-2xl font-bold mt-1 text-slate-800">{value}</h3>
      {subtitle && (
        <p className="text-[11px] text-slate-400 mt-1 font-medium">
          {subtitle}
        </p>
      )}
    </div>
    <div className={`p-2.5 rounded-lg ${colorClass} bg-opacity-10`}>{icon}</div>
  </Card>
);

// --- MAIN COMPONENT ---

export default function UserActivityManager() {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // State untuk filter
  const [isFilterOpen, setIsFilterOpen] = useState(false); // State dropdown filter
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ref untuk click outside handler
  const filterRef = useRef(null);

  // Logic Filtering (Search + Status)
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' || user.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const activeUsersCount = users.filter(
    (user) => user.status === 'aktif'
  ).length;
  const inActiveUsersCount = users.filter(
    (user) => user.status === 'ditangguhkan'
  ).length;

  // Data Fetching
  const fetchData = async () => {
    try {
      setLoading(true);
      // Simulasi delay sedikit agar loading state terlihat (opsional)
      // await new Promise(resolve => setTimeout(resolve, 800));

      const userDataResponse = await getUsers();
      setUsers(userDataResponse.data);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Memuat Data',
        text: err.message,
        confirmButtonColor: '#4f46e5',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Close filter dropdown on click outside
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleReload = () => {
    fetchData();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              Manajemen Aktivitas
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Pantau status login dan kelola hak akses pengguna Anda secara
              real-time.
            </p>
          </div>
          <div>
            <button
              onClick={handleReload}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 active:bg-indigo-800 transition shadow-sm disabled:opacity-70 w-full md:w-auto"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <RefreshCcw size={16} />
              )}
              <span>Refresh Data</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Total Pengguna"
            value={users.length}
            icon={<Users className="text-blue-600 w-5 h-5" />}
            colorClass="bg-blue-100"
          />
          <StatCard
            title="Pengguna Aktif"
            value={activeUsersCount}
            icon={<UserCheck className="text-emerald-600 w-5 h-5" />}
            subtitle={`${users.length > 0 ? ((activeUsersCount / users.length) * 100).toFixed(0) : 0}% dari total pengguna`}
            colorClass="bg-emerald-100"
          />
          <StatCard
            title="Ditangguhkan"
            value={inActiveUsersCount}
            icon={<UserX className="text-rose-600 w-5 h-5" />}
            subtitle="Memerlukan peninjauan"
            colorClass="bg-rose-100"
          />
        </div>

        {/* Main Content Card */}
        <Card className="overflow-hidden flex flex-col">
          {/* Toolbar */}
          <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-3 justify-between bg-white items-center">
            {/* Search Input */}
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="Cari nama atau email..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-slate-200 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
              />
            </div>

            {/* Filter Button & Dropdown */}
            <div className="relative w-full md:w-auto" ref={filterRef}>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex w-full md:w-auto items-center justify-between gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${filterStatus !== 'all' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'}`}
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span>
                    {filterStatus === 'all'
                      ? 'Filter Status'
                      : filterStatus === 'aktif'
                        ? 'Status: Aktif'
                        : 'Status: Ditangguhkan'}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown Menu */}
              {isFilterOpen && (
                <div className="absolute right-0 top-full mt-2 w-full md:w-48 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-10 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={() => {
                      setFilterStatus('all');
                      setIsFilterOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700 flex items-center justify-between"
                  >
                    Semua{' '}
                    {filterStatus === 'all' && (
                      <span className="text-indigo-600">✓</span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setFilterStatus('aktif');
                      setIsFilterOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700 flex items-center justify-between"
                  >
                    Aktif{' '}
                    {filterStatus === 'aktif' && (
                      <span className="text-indigo-600">✓</span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setFilterStatus('ditangguhkan');
                      setIsFilterOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700 flex items-center justify-between"
                  >
                    Ditangguhkan{' '}
                    {filterStatus === 'ditangguhkan' && (
                      <span className="text-indigo-600">✓</span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                  <th className="px-6 py-4 whitespace-nowrap">Info Pengguna</th>
                  <th className="px-6 py-4 whitespace-nowrap">Role</th>
                  <th className="px-6 py-4 whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 whitespace-nowrap">
                    Terakhir Terlihat
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  // Skeleton Loading State
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-full animate-pulse" />
                          <div className="space-y-2">
                            <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
                            <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 w-20 bg-slate-100 rounded-full animate-pulse" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 w-16 bg-slate-100 rounded-full animate-pulse" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-8 w-8 bg-slate-100 rounded ml-auto animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : filteredUsers.length > 0 ? (
                  // Data Rows
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-indigo-50 border border-indigo-100 flex-shrink-0">
                            <img
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullname}`}
                              alt={user.fullname}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-slate-900 group-hover:text-indigo-700 transition-colors">
                              {user.fullname}
                            </p>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-slate-500 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3 text-slate-400" />{' '}
                                {user.email}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            user.role === 'super admin' ? 'primary' : 'default'
                          }
                          className="inline-flex items-center gap-1 capitalize"
                        >
                          {user.role === 'super admin' && (
                            <Shield className="w-3 h-3" />
                          )}
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            user.status === 'aktif' ? 'success' : 'destructive'
                          }
                          className="capitalize inline-flex items-center gap-1.5"
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${user.status === 'aktif' ? 'bg-emerald-500' : 'bg-rose-500'}`}
                          ></span>
                          {user.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-medium text-slate-700">
                            {formatDistanceToNow(parseISO(user.last_seen), {
                              addSuffix: true,
                              locale: id,
                            })}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {new Date(user.last_seen).toLocaleDateString(
                              'id-ID',
                              {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  // Empty State
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                          <Search className="w-8 h-8 opacity-50" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">
                          Tidak ada pengguna ditemukan
                        </h3>
                        <p className="text-sm mt-1 max-w-xs mx-auto">
                          Kami tidak dapat menemukan pengguna dengan kata kunci
                          "{searchTerm}"
                          {filterStatus !== 'all' &&
                            ` pada status "${filterStatus}"`}
                          .
                        </p>
                        <button
                          onClick={() => {
                            setSearchTerm('');
                            setFilterStatus('all');
                          }}
                          className="mt-4 text-indigo-600 font-medium text-sm hover:underline"
                        >
                          Hapus Filter & Pencarian
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>
              Menampilkan <strong>{filteredUsers.length}</strong> dari{' '}
              <strong>{users.length}</strong> pengguna
            </p>
            <div className="flex gap-2">
              {/* Pagination Dummy Buttons */}
              <button
                className="px-3 py-1 border rounded bg-white disabled:opacity-50"
                disabled
              >
                Sebelumnya
              </button>
              <button
                className="px-3 py-1 border rounded bg-white disabled:opacity-50"
                disabled
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
