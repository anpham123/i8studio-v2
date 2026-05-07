"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import ImageUpload from "@/components/admin/ImageUpload";
import { useToast } from "@/components/admin/Toast";
import { Loader2, Save, RotateCcw, Globe, Image as ImageIcon } from "lucide-react";

interface BgSettings {
  bgHero: string;
  bgGlobal: string;
  bgOverlayOpacity: string;
}

const PRESETS = [20, 40, 60, 70, 80, 90];

export default function BackgroundSettingsPage() {
  const [values, setValues] = useState<BgSettings>({
    bgHero: "",
    bgGlobal: "",
    bgOverlayOpacity: "70",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((j) => {
        const m = j.data || {};
        setValues({
          bgHero: m.bgHero || "",
          bgGlobal: m.bgGlobal || "",
          bgOverlayOpacity: m.bgOverlayOpacity || "70",
        });
        setLoading(false);
      });
  }, []);

  const save = async () => {
    setSaving(true);
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    setSaving(false);
    if (data.success) toast("Đã lưu cài đặt giao diện", "success");
    else toast("Lỗi khi lưu", "error");
  };

  const reset = async () => {
    const defaults: BgSettings = { bgHero: "", bgGlobal: "", bgOverlayOpacity: "70" };
    setValues(defaults);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(defaults),
    });
    toast("Đã khôi phục giao diện mặc định", "success");
  };

  if (loading) {
    return (
      <AdminShell title="Cài đặt giao diện nền">
        <div className="flex justify-center py-24">
          <Loader2 className="animate-spin text-blue-500" size={32} />
        </div>
      </AdminShell>
    );
  }

  const opacity = Math.min(95, Math.max(0, parseInt(values.bgOverlayOpacity || "70")));

  function PreviewThumb({ src, label }: { src: string; label: string }) {
    if (!src) return null;
    return (
      <div className="mt-4 rounded-xl overflow-hidden border border-gray-200" style={{ height: 130 }}>
        <div className="relative w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" className="w-full h-full object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: `rgba(10,10,15,${opacity / 100})` }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium">
            {label} — overlay {opacity}%
          </span>
        </div>
      </div>
    );
  }

  return (
    <AdminShell title="Cài đặt giao diện nền">
      <div className="max-w-3xl space-y-6 pb-10">

        {/* Global background */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-1">
            <Globe size={16} className="text-blue-600" />
            <h3 className="font-semibold text-gray-800">Ảnh nền toàn trang</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Hiển thị cố định phía sau toàn bộ website. Để trống để giữ nền đen mặc định.
          </p>
          <ImageUpload
            value={values.bgGlobal}
            onChange={(url) => setValues((v) => ({ ...v, bgGlobal: url }))}
            label=""
          />
          <PreviewThumb src={values.bgGlobal} label="Toàn trang" />
        </div>

        {/* Hero background */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-1">
            <ImageIcon size={16} className="text-purple-600" />
            <h3 className="font-semibold text-gray-800">Ảnh nền Hero Section</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Thay thế hiệu ứng gradient động trong hero. Để trống để giữ hiệu ứng orbs mặc định.
          </p>
          <ImageUpload
            value={values.bgHero}
            onChange={(url) => setValues((v) => ({ ...v, bgHero: url }))}
            label=""
          />
          <PreviewThumb src={values.bgHero} label="Hero" />
        </div>

        {/* Overlay opacity */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-1">Độ tối lớp phủ (Overlay)</h3>
          <p className="text-sm text-gray-500 mb-4">
            Lớp tối đè lên ảnh nền để văn bản luôn đọc được. Áp dụng cho cả hai ảnh trên.
          </p>

          <div className="flex items-center gap-4 mb-3">
            <input
              type="range"
              min="0"
              max="95"
              value={opacity}
              onChange={(e) =>
                setValues((v) => ({ ...v, bgOverlayOpacity: e.target.value }))
              }
              className="flex-1 h-2 rounded-full cursor-pointer accent-blue-600"
            />
            <div className="w-14 text-center bg-gray-100 rounded-lg px-2 py-2 text-sm font-bold text-gray-700">
              {opacity}%
            </div>
          </div>

          {/* Quick presets */}
          <div className="grid grid-cols-6 gap-2">
            {PRESETS.map((v) => (
              <button
                key={v}
                onClick={() =>
                  setValues((val) => ({ ...val, bgOverlayOpacity: String(v) }))
                }
                className={`py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  opacity === v
                    ? "border-blue-400 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                {v}%
              </button>
            ))}
          </div>

          {/* Visual hint */}
          {(values.bgGlobal || values.bgHero) && (
            <div className="mt-4 rounded-xl overflow-hidden border border-gray-200 h-16 relative">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(10,10,15,${opacity / 100}), rgba(10,10,15,${opacity / 100})),
                    url("${values.bgGlobal || values.bgHero}")
                  `,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium">
                Xem thử overlay {opacity}%
              </span>
            </div>
          )}
        </div>

        {/* Info box */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
          <strong>Lưu ý:</strong> Sau khi lưu, ảnh nền sẽ áp dụng ngay khi tải lại trang.
          Đảm bảo độ tối overlay ≥ 60% để văn bản luôn đọc được.
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Lưu thay đổi
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-2 border border-gray-200 text-gray-600 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            <RotateCcw size={16} />
            Khôi phục mặc định
          </button>
        </div>
      </div>
    </AdminShell>
  );
}
