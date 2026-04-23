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

interface Post {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  publishedAt: string | null;
  createdAt: string;
}

const statusBadge: Record<string, string> = {
  PUBLISHED: "bg-green-100 text-green-700",
  DRAFT: "bg-gray-100 text-gray-600",
};

export default function PostsPage() {
  const [data, setData] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "10", search, ...(category && { category }), ...(status && { status }) });
    const res = await fetch(`/api/posts?${params}`);
    const json = await res.json();
    setData(json.data || []);
    setTotal(json.total || 0);
    setLoading(false);
  }, [page, search, category, status]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await fetch(`/api/posts/${deleteTarget.id}`, { method: "DELETE" });
    toast("Đã xóa bài đăng", "success");
    setDeleteTarget(null);
    setDeleting(false);
    fetchData();
  };

  const columns: Column<Post>[] = [
    {
      key: "title", label: "Tiêu đề", sortable: true,
      render: (v, row) => (
        <div>
          <p className="font-medium text-gray-800 line-clamp-1">{String(v)}</p>
          <p className="text-xs text-gray-400">/news/{row.slug}</p>
        </div>
      ),
    },
    {
      key: "category", label: "Danh mục",
      render: (v) => <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{String(v)}</span>,
    },
    {
      key: "status", label: "Trạng thái",
      render: (v) => <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusBadge[String(v)] || "bg-gray-100 text-gray-600"}`}>{String(v)}</span>,
    },
    {
      key: "createdAt", label: "Ngày tạo", sortable: true,
      render: (v) => <span className="text-xs text-gray-500">{formatDate(String(v), "dd/MM/yyyy")}</span>,
    },
  ];

  return (
    <AdminShell
      title="Bài đăng"
      actions={
        <Link href="/admin/posts/new" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
          <Plus size={16} /> Tạo mới
        </Link>
      }
    >
      <DataTable
        columns={columns} data={data} total={total} page={page} limit={10} loading={loading}
        searchPlaceholder="Tìm bài đăng..."
        onEdit={(row) => router.push(`/admin/posts/${row.id}`)}
        onDelete={setDeleteTarget}
        onPageChange={setPage}
        onSearch={(q) => { setSearch(q); setPage(1); }}
        filters={
          <>
            <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
              <option value="">Tất cả danh mục</option>
              <option value="NEWS">News</option>
              <option value="BLOG">Blog</option>
            </select>
            <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
              <option value="">Tất cả trạng thái</option>
              <option value="PUBLISHED">Đã đăng</option>
              <option value="DRAFT">Nháp</option>
            </select>
          </>
        }
      />
      <ConfirmDialog
        open={!!deleteTarget}
        message={`Bạn có chắc muốn xóa bài "${deleteTarget?.title}"? Hành động này không thể hoàn tác.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </AdminShell>
  );
}
