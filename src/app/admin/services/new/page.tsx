"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ImageUpload from "@/components/admin/ImageUpload";
import { useToast } from "@/components/admin/Toast";
import { slugify } from "@/lib/utils";
import { Save } from "lucide-react";

export default function NewServicePage() {
  const [form, setForm] = useState({ name: "", nameJa: "", slug: "", description: "", descriptionJa: "", icon: "", image: "", priceHint: "", priceHintJa: "", order: "0" });
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name) return toast("Tên không được để trống", "error");
    if (!form.slug) form.slug = slugify(form.name);
    setSaving(true);
    const res = await fetch("/api/services", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, order: parseInt(form.order) || 0 }) });
    const data = await res.json();
    setSaving(false);
    if (data.data) { toast("Đã tạo", "success"); router.push(`/admin/services/${data.data.id}`); }
    else toast("Lỗi", "error");
  };

  const Field = ({ k, label, placeholder }: { k: string; label: string; placeholder?: string }) => (
    <div><label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input value={form[k as keyof typeof form]} onChange={(e) => { set(k, e.target.value); if (k === "name" && !form.slug) set("slug", slugify(e.target.value)); }}
        placeholder={placeholder} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
    </div>
  );

  return (
    <AdminShell title="Thêm Dịch vụ" actions={<button onClick={save} disabled={saving} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"><Save size={15} /> Lưu</button>}>
      <div className="max-w-2xl space-y-5">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4"><Field k="name" label="Tên (EN) *" /><Field k="nameJa" label="Tên (JA)" /></div>
          <Field k="slug" label="Slug" placeholder="auto-generated" />
          <div className="grid grid-cols-2 gap-4"><Field k="icon" label="Icon (lucide name)" placeholder="Box" /><div><label className="block text-sm font-medium text-gray-700 mb-1.5">Thứ tự</label><input type="number" value={form.order} onChange={(e) => set("order", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" /></div></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả (EN)</label><textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả (JA)</label><textarea value={form.descriptionJa} onChange={(e) => set("descriptionJa", e.target.value)} rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none" /></div>
          <div className="grid grid-cols-2 gap-4"><Field k="priceHint" label="Giá (EN)" placeholder="From ¥50,000" /><Field k="priceHintJa" label="Giá (JA)" placeholder="¥50,000〜" /></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <ImageUpload label="Ảnh dịch vụ" value={form.image} onChange={(url) => set("image", url)} />
        </div>
      </div>
    </AdminShell>
  );
}
