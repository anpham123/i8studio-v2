"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { signOut } from "next-auth/react";
import {
  LayoutDashboard, FileText, Image, Wrench, MessageSquare, Handshake,
  BookOpen, HelpCircle, Play, BookOpenCheck, Mail, Users, Folder,
  Settings, LogOut, X, ChevronRight,
} from "lucide-react";

const menuItems = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboard, exact: true },
  { href: "/admin/posts", label: "Bài đăng", icon: FileText },
  { href: "/admin/works", label: "Works", icon: Image },
  { href: "/admin/services", label: "Dịch vụ", icon: Wrench },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { href: "/admin/partners", label: "Đối tác", icon: Handshake },
  { href: "/admin/case-studies", label: "Case Studies", icon: BookOpen },
  { href: "/admin/qa", label: "Q&A", icon: HelpCircle },
  { href: "/admin/slides", label: "Slides", icon: Play },
  { href: "/admin/flipbooks", label: "Flipbooks", icon: BookOpenCheck },
  { href: "/admin/contacts", label: "Liên hệ", icon: Mail },
  { href: "/admin/subscribers", label: "Subscribers", icon: Users },
  { href: "/admin/media", label: "Media", icon: Folder },
  { href: "/admin/settings", label: "Cài đặt", icon: Settings },
];

interface SidebarProps {
  unreadContacts?: number;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({ unreadContacts = 0, mobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <span className="text-lg font-bold text-white">i8 STUDIO</span>
        <p className="text-slate-400 text-xs mt-0.5">Admin Panel</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        {menuItems.map((item) => {
          const active = isActive(item.href, item.exact);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group ${
                active
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} className="shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.href === "/admin/contacts" && unreadContacts > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {unreadContacts > 99 ? "99+" : unreadContacts}
                </span>
              )}
              {active && <ChevronRight size={14} className="opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-all"
        >
          <LogOut size={18} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] bg-slate-800 fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/50" onClick={onCloseMobile} />
          <aside className="relative w-[260px] bg-slate-800 flex flex-col">
            <button
              onClick={onCloseMobile}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
