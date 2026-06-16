"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ImageUpload from "@/components/admin/ImageUpload";
import VideoUpload from "@/components/admin/VideoUpload";
import { useToast } from "@/components/admin/Toast";
import { Save } from "lucide-react";

export default function NewWorkPage() {
  const [form, setForm] = useState({ title: "", titleJa: "", subtitle: "", category: "3DCG", type: "still", buildingCategory: "residential", image: "", videoUrl: "", order: "0", featured: false });
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.title) return toast("Tên không được để trống", "error");
    setSaving(true);
    const res = await fetch("/api/works", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, order: parseInt(form.order) || 0 }) });
    const data = await res.json();
    setSaving(false);
    if (data.data) { toast("Đã tạo", "success"); router.push(`/admin/works/${data.data.id}`); }
    else toast("Lỗi khi lưu", "error");
  };

  return (
    <AdminShell title="Thêm Work mới" actions={<button onClick={save} disabled={saving} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"><Save size={15} /> Lưu</button>}>
      <div className="max-w-2xl space-y-5">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Tên (EN) *</label><input value={form.title} onChange={(e) => set("title", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Tên (JA)</label><input value={form.titleJa} onChange={(e) => set("titleJa", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Subtitle</label><input value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Danh mục</label>
              <select value={form.category} onChange={(e) => set("category", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none">
                <option>3DCG</option><option>Animation</option><option>VR</option><option>BIM</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Thứ tự</label><input type="number" value={form.order} onChange={(e) => set("order", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Kiểu hiển thị (Type)</label>
              <select value={form.type} onChange={(e) => set("type", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none">
                <option value="still">Still Image</option>
                <option value="animation">Animation</option>
                <option value="composite">Photo Composite</option>
                <option value="vr360">VR 360</option>
                <option value="walkthrough">VR Walkthrough</option>
                <option value="ar">AR</option>
                <option value="digital">Digital Model</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Thể loại kiến trúc (Category)</label>
              <select value={form.buildingCategory} onChange={(e) => set("buildingCategory", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none">
                <option value="residential">Residential</option>
                <option value="apartment">Apartment</option>
                <option value="resort">Resort</option>
                <option value="commercial">Commercial</option>
                <option value="office">Office</option>
                <option value="public">Public Facility</option>
                <option value="urban">Urban Development</option>
              </select>
            </div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Video (MP4, WebM, MOV)</label><VideoUpload label="" value={form.videoUrl} onChange={(url) => set("videoUrl", url)} /></div>
          <div className="flex items-center gap-2"><input type="checkbox" id="featured" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="rounded" /><label htmlFor="featured" className="text-sm text-gray-700">Nổi bật (hiển thị trên trang chủ)</label></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <ImageUpload label="Ảnh" value={form.image} onChange={(url) => set("image", url)} />
        </div>
      </div>
    </AdminShell>
  );
}
