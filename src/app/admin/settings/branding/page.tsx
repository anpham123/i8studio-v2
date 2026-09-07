"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "@/components/admin/AdminShell";
import ImageUpload from "@/components/admin/ImageUpload";
import { useToast } from "@/components/admin/Toast";
import { Loader2, Type, CheckCircle2, RotateCcw, Save, MousePointer, Globe2 } from "lucide-react";

interface BrandingSettings {
  logoImage: string;
  logoHeight: string;
  footerLogoImage: string;
  logoFooterHeight: string;
  faviconImage: string;
  aboutHeroImage: string;
  aboutImageTeam: string;
  aboutImageOffice: string;
  aboutImageQuality: string;
  cursorImage: string;
  cursorEnabled: string;
  cursorSize: string;
  // Mega Menu thumbnails
  menuImgAboutCompany: string;
  menuImgAboutPortfolio: string;
  menuImgAboutWorkflow: string;
  menuImgBlogCaseStudy: string;
  menuImgBlogTips: string;
  menuImgBlogKnowledge: string;
  menuImgBlogAi: string;
  menuImgBlogLifeGallery: string;
}

const DEFAULT_MENU_IMAGES = {
  menuImgAboutCompany: "/uploads/1781662116949-House_in_forest__Summer_.webp",
  menuImgAboutPortfolio: "/uploads/1782359708167-Skyline_Tower.webp",
  menuImgAboutWorkflow: "/uploads/1787802610927-upscalemedia-transformed.webp",
  menuImgBlogCaseStudy: "/uploads/1781164288528-260402_Cover_01.webp",
  menuImgBlogTips: "/uploads/1782700167114-1722_Study.webp",
  menuImgBlogKnowledge: "/uploads/1782282467636-wood_sauna_at_ziedlejas_wellness_resort_Sauna.webp",
  menuImgBlogAi: "/uploads/1781165121094-1722_vr01-2.webp",
  menuImgBlogLifeGallery: "/uploads/1781661627502-615196287_122209779764576056_3698202373077728542_n.webp",
};

const HEIGHT_PRESETS = [32, 40, 48, 56, 64, 80, 100];
const DEFAULT_HEIGHT = 48;
const DEFAULT_FOOTER_HEIGHT = 40;

const CURSOR_PRESETS = [24, 32, 40, 48, 56, 64];
const DEFAULT_CURSOR_SIZE = 32;

async function saveToAPI(patch: Partial<BrandingSettings>): Promise<boolean> {
  const res = await fetch("/api/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) return false;
  const data = await res.json();
  // Trigger revalidation
  try {
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: "/" }),
    });
  } catch {
    // ignore
  }
  return data.success === true;
}

