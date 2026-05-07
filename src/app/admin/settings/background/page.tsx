"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "@/components/admin/AdminShell";
import ImageUpload from "@/components/admin/ImageUpload";
import { useToast } from "@/components/admin/Toast";
import { Loader2, Save, RotateCcw, Globe, Image as ImageIcon, CheckCircle2 } from "lucide-react";

interface BgSettings {
  bgHero: string;
  bgGlobal: string;
  bgOverlayOpacity: string;
}

const PRESETS = [20, 40, 60, 70, 80, 90];

// Stable component — NOT defined inside the render function to avoid unmount/remount flicker
function PreviewThumb({ src, label, opacity }: { src: string; label: string; opacity: number }) {
  if (!src) return null;
  return (
    <div className="mt-4 rounded-xl overflow-hidden border border-gray-200" style={{ height: 130 }}>
      <div className="relative w-full h-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: `rgba(10,10,15,${opacity / 100})` }} />
        <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium drop-shadow">
          {label} — overlay {opacity}%
        </span>
      </div>
    </div>
  );
}

async function saveToAPI(patch: Partial<BgSettings>): Promise<boolean> {
  const res = await fetch("/api/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) return false;
  const data = await res.json();
  return data.success === true;
}

export default function BackgroundSettingsPage() {
  const [values, setValues] = useState<BgSettings>({
    bgHero: "",
    bgGlobal: "",
    bgOverlayOpacity: "70",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const { toast } = useToast();

  // Load current settings from DB on mount
  const fetchSettings = useCallback(async () => {
    const res = await fetch("/api/settings", { cache: "no-store" });
    const j = await res.json();
    const m: Record<string, string> = j.data || {};
    setValues({
      bgHero: m.bgHero || "",
      bgGlobal: m.bgGlobal || "",
      bgOverlayOpacity: m.bgOverlayOpacity || "70",
    });
    setLoading(false);
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  // Auto-save image URL immediately on upload — user doesn't need to click Save for images
  const handleGlobalChange = useCallback(async (url: string) => {
    setValues((v) => ({ ...v, bgGlobal: url }));
    const ok = await saveToAPI({ bgGlobal: url });
    if (ok) toast(url ? "Ảnh nền toàn trang đã lưu" : "Đã xoá ảnh nền toàn trang", "success");
    else toast("Không thể lưu — vui lòng thử lại", "error");
  }, [toast]);

  const handleHeroChange = useCallback(async (url: string) => {
    setValues((v) => ({ ...v, bgHero: url }));
    const ok = await saveToAPI({ bgHero: url });
    if (ok) toast(url ? "Ảnh nền Hero đã lưu" : "Đã xoá ảnh nền Hero", "success");
    else toast("Không thể lưu — vui lòng thử lại", "error");
  }, [toast]);

  // Manual save for overlay opacity (and confirm all three keys are in sync)
  const saveAll = async () => {
    setSaving(true);
    const ok = await saveToAPI(values);
    setSaving(false);
    if (ok) {
      setSavedAt(new Date());
      toast("Đã lưu tất cả cài đặt giao diện nền", "success");
      // Re-fetch to confirm DB state matches what we sent
      await fetchSettings();
    } else {
      toast("Lỗi khi lưu — kiểm tra phiên đăng nhập rồi thử lại", "error");
    }
  };

  const reset = async () => {
    const defaults: BgSettings = { bgHero: "", bgGlobal: "", bgOverlayOpacity: "70" };
    setValues(defaults);
    const ok = await saveToAPI(defaults);
    if (ok) {
      setSavedAt(new Date());
      toast("Đã khôi phục giao diện mặc định (nền đen)", "success");
    } else {
      toast("Lỗi khi khôi phục", "error");
    }
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

  const opacity = Math.min(95, Math.max(0, parseInt(values.bgOverlayOpacity || "70", 10) || 70));

  return (
    <AdminShell title="Cài đặt giao diện nền">
      <div className="max-w-3xl space-y-6 pb-10">

        {/* === Global background === */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-1">
            <Globe size={16} className="text-blue-600" />
            <h3 className="font-semibold text-gray-800">Ảnh nền toàn trang</h3>
            {values.bgGlobal && (
              <span className="ml-auto text-xs text-green-600 flex items-center gap-1">
                <CheckCircle2 size={12} /> Đang bật
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Hiển thị cố định phía sau toàn bộ website. Tự động lưu khi upload.
            Để trống để dùng nền đen mặc định.
          </p>
          <ImageUpload
            value={values.bgGlobal}
            onChange={handleGlobalChange}
            label=""
          />
          <PreviewThumb src={values.bgGlobal} label="Toàn trang" opacity={opacity} />
        </div>

        {/* === Hero background === */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-1">
            <ImageIcon size={16} className="text-purple-600" />
            <h3 className="font-semibold text-gray-800">Ảnh nền Hero Section</h3>
            {values.bgHero && (
              <span className="ml-auto text-xs text-green-600 flex items-center gap-1">
                <CheckCircle2 size={12} /> Đang bật
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Thay thế hiệu ứng gradient trong hero. Tự động lưu khi upload.
            Để trống để giữ hiệu ứng orbs mặc định.
          </p>
          <ImageUpload
            value={values.bgHero}
            onChange={handleHeroChange}
            label=""
          />
          <PreviewThumb src={values.bgHero} label="Hero" opacity={opacity} />
        </div>

        {/* === Overlay opacity === */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-1">Độ tối lớp phủ (Overlay)</h3>
          <p className="text-sm text-gray-500 mb-4">
            Lớp tối đè lên ảnh nền. Khuyến nghị ≥ 60% để văn bản luôn đọc được.
            Nhấn <strong>Lưu thay đổi</strong> sau khi chỉnh.
          </p>

          <div className="flex items-center gap-4 mb-4">
            <input
              type="range"
              min="0"
              max="95"
              step="1"
              value={opacity}
              onChange={(e) =>
                setValues((v) => ({ ...v, bgOverlayOpacity: e.target.value }))
              }
              className="flex-1 h-2 rounded-full cursor-pointer accent-blue-600"
            />
            <div className="w-16 text-center bg-gray-100 rounded-lg px-2 py-2 text-sm font-bold text-gray-700">
              {opacity}%
            </div>
          </div>

          {/* Quick preset buttons */}
          <div className="grid grid-cols-6 gap-2 mb-4">
            {PRESETS.map((v) => (
              <button
                key={v}
                type="button"
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

          {/* Live CSS preview strip */}
          {(values.bgGlobal || values.bgHero) && (
            <div className="rounded-xl overflow-hidden border border-gray-200 h-16 relative">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `linear-gradient(rgba(10,10,15,${opacity / 100}),rgba(10,10,15,${opacity / 100})),url("${values.bgGlobal || values.bgHero}")`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium drop-shadow">
                Xem thử — overlay {opacity}%
              </span>
            </div>
          )}
        </div>

        {/* === Info === */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <strong>Lưu ý:</strong> Ảnh upload tự động lưu ngay. Overlay opacity cần nhấn{" "}
          <strong>Lưu thay đổi</strong>. Sau khi lưu, tải lại trang public để thấy thay đổi.
        </div>

        {/* === Actions === */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={saveAll}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Lưu thay đổi
          </button>
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-2 border border-gray-200 text-gray-600 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            <RotateCcw size={16} />
            Khôi phục mặc định
          </button>
          {savedAt && (
            <span className="text-xs text-green-600 flex items-center gap-1 ml-1">
              <CheckCircle2 size={13} />
              Đã lưu lúc {savedAt.toLocaleTimeString("vi-VN")}
            </span>
          )}
        </div>

        {/* === DB status (debug helper for admin) === */}
        <details className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-500">
          <summary className="cursor-pointer font-medium text-gray-600 mb-1">
            Trạng thái cơ sở dữ liệu (để debug)
          </summary>
          <div className="mt-3 space-y-1 font-mono">
            <div><span className="text-gray-400">bgGlobal:</span> {values.bgGlobal || "(trống)"}</div>
            <div><span className="text-gray-400">bgHero:</span> {values.bgHero || "(trống)"}</div>
            <div><span className="text-gray-400">bgOverlayOpacity:</span> {values.bgOverlayOpacity}</div>
          </div>
          <button
            type="button"
            onClick={fetchSettings}
            className="mt-3 text-blue-600 underline text-xs"
          >
            Tải lại từ DB
          </button>
        </details>

      </div>
    </AdminShell>
  );
}
