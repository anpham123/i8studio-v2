"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import DataTable, { Column } from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { Plus } from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  titleJa: string;
  coverImage: string;
  category: string;
  order: number;
  isPublished: boolean;
}

export default function PortfolioListPage() {
  const [data, setData] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [del, setDel] = useState<PortfolioItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/portfolio");
    const json = await res.json();
    setData(json.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async () => {
    if (!del) return;
    setDeleting(true);
    await fetch(`/api/portfolio/${del.id}`, { method: "DELETE" });
    toast("Đã xóa portfolio", "success");
    setDel(null);
    setDeleting(false);
    fetchData();
  };

  const cols: Column<PortfolioItem>[] = [
    {
      key: "coverImage", label: "Ảnh", width: "w-16",
      render: (v) => v
        ? <img src={String(v)} className="w-14 h-11 object-cover rounded-lg" alt="" />
        : <div className="w-14 h-11 bg-gray-100 rounded-lg" />,
    },
    { key: "title", label: "Tên (EN)", sortable: true },
    { key: "titleJa", label: "Tên (JA)" },
    { key: "category", label: "Danh mục", render: (v) => <span className="text-xs text-gray-500">{String(v) || "—"}</span> },
    { key: "order", label: "Thứ tự", sortable: true },
    { key: "isPublished", label: "Published", render: (v) => v ? <span className="text-green-600 text-xs font-medium">✓</span> : <span className="text-gray-400 text-xs">—</span> },
  ];

  return (
    <AdminShell title={`Portfolio (${data.length})`} actions={<Link href="/admin/portfolio/new" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"><Plus size={16} /> Thêm mới</Link>}>
      <DataTable columns={cols} data={data} loading={loading} onEdit={(r) => router.push(`/admin/portfolio/${r.id}`)} onDelete={setDel} searchPlaceholder="Tìm portfolio..." />
      <ConfirmDialog open={!!del} message={`Xóa "${del?.title}"?`} onConfirm={handleDelete} onCancel={() => setDel(null)} loading={deleting} />
    </AdminShell>
  );
}
