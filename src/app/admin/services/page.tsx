"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import DataTable, { Column } from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { Plus, Eye, EyeOff, Loader2 } from "lucide-react";

interface Service {
  id: string;
  name: string;
  nameJa: string;
  slug: string;
  priceHint: string;
  order: number;
  icon: string;
  image: string;
  isPublished: boolean;
}

export default function ServicesPage() {
  const [data, setData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleToggleVisibility = async (row: Service, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextPublished = !row.isPublished;
    setTogglingId(row.id);

    try {
      const [svcRes] = await Promise.all([
        fetch(`/api/services/${row.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isPublished: nextPublished, order: row.order }),
        }),
        fetch("/api/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [`serviceVisible_${row.slug}`]: nextPublished ? "true" : "false" }),
        }),
      ]);

      if (svcRes.ok) {
        setData((prev) =>
          prev.map((item) => (item.id === row.id ? { ...item, isPublished: nextPublished } : item))
        );
        toast(
          nextPublished
            ? `Đã HIỆN "${row.name}" trên menu Solution`
            : `Đã ẨN "${row.name}" khỏi menu Solution`,
          "success"
        );
      } else {
        toast("Không thể cập nhật trạng thái", "error");
      }
    } catch {
      toast("Lỗi kết nối", "error");
    } finally {
      setTogglingId(null);
    }
  };

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
      key: "image",
      label: "Ảnh",
      width: "w-16",
      render: (v) =>
        v ? (
          <img src={String(v)} className="w-14 h-11 object-cover rounded-lg" alt="" />
        ) : (
          <div className="w-14 h-11 bg-gray-100 rounded-lg" />
        ),
    },
    { key: "name", label: "Tên dịch vụ", sortable: true },
    {
      key: "slug",
      label: "Slug",
      render: (v) => (
        <code className="text-xs text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded">{String(v)}</code>
      ),
    },
    { key: "priceHint", label: "Giá tham khảo" },
    {
      key: "isPublished",
      label: "Hiển thị ở Solution (Bấm để Ẩn / Hiện)",
      render: (_v, row) => {
        const isBusy = togglingId === row.id;
        return (
          <button
            type="button"
            disabled={isBusy}
            onClick={(e) => handleToggleVisibility(row, e)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shadow-xs ${
              row.isPublished
                ? "bg-green-100 text-green-700 hover:bg-green-200 border border-green-200"
                : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-200"
            }`}
            title={
              row.isPublished
                ? "Đang hiển thị trên trang Solution — Bấm để ẨN"
                : "Đang ẩn khỏi trang Solution — Bấm để HIỆN LÊN"
            }
          >
            {isBusy ? (
              <Loader2 size={13} className="animate-spin" />
            ) : row.isPublished ? (
              <Eye size={13} />
            ) : (
              <EyeOff size={13} />
            )}
            {row.isPublished ? "Đang hiện (Bấm để Ẩn)" : "Đang ẩn (Bấm để Hiện)"}
          </button>
        );
      },
    },
    { key: "order", label: "Thứ tự", sortable: true },
  ];

  return (
    <AdminShell
      title={`Dịch vụ / Menu Solution (${data.length})`}
      actions={
        <Link
          href="/admin/services/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          <Plus size={16} /> Thêm mới
        </Link>
      }
    >
      <DataTable
        columns={cols}
        data={data}
        loading={loading}
        onEdit={(r) => router.push(`/admin/services/${r.id}`)}
        onDelete={setDel}
        searchPlaceholder="Tìm dịch vụ..."
      />
      <ConfirmDialog
        open={!!del}
        message={`Xóa "${del?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDel(null)}
        loading={deleting}
      />
    </AdminShell>
  );
}
