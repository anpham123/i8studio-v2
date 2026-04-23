"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import RichEditor from "@/components/admin/RichEditor";
import ImageUpload from "@/components/admin/ImageUpload";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { slugify } from "@/lib/utils";
import { Save, Eye, Trash2, Loader2, ExternalLink } from "lucide-react";

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetch(`/api/posts/${id}`).then((r) => r.json()).then((d) => {
      if (d.data) setForm({ ...d.data, publishedAt: d.data.publishedAt?.split("T")[0] || "" });
      setLoading(false);
    });
  }, [id]);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = async (publish?: boolean) => {
    setSaving(true);
    const body = { ...form, ...(publish !== undefined && { status: publish ? "PUBLISHED" : "DRAFT" }) };
    const res = await fetch(`/api/posts/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    setSaving(false);
    if (data.data) { toast("Đã lưu", "success"); setForm({ ...data.data, publishedAt: data.data.publishedAt?.split("T")[0] || "" }); }
    else toast("Lỗi khi lưu", "error");
  };

  const handleDelete = async () => {
    setDeleting(true);
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    toast("Đã xóa bài đăng", "success");
    router.push("/admin/posts");
  };

  if (loading) return (
    <AdminShell title="Chỉnh sửa bài đăng">
      <div className="flex items-center justify-center py-24"><Loader2 className="animate-spin text-blue-500" size={32} /></div>
    </AdminShell>
  );

  return (
    <AdminShell
      title="Chỉnh sửa bài đăng"
      actions={
        <div className="flex gap-2">
          <button onClick={() => setShowDelete(true)} className="flex items-center gap-2 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm hover:bg-red-50">
            <Trash2 size={15} />
          </button>
          {form.status === "PUBLISHED" && (
            <a href={`/en/news/${form.slug}`} target="_blank" className="flex items-center gap-2 border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-50">
              <ExternalLink size={15} />
            </a>
          )}
          <button onClick={() => save(false)} disabled={saving} className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50">
            <Save size={15} /> Lưu nháp
          </button>
          <button onClick={() => save(true)} disabled={saving} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
            <Eye size={15} /> {form.status === "PUBLISHED" ? "Cập nhật" : "Đăng"}
          </button>
        </div>
      }
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tiêu đề (EN) *</label>
              <input value={form.title || ""} onChange={(e) => { set("title", e.target.value); if (!form.slug) set("slug", slugify(e.target.value)); }}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tiêu đề (JA)</label>
              <input value={form.titleJa || ""} onChange={(e) => set("titleJa", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label>
              <input value={form.slug || ""} onChange={(e) => set("slug", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Excerpt (EN)</label>
                <textarea value={form.excerpt || ""} onChange={(e) => set("excerpt", e.target.value)} rows={3}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Excerpt (JA)</label>
                <textarea value={form.excerptJa || ""} onChange={(e) => set("excerptJa", e.target.value)} rows={3}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <RichEditor label="Nội dung (EN)" value={form.content || ""} onChange={(v) => set("content", v)} />
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <RichEditor label="Nội dung (JA)" value={form.contentJa || ""} onChange={(v) => set("contentJa", v)} />
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-gray-700 text-sm">SEO</h3>
            <input value={form.metaTitle || ""} onChange={(e) => set("metaTitle", e.target.value)} placeholder="Meta Title"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
            <textarea value={form.metaDescription || ""} onChange={(e) => set("metaDescription", e.target.value)} rows={2} placeholder="Meta Description"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
          </div>
        </div>
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-gray-700 text-sm">Thiết lập</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Danh mục</label>
              <select value={form.category || "NEWS"} onChange={(e) => set("category", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                <option value="NEWS">News</option>
                <option value="BLOG">Blog</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Trạng thái</label>
              <select value={form.status || "DRAFT"} onChange={(e) => set("status", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                <option value="DRAFT">Nháp</option>
                <option value="PUBLISHED">Đã đăng</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Ngày đăng</label>
              <input type="date" value={form.publishedAt || ""} onChange={(e) => set("publishedAt", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <ImageUpload label="Ảnh bìa" value={form.coverImage || ""} onChange={(url) => set("coverImage", url)} />
          </div>
        </div>
      </div>
      <ConfirmDialog
        open={showDelete}
        message={`Xóa bài "${form.title}"? Hành động không thể hoàn tác.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        loading={deleting}
      />
    </AdminShell>
  );
}
