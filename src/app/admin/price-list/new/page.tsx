"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { useToast } from "@/components/admin/Toast";
import { Save } from "lucide-react";

export default function NewPriceItemPage() {
  const [form, setForm] = useState({
    serviceSlug: "", icon: "", titleJa: "", titleEn: "", bulletsJson: "[]",
    priceFrom: "", priceLabelJa: "", priceLabelEn: "", order: "0",
  });
  const [bullets, setBullets] = useState<string[]>([]);
  const [services, setServices] = useState<{ slug: string; name: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    fetch("/api/services").then((r) => r.json()).then((d) => setServices(d.data || []));
  }, []);

  const save = async () => {
    if (!form.titleJa && !form.titleEn) return toast("Tên không được để trống", "error");
    setSaving(true);
    const res = await fetch("/api/price-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, order: parseInt(form.order) || 0, bulletsJson: JSON.stringify(bullets) }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.data) { toast("Đã tạo", "success"); router.push(`/admin/price-list/${data.data.id}`); }
    else toast("Lỗi", "error");
  };

  return (
    <AdminShell title="Thêm mục giá" actions={<button onClick={save} disabled={saving} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"><Save size={15} /> Lưu</button>}>
      <div className="max-w-2xl space-y-5">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Tên (JA)</label><input value={form.titleJa} onChange={(e) => set("titleJa", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Tên (EN)</label><input value={form.titleEn} onChange={(e) => set("titleEn", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Dịch vụ liên kết</label>
              <select value={form.serviceSlug} onChange={(e) => set("serviceSlug", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none">
                <option value="">— Không liên kết —</option>
                {services.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
              </select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Icon (emoji)</label><input value={form.icon} onChange={(e) => set("icon", e.target.value)} placeholder="🖼️" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Giá từ</label><input value={form.priceFrom} onChange={(e) => set("priceFrom", e.target.value)} placeholder="¥35,000〜 hoặc ASK" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Thứ tự</label><input type="number" value={form.order} onChange={(e) => set("order", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Nhãn giá (JA)</label><input value={form.priceLabelJa} onChange={(e) => set("priceLabelJa", e.target.value)} placeholder="参考価格" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Nhãn giá (EN)</label><input value={form.priceLabelEn} onChange={(e) => set("priceLabelEn", e.target.value)} placeholder="Starting from" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-3">
          <label className="block text-sm font-medium text-gray-700">Tính năng / Bullets</label>
          <textarea value={bullets.join("\n")} onChange={(e) => setBullets(e.target.value.split("\n"))} rows={4} placeholder="Mỗi dòng là 1 tính năng" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none" />
        </div>
      </div>
    </AdminShell>
  );
}
