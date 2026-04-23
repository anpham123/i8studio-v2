"use client";

import { Menu } from "lucide-react";
import { useSession } from "next-auth/react";

interface AdminHeaderProps {
  title: string;
  onOpenMobile: () => void;
  actions?: React.ReactNode;
}

export default function AdminHeader({ title, onOpenMobile, actions }: AdminHeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center gap-4 px-6 h-16">
        {/* Mobile menu toggle */}
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
        >
          <Menu size={20} />
        </button>

        <h1 className="text-lg font-semibold text-gray-900 flex-1">{title}</h1>

        {actions && <div className="flex items-center gap-2">{actions}</div>}

        {/* User info */}
        <div className="flex items-center gap-3 pl-3 border-l border-gray-100">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
            {session?.user?.name?.[0] || "A"}
          </div>
          <span className="hidden sm:block text-sm font-medium text-gray-700">
            {session?.user?.name || "Admin"}
          </span>
        </div>
      </div>
    </header>
  );
}
