"use client";

import { useEffect, useState, useCallback, useRef, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import DataTable, { Column } from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { formatDate } from "@/lib/utils";
import { CheckCheck } from "lucide-react";

interface Contact { id: string; fullName: string; email: string; service: string; message: string; read: boolean; createdAt: string; }

type FilterTab = "all" | "unread" | "read";

/* ------------------------------------------------------------------ */
/*  Sliding pill tab bar                                                */
/* ------------------------------------------------------------------ */
function TabBar({
  tabs,
  active,
  onChange,
}: {
  tabs: { key: FilterTab; label: string; count: number; color?: string }[];
  active: FilterTab;
  onChange: (key: FilterTab) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [pill, setPill] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const activeEl = tabRefs.current.get(active);
    const container = containerRef.current;
    if (activeEl && container) {
      const containerRect = container.getBoundingClientRect();
      const tabRect = activeEl.getBoundingClientRect();
      setPill({
        left: tabRect.left - containerRect.left,
        width: tabRect.width,
      });
    }
  }, [active]);

  const activeTab = tabs.find((t) => t.key === active);
  const pillColor = activeTab?.key === "unread" ? "bg-blue-600" : "bg-gray-800";

  return (
    <div ref={containerRef} className="relative flex gap-1 mb-5">
      {/* Sliding pill */}
      <div
        className={`absolute top-0 h-full rounded-full ${pillColor} shadow-sm pointer-events-none`}
        style={{
          left: pill.left,
          width: pill.width,
          transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.25s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s",
        }}
      />

      {tabs.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            ref={(el) => { if (el) tabRefs.current.set(tab.key, el); }}
            onClick={() => onChange(tab.key)}
            className={`relative z-10 px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 ${
              isActive ? "text-white" : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            }`}
          >
            {tab.label}
            <span className={`ml-1.5 transition-colors duration-200 ${isActive ? "opacity-60" : "text-gray-400"}`}>
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function ContactsPage() {
  const [data, setData] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [del, setDel] = useState<Contact | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
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

  // Smooth tab switch
  const handleTabChange = (key: FilterTab) => {
    if (key === filter) return;
    setTransitioning(true);
    setTimeout(() => {
      setFilter(key);
      requestAnimationFrame(() => setTransitioning(false));
    }, 150);
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
            className="flex items-center gap-2 border border-blue-200 text-blue-600 px-3.5 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 disabled:opacity-50 transition-colors"
          >
            <CheckCheck size={15} />
            {markingAll ? "Đang xử lý..." : "Đánh dấu tất cả đã đọc"}
          </button>
        ) : null
      }
    >
      {/* Sliding tab bar */}
      <TabBar tabs={filterTabs} active={filter} onChange={handleTabChange} />

      {/* Content with fade transition */}
      <div
        className="transition-all duration-200 ease-out"
        style={{
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? "translateY(6px)" : "translateY(0)",
        }}
      >
        <DataTable
          columns={cols}
          data={filteredData}
          loading={loading}
          onEdit={(r) => router.push(`/admin/contacts/${r.id}`)}
          onDelete={setDel}
          searchPlaceholder="Tìm liên hệ..."
        />
      </div>

      <ConfirmDialog open={!!del} message={`Xóa liên hệ "${del?.fullName}"?`} onConfirm={handleDelete} onCancel={() => setDel(null)} loading={deleting} />
    </AdminShell>
  );
}
