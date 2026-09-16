"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import DataTable, { Column } from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { Plus } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  isPublished: boolean;
  isFeatured: boolean;
  locale: string;
  publishedAt: string;
  coverImage?: string;
  heroImage?: string;
}

export default function AdminBlogPostsPage() {
  const [data, setData] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/blog-posts?limit=100&_t=${Date.now()}`);
    const json = await res.json();
    setData(json.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await fetch(`/api/blog-posts/${deleteTarget.id}`, { method: "DELETE" });
    toast("Đã xóa", "success");
    setDeleteTarget(null);
    setDeleting(false);
    fetchData();
  };

  const columns: Column<BlogPost>[] = [
    {
      key: "coverImage", label: "Ảnh", width: "w-16",
      render: (_v, row) => {
        const img = row.coverImage || row.heroImage;
        return img
          ? <img src={img} className="w-14 h-11 object-cover rounded" alt="" />
          : <div className="w-14 h-11 bg-gray-100 rounded flex items-center justify-center text-gray-300 text-xs">N/A</div>;
      },
    },
    {
      key: "title", label: "Tiêu đề", sortable: true,
      render: (v) => <span className="font-medium" dangerouslySetInnerHTML={{ __html: String(v) }} />,
    },
    { key: "category", label: "Category" },
    {
      key: "locale", label: "Ngôn ngữ",
      render: (v) => <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{String(v).toUpperCase()}</span>,
    },
    {
      key: "isPublished", label: "Trạng thái",
      render: (_v, row) => {
        if (!row.isPublished) {
          return (
            <span className="inline-flex items-center gap-1.5 text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Bản nháp
            </span>
          );
        }
        const isScheduled = row.publishedAt && new Date(row.publishedAt).getTime() > Date.now();
        if (isScheduled) {
          return (
            <span className="inline-flex items-center gap-1.5 text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 rounded-full font-medium" title={`Lên lịch: ${formatDate(new Date(row.publishedAt), "HH:mm dd/MM/yyyy")}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
              Lên lịch ({formatDate(new Date(row.publishedAt), "HH:mm dd/MM")})
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Đã đăng
          </span>
        );
      },
    },
    {
      key: "isFeatured", label: "Nổi bật",
      render: (v) => v ? <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-medium">★ Featured</span> : null,
    },
    {
      key: "publishedAt", label: "Thời gian đăng", sortable: true,
      render: (v) => {
        try {
          return <span className="text-xs text-gray-500 font-mono">{formatDate(new Date(String(v)), "HH:mm dd/MM/yyyy")}</span>;
        } catch {
          return <span className="text-xs text-gray-400">—</span>;
        }
      },
    },
  ];

  return (
    <AdminShell
      title={`Blog Posts (${data.length})`}
      actions={
        <Link href="/admin/blog-posts/new" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus size={16} /> Thêm mới
        </Link>
      }
    >
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        onEdit={(r) => router.push(`/admin/blog-posts/${r.id}`)}
        onDelete={setDeleteTarget}
        searchPlaceholder="Tìm blog post..."
      />
      <ConfirmDialog
        open={!!deleteTarget}
        message={`Xóa "${deleteTarget?.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </AdminShell>
  );
}
