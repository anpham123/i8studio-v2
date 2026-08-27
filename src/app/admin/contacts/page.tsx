"use client";

import { useEffect, useState, useCallback, useRef, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import DataTable, { Column } from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { formatDate } from "@/lib/utils";
import { CheckCheck } from "lucide-react";

interface Contact {
  id: string;
  fullName: string;
  email: string;
  service: string;
  hearAboutUs?: string;
  referrer?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

type FilterTab = "all" | "unread" | "read";

/* ------------------------------------------------------------------ */
/*  Channel Badge Helper                                              */
/* ------------------------------------------------------------------ */
function ChannelBadge({ channel, referrer }: { channel?: string; referrer?: string }) {
  if (!channel && !referrer) {
    return <span className="text-xs text-gray-400">—</span>;
  }

  const ch = (channel || "").toLowerCase();
  let color = "bg-gray-100 text-gray-600 border-gray-200";
  let icon = "🌐";

  if (ch.includes("facebook")) {
    color = "bg-blue-50 text-blue-700 border-blue-200";
    icon = "📘";
  } else if (ch.includes("instagram")) {
    color = "bg-pink-50 text-pink-700 border-pink-200";
    icon = "📸";
  } else if (ch.includes("linkedin")) {
    color = "bg-sky-50 text-sky-700 border-sky-200";
    icon = "💼";
  } else if (ch.includes("youtube")) {
    color = "bg-red-50 text-red-700 border-red-200";
    icon = "▶️";
  } else if (ch.includes("google") || ch.includes("search")) {
    color = "bg-emerald-50 text-emerald-700 border-emerald-200";
    icon = "🔍";
  } else if (ch.includes("referral") || ch.includes("giới thiệu") || ch.includes("紹介")) {
    color = "bg-amber-50 text-amber-700 border-amber-200";
    icon = "🤝";
  }

  return (
    <div className="flex flex-col gap-0.5">
      <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border w-fit ${color}`}>
        <span>{icon}</span>
        <span>{channel || "Trực tiếp"}</span>
      </span>
      {referrer && referrer !== "Direct / Organic" && (
        <span className="text-[10px] text-gray-400 truncate max-w-[140px]" title={referrer}>
          ref: {referrer}
        </span>
      )}
    </div>
  );
}

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
      key: "hearAboutUs", label: "Kênh tiếp cận",
      render: (v, row) => <ChannelBadge channel={row.hearAboutUs} referrer={row.referrer} />,
    },
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

  // Calculate channel attribution distribution
  const channelCounts: Record<string, number> = {};
  data.forEach((c) => {
    const ch = c.hearAboutUs || "Direct / Trực tiếp";
    channelCounts[ch] = (channelCounts[ch] || 0) + 1;
  });

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
      {/* Channel Attribution Summary Cards (Enlarged & Enhanced) */}
      {data.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-7">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <span>📊</span>
                <span>Thống Kê Nguồn Khách Hàng (Channel Attribution)</span>
              </h4>
              <p className="text-xs text-gray-400 mt-0.5">
                Phân tích tỷ lệ khách hàng tiếp cận i8 STUDIO qua các kênh mạng xã hội & tìm kiếm
              </p>
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-gray-900 text-white text-xs font-semibold shadow-sm">
              Tổng số: {data.length} liên hệ
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
            {[
              { name: "Facebook", icon: "📘", count: data.filter(c => (c.hearAboutUs || "").toLowerCase().includes("facebook")).length, bg: "bg-blue-50/70 border-blue-100 text-blue-900", badge: "bg-blue-100 text-blue-700" },
              { name: "Instagram", icon: "📸", count: data.filter(c => (c.hearAboutUs || "").toLowerCase().includes("instagram")).length, bg: "bg-pink-50/70 border-pink-100 text-pink-900", badge: "bg-pink-100 text-pink-700" },
              { name: "LinkedIn", icon: "💼", count: data.filter(c => (c.hearAboutUs || "").toLowerCase().includes("linkedin")).length, bg: "bg-sky-50/70 border-sky-100 text-sky-900", badge: "bg-sky-100 text-sky-700" },
              { name: "YouTube", icon: "▶️", count: data.filter(c => (c.hearAboutUs || "").toLowerCase().includes("youtube")).length, bg: "bg-red-50/70 border-red-100 text-red-900", badge: "bg-red-100 text-red-700" },
              { name: "Google / Web", icon: "🔍", count: data.filter(c => (c.hearAboutUs || "").toLowerCase().includes("google") || (c.hearAboutUs || "").toLowerCase().includes("search")).length, bg: "bg-emerald-50/70 border-emerald-100 text-emerald-900", badge: "bg-emerald-100 text-emerald-700" },
              { name: "Giới thiệu", icon: "🤝", count: data.filter(c => (c.hearAboutUs || "").toLowerCase().includes("referral") || (c.hearAboutUs || "").toLowerCase().includes("giới thiệu") || (c.hearAboutUs || "").toLowerCase().includes("紹介")).length, bg: "bg-amber-50/70 border-amber-100 text-amber-900", badge: "bg-amber-100 text-amber-700" },
              { name: "Khác / Direct", icon: "🌐", count: data.filter(c => !c.hearAboutUs || (c.hearAboutUs || "").toLowerCase().includes("other") || (c.hearAboutUs || "").toLowerCase().includes("khác") || (c.hearAboutUs || "").toLowerCase().includes("その他")).length, bg: "bg-gray-50 border-gray-200 text-gray-900", badge: "bg-gray-200 text-gray-700" },
            ].map((stat, idx) => {
              const pct = data.length ? Math.round((stat.count / data.length) * 100) : 0;
              return (
                <div
                  key={idx}
                  className={`rounded-xl p-4 border text-center transition-all hover:shadow-md ${stat.bg}`}
                >
                  <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-600 mb-2">
                    <span className="text-lg">{stat.icon}</span>
                    <span className="truncate">{stat.name}</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-1.5">
                    {stat.count}
                  </div>
                  <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full ${stat.badge}`}>
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
          onView={(r) => router.push(`/admin/contacts/${r.id}`)}
          editTitle="Xem chi tiết"
          onDelete={setDel}
          searchPlaceholder="Tìm liên hệ..."
        />
      </div>

      <ConfirmDialog open={!!del} message={`Xóa liên hệ "${del?.fullName}"?`} onConfirm={handleDelete} onCancel={() => setDel(null)} loading={deleting} />
    </AdminShell>
  );
}
