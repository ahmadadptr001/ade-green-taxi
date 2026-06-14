import { Command } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";

export default function CustomSidebarTrigger() {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-slate-600 hover:bg-slate-100" />
        <div className="hidden h-5 w-px bg-slate-200 sm:block" />
        <span className="hidden text-sm font-medium text-slate-500 sm:block">
          Panel Manajemen
        </span>
      </div>
      <kbd className="hidden items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-400 sm:flex">
        <Command className="h-3 w-3" /> B
      </kbd>
    </header>
  );
}
