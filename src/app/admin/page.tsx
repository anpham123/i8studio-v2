"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import StatsCard from "@/components/admin/StatsCard";
import { FileText, Image, Mail, Users, Plus, Eye, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Contact {
  id: string;
  fullName: string;
  email: string;
  service: string;
  read: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ posts: 0, works: 0, contacts: 0, unread: 0, subscribers: 0 });
  const [recentContacts, setRecentContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/posts?limit=1").then((r) => r.json()),
      fetch("/api/works?limit=1").then((r) => r.json()),
      fetch("/api/contacts").then((r) => r.json()),
      fetch("/api/subscribers").then((r) => r.json()),
    ]).then(([posts, works, contacts, subs]) => {
      const unread = contacts.data?.filter((c: Contact) => !c.read).length || 0;
      setStats({
        posts: posts.total || 0,
        works: works.total || 0,
        contacts: contacts.data?.length || 0,
        unread,
        subscribers: subs.data?.length || 0,
      });
      setRecentContacts((contacts.data || []).slice(0, 5));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <AdminShell
      title="Tổng quan"
      actions={
        <Link href="/admin/posts/new" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
          <Plus size={16} /> Tạo bài mới
        </Link>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatsCard title="Tổng bài đăng" value={stats.posts} icon={FileText} color="blue" />
        <StatsCard title="Tổng Works" value={stats.works} icon={Image} color="purple" />
        <StatsCard title="Liên hệ mới" value={stats.unread} icon={Mail} color="orange" badge={stats.unread} />
        <StatsCard title="Subscribers" value={stats.subscribers} icon={Users} color="green" />
      </div>

      {/* Recent contacts */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Liên hệ gần đây</h2>
          <Link href="/admin/contacts" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Xem tất cả →
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="px-6 py-8 text-center text-gray-400 text-sm">Đang tải...</div>
          ) : recentContacts.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-400 text-sm">Chưa có liên hệ nào</div>
          ) : (
            recentContacts.map((c) => (
              <Link
                key={c.id}
                href={`/admin/contacts/${c.id}`}
                className={`flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors ${!c.read ? "bg-blue-50/40" : ""}`}
              >
                <div className={`w-2 h-2 rounded-full shrink-0 ${c.read ? "bg-gray-200" : "bg-blue-500"}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">{c.fullName}</p>
                  <p className="text-gray-400 text-xs truncate">{c.email} {c.service && `· ${c.service}`}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
                  <Clock size={11} />
                  {formatDate(c.createdAt, "dd/MM/yyyy")}
                </div>
                {!c.read && (
                  <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full font-medium">Mới</span>
                )}
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { href: "/admin/posts/new", label: "Tạo bài viết", icon: FileText, color: "blue" },
          { href: "/admin/works/new", label: "Thêm Work", icon: Image, color: "purple" },
          { href: "/admin/contacts", label: "Xem liên hệ", icon: Mail, color: "orange" },
          { href: "/", label: "Xem website", icon: Eye, color: "green", target: "_blank" },
        ].map((a) => (
          <Link
            key={a.href}
            href={a.href}
            target={a.target as "_blank" | undefined}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all text-center"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${a.color}-50 text-${a.color}-600`}>
              <a.icon size={20} />
            </div>
            <span className="text-sm font-medium text-gray-700">{a.label}</span>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
