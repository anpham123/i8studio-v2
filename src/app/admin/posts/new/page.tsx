"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import RichEditor from "@/components/admin/RichEditor";
import ImageUpload from "@/components/admin/ImageUpload";
import { useToast } from "@/components/admin/Toast";
import { slugify } from "@/lib/utils";
import { Save, Eye } from "lucide-react";

const defaultForm = {
  title: "", titleJa: "", slug: "", content: "", contentJa: "",
  excerpt: "", excerptJa: "", coverImage: "", category: "NEWS",
  status: "DRAFT", metaTitle: "", metaDescription: "",
};

export default function NewPostPage() {
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleTitleChange = (v: string) => {
    setForm((f) => ({ ...f, title: v, slug: f.slug || slugify(v) }));
  };

  const save = async (publish = false) => {
    if (!form.title) return toast("Tiêu đề không được để trống", "error");
    setSaving(true);
    const body = { ...form, status: publish ? "PUBLISHED" : form.status };
    const res = await fetch("/api/posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    setSaving(false);
    if (data.data) { toast("Đã tạo bài đăng", "success"); router.push(`/admin/posts/${data.data.id}`); }
    else toast(data.error || "Lỗi khi lưu", "error");
  };

  return (
    <AdminShell
      title="Tạo bài đăng mới"
      actions={
        <div className="flex gap-2">
          <button onClick={() => save(false)} disabled={saving} className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50">
            <Save size={15} /> Lưu nháp
          </button>
          <button onClick={() => save(true)} disabled={saving} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
            <Eye size={15} /> Đăng
          </button>
        </div>
      }
    >
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tiêu đề (EN) *</label>
              <input value={form.title} onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                placeholder="Nhập tiêu đề bài viết..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tiêu đề (JA)</label>
              <input value={form.titleJa} onChange={(e) => set("titleJa", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                placeholder="日本語タイトル" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label>
              <input value={form.slug} onChange={(e) => set("slug", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                placeholder="slug-url-bai-viet" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Excerpt (EN)</label>
                <textarea value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} rows={3}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  placeholder="Tóm tắt ngắn..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Excerpt (JA)</label>
                <textarea value={form.excerptJa} onChange={(e) => set("excerptJa", e.target.value)} rows={3}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  placeholder="概要..." />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <RichEditor label="Nội dung (EN)" value={form.content} onChange={(v) => set("content", v)} />
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <RichEditor label="Nội dung (JA)" value={form.contentJa} onChange={(v) => set("contentJa", v)} />
          </div>

          {/* SEO */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-gray-700 text-sm">SEO</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Title</label>
              <input value={form.metaTitle} onChange={(e) => set("metaTitle", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Description</label>
              <textarea value={form.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} rows={2}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-gray-700 text-sm">Thiết lập</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Danh mục</label>
              <select value={form.category} onChange={(e) => set("category", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400">
                <option value="NEWS">News</option>
                <option value="BLOG">Blog</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Trạng thái</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400">
                <option value="DRAFT">Nháp</option>
                <option value="PUBLISHED">Đã đăng</option>
              </select>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <ImageUpload label="Ảnh bìa" value={form.coverImage} onChange={(url) => set("coverImage", url)} />
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
