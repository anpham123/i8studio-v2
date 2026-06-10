"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ImageUpload from "@/components/admin/ImageUpload";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { Save, Trash2, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditWorkPage() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Record<string, string | boolean>>({ type: "still", buildingCategory: "residential" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    fetch(`/api/works/${id}`).then((r) => r.json()).then((d) => { if (d.data) setForm({ ...d.data, order: String(d.data.order) }); setLoading(false); });
  }, [id]);

  const save = async () => {
    setSaving(true);
    const res = await fetch(`/api/works/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, order: parseInt(String(form.order)) || 0 }) });
    const data = await res.json();
    setSaving(false);
    if (data.data) toast("Đã lưu", "success"); else toast("Lỗi", "error");
  };

  const handleDelete = async () => {
    await fetch(`/api/works/${id}`, { method: "DELETE" });
    toast("Đã xóa", "success");
    router.push("/admin/works");
  };

  if (loading) return <AdminShell title="Chỉnh sửa Work"><div className="flex justify-center py-24"><Loader2 className="animate-spin text-blue-500" size={32} /></div></AdminShell>;

  const InputField = ({ k, label, placeholder, type = "text" }: { k: string; label: string; placeholder?: string; type?: string }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input
        type={type}
        value={String(form[k] || "")}
        onChange={(e) => set(k, type === "number" ? e.target.value : e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
      />
    </div>
  );

  const SelectField = ({ k, label, options }: { k: string; label: string; options: { value: string; label: string }[] }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <select
        value={String(form[k] || options[0]?.value || "")}
        onChange={(e) => set(k, e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white"
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );

  return (
    <AdminShell
      title="Chỉnh sửa Work"
      actions={
        <div className="flex gap-2">
          <Link href="/admin/works" className="flex items-center gap-1.5 border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm hover:bg-gray-50">
            <ArrowLeft size={15} /> Quay lại
          </Link>
          <button onClick={() => setShowDelete(true)} className="border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm hover:bg-red-50">
            <Trash2 size={15} />
          </button>
          <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
            <Save size={15} /> Lưu
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN — Info + Classification */}
        <div className="lg:col-span-2 space-y-5">
          {/* Card: Thông tin cơ bản */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              Thông tin cơ bản
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputField k="title" label="Tên (EN)" />
                <InputField k="titleJa" label="Tên (JA)" />
              </div>
              <InputField k="subtitle" label="Subtitle" placeholder="Mô tả ngắn..." />
            </div>
          </div>

          {/* Card: Phân loại */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
              Phân loại
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <SelectField k="category" label="Danh mục" options={[
                  { value: "3DCG", label: "3DCG" },
                  { value: "Animation", label: "Animation" },
                  { value: "VR", label: "VR" },
                  { value: "BIM", label: "BIM" },
                ]} />
                <SelectField k="type" label="Kiểu hiển thị" options={[
                  { value: "still", label: "Still Image" },
                  { value: "animation", label: "Animation" },
                  { value: "composite", label: "Photo Composite" },
                  { value: "vr360", label: "VR 360" },
                  { value: "walkthrough", label: "VR Walkthrough" },
                  { value: "ar", label: "AR" },
                  { value: "digital", label: "Digital Model" },
                ]} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <SelectField k="buildingCategory" label="Thể loại kiến trúc" options={[
                  { value: "residential", label: "Residential" },
                  { value: "apartment", label: "Apartment" },
                  { value: "resort", label: "Resort" },
                  { value: "commercial", label: "Commercial" },
                  { value: "office", label: "Office" },
                  { value: "public", label: "Public Facility" },
                  { value: "urban", label: "Urban Development" },
                ]} />
                <InputField k="order" label="Thứ tự" type="number" />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input type="checkbox" id="featured" checked={Boolean(form.featured)} onChange={(e) => set("featured", e.target.checked)} className="rounded border-gray-300" />
                <label htmlFor="featured" className="text-sm text-gray-700 font-medium">★ Nổi bật (hiện trên trang chủ)</label>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — Media */}
        <div className="space-y-5">
          {/* Card: Ảnh */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              Ảnh đại diện
            </h3>
            <ImageUpload label="" value={String(form.image || "")} onChange={(url) => set("image", url)} />
          </div>

          {/* Card: Video */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
              Video
            </h3>
            <InputField k="videoUrl" label="Video URL" placeholder="https://youtube.com/..." />
          </div>
        </div>
      </div>

      <ConfirmDialog open={showDelete} message={`Xóa "${form.title}"?`} onConfirm={handleDelete} onCancel={() => setShowDelete(false)} />
    </AdminShell>
  );
}
