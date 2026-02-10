'use client';
import {
  AlertTriangle,
  Bookmark,
  ChevronRight,
  ChevronsUpDown,
  Cog,
  FileText,
  FolderTree,
  Hash,
  Heart,
  Key,
  LayoutDashboard,
  LogOut,
  MapPinned,
  Newspaper,
  PenBox,
  PenLine,
  PrinterCheck,
  ReceiptText,
  Route,
  Settings,
  ShieldCheck,
  ShieldUser,
  Tag,
  Tags,
  Text,
  Trash2,
  User,
  User2,
  UserPlus,
  Users,
  Users2,
  WholeWord,
  Zap,
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
  SidebarSeparator,
} from '../ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Tooltip, TooltipTrigger } from '../ui/tooltip';
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
    title: 'Tulis Berita',
    url: '/dashboard/berita/tulis',
    icon: PenLine,
  },
  {
    title: 'Pesan Highlight',
    url: '/dashboard/berita/pesan',
    icon: Zap,
  },
  {
    title: 'Kelola Tag',
    url: '/dashboard/berita/tag',
    icon: Hash,
  },
  {
    title: 'Kelola Kategori',
    url: '/dashboard/berita/kategori',
    icon: FolderTree,
  },
  {
    title: 'Kelola Topik',
    url: '/dashboard/berita/topik',
    icon: FileText,
  }
];

const itemFeaturesSuperAdmin = [
  {
    title: 'Manajemen Pengguna',
    url: '/dashboard/pengguna',
    icon: Users2,
  },
];

