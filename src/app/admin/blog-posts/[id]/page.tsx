"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import BlogPostForm from "@/components/admin/BlogPostForm";
import { Loader2 } from "lucide-react";

export default function EditBlogPostPage() {
  const params = useParams();
  const [data, setData] = useState<null | Record<string, unknown>>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blog-posts/${params.id}`)
      .then((r) => r.json())
      .then((json) => { setData(json.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <AdminShell title="Blog Post">
        <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-blue-500" /></div>
      </AdminShell>
    );
  }

  if (!data) {
    return (
      <AdminShell title="Blog Post">
        <p className="text-center text-gray-400 py-20">Không tìm thấy bài viết</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Chỉnh sửa Blog Post">
      <BlogPostForm initial={data as never} />
    </AdminShell>
  );
}
