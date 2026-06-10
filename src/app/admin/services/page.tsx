"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import DataTable, { Column } from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { Plus } from "lucide-react";

interface Service { id: string; name: string; slug: string; priceHint: string; order: number; icon: string; image: string; }

export default function ServicesPage() {
  const [data, setData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [del, setDel] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/services");
    const json = await res.json();
    setData(json.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async () => {
    if (!del) return;
    setDeleting(true);
    await fetch(`/api/services/${del.id}`, { method: "DELETE" });
    toast("Đã xóa dịch vụ", "success");
    setDel(null);
    setDeleting(false);
    fetchData();
  };

  const cols: Column<Service>[] = [
    {
      key: "image", label: "Ảnh", width: "w-16",
      render: (v) => v
        ? <img src={String(v)} className="w-14 h-11 object-cover rounded-lg" alt="" />
        : <div className="w-14 h-11 bg-gray-100 rounded-lg" />,
    },
    { key: "name", label: "Tên dịch vụ", sortable: true },
    { key: "slug", label: "Slug", render: (v) => <code className="text-xs text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded">{String(v)}</code> },
    { key: "priceHint", label: "Giá tham khảo" },
    { key: "order", label: "Thứ tự", sortable: true },
  ];

  return (
    <AdminShell title={`Dịch vụ (${data.length})`} actions={<Link href="/admin/services/new" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"><Plus size={16} /> Thêm mới</Link>}>
      <DataTable columns={cols} data={data} loading={loading} onEdit={(r) => router.push(`/admin/services/${r.id}`)} onDelete={setDel} searchPlaceholder="Tìm dịch vụ..." />
      <ConfirmDialog open={!!del} message={`Xóa "${del?.name}"?`} onConfirm={handleDelete} onCancel={() => setDel(null)} loading={deleting} />
    </AdminShell>
  );
}
