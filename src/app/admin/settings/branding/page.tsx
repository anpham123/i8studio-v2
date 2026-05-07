"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "@/components/admin/AdminShell";
import ImageUpload from "@/components/admin/ImageUpload";
import { useToast } from "@/components/admin/Toast";
import { Loader2, Type, ImageIcon, CheckCircle2, RotateCcw, Save } from "lucide-react";

interface BrandingSettings {
  logoImage: string;
  logoHeight: string;
  strengthsImage: string;
}

const HEIGHT_PRESETS = [48, 64, 80, 120, 160, 200, 240];
const DEFAULT_HEIGHT = 48;

async function saveToAPI(patch: Partial<BrandingSettings>): Promise<boolean> {
  const res = await fetch("/api/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) return false;
  const data = await res.json();
  return data.success === true;
}

function ImagePreview({ src, label }: { src: string; label: string }) {
  if (!src) return null;
  return (
    <div className="mt-3 rounded-xl overflow-hidden border border-gray-200" style={{ maxHeight: 120 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={label} className="w-full object-contain bg-gray-50" style={{ maxHeight: 120 }} />
    </div>
  );
}

export default function BrandingSettingsPage() {
  const [values, setValues] = useState<BrandingSettings>({
    logoImage: "",
    logoHeight: String(DEFAULT_HEIGHT),
    strengthsImage: "",
  });
  const [loading, setLoading] = useState(true);
  const [savingHeight, setSavingHeight] = useState(false);
  const { toast } = useToast();

  const fetchSettings = useCallback(async () => {
    const res = await fetch("/api/settings", { cache: "no-store" });
    const j = await res.json();
    const m: Record<string, string> = j.data || {};
    setValues({
      logoImage: m.logoImage || "",
      logoHeight: m.logoHeight || String(DEFAULT_HEIGHT),
      strengthsImage: m.strengthsImage || "",
    });
    setLoading(false);
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const handleLogoChange = useCallback(async (url: string) => {
    setValues((v) => ({ ...v, logoImage: url }));
    const ok = await saveToAPI({ logoImage: url });
    if (ok) toast(url ? "Logo đã lưu" : "Đã xoá logo", "success");
    else toast("Không thể lưu — vui lòng thử lại", "error");
  }, [toast]);

  const saveHeight = async () => {
    setSavingHeight(true);
    const ok = await saveToAPI({ logoHeight: values.logoHeight });
    setSavingHeight(false);
    if (ok) toast(`Kích thước logo đã lưu: ${values.logoHeight}px`, "success");
    else toast("Không thể lưu — vui lòng thử lại", "error");
  };

  const handleStrengthsChange = useCallback(async (url: string) => {
    setValues((v) => ({ ...v, strengthsImage: url }));
    const ok = await saveToAPI({ strengthsImage: url });
    if (ok) toast(url ? "Ảnh Strengths đã lưu" : "Đã xoá ảnh Strengths", "success");
    else toast("Không thể lưu — vui lòng thử lại", "error");
  }, [toast]);

  const resetAll = async () => {
    const defaults: BrandingSettings = { logoImage: "", logoHeight: String(DEFAULT_HEIGHT), strengthsImage: "" };
    setValues(defaults);
    const ok = await saveToAPI(defaults);
    if (ok) toast("Đã khôi phục mặc định", "success");
    else toast("Lỗi khi khôi phục", "error");
  };

  const parsedHeight = Math.min(240, Math.max(24, parseInt(values.logoHeight || String(DEFAULT_HEIGHT), 10) || DEFAULT_HEIGHT));

  if (loading) {
    return (
      <AdminShell title="Cài đặt thương hiệu">
        <div className="flex justify-center py-24">
          <Loader2 className="animate-spin text-blue-500" size={32} />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Cài đặt thương hiệu">
      <div className="max-w-3xl space-y-6 pb-10">

        {/* === Logo upload + size === */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-1">
            <Type size={16} className="text-blue-600" />
            <h3 className="font-semibold text-gray-800">Logo website</h3>
            {values.logoImage && (
              <span className="ml-auto text-xs text-green-600 flex items-center gap-1">
                <CheckCircle2 size={12} /> Đang bật
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Thay thế chữ &quot;i8 STUDIO&quot; trong Header bằng ảnh logo. Tự động lưu khi upload.
            Để trống để dùng text mặc định.
          </p>

          <ImageUpload value={values.logoImage} onChange={handleLogoChange} label="" />

          {/* Live preview against dark header background */}
          {values.logoImage && (
            <div className="mt-4 rounded-xl overflow-hidden border border-gray-200">
              <div className="bg-[#0a0a0f]/95 px-6 flex items-center" style={{ height: Math.max(parsedHeight + 16, 56) }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={values.logoImage}
                  alt="Logo preview"
                  style={{ height: parsedHeight, width: "auto", maxWidth: 240, display: "block", objectFit: "contain" }}
                />
              </div>
              <p className="text-center text-xs text-gray-400 py-1.5 bg-gray-50">
                Xem thử — logo {parsedHeight}px trong Header
              </p>
            </div>
          )}

          {/* Height control */}
          <div className="mt-5 border-t border-gray-100 pt-5">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Kích thước logo (px)</h4>

            <div className="flex items-center gap-4 mb-3">
              <input
                type="range"
                min="24"
                max="240"
                step="1"
                value={parsedHeight}
                onChange={(e) => setValues((v) => ({ ...v, logoHeight: e.target.value }))}
                className="flex-1 h-2 rounded-full cursor-pointer accent-blue-600"
              />
              <input
                type="number"
                min="24"
                max="240"
                value={parsedHeight}
                onChange={(e) => setValues((v) => ({ ...v, logoHeight: e.target.value }))}
                className="w-20 text-center border border-gray-200 rounded-lg px-2 py-1.5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-500">px</span>
            </div>

            {/* Quick presets */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {HEIGHT_PRESETS.map((px) => (
                <button
                  key={px}
                  type="button"
                  onClick={() => setValues((v) => ({ ...v, logoHeight: String(px) }))}
                  className={`py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    parsedHeight === px
                      ? "border-blue-400 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {px}px
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={saveHeight}
              disabled={savingHeight}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {savingHeight ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Lưu kích thước
            </button>
          </div>
        </div>

        {/* === Strengths image === */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-1">
            <ImageIcon size={16} className="text-purple-600" />
            <h3 className="font-semibold text-gray-800">Ảnh section &quot;Strengths&quot;</h3>
            {values.strengthsImage && (
              <span className="ml-auto text-xs text-green-600 flex items-center gap-1">
                <CheckCircle2 size={12} /> Đang bật
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Thay thế placeholder &quot;Studio Portfolio&quot; ở section Why Choose Us.
            Tự động lưu khi upload. Để trống để dùng placeholder mặc định.
          </p>
          <ImageUpload value={values.strengthsImage} onChange={handleStrengthsChange} label="" />
          <ImagePreview src={values.strengthsImage} label="Strengths image preview" />
        </div>

        {/* === Info === */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <strong>Lưu ý:</strong> Ảnh upload tự động lưu ngay. Kích thước logo cần nhấn{" "}
          <strong>Lưu kích thước</strong>. Tải lại trang public để thấy thay đổi.
        </div>

        {/* === Actions === */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={resetAll}
            className="flex items-center gap-2 border border-gray-200 text-gray-600 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            <RotateCcw size={16} />
            Khôi phục mặc định
          </button>
        </div>

        {/* === DB debug === */}
        <details className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-500">
          <summary className="cursor-pointer font-medium text-gray-600 mb-1">
            Trạng thái cơ sở dữ liệu (để debug)
          </summary>
          <div className="mt-3 space-y-1 font-mono">
            <div><span className="text-gray-400">logoImage:</span> {values.logoImage || "(trống)"}</div>
            <div><span className="text-gray-400">logoHeight:</span> {values.logoHeight}</div>
            <div><span className="text-gray-400">strengthsImage:</span> {values.strengthsImage || "(trống)"}</div>
          </div>
          <button type="button" onClick={fetchSettings} className="mt-3 text-blue-600 underline text-xs">
            Tải lại từ DB
          </button>
        </details>

      </div>
    </AdminShell>
  );
}
