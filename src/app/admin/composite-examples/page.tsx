"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import DataTable, { Column } from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { Plus } from "lucide-react";

interface CompositeExample {
  id: string;
  title: string;
  titleJp?: string | null;
  category: string;
  location?: string | null;
  beforeImage: string;
  afterImage: string;
  isFeatured: boolean;
  order: number;
  isPublished: boolean;
}

export default function CompositeExamplesPage() {
  const [data, setData] = useState<CompositeExample[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<CompositeExample | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/composite-examples");
    const json = await res.json();
    setData(json.data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await fetch(`/api/composite-examples/${deleteTarget.id}`, { method: "DELETE" });
    toast("Đã xóa", "success");
    setDeleteTarget(null);
    setDeleting(false);
    fetchData();
  };

  const columns: Column<CompositeExample>[] = [
    {
      key: "afterImage",
      label: "Ảnh ghép (After)",
      width: "w-20",
      render: (v) => v ? (
        <img src={String(v)} className="w-16 h-10 object-cover rounded border" alt="" />
      ) : (
        <div className="w-16 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-300 text-xs">N/A</div>
      ),
    },
    {
      key: "beforeImage",
      label: "Gốc (Before)",
      width: "w-20",
      render: (v) => v ? (
        <img src={String(v)} className="w-16 h-10 object-cover rounded border" alt="" />
      ) : (
        <div className="w-16 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-300 text-xs">N/A</div>
      ),
    },
    { key: "title", label: "Tên (EN)", sortable: true },
    { key: "category", label: "Danh mục", sortable: true },
    { key: "location", label: "Địa điểm" },
    {
      key: "order",
      label: "Thứ tự",
      sortable: true,
      render: (v, row) => (
        <input
          type="number"
          value={row.order}
          onChange={(e) => {
            const val = parseInt(e.target.value) || 0;
            setData((prev) => prev.map((item) => item.id === row.id ? { ...item, order: val } : item));
          }}
          onBlur={async (e) => {
            const val = parseInt(e.target.value) || 0;
            const res = await fetch(`/api/composite-examples/${row.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ order: val }),
            });
            const json = await res.json();
            if (json.data) toast("Đã cập nhật thứ tự", "success");
            else toast("Lỗi khi cập nhật", "error");
          }}
          className="w-16 border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-400 bg-white"
        />
      ),
    },
    {
      key: "isFeatured",
      label: "Nổi bật",
      sortable: true,
      render: (v, row) => (
        <div className="flex items-center gap-1.5">
          <input
            type="checkbox"
            checked={Boolean(row.isFeatured)}
            onChange={async (e) => {
              const checked = e.target.checked;
              setData((prev) => prev.map((item) => item.id === row.id ? { ...item, isFeatured: checked } : item));
              const res = await fetch(`/api/composite-examples/${row.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isFeatured: checked }),
              });
              const json = await res.json();
              if (json.data) toast("Đã cập nhật nổi bật", "success");
              else {
                toast("Lỗi khi cập nhật", "error");
                setData((prev) => prev.map((item) => item.id === row.id ? { ...item, isFeatured: !checked } : item));
              }
            }}
            className="rounded border-gray-300 h-4 w-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          {row.isFeatured && <span className="text-[10px] text-amber-500 font-semibold">★</span>}
        </div>
      ),
    },
    {
      key: "isPublished",
      label: "Công khai",
      sortable: true,
      render: (v, row) => (
        <input
          type="checkbox"
          checked={Boolean(row.isPublished)}
          onChange={async (e) => {
            const checked = e.target.checked;
            setData((prev) => prev.map((item) => item.id === row.id ? { ...item, isPublished: checked } : item));
            const res = await fetch(`/api/composite-examples/${row.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ isPublished: checked }),
            });
            const json = await res.json();
            if (json.data) toast("Đã cập nhật trạng thái", "success");
            else {
              toast("Lỗi khi cập nhật", "error");
              setData((prev) => prev.map((item) => item.id === row.id ? { ...item, isPublished: !checked } : item));
            }
          }}
          className="rounded border-gray-300 h-4 w-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
      ),
    },
  ];

  return (
    <AdminShell
      title={`Photo Composite Showcase (${data.length})`}
      actions={
        <Link href="/admin/composite-examples/new" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus size={16} /> Thêm mới
        </Link>
      }
    >
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        onEdit={(r) => router.push(`/admin/composite-examples/${r.id}`)}
        onDelete={setDeleteTarget}
        searchPlaceholder="Tìm kiếm..."
      />

      <ConfirmDialog
        open={!!deleteTarget}
        message={`Xóa ảnh ghép "${deleteTarget?.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </AdminShell>
  );
}
