"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ImageUpload from "@/components/admin/ImageUpload";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { Save, Trash2, Loader2 } from "lucide-react";

export default function EditServicePage() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDel, setShowDel] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    fetch(`/api/services/${id}`).then((r) => r.json()).then((d) => {
      if (d.data) setForm({ ...d.data, order: String(d.data.order) });
      setLoading(false);
    });
  }, [id]);

  const save = async () => {
    setSaving(true);
    const res = await fetch(`/api/services/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, order: parseInt(form.order) || 0 }) });
    const data = await res.json();
    setSaving(false);
    if (data.data) toast("Đã lưu", "success"); else toast("Lỗi", "error");
  };

  if (loading) return <AdminShell title="Dịch vụ"><div className="flex justify-center py-24"><Loader2 className="animate-spin text-blue-500" size={32} /></div></AdminShell>;

  return (
    <AdminShell title="Chỉnh sửa Dịch vụ" actions={<div className="flex gap-2"><button onClick={() => setShowDel(true)} className="border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm hover:bg-red-50"><Trash2 size={15} /></button><button onClick={save} disabled={saving} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"><Save size={15} /> Lưu</button></div>}>
      <div className="max-w-2xl space-y-5">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[["name", "Tên (EN)"], ["nameJa", "Tên (JA)"]].map(([k, l]) => (
              <div key={k}><label className="block text-sm font-medium text-gray-700 mb-1.5">{l}</label><input value={form[k] || ""} onChange={(e) => set(k, e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" /></div>
            ))}
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label><input value={form.slug || ""} onChange={(e) => set("slug", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Icon</label><input value={form.icon || ""} onChange={(e) => set("icon", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Thứ tự</label><input type="number" value={form.order || "0"} onChange={(e) => set("order", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" /></div>
          </div>
          {[["description", "Mô tả (EN)"], ["descriptionJa", "Mô tả (JA)"]].map(([k, l]) => (
            <div key={k}><label className="block text-sm font-medium text-gray-700 mb-1.5">{l}</label><textarea value={form[k] || ""} onChange={(e) => set(k, e.target.value)} rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none" /></div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            {[["priceHint", "Giá (EN)"], ["priceHintJa", "Giá (JA)"]].map(([k, l]) => (
              <div key={k}><label className="block text-sm font-medium text-gray-700 mb-1.5">{l}</label><input value={form[k] || ""} onChange={(e) => set(k, e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" /></div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <ImageUpload label="Ảnh dịch vụ" value={form.image || ""} onChange={(url) => set("image", url)} />
        </div>
      </div>
      <ConfirmDialog open={showDel} message={`Xóa "${form.name}"?`} onConfirm={async () => { await fetch(`/api/services/${id}`, { method: "DELETE" }); router.push("/admin/services"); }} onCancel={() => setShowDel(false)} />
    </AdminShell>
  );
}
