"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { useToast } from "@/components/admin/Toast";
import { slugify } from "@/lib/utils";
import { Save } from "lucide-react";

export default function NewBlogCategoryPage() {
  const [form, setForm] = useState({ slug: "", nameJa: "", nameEn: "", order: "0", active: true });
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.nameJa && !form.nameEn) return toast("Tên không được để trống", "error");
    const slug = form.slug || slugify(form.nameEn || form.nameJa);
    setSaving(true);
    const res = await fetch("/api/blog-categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, slug, order: parseInt(form.order) || 0 }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.data) { toast("Đã tạo", "success"); router.push(`/admin/blog-categories/${data.data.id}`); }
    else toast("Lỗi", "error");
  };

  return (
    <AdminShell title="Thêm Blog Category" actions={<button onClick={save} disabled={saving} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"><Save size={15} /> Lưu</button>}>
      <div className="max-w-xl space-y-5">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Tên (JA)</label><input value={form.nameJa} onChange={(e) => { set("nameJa", e.target.value); if (!form.slug) set("slug", slugify(e.target.value)); }} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Tên (EN)</label><input value={form.nameEn} onChange={(e) => set("nameEn", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label><input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto-generated" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Thứ tự</label><input type="number" value={form.order} onChange={(e) => set("order", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" /></div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} id="active" className="rounded" />
            <label htmlFor="active" className="text-sm text-gray-700">Active</label>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
