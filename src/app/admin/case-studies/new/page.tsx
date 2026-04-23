"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ImageUpload from "@/components/admin/ImageUpload";
import { useToast } from "@/components/admin/Toast";
import { slugify } from "@/lib/utils";
import { Save } from "lucide-react";

export default function NewCaseStudyPage() {
  const [form, setForm] = useState({ title: "", titleJa: "", slug: "", client: "", serviceType: "", challenge: "", challengeJa: "", solution: "", solutionJa: "", result: "", resultJa: "", beforeImage: "", afterImage: "", metrics: "", featured: false });
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.title) return toast("Tiêu đề không được để trống", "error");
    if (!form.slug) form.slug = slugify(form.title);
    setSaving(true);
    const res = await fetch("/api/case-studies", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json();
    setSaving(false);
    if (data.data) { toast("Đã tạo", "success"); router.push(`/admin/case-studies/${data.data.id}`); }
    else toast(data.error || "Lỗi", "error");
  };

  const TA = ({ k, label, rows = 3 }: { k: string; label: string; rows?: number }) => (
    <div><label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label><textarea value={String((form as Record<string, string | boolean>)[k] || "")} onChange={(e) => set(k, e.target.value)} rows={rows} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" /></div>
  );

  return (
    <AdminShell title="Thêm Case Study" actions={<button onClick={save} disabled={saving} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"><Save size={15} /> Lưu</button>}>
      <div className="max-w-3xl space-y-5">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Tiêu đề (EN) *</label><input value={form.title} onChange={(e) => { set("title", e.target.value); if (!form.slug) set("slug", slugify(e.target.value)); }} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Tiêu đề (JA)</label><input value={form.titleJa} onChange={(e) => set("titleJa", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label><input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto-generated" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Khách hàng</label><input value={form.client} onChange={(e) => set("client", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Loại dịch vụ</label><select value={form.serviceType} onChange={(e) => set("serviceType", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none"><option value="">-- Chọn --</option>{["3DCG","Animation","VR","BIM","Pachinko Slot","Anime"].map((s) => <option key={s}>{s}</option>)}</select></div>
            <div className="flex items-end pb-2.5"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="rounded" /><span className="text-sm text-gray-700">Nổi bật (hiển thị homepage)</span></label></div>
          </div>
          <TA k="challenge" label="Thách thức (EN)" />
          <TA k="challengeJa" label="Thách thức (JA)" />
          <TA k="solution" label="Giải pháp (EN)" />
          <TA k="solutionJa" label="Giải pháp (JA)" />
          <TA k="result" label="Kết quả (EN)" />
          <TA k="resultJa" label="Kết quả (JA)" />
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Metrics (JSON)</label><input value={form.metrics} onChange={(e) => set("metrics", e.target.value)} placeholder='{"reduction":"30%","roi":"200%"}' className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none" /></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <ImageUpload label="Ảnh trước" value={form.beforeImage} onChange={(url) => set("beforeImage", url)} />
          <ImageUpload label="Ảnh sau" value={form.afterImage} onChange={(url) => set("afterImage", url)} />
        </div>
      </div>
    </AdminShell>
  );
}
