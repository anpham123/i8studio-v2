"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import AdminHeader from "./AdminHeader";
import { Loader2 } from "lucide-react";

interface AdminShellProps {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export default function AdminShell({ title, actions, children }: AdminShellProps) {
  const { status } = useSession();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
  }, [status, router]);

  useEffect(() => {
    fetch("/api/contacts")
      .then((r) => r.json())
      .then((d) => setUnread(d.data?.filter((c: { read: boolean }) => !c.read).length || 0))
      .catch(() => {});
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 size={32} className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        unreadContacts={unread}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="lg:ml-[260px]">
        <AdminHeader
          title={title}
          onOpenMobile={() => setMobileOpen(true)}
          actions={actions}
        />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
