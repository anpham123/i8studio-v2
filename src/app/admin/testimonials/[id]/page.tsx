"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ImageUpload from "@/components/admin/ImageUpload";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { Save, Trash2, Loader2 } from "lucide-react";

export default function EditTestimonialPage() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Record<string, string | boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDel, setShowDel] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    fetch(`/api/testimonials/${id}`).then((r) => r.json()).then((d) => {
      if (d.data) setForm({ ...d.data, rating: String(d.data.rating), order: String(d.data.order) });
      setLoading(false);
    });
  }, [id]);

  const save = async () => {
    setSaving(true);
    const res = await fetch(`/api/testimonials/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, rating: parseInt(String(form.rating)), order: parseInt(String(form.order)) }) });
    const data = await res.json();
    setSaving(false);
    if (data.data) toast("Đã lưu", "success"); else toast("Lỗi", "error");
  };

  if (loading) return <AdminShell title="Testimonial"><div className="flex justify-center py-24"><Loader2 className="animate-spin text-blue-500" size={32} /></div></AdminShell>;

  return (
    <AdminShell title="Chỉnh sửa Testimonial" actions={<div className="flex gap-2"><button onClick={() => setShowDel(true)} className="border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm hover:bg-red-50"><Trash2 size={15} /></button><button onClick={save} disabled={saving} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"><Save size={15} /> Lưu</button></div>}>
      <div className="max-w-2xl space-y-5">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[["clientName", "Tên KH"], ["clientTitle", "Chức vụ"], ["clientCompany", "Công ty"], ["order", "Thứ tự"]].map(([k, l]) => (
              <div key={k}><label className="block text-sm font-medium text-gray-700 mb-1.5">{l}</label><input value={String(form[k] ?? "")} onChange={(e) => set(k, e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" /></div>
            ))}
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Đánh giá</label>
            <select value={String(form.rating || "5")} onChange={(e) => set("rating", e.target.value)} className="w-24 border border-gray-200 rounded-lg px-3 py-2.5 text-sm">
              {[1,2,3,4,5].map((n) => <option key={n}>{n}</option>)}
            </select>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Nhận xét (EN)</label><textarea value={String(form.quote || "")} onChange={(e) => set("quote", e.target.value)} rows={4} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Nhận xét (JA)</label><textarea value={String(form.quoteJa || "")} onChange={(e) => set("quoteJa", e.target.value)} rows={4} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none" /></div>
          <div className="flex items-center gap-2"><input type="checkbox" id="feat" checked={Boolean(form.featured)} onChange={(e) => set("featured", e.target.checked)} className="rounded" /><label htmlFor="feat" className="text-sm text-gray-700">Nổi bật</label></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <ImageUpload label="Ảnh KH" value={String(form.clientPhoto || "")} onChange={(url) => set("clientPhoto", url)} />
        </div>
      </div>
      <ConfirmDialog open={showDel} message={`Xóa testimonial của "${form.clientName}"?`} onConfirm={async () => { await fetch(`/api/testimonials/${id}`, { method: "DELETE" }); router.push("/admin/testimonials"); }} onCancel={() => setShowDel(false)} />
    </AdminShell>
  );
}
