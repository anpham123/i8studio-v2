"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import DataTable, { Column } from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { Plus } from "lucide-react";

interface BlogCat { id: string; slug: string; nameJa: string; nameEn: string; order: number; active: boolean; }

export default function BlogCategoriesPage() {
  const [data, setData] = useState<BlogCat[]>([]);
  const [loading, setLoading] = useState(true);
  const [del, setDel] = useState<BlogCat | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/blog-categories");
    const json = await res.json();
    setData(json.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async () => {
    if (!del) return;
    setDeleting(true);
    await fetch(`/api/blog-categories/${del.id}`, { method: "DELETE" });
    toast("Đã xóa", "success");
    setDel(null);
    setDeleting(false);
    fetchData();
  };

  const cols: Column<BlogCat>[] = [
    { key: "nameJa", label: "Tên (JA)", sortable: true },
    { key: "nameEn", label: "Tên (EN)" },
    { key: "slug", label: "Slug", render: (v) => <code className="text-xs text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded">{String(v)}</code> },
    { key: "order", label: "Thứ tự", sortable: true },
    { key: "active", label: "Active", render: (v) => v ? <span className="text-green-600 text-xs font-medium">✓ Active</span> : <span className="text-gray-400 text-xs">— Inactive</span> },
  ];

  return (
    <AdminShell title={`Blog Categories (${data.length})`} actions={<Link href="/admin/blog-categories/new" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"><Plus size={16} /> Thêm mới</Link>}>
      <DataTable columns={cols} data={data} loading={loading} onEdit={(r) => router.push(`/admin/blog-categories/${r.id}`)} onDelete={setDel} searchPlaceholder="Tìm danh mục..." />
      <ConfirmDialog open={!!del} message={`Xóa "${del?.nameJa || del?.nameEn}"?`} onConfirm={handleDelete} onCancel={() => setDel(null)} loading={deleting} />
    </AdminShell>
  );
}
