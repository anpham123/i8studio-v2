"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ImageUpload from "@/components/admin/ImageUpload";
import { useToast } from "@/components/admin/Toast";
import { Save } from "lucide-react";

export default function NewSlidePage() {
  const [form, setForm] = useState({ title: "", titleJa: "", subtitle: "", subtitleJa: "", image: "", gradient: "", order: "0", active: true });
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.title) return toast("Tiêu đề không được để trống", "error");
    setSaving(true);
    const res = await fetch("/api/slides", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, order: parseInt(form.order) || 0 }) });
    const data = await res.json();
    setSaving(false);
    if (data.data) { toast("Đã tạo", "success"); router.push(`/admin/slides/${data.data.id}`); }
    else toast("Lỗi", "error");
  };

  return (
    <AdminShell title="Thêm Slide" actions={<button onClick={save} disabled={saving} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"><Save size={15} /> Lưu</button>}>
      <div className="max-w-2xl space-y-5">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[["title","Tiêu đề (EN) *"],["titleJa","Tiêu đề (JA)"],["subtitle","Phụ đề (EN)"],["subtitleJa","Phụ đề (JA)"]].map(([k,l]) => (
              <div key={k}><label className="block text-sm font-medium text-gray-700 mb-1.5">{l}</label><input value={String((form as Record<string, string | boolean>)[k] || "")} onChange={(e) => set(k, e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" /></div>
            ))}
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Gradient CSS classes</label><input value={form.gradient} onChange={(e) => set("gradient", e.target.value)} placeholder="from-blue-900 via-purple-900 to-slate-900" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Thứ tự</label><input type="number" value={form.order} onChange={(e) => set("order", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" /></div>
            <div className="flex items-end pb-2.5"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} className="rounded" /><span className="text-sm text-gray-700">Hiển thị</span></label></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <ImageUpload label="Ảnh nền slide" value={form.image} onChange={(url) => set("image", url)} />
        </div>
      </div>
    </AdminShell>
  );
}
