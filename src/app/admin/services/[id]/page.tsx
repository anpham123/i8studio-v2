"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ImageUpload from "@/components/admin/ImageUpload";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { Save, Trash2, Loader2, Plus, X, ChevronDown, ChevronUp } from "lucide-react";

interface Feature { titleJa: string; titleEn: string; descJa: string; descEn: string; image: string; }
interface ProcessStep { titleJa: string; titleEn: string; descJa: string; descEn: string; }
interface PricePlan { name: string; features: string[]; price: string; highlighted?: boolean; }
interface FieldProps { k: string; label: string; placeholder?: string; wide?: boolean; form: Record<string, string | boolean>; set: (k: string, v: string | boolean) => void; }
function Field({ k, label, placeholder, wide, form, set }: FieldProps) {
  return (
    <div className={wide ? "col-span-2" : ""}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input value={String(form[k] || "")} onChange={(e) => set(k, e.target.value)} placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
    </div>
  );
}

interface TextAreaProps { k: string; label: string; form: Record<string, string | boolean>; set: (k: string, v: string | boolean) => void; }
function TextArea({ k, label, form, set }: TextAreaProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <textarea value={String(form[k] || "")} onChange={(e) => set(k, e.target.value)} rows={3}
        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none" />
    </div>
  );
}

