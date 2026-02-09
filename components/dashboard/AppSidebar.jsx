'use client';
import {
  ChevronsUpDown,
  LayoutDashboard,
  MapPinned,
  Newspaper,
  PenBox,
  PenLine,
  ReceiptText,
  Route,
  Settings,
  ShieldUser,
  User2,
  UserPlus,
  Users,
  Users2,
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
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Tooltip, TooltipTrigger } from '../ui/tooltip';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

export default function AppSidebar() {
  const user = useUser();
  const role = user?.role;
  const status = user?.status;
  const router = useRouter();
  const [width, setWidth] = useState(0);
  const [pathname, setPathname] = useState('');
  const [itemsFeatures, setItemsFeatures] = useState([
    { title: 'Dashboard Utama', url: '/dashboard', icon: LayoutDashboard },
    {
      title: 'Feed Berita',
      url: '/dashboard/berita',
      icon: Newspaper,
    },
    {
      title: 'Tulis Berita',
      url: '/dashboard/berita/tulis',
      icon: PenLine,
    },
  ]);
  // filteer item features berdasarkan role
  const [mounted, setMounted] = useState(true)
  useEffect(() => {
    if (!role) {setMounted(false);return}
    if (role === 'pengunjung') {
      setItemsFeatures([
        {
          title: 'Feed Berita',
          url: '/dashboard/berita',
          icon: Newspaper,
        },
      ]);
      router.replace('/dashboard/berita')
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
          <SidebarGroupContent>
            <SidebarMenu className="gap-3">
              {itemsFeatures.map((item) => (
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
            ADMINISTRATOR
          </SidebarGroupLabel>
          <SidebarGroupContent className={'pe-2'}>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={
                    'hover:bg-gray-100 !text-black !my-0 !font-semibold'
                  }
                >
                  <Link
                    href="/dashboard/pengguna"
                    className={
                      pathname === '/dashboard/pengguna'
                        ? 'ms-2 flex items-center h-12  gap-2 bg-sky-600/10 !text-sky-700 active:!bg-sky-600/10'
                        : 'ms-2 flex items-center gap-2 h-12 !text-gray-500 active:!bg-sky-600/10'
                    }
                    onClick={() => setPathname('/dashboard/pengguna')}
                  >
                    <div className="flex items-center justify-between gap-2 w-full">
                      <div className="flex items-center gap-2">
                        <Users2 size={20} />
                        <span className="line-clamp-1">Management User</span>
                      </div>
                      {pathname == '/dashboard/pengguna' && (
                        <div className="w-2 h-2 rounded-full bg-sky-600"></div>
                      )}
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
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
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 hover:border-red-200 py-2 rounded-lg transition-all text-sm font-medium"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-log-out"
                  aria-hidden="true"
                >
                  <path d="m16 17 5-5-5-5"></path>
                  <path d="M21 12H9"></path>
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                </svg>
                <span className="line-clamp-1"> Keluar</span>
              </button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
