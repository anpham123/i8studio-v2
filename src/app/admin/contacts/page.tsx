"use client";

import { useEffect, useState, useCallback, useRef, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import DataTable, { Column } from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { formatDate } from "@/lib/utils";
import { CheckCheck, ChevronLeft, ChevronRight, Calendar, BarChart3, Filter } from "lucide-react";

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
  } else if (ch.includes("twitter") || ch.includes("tweet") || ch === "x" || ch.includes("x (")) {
    color = "bg-neutral-100 text-neutral-800 border-neutral-300";
    icon = "𝕏";
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
  const now = new Date();
  const [data, setData] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [del, setDel] = useState<Contact | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  // Time filter state
  const [timeMode, setTimeMode] = useState<"all" | "month">("all");
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0-indexed

  const router = useRouter();
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/contacts?limit=500");
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

  // Filter by Time (Month/Year)
  const timeFilteredData = data.filter((c) => {
    if (timeMode === "all") return true;
    const d = new Date(c.createdAt);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  const unreadCount = timeFilteredData.filter((c) => !c.read).length;
  const readCount = timeFilteredData.filter((c) => c.read).length;

  const filteredData = filter === "unread"
    ? timeFilteredData.filter((c) => !c.read)
    : filter === "read"
    ? timeFilteredData.filter((c) => c.read)
    : timeFilteredData;

  const filterTabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "Tất cả", count: timeFilteredData.length },
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

  const goBack = () => {
    setTimeMode("month");
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const goForward = () => {
    setTimeMode("month");
    const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();
    if (isCurrentMonth) return;
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

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
      {/* Month / Year Time Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switch: All Time vs By Month */}
          <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200 text-xs font-semibold mr-1">
            <button
              onClick={() => setTimeMode("all")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                timeMode === "all"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Tất cả thời gian
            </button>
            <button
              onClick={() => setTimeMode("month")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                timeMode === "month"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Lọc theo tháng
            </button>
          </div>

          {timeMode === "month" && (
            <>
              {/* Prev button */}
              <button
                onClick={goBack}
                title="Tháng trước"
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 border border-gray-200 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Month Dropdown */}
              <div className="relative">
                <select
                  value={month}
                  onChange={(e) => {
                    setTimeMode("month");
                    setMonth(Number(e.target.value));
                  }}
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 pr-7 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white cursor-pointer"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i}>
                      Tháng {i + 1 < 10 ? `0${i + 1}` : i + 1}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-gray-500">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>

              {/* Year Dropdown */}
              <div className="relative">
                <select
                  value={year}
                  onChange={(e) => {
                    setTimeMode("month");
                    setYear(Number(e.target.value));
                  }}
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 pr-7 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white cursor-pointer"
                >
                  {Array.from({ length: now.getFullYear() - 2020 + 3 }, (_, i) => 2020 + i).map((y) => (
                    <option key={y} value={y}>
                      Năm {y}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-gray-500">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>

              {/* Next button */}
              <button
                onClick={goForward}
                disabled={isCurrentMonth}
                title="Tháng sau"
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 border border-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>

              {/* Quick jump to current month */}
              {!isCurrentMonth && (
                <button
                  onClick={() => {
                    setYear(now.getFullYear());
                    setMonth(now.getMonth());
                  }}
                  className="px-2.5 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors ml-0.5"
                >
                  Về tháng này
                </button>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Calendar size={14} className="text-blue-500" />
          <span>
            {timeMode === "all" ? (
              <span>Đang xem: <strong className="text-gray-800">Tất cả {data.length} liên hệ</strong></span>
            ) : (
              <span>Tháng <strong className="text-gray-800">{month + 1 < 10 ? `0${month + 1}` : month + 1}/{year}</strong> ({timeFilteredData.length} liên hệ)</span>
            )}
          </span>
        </div>
      </div>

      {/* Channel Attribution Summary Cards (Enlarged & Enhanced) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-7">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <span>📊</span>
              <span>Thống Kê Nguồn Khách Hàng (Channel Attribution)</span>
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">
              {timeMode === "all"
                ? "Tỷ lệ khách hàng tiếp cận i8 STUDIO qua các kênh mạng xã hội & tìm kiếm (Toàn thời gian)"
                : `Tỷ lệ khách hàng tiếp cận trong Tháng ${month + 1 < 10 ? `0${month + 1}` : month + 1}/${year}`}
            </p>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-gray-900 text-white text-xs font-semibold shadow-sm">
            {timeFilteredData.length} liên hệ
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {[
            { name: "Facebook", icon: "📘", count: timeFilteredData.filter(c => (c.hearAboutUs || "").toLowerCase().includes("facebook")).length, bg: "bg-blue-50/70 border-blue-100 text-blue-900", badge: "bg-blue-100 text-blue-700" },
            { name: "Instagram", icon: "📸", count: timeFilteredData.filter(c => (c.hearAboutUs || "").toLowerCase().includes("instagram")).length, bg: "bg-pink-50/70 border-pink-100 text-pink-900", badge: "bg-pink-100 text-pink-700" },
            { name: "LinkedIn", icon: "💼", count: timeFilteredData.filter(c => (c.hearAboutUs || "").toLowerCase().includes("linkedin")).length, bg: "bg-sky-50/70 border-sky-100 text-sky-900", badge: "bg-sky-100 text-sky-700" },
            { name: "Twitter", icon: "𝕏", count: timeFilteredData.filter(c => (c.hearAboutUs || "").toLowerCase().includes("twitter") || (c.hearAboutUs || "").toLowerCase().includes("tweet") || (c.hearAboutUs || "").toLowerCase() === "x" || (c.hearAboutUs || "").toLowerCase().includes("x (")).length, bg: "bg-neutral-50 border-neutral-200 text-neutral-900", badge: "bg-neutral-200 text-neutral-800" },
            { name: "YouTube", icon: "▶️", count: timeFilteredData.filter(c => (c.hearAboutUs || "").toLowerCase().includes("youtube")).length, bg: "bg-red-50/70 border-red-100 text-red-900", badge: "bg-red-100 text-red-700" },
            { name: "Google / Web", icon: "🔍", count: timeFilteredData.filter(c => (c.hearAboutUs || "").toLowerCase().includes("google") || (c.hearAboutUs || "").toLowerCase().includes("search")).length, bg: "bg-emerald-50/70 border-emerald-100 text-emerald-900", badge: "bg-emerald-100 text-emerald-700" },
            { name: "Giới thiệu", icon: "🤝", count: timeFilteredData.filter(c => (c.hearAboutUs || "").toLowerCase().includes("referral") || (c.hearAboutUs || "").toLowerCase().includes("giới thiệu") || (c.hearAboutUs || "").toLowerCase().includes("紹介")).length, bg: "bg-amber-50/70 border-amber-100 text-amber-900", badge: "bg-amber-100 text-amber-700" },
            { name: "Khác / Direct", icon: "🌐", count: timeFilteredData.filter(c => !c.hearAboutUs || (c.hearAboutUs || "").toLowerCase().includes("other") || (c.hearAboutUs || "").toLowerCase().includes("khác") || (c.hearAboutUs || "").toLowerCase().includes("その他")).length, bg: "bg-gray-50 border-gray-200 text-gray-900", badge: "bg-gray-200 text-gray-700" },
          ].map((stat, idx) => {
            const pct = timeFilteredData.length ? Math.round((stat.count / timeFilteredData.length) * 100) : 0;
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
