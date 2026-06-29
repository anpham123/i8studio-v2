"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ImageUpload from "@/components/admin/ImageUpload";
import { useToast } from "@/components/admin/Toast";
import { Save, ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";

function InputField({
  value,
  onChange,
  label,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
      />
    </div>
  );
}

function SelectField({
  value,
  onChange,
  label,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function NewCompositeExamplePage() {
  const [form, setForm] = useState<Record<string, string | boolean>>({
    title: "",
    titleJp: "",
    category: "Residential",
    location: "",
    beforeImage: "",
    afterImage: "",
    isFeatured: false,
    isPublished: true,
    order: "0",
  });
  const [saving, setSaving] = useState(false);
  const [aspectRatioWarning, setAspectRatioWarning] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const set = useCallback((k: string, v: string | boolean) => {
    setForm((f) => ({ ...f, [k]: v }));
  }, []);

  // Monitor image aspect ratios
  useEffect(() => {
    if (!form.beforeImage || !form.afterImage) {
      setAspectRatioWarning("");
      return;
    }
    const imgBefore = new Image();
    const imgAfter = new Image();
    let beforeRatio = 0;
    let afterRatio = 0;

    const checkRatios = () => {
      if (beforeRatio && afterRatio) {
        const diff = Math.abs(beforeRatio - afterRatio);
        if (diff > 0.03) { // 3% tolerance
          setAspectRatioWarning(
            `Cảnh báo: Tỷ lệ của ảnh Trước (${beforeRatio.toFixed(2)}) và ảnh Sau (${afterRatio.toFixed(
              2
            )}) không khớp nhau. Slider hoạt động tốt nhất khi 2 ảnh có cùng tỷ lệ kích thước.`
          );
        } else {
          setAspectRatioWarning("");
        }
      }
    };

    imgBefore.onload = () => {
      beforeRatio = imgBefore.naturalWidth / imgBefore.naturalHeight;
      checkRatios();
    };
    imgAfter.onload = () => {
      afterRatio = imgAfter.naturalWidth / imgAfter.naturalHeight;
      checkRatios();
    };

    imgBefore.src = String(form.beforeImage);
    imgAfter.src = String(form.afterImage);
  }, [form.beforeImage, form.afterImage]);

  const save = async () => {
    if (!form.title) {
      toast("Vui lòng nhập tên ảnh ghép", "error");
      return;
    }
    if (!form.beforeImage) {
      toast("Vui lòng tải lên ảnh Trước (Before)", "error");
      return;
    }
    if (!form.afterImage) {
      toast("Vui lòng tải lên ảnh Sau (After)", "error");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/composite-examples", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          order: parseInt(String(form.order)) || 0,
        }),
      });
      const data = await res.json();
      setSaving(false);

      if (res.ok && data.data) {
        toast("Đã thêm mới thành công", "success");
        router.push("/admin/composite-examples");
      } else {
        toast(data.error || "Thất bại khi thêm mới", "error");
      }
    } catch {
      setSaving(false);
      toast("Lỗi kết nối mạng", "error");
    }
  };

  return (
    <AdminShell
      title="Thêm Ảnh ghép Photo Composite"
      actions={
        <div className="flex gap-2">
          <Link
            href="/admin/composite-examples"
            className="flex items-center gap-1.5 border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm hover:bg-gray-50"
          >
            <ArrowLeft size={15} /> Quay lại
          </Link>
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            Lưu lại
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN — Details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Card: Thông tin cơ bản */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              Thông tin chung
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputField value={String(form.title || "")} onChange={(v) => set("title", v)} label="Tên (EN) *" placeholder="Riverside Residence" />
                <InputField value={String(form.titleJp || "")} onChange={(v) => set("titleJp", v)} label="Tên (JP)" placeholder="リバーサイドレジデンス" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <SelectField
                  value={String(form.category || "Residential")}
                  onChange={(v) => set("category", v)}
                  label="Danh mục"
                  options={[
                    { value: "Residential", label: "Residential (Nhà ở)" },
                    { value: "Commercial", label: "Commercial (Thương mại)" },
                    { value: "Industrial", label: "Industrial (Công nghiệp)" },
                    { value: "Hospitality", label: "Hospitality (Nghỉ dưỡng)" },
                    { value: "Landscape", label: "Landscape (Cảnh quan)" },
                  ]}
                />
                <InputField value={String(form.location || "")} onChange={(v) => set("location", v)} label="Địa điểm" placeholder="Da Nang, Vietnam" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField value={String(form.order || "0")} onChange={(v) => set("order", v)} label="Thứ tự hiển thị" type="number" />
              </div>
            </div>
          </div>

          {/* Card: Cài đặt hiển thị */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
              Cấu hình hiển thị
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={Boolean(form.isFeatured)}
                  onChange={(e) => set("isFeatured", e.target.checked)}
                  className="rounded border-gray-300 h-4 w-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="isFeatured" className="text-sm text-gray-700 font-medium cursor-pointer">
                  ★ Hiển thị nổi bật (Featured - hiện trên Slider chính)
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={Boolean(form.isPublished)}
                  onChange={(e) => set("isPublished", e.target.checked)}
                  className="rounded border-gray-300 h-4 w-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="isPublished" className="text-sm text-gray-700 font-medium cursor-pointer">
                  Công khai hiển thị ra trang chủ công cộng
                </label>
              </div>
            </div>
          </div>

          {aspectRatioWarning && (
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 text-sm shadow-sm animate-pulse">
              <AlertTriangle size={18} className="shrink-0 text-amber-600 mt-0.5" />
              <span>{aspectRatioWarning}</span>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN — Images */}
        <div className="space-y-5">
          {/* Card: Before Image */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
              Ảnh Gốc (Before/Site Photo) *
            </h3>
            <ImageUpload label="" value={String(form.beforeImage || "")} onChange={(url) => set("beforeImage", url)} />
          </div>

          {/* Card: After Image */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              Ảnh Ghép (After/Composite) *
            </h3>
            <ImageUpload label="" value={String(form.afterImage || "")} onChange={(url) => set("afterImage", url)} />
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
