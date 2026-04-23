"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import DataTable, { Column } from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { Plus } from "lucide-react";

interface Work { id: string; title: string; category: string; order: number; featured: boolean; image: string; }

export default function WorksPage() {
  const [data, setData] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Work | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/works?limit=100");
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

  const columns: Column<Work>[] = [
    { key: "image", label: "Ảnh", render: (v) => v ? <img src={String(v)} className="w-12 h-10 object-cover rounded" alt="" /> : <div className="w-12 h-10 bg-gray-100 rounded" /> },
    { key: "title", label: "Tên", sortable: true },
    { key: "category", label: "Loại", render: (v) => <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded">{String(v)}</span> },
    { key: "order", label: "Thứ tự", sortable: true },
    { key: "featured", label: "Nổi bật", render: (v) => v ? <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded">✓</span> : null },
  ];

  return (
    <AdminShell title="Works" actions={<Link href="/admin/works/new" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"><Plus size={16} /> Thêm mới</Link>}>
      <DataTable columns={columns} data={data} loading={loading} onEdit={(r) => router.push(`/admin/works/${r.id}`)} onDelete={setDeleteTarget} searchPlaceholder="Tìm work..." />
      <ConfirmDialog open={!!deleteTarget} message={`Xóa "${deleteTarget?.title}"?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </AdminShell>
  );
}
