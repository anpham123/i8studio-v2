"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import DataTable, { Column } from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { Plus, ExternalLink } from "lucide-react";

interface Flipbook { id: string; title: string; pdfUrl: string; active: boolean; order: number; createdAt: string; }

export default function FlipbooksPage() {
  const [data, setData] = useState<Flipbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [del, setDel] = useState<Flipbook | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/flipbooks?limit=100&all=true");
    const json = await res.json();
    setData(json.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async () => {
    if (!del) return;
    setDeleting(true);
    await fetch(`/api/flipbooks/${del.id}`, { method: "DELETE" });
    toast("Đã xóa", "success");
    setDel(null); setDeleting(false); fetchData();
  };

  const cols: Column<Flipbook>[] = [
    { key: "title", label: "Tiêu đề", sortable: true },
    { key: "pdfUrl", label: "File PDF", render: (v) => <a href={String(v)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline text-xs"><ExternalLink size={12} /> PDF</a> },
    { key: "active", label: "Trạng thái", render: (v) => <span className={`text-xs px-2 py-0.5 rounded-full ${v ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>{v ? "Hiện" : "Ẩn"}</span> },
    { key: "order", label: "Thứ tự" },
  ];

  return (
    <AdminShell title="Flipbooks" actions={<Link href="/admin/flipbooks/new" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"><Plus size={16} /> Thêm mới</Link>}>
      <DataTable columns={cols} data={data} loading={loading} onEdit={(r) => router.push(`/admin/flipbooks/${r.id}`)} onDelete={setDel} />
      <ConfirmDialog open={!!del} message={`Xóa flipbook "${del?.title}"?`} onConfirm={handleDelete} onCancel={() => setDel(null)} loading={deleting} />
    </AdminShell>
  );
}
