'use client'
import AppSidebar from '@/components/dashboard/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useEffect, useState } from 'react';
import CustomSidebarTrigger from './CustomSidebarTrigger';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';


export default function LayoutSidebar({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(()=> {
    const dataLocalUser = localStorage.getItem('user');
    if (!dataLocalUser) {
      Swal.fire({
        icon: 'warning',
        text: 'Silahkan login ke akun Anda terlebih dahulu',
        confirmButtonText: 'Login',
        cancelButtonText: 'Kembali',
        showCancelButton: true
      }).then(result => {
        if (result.isConfirmed) {
          router.replace('/masuk');
        } else {
          router.replace('/berita')
        }
        return
      })
    }
    setUser(dataLocalUser);
  }, [])
  return (
    <SidebarProvider>
      <AppSidebar/>
      <main className='w-full'>
        <CustomSidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
