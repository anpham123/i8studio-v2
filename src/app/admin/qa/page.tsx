"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import DataTable, { Column } from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { Plus } from "lucide-react";

interface QA { id: string; question: string; questionJa: string; order: number; }

export default function QAPage() {
  const [data, setData] = useState<QA[]>([]);
  const [loading, setLoading] = useState(true);
  const [del, setDel] = useState<QA | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/qa?limit=100");
    const json = await res.json();
    setData(json.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async () => {
    if (!del) return;
    setDeleting(true);
    await fetch(`/api/qa/${del.id}`, { method: "DELETE" });
    toast("Đã xóa", "success");
    setDel(null); setDeleting(false); fetchData();
  };

  const cols: Column<QA>[] = [
    { key: "question", label: "Câu hỏi (EN)", sortable: true },
    { key: "questionJa", label: "Câu hỏi (JA)" },
    { key: "order", label: "Thứ tự" },
  ];

  return (
    <AdminShell title="Q&A" actions={<Link href="/admin/qa/new" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"><Plus size={16} /> Thêm mới</Link>}>
      <DataTable columns={cols} data={data} loading={loading} onEdit={(r) => router.push(`/admin/qa/${r.id}`)} onDelete={setDel} />
      <ConfirmDialog open={!!del} message={`Xóa câu hỏi "${del?.question}"?`} onConfirm={handleDelete} onCancel={() => setDel(null)} loading={deleting} />
    </AdminShell>
  );
}
