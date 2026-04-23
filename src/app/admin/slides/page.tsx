"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import DataTable, { Column } from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { Plus } from "lucide-react";

interface Slide { id: string; title: string; subtitle: string; active: boolean; order: number; }

export default function SlidesPage() {
  const [data, setData] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [del, setDel] = useState<Slide | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/slides?limit=100");
    const json = await res.json();
    setData(json.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async () => {
    if (!del) return;
    setDeleting(true);
    await fetch(`/api/slides/${del.id}`, { method: "DELETE" });
    toast("Đã xóa", "success");
    setDel(null); setDeleting(false); fetchData();
  };

  const cols: Column<Slide>[] = [
    { key: "title", label: "Tiêu đề", sortable: true },
    { key: "subtitle", label: "Phụ đề" },
    { key: "active", label: "Trạng thái", render: (v) => <span className={`text-xs px-2 py-0.5 rounded-full ${v ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>{v ? "Hiện" : "Ẩn"}</span> },
    { key: "order", label: "Thứ tự" },
  ];

  return (
    <AdminShell title="Slides" actions={<Link href="/admin/slides/new" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"><Plus size={16} /> Thêm mới</Link>}>
      <DataTable columns={cols} data={data} loading={loading} onEdit={(r) => router.push(`/admin/slides/${r.id}`)} onDelete={setDel} />
      <ConfirmDialog open={!!del} message={`Xóa slide "${del?.title}"?`} onConfirm={handleDelete} onCancel={() => setDel(null)} loading={deleting} />
    </AdminShell>
  );
}
