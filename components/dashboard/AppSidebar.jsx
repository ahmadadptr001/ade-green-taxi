'use client';

import {
  AlertTriangle,
  Bookmark,
  ChevronRight,
  ChevronsUpDown,
  FileText,
  FolderTree,
  Hash,
  Heart,
  Key,
  LogOut,
  Newspaper,
  PenLine,
  ShieldUser,
  Trash2,
  User,
  Zap,
  Users2,
  LayoutDashboardIcon,
  Activity,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from '../ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { changePassword, changeUsername } from '@/services/auth';
import { deleteUser } from '@/services/users';

const itemFeaturesPengunjung = [
  {
    title: 'Feed Berita',
    url: '/dashboard/berita',
    icon: Newspaper,
  },
  {
    title: 'Favorit',
    url: '/dashboard/disukai',
    icon: Heart,
  },
  {
    title: 'Disimpan',
    url: '/dashboard/disimpan',
    icon: Bookmark,
  },
];

const itemFeaturesAdmin = [
  {
    title: 'Dashboard',
    icon: LayoutDashboardIcon,
    url: '/dashboard/',
  },
  {
    title: 'Manajemen Konten',
    icon: Newspaper,
    items: [
      { title: 'Tulis Berita', url: '/dashboard/berita/tulis', icon: PenLine },
      {
        title: 'Kelola Berita',
        url: '/dashboard/berita/kelola',
        icon: FileText,
      },
      { title: 'Pesan Highlight', url: '/dashboard/berita/pesan', icon: Zap },
    ],
  },
  {
    title: 'Taksonomi',
    icon: FolderTree,
    items: [
      // Ini Child-nya
      { title: 'Kelola Tag', url: '/dashboard/berita/tag', icon: Hash },
      {
        title: 'Kelola Kategori',
        url: '/dashboard/berita/kategori',
        icon: FolderTree,
      },
      { title: 'Kelola Topik', url: '/dashboard/berita/topik', icon: FileText },
    ],
  },
];

const itemFeaturesSuperAdmin = [
  {
    title: 'Manajemen Pengguna',
    url: '/dashboard/pengguna',
    icon: Users2,
  },
  {
    title: 'Aktivitas Pengguna',
    url: '/dashboard/aktivitas',
    icon: Activity,
  },
];

export default function AppSidebar() {
  const user = useUser();
  const role = user?.role;
  const router = useRouter();

  const [width, setWidth] = useState(0);
  const [pathname, setPathname] = useState('');
  const [fullname, setFullname] = useState(user?.fullname);
  // Jangan seed dari user.password (kini berisi hash, bukan password asli).
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    if (!role) {
      setMounted(false);
      return;
    }
  }, [role]);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    Swal.fire({
      icon: 'question',
      text: 'Anda yakin ingin keluar?',
      showCancelButton: true,
      target: document.body,
      customClass: {
        container: 'swal-portal',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        router.replace('/berita');
      }
    });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!newPassword || !confirmNewPassword) {
      Swal.fire({ icon: 'error', text: 'Kolom tidak boleh kosong' });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Swal.fire({ icon: 'error', text: 'Password tidak sama' });
      return;
    }

    Swal.fire({
      icon: 'info',
      title: 'Mohon tunggu...',
      didOpen: () => Swal.showLoading(),
    });

    try {
      const result = await changePassword(user?.id, newPassword);
      Swal.fire({
        icon: 'success',
        text: result.message,
        didOpen: () => Swal.hideLoading(),
      });
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        text: err.message,
        didOpen: () => Swal.hideLoading(),
      });
    }
  };

  const handleChangeUsername = async () => {
    if (!user) return;
    if (!fullname) {
      Swal.fire({ icon: 'error', text: 'Kolom tidak boleh kosong' });
      return;
    }

    Swal.fire({
      icon: 'info',
      title: 'Mohon tunggu...',
      didOpen: () => Swal.showLoading(),
    });

    try {
      const result = await changeUsername(user?.id, fullname);
      Swal.fire({
        icon: 'success',
        text: result.message,
        didOpen: () => Swal.hideLoading(),
      }).then((res) => {
        if (res.isConfirmed) {
          setFullname('');
          localStorage.setItem('user', JSON.stringify(result?.user));
          window.location.reload();
        }
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        text: err.message,
        didOpen: () => Swal.hideLoading(),
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    Swal.fire({
      icon: 'info',
      title: 'Mohon tunggu...',
      didOpen: () => Swal.showLoading(),
    });

    try {
      const result = await deleteUser(user?.id);
      Swal.fire({
        icon: 'success',
        text: result.message,
        didOpen: () => Swal.hideLoading(),
      }).then((res) => {
        if (res.isConfirmed) {
          setFullname('');
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          window.location.replace('/berita');
        }
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        text: 'Gagal menghapus akun!',
        didOpen: () => Swal.hideLoading(),
      });
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className={'pe-2'}>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center py-2 gap-3 overflow-hidden">
              <span className="text-left me-1">
                <ShieldUser
                  size={45}
                  className="bg-emerald-600 text-white ms-2 p-2 rounded-md"
                />
              </span>
              <div className="me-auto leading-4">
                <p className="font-display font-medium text-base">
                  Ade<span className="text-emerald-600">Green</span>
                  <span className="text-slate-400"> Panel</span>
                </p>
                <small className="text-[.7rem] text-emerald-600 font-semibold">
                  MANAGEMENT SYSTEM
                </small>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="pe-2">
        {/* GROUP PENGUNJUNG (Single Level) */}
        <SidebarGroup>
          <SidebarSeparator className="mb-6" />
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            PENGUNJUNG
          </SidebarGroupLabel>
          <SidebarMenu className="gap-2">
            {itemFeaturesPengunjung.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className="hover:bg-emerald-50 active:bg-emerald-50 active:text-slate-900 hover:text-slate-900 text-slate-900 !font-semibold"
                >
                  <Link
                    href={item.url}
                    onClick={() => setPathname(item.url)}
                    className={
                      pathname === item.url
                        ? 'text-emerald-700 bg-emerald-600/10'
                        : 'text-gray-500'
                    }
                  >
                    <item.icon size={20} />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* GROUP ADMINISTRATOR (Parent-Child Level) */}
        <SidebarGroup className={role === 'pengunjung' ? 'hidden' : ''}>
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            ADMINISTRATOR
          </SidebarGroupLabel>
          <SidebarMenu>
            {itemFeaturesAdmin.map((parent) => (
              <Collapsible
                key={parent.title}
                asChild
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    {parent.items ? (
                      <SidebarMenuButton
                        tooltip={parent.title}
                        className="hover:bg-emerald-50 active:bg-emerald-50 active:text-slate-900 hover:text-slate-900 !font-semibold"
                      >
                        <parent.icon size={20} />
                        <span>{parent.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton
                        asChild
                        className="hover:bg-emerald-50 active:bg-emerald-50 active:text-slate-900 hover:text-slate-900 text-slate-900 !font-semibold"
                      >
                        <Link
                          href={parent.url}
                          onClick={() => setPathname(parent.url)}
                          className={
                            pathname === parent.url
                              ? 'text-emerald-700 bg-emerald-600/10'
                              : 'text-gray-500'
                          }
                        >
                          <parent.icon size={20} />
                          <span>{parent.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {parent.items &&
                        parent.items.map((child) => (
                          <SidebarMenuSubItem key={child.title}>
                            <SidebarMenuSubButton
                              asChild
                              className="hover:bg-emerald-50 active:bg-emerald-50 text-gray-600 active:text-slate-900 hover:text-slate-900"
                            >
                              <Link
                                href={child.url}
                                onClick={() => setPathname(child.url)}
                                className={
                                  pathname === child.url
                                    ? 'text-emerald-700 font-medium'
                                    : 'text-gray-500'
                                }
                              >
                                <span>{child.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* GROUP SUPER ADMIN */}
        <SidebarGroup className={role !== 'super admin' ? 'hidden' : ''}>
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            SUPER ADMIN
          </SidebarGroupLabel>
          <SidebarMenu>
            {itemFeaturesSuperAdmin.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className="hover:bg-emerald-50 hover:text-slate-900 !font-semibold"
                >
                  <Link href={item.url} onClick={() => setPathname(item.url)}>
                    <item.icon size={20} />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="pb-2 px-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:text-sidebar-accent-foreground hover:bg-slate-100/80 hover:text-slate-900 transition-all duration-300 ease-in-out active:bg-gray-100 border border-transparent hover:border-green-200 rounded-xl"
                >
                  <div className="h-9 w-9 rounded-lg border-2 border-white/50 shadow-sm overflow-hidden transition-transform duration-300 group-hover:scale-105">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullname?.replace(' ', '+')}`}
                      alt={user?.fullname}
                      className="h-full w-full object-cover bg-slate-50"
                    />
                  </div>
                  <div className="grid flex-1 text-left leading-tight ml-1">
                    <span className="truncate font-medium text-[13px] text-slate-800">
                      {user?.fullname}
                    </span>
                    <span className="truncate text-[11px] font-medium text-slate-500 capitalize flex items-center gap-1">
                      {user?.role}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 text-slate-400/70 group-hover:text-slate-600 transition-colors" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-60 rounded-xl p-1.5 mb-2 bg-white/85 backdrop-blur-xl shadow-2xl border-white/20 ring-1 ring-black/5"
                side="bottom"
                align="end"
                sideOffset={8}
              >
                <DropdownMenuLabel className="p-0 font-normal mb-1">
                  <div className="flex items-center gap-3 px-2 py-2.5 text-left text-sm bg-gradient-to-br from-slate-50/50 to-transparent rounded-lg border border-white/40">
                    <div className="h-10 w-10 rounded-full border-2 border-white shadow-sm overflow-hidden">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullname?.replace(' ', '+')}`}
                        alt={user?.fullname}
                        className="h-full w-full bg-slate-50"
                      />
                    </div>
                    <div className="grid flex-1 text-left leading-tight">
                      <span className="truncate font-medium text-sm text-slate-900">
                        {user?.fullname}
                      </span>
                      <span className="truncate text-xs text-slate-500 font-medium">
                        {user?.email || user?.role}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-slate-200/50 mx-1 my-1.5" />

                <DropdownMenuGroup className="px-1">
                  <DropdownMenuLabel className="text-[10px] font-medium text-slate-400/80 tracking-wide px-2 py-1.5">
                    Pengaturan Akun
                  </DropdownMenuLabel>

                  {/* SUBMENU: UBAH NAMA */}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex w-full cursor-pointer select-none items-center rounded-lg px-2 py-2 text-[13px] font-medium outline-none text-slate-600 hover:bg-emerald-50/50 hover:text-emerald-700 focus:bg-emerald-50/50 focus:text-emerald-700 transition-colors data-[state=open]:bg-emerald-50/50 data-[state=open]:text-emerald-700">
                      <div className="mr-3 p-1 rounded-md bg-emerald-100/50 text-emerald-600">
                        <User className="h-3.5 w-3.5" />
                      </div>
                      <span>Ubah Nama</span>
                      <ChevronRight className="ml-auto h-4 w-4 text-slate-300" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="p-3 w-64 ml-2 shadow-2xl border-white/20 ring-1 ring-black/5 bg-white/90 backdrop-blur-xl rounded-xl">
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <p className="text-[12px] font-semibold text-slate-700">
                            Nama Lengkap Baru
                          </p>
                          <Input
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            className="h-9 text-sm bg-white/50 focus-visible:ring-emerald-400/50 border-slate-200/80 rounded-lg"
                            placeholder="Masukkan nama..."
                          />
                        </div>
                        <Button
                          onClick={handleChangeUsername}
                          size="sm"
                          className="w-full h-9 bg-emerald-600 hover:bg-emerald-700 text-xs font-medium rounded-lg transition-colors"
                        >
                          Simpan Perubahan
                        </Button>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* SUBMENU: UBAH PASSWORD */}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex w-full cursor-pointer select-none items-center rounded-lg px-2 py-2 text-[13px] font-medium outline-none text-slate-600 hover:bg-slate-50/50 hover:text-slate-700 focus:bg-slate-50/50 focus:text-slate-700 transition-colors data-[state=open]:bg-slate-50/50 data-[state=open]:text-slate-700">
                      <div className="mr-3 p-1 rounded-md bg-slate-100/50 text-slate-600">
                        <Key className="h-3.5 w-3.5" />
                      </div>
                      <span>Ganti Password</span>
                      <ChevronRight className="ml-auto h-4 w-4 text-slate-300" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="p-3 w-72 ml-2 shadow-2xl border-white/20 ring-1 ring-black/5 bg-white/90 backdrop-blur-xl rounded-xl">
                      <div className="mb-2">
                        <p className="text-[12px] font-semibold text-slate-700">
                          Keamanan
                        </p>
                      </div>
                      <form
                        className="space-y-3"
                        onSubmit={(e) => e.preventDefault()}
                      >
                        <div className="space-y-2">
                          <Input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Password Baru"
                            className="h-9 text-sm bg-white/50 focus-visible:ring-slate-400/50 border-slate-200/80 rounded-lg"
                          />
                          <Input
                            type="password"
                            value={confirmNewPassword}
                            onChange={(e) =>
                              setConfirmNewPassword(e.target.value)
                            }
                            placeholder="Konfirmasi Password Baru"
                            className="h-9 text-sm bg-white/50 focus-visible:ring-slate-400/50 border-slate-200/80 rounded-lg"
                          />
                        </div>
                        <Button
                          type="submit"
                          onClick={handleChangePassword}
                          size="sm"
                          className="w-full h-9 bg-slate-900 hover:bg-slate-800 text-xs font-medium rounded-lg transition-colors"
                        >
                          Perbarui Password
                        </Button>
                      </form>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="bg-slate-200/50 mx-1 my-1.5" />

                <DropdownMenuGroup className="px-1">
                  <DropdownMenuLabel className="text-[10px] font-medium text-red-400/80 tracking-wide px-2 py-1.5">
                    Area Berbahaya
                  </DropdownMenuLabel>
                  {/* SUBMENU: HAPUS AKUN */}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex w-full cursor-pointer select-none items-center rounded-lg px-2 py-2 text-[13px] font-medium outline-none text-slate-600 hover:bg-red-50/50 hover:text-red-700 focus:bg-red-50/50 focus:text-red-700 transition-colors data-[state=open]:bg-red-50/50 data-[state=open]:text-red-700 group">
                      <div className="mr-3 p-1 rounded-md bg-slate-100/80 text-slate-500 group-hover:bg-red-100/50 group-hover:text-red-600 transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </div>
                      <span>Hapus Akun</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      sideOffset={4}
                      className="p-4 w-64 ml-2 shadow-[0_20px_60px_-15px_rgba(239,68,68,0.3)] border-red-100/50 ring-1 ring-red-500/10 bg-white/95 backdrop-blur-xl rounded-xl"
                    >
                      <div className="text-center space-y-4">
                        <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center border-4 border-red-50/50 shadow-inner">
                          <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-sm font-medium text-slate-900 leading-tight">
                            Hapus Akun Permanen?
                          </p>
                          <p className="text-[11px] text-slate-500 leading-normal px-2">
                            Tindakan ini tidak bisa dibatalkan. Semua data Anda
                            akan hilang.
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={handleDeleteAccount}
                          variant="destructive"
                          className="w-full h-9 text-xs font-medium rounded-lg shadow-lg shadow-red-500/20 hover:shadow-red-500/40"
                        >
                          Ya, Hapus Sekarang
                        </Button>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="bg-slate-200/50 mx-1 my-1.5" />

                <div className="px-1 pb-1">
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer group flex items-center rounded-lg px-2 py-2 text-[13px] font-medium outline-none text-slate-600 hover:bg-red-50/80 hover:text-red-700 focus:bg-red-50/80 focus:text-red-700 transition-all"
                  >
                    <div className="mr-3 p-1 rounded-md bg-slate-100/50 text-slate-500 group-hover:bg-red-100/50 group-hover:text-red-600 transition-colors">
                      <LogOut className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-semibold">Keluar</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