export default function AppSidebar() {
  const user = useUser();
  const role = user?.role;
  const status = user?.status;
  const router = useRouter();
  const [width, setWidth] = useState(0);
  const [pathname, setPathname] = useState('');
  const [fullname, setFullname] = useState(user?.fullname);
  const [newPassword, setNewPassword] = useState(user?.password);
  const [confirmNewPassword, setConfirmNewPassword] = useState(user?.password);

  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    if (!role) {
      setMounted(false);
      return;
    }
  }, [mounted]);

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
        router.replace('/berita');
      }
    });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!newPassword || !confirmNewPassword) {
      Swal.fire({
        icon: 'error',
        text: 'Kolom tidak boleh kosong',
      });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Swal.fire({
        icon: 'error',
        text: 'Password tidak sama',
      });
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
      Swal.fire({
        icon: 'error',
        text: 'Kolom tidak boleh kosong',
      });
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
                  className="bg-blue-500 text-white ms-2 p-2 rounded-md"
                />
              </span>
              <div className="me-auto leading-4">
                <p className="font-extrabold text-lg">
                  ADE<span className="text-emerald-600">GREEN</span>
                  <span className="">PANEL</span>
                </p>
                <small className="text-[.7rem] text-sky-600 font-semibold">
                  MANAGEMENT SYSTEM
                </small>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className={'pe-2'}>
        <SidebarGroup>
          <SidebarSeparator className={'mb-6'} />
          <SidebarGroupLabel
            className={'text-sm font-bold text-slate-400 mb-3'}
          >
            PENGUNJUNG
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-3">
              {itemFeaturesPengunjung.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={
                      'hover:bg-gray-100 !text-black !my-0 !font-semibold'
                    }
                  >
                    <Link
                      href={item.url}
                      className={
                        pathname === item.url
                          ? 'ms-2 flex items-center h-12  gap-2 active:!bg-sky-600/10 bg-sky-600/10 !text-sky-700'
                          : 'ms-2 flex items-center gap-2 h-12 !text-gray-500 active:!bg-sky-600/10'
                      }
                      onClick={() => setPathname(item.url)}
                    >
                      <div className="flex items-center justify-between gap-2 w-full">
                        <div className="flex items-center gap-2">
                          <item.icon size={20} />
                          <span className="line-clamp-1">{item.title}</span>
                        </div>
                        {pathname == item.url && (
                          <div className="w-2 h-2 rounded-full bg-sky-600"></div>
                        )}
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className={role === 'pengunjung' ? 'hidden' : ''}>
          <SidebarGroupLabel
            className={'text-sm font-bold text-slate-400 mb-3'}
          >
            ADMINISTRATOR
          </SidebarGroupLabel>
          <SidebarGroupContent
            className={`pe-2 ${role === 'admin' || role === 'super admin' ? '' : 'hidden'}`}
          >
            <SidebarMenu>
              {itemFeaturesAdmin.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={
                      'hover:bg-gray-100 !text-black !my-0 !font-semibold'
                    }
                  >
                    <Link
                      href={item.url}
                      className={
                        pathname === item.url
                          ? 'ms-2 flex items-center h-12  gap-2 active:!bg-sky-600/10 bg-sky-600/10 !text-sky-700'
                          : 'ms-2 flex items-center gap-2 h-12 !text-gray-500 active:!bg-sky-600/10'
                      }
                      onClick={() => setPathname(item.url)}
                    >
                      <div className="flex items-center justify-between gap-2 w-full">
                        <div className="flex items-center gap-2">
                          <item.icon size={20} />
                          <span className="line-clamp-1">{item.title}</span>
                        </div>
                        {pathname == item.url && (
                          <div className="w-2 h-2 rounded-full bg-sky-600"></div>
                        )}
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup
          className={role === 'admin' || role === 'pengunjung' ? 'hidden' : ''}
        >
          <SidebarGroupLabel
            className={'text-sm font-bold text-slate-400 mb-3'}
          >
            SUPER ADMINISTRATOR
          </SidebarGroupLabel>
          <SidebarGroupContent className={'pe-2'}>
            <SidebarMenu>
              {itemFeaturesSuperAdmin.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={
                      'hover:bg-gray-100 !text-black !my-0 !font-semibold'
                    }
                  >
                    <Link
                      href={item.url}
                      className={
                        pathname === item.url
                          ? 'ms-2 flex items-center h-12  gap-2 active:!bg-sky-600/10 bg-sky-600/10 !text-sky-700'
                          : 'ms-2 flex items-center gap-2 h-12 !text-gray-500 active:!bg-sky-600/10'
                      }
                      onClick={() => setPathname(item.url)}
                    >
                      <div className="flex items-center justify-between gap-2 w-full">
                        <div className="flex items-center gap-2">
                          <item.icon size={20} />
                          <span className="line-clamp-1">{item.title}</span>
                        </div>
                        {pathname == item.url && (
                          <div className="w-2 h-2 rounded-full bg-sky-600"></div>
                        )}
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="rounded-md border bg-gray-50 p-3">
              <div className="flex items-center mb-3">
                <img
                  className="w-10 h-10 rounded-full border border-slate-200 bg-white"
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullname.replace(' ', '+')}`}
                  alt={`avatar-${user?.fullname}`}
                />
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-bold truncate line-clamp-1">
                    {user?.fullname}
                  </p>
                  <p className="text-xs text-blue-600 font-medium capitalize flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-shield"
                      aria-hidden="true"
                    >
                      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                    </svg>
                    {user?.role}
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="w-full">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-slate-50 text-slate-600 hover:text-sky-600 border border-slate-200 hover:border-red-200 py-2 rounded-lg transition-all text-sm font-medium"
                  >
                    <Settings size={15} />
                    <span className="line-clamp-1"> Pengaturan</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={'max-w-sm mx-2'}>
                  <div className="px-2 py-2">
                    <DropdownMenuLabel className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                      Pengaturan Akun
                    </DropdownMenuLabel>
                  </div>

                  <DropdownMenuGroup className="space-y-1">
                    {/* SUBMENU: UBAH NAMA */}
                    <DropdownMenu>
                      <DropdownMenuTrigger className="px-3 py-2.5 w-full rounded-md cursor-pointer focus:bg-slate-50">
                        <div className="flex items-center">
                          <div className="p-1.5 bg-blue-50 rounded-md mr-3">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium">Ubah Nama</span>
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="p-3 w-64 ml-2 shadow-xl border-slate-100">
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <p className="text-[12px] font-medium text-slate-500">
                              Nama Lengkap Baru
                            </p>
                            <Input
                              value={fullname}
                              onChange={(e) => setFullname(e.target.value)}
                              className="h-8 text-sm focus-visible:ring-blue-400"
                            />
                          </div>
                          <Button
                            onClick={handleChangeUsername}
                            size="sm"
                            className="w-full h-8 bg-blue-600 hover:bg-blue-700 text-xs"
                          >
                            Simpan Perubahan
                          </Button>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* SUBMENU: UBAH PASSWORD */}
                    <DropdownMenu>
                      <DropdownMenuTrigger className="px-3 w-full py-2.5 rounded-md cursor-pointer focus:bg-slate-50">
                        <div className="flex items-center">
                          <div className="p-1.5 bg-purple-50 rounded-md mr-3">
                            <Key className="h-4 w-4 text-purple-600" />
                          </div>
                          <span className="text-sm font-medium">
                            Ganti Password
                          </span>
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="p-3 w-72 ml-2 shadow-xl border-slate-100">
                        <form className="space-y-3">
                          <div className="space-y-1.5">
                            <Input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Password Baru"
                              className="h-8 text-sm"
                            />
                            <Input
                              type="password"
                              value={confirmNewPassword}
                              onChange={(e) =>
                                setConfirmNewPassword(e.target.value)
                              }
                              placeholder="Konfirmasi Password Baru"
                              className="h-8 text-sm"
                            />
                          </div>
                          <Button
                            type="submit"
                            onClick={handleChangePassword}
                            size="sm"
                            className="w-full h-8 bg-purple-600 hover:bg-purple-700 text-xs"
                          >
                            Perbarui Password
                          </Button>
                        </form>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator className="my-2" />

                  {/* SUBMENU: HAPUS AKUN (DANGER ZONE) */}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-full px-3 py-2.5 rounded-md cursor-pointer focus:bg-red-50 group">
                      <div className="flex items-center w-full">
                        <div className="p-1.5 bg-slate-100 group-hover:bg-red-100 rounded-md mr-3 transition-colors">
                          <Trash2 className="h-4 w-4 text-slate-500 group-hover:text-red-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-700 group-hover:text-red-700">
                          Hapus Akun
                        </span>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      sideOffset={4}
                      className="p-4 w-64 ml-2 shadow-2xl border-red-100"
                    >
                      <div className="text-center space-y-3">
                        <div className="mx-auto w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-slate-900">
                            Apakah anda yakin?
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Tindakan ini permanen dan tidak bisa dibatalkan.
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={handleDeleteAccount}
                          variant="destructive"
                          className="w-full h-8 text-xs font-bold"
                        >
                          Ya, Hapus Permanen
                        </Button>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </DropdownMenuContent>
              </DropdownMenu>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 border border-slate-200 hover:border-red-200 py-2 rounded-lg transition-all text-sm font-medium"
              >
                <LogOut size={15} />
                <span className="line-clamp-1"> Keluar</span>
              </button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
