import { BluetoothIcon, Command } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";

export default function CustomSidebarTrigger() {
  return (
    <header className="flex items-center gap-2 w-full bg-white sticky top-0 z-30">
      <SidebarTrigger />
      <p className="font-bold sm:text-sm line-clamp-1 text-[.7rem]">Tekan untuk menutup/membuka sidebar</p>
      <div className="flex items-center p-0 px-2 sm:px-3 gap-1 rounded-full bg-gray-200 sm:p-1">
      <Command className="w-2 h-2 sm:w-4 sm:h-4"/>
      <span className="font-bold text-[.65rem] sm:text-sm">+ B</span>
      </div>
    </header>
  )
}