export default function EditServicePage() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Record<string, string | boolean>>({});
  const [features, setFeatures] = useState<Feature[]>([]);
  const [process, setProcess] = useState<ProcessStep[]>([]);
  const [plans, setPlans] = useState<PricePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDel, setShowDel] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    fetch(`/api/services/${id}`).then((r) => r.json()).then((d) => {
      if (d.data) {
        setForm({ ...d.data, order: String(d.data.order) });
        try { setFeatures(JSON.parse(d.data.featuresJson || "[]")); } catch { setFeatures([]); }
        try { setProcess(JSON.parse(d.data.processJson || "[]")); } catch { setProcess([]); }
        try { setPlans(JSON.parse(d.data.plansJson || "[]")); } catch { setPlans([]); }
      }
      setLoading(false);
    });
  }, [id]);

  const save = async () => {
    setSaving(true);
    const res = await fetch(`/api/services/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        order: parseInt(String(form.order)) || 0,
        isPublished: !!form.isPublished,
        featuresJson: JSON.stringify(features),
        processJson: JSON.stringify(process),
        plansJson: JSON.stringify(plans),
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.data) toast("Đã lưu", "success"); else toast("Lỗi", "error");
  };

  if (loading) return <AdminShell title="Dịch vụ"><div className="flex justify-center py-24"><Loader2 className="animate-spin text-blue-500" size={32} /></div></AdminShell>;

  return (
    <AdminShell
      title="Chỉnh sửa Dịch vụ"
      actions={
        <div className="flex gap-2">
          <button onClick={() => setShowDel(true)} className="border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm hover:bg-red-50"><Trash2 size={15} /></button>
          <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"><Save size={15} /> Lưu</button>
        </div>
      }
    >
      <div className="max-w-3xl space-y-5">
        {/* ── Basic Info ── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Thông tin cơ bản</h3>
          <div className="grid grid-cols-2 gap-4">
            <Field form={form} set={set} k="name" label="Tên (EN)" />
            <Field form={form} set={set} k="nameJa" label="Tên (JA)" />
          </div>
          <Field form={form} set={set} k="slug" label="Slug" />
          <div className="grid grid-cols-2 gap-4">
            <Field form={form} set={set} k="icon" label="Icon" placeholder="lucide icon name" />
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Thứ tự</label><input type="number" value={String(form.order || "0")} onChange={(e) => set("order", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" /></div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" checked={!!form.isPublished} onChange={(e) => set("isPublished", e.target.checked)} id="isPublished" className="rounded" />
            <label htmlFor="isPublished" className="text-sm text-gray-700">Published (hiển thị trên trang công khai)</label>
          </div>
          <TextArea form={form} set={set} k="description" label="Mô tả (EN)" />
          <TextArea form={form} set={set} k="descriptionJa" label="Mô tả (JA)" />
          <div className="grid grid-cols-2 gap-4">
            <Field form={form} set={set} k="priceHint" label="Giá (EN)" placeholder="From ¥50,000" />
            <Field form={form} set={set} k="priceHintJa" label="Giá (JA)" placeholder="¥50,000〜" />
          </div>
        </div>

        {/* ── Service Image ── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <ImageUpload label="Ảnh dịch vụ (thumbnail)" value={String(form.image || "")} onChange={(url) => set("image", url)} />
          <ImageUpload label="Ảnh hero (trang chi tiết)" value={String(form.heroImage || "")} onChange={(url) => set("heroImage", url)} />
        </div>

        {/* ── Solution Detail (collapsible) ── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <button onClick={() => setShowDetail(!showDetail)} className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">📄 Trang chi tiết dịch vụ (Solution Detail)</h3>
            {showDetail ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
          </button>

          {showDetail && (
            <div className="px-6 pb-6 space-y-6 border-t border-gray-100 pt-6">
              {/* Hero */}
              <div className="space-y-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Hero Section</p>
                <div className="grid grid-cols-2 gap-4">
                  <Field form={form} set={set} k="heroTaglineJa" label="Tagline (JA)" placeholder="精緻さが生む芸術" />
                  <Field form={form} set={set} k="heroTaglineEn" label="Tagline (EN)" placeholder="Art Born from Precision" />
                </div>
                <TextArea form={form} set={set} k="heroDescJa" label="Hero mô tả (JA)" />
                <TextArea form={form} set={set} k="heroDescEn" label="Hero mô tả (EN)" />
              </div>

              {/* Dynamic Features (new) */}
              <div className="space-y-4 border-t border-gray-100 pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Features ({features.length})</p>
                  <button onClick={() => setFeatures((f) => [...f, { titleJa: "", titleEn: "", descJa: "", descEn: "", image: "" }])} className="flex items-center gap-1 text-blue-600 text-xs font-medium hover:text-blue-700"><Plus size={14} /> Thêm feature</button>
                </div>
                {features.map((feat, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-4 space-y-3 relative">
                    <button onClick={() => setFeatures((f) => f.filter((_, j) => j !== i))} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><X size={14} /></button>
                    <p className="text-xs font-medium text-gray-400">Feature {i + 1}</p>
                    <div className="grid grid-cols-2 gap-3">
                      <input value={feat.titleJa} onChange={(e) => { const n = [...features]; n[i] = { ...n[i], titleJa: e.target.value }; setFeatures(n); }} placeholder="Tiêu đề (JA)" className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                      <input value={feat.titleEn} onChange={(e) => { const n = [...features]; n[i] = { ...n[i], titleEn: e.target.value }; setFeatures(n); }} placeholder="Tiêu đề (EN)" className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <textarea value={feat.descJa} onChange={(e) => { const n = [...features]; n[i] = { ...n[i], descJa: e.target.value }; setFeatures(n); }} placeholder="Mô tả (JA)" rows={2} className="border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" />
                      <textarea value={feat.descEn} onChange={(e) => { const n = [...features]; n[i] = { ...n[i], descEn: e.target.value }; setFeatures(n); }} placeholder="Mô tả (EN)" rows={2} className="border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" />
                    </div>
                    <ImageUpload label="Ảnh feature" value={feat.image} onChange={(url) => { const n = [...features]; n[i] = { ...n[i], image: url }; setFeatures(n); }} />
                  </div>
                ))}
              </div>

              {/* Legacy Features (read-only hint) */}
              <div className="space-y-4 border-t border-gray-100 pt-6">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Feature 1 (legacy)</p>
                <div className="grid grid-cols-2 gap-4">
                  <Field form={form} set={set} k="feature1TitleJa" label="Tiêu đề (JA)" />
                  <Field form={form} set={set} k="feature1TitleEn" label="Tiêu đề (EN)" />
                </div>
                <TextArea form={form} set={set} k="feature1DescJa" label="Mô tả (JA)" />
                <TextArea form={form} set={set} k="feature1DescEn" label="Mô tả (EN)" />
                <ImageUpload label="Ảnh Feature 1" value={String(form.feature1Image || "")} onChange={(url) => set("feature1Image", url)} />
              </div>

              <div className="space-y-4 border-t border-gray-100 pt-6">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Feature 2</p>
                <div className="grid grid-cols-2 gap-4">
                  <Field form={form} set={set} k="feature2TitleJa" label="Tiêu đề (JA)" />
                  <Field form={form} set={set} k="feature2TitleEn" label="Tiêu đề (EN)" />
                </div>
                <TextArea form={form} set={set} k="feature2DescJa" label="Mô tả (JA)" />
                <TextArea form={form} set={set} k="feature2DescEn" label="Mô tả (EN)" />
                <ImageUpload label="Ảnh Feature 2" value={String(form.feature2Image || "")} onChange={(url) => set("feature2Image", url)} />
              </div>

              {/* Process Steps */}
              <div className="space-y-4 border-t border-gray-100 pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Quy trình ({process.length} bước)</p>
                  <button onClick={() => setProcess((p) => [...p, { titleJa: "", titleEn: "", descJa: "", descEn: "" }])} className="flex items-center gap-1 text-blue-600 text-xs font-medium hover:text-blue-700"><Plus size={14} /> Thêm bước</button>
                </div>
                {process.map((step, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-4 space-y-3 relative">
                    <button onClick={() => setProcess((p) => p.filter((_, j) => j !== i))} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><X size={14} /></button>
                    <p className="text-xs font-medium text-gray-400">Bước {i + 1}</p>
                    <div className="grid grid-cols-2 gap-3">
                      <input value={step.titleJa} onChange={(e) => { const n = [...process]; n[i] = { ...n[i], titleJa: e.target.value }; setProcess(n); }} placeholder="Tiêu đề (JA)" className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                      <input value={step.titleEn} onChange={(e) => { const n = [...process]; n[i] = { ...n[i], titleEn: e.target.value }; setProcess(n); }} placeholder="Tiêu đề (EN)" className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input value={step.descJa} onChange={(e) => { const n = [...process]; n[i] = { ...n[i], descJa: e.target.value }; setProcess(n); }} placeholder="Mô tả (JA)" className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                      <input value={step.descEn} onChange={(e) => { const n = [...process]; n[i] = { ...n[i], descEn: e.target.value }; setProcess(n); }} placeholder="Mô tả (EN)" className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Plans */}
              <div className="space-y-4 border-t border-gray-100 pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Gói giá ({plans.length})</p>
                  <button onClick={() => setPlans((p) => [...p, { name: "", features: [], price: "", highlighted: false }])} className="flex items-center gap-1 text-blue-600 text-xs font-medium hover:text-blue-700"><Plus size={14} /> Thêm gói</button>
                </div>
                {plans.map((plan, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-4 space-y-3 relative">
                    <button onClick={() => setPlans((p) => p.filter((_, j) => j !== i))} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><X size={14} /></button>
                    <div className="grid grid-cols-3 gap-3">
                      <input value={plan.name} onChange={(e) => { const n = [...plans]; n[i] = { ...n[i], name: e.target.value }; setPlans(n); }} placeholder="Tên gói" className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                      <input value={plan.price} onChange={(e) => { const n = [...plans]; n[i] = { ...n[i], price: e.target.value }; setPlans(n); }} placeholder="¥50,000〜 / ASK" className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                      <label className="flex items-center gap-2 text-sm text-gray-600">
                        <input type="checkbox" checked={!!plan.highlighted} onChange={(e) => { const n = [...plans]; n[i] = { ...n[i], highlighted: e.target.checked }; setPlans(n); }} className="rounded" />
                        Nổi bật
                      </label>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Tính năng (1 dòng = 1 tính năng)</label>
                      <textarea value={plan.features.join("\n")} onChange={(e) => { const n = [...plans]; n[i] = { ...n[i], features: e.target.value.split("\n") }; setPlans(n); }} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog open={showDel} message={`Xóa "${form.name}"?`} onConfirm={async () => { await fetch(`/api/services/${id}`, { method: "DELETE" }); router.push("/admin/services"); }} onCancel={() => setShowDel(false)} />
    </AdminShell>
  );
}
