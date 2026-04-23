"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ImageUpload from "@/components/admin/ImageUpload";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { Save, Trash2, Loader2 } from "lucide-react";

export default function EditWorkPage() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Record<string, string | boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    fetch(`/api/works/${id}`).then((r) => r.json()).then((d) => { if (d.data) setForm({ ...d.data, order: String(d.data.order) }); setLoading(false); });
  }, [id]);

  const save = async () => {
    setSaving(true);
    const res = await fetch(`/api/works/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, order: parseInt(String(form.order)) || 0 }) });
    const data = await res.json();
    setSaving(false);
    if (data.data) toast("Đã lưu", "success"); else toast("Lỗi", "error");
  };

  const handleDelete = async () => {
    await fetch(`/api/works/${id}`, { method: "DELETE" });
    toast("Đã xóa", "success");
    router.push("/admin/works");
  };

  if (loading) return <AdminShell title="Chỉnh sửa Work"><div className="flex justify-center py-24"><Loader2 className="animate-spin text-blue-500" size={32} /></div></AdminShell>;

  return (
    <AdminShell title="Chỉnh sửa Work" actions={<div className="flex gap-2"><button onClick={() => setShowDelete(true)} className="border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm hover:bg-red-50"><Trash2 size={15} /></button><button onClick={save} disabled={saving} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"><Save size={15} /> Lưu</button></div>}>
      <div className="max-w-2xl space-y-5">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Tên (EN)</label><input value={String(form.title || "")} onChange={(e) => set("title", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Tên (JA)</label><input value={String(form.titleJa || "")} onChange={(e) => set("titleJa", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Subtitle</label><input value={String(form.subtitle || "")} onChange={(e) => set("subtitle", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Danh mục</label>
              <select value={String(form.category || "3DCG")} onChange={(e) => set("category", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm">
                <option>3DCG</option><option>Animation</option><option>VR</option><option>BIM</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Thứ tự</label><input type="number" value={String(form.order || "0")} onChange={(e) => set("order", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Video URL</label><input value={String(form.videoUrl || "")} onChange={(e) => set("videoUrl", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" /></div>
          <div className="flex items-center gap-2"><input type="checkbox" id="featured" checked={Boolean(form.featured)} onChange={(e) => set("featured", e.target.checked)} className="rounded" /><label htmlFor="featured" className="text-sm text-gray-700">Nổi bật</label></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <ImageUpload label="Ảnh" value={String(form.image || "")} onChange={(url) => set("image", url)} />
        </div>
      </div>
      <ConfirmDialog open={showDelete} message={`Xóa "${form.title}"?`} onConfirm={handleDelete} onCancel={() => setShowDelete(false)} />
    </AdminShell>
  );
}
