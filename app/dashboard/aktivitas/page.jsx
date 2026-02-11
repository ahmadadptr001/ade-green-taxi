"use client";

import React, { use, useEffect, useState } from "react";
import { 
  Search, 
  MoreHorizontal, 
  Shield, 
  Smartphone, 
  Mail, 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  Filter,
  Download,
  RefreshCcw
} from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import Swal from "sweetalert2";
import { getUsers } from "@/services/users";

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-slate-900 text-slate-50",
    secondary: "bg-slate-100 text-slate-900",
    outline: "text-slate-950 border border-slate-200",
    destructive: "bg-red-500 text-slate-50",
    success: "bg-green-50 border-green-200 text-green-700 border"
  };
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>{children}</span>;
};

const Card = ({ children, className = "" }) => <div className={`bg-white rounded-xl border shadow-sm ${className}`}>{children}</div>;

export default function UserActivityManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([])
  const filteredUsers = users.filter(user => 
    user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filterActiveUsers = users.filter(user => user.status === 'aktif');
  const filterInActiveUsers = users.filter(user => user.status === 'ditangguhkan');

  const fetchData = async() => {
    try {
      const userDataResponse = await getUsers();
      setUsers(userDataResponse.data);
    } catch (err){
      Swal.fire({
        icon: 'error',
        title: err.message
      })
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  const handleReload = () => {
    fetchData()
  }
  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Manajemen Aktivitas</h1>
            <p className="text-slate-500 text-sm">Pantau status login dan kelola hak akses pengguna Anda.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleReload} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-sm">
              <RefreshCcw size={15}/> Refresh
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard title="Total Pengguna" value={users.length} icon={<Users className="text-blue-600" />} />
          <StatCard title="Pengguna Aktif" value={filterActiveUsers.length} icon={<UserCheck className="text-green-600" />} subtitle={`${filterActiveUsers.length / users.length * 100}% dari total`} />
          <StatCard title="Ditangguhkan" value={filterInActiveUsers.length} icon={<UserX className="text-red-600" />} subtitle="Perlu peninjauan" />
        </div>

        {/* Table Section */}
        <Card className="overflow-hidden">
          {/* Table Toolbar */}
          <div className="p-4 border-b flex flex-col md:flex-row gap-4 justify-between bg-white">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari nama atau email..."
                className="w-full pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-3 py-2 border rounded-md text-sm hover:bg-slate-50">
                <Filter className="w-4 h-4" /> Filter
              </button>
            </div>
          </div>

          {/* Actual Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                  <th className="px-6 py-4">Info Pengguna</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Terakhir Terlihat</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs border border-indigo-200">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullname}`} alt={user.fullname} className="rounded-full w-full h-full object-contain"/>
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-slate-900">{user.fullname}</p>
                          <div className="flex flex-col text-xs text-slate-500 mt-0.5">
                            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {user.email}</span>
                            <span className="flex items-center gap-1"><Smartphone className="w-3 h-3" /> {user.phone}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={user.role === 'super admin' ? 'default' : 'secondary'} className="flex w-fit items-center gap-1 italic">
                        {user.role === 'super admin' && <Shield className="w-3 h-3" />}
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={user.status === 'aktif' ? 'success' : 'destructive'}>
                        {user.status === 'aktif' ? '🟢 Aktif' : '🔴 Ditangguhkan'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-medium text-slate-700">
                          {formatDistanceToNow(parseISO(user.last_seen), { addSuffix: true, locale: id })}
                        </p>
                        <p className="text-[11px] text-slate-400 uppercase tracking-tighter">
                          {new Date(user.last_seen).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 bg-slate-50 border-t text-center">
            <p className="text-xs text-slate-400">Menampilkan {filteredUsers.length} dari {users.length} pengguna terdaftar</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, subtitle }) {
  return (
    <Card className="p-5 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        {subtitle && <p className="text-[11px] text-slate-400 mt-1 font-medium italic">{subtitle}</p>}
      </div>
      <div className="p-2 bg-slate-50 rounded-lg">
        {icon}
      </div>
    </Card>
  );
}