"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ImageUpload from "@/components/admin/ImageUpload";
import { useToast } from "@/components/admin/Toast";
import { Save } from "lucide-react";

export default function NewTestimonialPage() {
  const [form, setForm] = useState({ clientName: "", clientTitle: "", clientCompany: "", clientPhoto: "", quote: "", quoteJa: "", rating: "5", featured: false, order: "0" });
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.clientName || !form.quote) return toast("Thiếu thông tin bắt buộc", "error");
    setSaving(true);
    const res = await fetch("/api/testimonials", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, rating: parseInt(form.rating), order: parseInt(form.order) }) });
    const data = await res.json();
    setSaving(false);
    if (data.data) { toast("Đã tạo", "success"); router.push(`/admin/testimonials/${data.data.id}`); }
    else toast("Lỗi", "error");
  };

  return (
    <AdminShell title="Thêm Testimonial" actions={<button onClick={save} disabled={saving} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"><Save size={15} /> Lưu</button>}>
      <div className="max-w-2xl space-y-5">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[["clientName", "Tên KH *"], ["clientTitle", "Chức vụ"], ["clientCompany", "Công ty"], ["order", "Thứ tự"]].map(([k, l]) => (
              <div key={k}><label className="block text-sm font-medium text-gray-700 mb-1.5">{l}</label><input value={String((form as Record<string, string | boolean>)[k] ?? "")} onChange={(e) => set(k, e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" /></div>
            ))}
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Đánh giá (1-5)</label>
            <select value={form.rating} onChange={(e) => set("rating", e.target.value)} className="w-24 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none">
              {[1,2,3,4,5].map((n) => <option key={n}>{n}</option>)}
            </select>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Nhận xét (EN) *</label><textarea value={form.quote} onChange={(e) => set("quote", e.target.value)} rows={4} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Nhận xét (JA)</label><textarea value={form.quoteJa} onChange={(e) => set("quoteJa", e.target.value)} rows={4} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none" /></div>
          <div className="flex items-center gap-2"><input type="checkbox" id="feat" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="rounded" /><label htmlFor="feat" className="text-sm text-gray-700">Nổi bật (hiển thị homepage)</label></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <ImageUpload label="Ảnh khách hàng" value={form.clientPhoto} onChange={(url) => set("clientPhoto", url)} />
        </div>
      </div>
    </AdminShell>
  );
}
