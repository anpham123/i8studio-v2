"use client";

import { useEffect, useState, useCallback } from "react";
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

export default function WorksPage() {
  const [data, setData] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Work | null>(null);
  const [deleting, setDeleting] = useState(false);
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
    { key: "order", label: "Thứ tự", sortable: true },
    {
      key: "featured", label: "Nổi bật",
      render: (v) => v ? <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-medium">★ Nổi bật</span> : null,
    },
  ];

  return (
    <AdminShell
      title={`Works (${filteredData.length})`}
      actions={
        <Link href="/admin/works/new" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
          <Plus size={16} /> Thêm mới
        </Link>
      }
    >
      {/* Type filter tabs */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {TYPE_TABS.map((tab) => {
          const count = tab.key ? (typeCounts[tab.key] || 0) : data.length;
          const active = typeFilter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setTypeFilter(tab.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                active
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
              <span className={`ml-1.5 ${active ? "text-blue-200" : "text-gray-400"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        loading={loading}
        onEdit={(r) => router.push(`/admin/works/${r.id}`)}
        onDelete={setDeleteTarget}
        searchPlaceholder="Tìm work..."
      />
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
