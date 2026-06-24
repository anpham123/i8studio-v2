"use client";

import { useEffect, useState, useCallback, useRef, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import DataTable, { Column } from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { Plus } from "lucide-react";

const TYPE_TABS = [
  { key: "", label: "Tất cả" },
  { key: "still", label: "Still Image" },
  { key: "animation", label: "Animation" },
  { key: "walkthrough", label: "VR Walkthrough" },
  { key: "vr360", label: "VR 360" },
  { key: "composite", label: "Photo Composite" },
  { key: "digital", label: "Digital Model" },
  { key: "ar", label: "AR" },
];

const typeMap: Record<string, string> = {
  still: "Still Image", animation: "Animation", composite: "Photo Composite",
  vr360: "VR 360", walkthrough: "VR Walkthrough", ar: "AR", digital: "Digital Model",
};

const buildingCategoryMap: Record<string, string> = {
  residential: "Residential", apartment: "Apartment", resort: "Resort",
  commercial: "Commercial", office: "Office", public: "Public Facility", urban: "Urban Development",
};

interface Work { id: string; title: string; category: string; type?: string; buildingCategory?: string; order: number; featured: boolean; image: string; }

/* ------------------------------------------------------------------ */
/*  Sliding pill tab bar                                                */
/* ------------------------------------------------------------------ */
function TabBar({
  tabs,
  active,
  counts,
  total,
  onChange,
}: {
  tabs: typeof TYPE_TABS;
  active: string;
  counts: Record<string, number>;
  total: number;
  onChange: (key: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [pill, setPill] = useState({ left: 0, width: 0 });

  // Measure the active tab and slide the pill indicator
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

  return (
    <div ref={containerRef} className="relative flex flex-wrap gap-1 mb-5">
      {/* Sliding pill background */}
      <div
        className="absolute top-0 h-full rounded-full bg-blue-600 shadow-sm pointer-events-none"
        style={{
          left: pill.left,
          width: pill.width,
          transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />

      {tabs.map((tab) => {
        const count = tab.key ? (counts[tab.key] || 0) : total;
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            ref={(el) => { if (el) tabRefs.current.set(tab.key, el); }}
            onClick={() => onChange(tab.key)}
            className={`relative z-10 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 ${
              isActive
                ? "text-white"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            }`}
          >
            {tab.label}
            <span className={`ml-1.5 transition-colors duration-200 ${isActive ? "text-blue-200" : "text-gray-400"}`}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */
export default function WorksPage() {
  const [data, setData] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Work | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/works?limit=200");
    const json = await res.json();
    setData(json.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await fetch(`/api/works/${deleteTarget.id}`, { method: "DELETE" });
    toast("Đã xóa", "success");
    setDeleteTarget(null);
    setDeleting(false);
    fetchData();
  };

  // Smooth tab switch with fade transition
  const handleTabChange = (key: string) => {
    if (key === typeFilter) return;
    setTransitioning(true);
    // Short fade-out, then switch, then fade-in
    setTimeout(() => {
      setTypeFilter(key);
      // Allow DOM to update, then fade in
      requestAnimationFrame(() => {
        setTransitioning(false);
      });
    }, 150);
  };

  // Filter by type tab
  const filteredData = typeFilter
    ? data.filter((w) => (w.type || "still") === typeFilter)
    : data;

  // Count by type for badges
  const typeCounts = data.reduce((acc, w) => {
    const t = w.type || "still";
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const columns: Column<Work>[] = [
    {
      key: "image", label: "Ảnh", width: "w-16",
      render: (v) => v
        ? <img src={String(v)} className="w-14 h-11 object-cover rounded-lg" alt="" />
        : <div className="w-14 h-11 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300 text-xs">N/A</div>,
    },
    { key: "title", label: "Tên", sortable: true },
    {
      key: "type", label: "Loại",
      render: (v) => <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">{typeMap[String(v)] || String(v || "still")}</span>,
    },
    {
      key: "buildingCategory", label: "Thể loại",
      render: (v) => <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{buildingCategoryMap[String(v)] || String(v || "residential")}</span>,
    },
    {
      key: "order", label: "Thứ tự", sortable: true,
      render: (v, row) => (
        <input
          type="number"
          value={row.order}
          onChange={(e) => {
            const val = parseInt(e.target.value) || 0;
            setData((prev) => prev.map((w) => w.id === row.id ? { ...w, order: val } : w));
          }}
          onBlur={async (e) => {
            const val = parseInt(e.target.value) || 0;
            const res = await fetch(`/api/works/${row.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ order: val }),
            });
            const json = await res.json();
            if (json.data) toast("Đã cập nhật thứ tự", "success");
            else toast("Lỗi khi cập nhật", "error");
          }}
          className="w-16 border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-400 bg-white"
        />
      ),
    },
    {
      key: "featured", label: "Nổi bật", sortable: true,
      render: (v, row) => (
        <div className="flex items-center gap-1.5">
          <input
            type="checkbox"
            checked={Boolean(row.featured)}
            onChange={async (e) => {
              const checked = e.target.checked;
              setData((prev) => prev.map((w) => w.id === row.id ? { ...w, featured: checked } : w));
              const res = await fetch(`/api/works/${row.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ featured: checked }),
              });
              const json = await res.json();
              if (json.data) toast("Đã cập nhật nổi bật", "success");
              else {
                toast("Lỗi khi cập nhật", "error");
                setData((prev) => prev.map((w) => w.id === row.id ? { ...w, featured: !checked } : w));
              }
            }}
            className="rounded border-gray-300 h-4 w-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          {row.featured && <span className="text-[10px] text-amber-500 font-semibold">★</span>}
        </div>
      ),
    },
  ];

  return (
    <AdminShell
      title={`Works (${filteredData.length})`}
      actions={
        <Link href="/admin/works/new" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus size={16} /> Thêm mới
        </Link>
      }
    >
      {/* Sliding tab bar */}
      <TabBar
        tabs={TYPE_TABS}
        active={typeFilter}
        counts={typeCounts}
        total={data.length}
        onChange={handleTabChange}
      />

      {/* Content with fade transition */}
      <div
        className="transition-all duration-200 ease-out"
        style={{
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? "translateY(6px)" : "translateY(0)",
        }}
      >
        <DataTable
          columns={columns}
          data={filteredData}
          loading={loading}
          onEdit={(r) => router.push(`/admin/works/${r.id}`)}
          onDelete={setDeleteTarget}
          searchPlaceholder="Tìm work..."
        />
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        message={`Xóa "${deleteTarget?.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </AdminShell>
  );
}
