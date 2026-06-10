"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import DataTable, { Column } from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { formatDate } from "@/lib/utils";
import { CheckCheck } from "lucide-react";

interface Contact { id: string; fullName: string; email: string; service: string; message: string; read: boolean; createdAt: string; }

type FilterTab = "all" | "unread" | "read";

export default function ContactsPage() {
  const [data, setData] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [del, setDel] = useState<Contact | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/contacts?limit=200");
    const json = await res.json();
    setData(json.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async () => {
    if (!del) return;
    setDeleting(true);
    await fetch(`/api/contacts/${del.id}`, { method: "DELETE" });
    toast("Đã xóa", "success");
    setDel(null); setDeleting(false); fetchData();
  };

  const markAllRead = async () => {
    const unreadItems = data.filter((c) => !c.read);
    if (unreadItems.length === 0) return;
    setMarkingAll(true);
    await Promise.all(
      unreadItems.map((c) =>
        fetch(`/api/contacts/${c.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ read: true }),
        })
      )
    );
    toast(`Đã đánh dấu ${unreadItems.length} liên hệ đã đọc`, "success");
    setMarkingAll(false);
    fetchData();
  };

  const unreadCount = data.filter((c) => !c.read).length;
  const readCount = data.filter((c) => c.read).length;

  const filteredData = filter === "unread"
    ? data.filter((c) => !c.read)
    : filter === "read"
    ? data.filter((c) => c.read)
    : data;

  const filterTabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "Tất cả", count: data.length },
    { key: "unread", label: "Chưa đọc", count: unreadCount },
    { key: "read", label: "Đã đọc", count: readCount },
  ];

  const cols: Column<Contact>[] = [
    {
      key: "fullName", label: "Họ tên", sortable: true,
      render: (v, row) => (
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full shrink-0 ${row.read ? "bg-gray-200" : "bg-blue-500"}`} />
          <span className={row.read ? "text-gray-600" : "font-semibold text-gray-900"}>{String(v)}</span>
        </div>
      ),
    },
    { key: "email", label: "Email" },
    { key: "service", label: "Dịch vụ" },
    {
      key: "read", label: "Trạng thái",
      render: (v) => (
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
          !v ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-400"
        }`}>
          {v ? "Đã đọc" : "Chưa đọc"}
        </span>
      ),
    },
    {
      key: "createdAt", label: "Ngày gửi", sortable: true,
      render: (v) => <span className="text-xs text-gray-500">{formatDate(new Date(String(v)))}</span>,
    },
  ];

  return (
    <AdminShell
      title={`Liên hệ${unreadCount > 0 ? ` (${unreadCount} mới)` : ""}`}
      actions={
        unreadCount > 0 ? (
          <button
            onClick={markAllRead}
            disabled={markingAll}
            className="flex items-center gap-2 border border-blue-200 text-blue-600 px-3.5 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 disabled:opacity-50"
          >
            <CheckCheck size={15} />
            {markingAll ? "Đang xử lý..." : "Đánh dấu tất cả đã đọc"}
          </button>
        ) : null
      }
    >
      {/* Filter tabs */}
      <div className="flex gap-1.5 mb-5">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filter === tab.key
                ? tab.key === "unread" ? "bg-blue-600 text-white" : "bg-gray-800 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
            <span className={`ml-1.5 ${filter === tab.key ? "opacity-60" : "text-gray-400"}`}>{tab.count}</span>
          </button>
        ))}
      </div>

      <DataTable
        columns={cols}
        data={filteredData}
        loading={loading}
        onEdit={(r) => router.push(`/admin/contacts/${r.id}`)}
        onDelete={setDel}
        searchPlaceholder="Tìm liên hệ..."
      />
      <ConfirmDialog open={!!del} message={`Xóa liên hệ "${del?.fullName}"?`} onConfirm={handleDelete} onCancel={() => setDel(null)} loading={deleting} />
    </AdminShell>
  );
}
