"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ImageUpload from "@/components/admin/ImageUpload";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { Save, Trash2, Loader2, Plus, X } from "lucide-react";

export default function EditPortfolioPage() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Record<string, string | boolean>>({});
  const [gallery, setGallery] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDel, setShowDel] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    fetch(`/api/portfolio/${id}`).then((r) => r.json()).then((d) => {
      if (d.data) {
        setForm({ ...d.data, order: String(d.data.order) });
        try { setGallery(JSON.parse(d.data.galleryJson || "[]")); } catch { setGallery([]); }
      }
      setLoading(false);
    });
  }, [id]);

  const save = async () => {
    setSaving(true);
    const res = await fetch(`/api/portfolio/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        order: parseInt(String(form.order)) || 0,
        isPublished: !!form.isPublished,
        galleryJson: JSON.stringify(gallery),
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.data) toast("Đã lưu", "success"); else toast("Lỗi", "error");
  };

  if (loading) return <AdminShell title="Portfolio"><div className="flex justify-center py-24"><Loader2 className="animate-spin text-blue-500" size={32} /></div></AdminShell>;

  return (
    <AdminShell
      title="Chỉnh sửa Portfolio"
      actions={
        <div className="flex gap-2">
          <button onClick={() => setShowDel(true)} className="border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm hover:bg-red-50"><Trash2 size={15} /></button>
          <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"><Save size={15} /> Lưu</button>
        </div>
      }
    >
      <div className="max-w-2xl space-y-5">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Tên (EN)</label><input value={String(form.title || "")} onChange={(e) => set("title", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Tên (JA)</label><input value={String(form.titleJa || "")} onChange={(e) => set("titleJa", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Danh mục</label><input value={String(form.category || "")} onChange={(e) => set("category", e.target.value)} placeholder="3DCG, Animation, VR..." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Thứ tự</label><input type="number" value={String(form.order || "0")} onChange={(e) => set("order", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" /></div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" checked={!!form.isPublished} onChange={(e) => set("isPublished", e.target.checked)} id="isPublished" className="rounded" />
            <label htmlFor="isPublished" className="text-sm text-gray-700">Published</label>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả (EN)</label><textarea value={String(form.description || "")} onChange={(e) => set("description", e.target.value)} rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả (JA)</label><textarea value={String(form.descriptionJa || "")} onChange={(e) => set("descriptionJa", e.target.value)} rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none" /></div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <ImageUpload label="Ảnh bìa" value={String(form.coverImage || "")} onChange={(url) => set("coverImage", url)} />
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-800">Gallery ({gallery.length} ảnh)</h3>
            <button onClick={() => setGallery((g) => [...g, ""])} className="flex items-center gap-1 text-blue-600 text-xs font-medium hover:text-blue-700"><Plus size={14} /> Thêm ảnh</button>
          </div>
          {gallery.map((img, i) => (
            <div key={i} className="relative">
              <button onClick={() => setGallery((g) => g.filter((_, j) => j !== i))} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-700 flex items-center justify-center z-10"><X size={12} /></button>
              <ImageUpload label={`Ảnh ${i + 1}`} value={img} onChange={(url) => { const n = [...gallery]; n[i] = url; setGallery(n); }} />
            </div>
          ))}
        </div>
      </div>

      <ConfirmDialog open={showDel} message={`Xóa "${form.title}"?`} onConfirm={async () => { await fetch(`/api/portfolio/${id}`, { method: "DELETE" }); router.push("/admin/portfolio"); }} onCancel={() => setShowDel(false)} />
    </AdminShell>
  );
}
