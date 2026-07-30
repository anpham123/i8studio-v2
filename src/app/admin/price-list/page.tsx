"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import DataTable, { Column } from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { Plus } from "lucide-react";

interface PriceItem {
  id: string;
  serviceSlug: string;
  titleJa: string;
  titleEn: string;
  priceFrom: string;
  order: number;
  icon: string;
}

export default function PriceListPage() {
  const [data, setData] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [del, setDel] = useState<PriceItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/price-items");
    const json = await res.json();
    setData(json.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async () => {
    if (!del) return;
    setDeleting(true);
    await fetch(`/api/price-items/${del.id}`, { method: "DELETE" });
    toast("Đã xóa", "success");
    setDel(null);
    setDeleting(false);
    fetchData();
  };

  const cols: Column<PriceItem>[] = [
    { key: "icon", label: "Icon", width: "w-12", render: (v) => <span className="text-xl">{String(v) || "📦"}</span> },
    { key: "titleJa", label: "Tên (JA)", sortable: true },
    { key: "titleEn", label: "Tên (EN)" },
    { key: "serviceSlug", label: "Dịch vụ", render: (v) => <code className="text-xs text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded">{String(v) || "—"}</code> },
    { key: "priceFrom", label: "Giá từ", render: (v) => <span className="font-medium text-gray-700">{String(v) || "ASK"}</span> },
    { key: "order", label: "Thứ tự", sortable: true },
  ];

  return (
    <AdminShell title={`Bảng giá (${data.length})`} actions={<Link href="/admin/price-list/new" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"><Plus size={16} /> Thêm mới</Link>}>
      <DataTable columns={cols} data={data} loading={loading} onEdit={(r) => router.push(`/admin/price-list/${r.id}`)} onDelete={setDel} searchPlaceholder="Tìm mục giá..." />
      <ConfirmDialog open={!!del} message={`Xóa "${del?.titleJa || del?.titleEn}"?`} onConfirm={handleDelete} onCancel={() => setDel(null)} loading={deleting} />
    </AdminShell>
  );
}
