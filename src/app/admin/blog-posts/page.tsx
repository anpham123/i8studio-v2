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
  coverImage: string;
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
    const res = await fetch("/api/blog-posts?limit=100");
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
      render: (v) => v
        ? <img src={String(v)} className="w-14 h-11 object-cover rounded" alt="" />
        : <div className="w-14 h-11 bg-gray-100 rounded flex items-center justify-center text-gray-300 text-xs">N/A</div>,
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
      render: (v) => v
        ? <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-medium">Published</span>
        : <span className="text-xs bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded-full font-medium">Draft</span>,
    },
    {
      key: "isFeatured", label: "Nổi bật",
      render: (v) => v ? <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-medium">★ Featured</span> : null,
    },
    {
      key: "publishedAt", label: "Ngày đăng", sortable: true,
      render: (v) => <span className="text-xs text-gray-500">{formatDate(new Date(String(v)))}</span>,
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
