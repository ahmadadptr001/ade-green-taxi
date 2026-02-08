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
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
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

const itemsFeatures = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  {
    title: 'Berita',
    url: '/dashboard/berita',
    icon: Newspaper,
  },
  {
    title: 'Tulis',
    url: '/dashboard/berita/tulis',
    icon: PenLine,
  },
];

export default function AppSidebar({openSidebar, setOpenSidebar}) {
  const [width, setWidth] = useState(0);
  const [pathname, setPathname] = useState('/dashboard');
  useEffect(() => {
    // fungsi untuk update width
    const handleResize = () => setWidth(window.innerWidth);
    // set awal
    handleResize();
    // pasang event listener
    window.addEventListener('resize', handleResize);
    // bersihkan listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);
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
          <SidebarSeparator className={'mb-6'}/>
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
                          ? 'ms-2 flex items-center h-12  gap-2 bg-sky-600/10 !text-sky-700'
                          : 'ms-2 flex items-center gap-2 h-12 !text-gray-500'
                      }
                      onClick={(e) => setPathname(e.target.href)}
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
        <SidebarGroup>
          <SidebarGroupLabel
            className={'text-sm font-bold text-slate-400 mb-3'}
          >
            ADMINISTRATOR
          </SidebarGroupLabel>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
