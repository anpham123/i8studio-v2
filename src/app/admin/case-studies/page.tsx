"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import DataTable, { Column } from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { Plus } from "lucide-react";

interface CaseStudy { id: string; title: string; client: string; serviceType: string; featured: boolean; createdAt: string; }

export default function CaseStudiesPage() {
  const [data, setData] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [del, setDel] = useState<CaseStudy | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/case-studies?limit=100");
    const json = await res.json();
    setData(json.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async () => {
    if (!del) return;
    setDeleting(true);
    await fetch(`/api/case-studies/${del.id}`, { method: "DELETE" });
    toast("Đã xóa", "success");
    setDel(null); setDeleting(false); fetchData();
  };

  const cols: Column<CaseStudy>[] = [
    { key: "title", label: "Tiêu đề", sortable: true },
    { key: "client", label: "Khách hàng" },
    { key: "serviceType", label: "Loại dịch vụ" },
    { key: "featured", label: "Nổi bật", render: (v) => v ? <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">✓</span> : null },
  ];

  return (
    <AdminShell title="Case Studies" actions={<Link href="/admin/case-studies/new" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"><Plus size={16} /> Thêm mới</Link>}>
      <DataTable columns={cols} data={data} loading={loading} onEdit={(r) => router.push(`/admin/case-studies/${r.id}`)} onDelete={setDel} />
      <ConfirmDialog open={!!del} message={`Xóa case study "${del?.title}"?`} onConfirm={handleDelete} onCancel={() => setDel(null)} loading={deleting} />
    </AdminShell>
  );
}
