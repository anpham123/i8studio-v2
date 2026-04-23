"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import DataTable, { Column } from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { Plus, Star } from "lucide-react";

interface Testimonial { id: string; clientName: string; clientCompany: string; rating: number; featured: boolean; order: number; }

export default function TestimonialsPage() {
  const [data, setData] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [del, setDel] = useState<Testimonial | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/testimonials");
    const json = await res.json();
    setData(json.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async () => {
    if (!del) return;
    setDeleting(true);
    await fetch(`/api/testimonials/${del.id}`, { method: "DELETE" });
    toast("Đã xóa", "success");
    setDel(null); setDeleting(false); fetchData();
  };

  const cols: Column<Testimonial>[] = [
    { key: "clientName", label: "Khách hàng", sortable: true },
    { key: "clientCompany", label: "Công ty" },
    { key: "rating", label: "Đánh giá", render: (v) => <div className="flex gap-0.5">{Array.from({ length: Number(v) }).map((_, i) => <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />)}</div> },
    { key: "featured", label: "Nổi bật", render: (v) => v ? <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">✓</span> : null },
    { key: "order", label: "Thứ tự" },
  ];

  return (
    <AdminShell title="Testimonials" actions={<Link href="/admin/testimonials/new" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"><Plus size={16} /> Thêm mới</Link>}>
      <DataTable columns={cols} data={data} loading={loading} onEdit={(r) => router.push(`/admin/testimonials/${r.id}`)} onDelete={setDel} />
      <ConfirmDialog open={!!del} message={`Xóa testimonial của "${del?.clientName}"?`} onConfirm={handleDelete} onCancel={() => setDel(null)} loading={deleting} />
    </AdminShell>
  );
}
