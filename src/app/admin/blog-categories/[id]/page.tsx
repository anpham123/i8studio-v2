"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { Save, Trash2, Loader2 } from "lucide-react";

export default function EditBlogCategoryPage() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Record<string, string | boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDel, setShowDel] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    fetch(`/api/blog-categories/${id}`).then((r) => r.json()).then((d) => {
      if (d.data) setForm({ ...d.data, order: String(d.data.order) });
      setLoading(false);
    });
  }, [id]);

  const save = async () => {
    setSaving(true);
    const res = await fetch(`/api/blog-categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, order: parseInt(String(form.order)) || 0 }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.data) toast("Đã lưu", "success"); else toast("Lỗi", "error");
  };

  if (loading) return <AdminShell title="Blog Category"><div className="flex justify-center py-24"><Loader2 className="animate-spin text-blue-500" size={32} /></div></AdminShell>;

  return (
    <AdminShell title="Chỉnh sửa Blog Category" actions={<div className="flex gap-2"><button onClick={() => setShowDel(true)} className="border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm hover:bg-red-50"><Trash2 size={15} /></button><button onClick={save} disabled={saving} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"><Save size={15} /> Lưu</button></div>}>
      <div className="max-w-xl space-y-5">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Tên (JA)</label><input value={String(form.nameJa || "")} onChange={(e) => set("nameJa", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Tên (EN)</label><input value={String(form.nameEn || "")} onChange={(e) => set("nameEn", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label><input value={String(form.slug || "")} onChange={(e) => set("slug", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Thứ tự</label><input type="number" value={String(form.order || "0")} onChange={(e) => set("order", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" /></div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={!!form.active} onChange={(e) => set("active", e.target.checked)} id="active" className="rounded" />
            <label htmlFor="active" className="text-sm text-gray-700">Active</label>
          </div>
        </div>
      </div>
      <ConfirmDialog open={showDel} message={`Xóa "${form.nameJa || form.nameEn}"?`} onConfirm={async () => { await fetch(`/api/blog-categories/${id}`, { method: "DELETE" }); router.push("/admin/blog-categories"); }} onCancel={() => setShowDel(false)} />
    </AdminShell>
  );
}
