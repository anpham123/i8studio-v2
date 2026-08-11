"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ImageUpload from "@/components/admin/ImageUpload";
import { useToast } from "@/components/admin/Toast";
import { Save } from "lucide-react";

export default function NewPortfolioPage() {
  const [form, setForm] = useState({ title: "", titleJa: "", description: "", descriptionJa: "", coverImage: "", category: "", order: "0" });
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.title) return toast("Title không được để trống", "error");
    setSaving(true);
    const res = await fetch("/api/portfolio", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, order: parseInt(form.order) || 0 }) });
    const data = await res.json();
    setSaving(false);
    if (data.data) { toast("Đã tạo", "success"); router.push(`/admin/portfolio/${data.data.id}`); }
    else toast("Lỗi", "error");
  };

  return (
    <AdminShell title="Thêm Portfolio" actions={<button onClick={save} disabled={saving} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"><Save size={15} /> Lưu</button>}>
      <div className="max-w-2xl space-y-5">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Tên (EN) *</label><input value={form.title} onChange={(e) => set("title", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Tên (JA)</label><input value={form.titleJa} onChange={(e) => set("titleJa", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Danh mục</label><input value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="3DCG, Animation, VR..." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Thứ tự</label><input type="number" value={form.order} onChange={(e) => set("order", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả (EN)</label><textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả (JA)</label><textarea value={form.descriptionJa} onChange={(e) => set("descriptionJa", e.target.value)} rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none" /></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <ImageUpload label="Ảnh bìa" value={form.coverImage} onChange={(url) => set("coverImage", url)} />
        </div>
      </div>
    </AdminShell>
  );
}
