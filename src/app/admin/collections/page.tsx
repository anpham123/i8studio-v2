"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import DataTable, { Column } from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { Plus } from "lucide-react";

interface Col { id: string; slug: string; titleJa: string; titleEn: string; coverImage: string; order: number; active: boolean; }

export default function CollectionsPage() {
  const [data, setData] = useState<Col[]>([]);
  const [loading, setLoading] = useState(true);
  const [del, setDel] = useState<Col | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/collections");
    const json = await res.json();
    setData(json.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async () => {
    if (!del) return;
    setDeleting(true);
    await fetch(`/api/collections/${del.id}`, { method: "DELETE" });
    toast("Đã xóa collection", "success");
    setDel(null);
    setDeleting(false);
    fetchData();
  };

  const cols: Column<Col>[] = [
    {
      key: "coverImage", label: "Ảnh", width: "w-16",
      render: (v) => v
        ? <img src={String(v)} className="w-14 h-11 object-cover rounded-lg" alt="" />
        : <div className="w-14 h-11 bg-gray-100 rounded-lg" />,
    },
    { key: "titleJa", label: "Tên (JA)", sortable: true },
    { key: "titleEn", label: "Tên (EN)" },
    { key: "slug", label: "Slug", render: (v) => <code className="text-xs text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded">{String(v)}</code> },
    { key: "order", label: "Thứ tự", sortable: true },
    { key: "active", label: "Active", render: (v) => v ? <span className="text-green-600 text-xs font-medium">✓</span> : <span className="text-gray-400 text-xs">—</span> },
  ];

  return (
    <AdminShell title={`Collections (${data.length})`} actions={<Link href="/admin/collections/new" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"><Plus size={16} /> Thêm mới</Link>}>
      <DataTable columns={cols} data={data} loading={loading} onEdit={(r) => router.push(`/admin/collections/${r.id}`)} onDelete={setDel} searchPlaceholder="Tìm collection..." />
      <ConfirmDialog open={!!del} message={`Xóa "${del?.titleJa}"?`} onConfirm={handleDelete} onCancel={() => setDel(null)} loading={deleting} />
    </AdminShell>
  );
}