export default function BrandingSettingsPage() {
  const [values, setValues] = useState<BrandingSettings>({
    logoImage: "",
    logoHeight: String(DEFAULT_HEIGHT),
    footerLogoImage: "",
    logoFooterHeight: String(DEFAULT_FOOTER_HEIGHT),
    faviconImage: "",
    aboutHeroImage: "",
    aboutImageTeam: "",
    aboutImageOffice: "",
    aboutImageQuality: "",
    cursorImage: "",
    cursorEnabled: "false",
    cursorSize: String(DEFAULT_CURSOR_SIZE),
    menuImgAboutCompany: "",
    menuImgAboutPortfolio: "",
    menuImgAboutWorkflow: "",
    menuImgBlogCaseStudy: "",
    menuImgBlogTips: "",
    menuImgBlogKnowledge: "",
    menuImgBlogAi: "",
    menuImgBlogLifeGallery: "",
  });
  const [loading, setLoading] = useState(true);
  const [savingHeight, setSavingHeight] = useState(false);
  const [savingFooterHeight, setSavingFooterHeight] = useState(false);
  const { toast } = useToast();

  const fetchSettings = useCallback(async () => {
    const res = await fetch("/api/settings", { cache: "no-store" });
    const j = await res.json();
    const m: Record<string, string> = j.data || {};
    setValues({
      logoImage: m.logoImage || "",
      logoHeight: m.logoHeight || String(DEFAULT_HEIGHT),
      footerLogoImage: m.footerLogoImage || "",
      logoFooterHeight: m.logoFooterHeight || String(DEFAULT_FOOTER_HEIGHT),
      faviconImage: m.faviconImage || "",
      aboutHeroImage: m.aboutHeroImage || "",
      aboutImageTeam: m.aboutImageTeam || "",
      aboutImageOffice: m.aboutImageOffice || "",
      aboutImageQuality: m.aboutImageQuality || "",
      cursorImage: m.cursorImage || "",
      cursorEnabled: m.cursorEnabled || "false",
      cursorSize: m.cursorSize || String(DEFAULT_CURSOR_SIZE),
      menuImgAboutCompany: m.menuImgAboutCompany || "",
      menuImgAboutPortfolio: m.menuImgAboutPortfolio || "",
      menuImgAboutWorkflow: m.menuImgAboutWorkflow || "",
      menuImgBlogCaseStudy: m.menuImgBlogCaseStudy || "",
      menuImgBlogTips: m.menuImgBlogTips || "",
      menuImgBlogKnowledge: m.menuImgBlogKnowledge || "",
      menuImgBlogAi: m.menuImgBlogAi || "",
      menuImgBlogLifeGallery: m.menuImgBlogLifeGallery || "",
    });
    setLoading(false);
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const handleMenuImageChange = useCallback(async (key: keyof BrandingSettings, labelName: string, url: string) => {
    setValues((v) => ({ ...v, [key]: url }));
    const ok = await saveToAPI({ [key]: url });
    if (ok) toast(url ? `Đã lưu ảnh cho ${labelName}` : `Đã xóa ảnh tùy chỉnh của ${labelName} (quay về mặc định)`, "success");
    else toast("Không thể lưu — vui lòng thử lại", "error");
  }, [toast]);

  const handleLogoChange = useCallback(async (url: string) => {
    setValues((v) => ({ ...v, logoImage: url }));
    const ok = await saveToAPI({ logoImage: url });
    if (ok) toast(url ? "Logo đã lưu" : "Đã xoá logo", "success");
    else toast("Không thể lưu — vui lòng thử lại", "error");
  }, [toast]);

  const handleFooterLogoChange = useCallback(async (url: string) => {
    setValues((v) => ({ ...v, footerLogoImage: url }));
    const ok = await saveToAPI({ footerLogoImage: url });
    if (ok) toast(url ? "Logo chân trang đã lưu" : "Đã xoá logo chân trang (sẽ dùng logo Header)", "success");
    else toast("Không thể lưu — vui lòng thử lại", "error");
  }, [toast]);

  const handleFaviconChange = useCallback(async (url: string) => {
    setValues((v) => ({ ...v, faviconImage: url }));
    const ok = await saveToAPI({ faviconImage: url });
    if (ok) toast(url ? "Favicon đã lưu" : "Đã xoá favicon (sẽ dùng logo)", "success");
    else toast("Không thể lưu — vui lòng thử lại", "error");
  }, [toast]);

  const handleAboutHeroImageChange = useCallback(async (url: string) => {
    setValues((v) => ({ ...v, aboutHeroImage: url }));
    const ok = await saveToAPI({ aboutHeroImage: url });
    if (ok) toast(url ? "Đã lưu ảnh nền Hero About Us" : "Đã xoá ảnh nền Hero", "success");
    else toast("Không thể lưu — vui lòng thử lại", "error");
  }, [toast]);

  const handleAboutImageTeamChange = useCallback(async (url: string) => {
    setValues((v) => ({ ...v, aboutImageTeam: url }));
    const ok = await saveToAPI({ aboutImageTeam: url });
    if (ok) toast(url ? "Đã lưu ảnh Our Team" : "Đã xoá ảnh Our Team", "success");
    else toast("Không thể lưu — vui lòng thử lại", "error");
  }, [toast]);

  const handleAboutImageOfficeChange = useCallback(async (url: string) => {
    setValues((v) => ({ ...v, aboutImageOffice: url }));
    const ok = await saveToAPI({ aboutImageOffice: url });
    if (ok) toast(url ? "Đã lưu ảnh Da Nang Office" : "Đã xoá ảnh Da Nang Office", "success");
    else toast("Không thể lưu — vui lòng thử lại", "error");
  }, [toast]);

  const handleAboutImageQualityChange = useCallback(async (url: string) => {
    setValues((v) => ({ ...v, aboutImageQuality: url }));
    const ok = await saveToAPI({ aboutImageQuality: url });
    if (ok) toast(url ? "Đã lưu ảnh Quality First" : "Đã xoá ảnh Quality First", "success");
    else toast("Không thể lưu — vui lòng thử lại", "error");
  }, [toast]);

  const handleCursorImageChange = useCallback(async (url: string) => {
    setValues((v) => ({ ...v, cursorImage: url }));
    const ok = await saveToAPI({ cursorImage: url });
    if (ok) toast(url ? "Đã lưu ảnh con trỏ chuột" : "Đã xoá ảnh con trỏ chuột", "success");
    else toast("Không thể lưu — vui lòng thử lại", "error");
  }, [toast]);

  const handleCursorEnabledChange = useCallback(async (enabled: boolean) => {
    const val = enabled ? "true" : "false";
    setValues((v) => ({ ...v, cursorEnabled: val }));
    const ok = await saveToAPI({ cursorEnabled: val });
    if (ok) toast(enabled ? "Đã bật con trỏ chuột thương hiệu" : "Đã tắt con trỏ chuột thương hiệu", "success");
    else toast("Không thể lưu — vui lòng thử lại", "error");
  }, [toast]);

  const [savingCursorSize, setSavingCursorSize] = useState(false);
  const saveCursorSize = async () => {
    setSavingCursorSize(true);
    const ok = await saveToAPI({ cursorSize: values.cursorSize });
    setSavingCursorSize(false);
    if (ok) toast(`Kích thước con trỏ chuột đã lưu: ${values.cursorSize}px`, "success");
    else toast("Không thể lưu — vui lòng thử lại", "error");
  };

  const saveHeight = async () => {
    setSavingHeight(true);
    const ok = await saveToAPI({ logoHeight: values.logoHeight });
    setSavingHeight(false);
    if (ok) toast(`Kích thước logo đã lưu: ${values.logoHeight}px`, "success");
    else toast("Không thể lưu — vui lòng thử lại", "error");
  };

  const saveFooterHeight = async () => {
    setSavingFooterHeight(true);
    const ok = await saveToAPI({ logoFooterHeight: values.logoFooterHeight });
    setSavingFooterHeight(false);
    if (ok) toast(`Kích thước logo chân trang đã lưu: ${values.logoFooterHeight}px`, "success");
    else toast("Không thể lưu — vui lòng thử lại", "error");
  };

  const resetAll = async () => {
    const defaults: BrandingSettings = {
      logoImage: "",
      logoHeight: String(DEFAULT_HEIGHT),
      footerLogoImage: "",
      logoFooterHeight: String(DEFAULT_FOOTER_HEIGHT),
      faviconImage: "",
      aboutHeroImage: "",
      aboutImageTeam: "",
      aboutImageOffice: "",
      aboutImageQuality: "",
      cursorImage: "",
      cursorEnabled: "false",
      cursorSize: String(DEFAULT_CURSOR_SIZE),
      menuImgAboutCompany: "",
      menuImgAboutPortfolio: "",
      menuImgAboutWorkflow: "",
      menuImgBlogCaseStudy: "",
      menuImgBlogTips: "",
      menuImgBlogKnowledge: "",
      menuImgBlogAi: "",
      menuImgBlogLifeGallery: "",
    };
    setValues(defaults);
    const ok = await saveToAPI(defaults);
    if (ok) toast("Đã khôi phục mặc định", "success");
    else toast("Lỗi khi khôi phục", "error");
  };

  const parsedHeight = Math.min(120, Math.max(24, parseInt(values.logoHeight || String(DEFAULT_HEIGHT), 10) || DEFAULT_HEIGHT));
  const parsedFooterHeight = Math.min(120, Math.max(24, parseInt(values.logoFooterHeight || String(DEFAULT_FOOTER_HEIGHT), 10) || DEFAULT_FOOTER_HEIGHT));

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

          {/* Live preview against white header background */}
          {values.logoImage && (
            <div className="mt-4 rounded-xl overflow-hidden border border-gray-200">
              <div className="bg-white px-6 flex items-center border-b border-gray-100" style={{ height: Math.max(parsedHeight + 16, 56) }}>
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
            <h4 className="text-sm font-medium text-gray-700 mb-3">Kích thước logo Header (px)</h4>

            <div className="flex items-center gap-4 mb-3">
              <input
                type="range"
                min="24"
                max="120"
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
                  className={`py-1.5 rounded-lg border text-xs font-medium transition-all ${parsedHeight === px
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
              Lưu kích thước Header
            </button>
          </div>

          {/* Footer Height control */}
          {/* Footer logo upload */}
          <div className="mt-8 border-t border-gray-100 pt-8">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Logo chân trang (Footer)</h4>
            <p className="text-xs text-gray-400 mb-3">Upload logo riêng cho Footer. Để trống sẽ dùng logo Header.</p>
            <ImageUpload value={values.footerLogoImage} onChange={handleFooterLogoChange} label="" />
          </div>

          <div className="mt-8 border-t border-gray-100 pt-8">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Kích thước logo chân trang (Footer) (px)</h4>

            {/* Live preview against footer background */}
            {(values.footerLogoImage || values.logoImage) && (
              <div className="mb-4 rounded-xl overflow-hidden border border-gray-200 bg-[#fafafa]">
                <div className="px-6 flex items-center border-b border-gray-100" style={{ height: Math.max(parsedFooterHeight + 24, 76) }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={values.footerLogoImage || values.logoImage}
                    alt="Logo footer preview"
                    style={{ height: parsedFooterHeight, width: "auto", maxWidth: 240, display: "block", objectFit: "contain" }}
                  />
                </div>
                <p className="text-center text-xs text-gray-400 py-1.5 bg-gray-50">
                  Xem thử — logo {parsedFooterHeight}px trong Footer {values.footerLogoImage ? "(logo riêng)" : "(dùng logo Header)"}
                </p>
              </div>
            )}

            <div className="flex items-center gap-4 mb-3">
              <input
                type="range"
                min="24"
                max="120"
                step="1"
                value={parsedFooterHeight}
                onChange={(e) => setValues((v) => ({ ...v, logoFooterHeight: e.target.value }))}
                className="flex-1 h-2 rounded-full cursor-pointer accent-blue-600"
              />
              <input
                type="number"
                min="24"
                max="240"
                value={parsedFooterHeight}
                onChange={(e) => setValues((v) => ({ ...v, logoFooterHeight: e.target.value }))}
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
                  onClick={() => setValues((v) => ({ ...v, logoFooterHeight: String(px) }))}
                  className={`py-1.5 rounded-lg border text-xs font-medium transition-all ${parsedFooterHeight === px
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
              onClick={saveFooterHeight}
              disabled={savingFooterHeight}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {savingFooterHeight ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Lưu kích thước Footer
            </button>
          </div>
        </div>

        {/* === Favicon === */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-1">
            <Globe2 size={16} className="text-blue-600" />
            <h3 className="font-semibold text-gray-800">Favicon (Icon tab trình duyệt)</h3>
            {values.faviconImage && (
              <span className="ml-auto text-xs text-green-600 flex items-center gap-1">
                <CheckCircle2 size={12} /> Đang bật
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Upload ảnh riêng cho favicon (icon hiển thị trên tab trình duyệt). Nên dùng ảnh vuông, PNG trong suốt, kích thước 48×48px hoặc lớn hơn.
            Nếu để trống sẽ dùng logo website.
          </p>

          <ImageUpload value={values.faviconImage} onChange={handleFaviconChange} label="" />

          {/* Live preview */}
          {(values.faviconImage || values.logoImage) && (
            <div className="mt-4 rounded-xl overflow-hidden border border-gray-200">
              <div className="bg-gray-100 px-4 py-3 flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={values.faviconImage || values.logoImage}
                  alt="Favicon preview"
                  className="w-5 h-5 object-contain"
                />
                <span className="text-sm text-gray-600 truncate">i8 STUDIO — 3DCG, Animation, VR &amp; BIM</span>
                <span className="ml-auto text-gray-400 text-xs">×</span>
              </div>
              <p className="text-center text-xs text-gray-400 py-1.5 bg-gray-50">
                Xem thử — favicon trên tab trình duyệt {values.faviconImage ? "(ảnh riêng)" : "(dùng logo)"}
              </p>
            </div>
          )}
        </div>

        {/* === Custom Cursor Logo === */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-2 mb-1">
            <MousePointer size={16} className="text-blue-600" />
            <h3 className="font-semibold text-gray-800">Con trỏ chuột thương hiệu (Custom Cursor)</h3>
            {values.cursorEnabled === "true" && values.cursorImage && (
              <span className="ml-auto text-xs text-green-600 flex items-center gap-1">
                <CheckCircle2 size={12} /> Đang hoạt động
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">
            Thay thế con trỏ chuột mặc định bằng ảnh logo/icon thương hiệu trên tất cả trang public (chỉ hoạt động trên thiết bị di chuột để đảm bảo tối ưu trải nghiệm). Nên dùng ảnh định dạng PNG hoặc SVG nền trong suốt, kích thước tỷ lệ vuông (đẹp nhất từ 24px - 48px).
          </p>

          {/* Toggle Enable Custom Cursor */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-5">
            <div>
              <span className="text-sm font-medium text-gray-700">Trạng thái con trỏ chuột</span>
              <p className="text-xs text-gray-400">Bật hoặc tắt con trỏ chuột thương hiệu</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={values.cursorEnabled === "true"}
                onChange={(e) => handleCursorEnabledChange(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <ImageUpload
            value={values.cursorImage}
            onChange={handleCursorImageChange}
            label="Ảnh con trỏ chuột (PNG/SVG)"
          />

          {/* Cursor size control */}
          <div className="border-t border-gray-100 pt-5">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Kích thước con trỏ chuột (px)</h4>
            <div className="flex items-center gap-4 mb-3">
              <input
                type="range"
                min="16"
                max="80"
                step="1"
                value={parseInt(values.cursorSize, 10) || DEFAULT_CURSOR_SIZE}
                onChange={(e) => setValues((v) => ({ ...v, cursorSize: e.target.value }))}
                className="flex-1 h-2 rounded-full cursor-pointer accent-blue-600"
              />
              <input
                type="number"
                min="16"
                max="120"
                value={parseInt(values.cursorSize, 10) || DEFAULT_CURSOR_SIZE}
                onChange={(e) => setValues((v) => ({ ...v, cursorSize: e.target.value }))}
                className="w-20 text-center border border-gray-200 rounded-lg px-2 py-1.5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-500">px</span>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-6 gap-2 mb-4">
              {CURSOR_PRESETS.map((px) => (
                <button
                  key={px}
                  type="button"
                  onClick={() => setValues((v) => ({ ...v, cursorSize: String(px) }))}
                  className={`py-1.5 rounded-lg border text-xs font-medium transition-all ${(parseInt(values.cursorSize, 10) || DEFAULT_CURSOR_SIZE) === px
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
              onClick={saveCursorSize}
              disabled={savingCursorSize}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {savingCursorSize ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Lưu kích thước con trỏ
            </button>
          </div>
        </div>

        {/* === Mega Menu Navigation Images (About Us & Blogs) === */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Globe2 size={16} className="text-blue-600" />
              <h3 className="font-semibold text-gray-800">Ảnh Menu Điều Hướng Header (Mega Menu)</h3>
            </div>
            <p className="text-sm text-gray-500">
              Tùy chỉnh hình ảnh thumbnail xuất hiện trong menu thả xuống (Mega Menu) khi rê chuột/chọn <strong>ABOUT US</strong> và <strong>BLOGS</strong>.
            </p>
          </div>

          {/* 1. About Us Section */}
          <div className="border border-gray-100 rounded-xl p-5 bg-gray-50/50 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200/60 pb-3">
              <div>
                <h4 className="font-semibold text-gray-800 text-sm">1. Mục ABOUT US (3 danh mục)</h4>
                <p className="text-xs text-gray-500">Hiển thị khi mở menu About Us trên Header</p>
              </div>
              <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 font-medium rounded-full">
                3 Khung ảnh
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {/* Item 1: Company Overview */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Company Overview</span>
                  {values.menuImgAboutCompany && (
                    <button
                      type="button"
                      onClick={() => handleMenuImageChange("menuImgAboutCompany", "Company Overview", "")}
                      className="text-[11px] text-red-500 hover:underline"
                    >
                      Dùng mặc định
                    </button>
                  )}
                </div>
                {/* Live Preview Card */}
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-neutral-900 border border-gray-200 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={values.menuImgAboutCompany || DEFAULT_MENU_IMAGES.menuImgAboutCompany}
                    alt="Company Overview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 flex items-center justify-center p-2 text-center">
                    <span className="text-xs font-bold text-white tracking-wider uppercase drop-shadow-md">
                      Company Overview
                    </span>
                  </div>
                </div>
                <ImageUpload
                  value={values.menuImgAboutCompany}
                  onChange={(url) => handleMenuImageChange("menuImgAboutCompany", "Company Overview", url)}
                  label="Đổi ảnh Company Overview"
                />
              </div>

              {/* Item 2: Portfolio */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Portfolio</span>
                  {values.menuImgAboutPortfolio && (
                    <button
                      type="button"
                      onClick={() => handleMenuImageChange("menuImgAboutPortfolio", "Portfolio", "")}
                      className="text-[11px] text-red-500 hover:underline"
                    >
                      Dùng mặc định
                    </button>
                  )}
                </div>
                {/* Live Preview Card */}
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-neutral-900 border border-gray-200 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={values.menuImgAboutPortfolio || DEFAULT_MENU_IMAGES.menuImgAboutPortfolio}
                    alt="Portfolio"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 flex items-center justify-center p-2 text-center">
                    <span className="text-xs font-bold text-white tracking-wider uppercase drop-shadow-md">
                      Portfolio
                    </span>
                  </div>
                </div>
                <ImageUpload
                  value={values.menuImgAboutPortfolio}
                  onChange={(url) => handleMenuImageChange("menuImgAboutPortfolio", "Portfolio", url)}
                  label="Đổi ảnh Portfolio"
                />
              </div>

              {/* Item 3: Workflow */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Workflow</span>
                  {values.menuImgAboutWorkflow && (
                    <button
                      type="button"
                      onClick={() => handleMenuImageChange("menuImgAboutWorkflow", "Workflow", "")}
                      className="text-[11px] text-red-500 hover:underline"
                    >
                      Dùng mặc định
                    </button>
                  )}
                </div>
                {/* Live Preview Card */}
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-neutral-900 border border-gray-200 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={values.menuImgAboutWorkflow || DEFAULT_MENU_IMAGES.menuImgAboutWorkflow}
                    alt="Workflow"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 flex items-center justify-center p-2 text-center">
                    <span className="text-xs font-bold text-white tracking-wider uppercase drop-shadow-md">
                      Workflow
                    </span>
                  </div>
                </div>
                <ImageUpload
                  value={values.menuImgAboutWorkflow}
                  onChange={(url) => handleMenuImageChange("menuImgAboutWorkflow", "Workflow", url)}
                  label="Đổi ảnh Workflow"
                />
              </div>
            </div>
          </div>

          {/* 2. Blogs & Articles Section */}
          <div className="border border-gray-100 rounded-xl p-5 bg-gray-50/50 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200/60 pb-3">
              <div>
                <h4 className="font-semibold text-gray-800 text-sm">2. Mục BLOGS & ARTICLES (5 danh mục)</h4>
                <p className="text-xs text-gray-500">Hiển thị khi mở menu Blogs trên Header</p>
              </div>
              <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 font-medium rounded-full">
                5 Khung ảnh
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-2">
              {/* Item 1: Case Study */}
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700 truncate">Case Study</span>
                  {values.menuImgBlogCaseStudy && (
                    <button
                      type="button"
                      onClick={() => handleMenuImageChange("menuImgBlogCaseStudy", "Case Study", "")}
                      className="text-[10px] text-red-500 hover:underline"
                    >
                      Mặc định
                    </button>
                  )}
                </div>
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-neutral-900 border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={values.menuImgBlogCaseStudy || DEFAULT_MENU_IMAGES.menuImgBlogCaseStudy}
                    alt="Case Study"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 flex items-center justify-center p-1 text-center">
                    <span className="text-[11px] font-bold text-white tracking-wider uppercase drop-shadow-md">
                      Case Study
                    </span>
                  </div>
                </div>
                <ImageUpload
                  value={values.menuImgBlogCaseStudy}
                  onChange={(url) => handleMenuImageChange("menuImgBlogCaseStudy", "Case Study", url)}
                  label="Đổi ảnh"
                />
              </div>

              {/* Item 2: Technique Sharing */}
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700 truncate">Technique</span>
                  {values.menuImgBlogTips && (
                    <button
                      type="button"
                      onClick={() => handleMenuImageChange("menuImgBlogTips", "Technique Sharing", "")}
                      className="text-[10px] text-red-500 hover:underline"
                    >
                      Mặc định
                    </button>
                  )}
                </div>
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-neutral-900 border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={values.menuImgBlogTips || DEFAULT_MENU_IMAGES.menuImgBlogTips}
                    alt="Technique Sharing"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 flex items-center justify-center p-1 text-center">
                    <span className="text-[11px] font-bold text-white tracking-wider uppercase drop-shadow-md">
                      Technique Sharing
                    </span>
                  </div>
                </div>
                <ImageUpload
                  value={values.menuImgBlogTips}
                  onChange={(url) => handleMenuImageChange("menuImgBlogTips", "Technique Sharing", url)}
                  label="Đổi ảnh"
                />
              </div>

              {/* Item 3: Knowledge */}
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700 truncate">Knowledge</span>
                  {values.menuImgBlogKnowledge && (
                    <button
                      type="button"
                      onClick={() => handleMenuImageChange("menuImgBlogKnowledge", "Knowledge", "")}
                      className="text-[10px] text-red-500 hover:underline"
                    >
                      Mặc định
                    </button>
                  )}
                </div>
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-neutral-900 border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={values.menuImgBlogKnowledge || DEFAULT_MENU_IMAGES.menuImgBlogKnowledge}
                    alt="Knowledge"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 flex items-center justify-center p-1 text-center">
                    <span className="text-[11px] font-bold text-white tracking-wider uppercase drop-shadow-md">
                      Knowledge
                    </span>
                  </div>
                </div>
                <ImageUpload
                  value={values.menuImgBlogKnowledge}
                  onChange={(url) => handleMenuImageChange("menuImgBlogKnowledge", "Knowledge", url)}
                  label="Đổi ảnh"
                />
              </div>

              {/* Item 4: AI Column */}
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700 truncate">AI Column</span>
                  {values.menuImgBlogAi && (
                    <button
                      type="button"
                      onClick={() => handleMenuImageChange("menuImgBlogAi", "AI Column", "")}
                      className="text-[10px] text-red-500 hover:underline"
                    >
                      Mặc định
                    </button>
                  )}
                </div>
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-neutral-900 border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={values.menuImgBlogAi || DEFAULT_MENU_IMAGES.menuImgBlogAi}
                    alt="AI Column"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 flex items-center justify-center p-1 text-center">
                    <span className="text-[11px] font-bold text-white tracking-wider uppercase drop-shadow-md">
                      AI Column
                    </span>
                  </div>
                </div>
                <ImageUpload
                  value={values.menuImgBlogAi}
                  onChange={(url) => handleMenuImageChange("menuImgBlogAi", "AI Column", url)}
                  label="Đổi ảnh"
                />
              </div>

              {/* Item 5: i8 Life Gallery */}
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700 truncate">Life Gallery</span>
                  {values.menuImgBlogLifeGallery && (
                    <button
                      type="button"
                      onClick={() => handleMenuImageChange("menuImgBlogLifeGallery", "Life Gallery", "")}
                      className="text-[10px] text-red-500 hover:underline"
                    >
                      Mặc định
                    </button>
                  )}
                </div>
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-neutral-900 border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={values.menuImgBlogLifeGallery || DEFAULT_MENU_IMAGES.menuImgBlogLifeGallery}
                    alt="i8 Life Gallery"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 flex items-center justify-center p-1 text-center">
                    <span className="text-[11px] font-bold text-white tracking-wider uppercase drop-shadow-md">
                      Life Gallery
                    </span>
                  </div>
                </div>
                <ImageUpload
                  value={values.menuImgBlogLifeGallery}
                  onChange={(url) => handleMenuImageChange("menuImgBlogLifeGallery", "Life Gallery", url)}
                  label="Đổi ảnh"
                />
              </div>
            </div>
          </div>
        </div>

        {/* === About Us Images === */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-gray-800">Hình ảnh Giới thiệu (About Us Content)</h3>
            <p className="text-sm text-gray-500 mt-1">
              Tải lên hình ảnh thực tế cho phần giới thiệu (Our Team, Văn phòng Đà Nẵng, Chất lượng hàng đầu).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hero Section (Ảnh nền đầu trang)</label>
              <ImageUpload value={values.aboutHeroImage} onChange={handleAboutHeroImageChange} label="Tải lên ảnh Hero" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Our Team (Mục Đội ngũ)</label>
              <ImageUpload value={values.aboutImageTeam} onChange={handleAboutImageTeamChange} label="Tải lên ảnh Team" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Da Nang Office</label>
              <ImageUpload value={values.aboutImageOffice} onChange={handleAboutImageOfficeChange} label="Tải lên ảnh văn phòng" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quality First</label>
              <ImageUpload value={values.aboutImageQuality} onChange={handleAboutImageQualityChange} label="Tải lên ảnh chất lượng" />
            </div>
          </div>
        </div>

        {/* === Info === */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <strong>Lưu ý:</strong> Ảnh upload tự động lưu ngay và làm mới trang. Kích thước logo cần nhấn{" "}
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
            <div><span className="text-gray-400">footerLogoImage:</span> {values.footerLogoImage || "(trống — dùng logoImage)"}</div>
            <div><span className="text-gray-400">logoFooterHeight:</span> {values.logoFooterHeight}</div>
            <div><span className="text-gray-400">aboutHeroImage:</span> {values.aboutHeroImage || "(trống)"}</div>
            <div><span className="text-gray-400">aboutImageTeam:</span> {values.aboutImageTeam || "(trống)"}</div>
            <div><span className="text-gray-400">aboutImageOffice:</span> {values.aboutImageOffice || "(trống)"}</div>
            <div><span className="text-gray-400">aboutImageQuality:</span> {values.aboutImageQuality || "(trống)"}</div>
            <div><span className="text-gray-400">cursorImage:</span> {values.cursorImage || "(trống)"}</div>
            <div><span className="text-gray-400">cursorEnabled:</span> {values.cursorEnabled}</div>
            <div><span className="text-gray-400">cursorSize:</span> {values.cursorSize}</div>
          </div>
          <button type="button" onClick={fetchSettings} className="mt-3 text-blue-600 underline text-xs">
            Tải lại từ DB
          </button>
        </details>

      </div>
    </AdminShell>
  );
}
