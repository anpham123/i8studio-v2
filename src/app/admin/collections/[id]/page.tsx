"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ImageUpload from "@/components/admin/ImageUpload";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { Save, Trash2, Loader2, X } from "lucide-react";

interface ColItem { id: string; image: string; captionJa: string; captionEn: string; order: number; }

export default function EditCollectionPage() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Record<string, string | boolean>>({});
  const [items, setItems] = useState<ColItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDel, setShowDel] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    Promise.all([
      fetch(`/api/collections/${id}`).then((r) => r.json()),
      fetch(`/api/collections/${id}/items`).then((r) => r.json()),
    ]).then(([col, itemsRes]) => {
      if (col.data) setForm({ ...col.data, order: String(col.data.order) });
      setItems(itemsRes.data || []);
      setLoading(false);
    });
  }, [id]);

  const save = async () => {
    setSaving(true);
    const res = await fetch(`/api/collections/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, order: parseInt(String(form.order)) || 0 }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.data) toast("Đã lưu", "success"); else toast("Lỗi", "error");
  };

  const addItem = async (imageUrl: string) => {
    if (!imageUrl) return;
    const res = await fetch(`/api/collections/${id}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageUrl, order: items.length }),
    });
    const data = await res.json();
    if (data.data) setItems((prev) => [...prev, data.data]);
  };

  const updateItem = async (itemId: string, field: string, value: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    await fetch(`/api/collection-items/${itemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    setItems((prev) => prev.map((i) => i.id === itemId ? { ...i, [field]: value } : i));
  };

  const deleteItem = async (itemId: string) => {
    await fetch(`/api/collection-items/${itemId}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    toast("Đã xóa ảnh", "success");
  };

  if (loading) return <AdminShell title="Collection"><div className="flex justify-center py-24"><Loader2 className="animate-spin text-blue-500" size={32} /></div></AdminShell>;

  return (
    <AdminShell title="Chỉnh sửa Collection" actions={<div className="flex gap-2"><button onClick={() => setShowDel(true)} className="border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm hover:bg-red-50"><Trash2 size={15} /></button><button onClick={save} disabled={saving} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"><Save size={15} /> Lưu</button></div>}>
      <div className="max-w-3xl space-y-5">
        {/* Basic info */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[["titleJa", "Tên (JA)"], ["titleEn", "Tên (EN)"]].map(([k, l]) => (
              <div key={k}><label className="block text-sm font-medium text-gray-700 mb-1.5">{l}</label><input value={String(form[k] || "")} onChange={(e) => set(k, e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" /></div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label><input value={String(form.slug || "")} onChange={(e) => set("slug", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Thứ tự</label><input type="number" value={String(form.order || "0")} onChange={(e) => set("order", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" /></div>
          </div>
          {[["descJa", "Mô tả (JA)"], ["descEn", "Mô tả (EN)"]].map(([k, l]) => (
            <div key={k}><label className="block text-sm font-medium text-gray-700 mb-1.5">{l}</label><textarea value={String(form[k] || "")} onChange={(e) => set(k, e.target.value)} rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none" /></div>
          ))}
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={!!form.active} onChange={(e) => set("active", e.target.checked)} id="active" className="rounded" />
            <label htmlFor="active" className="text-sm text-gray-700">Active</label>
          </div>
        </div>

        {/* Cover image */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <ImageUpload label="Ảnh bìa" value={String(form.coverImage || "")} onChange={(url) => set("coverImage", url)} />
        </div>

        {/* Collection Items (new) */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <label className="block text-sm font-medium text-gray-700">Ảnh gallery ({items.length})</label>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 items-start bg-gray-50 rounded-lg p-3">
                <div className="relative group shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt="" className="w-24 h-20 object-cover rounded-lg border" />
                  <button onClick={() => deleteItem(item.id)} className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                </div>
                <div className="flex-1 space-y-2">
                  <input value={item.captionJa} onChange={(e) => updateItem(item.id, "captionJa", e.target.value)} placeholder="Caption (JA)" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none" />
                  <input value={item.captionEn} onChange={(e) => updateItem(item.id, "captionEn", e.target.value)} placeholder="Caption (EN)" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none" />
                </div>
              </div>
            ))}
          </div>
          <ImageUpload label="Thêm ảnh mới" value="" onChange={(url) => addItem(url)} />
        </div>
      </div>
      <ConfirmDialog open={showDel} message={`Xóa "${form.titleJa}"?`} onConfirm={async () => { await fetch(`/api/collections/${id}`, { method: "DELETE" }); router.push("/admin/collections"); }} onCancel={() => setShowDel(false)} />
    </AdminShell>
  );
}
