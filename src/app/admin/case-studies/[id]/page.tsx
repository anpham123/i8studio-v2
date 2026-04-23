"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ImageUpload from "@/components/admin/ImageUpload";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { Save, Trash2, Loader2 } from "lucide-react";

export default function EditCaseStudyPage() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Record<string, string | boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDel, setShowDel] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    fetch(`/api/case-studies/${id}`).then((r) => r.json()).then((d) => {
      if (d.data) setForm(d.data);
      setLoading(false);
    });
  }, [id]);

  const save = async () => {
    setSaving(true);
    const res = await fetch(`/api/case-studies/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json();
    setSaving(false);
    if (data.data) toast("Đã lưu", "success"); else toast("Lỗi", "error");
  };

  const TA = ({ k, label, rows = 3 }: { k: string; label: string; rows?: number }) => (
    <div><label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label><textarea value={String(form[k] || "")} onChange={(e) => set(k, e.target.value)} rows={rows} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" /></div>
  );

  if (loading) return <AdminShell title="Case Study"><div className="flex justify-center py-24"><Loader2 className="animate-spin text-blue-500" size={32} /></div></AdminShell>;

  return (
    <AdminShell title="Chỉnh sửa Case Study" actions={<div className="flex gap-2"><button onClick={() => setShowDel(true)} className="border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm hover:bg-red-50"><Trash2 size={15} /></button><button onClick={save} disabled={saving} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"><Save size={15} /> Lưu</button></div>}>
      <div className="max-w-3xl space-y-5">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[["title","Tiêu đề (EN)"],["titleJa","Tiêu đề (JA)"]].map(([k,l]) => (
              <div key={k}><label className="block text-sm font-medium text-gray-700 mb-1.5">{l}</label><input value={String(form[k] || "")} onChange={(e) => set(k, e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" /></div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label><input value={String(form.slug || "")} onChange={(e) => set("slug", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Khách hàng</label><input value={String(form.client || "")} onChange={(e) => set("client", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Loại dịch vụ</label><select value={String(form.serviceType || "")} onChange={(e) => set("serviceType", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none"><option value="">-- Chọn --</option>{["3DCG","Animation","VR","BIM","Pachinko Slot","Anime"].map((s) => <option key={s}>{s}</option>)}</select></div>
            <div className="flex items-end pb-2.5"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={Boolean(form.featured)} onChange={(e) => set("featured", e.target.checked)} className="rounded" /><span className="text-sm text-gray-700">Nổi bật</span></label></div>
          </div>
          <TA k="challenge" label="Thách thức (EN)" />
          <TA k="challengeJa" label="Thách thức (JA)" />
          <TA k="solution" label="Giải pháp (EN)" />
          <TA k="solutionJa" label="Giải pháp (JA)" />
          <TA k="result" label="Kết quả (EN)" />
          <TA k="resultJa" label="Kết quả (JA)" />
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Metrics (JSON)</label><input value={String(form.metrics || "")} onChange={(e) => set("metrics", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none" /></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <ImageUpload label="Ảnh trước" value={String(form.beforeImage || "")} onChange={(url) => set("beforeImage", url)} />
          <ImageUpload label="Ảnh sau" value={String(form.afterImage || "")} onChange={(url) => set("afterImage", url)} />
        </div>
      </div>
      <ConfirmDialog open={showDel} message={`Xóa case study "${form.title}"?`} onConfirm={async () => { await fetch(`/api/case-studies/${id}`, { method: "DELETE" }); router.push("/admin/case-studies"); }} onCancel={() => setShowDel(false)} />
    </AdminShell>
  );
}
