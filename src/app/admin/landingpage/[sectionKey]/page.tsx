"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { useToast } from "@/components/admin/Toast";
import {
  Save,
  RotateCcw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Globe,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  GitCommit,
  LayoutGrid,
  FolderCheck,
  ShieldCheck,
  Compass,
  DollarSign,
  Plus,
  Trash2,
  Copy,
  Eye,
  Box,
  Upload,
  Home,
  Layers,
  Sliders,
  Filter,
  Check,
  Building2,
  Phone,
  Mail,
  Clock,
  MapPin,
  Megaphone,
} from "lucide-react";
import {
  getDeliverableCollections,
  getApplicationCards,
  getDefaultApplicationCategories,
  getDefaultPartnerStats,
  getDefaultPartnerBrands,
  getGalleryProjectsData,
  getDefaultPricingTiers,
  getDefaultPricingStackPages,
  type PricingStackPageItem,
  type PricingStackMediaItem,
} from "@/app/[locale]/landingpage/landingI18n";

interface SectionMeta {
  key: string;
  order: number;
  label: string;
  subLabel: string;
  anchor: string;
}

const SECTION_META: Record<string, SectionMeta> = {
  hero: {
    key: "hero",
    order: 1,
    label: "01. Hero & Slogan",
    subLabel: "Mở đầu trang & Diễn họa 3D tương tác",
    anchor: "#hero",
  },
  "pain-points": {
    key: "pain-points",
    order: 2,
    label: "02. Nỗi đau & Giải pháp",
    subLabel: "4 Vấn đề trở ngại của gia chủ",
    anchor: "#quy-trinh",
  },
  partners: {
    key: "partners",
    order: 3,
    label: "03. Thương hiệu & Đối tác",
    subLabel: "Thống kê quy mô & Logo marquee",
    anchor: "#khach-hang",
  },
  workflow: {
    key: "workflow",
    order: 4,
    label: "04. Quy trình làm việc",
    subLabel: "Lộ trình kiểm soát tiến độ & thiết kế",
    anchor: "#dich-vu",
  },
  deliverables: {
    key: "deliverables",
    order: 5,
    label: "05. Sản phẩm đã bàn giao cho KH",
    subLabel: "Chi tiết các bộ sưu tập hồ sơ kỹ thuật",
    anchor: "#bo-suu-tap",
  },
  applications: {
    key: "applications",
    order: 6,
    label: "06. Ứng dụng thực tiễn",
    subLabel: "Giải pháp theo từng đối tượng kiến trúc",
    anchor: "#ung-dung-thuc-te",
  },
  gallery: {
    key: "gallery",
    order: 7,
    label: "07. Giá cả",
    subLabel: "5 Trang thẻ lật 3D (View Std/HQ, Movie, VR360, VR SS), Nền Background & Báo giá",
    anchor: "#du-an",
  },
  cta: {
    key: "cta",
    order: 8,
    label: "08. CTA & Liên hệ",
    subLabel: "Sustainable Design, Slogan, Hotline & 4 Card Contact",
    anchor: "#dang-ky-tu-van",
  },
  pricing: {
    key: "cta",
    order: 8,
    label: "08. CTA & Liên hệ",
    subLabel: "Sustainable Design, Slogan, Hotline & 4 Card Contact",
    anchor: "#dang-ky-tu-van",
  },
};

export default function SectionEditorPage() {
  const params = useParams();
  const router = useRouter();
  const sectionKey = (params?.sectionKey as string) || "hero";
  const meta = SECTION_META[sectionKey] || {
    key: sectionKey,
    order: 0,
    label: sectionKey,
    subLabel: "",
    anchor: "",
  };

  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeLang, setActiveLang] = useState<"ja" | "en" | "both">("ja");
  const [contentEn, setContentEn] = useState<any>(null);
  const [contentJa, setContentJa] = useState<any>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [sectionBgColor, setSectionBgColor] = useState<string>("#F4F3EF");

  const fetchSectionData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/landing-page/${sectionKey}`, { cache: "no-store" });
      const data = await res.json();
      if (data.success && data.data) {
        setContentEn(data.data.contentEn);
        setContentJa(data.data.contentJa);
        setUpdatedAt(data.data.updatedAt || null);
        if (data.backgroundColor) setSectionBgColor(data.backgroundColor);
      } else {
        toast("Không thể tải dữ liệu section này", "error");
      }
    } catch (e) {
      toast("Lỗi kết nối khi tải section", "error");
    } finally {
      setLoading(false);
    }
  }, [sectionKey, toast]);

  useEffect(() => {
    fetchSectionData();
  }, [fetchSectionData]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/landing-page/${sectionKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentEn,
          contentJa,
          backgroundColor: sectionBgColor || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast(`Đã lưu thành công ${meta.label}!`, "success");
        setUpdatedAt(data.data.updatedAt);
      } else {
        toast(data.error || "Lỗi khi lưu dữ liệu", "error");
      }
    } catch (e) {
      toast("Lỗi mạng khi lưu dữ liệu", "error");
    } finally {
      setSaving(false);
    }
  };

  // Helper for deep setting field
  const updateField = (lang: "en" | "ja", path: string[], value: any) => {
    const setter = lang === "en" ? setContentEn : setContentJa;
    setter((prev: any) => {
      const clone = JSON.parse(JSON.stringify(prev || {}));
      if (path.length === 1) {
        clone[path[0]] = value;
        return clone;
      }
      let cur = clone;
      for (let i = 0; i < path.length - 1; i++) {
        const p = path[i];
        if (!cur[p]) {
          cur[p] = !isNaN(Number(path[i + 1])) ? [] : {};
        }
        cur = cur[p];
      }
      cur[path[path.length - 1]] = value;
      return clone;
    });
  };

  if (loading) {
    return (
      <AdminShell title={meta.label}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-500 font-medium">Đang tải dữ liệu {meta.label}...</p>
          </div>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title={meta.label}>
      <div className="max-w-6xl mx-auto space-y-6 pb-20">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/admin/landingpage" className="hover:text-blue-600 font-medium flex items-center gap-1">
              <ChevronLeft size={16} />
              Landing Page
            </Link>
            <ChevronRight size={14} />
            <span className="text-slate-800 font-bold">{meta.label}</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/ja/landingpage${meta.anchor}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm"
            >
              <span>Xem trực tiếp (JA)</span>
              <ExternalLink size={13} />
            </Link>
            <Link
              href={`/en/landingpage${meta.anchor}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm"
            >
              <span>Xem trực tiếp (EN)</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        </div>

        {/* Section Header & Sticky Action Bar */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Section #{meta.order}
              </span>
              {updatedAt && (
                <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium border border-emerald-200">
                  Cập nhật: {new Date(updatedAt).toLocaleTimeString("vi-VN")} {new Date(updatedAt).toLocaleDateString("vi-VN")}
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">{meta.label}</h1>
            <p className="text-xs text-slate-500">{meta.subLabel}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveLang("ja")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${activeLang === "ja"
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                🇯🇵 Tiếng Nhật (JA)
              </button>
              <button
                type="button"
                onClick={() => setActiveLang("en")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${activeLang === "en"
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                🇬🇧 Tiếng Anh (EN)
              </button>
              <button
                type="button"
                onClick={() => setActiveLang("both")}
                className={`hidden md:block px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${activeLang === "both"
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                Song ngữ (Cả 2)
              </button>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-all disabled:opacity-50"
            >
              <Save size={16} className={saving ? "animate-spin" : ""} />
              <span>{saving ? "Đang lưu..." : "Lưu thay đổi"}</span>
            </button>
          </div>
        </div>

        {/* Form content depending on sectionKey */}
        <div className="space-y-6">
          {sectionKey === "hero" && (
            <HeroSectionForm
              lang={activeLang}
              contentJa={contentJa}
              contentEn={contentEn}
              updateField={updateField}
            />
          )}

          {sectionKey === "pain-points" && (
            <PainPointsForm
              lang={activeLang}
              contentJa={contentJa}
              contentEn={contentEn}
              updateField={updateField}
            />
          )}

          {sectionKey === "workflow" && (
            <WorkflowForm
              lang={activeLang}
              contentJa={contentJa}
              contentEn={contentEn}
              updateField={updateField}
            />
          )}



          {sectionKey === "deliverables" && (
            <DeliverablesForm
              lang={activeLang}
              contentJa={contentJa}
              contentEn={contentEn}
              updateField={updateField}
            />
          )}

          {sectionKey === "clients" && (
            <ClientsForm
              lang={activeLang}
              contentJa={contentJa}
              contentEn={contentEn}
              updateField={updateField}
            />
          )}

          {sectionKey === "applications" && (
            <ApplicationsForm
              lang={activeLang}
              contentJa={contentJa}
              contentEn={contentEn}
              updateField={updateField}
            />
          )}

          {sectionKey === "partners" && (
            <PartnersForm
              lang={activeLang}
              contentJa={contentJa}
              contentEn={contentEn}
              updateField={updateField}
            />
          )}

          {sectionKey === "gallery" && (
            <GalleryForm
              lang={activeLang}
              contentJa={contentJa}
              contentEn={contentEn}
              updateField={updateField}
              sectionBgColor={sectionBgColor}
              setSectionBgColor={setSectionBgColor}
            />
          )}

          {(sectionKey === "pricing" || sectionKey === "cta") && (
            <CtaForm
              lang={activeLang}
              contentJa={contentJa}
              contentEn={contentEn}
              updateField={updateField}
            />
          )}
        </div>

        {/* Bottom Floating Save Bar */}
        <div className="sticky bottom-4 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-slate-200 shadow-lg flex items-center justify-between z-20">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span>Nội dung được lưu trực tiếp vào cơ sở dữ liệu và tự động làm mới trang web.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchSectionData}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              <RotateCcw size={14} />
              <span>Hủy bỏ & tải lại</span>
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-all disabled:opacity-50"
            >
              <Save size={16} className={saving ? "animate-spin" : ""} />
              <span>{saving ? "Đang lưu..." : "Lưu thay đổi ngay"}</span>
            </button>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

/* -------------------------------------------------------------------------
   BILINGUAL INPUT FIELD HELPER
   ------------------------------------------------------------------------- */
function BilingualField({
  label,
  subLabel,
  path,
  contentJa,
  contentEn,
  updateField,
  activeLang,
  isTextArea = false,
  rows = 3,
  defaultValueJa,
  defaultValueEn,
}: {
  label: string;
  subLabel?: string;
  path: string[];
  contentJa: any;
  contentEn: any;
  updateField: (lang: "en" | "ja", path: string[], value: any) => void;
  activeLang: "ja" | "en" | "both";
  isTextArea?: boolean;
  rows?: number;
  defaultValueJa?: string;
  defaultValueEn?: string;
}) {
  const getVal = (obj: any) => {
    if (!obj) return undefined;
    let cur = obj;
    for (const p of path) {
      if (cur === undefined || cur === null) return undefined;
      cur = cur[p];
    }
    return cur;
  };

  const rawJa = getVal(contentJa);
  const valJa = rawJa !== undefined && rawJa !== null ? String(rawJa) : (defaultValueJa ?? "");

  const rawEn = getVal(contentEn);
  const valEn = rawEn !== undefined && rawEn !== null ? String(rawEn) : (defaultValueEn ?? "");

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <label className="text-xs font-bold text-slate-800 tracking-wide">{label}</label>
        {subLabel && <span className="text-[11px] text-slate-400">{subLabel}</span>}
      </div>

      <div className={`grid gap-3 ${activeLang === "both" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
        {(activeLang === "ja" || activeLang === "both") && (
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              🇯🇵 Tiếng Nhật (JA)
            </span>
            {isTextArea ? (
              <textarea
                value={valJa}
                rows={rows}
                onChange={(e) => updateField("ja", path, e.target.value)}
                className="w-full px-3 py-2 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            ) : (
              <input
                type="text"
                value={valJa}
                onChange={(e) => updateField("ja", path, e.target.value)}
                className="w-full px-3 py-2 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            )}
          </div>
        )}

        {(activeLang === "en" || activeLang === "both") && (
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              🇬🇧 Tiếng Anh (EN)
            </span>
            {isTextArea ? (
              <textarea
                value={valEn}
                rows={rows}
                onChange={(e) => updateField("en", path, e.target.value)}
                className="w-full px-3 py-2 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            ) : (
              <input
                type="text"
                value={valEn}
                onChange={(e) => updateField("en", path, e.target.value)}
                className="w-full px-3 py-2 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   01. HERO SECTION FORM
   ------------------------------------------------------------------------- */
function HeroSectionForm({
  lang,
  contentJa,
  contentEn,
  updateField,
}: {
  lang: "ja" | "en" | "both";
  contentJa: any;
  contentEn: any;
  updateField: (lang: "en" | "ja", path: string[], value: any) => void;
}) {
  const { toast } = useToast();
  const [uploadingBg, setUploadingBg] = useState(false);

  const handleUploadHeroBg = async (file: File) => {
    try {
      setUploadingBg(true);
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        if (data?.url) {
          updateField("ja", ["backgroundImage"], data.url);
          updateField("ja", ["image"], data.url);
          updateField("en", ["backgroundImage"], data.url);
          updateField("en", ["image"], data.url);
          toast("Tải ảnh nền Hero thành công!", "success");
        }
      } else {
        toast("Lỗi tải ảnh lên máy chủ", "error");
      }
    } catch {
      toast("Có lỗi xảy ra khi tải ảnh", "error");
    } finally {
      setUploadingBg(false);
    }
  };

  const currentBgUrl =
    contentJa?.backgroundImage ||
    contentJa?.image ||
    contentEn?.backgroundImage ||
    contentEn?.image ||
    "/uploads/1791280382417-anh-section5.webp";

  return (
    <div className="space-y-6">
      {/* 1. KHỐI ẢNH NỀN HERO & NÚT UPLOAD */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-blue-500" />
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              1. Ảnh nền Hero Section (Background Image)
            </h2>
          </div>
          {/* Nút Upload trực tiếp ảnh nền */}
          <label className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg cursor-pointer transition shadow-sm">
            <Upload size={14} />
            <span>{uploadingBg ? "Đang tải ảnh..." : "Tải ảnh nền lên"}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploadingBg}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUploadHeroBg(file);
              }}
            />
          </label>
        </div>

        {/* Thumbnail preview ảnh nền đang chọn */}
        <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="w-32 h-20 rounded-md overflow-hidden bg-slate-900 border border-slate-300 shrink-0 relative flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentBgUrl}
              alt="Hero Background Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <p className="text-xs font-semibold text-slate-800 truncate">
              Ảnh nền hiện tại: <span className="font-mono text-blue-600">{currentBgUrl}</span>
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Bấm nút &quot;Tải ảnh nền lên&quot; ở trên để chọn ảnh từ máy tính, hoặc chỉnh sửa trực tiếp đường dẫn bên dưới.
            </p>
          </div>
        </div>

        <BilingualField
          label="Đường dẫn ảnh nền kiến trúc (Image URL / Path)"
          subLabel="Ví dụ: /uploads/1791280382417-anh-section5.webp hoặc URL ảnh chất lượng cao Unsplash"
          path={["backgroundImage"]}
          contentJa={contentJa}
          contentEn={contentEn}
          defaultValueJa={contentJa?.backgroundImage || contentJa?.image || "/uploads/1791280382417-anh-section5.webp"}
          defaultValueEn={contentEn?.backgroundImage || contentEn?.image || "/uploads/1791280382417-anh-section5.webp"}
          updateField={updateField}
          activeLang={lang}
        />
      </div>

      {/* 2. KHỐI THƯƠNG HIỆU & TIÊU ĐỀ CHÍNH CĂN TRÁI (CHUẨN ẢNH 3) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Sparkles size={18} className="text-amber-500" />
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
            2. Thương hiệu & Tiêu đề chính căn trái (Hero Brand & Headline)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BilingualField
            label="Tên thương hiệu góc trên (Brand Name)"
            subLabel="Ví dụ: KAPUTELI hoặc i8STUDIO"
            path={["brandName"]}
            contentJa={contentJa}
            contentEn={contentEn}
            defaultValueJa={contentJa?.brandName || "KAPUTELI"}
            defaultValueEn={contentEn?.brandName || "KAPUTELI"}
            updateField={updateField}
            activeLang={lang}
          />

          <BilingualField
            label="Tagline phụ sau gạch ngang (Brand Subtagline)"
            subLabel="Ví dụ: 実務直結型パースコンサルティング"
            path={["brandSub"]}
            contentJa={contentJa}
            contentEn={contentEn}
            defaultValueJa={contentJa?.brandSub || "実務直結型パースコンサルティング"}
            defaultValueEn={contentEn?.brandSub || "Direct Practice Perspective Consulting"}
            updateField={updateField}
            activeLang={lang}
          />
        </div>

        <BilingualField
          label="Tiêu đề chính phong cách thơ Nhật (Headline - Căn lề trái)"
          subLabel="Hỗ trợ nhập </br> hoặc <r> hoặc xuống dòng để ngắt nhịp câu như ảnh mẫu."
          path={["headline"]}
          contentJa={contentJa}
          contentEn={contentEn}
          defaultValueJa={
            contentJa?.headline ||
            `設計の思想も、\n販売のロジックも、\n建築の構造も。\n\nすべて知っているから、\nあなたの指示は「これお願い」\nだけでいい。`
          }
          defaultValueEn={
            contentEn?.headline ||
            `Design philosophy,\nSales logic,\nArchitectural structure.\n\nKnowing it all,\nyour only instruction is\n"Please take care of this."`
          }
          updateField={updateField}
          activeLang={lang}
          isTextArea
          rows={5}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <BilingualField
            label="Đoạn mô tả vạch đứng - Dòng 1 (Description Line 1)"
            subLabel="Ví dụ: 担当者の成果を作る「販売の武器」を提供する。"
            path={["desc"]}
            contentJa={contentJa}
            contentEn={contentEn}
            defaultValueJa={contentJa?.desc || "担当者の成果を作る「販売の武器」を提供する。"}
            defaultValueEn={contentEn?.desc || "Providing sales weapons that deliver measurable results."}
            updateField={updateField}
            activeLang={lang}
          />

          <BilingualField
            label="Đoạn mô tả vạch đứng - Dòng 2 (Description Line 2)"
            subLabel="Ví dụ: 株式会社カプテリ ｜ 実務直結型パースコンサルティング"
            path={["descSub"]}
            contentJa={contentJa}
            contentEn={contentEn}
            defaultValueJa={contentJa?.descSub || "株式会社カプテリ ｜ 実務直結型パースコンサルティング"}
            defaultValueEn={contentEn?.descSub || "KAPUTELI Co., Ltd. | Architectural Consulting"}
            updateField={updateField}
            activeLang={lang}
          />
        </div>
      </div>

      {/* 3. CẤU HÌNH CẶP NÚT: NÚT VÀNG CONTACT & CARD SỐ ĐIỆN THOẠI (CHỈ XEM, KÍCH THƯỚC BẰNG NHAU) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
            <span>3. Cấu hình Cặp Nút: Nút Vàng Contact & Card Số Điện Thoại (Kích thước bằng nhau)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Hai nút có kích thước ngang bằng nhau. Nút chính màu vàng là nút Contact (chuyển sang form). Card bên cạnh chỉ hiển thị duy nhất số điện thoại (chỉ để xem, không click).
          </p>
        </div>

        {/* NÚT VÀNG: CONTACT */}
        <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2">
          <label className="block text-xs font-bold text-amber-950 uppercase tracking-wide">
            ★ Nút chính màu vàng (Contact CTA):
          </label>
          <BilingualField
            label="Tiêu đề nút vàng Contact"
            subLabel="Mặc định: Contact → hoặc プロジェクト相談 →"
            path={["ctaContact"]}
            contentJa={contentJa}
            contentEn={contentEn}
            defaultValueJa="Contact →"
            defaultValueEn="Contact →"
            updateField={updateField}
            activeLang={lang}
          />
        </div>

        {/* CARD BÊN CẠNH: CHỈ HIỂN THỊ SỐ ĐIỆN THOẠI (KHÔNG CÓ CHỮ THỪA) */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
            ★ Card bên cạnh: Số điện thoại (Chỉ xem, kích thước bằng nút Contact, không để chữ nào khác):
          </label>
          <div className="max-w-md space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Số điện thoại Hotline:
            </label>
            <input
              type="text"
              value={contentJa?.ctaPhoneNumber ?? contentEn?.ctaPhoneNumber ?? "03-5315-4001"}
              onChange={(e) => {
                updateField("ja", ["ctaPhoneNumber"], e.target.value);
                updateField("en", ["ctaPhoneNumber"], e.target.value);
              }}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white font-mono font-bold text-amber-700 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="03-5315-4001"
            />
            <p className="text-[11px] text-slate-400">
              Mặc định: <span className="font-mono font-bold text-slate-600">03-5315-4001</span>. Trên giao diện User card này chỉ hiển thị số điện thoại, không click được (chỉ xem).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   01.B. 3D ARCHITECTURAL MODEL MANAGER
   ------------------------------------------------------------------------- */
function Model3DManager({
  lang,
  contentJa,
  contentEn,
  updateField,
}: {
  lang: "ja" | "en" | "both";
  contentJa: any;
  contentEn: any;
  updateField: (lang: "en" | "ja", path: string[], value: any) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const { toast } = useToast();

  const mJa = contentJa?.model3d || {};
  const mEn = contentEn?.model3d || {};

  const currentMode: "preset" | "custom" = mJa.mode || mEn.mode || "preset";
  const currentPreset = mJa.presetId || mEn.presetId || "tropical-villa";
  const currentModelUrl = mJa.customModelUrl || mEn.customModelUrl || "";
  const currentSpeed = typeof mJa.rotationSpeed === "number" ? mJa.rotationSpeed : 1;
  const currentWireframe = mJa.showWireframe !== false;
  const currentColor = mJa.wireframeColor || "#f59e0b";
  const currentParticles = mJa.ambientParticles !== false;
  const currentScale = mJa.initialScale || 1;
  const currentPositionX = typeof mJa.positionX === "number" ? mJa.positionX : 5.0;
  const currentPositionY = typeof mJa.positionY === "number" ? mJa.positionY : 0.6;

  const setModelConfigBoth = (key: string, val: any) => {
    updateField("ja", ["model3d", key], val);
    updateField("en", ["model3d", key], val);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "glb" && ext !== "gltf") {
      setUploadError("Vui lòng chọn định dạng file 3D (.glb hoặc .gltf)");
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setModelConfigBoth("mode", "custom");
        setModelConfigBoth("customModelUrl", data.url);
        const autoName = file.name.replace(/\.[^.]+$/, "").toUpperCase();
        if (!mEn.modelName) setModelConfigBoth("modelName", autoName);
        toast("Tải lên file 3D thành công!", "success");
      } else {
        setUploadError(data.error || "Tải lên thất bại");
        toast(data.error || "Tải lên thất bại", "error");
      }
    } catch (err: any) {
      setUploadError(err.message || "Lỗi mạng khi tải lên");
      toast("Lỗi mạng khi tải lên mô hình 3D", "error");
    } finally {
      setUploading(false);
    }
  };

  const PRESETS = [
    {
      id: "tropical-villa",
      title: "Biệt thự nhiệt đới hồ bơi",
      titleEn: "Tropical Modern Pool Villa",
      desc: "Biệt thự nghỉ dưỡng hồ bơi sân trong, hiên gỗ, ban công cantilever & chiếu sáng hoàng hôn ấm áp.",
      icon: Home,
      badge: "Signature Resort",
    },
    {
      id: "cubic-modern",
      title: "Nhà phố hình khối hiện đại",
      titleEn: "Minimalist Cubic Residence",
      desc: "Khối kiến trúc giật cấp đa tầng, giếng trời thông tầng, ribbon windows & sân thượng cảnh quan.",
      icon: Layers,
      badge: "Modern Urban",
    },
    {
      id: "glass-pavilion",
      title: "Biệt thự kính & Sky Deck",
      titleEn: "Glass Pavilion & Sky Deck",
      desc: "Không gian mở toàn cảnh vách kính floor-to-ceiling, mái bay siêu mỏng & hồ nước phản chiếu ánh sáng.",
      icon: Sparkles,
      badge: "Luxury Pavilion",
    },
  ];

  const COLOR_OPTIONS = [
    { label: "Vàng Hổ Phách", value: "#f59e0b", bg: "bg-[#f59e0b]" },
    { label: "Xanh Cyan", value: "#38bdf8", bg: "bg-[#38bdf8]" },
    { label: "Trắng Bạc", value: "#e2e8f0", bg: "bg-[#e2e8f0]" },
    { label: "Xanh Ngọc", value: "#10b981", bg: "bg-[#10b981]" },
  ];

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Box size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              4. Cấu hình & Đăng tải Khối nhà 3D xoay tương tác
            </h2>
            <p className="text-xs text-slate-500">
              Chọn mẫu kiến trúc 3D có sẵn hoặc tải lên file 3D (.glb / .gltf) công trình riêng của studio.
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200 shrink-0">
          <button
            type="button"
            onClick={() => setModelConfigBoth("mode", "preset")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${currentMode === "preset"
                ? "bg-white text-blue-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
              }`}
          >
            Mẫu có sẵn (Preset)
          </button>
          <button
            type="button"
            onClick={() => setModelConfigBoth("mode", "custom")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${currentMode === "custom"
                ? "bg-white text-blue-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
              }`}
          >
            Tải lên file 3D (.GLB/.GLTF)
          </button>
        </div>
      </div>

      {/* Preset Mode Selection */}
      {currentMode === "preset" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Chọn mẫu thiết kế nhà 3D có sẵn:
            </span>
            <span className="text-xs text-slate-400">Render 3D thời gian thực tương tác 360°</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {PRESETS.map((p) => {
              const Icon = p.icon;
              const isSelected = currentPreset === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    setModelConfigBoth("presetId", p.id);
                    setModelConfigBoth("modelName", p.titleEn.toUpperCase());
                  }}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${isSelected
                      ? "border-blue-600 bg-blue-50/40 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                    }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
                        }`}>
                        <Icon size={16} />
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isSelected ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-600"
                        }`}>
                        {p.badge}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{p.title}</h4>
                      <p className="text-[11px] font-medium text-slate-500">{p.titleEn}</p>
                    </div>

                    <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold">
                    <span className={isSelected ? "text-blue-600" : "text-slate-400"}>
                      {isSelected ? "✓ Đang chọn" : "Nhấn để chọn"}
                    </span>
                    {isSelected && <Check size={14} className="text-blue-600" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Custom Upload Mode */}
      {currentMode === "custom" && (
        <div className="space-y-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Đăng tải mô hình 3D (.GLB / .GLTF)
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Hệ thống hỗ trợ file nhị phân 3D chuẩn Web (.glb, .gltf) xuất từ 3ds Max, Blender, SketchUp, Revit hoặc Rhino. Dung lượng tối đa 100MB.
              </p>
            </div>
            {currentModelUrl && (
              <span className="text-[11px] text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full font-bold border border-emerald-300 shrink-0">
                ✓ Đã có file 3D tùy chỉnh
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* File Upload Button */}
            <div className="border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl p-5 bg-white text-center flex flex-col items-center justify-center transition-colors">
              <Upload size={28} className="text-blue-500 mb-2" />
              <label className="cursor-pointer">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all">
                  {uploading ? "Đang tải lên mô hình..." : "Chọn file 3D từ máy tính (.glb / .gltf)"}
                </span>
                <input
                  type="file"
                  accept=".glb,.gltf"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-slate-400 mt-2">
                Hoặc kéo thả file .glb vào đây (khuyến khích định dạng .glb nén tối ưu)
              </p>
              {uploadError && (
                <p className="text-xs text-red-600 font-medium mt-2">{uploadError}</p>
              )}
            </div>

            {/* Direct URL Input */}
            <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Đường dẫn trực tiếp tới file 3D (Model URL):
                </label>
                <input
                  type="text"
                  value={currentModelUrl}
                  placeholder="/models/NHA_32.glb hoặc https://..."
                  onChange={(e) => setModelConfigBoth("customModelUrl", e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono text-slate-800 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Hỗ trợ: Link file 3D (.glb / .gltf) hoặc link trang Web 3D / VR360 (ví dụ: vr.i8studio.vn). Hệ thống sẽ tự động đồng bộ hiển thị.
                </p>

                <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setModelConfigBoth("mode", "custom");
                      setModelConfigBoth("customModelUrl", "/models/NHA_32.glb");
                      setModelConfigBoth("modelName", "THE JAPANESE MODERN RESIDENCE");
                      toast("Đã nạp mẫu Biệt thự 3D Nhật Bản (NHA_32.glb)", "info");
                    }}
                    className="text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-md transition-all flex items-center gap-1"
                  >
                    <span>+ Mẫu Biệt thự 3D (NHA_32.glb)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setModelConfigBoth("mode", "custom");
                      setModelConfigBoth("customModelUrl", "https://vr.i8studio.vn/360/Sample_AR_House/index.html");
                      setModelConfigBoth("modelName", "SAMPLE AR RESIDENCE 3D");
                      toast("Đã nạp link VR360 i8Studio", "info");
                    }}
                    className="text-[11px] font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-md transition-all flex items-center gap-1"
                  >
                    <span>+ Link vr.i8studio.vn</span>
                  </button>
                </div>
              </div>

              {currentModelUrl && (
                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <span className="text-[11px] text-slate-500 font-mono truncate max-w-[200px]">
                    {currentModelUrl}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setModelConfigBoth("customModelUrl", "");
                      setModelConfigBoth("mode", "preset");
                    }}
                    className="text-xs text-red-600 hover:text-red-700 font-medium hover:underline"
                  >
                    Xóa file tùy chỉnh
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Model Name Display */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <label className="text-xs font-bold text-slate-800">
          Tên công trình 3D hiển thị (Model Display Name)
        </label>
        <p className="text-[11px] text-slate-400">
          Xuất hiện trên huy hiệu nổi góc trên cùng mô hình 3D (ví dụ: THE TROPICAL COURTYARD VILLA)
        </p>

        <div className={`grid gap-3 ${lang === "both" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
          {(lang === "ja" || lang === "both") && (
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-500">🇯🇵 Tiếng Nhật (JA)</span>
              <input
                type="text"
                value={mJa.modelName || ""}
                placeholder="THE TROPICAL COURTYARD VILLA (トロピカル別荘)"
                onChange={(e) => updateField("ja", ["model3d", "modelName"], e.target.value)}
                className="w-full px-3 py-2 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}

          {(lang === "en" || lang === "both") && (
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-500">🇬🇧 Tiếng Anh (EN)</span>
              <input
                type="text"
                value={mEn.modelName || ""}
                placeholder="THE TROPICAL COURTYARD VILLA"
                onChange={(e) => updateField("en", ["model3d", "modelName"], e.target.value)}
                className="w-full px-3 py-2 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* 3D Interactive Controls & Tuning */}
      <div className="pt-3 border-t border-slate-100 space-y-4">
        <div className="flex items-center gap-2">
          <Sliders size={16} className="text-slate-600" />
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Các thông số điều khiển tương tác & Hiển thị 3D
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Rotation Speed */}
          <div className="space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <label className="text-xs font-semibold text-slate-700 block">
              Tốc độ quay tự động
            </label>
            <select
              value={currentSpeed}
              onChange={(e) => setModelConfigBoth("rotationSpeed", parseFloat(e.target.value))}
              className="w-full px-2.5 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-md outline-none"
            >
              <option value="0">Tắt xoay tự động (0x)</option>
              <option value="0.5">Xoay rất chậm (0.5x)</option>
              <option value="1">Xoay chuẩn (1x)</option>
              <option value="1.8">Xoay nhanh (1.8x)</option>
            </select>
          </div>

          {/* Wireframe Toggle & Color */}
          <div className="space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">Khung Wireframe</label>
              <input
                type="checkbox"
                checked={currentWireframe}
                onChange={(e) => setModelConfigBoth("showWireframe", e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-1 pt-1">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setModelConfigBoth("wireframeColor", c.value)}
                  className={`w-5 h-5 rounded-full border-2 transition-all ${c.bg} ${currentColor === c.value ? "border-slate-900 scale-110 shadow-sm" : "border-transparent"
                    }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Ambient Particles */}
          <div className="space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col justify-between">
            <div>
              <label className="text-xs font-semibold text-slate-700 block">
                Bụi sáng không gian
              </label>
              <p className="text-[10px] text-slate-400">Hạt ánh sáng lơ lửng</p>
            </div>
            <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={currentParticles}
                onChange={(e) => setModelConfigBoth("ambientParticles", e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>{currentParticles ? "Bật" : "Tắt"}</span>
            </label>
          </div>

          {/* Scale Multiplier */}
          <div className="space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <label className="text-xs font-semibold text-slate-700 block">
              Tỉ lệ kích thước
            </label>
            <select
              value={currentScale}
              onChange={(e) => setModelConfigBoth("initialScale", parseFloat(e.target.value))}
              className="w-full px-2.5 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-md outline-none"
            >
              <option value="0.8">Thu nhỏ (0.8x)</option>
              <option value="1">Chuẩn (1.0x)</option>
              <option value="1.2">Phóng to (1.2x)</option>
              <option value="1.4">Lớn (1.4x)</option>
              <option value="1.6">Rất lớn (1.6x)</option>
              <option value="1.8">Cực lớn (1.8x)</option>
            </select>
          </div>

          {/* Elevation Y */}
          <div className="space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <label className="text-xs font-semibold text-slate-700 block">
              Độ cao Y (Nâng lên)
            </label>
            <select
              value={currentPositionY}
              onChange={(e) => setModelConfigBoth("positionY", parseFloat(e.target.value))}
              className="w-full px-2.5 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-md outline-none"
            >
              <option value="1.0">Rất cao (+1.0)</option>
              <option value="0.6">Nâng cao (+0.6) [Khuyên dùng]</option>
              <option value="0.2">Vừa phải (+0.2)</option>
              <option value="-0.5">Hạ thấp (-0.5)</option>
              <option value="-1.8">Nguyên bản cũ (-1.8)</option>
            </select>
          </div>

          {/* Horizontal X */}
          <div className="space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <label className="text-xs font-semibold text-slate-700 block">
              Vị trí X (Dịch phải)
            </label>
            <select
              value={currentPositionX}
              onChange={(e) => setModelConfigBoth("positionX", parseFloat(e.target.value))}
              className="w-full px-2.5 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-md outline-none"
            >
              <option value="6.0">Dịch phải nhiều (+6.0)</option>
              <option value="5.2">Dịch phải chuẩn (+5.2) [Khuyên dùng]</option>
              <option value="4.0">Dịch phải nhẹ (+4.0)</option>
              <option value="2.5">Gần giữa (+2.5)</option>
              <option value="0">Chính giữa (0)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   02. PAIN POINTS SECTION FORM
   ------------------------------------------------------------------------- */
function PainPointsForm({
  lang,
  contentJa,
  contentEn,
  updateField,
}: {
  lang: "ja" | "en" | "both";
  contentJa: any;
  contentEn: any;
  updateField: (lang: "en" | "ja", path: string[], value: any) => void;
}) {
  const { toast } = useToast();

  const cardsJa: any[] = Array.isArray(contentJa?.cards) ? contentJa.cards : [];
  const cardsEn: any[] = Array.isArray(contentEn?.cards) ? contentEn.cards : [];
  const totalCount = Math.max(cardsJa.length, cardsEn.length);

  // Cards handlers
  const handleAddCard = () => {
    const nextIdx = totalCount + 1;
    const newJa = {
      quote: "「部材や納まりの不透明さが原因で、着工後に想定外の追加工事や材料費が発生するトラブルを事前に防ぎます。」",
    };
    const newEn = {
      quote: "“Pre-emptively prevents unexpected additional construction and material costs due to lack of clarity in components and detailing.”",
    };
    updateField("ja", ["cards"], [...cardsJa, newJa]);
    updateField("en", ["cards"], [...cardsEn, newEn]);
    toast(`Đã thêm Thẻ Nỗi đau #${nextIdx}`, "success");
  };

  const handleDeleteCard = (idx: number) => {
    if (totalCount <= 1) {
      toast("Phải giữ lại tối thiểu 1 thẻ nỗi đau", "error");
      return;
    }
    if (!confirm(`Bạn có chắc chắn muốn xóa Thẻ Nỗi đau #${idx + 1}?`)) return;

    const newJa = cardsJa.filter((_, i) => i !== idx);
    const newEn = cardsEn.filter((_, i) => i !== idx);

    updateField("ja", ["cards"], newJa);
    updateField("en", ["cards"], newEn);
    toast(`Đã xóa Thẻ Nỗi đau #${idx + 1}`, "info");
  };

  const handleDuplicateCard = (idx: number) => {
    const sourceJa = cardsJa[idx] || {};
    const sourceEn = cardsEn[idx] || {};

    const cloneJa = { ...sourceJa };
    const cloneEn = { ...sourceEn };

    updateField("ja", ["cards"], [...cardsJa, cloneJa]);
    updateField("en", ["cards"], [...cardsEn, cloneEn]);
    toast(`Đã nhân bản Thẻ Nỗi đau #${idx + 1}`, "success");
  };

  // Solutions data
  const solutionCardsJa: any[] = Array.isArray(contentJa?.solutionCards)
    ? contentJa.solutionCards
    : Array.isArray(contentJa?.solutionItems)
    ? contentJa.solutionItems
    : [];
  const solutionCardsEn: any[] = Array.isArray(contentEn?.solutionCards)
    ? contentEn.solutionCards
    : Array.isArray(contentEn?.solutionItems)
    ? contentEn.solutionItems
    : [];
  const totalSolCount = Math.max(solutionCardsJa.length, solutionCardsEn.length);

  const handleAddSolutionCard = () => {
    const nextIdx = totalSolCount + 1;
    const newJa = {
      quote: "一級建築士監修による8K高精細フォトリアル3DCGで、設計意図をミリ単位で正確に具現化",
    };
    const newEn = {
      quote: "Ultra-realistic 8K photoreal 3DCG supervised by first-class architects, realizing design intent with millimeter precision.",
    };
    updateField("ja", ["solutionCards"], [...solutionCardsJa, newJa]);
    updateField("en", ["solutionCards"], [...solutionCardsEn, newEn]);
    toast(`Đã thêm Thẻ Giải pháp #${nextIdx}`, "success");
  };

  const handleDeleteSolutionCard = (idx: number) => {
    if (totalSolCount <= 1) {
      toast("Phải giữ lại tối thiểu 1 thẻ giải pháp", "error");
      return;
    }
    if (!confirm(`Bạn có chắc chắn muốn xóa Thẻ Giải pháp #${idx + 1}?`)) return;

    const newJa = solutionCardsJa.filter((_, i) => i !== idx);
    const newEn = solutionCardsEn.filter((_, i) => i !== idx);

    updateField("ja", ["solutionCards"], newJa);
    updateField("en", ["solutionCards"], newEn);
    toast(`Đã xóa Thẻ Giải pháp #${idx + 1}`, "info");
  };

  const handleDuplicateSolutionCard = (idx: number) => {
    const sourceJa = solutionCardsJa[idx] || {};
    const sourceEn = solutionCardsEn[idx] || {};

    const cloneJa = { ...sourceJa };
    const cloneEn = { ...sourceEn };

    updateField("ja", ["solutionCards"], [...solutionCardsJa, cloneJa]);
    updateField("en", ["solutionCards"], [...solutionCardsEn, cloneEn]);
    toast(`Đã nhân bản Thẻ Giải pháp #${idx + 1}`, "success");
  };

  return (
    <div className="space-y-8">
      {/* 1. TIÊU ĐỀ SECTION NỖI ĐAU */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-3">
          1. Tiêu đề Nỗi đau (Khối 1)
        </h2>
        <BilingualField
          label="Tiêu đề chính của Section Nỗi đau"
          subLabel="Hỗ trợ nhập </br> hoặc <br> hoặc xuống dòng để ngắt dòng."
          path={["title"]}
          contentJa={contentJa}
          contentEn={contentEn}
          updateField={updateField}
          activeLang={lang}
          isTextArea
          rows={2}
        />
      </div>

      {/* 2. DANH SÁCH CÁC MỤC NỖI ĐAU LỚN */}
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase">
              2. Danh sách các mục Nỗi đau ({totalCount} mục)
            </h3>
            <p className="text-xs text-slate-500">
              Hiển thị dạng checklist lớn [✓] trên nền sáng #fdfcf9. Hỗ trợ nhập &lt;/br&gt; để xuống hàng.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddCard}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Thêm nỗi đau mới</span>
          </button>
        </div>

        <div className="space-y-3">
          {Array.from({ length: totalCount }).map((_, idx) => (
            <div key={idx} className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 relative group">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <h3 className="text-xs font-bold text-slate-800 uppercase">
                    Mục Nỗi đau #{idx + 1}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleDuplicateCard(idx)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 rounded-md transition-all cursor-pointer"
                    title="Nhân bản mục này"
                  >
                    <Copy size={12} />
                    <span className="hidden sm:inline">Nhân bản</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteCard(idx)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] text-red-600 hover:text-white hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-md transition-all cursor-pointer"
                    title="Xóa mục này"
                  >
                    <Trash2 size={12} />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>

              <BilingualField
                label="Nội dung nỗi đau lớn (Quote)"
                subLabel="Hiển thị full width. Hỗ trợ nhập </br> hoặc <br> để ngắt dòng."
                path={["cards", idx.toString(), "quote"]}
                contentJa={contentJa}
                contentEn={contentEn}
                updateField={updateField}
                activeLang={lang}
                isTextArea
                rows={2}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddCard}
          className="w-full py-3.5 border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/40 rounded-xl text-slate-600 hover:text-blue-600 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          <span>Thêm mục Nỗi đau mới</span>
        </button>
      </div>

      {/* 3. TIÊU ĐỀ SECTION GIẢI PHÁP */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 pt-6 border-t-2 border-slate-100">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-3">
          3. Tiêu đề Phần Giải pháp (Khối 2)
        </h2>
        <BilingualField
          label="Tiêu đề chính của Section Giải pháp"
          subLabel="Hỗ trợ nhập </br> hoặc <br> hoặc xuống dòng để ngắt dòng."
          path={["solTitle"]}
          contentJa={contentJa}
          contentEn={contentEn}
          updateField={updateField}
          activeLang={lang}
          isTextArea
          rows={2}
        />
      </div>

      {/* 4. DANH SÁCH CÁC MỤC GIẢI PHÁP */}
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase">
              4. Danh sách các mục Giải pháp ({totalSolCount} mục)
            </h3>
            <p className="text-xs text-slate-500">
              Hiển thị dạng checklist lớn [✓] trên nền sáng #fdfcf9 đồng bộ với Nỗi đau. Hỗ trợ nhập &lt;/br&gt; để xuống hàng.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddSolutionCard}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Thêm giải pháp mới</span>
          </button>
        </div>

        <div className="space-y-3">
          {Array.from({ length: totalSolCount }).map((_, idx) => (
            <div key={idx} className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 relative group">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <h3 className="text-xs font-bold text-slate-800 uppercase">
                    Mục Giải pháp #{idx + 1}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleDuplicateSolutionCard(idx)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 rounded-md transition-all cursor-pointer"
                    title="Nhân bản mục này"
                  >
                    <Copy size={12} />
                    <span className="hidden sm:inline">Nhân bản</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteSolutionCard(idx)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] text-red-600 hover:text-white hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-md transition-all cursor-pointer"
                    title="Xóa mục này"
                  >
                    <Trash2 size={12} />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>

              <BilingualField
                label="Nội dung giải pháp (Quote)"
                subLabel="Hiển thị full width. Hỗ trợ nhập </br> hoặc <br> để ngắt dòng."
                path={["solutionCards", idx.toString(), "quote"]}
                contentJa={contentJa}
                contentEn={contentEn}
                updateField={updateField}
                activeLang={lang}
                isTextArea
                rows={2}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddSolutionCard}
          className="w-full py-3.5 border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/40 rounded-xl text-slate-600 hover:text-blue-600 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          <span>Thêm mục Giải pháp mới</span>
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   03. WORKFLOW SECTION FORM
   ------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------
   03. WORKFLOW SECTION FORM
   ------------------------------------------------------------------------- */
function WorkflowForm({
  lang,
  contentJa,
  contentEn,
  updateField,
}: {
  lang: "ja" | "en" | "both";
  contentJa: any;
  contentEn: any;
  updateField: (lang: "en" | "ja", path: string[], value: any) => void;
}) {
  const { toast } = useToast();

  const stepsJa: any[] = Array.isArray(contentJa?.steps) ? contentJa.steps : [];
  const stepsEn: any[] = Array.isArray(contentEn?.steps) ? contentEn.steps : [];
  const totalSteps = Math.max(stepsJa.length, stepsEn.length);

  const handleAddStep = () => {
    const nextIdx = totalSteps + 1;
    const pad = nextIdx < 10 ? `0${nextIdx}` : `${nextIdx}`;

    const newJa = {
      stepNumber: pad,
      stepTime: "3〜5日",
      stepBadge: `STEP ${pad} · 新規工程`,
      stepTitle: "Tiêu đề bước quy trình mới",
      stepDesc: "Mô tả chi tiết nội dung công việc và kết quả bàn giao của giai đoạn này...",
      stepImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85",
      stepStageTag: `STAGE ${pad} • NEW STAGE`,
    };

    const newEn = {
      stepNumber: pad,
      stepTime: "3–5 Days",
      stepBadge: `STEP ${pad} · NEW STAGE`,
      stepTitle: "New Workflow Step Title",
      stepDesc: "Detailed description of actions, deliverables and coordination for this milestone...",
      stepImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85",
      stepStageTag: `STAGE ${pad} • NEW STAGE`,
    };

    updateField("ja", ["steps"], [...stepsJa, newJa]);
    updateField("en", ["steps"], [...stepsEn, newEn]);
    toast(`Đã thêm Bước 0${nextIdx} vào quy trình`, "success");
  };

  const handleDeleteStep = (idx: number) => {
    if (totalSteps <= 1) {
      toast("Quy trình cần tối thiểu 1 bước", "error");
      return;
    }
    if (!confirm(`Bạn có chắc chắn muốn xóa Bước 0${idx + 1}?`)) return;

    const newJa = stepsJa.filter((_, i) => i !== idx);
    const newEn = stepsEn.filter((_, i) => i !== idx);

    updateField("ja", ["steps"], newJa);
    updateField("en", ["steps"], newEn);
    toast(`Đã xóa Bước 0${idx + 1}`, "info");
  };

  const handleDuplicateStep = (idx: number) => {
    const sourceJa = stepsJa[idx] || {};
    const sourceEn = stepsEn[idx] || {};

    const nextIdx = totalSteps + 1;
    const pad = nextIdx < 10 ? `0${nextIdx}` : `${nextIdx}`;

    const cloneJa = { ...sourceJa, stepNumber: pad, stepBadge: `STEP ${pad}` };
    const cloneEn = { ...sourceEn, stepNumber: pad, stepBadge: `STEP ${pad}` };

    updateField("ja", ["steps"], [...stepsJa, cloneJa]);
    updateField("en", ["steps"], [...stepsEn, cloneEn]);
    toast(`Đã nhân bản Bước 0${idx + 1}`, "success");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-3">
          1. Tiêu đề, Màu chữ &amp; Nút bấm Section Quy trình làm việc
        </h2>
        <BilingualField
          label="Tiêu đề chính của Section"
          path={["title"]}
          contentJa={contentJa}
          contentEn={contentEn}
          updateField={updateField}
          activeLang={lang}
        />

        {/* Màu chữ Tiêu đề bước & Mô tả tóm tắt */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          {/* Màu chữ Tiêu đề bước */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                🎨 Màu chữ Tiêu đề bước (Áp dụng cho tất cả các bước)
              </label>
              {(contentJa?.stepTitleColor || contentEn?.stepTitleColor) && (
                <button
                  type="button"
                  onClick={() => {
                    updateField("ja", ["stepTitleColor"], "");
                    updateField("en", ["stepTitleColor"], "");
                  }}
                  className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer"
                >
                  Đặt về mặc định
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "Trắng sáng", hex: "#FFFFFF" },
                { label: "Kem ngà", hex: "#FAF3E3" },
                { label: "Vàng Gold", hex: "#F4C977" },
                { label: "Đen than", hex: "#15171C" },
                { label: "Nâu trầm", hex: "#3B2D23" },
              ].map((sw) => {
                const cur = contentJa?.stepTitleColor || contentEn?.stepTitleColor || "";
                const active = cur.toLowerCase() === sw.hex.toLowerCase();
                return (
                  <button
                    key={sw.hex}
                    type="button"
                    onClick={() => {
                      updateField("ja", ["stepTitleColor"], sw.hex);
                      updateField("en", ["stepTitleColor"], sw.hex);
                    }}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition cursor-pointer ${
                      active
                        ? "border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-500/30"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                      style={{ backgroundColor: sw.hex }}
                    />
                    <span>{sw.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="color"
                value={
                  /^#[0-9a-fA-F]{6}$/.test(contentJa?.stepTitleColor || "")
                    ? contentJa.stepTitleColor
                    : "#FFFFFF"
                }
                onChange={(e) => {
                  updateField("ja", ["stepTitleColor"], e.target.value);
                  updateField("en", ["stepTitleColor"], e.target.value);
                }}
                className="w-9 h-8 rounded border border-slate-300 bg-white p-0.5 cursor-pointer"
              />
              <input
                type="text"
                value={contentJa?.stepTitleColor || ""}
                onChange={(e) => {
                  updateField("ja", ["stepTitleColor"], e.target.value);
                  updateField("en", ["stepTitleColor"], e.target.value);
                }}
                placeholder="Mặc định (#FFFFFF)"
                className="flex-1 px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          {/* Màu chữ Mô tả tóm tắt */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                🎨 Màu chữ Mô tả tóm tắt (Áp dụng cho tất cả các bước)
              </label>
              {(contentJa?.stepDescColor || contentEn?.stepDescColor) && (
                <button
                  type="button"
                  onClick={() => {
                    updateField("ja", ["stepDescColor"], "");
                    updateField("en", ["stepDescColor"], "");
                  }}
                  className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer"
                >
                  Đặt về mặc định
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "Xám sáng", hex: "#E2E6EE" },
                { label: "Trắng sáng", hex: "#FFFFFF" },
                { label: "Kem ấm", hex: "#EFE4CE" },
                { label: "Vàng nhạt", hex: "#F6D899" },
                { label: "Xám đậm", hex: "#334155" },
              ].map((sw) => {
                const cur = contentJa?.stepDescColor || contentEn?.stepDescColor || "";
                const active = cur.toLowerCase() === sw.hex.toLowerCase();
                return (
                  <button
                    key={sw.hex}
                    type="button"
                    onClick={() => {
                      updateField("ja", ["stepDescColor"], sw.hex);
                      updateField("en", ["stepDescColor"], sw.hex);
                    }}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition cursor-pointer ${
                      active
                        ? "border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-500/30"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                      style={{ backgroundColor: sw.hex }}
                    />
                    <span>{sw.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="color"
                value={
                  /^#[0-9a-fA-F]{6}$/.test(contentJa?.stepDescColor || "")
                    ? contentJa.stepDescColor
                    : "#E2E6EE"
                }
                onChange={(e) => {
                  updateField("ja", ["stepDescColor"], e.target.value);
                  updateField("en", ["stepDescColor"], e.target.value);
                }}
                className="w-9 h-8 rounded border border-slate-300 bg-white p-0.5 cursor-pointer"
              />
              <input
                type="text"
                value={contentJa?.stepDescColor || ""}
                onChange={(e) => {
                  updateField("ja", ["stepDescColor"], e.target.value);
                  updateField("en", ["stepDescColor"], e.target.value);
                }}
                placeholder="Mặc định (#E2E6EE)"
                className="flex-1 px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Nút Button dưới mô tả tóm tắt */}
        <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            🔘 Nút Button nằm dưới phần Mô tả tóm tắt
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            <BilingualField
              label="Nội dung chữ trên nút Button"
              subLabel="Để trống sẽ hiển thị mặc định: 無料相談・お問い合わせ"
              path={["ctaText"]}
              contentJa={contentJa}
              contentEn={contentEn}
              updateField={updateField}
              activeLang={lang}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Đường dẫn khi khách bấm vào nút Button:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "Trang liên hệ (/ja/contact)", href: "/ja/contact" },
                  { label: "Cuộn xuống form cuối trang (#dang-ky-tu-van)", href: "#dang-ky-tu-van" },
                ].map((opt) => {
                  const curHref = contentJa?.ctaHref || "/ja/contact";
                  const active = curHref === opt.href;
                  return (
                    <button
                      key={opt.href}
                      type="button"
                      onClick={() => {
                        updateField("ja", ["ctaHref"], opt.href);
                        updateField("en", ["ctaHref"], opt.href);
                      }}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition cursor-pointer ${
                        active
                          ? "bg-amber-600 text-white border-amber-600"
                          : "bg-white text-slate-700 border-slate-300 hover:border-amber-400"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
              <input
                type="text"
                value={contentJa?.ctaHref || ""}
                onChange={(e) => {
                  updateField("ja", ["ctaHref"], e.target.value);
                  updateField("en", ["ctaHref"], e.target.value);
                }}
                placeholder="/ja/contact hoặc #dang-ky-tu-van"
                className="w-full px-3 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Header bar with total steps & Add Step button */}
      <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase">
            Danh sách các bước trong quy trình ({totalSteps} bước)
          </h3>
          <p className="text-xs text-slate-500">
            Tự do thêm mới bước, tải ảnh minh họa và sắp xếp nội dung cho từng giai đoạn.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddStep}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>Thêm bước mới</span>
        </button>
      </div>

      <div className="space-y-4">
        {Array.from({ length: totalSteps }).map((_, idx) => {
          const curJa = stepsJa[idx] || {};
          const curEn = stepsEn[idx] || {};
          const stepImg = curJa.stepImage || curEn.stepImage || "";
          const stepBgImg = curJa.stepBgImage || curEn.stepBgImage || "";
          const stageTag = curJa.stepStageTag || curEn.stepStageTag || "";

          return (
            <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 relative group">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center">
                    0{idx + 1}
                  </span>
                  <h3 className="text-xs font-bold text-slate-800 uppercase">
                    Bước 0{idx + 1} trong quy trình
                  </h3>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleDuplicateStep(idx)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 rounded-md transition-all cursor-pointer"
                    title="Nhân bản bước này"
                  >
                    <Copy size={12} />
                    <span className="hidden sm:inline">Nhân bản</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteStep(idx)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] text-red-600 hover:text-white hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-md transition-all cursor-pointer"
                    title="Xóa bước này"
                  >
                    <Trash2 size={12} />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>

              {/* Step Meta (Step Number, Timeline, Badge) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <BilingualField
                  label="Số bước (Step Number)"
                  path={["steps", idx.toString(), "stepNumber"]}
                  contentJa={contentJa}
                  contentEn={contentEn}
                  updateField={updateField}
                  activeLang={lang}
                />
                <BilingualField
                  label="Thời gian thực hiện (Timeline)"
                  path={["steps", idx.toString(), "stepTime"]}
                  contentJa={contentJa}
                  contentEn={contentEn}
                  updateField={updateField}
                  activeLang={lang}
                />
                <BilingualField
                  label="Huy hiệu giai đoạn (Badge)"
                  path={["steps", idx.toString(), "stepBadge"]}
                  contentJa={contentJa}
                  contentEn={contentEn}
                  updateField={updateField}
                  activeLang={lang}
                />
              </div>

              {/* Step Image Upload & URL */}
              <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>🖼️ Ảnh minh họa bước (Step Image)</span>
                  </label>
                  {stepImg && (
                    <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold border border-emerald-300">
                      ✓ Đã có ảnh
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                  {/* Thumbnail preview */}
                  <div className="relative w-full h-24 rounded-lg overflow-hidden border border-slate-300 bg-slate-200/60 flex items-center justify-center shrink-0">
                    {stepImg ? (
                      <img src={stepImg} alt="Step preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[11px] text-slate-400">Chưa có ảnh</span>
                    )}
                  </div>

                  {/* Image Inputs */}
                  <div className="sm:col-span-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={stepImg}
                        placeholder="https://images.unsplash.com/... hoặc /uploads/..."
                        onChange={(e) => {
                          updateField("ja", ["steps", idx.toString(), "stepImage"], e.target.value);
                          updateField("en", ["steps", idx.toString(), "stepImage"], e.target.value);
                        }}
                        className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />

                      <label className="shrink-0 cursor-pointer">
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all">
                          <Upload size={13} />
                          <span>Tải ảnh</span>
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const fd = new FormData();
                            fd.append("file", file);
                            try {
                              const res = await fetch("/api/upload", { method: "POST", body: fd });
                              const data = await res.json();
                              if (res.ok && data.url) {
                                updateField("ja", ["steps", idx.toString(), "stepImage"], data.url);
                                updateField("en", ["steps", idx.toString(), "stepImage"], data.url);
                                toast("Tải ảnh bước thành công!", "success");
                              } else {
                                toast(data.error || "Tải ảnh thất bại", "error");
                              }
                            } catch {
                              toast("Lỗi tải ảnh", "error");
                            }
                          }}
                        />
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500 shrink-0 font-medium">Nhãn đè ảnh:</span>
                      <input
                        type="text"
                        value={stageTag}
                        placeholder={`STAGE 0${idx + 1} • PHASE`}
                        onChange={(e) => {
                          updateField("ja", ["steps", idx.toString(), "stepStageTag"], e.target.value);
                          updateField("en", ["steps", idx.toString(), "stepStageTag"], e.target.value);
                        }}
                        className="w-full px-2.5 py-1 text-xs text-slate-800 bg-white border border-slate-300 rounded-md outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step Background Image Upload & URL */}
              <div className="p-3.5 bg-amber-50/40 rounded-xl border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>🌄 Ảnh nền của bước (Step Background Image)</span>
                  </label>
                  {stepBgImg ? (
                    <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold border border-emerald-300">
                      ✓ Đã có ảnh nền riêng
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded font-semibold border border-amber-200">
                      Mặc định dùng ảnh bước
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                  {/* Background Thumbnail preview */}
                  <div className="relative w-full h-24 rounded-lg overflow-hidden border border-slate-300 bg-slate-200/60 flex items-center justify-center shrink-0">
                    {stepBgImg ? (
                      <img src={stepBgImg} alt="Step background preview" className="w-full h-full object-cover" />
                    ) : stepImg ? (
                      <div className="relative w-full h-full">
                        <img src={stepImg} alt="Fallback background preview" className="w-full h-full object-cover opacity-70" />
                        <span className="absolute inset-x-1 bottom-1 text-center text-[9px] font-semibold bg-black/65 text-white rounded px-1 py-0.5">
                          Đang lấy từ ảnh bước
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400">Chưa có ảnh nền</span>
                    )}
                  </div>

                  {/* Background Image Inputs */}
                  <div className="sm:col-span-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={stepBgImg}
                        placeholder="URL ảnh nền riêng của bước (để trống sẽ tự lấy ảnh minh họa bước)..."
                        onChange={(e) => {
                          updateField("ja", ["steps", idx.toString(), "stepBgImage"], e.target.value);
                          updateField("en", ["steps", idx.toString(), "stepBgImage"], e.target.value);
                        }}
                        className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                      />

                      <label className="shrink-0 cursor-pointer">
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all">
                          <Upload size={13} />
                          <span>Tải ảnh nền</span>
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const fd = new FormData();
                            fd.append("file", file);
                            try {
                              const res = await fetch("/api/upload", { method: "POST", body: fd });
                              const data = await res.json();
                              if (res.ok && data.url) {
                                updateField("ja", ["steps", idx.toString(), "stepBgImage"], data.url);
                                updateField("en", ["steps", idx.toString(), "stepBgImage"], data.url);
                                toast("Tải ảnh nền bước thành công!", "success");
                              } else {
                                toast(data.error || "Tải ảnh nền thất bại", "error");
                              }
                            } catch {
                              toast("Lỗi tải ảnh nền", "error");
                            }
                          }}
                        />
                      </label>

                      {stepBgImg && (
                        <button
                          type="button"
                          onClick={() => {
                            updateField("ja", ["steps", idx.toString(), "stepBgImage"], "");
                            updateField("en", ["steps", idx.toString(), "stepBgImage"], "");
                          }}
                          className="shrink-0 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 border border-red-200 rounded-lg font-semibold transition-all cursor-pointer"
                          title="Xóa ảnh nền riêng để dùng lại ảnh bước"
                        >
                          Xóa
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Hiển thị làm nền toàn khung khi chuyển tới bước 0{idx + 1}. Khuyến nghị ảnh ngang chất lượng cao (16:9).
                    </p>
                  </div>
                </div>
              </div>

              {/* Step Title - Spans full width matching Description */}
              <div className="w-full">
                <BilingualField
                  label="Tiêu đề bước (Step Title)"
                  path={["steps", idx.toString(), "stepTitle"]}
                  contentJa={contentJa}
                  contentEn={contentEn}
                  updateField={updateField}
                  activeLang={lang}
                />
              </div>

              {/* Step Description - Spans full width matching Title */}
              <div className="w-full">
                <BilingualField
                  label="Mô tả tóm tắt (Step Description)"
                  path={["steps", idx.toString(), "stepDesc"]}
                  contentJa={contentJa}
                  contentEn={contentEn}
                  updateField={updateField}
                  activeLang={lang}
                  isTextArea
                  rows={2}
                />
              </div>

              {/* Tùy chọn màu chữ riêng cho bước này */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-700">
                    Màu riêng Tiêu đề Bước 0{idx + 1} (tùy chọn):
                  </span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={
                        /^#[0-9a-fA-F]{6}$/.test(curJa.titleColor || "")
                          ? curJa.titleColor
                          : /^#[0-9a-fA-F]{6}$/.test(contentJa?.stepTitleColor || "")
                          ? contentJa.stepTitleColor
                          : "#FFFFFF"
                      }
                      onChange={(e) => {
                        updateField("ja", ["steps", idx.toString(), "titleColor"], e.target.value);
                        updateField("en", ["steps", idx.toString(), "titleColor"], e.target.value);
                      }}
                      className="w-7 h-7 rounded border border-slate-300 bg-white p-0.5 cursor-pointer"
                    />
                    {curJa.titleColor ? (
                      <button
                        type="button"
                        onClick={() => {
                          updateField("ja", ["steps", idx.toString(), "titleColor"], "");
                          updateField("en", ["steps", idx.toString(), "titleColor"], "");
                        }}
                        className="text-[10px] font-semibold text-rose-600 hover:underline cursor-pointer"
                      >
                        Dùng màu chung
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400">Đang dùng màu chung</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-700">
                    Màu riêng Mô tả Bước 0{idx + 1} (tùy chọn):
                  </span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={
                        /^#[0-9a-fA-F]{6}$/.test(curJa.descColor || "")
                          ? curJa.descColor
                          : /^#[0-9a-fA-F]{6}$/.test(contentJa?.stepDescColor || "")
                          ? contentJa.stepDescColor
                          : "#E2E6EE"
                      }
                      onChange={(e) => {
                        updateField("ja", ["steps", idx.toString(), "descColor"], e.target.value);
                        updateField("en", ["steps", idx.toString(), "descColor"], e.target.value);
                      }}
                      className="w-7 h-7 rounded border border-slate-300 bg-white p-0.5 cursor-pointer"
                    />
                    {curJa.descColor ? (
                      <button
                        type="button"
                        onClick={() => {
                          updateField("ja", ["steps", idx.toString(), "descColor"], "");
                          updateField("en", ["steps", idx.toString(), "descColor"], "");
                        }}
                        className="text-[10px] font-semibold text-rose-600 hover:underline cursor-pointer"
                      >
                        Dùng màu chung
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400">Đang dùng màu chung</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Add Step Button */}
      <button
        type="button"
        onClick={handleAddStep}
        className="w-full py-4 border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/40 rounded-xl text-slate-600 hover:text-blue-600 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <Plus size={16} />
        <span>Thêm bước quy trình mới</span>
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------
   05. SERVICES BENTO SECTION FORM (TRỤ CỘT BENTO)
   ------------------------------------------------------------------------- */
function ServicesBentoForm({
  lang,
  contentJa,
  contentEn,
  updateField,
}: {
  lang: "ja" | "en" | "both";
  contentJa: any;
  contentEn: any;
  updateField: (lang: "en" | "ja", path: string[], value: any) => void;
}) {
  const { toast } = useToast();

  const defaultBentoImages = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=85",
  ];

  const extractCards = (obj: any, isJa: boolean) => {
    if (Array.isArray(obj?.cards) && obj.cards.length > 0) {
      return obj.cards;
    }
    return [
      obj?.card1 || {
        tag: isJa ? "総合意匠設計" : "COMPREHENSIVE DESIGN",
        title: isJa ? "高精度な建築意匠・平面プランニング" : "Precision Architectural & Functional Floor Planning",
        desc: isJa
          ? "敷地条件・法規制・通風採光を徹底分析し、美しさと実用性を極限まで両立させた建築プランを作成します。"
          : "In-depth analysis of site topography, regulations, and natural ventilation to create spaces of enduring beauty and function.",
        image: defaultBentoImages[0],
        features: isJa
          ? ["✦ 敷地特性と周辺環境の徹底調査", "📐 生活動線を最適化した2D/3Dゾーニング", "⚡ 構造安全性と施工性を担保した実施図面"]
          : ["✦ Comprehensive site analysis", "📐 Optimal 2D/3D zoning flow", "⚡ Detailed structural blueprints"],
      },
      obj?.card2 || {
        tag: isJa ? "フォトリアル3DCG" : "PHOTOREALISTIC 3D",
        title: isJa ? "8K 超高精細 外観 3DCG パース制作" : "Photorealistic 8K Exterior 3D Rendering",
        desc: isJa
          ? "光学シミュレーションに基づき、時間帯による太陽光の移ろい、外壁の質感や植栽の呼吸まで精密に描写します。"
          : "Physically-based light calculations simulate sunlight across seasons, bringing exterior textures and landscaping to vivid life.",
        image: defaultBentoImages[1],
        features: isJa
          ? ["⚡ 実物マテリアルの物理ベースレンダリング", "🎬 朝・昼・夕・夜のライティング検証"]
          : ["⚡ Physically-based rendering", "🎬 Multi-time-of-day lighting"],
      },
      obj?.card3 || {
        tag: isJa ? "インテリア＆照明" : "INTERIOR & LIGHTING",
        title: isJa ? "洗練されたインテリア空間＆照明計画" : "Refined Interior Architecture & Ambient Lighting",
        desc: isJa
          ? "家具のレイアウトから間接照明のルクス計算まで、居心地の良さを計算し尽くした空間ストーリーを創出します。"
          : "From custom millwork to lux calculations, we craft immersive visual stories that embody modern comfort and understated luxury.",
        image: defaultBentoImages[2],
        features: isJa
          ? ["✦ 特注家具・マテリアル・テクスチャの再現", "🎬 建築化照明・間接光のムードシミュレーション"]
          : ["✦ Custom joinery & textures", "🎬 Mood lighting simulation"],
      },
      obj?.card4 || {
        tag: isJa ? "施工図・積算" : "CONSTRUCTION & BOQ",
        title: isJa ? "実施施工図面一式＆積算・内訳明細書" : "Construction Blueprint Sets & Itemized Cost Estimation",
        desc: isJa
          ? "構造・電気・給排水（MEP）から部材数量の正確な拾い出しまで、施工現場がそのまま動ける図面を提供します。"
          : "Complete structural, MEP, and quantity takeoffs ready for on-site execution without contractor ambiguity.",
        image: defaultBentoImages[3],
        features: isJa
          ? ["✓ 建築・構造・設備（MEP）総合図書の完備", "📊 建材数量の正確な拾い出しと積算内訳", "📐 着工後の設計変更と予算超過を徹底防止"]
          : ["✓ Full architectural & MEP drawings", "📊 Precise bill of quantities", "📐 Zero rework on-site guarantee"],
      },
    ];
  };

  const cardsJa = extractCards(contentJa, true);
  const cardsEn = extractCards(contentEn, false);
  const totalCards = Math.max(cardsJa.length, cardsEn.length);

  const saveCards = (newJa: any[], newEn: any[]) => {
    updateField("ja", ["cards"], newJa);
    updateField("en", ["cards"], newEn);
    // Backward compatibility for card1..card4
    if (newJa[0]) updateField("ja", ["card1"], newJa[0]);
    if (newEn[0]) updateField("en", ["card1"], newEn[0]);
    if (newJa[1]) updateField("ja", ["card2"], newJa[1]);
    if (newEn[1]) updateField("en", ["card2"], newEn[1]);
    if (newJa[2]) updateField("ja", ["card3"], newJa[2]);
    if (newEn[2]) updateField("en", ["card3"], newEn[2]);
    if (newJa[3]) updateField("ja", ["card4"], newJa[3]);
    if (newEn[3]) updateField("en", ["card4"], newEn[3]);
  };

  const handleAddPillar = () => {
    const nextIdx = totalCards + 1;
    const pad = nextIdx < 10 ? `0${nextIdx}` : `${nextIdx}`;
    const newCardJa = {
      tag: "新規柱カテゴリ",
      title: `Trụ cột dịch vụ mới #${pad}`,
      desc: "Mô tả chi tiết năng lực chuyên môn, quy chuẩn kỹ thuật và giải pháp vượt trội của dịch vụ này...",
      image: defaultBentoImages[(nextIdx - 1) % defaultBentoImages.length],
      features: [
        "✦ Đặc điểm nổi bật 01",
        "📐 Tiêu chuẩn kỹ thuật 02",
        "⚡ Cam kết chất lượng 03",
      ],
    };
    const newCardEn = {
      tag: "NEW PILLAR CATEGORY",
      title: `New Service Pillar #${pad}`,
      desc: "Detailed technical competencies, professional specifications, and high-value solutions provided...",
      image: defaultBentoImages[(nextIdx - 1) % defaultBentoImages.length],
      features: [
        "✦ Key capability highlight 01",
        "📐 Engineering standard 02",
        "⚡ Quality commitment 03",
      ],
    };

    saveCards([...cardsJa, newCardJa], [...cardsEn, newCardEn]);
    toast(`Đã thêm Trụ cột #${pad} mới`, "success");
  };

  const handleDeletePillar = (idx: number) => {
    if (totalCards <= 1) {
      toast("Cần duy trì tối thiểu 1 trụ cột", "error");
      return;
    }
    if (!confirm(`Bạn có chắc chắn muốn xóa Trụ cột #${idx + 1}?`)) return;

    const newJa = cardsJa.filter((_: any, i: number) => i !== idx);
    const newEn = cardsEn.filter((_: any, i: number) => i !== idx);
    saveCards(newJa, newEn);
    toast(`Đã xóa Trụ cột #${idx + 1}`, "info");
  };

  const handleDuplicatePillar = (idx: number) => {
    const sourceJa = cardsJa[idx] || {};
    const sourceEn = cardsEn[idx] || {};
    const cloneJa = { ...sourceJa, title: `${sourceJa.title || "Trụ cột"} (Bản sao)` };
    const cloneEn = { ...sourceEn, title: `${sourceEn.title || "Pillar"} (Copy)` };
    saveCards([...cardsJa, cloneJa], [...cardsEn, cloneEn]);
    toast(`Đã nhân bản Trụ cột #${idx + 1}`, "success");
  };

  const handleAddFeature = (cardIdx: number) => {
    const updatedJa = [...cardsJa];
    const updatedEn = [...cardsEn];
    const cJa = { ...updatedJa[cardIdx] };
    const cEn = { ...updatedEn[cardIdx] };

    const fJa = Array.isArray(cJa.features) ? [...cJa.features] : [];
    const fEn = Array.isArray(cEn.features) ? [...cEn.features] : [];

    fJa.push("✦ Đặc điểm kỹ thuật mới");
    fEn.push("✦ New technical feature");

    cJa.features = fJa;
    cEn.features = fEn;

    updatedJa[cardIdx] = cJa;
    updatedEn[cardIdx] = cEn;
    saveCards(updatedJa, updatedEn);
  };

  const handleRemoveFeature = (cardIdx: number, fIdx: number) => {
    const updatedJa = [...cardsJa];
    const updatedEn = [...cardsEn];
    const cJa = { ...updatedJa[cardIdx] };
    const cEn = { ...updatedEn[cardIdx] };

    const fJa = Array.isArray(cJa.features) ? [...cJa.features] : [];
    const fEn = Array.isArray(cEn.features) ? [...cEn.features] : [];

    fJa.splice(fIdx, 1);
    fEn.splice(fIdx, 1);

    cJa.features = fJa;
    cEn.features = fEn;

    updatedJa[cardIdx] = cJa;
    updatedEn[cardIdx] = cEn;
    saveCards(updatedJa, updatedEn);
  };

  const handleUpdateFeature = (
    cardIdx: number,
    fIdx: number,
    langKey: "ja" | "en",
    val: string
  ) => {
    if (langKey === "ja") {
      const updatedJa = [...cardsJa];
      const cJa = { ...updatedJa[cardIdx] };
      const fJa = Array.isArray(cJa.features) ? [...cJa.features] : [];
      fJa[fIdx] = val;
      cJa.features = fJa;
      updatedJa[cardIdx] = cJa;
      updateField("ja", ["cards"], updatedJa);
      if (cardIdx < 4) updateField("ja", [`card${cardIdx + 1}`, "features"], fJa);
    } else {
      const updatedEn = [...cardsEn];
      const cEn = { ...updatedEn[cardIdx] };
      const fEn = Array.isArray(cEn.features) ? [...cEn.features] : [];
      fEn[fIdx] = val;
      cEn.features = fEn;
      updatedEn[cardIdx] = cEn;
      updateField("en", ["cards"], updatedEn);
      if (cardIdx < 4) updateField("en", [`card${cardIdx + 1}`, "features"], fEn);
    }
  };

  const handleImageChange = (cardIdx: number, url: string) => {
    const updatedJa = [...cardsJa];
    const updatedEn = [...cardsEn];
    const cJa = { ...updatedJa[cardIdx], image: url };
    const cEn = { ...updatedEn[cardIdx], image: url };
    updatedJa[cardIdx] = cJa;
    updatedEn[cardIdx] = cEn;
    saveCards(updatedJa, updatedEn);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-3">
          Tiêu đề Section Trụ cột Dịch vụ Bento
        </h2>
        <BilingualField
          label="Tiêu đề chính của Section"
          path={["title"]}
          contentJa={contentJa}
          contentEn={contentEn}
          updateField={updateField}
          activeLang={lang}
        />
      </div>

      {/* Header bar with total pillars & Add button */}
      <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase">
            Danh sách các trụ cột Bento ({totalCards} trụ cột)
          </h3>
          <p className="text-xs text-slate-500">
            Tải ảnh nền, biên soạn các đặc điểm con (Ảnh 3) và tùy biến số lượng trụ cột bento.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddPillar}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>Thêm trụ cột mới</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {Array.from({ length: totalCards }).map((_, idx) => {
          const curJa = cardsJa[idx] || {};
          const curEn = cardsEn[idx] || {};
          const cardImg = curJa.image || curEn.image || defaultBentoImages[idx % defaultBentoImages.length];
          const featuresJa: string[] = Array.isArray(curJa.features) ? curJa.features : [];
          const featuresEn: string[] = Array.isArray(curEn.features) ? curEn.features : [];
          const maxFeatures = Math.max(featuresJa.length, featuresEn.length);

          return (
            <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 relative group flex flex-col justify-between">
              <div className="space-y-4">
                {/* Header of Pillar */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center justify-center">
                      0{idx + 1}
                    </span>
                    <h3 className="text-xs font-bold text-slate-800 uppercase">
                      Trụ cột 0{idx + 1}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleDuplicatePillar(idx)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 rounded-md transition-all cursor-pointer"
                      title="Nhân bản trụ cột này"
                    >
                      <Copy size={12} />
                      <span className="hidden sm:inline">Nhân bản</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeletePillar(idx)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] text-red-600 hover:text-white hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-md transition-all cursor-pointer"
                      title="Xóa trụ cột này"
                    >
                      <Trash2 size={12} />
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>

                {/* Tag Pill */}
                <div className="w-full">
                  <BilingualField
                    label="Thẻ Tag phân loại (Badge)"
                    subLabel="Ví dụ: 総合意匠設計 / COMPREHENSIVE DESIGN"
                    path={["cards", idx.toString(), "tag"]}
                    contentJa={contentJa}
                    contentEn={contentEn}
                    updateField={(l, p, val) => {
                      const updatedJa = [...cardsJa];
                      const updatedEn = [...cardsEn];
                      if (l === "ja") updatedJa[idx] = { ...updatedJa[idx], tag: val };
                      if (l === "en") updatedEn[idx] = { ...updatedEn[idx], tag: val };
                      saveCards(updatedJa, updatedEn);
                    }}
                    activeLang={lang}
                  />
                </div>

                {/* Pillar Title */}
                <div className="w-full">
                  <BilingualField
                    label="Tiêu đề trụ cột (Title)"
                    path={["cards", idx.toString(), "title"]}
                    contentJa={contentJa}
                    contentEn={contentEn}
                    updateField={(l, p, val) => {
                      const updatedJa = [...cardsJa];
                      const updatedEn = [...cardsEn];
                      if (l === "ja") updatedJa[idx] = { ...updatedJa[idx], title: val };
                      if (l === "en") updatedEn[idx] = { ...updatedEn[idx], title: val };
                      saveCards(updatedJa, updatedEn);
                    }}
                    activeLang={lang}
                  />
                </div>

                {/* Pillar Description */}
                <div className="w-full">
                  <BilingualField
                    label="Mô tả chi tiết năng lực (Description)"
                    path={["cards", idx.toString(), "desc"]}
                    contentJa={contentJa}
                    contentEn={contentEn}
                    updateField={(l, p, val) => {
                      const updatedJa = [...cardsJa];
                      const updatedEn = [...cardsEn];
                      if (l === "ja") updatedJa[idx] = { ...updatedJa[idx], desc: val };
                      if (l === "en") updatedEn[idx] = { ...updatedEn[idx], desc: val };
                      saveCards(updatedJa, updatedEn);
                    }}
                    activeLang={lang}
                    isTextArea
                    rows={2}
                  />
                </div>

                {/* Image Upload Block */}
                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span>🖼️ Ảnh nền trụ cột (Background Image)</span>
                    </label>
                    {cardImg && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold border border-emerald-300">
                        ✓ Đã có ảnh
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                    <div className="relative w-full h-20 rounded-lg overflow-hidden border border-slate-300 bg-slate-200/60 flex items-center justify-center shrink-0">
                      {cardImg ? (
                        <img src={cardImg} alt="Pillar preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[11px] text-slate-400">Chưa có ảnh</span>
                      )}
                    </div>

                    <div className="sm:col-span-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={cardImg}
                          placeholder="https://images.unsplash.com/... hoặc /uploads/..."
                          onChange={(e) => handleImageChange(idx, e.target.value)}
                          className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                        />

                        <label className="shrink-0 cursor-pointer">
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all">
                            <Upload size={13} />
                            <span>Tải ảnh</span>
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const fd = new FormData();
                              fd.append("file", file);
                              try {
                                const res = await fetch("/api/upload", { method: "POST", body: fd });
                                const data = await res.json();
                                if (res.ok && data.url) {
                                  handleImageChange(idx, data.url);
                                  toast("Tải ảnh trụ cột thành công!", "success");
                                } else {
                                  toast(data.error || "Tải ảnh thất bại", "error");
                                }
                              } catch {
                                toast("Lỗi tải ảnh", "error");
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features (Ảnh 3) list editor */}
                <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/70 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <span>🏷️ Danh sách đặc điểm nổi bật (Ảnh 3) ({maxFeatures})</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleAddFeature(idx)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-semibold rounded-md shadow-xs cursor-pointer transition-all"
                    >
                      <Plus size={12} />
                      <span>Thêm đặc điểm</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {Array.from({ length: maxFeatures }).map((_, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-amber-200/60 shadow-xs">
                        <span className="text-[10px] font-bold text-amber-700 w-5 shrink-0 text-center">
                          {fIdx + 1}
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-grow">
                          {(lang === "ja" || lang === "both") && (
                            <input
                              type="text"
                              value={featuresJa[fIdx] || ""}
                              placeholder="Tiếng Nhật (JA), ví dụ: ✦ 敷地特性と周辺環境の徹底調査"
                              onChange={(e) => handleUpdateFeature(idx, fIdx, "ja", e.target.value)}
                              className="w-full px-2.5 py-1 text-xs text-slate-800 bg-white border border-slate-200 rounded-md outline-none focus:border-amber-500"
                            />
                          )}

                          {(lang === "en" || lang === "both") && (
                            <input
                              type="text"
                              value={featuresEn[fIdx] || ""}
                              placeholder="Tiếng Anh (EN), ví dụ: ✦ Comprehensive site analysis"
                              onChange={(e) => handleUpdateFeature(idx, fIdx, "en", e.target.value)}
                              className="w-full px-2.5 py-1 text-xs text-slate-800 bg-white border border-slate-200 rounded-md outline-none focus:border-amber-500"
                            />
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(idx, fIdx)}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-all shrink-0 cursor-pointer"
                          title="Xóa đặc điểm này"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Add Pillar Button */}
      <button
        type="button"
        onClick={handleAddPillar}
        className="w-full py-4 border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/40 rounded-xl text-slate-600 hover:text-indigo-600 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <Plus size={16} />
        <span>Thêm trụ cột bento mới</span>
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------
   04. DELIVERABLES SECTION FORM (HỒ SƠ BÀN GIAO - ẢNH 1)
   ------------------------------------------------------------------------- */
function DeliverablesForm({
  lang,
  contentJa,
  contentEn,
  updateField,
}: {
  lang: "ja" | "en" | "both";
  contentJa: any;
  contentEn: any;
  updateField: (lang: "en" | "ja", path: string[], value: any) => void;
}) {
  const { toast } = useToast();

  const collectionsJa = Array.isArray(contentJa?.collections)
    ? contentJa.collections
    : getDeliverableCollections("ja");
  const collectionsEn = Array.isArray(contentEn?.collections)
    ? contentEn.collections
    : getDeliverableCollections("en");

  // Ensure contentJa.collections and contentEn.collections are saved in state from the beginning
  useEffect(() => {
    if (!contentJa?.collections) {
      updateField("ja", ["collections"], collectionsJa);
    }
    if (!contentEn?.collections) {
      updateField("en", ["collections"], collectionsEn);
    }
  }, []);

  const saveCollections = (newJa: any[], newEn: any[]) => {
    updateField("ja", ["collections"], newJa);
    updateField("en", ["collections"], newEn);
  };

  const handleAddCollection = () => {
    const newIdx = collectionsJa.length + 1;
    const newColJa = {
      id: `col_${Date.now()}`,
      name: `コレクション 0${newIdx}: 新規コレクション`,
      badge: "NEW",
      photos: [
        {
          url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=85",
          tag: "新規図面",
          title: `01. 新規図面タイトル 0${newIdx}`,
        },
      ],
    };
    const newColEn = {
      id: `col_${Date.now()}`,
      name: `COLLECTION 0${newIdx}: NEW COLLECTION`,
      badge: "NEW",
      photos: [
        {
          url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=85",
          tag: "NEW DRAWING",
          title: `01. New Drawing Title 0${newIdx}`,
        },
      ],
    };
    saveCollections([...collectionsJa, newColJa], [...collectionsEn, newColEn]);
    toast(`Đã thêm Bộ sưu tập 0${newIdx}`, "success");
  };

  const handleDeleteCollection = (cIdx: number) => {
    if (collectionsJa.length <= 1) {
      toast("Phải có ít nhất 1 bộ sưu tập!", "error");
      return;
    }
    if (!window.confirm(`Bạn có chắc chắn muốn xóa Bộ sưu tập 0${cIdx + 1}?`)) return;
    const nextJa = collectionsJa.filter((_: any, i: number) => i !== cIdx);
    const nextEn = collectionsEn.filter((_: any, i: number) => i !== cIdx);
    saveCollections(nextJa, nextEn);
    toast(`Đã xóa Bộ sưu tập 0${cIdx + 1}`, "success");
  };

  const handleAddPhoto = (cIdx: number) => {
    const updatedJa = [...collectionsJa];
    const updatedEn = [...collectionsEn];
    const cJa = { ...updatedJa[cIdx] };
    const cEn = { ...updatedEn[cIdx] };
    const photosJa = Array.isArray(cJa.photos) ? [...cJa.photos] : [];
    const photosEn = Array.isArray(cEn.photos) ? [...cEn.photos] : [];
    const pNum = photosJa.length + 1;

    photosJa.push({
      url: "",
      tag: `MỤC 0${pNum}`,
      title: `0${pNum}. Tiêu đề hình ảnh / bản vẽ mới`,
    });
    photosEn.push({
      url: "",
      tag: `ITEM 0${pNum}`,
      title: `0${pNum}. New drawing / image title`,
    });

    cJa.photos = photosJa;
    cEn.photos = photosEn;
    updatedJa[cIdx] = cJa;
    updatedEn[cIdx] = cEn;
    saveCollections(updatedJa, updatedEn);
    toast(`Đã thêm mục 0${pNum} vào Bộ sưu tập 0${cIdx + 1}`, "success");
  };

  const handleDeletePhoto = (cIdx: number, pIdx: number) => {
    const updatedJa = [...collectionsJa];
    const updatedEn = [...collectionsEn];
    const cJa = { ...updatedJa[cIdx] };
    const cEn = { ...updatedEn[cIdx] };
    const photosJa = Array.isArray(cJa.photos) ? [...cJa.photos] : [];
    const photosEn = Array.isArray(cEn.photos) ? [...cEn.photos] : [];

    if (photosJa.length <= 1) {
      toast("Mỗi bộ sưu tập phải có tối thiểu 1 mục hình ảnh!", "error");
      return;
    }

    cJa.photos = photosJa.filter((_: any, i: number) => i !== pIdx);
    cEn.photos = photosEn.filter((_: any, i: number) => i !== pIdx);
    updatedJa[cIdx] = cJa;
    updatedEn[cIdx] = cEn;
    saveCollections(updatedJa, updatedEn);
    toast(`Đã xóa mục #${pIdx + 1}`, "success");
  };

  const handleUpdatePhotoUrl = (cIdx: number, pIdx: number, url: string) => {
    const updatedJa = [...collectionsJa];
    const updatedEn = [...collectionsEn];

    const cJa = { ...updatedJa[cIdx] };
    const cEn = { ...updatedEn[cIdx] };

    const photosJa = Array.isArray(cJa.photos) ? [...cJa.photos] : [];
    const photosEn = Array.isArray(cEn.photos) ? [...cEn.photos] : [];

    if (photosJa[pIdx]) photosJa[pIdx] = { ...photosJa[pIdx], url };
    if (photosEn[pIdx]) photosEn[pIdx] = { ...photosEn[pIdx], url };

    cJa.photos = photosJa;
    cEn.photos = photosEn;

    updatedJa[cIdx] = cJa;
    updatedEn[cIdx] = cEn;
    saveCollections(updatedJa, updatedEn);
  };

  const handleUpdatePhotoMeta = (
    cIdx: number,
    pIdx: number,
    field: "title" | "tag",
    langKey: "ja" | "en",
    val: string
  ) => {
    if (langKey === "ja") {
      const updatedJa = [...collectionsJa];
      const cJa = { ...updatedJa[cIdx] };
      const photosJa = Array.isArray(cJa.photos) ? [...cJa.photos] : [];
      if (photosJa[pIdx]) photosJa[pIdx] = { ...photosJa[pIdx], [field]: val };
      cJa.photos = photosJa;
      updatedJa[cIdx] = cJa;
      updateField("ja", ["collections"], updatedJa);
    } else {
      const updatedEn = [...collectionsEn];
      const cEn = { ...updatedEn[cIdx] };
      const photosEn = Array.isArray(cEn.photos) ? [...cEn.photos] : [];
      if (photosEn[pIdx]) photosEn[pIdx] = { ...photosEn[pIdx], [field]: val };
      cEn.photos = photosEn;
      updatedEn[cIdx] = cEn;
      updateField("en", ["collections"], updatedEn);
    }
  };

  const handleUpdateCollectionName = (
    cIdx: number,
    langKey: "ja" | "en",
    val: string
  ) => {
    if (langKey === "ja") {
      const updatedJa = [...collectionsJa];
      updatedJa[cIdx] = { ...(updatedJa[cIdx] || {}), name: val };
      updateField("ja", ["collections"], updatedJa);
    } else {
      const updatedEn = [...collectionsEn];
      updatedEn[cIdx] = { ...(updatedEn[cIdx] || {}), name: val };
      updateField("en", ["collections"], updatedEn);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tiêu đề Section & Chữ trên nút bấm điều hướng */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-3">
          1. Tiêu đề Section &amp; Chữ Nút Quay Lại Danh Sách
        </h2>

        <BilingualField
          label="Tiêu đề chính Section (Main Title)"
          subLabel="Ví dụ: お客様へのお届け成果物コレクション / CLIENT DELIVERABLES & PROJECT PORTFOLIO"
          path={["info", "title"]}
          contentJa={contentJa}
          contentEn={contentEn}
          updateField={updateField}
          activeLang={lang}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <BilingualField
            label="Chữ trên nút Quay lại danh sách ở giữa phía trên (← 一覧へ戻る)"
            subLabel="Hiển thị khi khách bấm vào 1 bộ sưu tập. Để trống mặc định: 一覧へ戻る"
            path={["info", "backBtnText"]}
            contentJa={contentJa}
            contentEn={contentEn}
            updateField={updateField}
            activeLang={lang}
          />

          <BilingualField
            label="Chữ trên nút Đóng chế độ phóng to ảnh (× 拡大表示を閉じる)"
            subLabel="Hiển thị khi khách bấm phóng lớn 1 ảnh. Để trống mặc định: 拡大表示を閉じる"
            path={["info", "closeZoomBtnText"]}
            contentJa={contentJa}
            contentEn={contentEn}
            updateField={updateField}
            activeLang={lang}
          />
        </div>
      </div>

      {/* 2. Quản lý Bộ sưu tập tài liệu chi tiết */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              2. Quản lý các Bộ sưu tập Bản vẽ &amp; Hình ảnh bàn giao
            </h2>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Chỉnh sửa Tên bộ sưu tập (chữ dọc chính giữa &amp; thanh chọn bên dưới) cùng danh sách hình ảnh bên trong
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddCollection}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition cursor-pointer"
          >
            <Plus size={14} />
            <span>Thêm bộ sưu tập</span>
          </button>
        </div>

        <div className="space-y-6">
          {collectionsJa.map((cJa: any, cIdx: number) => {
            const cEn = collectionsEn[cIdx] || {};
            const photosJa = Array.isArray(cJa.photos) ? cJa.photos : [];
            const photosEn = Array.isArray(cEn.photos) ? cEn.photos : [];

            return (
              <div key={cIdx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      0{cIdx + 1}
                    </span>
                    <h3 className="text-xs font-bold text-slate-800 uppercase">
                      Bộ sưu tập 0{cIdx + 1}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteCollection(cIdx)}
                    disabled={collectionsJa.length <= 1}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:hover:bg-transparent text-xs font-medium rounded-lg transition cursor-pointer"
                    title="Xóa bộ sưu tập này"
                  >
                    <Trash2 size={13} />
                    <span>Xóa bộ sưu tập</span>
                  </button>
                </div>

                {/* Tên bộ sưu tập (Hiển thị chữ dọc lớn ở giữa và thanh tab dưới cùng) */}
                <div className="bg-white p-3.5 rounded-xl border border-blue-200/80 shadow-xs space-y-2.5">
                  <label className="block text-xs font-bold text-slate-800">
                    🏷️ Tên Bộ Sưu Tập 0{cIdx + 1} (Hiển thị chữ dọc chính giữa &amp; thanh danh mục bên dưới):
                  </label>

                  <div className={`grid grid-cols-1 ${lang === "both" ? "md:grid-cols-2" : ""} gap-3`}>
                    {(lang === "ja" || lang === "both") && (
                      <div>
                        {lang === "both" && (
                          <span className="block text-[10px] font-bold text-blue-700 mb-1">
                            🇯🇵 Tiếng Nhật (JA):
                          </span>
                        )}
                        <input
                          type="text"
                          value={cJa.name || ""}
                          onChange={(e) => handleUpdateCollectionName(cIdx, "ja", e.target.value)}
                          placeholder="Ví dụ: 実施設計図面一式 / 8Kフォトリアル3Dパース..."
                          className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    )}

                    {(lang === "en" || lang === "both") && (
                      <div>
                        {lang === "both" && (
                          <span className="block text-[10px] font-bold text-emerald-700 mb-1">
                            🇺🇸 Tiếng Anh (EN):
                          </span>
                        )}
                        <input
                          type="text"
                          value={cEn.name || ""}
                          onChange={(e) => handleUpdateCollectionName(cIdx, "en", e.target.value)}
                          placeholder="Example: Full Construction Drawings / 8K 3D Renders..."
                          className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Photos in this collection */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between border-t border-slate-200 pt-3 flex-wrap gap-2">
                    <h4 className="text-[11px] font-bold text-slate-600 uppercase">
                      Danh sách hình ảnh / bản vẽ trong bộ sưu tập ({photosJa.length} mục)
                    </h4>
                    <button
                      type="button"
                      onClick={() => handleAddPhoto(cIdx)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold rounded-md shadow-xs transition"
                    >
                      <Plus size={12} />
                      <span>Thêm mục (ảnh / bản vẽ)</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {photosJa.map((pJa: any, pIdx: number) => {
                      const pEn = photosEn[pIdx] || {};
                      const pUrl = pJa.url || pEn.url || "";

                      return (
                        <div key={pIdx} className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs space-y-2">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                            <span className="text-[10px] font-bold text-slate-500">
                              Mục #{pIdx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeletePhoto(cIdx, pIdx)}
                              disabled={photosJa.length <= 1}
                              className="inline-flex items-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-50 disabled:opacity-30 disabled:hover:bg-transparent px-1.5 py-0.5 rounded text-[10px] transition"
                              title="Xóa mục này"
                            >
                              <Trash2 size={11} />
                              <span>Xóa mục</span>
                            </button>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="relative w-16 h-14 rounded overflow-hidden border border-slate-200 shrink-0 bg-slate-100 flex items-center justify-center">
                              {pUrl ? (
                                <img src={pUrl} alt="Document" className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-[9px] text-slate-400">Trống</span>
                              )}
                            </div>

                            <div className="flex-grow space-y-1.5">
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  value={pUrl}
                                  placeholder="Link ảnh bản vẽ..."
                                  onChange={(e) => handleUpdatePhotoUrl(cIdx, pIdx, e.target.value)}
                                  className="w-full px-2 py-1 text-[11px] text-slate-800 bg-slate-50 border border-slate-200 rounded font-mono"
                                />

                                <label className="shrink-0 cursor-pointer">
                                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-700 hover:bg-slate-800 text-white text-[11px] font-medium rounded">
                                    <Upload size={11} />
                                    <span>Tải</span>
                                  </span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (!file) return;
                                      const fd = new FormData();
                                      fd.append("file", file);
                                      try {
                                        const res = await fetch("/api/upload", { method: "POST", body: fd });
                                        const data = await res.json();
                                        if (res.ok && data.url) {
                                          handleUpdatePhotoUrl(cIdx, pIdx, data.url);
                                          toast("Tải ảnh bản vẽ thành công!", "success");
                                        } else {
                                          toast(data.error || "Tải ảnh thất bại", "error");
                                        }
                                      } catch {
                                        toast("Lỗi tải ảnh", "error");
                                      }
                                    }}
                                  />
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   06. CLIENTS & TRUST SECTION FORM
   ------------------------------------------------------------------------- */
function ClientsForm({
  lang,
  contentJa,
  contentEn,
  updateField,
}: {
  lang: "ja" | "en" | "both";
  contentJa: any;
  contentEn: any;
  updateField: (lang: "en" | "ja", path: string[], value: any) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-3">
          Tiêu đề Section Đối tác & Uy tín
        </h2>
        <BilingualField
          label="Dòng chữ nhỏ mở đầu (Eyebrow trên cùng: PROVEN TRUST ACROSS...)"
          path={["eyebrow"]}
          contentJa={contentJa}
          contentEn={contentEn}
          updateField={updateField}
          activeLang={lang}
        />
        <BilingualField
          label="Tiêu đề chính của Section (250+ PARTNERS...)"
          path={["title"]}
          contentJa={contentJa}
          contentEn={contentEn}
          updateField={updateField}
          activeLang={lang}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[0, 1, 2, 3].map((idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <ShieldCheck size={16} className="text-emerald-500" />
              <h3 className="text-xs font-bold text-slate-800 uppercase">Huy hiệu cam kết #{idx + 1}</h3>
            </div>

            <BilingualField
              label="Huy hiệu (Badge)"
              path={["trustCards", idx.toString(), "badge"]}
              contentJa={contentJa}
              contentEn={contentEn}
              updateField={updateField}
              activeLang={lang}
            />

            <BilingualField
              label="Tiêu đề cam kết (Title)"
              path={["trustCards", idx.toString(), "title"]}
              contentJa={contentJa}
              contentEn={contentEn}
              updateField={updateField}
              activeLang={lang}
            />

            <BilingualField
              label="Mô tả cam kết (Description)"
              path={["trustCards", idx.toString(), "desc"]}
              contentJa={contentJa}
              contentEn={contentEn}
              updateField={updateField}
              activeLang={lang}
              isTextArea
              rows={2}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   07. APPLICATIONS SECTION FORM (Ứng dụng thực tế)
   ------------------------------------------------------------------------- */
function ApplicationsForm({
  lang,
  contentJa,
  contentEn,
  updateField,
}: {
  lang: "ja" | "en" | "both";
  contentJa: any;
  contentEn: any;
  updateField: (lang: "en" | "ja", path: string[], value: any) => void;
}) {
  const { toast } = useToast();

  // 1. Quản lý Danh mục Bộ lọc chuyên ngành (Category Filter Tabs)
  const rawCategoriesJa: any[] = Array.isArray(contentJa?.categories) && contentJa.categories.length > 0
    ? contentJa.categories
    : getDefaultApplicationCategories("ja");
  const rawCategoriesEn: any[] = Array.isArray(contentEn?.categories) && contentEn.categories.length > 0
    ? contentEn.categories
    : getDefaultApplicationCategories("en");

  const catCount = Math.max(rawCategoriesJa.length, rawCategoriesEn.length);
  const normalizedCategoriesJa = Array.from({ length: catCount }, (_, i) => rawCategoriesJa[i] || { key: `cat-${i + 1}`, label: `カテゴリー ${i + 1}` });
  const normalizedCategoriesEn = Array.from({ length: catCount }, (_, i) => rawCategoriesEn[i] || { key: normalizedCategoriesJa[i]?.key || `cat-${i + 1}`, label: `Category ${i + 1}` });

  const handleUpdateCategoryLabel = (idx: number, langKey: "ja" | "en", val: string) => {
    if (langKey === "ja") {
      const updated = [...normalizedCategoriesJa];
      updated[idx] = { ...updated[idx], label: val };
      updateField("ja", ["categories"], updated);
    } else {
      const updated = [...normalizedCategoriesEn];
      updated[idx] = { ...updated[idx], label: val };
      updateField("en", ["categories"], updated);
    }
  };

  const handleUpdateCategoryKey = (idx: number, newKey: string) => {
    const safeKey = newKey.toLowerCase().replace(/[^a-z0-9_-]/g, "");
    const updatedJa = [...normalizedCategoriesJa];
    updatedJa[idx] = { ...updatedJa[idx], key: safeKey };
    updateField("ja", ["categories"], updatedJa);

    const updatedEn = [...normalizedCategoriesEn];
    updatedEn[idx] = { ...updatedEn[idx], key: safeKey };
    updateField("en", ["categories"], updatedEn);
  };

  const handleAddCategory = () => {
    const newKey = `cat-${Date.now().toString().slice(-4)}`;
    const newCatJa = { key: newKey, label: "新しいカテゴリー" };
    const newCatEn = { key: newKey, label: "New Category" };

    updateField("ja", ["categories"], [...normalizedCategoriesJa, newCatJa]);
    updateField("en", ["categories"], [...normalizedCategoriesEn, newCatEn]);
    toast("Đã thêm mục bộ lọc chuyên ngành mới!", "success");
  };

  const handleDeleteCategory = (idx: number) => {
    if (catCount <= 1) {
      toast("Phải giữ lại ít nhất 1 mục bộ lọc", "info");
      return;
    }
    const updatedJa = normalizedCategoriesJa.filter((_, i) => i !== idx);
    const updatedEn = normalizedCategoriesEn.filter((_, i) => i !== idx);
    updateField("ja", ["categories"], updatedJa);
    updateField("en", ["categories"], updatedEn);
    toast("Đã xóa mục bộ lọc chuyên ngành", "info");
  };

  // 2. Quản lý Danh sách Thẻ ứng dụng (Cards)
  const cardsJa: any[] = Array.isArray(contentJa?.cards)
    ? contentJa.cards
    : getApplicationCards("ja");
  const cardsEn: any[] = Array.isArray(contentEn?.cards)
    ? contentEn.cards
    : getApplicationCards("en");

  const count = Math.max(cardsJa.length, cardsEn.length);
  const normalizedCardsJa = Array.from({ length: count }, (_, i) => cardsJa[i] || { ...cardsJa[0], id: `app-${Date.now()}-${i}` });
  const normalizedCardsEn = Array.from({ length: count }, (_, i) => cardsEn[i] || { ...cardsEn[0], id: `app-${Date.now()}-${i}` });

  const handleUpdateCardField = (idx: number, field: string, langKey: "ja" | "en", val: any) => {
    if (langKey === "ja") {
      const updated = [...normalizedCardsJa];
      updated[idx] = { ...updated[idx], [field]: val };
      updateField("ja", ["cards"], updated);
    } else {
      const updated = [...normalizedCardsEn];
      updated[idx] = { ...updated[idx], [field]: val };
      updateField("en", ["cards"], updated);
    }
  };

  const handleUpdateBothLangs = (idx: number, field: string, val: any) => {
    const updatedJa = [...normalizedCardsJa];
    updatedJa[idx] = { ...updatedJa[idx], [field]: val };
    updateField("ja", ["cards"], updatedJa);

    const updatedEn = [...normalizedCardsEn];
    updatedEn[idx] = { ...updatedEn[idx], [field]: val };
    updateField("en", ["cards"], updatedEn);
  };

  const handlePatchBothLangs = (idx: number, patch: Record<string, any>) => {
    const updatedJa = [...normalizedCardsJa];
    updatedJa[idx] = { ...updatedJa[idx], ...patch };
    updateField("ja", ["cards"], updatedJa);

    const updatedEn = [...normalizedCardsEn];
    updatedEn[idx] = { ...updatedEn[idx], ...patch };
    updateField("en", ["cards"], updatedEn);
  };

  // 3. Quản lý Checklist (Thêm, Xóa, Sửa từng item)
  const handleUpdateChecklistItem = (cardIdx: number, checkIdx: number, langKey: "ja" | "en", val: string) => {
    if (langKey === "ja") {
      const updated = [...normalizedCardsJa];
      const curList = Array.isArray(updated[cardIdx]?.checklist) ? [...updated[cardIdx].checklist] : [];
      curList[checkIdx] = val;
      updated[cardIdx] = { ...updated[cardIdx], checklist: curList };
      updateField("ja", ["cards"], updated);
    } else {
      const updated = [...normalizedCardsEn];
      const curList = Array.isArray(updated[cardIdx]?.checklist) ? [...updated[cardIdx].checklist] : [];
      curList[checkIdx] = val;
      updated[cardIdx] = { ...updated[cardIdx], checklist: curList };
      updateField("en", ["cards"], updated);
    }
  };

  const handleAddChecklistItem = (cardIdx: number) => {
    const updatedJa = [...normalizedCardsJa];
    const listJa = Array.isArray(updatedJa[cardIdx]?.checklist) ? [...updatedJa[cardIdx].checklist] : [];
    listJa.push("新しいソリューションポイント");
    updatedJa[cardIdx] = { ...updatedJa[cardIdx], checklist: listJa };
    updateField("ja", ["cards"], updatedJa);

    const updatedEn = [...normalizedCardsEn];
    const listEn = Array.isArray(updatedEn[cardIdx]?.checklist) ? [...updatedEn[cardIdx].checklist] : [];
    listEn.push("New key solution point");
    updatedEn[cardIdx] = { ...updatedEn[cardIdx], checklist: listEn };
    updateField("en", ["cards"], updatedEn);
    toast("Đã thêm 1 điểm giải pháp kỹ thuật!", "success");
  };

  const handleDeleteChecklistItem = (cardIdx: number, checkIdx: number) => {
    const updatedJa = [...normalizedCardsJa];
    const listJa = Array.isArray(updatedJa[cardIdx]?.checklist) ? [...updatedJa[cardIdx].checklist] : [];
    const filteredJa = listJa.filter((_, i) => i !== checkIdx);
    updatedJa[cardIdx] = { ...updatedJa[cardIdx], checklist: filteredJa };
    updateField("ja", ["cards"], updatedJa);

    const updatedEn = [...normalizedCardsEn];
    const listEn = Array.isArray(updatedEn[cardIdx]?.checklist) ? [...updatedEn[cardIdx].checklist] : [];
    const filteredEn = listEn.filter((_, i) => i !== checkIdx);
    updatedEn[cardIdx] = { ...updatedEn[cardIdx], checklist: filteredEn };
    updateField("en", ["cards"], updatedEn);
    toast("Đã xóa điểm giải pháp", "info");
  };

  const handleAddCard = () => {
    const newId = `app-${Date.now()}`;
    const defaultCat = normalizedCategoriesJa[0]?.key || "bds";
    const newCardJa = {
      id: newId,
      category: defaultCat,
      targetTag: "分野タグ",
      num: String(count + 1).padStart(2, "0"),
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
      title: "新しい応用ソリューション",
      problemLabel: "解決する課題＆ニーズ:",
      problemText: "具体的な課題やクライアントの悩みを入力してください。",
      checklist: ["ソリューションポイント 1", "ソリューションポイント 2", "ソリューションポイント 3"],
      outcomeLabel: "もたらす成果:",
      outcomeVal: "具体的な成果・実績を入力してください。",
    };
    const newCardEn = {
      id: newId,
      category: defaultCat,
      targetTag: "NEW CATEGORY",
      num: String(count + 1).padStart(2, "0"),
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
      title: "New Practical Application",
      problemLabel: "CHALLENGE & NEEDS:",
      problemText: "Describe the specific challenge and needs.",
      checklist: ["Key Solution Point 1", "Key Solution Point 2", "Key Solution Point 3"],
      outcomeLabel: "PROVEN IMPACT:",
      outcomeVal: "Describe the measurable business outcome.",
    };

    updateField("ja", ["cards"], [...normalizedCardsJa, newCardJa]);
    updateField("en", ["cards"], [...normalizedCardsEn, newCardEn]);
    toast("Đã thêm thẻ ứng dụng mới!", "success");
  };

  const handleDeleteCard = (idx: number) => {
    if (count <= 1) {
      toast("Phải giữ lại ít nhất 1 thẻ ứng dụng", "info");
      return;
    }
    const updatedJa = normalizedCardsJa.filter((_, i) => i !== idx);
    const updatedEn = normalizedCardsEn.filter((_, i) => i !== idx);
    updateField("ja", ["cards"], updatedJa);
    updateField("en", ["cards"], updatedEn);
    toast("Đã xóa thẻ ứng dụng", "info");
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Form */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-3">
          1. Tiêu đề & Phụ đề Section Ứng dụng thực tế
        </h2>
        <BilingualField
          label="Tiêu đề chính Section (PRACTICAL APPLICATIONS...)"
          path={["info", "title"]}
          contentJa={contentJa}
          contentEn={contentEn}
          updateField={updateField}
          activeLang={lang}
        />
        <BilingualField
          label="Mô tả phụ đề bên phải (Spatial rendering and simulation...)"
          path={["info", "subtitle"]}
          contentJa={contentJa}
          contentEn={contentEn}
          updateField={updateField}
          activeLang={lang}
          isTextArea
          rows={3}
        />
      </div>

      {/* 2. Category Filter Tabs Management (Bộ lọc chuyên ngành) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              {lang === "ja"
                ? `2. 専門分野フィルタータブ管理 (${catCount}項目)`
                : lang === "en"
                  ? `2. Category Filter Tabs Management (${catCount} items)`
                  : `2. Danh mục bộ lọc chuyên ngành (${catCount} mục)`}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === "ja"
                ? "フィルタータブの追加・削除・名称変更を行います。この設定がLanding Pageのタブバーと各カードの選択肢に反映されます。"
                : lang === "en"
                  ? "Add, remove, and rename filter categories. Changes sync with the Landing Page tabs and card category selector."
                  : "Thêm, xóa hoặc đổi tên các tab bộ lọc. Cài đặt này sẽ hiển thị lên thanh bộ lọc Landing Page và danh sách chọn trong từng thẻ."}
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddCategory}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
          >
            <Plus size={14} />
            <span>
              {lang === "ja" ? "フィルター項目を追加" : lang === "en" ? "Add Category Tab" : "Thêm mục bộ lọc"}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {normalizedCategoriesJa.map((catJa, cIdx) => {
            const catEn = normalizedCategoriesEn[cIdx] || {};

            return (
              <div
                key={catJa.key || cIdx}
                className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-2.5"
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400">Key:</span>
                    <input
                      type="text"
                      value={catJa.key || ""}
                      placeholder="key (vd: bds)"
                      onChange={(e) => handleUpdateCategoryKey(cIdx, e.target.value)}
                      className="px-2 py-0.5 text-xs text-blue-700 font-mono font-bold bg-white border border-slate-200 rounded w-28 focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cIdx)}
                    disabled={catCount <= 1}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 disabled:opacity-30 px-2 py-0.5 rounded text-[11px] inline-flex items-center gap-1 transition"
                    title="Xóa mục bộ lọc này"
                  >
                    <Trash2 size={12} />
                    <span>{lang === "ja" ? "削除" : lang === "en" ? "Delete" : "Xóa"}</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {(lang === "ja" || lang === "both") && (
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                        🇯🇵 {lang === "ja" ? "タブ表示名 (JA)" : "Tên tab tiếng Nhật (JA)"}
                      </label>
                      <input
                        type="text"
                        value={catJa.label || ""}
                        placeholder="例: 不動産＆都市計画"
                        onChange={(e) => handleUpdateCategoryLabel(cIdx, "ja", e.target.value)}
                        className="w-full px-2.5 py-1 text-xs text-slate-800 bg-white border border-slate-200 rounded focus:border-blue-400 outline-none"
                      />
                    </div>
                  )}
                  {(lang === "en" || lang === "both") && (
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                        🇬🇧 {lang === "en" ? "Tab Label (EN)" : "Tên tab tiếng Anh (EN)"}
                      </label>
                      <input
                        type="text"
                        value={catEn.label || ""}
                        placeholder="e.g. Real Estate & Master Planning"
                        onChange={(e) => handleUpdateCategoryLabel(cIdx, "en", e.target.value)}
                        className="w-full px-2.5 py-1 text-xs text-slate-800 bg-white border border-slate-200 rounded focus:border-blue-400 outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Cards List Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              {lang === "ja"
                ? `3. 応用ソリューションカード一覧 (${count}枚)`
                : lang === "en"
                  ? `3. Practical Application Cards List (${count} cards)`
                  : `3. Danh sách các thẻ Giải pháp Ứng dụng thực tế (${count} thẻ)`}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === "ja"
                ? "各分野ごとの課題、チェックリスト、成果実績、画像を編集します。"
                : lang === "en"
                  ? "Edit challenges, checklist points, proven impacts, and imagery for each card."
                  : "Chỉnh sửa nội dung, tải ảnh, phân loại theo đối tượng khách hàng (BĐS, KTS, Nhà thầu, Gia chủ, v.v.)"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddCard}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
          >
            <Plus size={14} />
            <span>
              {lang === "ja" ? "カードを追加" : lang === "en" ? "Add Application Card" : "Thêm thẻ ứng dụng"}
            </span>
          </button>
        </div>

        <div className="space-y-6">
          {normalizedCardsJa.map((cJa, idx) => {
            const cEn = normalizedCardsEn[idx] || {};
            const cardImg = cJa.image || cEn.image || "";

            const checklistJa = Array.isArray(cJa.checklist) ? cJa.checklist : [];
            const checklistEn = Array.isArray(cEn.checklist) ? cEn.checklist : [];
            const maxChecklistLen = Math.max(checklistJa.length, checklistEn.length);

            return (
              <div
                key={cJa.id || idx}
                className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 relative"
              >
                {/* Card Top Row */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 uppercase">
                        {cJa.title || cEn.title || `Thẻ #${idx + 1}`}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-mono">
                        ID: {cJa.id || idx} · Danh mục: {cJa.category || "bds"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDeleteCard(idx)}
                      disabled={count <= 1}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-40 rounded-md border border-red-200 transition"
                      title="Xóa thẻ này"
                    >
                      <Trash2 size={13} />
                      <span>{lang === "ja" ? "カード削除" : lang === "en" ? "Delete Card" : "Xóa thẻ"}</span>
                    </button>
                  </div>
                </div>

                {/* Image and Basic Settings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Media Preview & Upload (Image / Video / VR·AR Link) */}
                  {(() => {
                    const cardVideoUrl = cJa.videoUrl || cEn.videoUrl || "";
                    const cardVrUrl = cJa.vrUrl || cEn.vrUrl || "";
                    const imgIsVideo = /\.(mp4|webm|mov)(\?.*)?$/i.test(cardImg);
                    const currentMediaType: "image" | "video" | "vr" =
                      cJa.mediaType ||
                      cEn.mediaType ||
                      (cardVrUrl && !cardVideoUrl ? "vr" : cardVideoUrl || imgIsVideo ? "video" : "image");
                    const activeVideoPreview = cardVideoUrl || (imgIsVideo ? cardImg : "");

                    return (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-1.5 flex-wrap">
                          <label className="block text-xs font-bold text-slate-700">
                            {lang === "ja"
                              ? "アイキャッチ (画像 / 動画 / VR・AR)"
                              : lang === "en"
                                ? "Card Media (Image / Video / VR·AR)"
                                : "Media thẻ (Ảnh / Video / Link VR·AR)"}
                          </label>
                          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => handleUpdateBothLangs(idx, "mediaType", "image")}
                              className={`px-2 py-0.5 text-[11px] font-semibold rounded-md transition ${
                                currentMediaType === "image"
                                  ? "bg-slate-800 text-white"
                                  : "text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              🖼️ Ảnh
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateBothLangs(idx, "mediaType", "video")}
                              className={`px-2 py-0.5 text-[11px] font-semibold rounded-md transition ${
                                currentMediaType === "video"
                                  ? "bg-amber-600 text-white"
                                  : "text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              🎬 Video
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateBothLangs(idx, "mediaType", "vr")}
                              className={`px-2 py-0.5 text-[11px] font-semibold rounded-md transition ${
                                currentMediaType === "vr"
                                  ? "bg-emerald-600 text-white"
                                  : "text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              🌐 VR/AR
                            </button>
                          </div>
                        </div>

                        <div className="w-full h-36 rounded-lg overflow-hidden border border-slate-200 bg-slate-900 flex items-center justify-center relative group">
                          {currentMediaType === "video" && activeVideoPreview && /\.(mp4|webm|mov)(\?.*)?$/i.test(activeVideoPreview) ? (
                            <video
                              src={activeVideoPreview}
                              poster={!imgIsVideo && cardImg ? cardImg : undefined}
                              className="w-full h-full object-cover"
                              muted
                              loop
                              autoPlay
                              playsInline
                            />
                          ) : cardImg && !imgIsVideo && (/\.(jpe?g|png|webp|gif|avif|svg)(\?.*)?$/i.test(cardImg) || /images\.unsplash\.com/i.test(cardImg)) ? (
                            <img
                              src={cardImg}
                              alt="Application preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (cardVrUrl || cardImg) ? (
                            <div className="w-full h-full flex flex-col items-center justify-center px-3 text-center bg-slate-900 text-emerald-300">
                              <Compass size={22} className="mb-1 text-emerald-400" />
                              <span className="text-[11px] font-bold">Đã gắn Link Web VR / AR</span>
                              <span className="text-[10px] text-slate-400 truncate max-w-full mt-0.5 font-mono">
                                {cardVrUrl || cardImg}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">
                              {currentMediaType === "video" ? "Chưa có video / ảnh bìa" : "Chưa có ảnh"}
                            </span>
                          )}

                          <div className="absolute top-2 right-2 flex items-center gap-1">
                            {(currentMediaType === "video" || Boolean(cardVideoUrl)) && (
                              <span className="px-2 py-0.5 rounded bg-amber-600/95 text-white text-[10px] font-bold shadow">
                                VIDEO
                              </span>
                            )}
                            {(currentMediaType === "vr" || Boolean(cardVrUrl)) && (
                              <span className="px-2 py-0.5 rounded bg-emerald-600/95 text-white text-[10px] font-bold shadow">
                                VR / AR
                              </span>
                            )}
                          </div>
                        </div>

                        {/* 1. Ảnh đại diện / Ảnh bìa (luôn hỗ trợ tải ảnh hoặc tải nhanh video) */}
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            {currentMediaType === "video"
                              ? "Ảnh bìa thu nhỏ (Poster) hoặc tải trực tiếp ảnh/video:"
                              : "Link ảnh đại diện (hoặc bấm Tải ảnh / video):"}
                          </label>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={cardImg}
                              placeholder="Dán link ảnh (URL)..."
                              onChange={(e) => handleUpdateBothLangs(idx, "image", e.target.value)}
                              className="flex-1 px-2.5 py-1 text-xs text-slate-800 bg-white border border-slate-200 rounded-md font-mono"
                            />
                            <label className="shrink-0 cursor-pointer">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-md">
                                <Upload size={12} />
                                <span>{lang === "ja" ? "UP" : lang === "en" ? "Upload" : "Tải"}</span>
                              </span>
                              <input
                                type="file"
                                accept="image/*,video/mp4,video/webm,video/quicktime"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const isVid = file.type.startsWith("video/") || /\.(mp4|webm|mov)$/i.test(file.name);
                                  const fd = new FormData();
                                  fd.append("file", file);
                                  try {
                                    const res = await fetch("/api/upload", { method: "POST", body: fd });
                                    const data = await res.json();
                                    if (res.ok && data.url) {
                                      if (isVid) {
                                        handlePatchBothLangs(idx, {
                                          videoUrl: data.url,
                                          mediaType: "video",
                                        });
                                        toast("Tải video thẻ ứng dụng thành công!", "success");
                                      } else {
                                        handleUpdateBothLangs(idx, "image", data.url);
                                        toast("Tải ảnh thẻ ứng dụng thành công!", "success");
                                      }
                                    } else {
                                      toast(data.error || "Tải tệp thất bại", "error");
                                    }
                                  } catch {
                                    toast("Lỗi tải tệp lên máy chủ", "error");
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>

                        {/* 2. Video Upload / Link (hiển thị nổi bật khi chọn tab Video hoặc đã có videoUrl) */}
                        {(currentMediaType === "video" || Boolean(cardVideoUrl)) && (
                          <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <label className="block text-[11px] font-bold text-amber-900">
                                🎬 Link Video (MP4 / YouTube / Vimeo) hoặc Tải Video:
                              </label>
                              {cardVideoUrl && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handlePatchBothLangs(idx, {
                                      videoUrl: "",
                                      mediaType: cardVrUrl ? "vr" : "image",
                                    })
                                  }
                                  className="text-[10px] text-red-600 hover:underline"
                                >
                                  Xóa video
                                </button>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={cardVideoUrl}
                                placeholder="https://... (.mp4, YouTube, Vimeo)"
                                onChange={(e) =>
                                  handlePatchBothLangs(idx, {
                                    videoUrl: e.target.value,
                                    mediaType: e.target.value.trim() ? "video" : currentMediaType,
                                  })
                                }
                                className="flex-1 px-2.5 py-1 text-xs text-slate-800 bg-white border border-amber-300 rounded-md font-mono"
                              />
                              <label className="shrink-0 cursor-pointer">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded-md">
                                  <Upload size={12} />
                                  <span>Video</span>
                                </span>
                                <input
                                  type="file"
                                  accept="video/mp4,video/webm,video/quicktime"
                                  className="hidden"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const fd = new FormData();
                                    fd.append("file", file);
                                    try {
                                      const res = await fetch("/api/upload", { method: "POST", body: fd });
                                      const data = await res.json();
                                      if (res.ok && data.url) {
                                        handlePatchBothLangs(idx, {
                                          videoUrl: data.url,
                                          mediaType: "video",
                                        });
                                        toast("Tải video thành công!", "success");
                                      } else {
                                        toast(data.error || "Tải video thất bại", "error");
                                      }
                                    } catch {
                                      toast("Lỗi tải video", "error");
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </div>
                        )}

                        {/* 3. Link VR / AR (luôn hiển thị gọn hoặc nổi bật khi chọn tab VR/AR) */}
                        <div
                          className={`p-2.5 rounded-lg border space-y-1.5 ${
                            currentMediaType === "vr" || Boolean(cardVrUrl)
                              ? "bg-emerald-50/80 border-emerald-200"
                              : "bg-white border-slate-200"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <label className="block text-[11px] font-bold text-emerald-900">
                              🌐 Link VR / AR (VD: vr.i8studio.vn/.../index.html, Matterport, Kuula, 360°):
                            </label>
                            {cardVrUrl && (
                              <button
                                type="button"
                                onClick={() =>
                                  handlePatchBothLangs(idx, {
                                    vrUrl: "",
                                    mediaType: cardVideoUrl ? "video" : "image",
                                  })
                                }
                                className="text-[10px] text-red-600 hover:underline"
                              >
                                Xóa VR/AR
                              </button>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={cardVrUrl}
                              placeholder="VD: https://vr.i8studio.vn/360/AR_JAPAN/index.html"
                              onChange={(e) =>
                                handlePatchBothLangs(idx, {
                                  vrUrl: e.target.value,
                                  mediaType:
                                    e.target.value.trim() && currentMediaType === "image" && !cardVideoUrl
                                      ? "vr"
                                      : currentMediaType,
                                })
                              }
                              className="flex-1 px-2.5 py-1 text-xs text-slate-800 bg-white border border-slate-200 rounded-md font-mono"
                            />
                            <label className="shrink-0 cursor-pointer" title="Tải ảnh Panorama 360°">
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-medium rounded-md">
                                <Upload size={11} />
                                <span>360°</span>
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const fd = new FormData();
                                  fd.append("file", file);
                                  try {
                                    const res = await fetch("/api/upload", { method: "POST", body: fd });
                                    const data = await res.json();
                                    if (res.ok && data.url) {
                                      handlePatchBothLangs(idx, {
                                        vrUrl: data.url,
                                        mediaType: "vr",
                                      });
                                      toast("Tải ảnh Panorama 360° thành công!", "success");
                                    } else {
                                      toast(data.error || "Tải ảnh 360° thất bại", "error");
                                    }
                                  } catch {
                                    toast("Lỗi tải ảnh 360°", "error");
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Settings: Category & Number */}
                  <div className="md:col-span-2 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {lang === "ja"
                            ? "専門分野フィルター (Category Filter)"
                            : lang === "en"
                              ? "Category Filter"
                              : "Bộ lọc chuyên ngành (Category Filter)"}
                        </label>
                        <select
                          value={cJa.category || normalizedCategoriesJa[0]?.key || "bds"}
                          onChange={(e) => handleUpdateBothLangs(idx, "category", e.target.value)}
                          className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                        >
                          {normalizedCategoriesJa.map((catJa, catIdx) => {
                            const catEn = normalizedCategoriesEn[catIdx] || {};
                            let displayLabel = catJa.label;
                            if (lang === "en") {
                              displayLabel = catEn.label || catJa.label;
                            } else if (lang === "ja") {
                              displayLabel = catJa.label;
                            } else {
                              displayLabel = `${catJa.label} / ${catEn.label || catJa.label}`;
                            }
                            return (
                              <option key={catJa.key || catIdx} value={catJa.key}>
                                {displayLabel} ({catJa.key})
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {lang === "ja" ? "番号表記 (例: 01, 02)" : lang === "en" ? "Order Number (e.g. 01, 02)" : "Số thứ tự góc ảnh (Ví dụ: 01, 02)"}
                        </label>
                        <input
                          type="text"
                          value={cJa.num || ""}
                          placeholder="01"
                          onChange={(e) => handleUpdateBothLangs(idx, "num", e.target.value)}
                          className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                        />
                      </div>
                    </div>

                    {/* Target Tag */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(lang === "ja" || lang === "both") && (
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            🇯🇵 {lang === "ja" ? "画像バッジタグ (JA)" : "Tag phân loại góc ảnh (JA)"}
                          </label>
                          <input
                            type="text"
                            value={cJa.targetTag || ""}
                            placeholder="不動産＆都市計画"
                            onChange={(e) => handleUpdateCardField(idx, "targetTag", "ja", e.target.value)}
                            className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      )}
                      {(lang === "en" || lang === "both") && (
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            🇬🇧 {lang === "en" ? "Image Badge Tag (EN)" : "Tag phân loại góc ảnh (EN)"}
                          </label>
                          <input
                            type="text"
                            value={cEn.targetTag || ""}
                            placeholder="REAL ESTATE & PLANNING"
                            onChange={(e) => handleUpdateCardField(idx, "targetTag", "en", e.target.value)}
                            className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(lang === "ja" || lang === "both") && (
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            🇯🇵 {lang === "ja" ? "カード見出し (JA)" : "Tiêu đề thẻ (JA)"}
                          </label>
                          <input
                            type="text"
                            value={cJa.title || ""}
                            placeholder="Tiêu đề tiếng Nhật..."
                            onChange={(e) => handleUpdateCardField(idx, "title", "ja", e.target.value)}
                            className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                          />
                        </div>
                      )}
                      {(lang === "en" || lang === "both") && (
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            🇬🇧 {lang === "en" ? "Card Title (EN)" : "Tiêu đề thẻ (EN)"}
                          </label>
                          <input
                            type="text"
                            value={cEn.title || ""}
                            placeholder="Tiêu đề tiếng Anh..."
                            onChange={(e) => handleUpdateCardField(idx, "title", "en", e.target.value)}
                            className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Problem & Needs Box */}
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase">
                    {lang === "ja" ? "課題＆クライアントニーズ (Problem & Needs)" : lang === "en" ? "Challenge & Client Needs" : "Bài toán & Nhu cầu thực tế (Problem & Needs)"}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(lang === "ja" || lang === "both") && (
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-500">
                          🇯🇵 Nhãn & Mô tả bài toán (JA)
                        </label>
                        <input
                          type="text"
                          value={cJa.problemLabel || "解決する課題＆ニーズ:"}
                          placeholder="解決する課題＆ニーズ:"
                          onChange={(e) => handleUpdateCardField(idx, "problemLabel", "ja", e.target.value)}
                          className="w-full px-2.5 py-1 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-md"
                        />
                        <textarea
                          rows={2}
                          value={cJa.problemText || ""}
                          placeholder="Mô tả bài toán tiếng Nhật..."
                          onChange={(e) => handleUpdateCardField(idx, "problemText", "ja", e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-md"
                        />
                      </div>
                    )}
                    {(lang === "en" || lang === "both") && (
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-500">
                          🇬🇧 Nhãn & Mô tả bài toán (EN)
                        </label>
                        <input
                          type="text"
                          value={cEn.problemLabel || "CHALLENGE & NEEDS:"}
                          placeholder="CHALLENGE & NEEDS:"
                          onChange={(e) => handleUpdateCardField(idx, "problemLabel", "en", e.target.value)}
                          className="w-full px-2.5 py-1 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-md"
                        />
                        <textarea
                          rows={2}
                          value={cEn.problemText || ""}
                          placeholder="Mô tả bài toán tiếng Anh..."
                          onChange={(e) => handleUpdateCardField(idx, "problemText", "en", e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-md"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Checklist (Hỗ trợ Thêm & Xóa động) */}
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 flex-wrap gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 uppercase">
                        {lang === "ja"
                          ? `ソリューション重要ポイント・チェックリスト (${maxChecklistLen}項目)`
                          : lang === "en"
                            ? `Key Solution Checklist (${maxChecklistLen} points)`
                            : `Điểm giải pháp kỹ thuật (Checklist - ${maxChecklistLen} điểm)`}
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        {lang === "ja" ? "項目の追加・削除が自由に行えます。" : lang === "en" ? "Freely add or remove checklist items." : "Thêm hoặc xóa các gạch đầu dòng giải pháp cho thẻ này."}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddChecklistItem(idx)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 text-[11px] font-semibold rounded-md border border-blue-200 transition"
                    >
                      <Plus size={12} />
                      <span>{lang === "ja" ? "項目を追加" : lang === "en" ? "Add Item" : "Thêm điểm giải pháp"}</span>
                    </button>
                  </div>

                  {maxChecklistLen === 0 ? (
                    <div className="text-center py-3 text-xs text-slate-400 italic">
                      Chưa có điểm giải pháp nào. Bấm nút "Thêm điểm giải pháp" ở trên để bổ sung.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {Array.from({ length: maxChecklistLen }).map((_, chkIdx) => {
                        const valJa = checklistJa[chkIdx] || "";
                        const valEn = checklistEn[chkIdx] || "";

                        return (
                          <div key={chkIdx} className="flex items-center gap-2 bg-slate-50/60 p-2 rounded-lg border border-slate-100">
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {(lang === "ja" || lang === "both") && (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] font-bold text-slate-400 shrink-0">#{chkIdx + 1} (JA)</span>
                                  <input
                                    type="text"
                                    value={valJa}
                                    placeholder={`ソリューションポイント #${chkIdx + 1} (JA)`}
                                    onChange={(e) => handleUpdateChecklistItem(idx, chkIdx, "ja", e.target.value)}
                                    className="w-full px-2.5 py-1 text-xs text-slate-800 bg-white border border-slate-200 rounded-md focus:border-blue-400 outline-none"
                                  />
                                </div>
                              )}
                              {(lang === "en" || lang === "both") && (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] font-bold text-slate-400 shrink-0">#{chkIdx + 1} (EN)</span>
                                  <input
                                    type="text"
                                    value={valEn}
                                    placeholder={`Key solution point #${chkIdx + 1} (EN)`}
                                    onChange={(e) => handleUpdateChecklistItem(idx, chkIdx, "en", e.target.value)}
                                    className="w-full px-2.5 py-1 text-xs text-slate-800 bg-white border border-slate-200 rounded-md focus:border-blue-400 outline-none"
                                  />
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteChecklistItem(idx, chkIdx)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition shrink-0"
                              title="Xóa điểm giải pháp này"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Outcome Footer */}
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase">
                    {lang === "ja" ? "もたらす成果・実績 (Proven Impact)" : lang === "en" ? "Proven Impact & Business Value" : "Giá trị thực tế đạt được (Proven Impact)"}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(lang === "ja" || lang === "both") && (
                      <div className="space-y-1">
                        <input
                          type="text"
                          value={cJa.outcomeLabel || "もたらす成果:"}
                          placeholder="もたらす成果:"
                          onChange={(e) => handleUpdateCardField(idx, "outcomeLabel", "ja", e.target.value)}
                          className="w-full px-2.5 py-1 text-[11px] text-slate-600 bg-slate-50 border border-slate-200 rounded-md"
                        />
                        <input
                          type="text"
                          value={cJa.outcomeVal || ""}
                          placeholder="Giá trị đạt được tiếng Nhật..."
                          onChange={(e) => handleUpdateCardField(idx, "outcomeVal", "ja", e.target.value)}
                          className="w-full px-2.5 py-1 text-xs text-slate-800 border border-slate-200 rounded-md font-medium"
                        />
                      </div>
                    )}
                    {(lang === "en" || lang === "both") && (
                      <div className="space-y-1">
                        <input
                          type="text"
                          value={cEn.outcomeLabel || "PROVEN IMPACT:"}
                          placeholder="PROVEN IMPACT:"
                          onChange={(e) => handleUpdateCardField(idx, "outcomeLabel", "en", e.target.value)}
                          className="w-full px-2.5 py-1 text-[11px] text-slate-600 bg-slate-50 border border-slate-200 rounded-md"
                        />
                        <input
                          type="text"
                          value={cEn.outcomeVal || ""}
                          placeholder="Giá trị đạt được tiếng Anh..."
                          onChange={(e) => handleUpdateCardField(idx, "outcomeVal", "en", e.target.value)}
                          className="w-full px-2.5 py-1 text-xs text-slate-800 border border-slate-200 rounded-md font-medium"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   07. PRICING STACK & GALLERY SECTION FORM (THIẾT KẾ THÂN THIỆN CHO NGƯỜI KHÔNG RÀNH IT)
   ------------------------------------------------------------------------- */
function GalleryForm({
  lang,
  contentJa,
  contentEn,
  updateField,
  sectionBgColor,
  setSectionBgColor,
}: {
  lang: "ja" | "en" | "both";
  contentJa: any;
  contentEn: any;
  updateField: (lang: "en" | "ja", path: string[], value: any) => void;
  sectionBgColor: string;
  setSectionBgColor: (hex: string) => void;
}) {
  const { toast } = useToast();

  // Trạng thái chọn Trang thẻ đang chỉnh sửa (0..4)
  const [selectedPageIdx, setSelectedPageIdx] = useState<number>(0);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [showProjectsEditor, setShowProjectsEditor] = useState<boolean>(false);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  const infoJa = contentJa?.info || {};
  const infoEn = contentEn?.info || {};

  // Giá trị mặc định hiển thị sẵn để người không rành IT thấy rõ nội dung đang có trên trang
  const defaultHeaderJa = {
    title: "制作料金・ビジュアライゼーションメニュー",
    subtitle: "建築パース（Standard / High Quality）・CGアニメーション・VR360・VR SSの5つの制作ラインナップ",
    btnViewDetail: "詳細を見る",
    btnConsult: "このプランで無料相談・見積依頼",
    consultHref: "/ja/contact",
    hotlineText: "お急ぎの方: 0984 384 190",
    deliverablesHeading: "標準納品物・サービス内容",
    projectsHeading: "建築・3DCG 実績リファレンス & 概算目安",
    projectsSubheading: "クリックで各プロジェクトの詳細仕様・拡大画像を確認できます",
    btnZoom: "フルサイズで拡大表示",
  };

  const defaultHeaderEn = {
    title: "3D Visualization & Production Pricing",
    subtitle: "5 specialized architectural visualization packages: View (Standard / 8K High Quality), Movie, VR360 & VR SS",
    btnViewDetail: "View Details",
    btnConsult: "Request Free Consultation & Quote",
    consultHref: "/en/contact",
    hotlineText: "Hotline: 0984 384 190",
    deliverablesHeading: "Standard Deliverables & Scope",
    projectsHeading: "Reference Architectural Projects & Estimates",
    projectsSubheading: "Click any project card to inspect specifications and full-size renders",
    btnZoom: "View Full Size",
  };

  // Helper cập nhật thông tin chung (info.*)
  const setInfoField = (field: string, target: "ja" | "en" | "shared", val: any) => {
    if (target === "shared") {
      updateField("ja", ["info", field], val);
      updateField("en", ["info", field], val);
    } else if (target === "ja") {
      updateField("ja", ["info", field], val);
      if (lang === "both" && !infoEn?.[field]) {
        updateField("en", ["info", field], val);
      }
    } else {
      updateField("en", ["info", field], val);
    }
  };

  // Upload tệp dùng chung (cho Ảnh nền tổng, Ảnh nền thẻ, Ảnh/Video minh họa, Ảnh dự án)
  const uploadFileToServer = async (file: File, keyId: string): Promise<{ url: string; isVideo: boolean } | null> => {
    setUploadingKey(keyId);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast(err?.error || "Không tải được tệp lên máy chủ", "error");
        return null;
      }
      const data = await res.json();
      if (data?.url) {
        const isVideo = file.type.startsWith("video/") || /\.(mp4|webm|mov)$/i.test(data.url);
        return { url: data.url, isVideo };
      }
      return null;
    } catch {
      toast("Lỗi kết nối mạng khi tải tệp lên", "error");
      return null;
    } finally {
      setUploadingKey(null);
    }
  };

  /* -----------------------------------------------------------------------
     QUẢN LÝ 5 TRANG THẺ GIÁ CẢ XẾP CHỒNG 3D
     ----------------------------------------------------------------------- */
  const defaultPagesJa = getDefaultPricingStackPages("ja");
  const defaultPagesEn = getDefaultPricingStackPages("en");

  const pagesJa: PricingStackPageItem[] =
    Array.isArray(contentJa?.pricingPages) && contentJa.pricingPages.length > 0
      ? contentJa.pricingPages
      : defaultPagesJa;

  const pagesEn: PricingStackPageItem[] =
    Array.isArray(contentEn?.pricingPages) && contentEn.pricingPages.length > 0
      ? contentEn.pricingPages
      : defaultPagesEn;

  const pageCount = Math.max(pagesJa.length, pagesEn.length);
  const safeSelectedIdx = Math.min(Math.max(0, selectedPageIdx), Math.max(0, pageCount - 1));

  const syncPages = (nextJa: PricingStackPageItem[], nextEn: PricingStackPageItem[]) => {
    updateField("ja", ["pricingPages"], nextJa);
    updateField("en", ["pricingPages"], nextEn);
  };

  const handleUpdatePageField = (
    idx: number,
    field: keyof PricingStackPageItem,
    langTarget: "ja" | "en" | "shared",
    val: any
  ) => {
    const nextJa = [...pagesJa];
    const nextEn = [...pagesEn];
    const baseJa = nextJa[idx] || defaultPagesJa[idx] || defaultPagesJa[0];
    const baseEn = nextEn[idx] || defaultPagesEn[idx] || defaultPagesEn[0];

    if (langTarget === "shared") {
      nextJa[idx] = { ...baseJa, [field]: val };
      nextEn[idx] = { ...baseEn, [field]: val };
      syncPages(nextJa, nextEn);
    } else if (langTarget === "ja") {
      nextJa[idx] = { ...baseJa, [field]: val };
      updateField("ja", ["pricingPages"], nextJa);
      if (lang === "both" && (!baseEn[field] || baseEn[field] === baseJa[field])) {
        nextEn[idx] = { ...baseEn, [field]: val };
        updateField("en", ["pricingPages"], nextEn);
      }
    } else {
      nextEn[idx] = { ...baseEn, [field]: val };
      updateField("en", ["pricingPages"], nextEn);
    }
  };

  const handleAddNewPage = () => {
    const nextNum = String(pageCount + 1).padStart(2, "0");
    const newId = `page-custom-${Date.now().toString().slice(-5)}`;
    const newPageJa: PricingStackPageItem = {
      id: newId,
      pageNumber: nextNum,
      tabLabel: `プラン ${nextNum}`,
      mediaMode: "gallery",
      qualityBadge: "CUSTOM PACKAGE · カスタムプラン",
      categoryName: `PLAN ${nextNum}`,
      title: "新規ビジュアライゼーションプラン",
      description: "プロジェクトの規模や用途に合わせた最適な3DCG制作プランをご提案いたします。",
      priceLabel: "参考目安費用",
      priceValue: "¥30,000〜 / カット",
      priceUnit: "納期目安: 3〜5営業日",
      cardBgColor: "#DDEFF9",
      cardBgImage: "",
      cardBgOverlay: "none",
      specs: ["4K 高精細出力", "無償修正2回込", "短納期対応"],
      deliverables: ["高解像度JPG/PNGデータ", "カメラアングル事前確認", "色調補正仕上げ"],
      detailSummary: "ご要望に応じて柔軟にカスタマイズ可能なパッケージです。",
      btnDetailText: "詳細を見る",
      mediaItems: [
        {
          id: `m-${Date.now()}-1`,
          type: "image",
          url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85",
          caption: "サンプルイメージ 01",
        },
        {
          id: `m-${Date.now()}-2`,
          type: "image",
          url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85",
          caption: "サンプルイメージ 02",
        },
        {
          id: `m-${Date.now()}-3`,
          type: "image",
          url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85",
          caption: "サンプルイメージ 03",
        },
      ],
    };

    const newPageEn: PricingStackPageItem = {
      ...newPageJa,
      tabLabel: `Plan ${nextNum}`,
      qualityBadge: "CUSTOM PACKAGE",
      title: "New Architectural Visualization Package",
      description: "Tailored 3D visualization package customized to your project scale and presentation goals.",
      priceLabel: "Reference Fee",
      priceValue: "From $220 / View",
      priceUnit: "Turnaround: 3–5 Business Days",
      specs: ["4K High-Res Output", "2 Free Revisions", "Fast Turnaround"],
      deliverables: ["High-Res JPG/PNG", "Camera Angle Preview", "Color Grading"],
      detailSummary: "Flexible visualization package tailored to your architectural requirements.",
      btnDetailText: "View Details",
    };

    const nextJa = [...pagesJa, newPageJa];
    const nextEn = [...pagesEn, newPageEn];
    syncPages(nextJa, nextEn);
    setSelectedPageIdx(nextJa.length - 1);
    toast(`Đã thêm Trang #${nextNum} mới!`, "success");
  };

  const handleMovePage = (idx: number, dir: -1 | 1) => {
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= pageCount) return;
    const nextJa = [...pagesJa];
    const nextEn = [...pagesEn];
    [nextJa[idx], nextJa[targetIdx]] = [nextJa[targetIdx], nextJa[idx]];
    [nextEn[idx], nextEn[targetIdx]] = [nextEn[targetIdx], nextEn[idx]];
    // Tự động đánh lại số thứ tự 01, 02... cho gọn
    nextJa.forEach((p, i) => {
      if (p) p.pageNumber = String(i + 1).padStart(2, "0");
    });
    nextEn.forEach((p, i) => {
      if (p) p.pageNumber = String(i + 1).padStart(2, "0");
    });
    syncPages(nextJa, nextEn);
    setSelectedPageIdx(targetIdx);
    toast("Đã đổi vị trí trang thẻ!", "success");
  };

  const handleDeletePage = (idx: number) => {
    if (pageCount <= 1) {
      toast("Cần giữ lại ít nhất 1 trang dịch vụ", "info");
      return;
    }
    if (!confirm(`Bạn có chắc muốn xóa Trang (${pagesJa[idx]?.pageNumber || idx + 1}) "${pagesJa[idx]?.title}" không?`)) {
      return;
    }
    const nextJa = pagesJa.filter((_, i) => i !== idx);
    const nextEn = pagesEn.filter((_, i) => i !== idx);
    syncPages(nextJa, nextEn);
    setSelectedPageIdx(Math.max(0, idx - 1));
    toast("Đã xóa trang dịch vụ", "info");
  };

  const handleResetDefault5Pages = () => {
    if (!confirm("Khôi phục lại bộ 5 trang gốc (View Standard, View High Quality, Movie, VR360, VR SS)?")) {
      return;
    }
    syncPages(getDefaultPricingStackPages("ja"), getDefaultPricingStackPages("en"));
    setSelectedPageIdx(0);
    toast("Đã khôi phục bộ 5 trang chuẩn thành công!", "success");
  };

  // Quản lý Media Items trong từng trang
  const handleUpdateMediaItem = (
    pageIdx: number,
    mediaIdx: number,
    patch: Partial<PricingStackMediaItem>,
    captionLang?: "ja" | "en"
  ) => {
    const nextJa = [...pagesJa];
    const nextEn = [...pagesEn];
    const pJa = { ...(nextJa[pageIdx] || defaultPagesJa[0]) };
    const pEn = { ...(nextEn[pageIdx] || defaultPagesEn[0]) };
    const listJa = Array.isArray(pJa.mediaItems) ? [...pJa.mediaItems] : [];
    const listEn = Array.isArray(pEn.mediaItems) ? [...pEn.mediaItems] : [];

    const curItemJa = listJa[mediaIdx] || { id: `m-${Date.now()}`, type: "image" as const, url: "" };
    const curItemEn = listEn[mediaIdx] || { ...curItemJa };

    if (captionLang === "ja") {
      listJa[mediaIdx] = { ...curItemJa, ...patch };
      pJa.mediaItems = listJa;
      nextJa[pageIdx] = pJa;
      updateField("ja", ["pricingPages"], nextJa);
    } else if (captionLang === "en") {
      listEn[mediaIdx] = { ...curItemEn, ...patch };
      pEn.mediaItems = listEn;
      nextEn[pageIdx] = pEn;
      updateField("en", ["pricingPages"], nextEn);
    } else {
      listJa[mediaIdx] = { ...curItemJa, ...patch };
      listEn[mediaIdx] = { ...curItemEn, ...patch };
      pJa.mediaItems = listJa;
      pEn.mediaItems = listEn;
      nextJa[pageIdx] = pJa;
      nextEn[pageIdx] = pEn;
      syncPages(nextJa, nextEn);
    }
  };

  const handleAddMediaItem = (pageIdx: number) => {
    const nextJa = [...pagesJa];
    const nextEn = [...pagesEn];
    const pJa = { ...(nextJa[pageIdx] || defaultPagesJa[0]) };
    const pEn = { ...(nextEn[pageIdx] || defaultPagesEn[0]) };
    const isMov = pJa.mediaMode === "movie";
    const isVr = pJa.mediaMode === "vr360";
    const newId = `m-${Date.now()}`;
    const newItemJa: PricingStackMediaItem = {
      id: newId,
      type: isMov ? "video" : isVr ? "vr360" : "image",
      url: isMov
        ? "/uploads/videos/1781842835877-Ocen_Resort_final.mp4"
        : isVr
        ? "/uploads/1782292102986-vr360_01_1.webp"
        : "/uploads/1786950469846-1722_vr01.webp",
      caption: isMov ? "新規ムービークリップ" : isVr ? "新規 360° シーン" : "新規サンプルカット",
    };
    const newItemEn: PricingStackMediaItem = {
      ...newItemJa,
      caption: isMov ? "New Movie Clip" : isVr ? "New 360° Scene" : "New Sample Shot",
    };
    pJa.mediaItems = [...(pJa.mediaItems || []), newItemJa];
    pEn.mediaItems = [...(pEn.mediaItems || []), newItemEn];
    nextJa[pageIdx] = pJa;
    nextEn[pageIdx] = pEn;
    syncPages(nextJa, nextEn);
    toast("Đã thêm mục hình ảnh / video mới!", "success");
  };

  const handleMoveMediaItem = (pageIdx: number, mediaIdx: number, dir: -1 | 1) => {
    const listJa = [...(pagesJa[pageIdx]?.mediaItems || [])];
    const listEn = [...(pagesEn[pageIdx]?.mediaItems || [])];
    const target = mediaIdx + dir;
    if (target < 0 || target >= listJa.length) return;
    [listJa[mediaIdx], listJa[target]] = [listJa[target], listJa[mediaIdx]];
    if (listEn[mediaIdx] && listEn[target]) {
      [listEn[mediaIdx], listEn[target]] = [listEn[target], listEn[mediaIdx]];
    }
    const nextJa = [...pagesJa];
    const nextEn = [...pagesEn];
    nextJa[pageIdx] = { ...nextJa[pageIdx], mediaItems: listJa };
    nextEn[pageIdx] = { ...(nextEn[pageIdx] || nextJa[pageIdx]), mediaItems: listEn };
    syncPages(nextJa, nextEn);
  };

  const handleRemoveMediaItem = (pageIdx: number, mediaIdx: number) => {
    const pJa = pagesJa[pageIdx];
    if ((pJa?.mediaItems?.length || 0) <= 1) {
      toast("Mỗi trang cần giữ ít nhất 1 hình ảnh hoặc video minh họa", "info");
      return;
    }
    const nextJa = [...pagesJa];
    const nextEn = [...pagesEn];
    nextJa[pageIdx] = {
      ...nextJa[pageIdx],
      mediaItems: (nextJa[pageIdx]?.mediaItems || []).filter((_, i) => i !== mediaIdx),
    };
    nextEn[pageIdx] = {
      ...(nextEn[pageIdx] || nextJa[pageIdx]),
      mediaItems: (nextEn[pageIdx]?.mediaItems || []).filter((_, i) => i !== mediaIdx),
    };
    syncPages(nextJa, nextEn);
    toast("Đã xóa mục minh họa", "info");
  };

  const handleAddSpecOrDeliv = (pageIdx: number, key: "specs" | "deliverables") => {
    const nextJa = [...pagesJa];
    const nextEn = [...pagesEn];
    const pJa = { ...(nextJa[pageIdx] || defaultPagesJa[0]) };
    const pEn = { ...(nextEn[pageIdx] || defaultPagesEn[0]) };
    pJa[key] = [...(pJa[key] || []), key === "specs" ? "新規仕様項目" : "新規納品項目"];
    pEn[key] = [...(pEn[key] || []), key === "specs" ? "New Spec" : "New Deliverable"];
    nextJa[pageIdx] = pJa;
    nextEn[pageIdx] = pEn;
    syncPages(nextJa, nextEn);
  };

  const handleUpdateSpecOrDeliv = (
    pageIdx: number,
    itemIdx: number,
    key: "specs" | "deliverables",
    targetLang: "ja" | "en",
    val: string
  ) => {
    if (targetLang === "ja") {
      const nextJa = [...pagesJa];
      const pJa = { ...(nextJa[pageIdx] || defaultPagesJa[0]) };
      const arr = [...(pJa[key] || [])];
      arr[itemIdx] = val;
      pJa[key] = arr;
      nextJa[pageIdx] = pJa;
      updateField("ja", ["pricingPages"], nextJa);
    } else {
      const nextEn = [...pagesEn];
      const pEn = { ...(nextEn[pageIdx] || defaultPagesEn[0]) };
      const arr = [...(pEn[key] || [])];
      arr[itemIdx] = val;
      pEn[key] = arr;
      nextEn[pageIdx] = pEn;
      updateField("en", ["pricingPages"], nextEn);
    }
  };

  const handleDeleteSpecOrDeliv = (
    pageIdx: number,
    itemIdx: number,
    key: "specs" | "deliverables"
  ) => {
    const nextJa = [...pagesJa];
    const nextEn = [...pagesEn];
    nextJa[pageIdx] = {
      ...nextJa[pageIdx],
      [key]: (nextJa[pageIdx]?.[key] || []).filter((_, i) => i !== itemIdx),
    };
    nextEn[pageIdx] = {
      ...(nextEn[pageIdx] || nextJa[pageIdx]),
      [key]: (nextEn[pageIdx]?.[key] || []).filter((_, i) => i !== itemIdx),
    };
    syncPages(nextJa, nextEn);
  };

  /* -----------------------------------------------------------------------
     QUẢN LÝ DANH SÁCH DỰ ÁN MẪU THAM KHẢO (TRONG POPUP CHI TIẾT)
     ----------------------------------------------------------------------- */
  const defaultProjectsJa = getGalleryProjectsData("ja");
  const defaultProjectsEn = getGalleryProjectsData("en");

  const rawProjectsJa: Record<string, any> =
    contentJa?.projects && typeof contentJa.projects === "object"
      ? Array.isArray(contentJa.projects)
        ? contentJa.projects.reduce((acc: any, p: any) => ({ ...acc, [p.id]: p }), {})
        : contentJa.projects
      : defaultProjectsJa;

  const rawProjectsEn: Record<string, any> =
    contentEn?.projects && typeof contentEn.projects === "object"
      ? Array.isArray(contentEn.projects)
        ? contentEn.projects.reduce((acc: any, p: any) => ({ ...acc, [p.id]: p }), {})
        : contentEn.projects
      : defaultProjectsEn;

  const allProjectKeys = Array.from(
    new Set([...Object.keys(rawProjectsJa), ...Object.keys(rawProjectsEn)])
  );

  const handleUpdateProject = (
    projId: string,
    field: string,
    langKey: "ja" | "en" | "shared",
    val: any
  ) => {
    const curJa = rawProjectsJa[projId] || defaultProjectsJa[projId] || {};
    const curEn = rawProjectsEn[projId] || defaultProjectsEn[projId] || {};

    if (langKey === "shared") {
      updateField("ja", ["projects"], { ...rawProjectsJa, [projId]: { ...curJa, id: projId, [field]: val } });
      updateField("en", ["projects"], { ...rawProjectsEn, [projId]: { ...curEn, id: projId, [field]: val } });
    } else if (langKey === "ja") {
      updateField("ja", ["projects"], { ...rawProjectsJa, [projId]: { ...curJa, id: projId, [field]: val } });
      if (lang === "both" && !curEn[field]) {
        updateField("en", ["projects"], { ...rawProjectsEn, [projId]: { ...curEn, id: projId, [field]: val } });
      }
    } else {
      updateField("en", ["projects"], { ...rawProjectsEn, [projId]: { ...curEn, id: projId, [field]: val } });
    }
  };

  const handlePatchProjectShared = (projId: string, patch: Record<string, any>) => {
    const curJa = rawProjectsJa[projId] || defaultProjectsJa[projId] || {};
    const curEn = rawProjectsEn[projId] || defaultProjectsEn[projId] || {};
    updateField("ja", ["projects"], {
      ...rawProjectsJa,
      [projId]: { ...curJa, id: projId, ...patch },
    });
    updateField("en", ["projects"], {
      ...rawProjectsEn,
      [projId]: { ...curEn, id: projId, ...patch },
    });
  };

  const handleAddProject = () => {
    const newId = `p-proj-${Date.now().toString().slice(-5)}`;
    const newProjJa = {
      id: newId,
      category: "villa",
      catTag: "高級リゾートヴィラ",
      title: "NEW ARCHITECTURAL PROJECT",
      loc: "ホーチャム · 750 m²",
      priceValue: "設計・3D目安: ¥2,800,000〜",
      priceEstimate: "設計・3D目安: ¥2,800,000〜",
      narrative: "自然光と素材の質感を最大限に引き出した建築空間ビジュアライゼーション。",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
      deliverables: ["8K CGパース", "実施設計図書"],
    };
    const newProjEn = {
      ...newProjJa,
      catTag: "LUXURY VILLA",
      loc: "Ho Tram · 750 m²",
      priceValue: "Est. Fee: $19,500~",
      priceEstimate: "Est. Fee: $19,500~",
      narrative: "Architectural visualization highlighting natural daylight and bespoke materials.",
    };
    updateField("ja", ["projects"], { ...rawProjectsJa, [newId]: newProjJa });
    updateField("en", ["projects"], { ...rawProjectsEn, [newId]: newProjEn });
    setShowProjectsEditor(true);
    setExpandedProjectId(newId);
    toast("Đã thêm dự án mẫu tham khảo mới!", "success");
  };

  const handleDeleteProject = (projId: string) => {
    if (!confirm("Bạn có chắc muốn xóa dự án tham khảo này?")) return;
    const nextJa = { ...rawProjectsJa };
    const nextEn = { ...rawProjectsEn };
    delete nextJa[projId];
    delete nextEn[projId];
    updateField("ja", ["projects"], nextJa);
    updateField("en", ["projects"], nextEn);
    toast("Đã xóa dự án tham khảo", "info");
  };

  // Bảng màu mẫu đẹp & dễ chọn cho người không chuyên IT
  const sectionBgSwatches = [
    { label: "Kem sáng hiện đại (Mặc định)", hex: "#F4F3EF" },
    { label: "Trắng ngà ấm", hex: "#FAF9F5" },
    { label: "Trắng tinh khiết", hex: "#FFFFFF" },
    { label: "Xám bạc nhạt", hex: "#EEF0F4" },
    { label: " Kem Cát Vàng", hex: "#F7F1E5" },
    { label: "Đen Tuyền Sang Trọng", hex: "#0B0D11" },
    { label: "Than Chì Kiến Trúc", hex: "#14171F" },
    { label: "Xanh Đêm Đậm", hex: "#0F172A" },
  ];

  const cardBgSwatches = [
    { label: "Xanh Da Trời Nhạt (Trang 1)", hex: "#DDEFF9" },
    { label: "Tím Lavender Nhạt (Trang 2)", hex: "#EFE8FB" },
    { label: "Cam Đào Kem (Trang 3)", hex: "#FBE9DE" },
    { label: "Xanh Ngọc Mint (Trang 4)", hex: "#DFF3EA" },
    { label: "Vàng Cát Ấm (Trang 5)", hex: "#F6EFDC" },
    { label: "Hồng Phấn Nhẹ", hex: "#FCE7F3" },
    { label: "Xanh Navy Đậm (Chữ trắng)", hex: "#1E2640" },
    { label: "Đen Than Sang Trọng (Chữ trắng)", hex: "#181A20" },
  ];

  const overlayOptions: Array<{ value: "none" | "light" | "dark-soft" | "dark-medium" | "dark-strong"; label: string }> = [
    { value: "none", label: "Không phủ mờ (Giữ nguyên ảnh gốc)" },
    { value: "light", label: "Phủ sáng trắng mờ (Dùng chữ màu tối)" },
    { value: "dark-soft", label: "Phủ tối nhẹ 35% (Dùng chữ màu trắng)" },
    { value: "dark-medium", label: "Phủ tối vừa 58% (Khuyên dùng - Chữ trắng rất rõ)" },
    { value: "dark-strong", label: "Phủ tối đậm 75% (Nổi bật chữ tối đa)" },
  ];

  const curPageJa = pagesJa[safeSelectedIdx] || defaultPagesJa[0];
  const curPageEn = pagesEn[safeSelectedIdx] || defaultPagesEn[0];
  const curMediaListJa = Array.isArray(curPageJa.mediaItems) ? curPageJa.mediaItems : [];
  const curMediaListEn = Array.isArray(curPageEn.mediaItems) ? curPageEn.mediaItems : [];

  const activeSectionBgHex = infoJa.sectionBgColor || sectionBgColor || "#F4F3EF";
  const handleSelectSectionBgColor = (hex: string) => {
    setSectionBgColor(hex);
    setInfoField("sectionBgColor", "shared", hex);
  };

  // Kiểm tra độ sáng màu thẻ cho khung Live Preview
  const isPreviewCardDark = (() => {
    if (curPageJa.cardBgImage) {
      return curPageJa.cardBgOverlay !== "light";
    }
    const m = String(curPageJa.cardBgColor || "#DDEFF9").match(/#([0-9a-fA-F]{6})/);
    if (!m) return false;
    const r = parseInt(m[1].slice(0, 2), 16);
    const g = parseInt(m[1].slice(2, 4), 16);
    const b = parseInt(m[1].slice(4, 6), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.48;
  })();

  return (
    <div className="space-y-8">
      {/* HƯỚNG DẪN NHANH CHO NGƯỜI CHỈNH SỬA */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 leading-relaxed">
          <p className="font-bold text-slate-900 text-sm mb-0.5">
            Hướng dẫn chỉnh sửa nhanh Mục 07 — Giá Cả (5 Trang Thẻ Lật 3D)
          </p>
          <p>
            Giao diện bên dưới được chia đúng theo thứ tự từ trên xuống dưới giống hệt ngoài trang web: <strong>(1) Nền chung &amp; Tiêu đề đầu mục</strong> → <strong>(2) Từng trang thẻ dịch vụ (01 đến 05) kèm màu nền / ảnh nền riêng</strong> → <strong>(3) Nút liên hệ tư vấn &amp; Hotline</strong> → <strong>(4) Dự án tham khảo trong cửa sổ chi tiết</strong>. Chỉnh xong bạn chỉ cần bấm nút <strong>&quot;Lưu thay đổi&quot;</strong> màu xanh ở góc trên hoặc dưới cùng.
          </p>
        </div>
      </div>

      {/* =====================================================================
          PHẦN 1: NỀN BACKGROUND TỔNG & TIÊU ĐỀ ĐẦU MỤC GIÁ CẢ
          ===================================================================== */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-extrabold inline-flex items-center justify-center">
              1
            </span>
            <span>Nền Background Chung &amp; Tiêu Đề Đầu Mục Giá Cả</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tùy chỉnh màu nền hoặc ảnh nền bao quanh toàn bộ khu vực Giá cả và dòng tiêu đề lớn nằm phía trên các thẻ.
          </p>
        </div>

        {/* 1A. Màu nền & Ảnh nền tổng của cả Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
          {/* Cột trái: Màu nền khu vực */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-800">
              🎨 Màu nền bao quanh toàn khu vực Giá cả (Bấm chọn màu mẫu hoặc tự phối màu):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {sectionBgSwatches.map((sw) => {
                const isSelected = activeSectionBgHex.toLowerCase() === sw.hex.toLowerCase();
                return (
                  <button
                    key={sw.hex}
                    type="button"
                    onClick={() => handleSelectSectionBgColor(sw.hex)}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-left transition cursor-pointer ${
                      isSelected
                        ? "border-blue-600 ring-2 ring-blue-500/25 bg-white font-bold"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full border border-slate-300 shrink-0 shadow-inner"
                      style={{ backgroundColor: sw.hex }}
                    />
                    <span className="text-[11px] text-slate-700 leading-tight line-clamp-2">
                      {sw.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-slate-600 font-medium">Hoặc tự chọn màu bất kỳ:</span>
              <input
                type="color"
                value={/^#[0-9a-fA-F]{6}$/.test(activeSectionBgHex) ? activeSectionBgHex : "#F4F3EF"}
                onChange={(e) => handleSelectSectionBgColor(e.target.value)}
                className="w-10 h-9 rounded border border-slate-300 cursor-pointer p-0.5 bg-white"
              />
              <input
                type="text"
                value={activeSectionBgHex}
                onChange={(e) => handleSelectSectionBgColor(e.target.value)}
                className="w-28 px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded-lg bg-white"
              />
            </div>
          </div>

          {/* Cột phải: Ảnh nền khu vực (Tùy chọn) */}
          <div className="space-y-3 border-t lg:border-t-0 lg:border-l border-slate-200 pt-4 lg:pt-0 lg:pl-5">
            <label className="block text-xs font-bold text-slate-800">
              🖼️ Ảnh nền (Background Image) cho toàn khu vực Giá cả (Không bắt buộc):
            </label>

            <div className="flex items-start gap-3">
              <div
                className="w-28 h-20 rounded-xl border border-slate-300 overflow-hidden shrink-0 flex items-center justify-center relative"
                style={{ backgroundColor: activeSectionBgHex }}
              >
                {infoJa.sectionBgImage ? (
                  <img
                    src={infoJa.sectionBgImage}
                    alt="Section Background"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[10px] text-slate-500 text-center px-2 font-medium">
                    Đang dùng màu nền đơn sắc
                  </span>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-slate-800 text-white hover:bg-slate-900 cursor-pointer transition shadow-sm">
                    <Upload className="w-3.5 h-3.5" />
                    <span>
                      {uploadingKey === "sec-bg" ? "Đang tải ảnh..." : "Tải ảnh nền từ máy tính"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingKey === "sec-bg"}
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        e.target.value = "";
                        if (!f) return;
                        const res = await uploadFileToServer(f, "sec-bg");
                        if (res?.url) {
                          setInfoField("sectionBgImage", "shared", res.url);
                          if (!infoJa.sectionBgOverlay || infoJa.sectionBgOverlay === "none") {
                            setInfoField("sectionBgOverlay", "shared", "dark-medium");
                          }
                          toast("Đã cập nhật ảnh nền khu vực Giá cả!", "success");
                        }
                      }}
                    />
                  </label>

                  {infoJa.sectionBgImage && (
                    <button
                      type="button"
                      onClick={() => {
                        setInfoField("sectionBgImage", "shared", "");
                        setInfoField("sectionBgOverlay", "shared", "none");
                        toast("Đã gỡ ảnh nền khu vực, quay về dùng màu nền", "info");
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Gỡ ảnh nền</span>
                    </button>
                  )}
                </div>

                {infoJa.sectionBgImage && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Độ phủ mờ trên ảnh nền (giúp chữ tiêu đề dễ đọc hơn):
                    </label>
                    <select
                      value={infoJa.sectionBgOverlay || "dark-medium"}
                      onChange={(e) => setInfoField("sectionBgOverlay", "shared", e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    >
                      {overlayOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 1B. Tiêu đề chính & Mô tả phụ đầu mục */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(lang === "ja" || lang === "both") && (
            <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold uppercase text-blue-700">
                🇯🇵 Nội dung hiển thị trên trang Tiếng Nhật
              </span>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tiêu đề lớn đầu mục Giá cả:
                </label>
                <input
                  type="text"
                  value={infoJa.title ?? defaultHeaderJa.title}
                  onChange={(e) => setInfoField("title", "ja", e.target.value)}
                  className="w-full px-3 py-2 text-sm font-bold border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dòng mô tả nhỏ ngay dưới tiêu đề:
                </label>
                <textarea
                  rows={2}
                  value={infoJa.subtitle ?? infoJa.sub ?? defaultHeaderJa.subtitle}
                  onChange={(e) => {
                    setInfoField("subtitle", "ja", e.target.value);
                    setInfoField("sub", "ja", e.target.value);
                  }}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                />
              </div>
            </div>
          )}

          {(lang === "en" || lang === "both") && (
            <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold uppercase text-emerald-700">
                🇬🇧 Nội dung hiển thị trên trang Tiếng Anh
              </span>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tiêu đề lớn đầu mục (EN):
                </label>
                <input
                  type="text"
                  value={infoEn.title ?? defaultHeaderEn.title}
                  onChange={(e) => setInfoField("title", "en", e.target.value)}
                  className="w-full px-3 py-2 text-sm font-bold border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dòng mô tả nhỏ dưới tiêu đề (EN):
                </label>
                <textarea
                  rows={2}
                  value={infoEn.subtitle ?? infoEn.sub ?? defaultHeaderEn.subtitle}
                  onChange={(e) => {
                    setInfoField("subtitle", "en", e.target.value);
                    setInfoField("sub", "en", e.target.value);
                  }}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =====================================================================
          PHẦN 2: CHỈNH SỬA CHI TIẾT TỪNG TRANG THẺ GIÁ CẢ XẾP CHỒNG (01 -> 05)
          ===================================================================== */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-extrabold inline-flex items-center justify-center">
                2
              </span>
              <span>
                Chỉnh Sửa Từng Trang Thẻ Giá Cả Xếp Chồng ({pageCount} Trang)
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Bấm chọn từng trang bên dưới (View Standard, View High Quality, Movie, VR360, VR SS) để đổi màu nền/ảnh nền thẻ, giá tiền, nội dung và tải ảnh/video minh họa.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleAddNewPage}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm trang mới</span>
            </button>

            <button
              type="button"
              onClick={handleResetDefault5Pages}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục 5 trang gốc</span>
            </button>
          </div>
        </div>

        {/* THANH CHỌN TRANG TRỰC QUAN GIỐNG GIAO DIỆN THẬT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {Array.from({ length: pageCount }).map((_, idx) => {
            const p = pagesJa[idx] || defaultPagesJa[idx] || defaultPagesJa[0];
            const isSelected = safeSelectedIdx === idx;
            return (
              <button
                key={p.id || idx}
                type="button"
                onClick={() => setSelectedPageIdx(idx)}
                className={`p-3 rounded-xl border text-left transition cursor-pointer relative ${
                  isSelected
                    ? "border-indigo-600 ring-2 ring-indigo-500/25 bg-indigo-50/40 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span
                    className="px-2 py-0.5 rounded-md text-[11px] font-extrabold border border-black/10"
                    style={{
                      backgroundColor: p.cardBgColor || "#DDEFF9",
                      color: "#15171C",
                    }}
                  >
                    ({String(p.pageNumber || `0${idx + 1}`).replace(/[()]/g, "")})
                  </span>
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                    {p.mediaMode === "movie"
                      ? "🎬 Video"
                      : p.mediaMode === "vr360"
                      ? "🌐 VR 360°"
                      : p.mediaMode === "vrss"
                      ? "📸 VR SS"
                      : "🖼️ Bộ ảnh"}
                  </span>
                </div>
                <p className="text-xs font-extrabold text-slate-900 truncate">
                  {p.tabLabel || p.categoryName}
                </p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{p.title}</p>
                <p className="text-[11px] font-bold text-indigo-700 mt-1 truncate">
                  {p.priceValue}
                </p>
              </button>
            );
          })}
        </div>

        {/* KHUNG XEM TRƯỚC TRỰC QUAN (LIVE PREVIEW) + THANH CÔNG CỤ SẮP XẾP TRANG ĐANG CHỌN */}
        <div className="rounded-2xl border-2 border-indigo-100 bg-slate-50/70 p-4 sm:p-5 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-xs font-extrabold">
                Đang chỉnh sửa Trang ({String(curPageJa.pageNumber || `0${safeSelectedIdx + 1}`).replace(/[()]/g, "")})
              </span>
              <span className="text-sm font-bold text-slate-800">
                {curPageJa.categoryName} — {curPageJa.title}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={safeSelectedIdx === 0}
                onClick={() => handleMovePage(safeSelectedIdx, -1)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                title="Đưa trang này lên trước"
              >
                ◀ Đưa lên trước
              </button>
              <button
                type="button"
                disabled={safeSelectedIdx >= pageCount - 1}
                onClick={() => handleMovePage(safeSelectedIdx, 1)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                title="Đưa trang này ra sau"
              >
                Đưa ra sau ▶
              </button>
              <button
                type="button"
                onClick={() => handleDeletePage(safeSelectedIdx)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa trang này</span>
              </button>
            </div>
          </div>

          {/* MINI LIVE PREVIEW CỦA THẺ */}
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              👁️ Xem trước màu sắc &amp; bố cục Trang ({String(curPageJa.pageNumber || `0${safeSelectedIdx + 1}`).replace(/[()]/g, "")}):
            </p>
            <div
              className="relative rounded-2xl p-5 overflow-hidden border border-black/10 shadow-md transition-all"
              style={{
                backgroundColor: curPageJa.cardBgColor || "#DDEFF9",
                color: isPreviewCardDark ? "#F8FAFC" : "#15171C",
              }}
            >
              {curPageJa.cardBgImage && (
                <div className="absolute inset-0 pointer-events-none">
                  <img
                    src={curPageJa.cardBgImage}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  {curPageJa.cardBgOverlay && curPageJa.cardBgOverlay !== "none" && (
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundColor:
                          curPageJa.cardBgOverlay === "light"
                            ? "rgba(248,247,243,0.78)"
                            : curPageJa.cardBgOverlay === "dark-soft"
                            ? "rgba(14,16,22,0.36)"
                            : curPageJa.cardBgOverlay === "dark-strong"
                            ? "rgba(14,16,22,0.76)"
                            : "rgba(14,16,22,0.58)",
                      }}
                    />
                  )}
                </div>
              )}

              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase"
                        style={{
                          backgroundColor: isPreviewCardDark ? "#FFFFFF" : "#16181D",
                          color: isPreviewCardDark ? "#16181D" : "#FFFFFF",
                        }}
                      >
                        {curPageJa.categoryName}
                      </span>
                      {curPageJa.qualityBadge && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/40 backdrop-blur-sm border border-current/15">
                          ✦ {curPageJa.qualityBadge}
                        </span>
                      )}
                    </div>
                    <h4 className="text-lg font-extrabold leading-snug">{curPageJa.title}</h4>
                    <p className="text-xs opacity-80 line-clamp-1 mt-0.5">{curPageJa.description}</p>
                  </div>
                  <span className="text-xl font-bold opacity-80 shrink-0">
                    ({String(curPageJa.pageNumber || `0${safeSelectedIdx + 1}`).replace(/[()]/g, "")})
                  </span>
                </div>

                <div className="flex flex-wrap items-end justify-between gap-4 pt-1">
                  <div className="px-3.5 py-2 rounded-xl bg-white/55 backdrop-blur-sm border border-black/10 text-slate-900">
                    <span className="block text-[10px] font-bold text-slate-600">
                      {curPageJa.priceLabel}
                    </span>
                    <span className="text-base font-extrabold text-slate-900">
                      {curPageJa.priceValue}
                    </span>{" "}
                    <span className="text-[11px] font-semibold text-slate-700">
                      {curPageJa.priceUnit}
                    </span>
                  </div>

                  <span
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold shadow"
                    style={{
                      backgroundColor: isPreviewCardDark ? "#FFFFFF" : "#16181D",
                      color: isPreviewCardDark ? "#16181D" : "#FFFFFF",
                    }}
                  >
                    {curPageJa.btnDetailText || infoJa.btnViewDetail || defaultHeaderJa.btnViewDetail} →
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* HỘP 2.1: NỀN BACKGROUND RIÊNG CỦA TRANG THẺ NÀY */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <span>🎨 Bước 2.1 — Nền Background riêng của Trang thẻ này (Màu nền &amp; Ảnh nền)</span>
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Màu nền thẻ */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  Chọn màu nền thẻ (Nhấp 1 chạm vào ô màu bên dưới):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {cardBgSwatches.map((sw) => {
                    const isCurr =
                      (curPageJa.cardBgColor || "").toLowerCase() === sw.hex.toLowerCase();
                    return (
                      <button
                        key={sw.hex}
                        type="button"
                        onClick={() =>
                          handleUpdatePageField(safeSelectedIdx, "cardBgColor", "shared", sw.hex)
                        }
                        className={`flex items-center gap-2 p-2 rounded-lg border text-left transition cursor-pointer ${
                          isCurr
                            ? "border-indigo-600 ring-2 ring-indigo-500/25 bg-indigo-50/30 font-bold"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-slate-300 shrink-0"
                          style={{ backgroundColor: sw.hex }}
                        />
                        <span className="text-[11px] text-slate-700 leading-tight line-clamp-2">
                          {sw.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs text-slate-600 font-medium">Hoặc tự chọn màu khác:</span>
                  <input
                    type="color"
                    value={
                      /^#[0-9a-fA-F]{6}$/.test(curPageJa.cardBgColor || "")
                        ? curPageJa.cardBgColor
                        : "#DDEFF9"
                    }
                    onChange={(e) =>
                      handleUpdatePageField(
                        safeSelectedIdx,
                        "cardBgColor",
                        "shared",
                        e.target.value
                      )
                    }
                    className="w-10 h-9 rounded border border-slate-300 cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={curPageJa.cardBgColor || "#DDEFF9"}
                    onChange={(e) =>
                      handleUpdatePageField(
                        safeSelectedIdx,
                        "cardBgColor",
                        "shared",
                        e.target.value
                      )
                    }
                    className="w-28 px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Ảnh nền riêng của thẻ */}
              <div className="space-y-3 border-t lg:border-t-0 lg:border-l border-slate-200 pt-4 lg:pt-0 lg:pl-5">
                <label className="block text-xs font-bold text-slate-700">
                  Ảnh nền (Background Image) riêng cho Trang thẻ này (Không bắt buộc):
                </label>
                <div className="flex items-start gap-3">
                  <div
                    className="w-28 h-20 rounded-xl border border-slate-300 overflow-hidden shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: curPageJa.cardBgColor || "#DDEFF9" }}
                  >
                    {curPageJa.cardBgImage ? (
                      <img
                        src={curPageJa.cardBgImage}
                        alt="Card Background"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-slate-600 text-center px-2 font-medium">
                        Chưa dùng ảnh nền
                      </span>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-slate-800 text-white hover:bg-slate-900 cursor-pointer transition">
                        <Upload className="w-3.5 h-3.5" />
                        <span>
                          {uploadingKey === `card-bg-${safeSelectedIdx}`
                            ? "Đang tải..."
                            : "Tải ảnh nền cho thẻ này"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingKey === `card-bg-${safeSelectedIdx}`}
                          onChange={async (e) => {
                            const f = e.target.files?.[0];
                            e.target.value = "";
                            if (!f) return;
                            const res = await uploadFileToServer(f, `card-bg-${safeSelectedIdx}`);
                            if (res?.url) {
                              handleUpdatePageField(
                                safeSelectedIdx,
                                "cardBgImage",
                                "shared",
                                res.url
                              );
                              if (!curPageJa.cardBgOverlay || curPageJa.cardBgOverlay === "none") {
                                handleUpdatePageField(
                                  safeSelectedIdx,
                                  "cardBgOverlay",
                                  "shared",
                                  "dark-medium"
                                );
                              }
                              toast("Đã tải ảnh nền riêng cho thẻ!", "success");
                            }
                          }}
                        />
                      </label>

                      {curPageJa.cardBgImage && (
                        <button
                          type="button"
                          onClick={() => {
                            handleUpdatePageField(safeSelectedIdx, "cardBgImage", "shared", "");
                            handleUpdatePageField(
                              safeSelectedIdx,
                              "cardBgOverlay",
                              "shared",
                              "none"
                            );
                            toast("Đã gỡ ảnh nền của thẻ", "info");
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Gỡ ảnh nền</span>
                        </button>
                      )}
                    </div>

                    {curPageJa.cardBgImage && (
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Lớp phủ giúp đọc rõ chữ trên ảnh nền thẻ:
                        </label>
                        <select
                          value={curPageJa.cardBgOverlay || "dark-medium"}
                          onChange={(e) =>
                            handleUpdatePageField(
                              safeSelectedIdx,
                              "cardBgOverlay",
                              "shared",
                              e.target.value
                            )
                          }
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                        >
                          {overlayOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* HỘP 2.2: TIÊU ĐỀ, NHÃN CHẤT LƯỢNG, SỐ THỨ TỰ & NÚT BẤM TRÊN MẶT THẺ */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5">
              📌 Bước 2.2 — Phần Đầu Thẻ &amp; Nút Bấm Cạnh Phải (Góc trên trái, góc trên phải &amp; nút Xem chi tiết)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Số thứ tự góc trên phải (Ví dụ: 01, 02):
                </label>
                <input
                  type="text"
                  value={curPageJa.pageNumber || ""}
                  onChange={(e) =>
                    handleUpdatePageField(safeSelectedIdx, "pageNumber", "shared", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm font-bold border border-slate-300 rounded-lg"
                  placeholder="01"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên trên huy hiệu đen (Ví dụ: VIEW — STANDARD):
                </label>
                <input
                  type="text"
                  value={curPageJa.categoryName || ""}
                  onChange={(e) =>
                    handleUpdatePageField(
                      safeSelectedIdx,
                      "categoryName",
                      "shared",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 text-sm font-bold border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên ngắn trên thanh nút chuyển nhanh phía trên (Tùy chọn):
                </label>
                <input
                  type="text"
                  value={curPageJa.tabLabel || ""}
                  onChange={(e) =>
                    handleUpdatePageField(safeSelectedIdx, "tabLabel", "ja", e.target.value)
                  }
                  placeholder={curPageJa.categoryName || "Để trống sẽ lấy theo tên huy hiệu"}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(lang === "ja" || lang === "both") && (
                <div className="space-y-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold uppercase text-indigo-700">
                    🇯🇵 Nội dung trên mặt thẻ (Tiếng Nhật)
                  </span>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nhãn chất lượng (Ô bên cạnh tên huy hiệu):
                    </label>
                    <input
                      type="text"
                      value={curPageJa.qualityBadge || ""}
                      onChange={(e) =>
                        handleUpdatePageField(
                          safeSelectedIdx,
                          "qualityBadge",
                          "ja",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tiêu đề lớn của trang thẻ:
                    </label>
                    <input
                      type="text"
                      value={curPageJa.title || ""}
                      onChange={(e) =>
                        handleUpdatePageField(safeSelectedIdx, "title", "ja", e.target.value)
                      }
                      className="w-full px-3 py-1.5 text-sm font-bold border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Đoạn giới thiệu ngắn bên dưới tiêu đề (2 dòng):
                    </label>
                    <textarea
                      rows={2}
                      value={curPageJa.description || ""}
                      onChange={(e) =>
                        handleUpdatePageField(safeSelectedIdx, "description", "ja", e.target.value)
                      }
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Chữ trên nút bấm tròn ở cạnh phải thẻ (Mặc định: 詳細を見る):
                    </label>
                    <input
                      type="text"
                      value={curPageJa.btnDetailText || ""}
                      onChange={(e) =>
                        handleUpdatePageField(
                          safeSelectedIdx,
                          "btnDetailText",
                          "ja",
                          e.target.value
                        )
                      }
                      placeholder="詳細を見る"
                      className="w-full px-3 py-1.5 text-xs font-bold border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              )}

              {(lang === "en" || lang === "both") && (
                <div className="space-y-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold uppercase text-emerald-700">
                    🇬🇧 Nội dung trên mặt thẻ (Tiếng Anh)
                  </span>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nhãn chất lượng (EN):
                    </label>
                    <input
                      type="text"
                      value={curPageEn.qualityBadge || ""}
                      onChange={(e) =>
                        handleUpdatePageField(
                          safeSelectedIdx,
                          "qualityBadge",
                          "en",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tiêu đề lớn của trang thẻ (EN):
                    </label>
                    <input
                      type="text"
                      value={curPageEn.title || ""}
                      onChange={(e) =>
                        handleUpdatePageField(safeSelectedIdx, "title", "en", e.target.value)
                      }
                      className="w-full px-3 py-1.5 text-sm font-bold border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Đoạn giới thiệu ngắn (EN):
                    </label>
                    <textarea
                      rows={2}
                      value={curPageEn.description || ""}
                      onChange={(e) =>
                        handleUpdatePageField(safeSelectedIdx, "description", "en", e.target.value)
                      }
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Chữ trên nút cạnh phải thẻ (EN):
                    </label>
                    <input
                      type="text"
                      value={curPageEn.btnDetailText || ""}
                      onChange={(e) =>
                        handleUpdatePageField(
                          safeSelectedIdx,
                          "btnDetailText",
                          "en",
                          e.target.value
                        )
                      }
                      placeholder="View Details"
                      className="w-full px-3 py-1.5 text-xs font-bold border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* HỘP 2.3: KHUNG GIÁ TIỀN & THÔNG SỐ TÍCH XANH GÓC DƯỚI BÊN TRÁI */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5">
              💰 Bước 2.3 — Khung Giá Tiền &amp; Các Dòng Thông Số Tích Xanh (Góc dưới bên trái thẻ)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-amber-50/60 border border-amber-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dòng chữ nhỏ phía trên giá:
                </label>
                <input
                  type="text"
                  value={
                    lang === "en" ? curPageEn.priceLabel || "" : curPageJa.priceLabel || ""
                  }
                  onChange={(e) =>
                    handleUpdatePageField(
                      safeSelectedIdx,
                      "priceLabel",
                      lang === "en" ? "en" : "ja",
                      e.target.value
                    )
                  }
                  placeholder="参考目安費用"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mức giá chính nổi bật (Chữ to đậm):
                </label>
                <input
                  type="text"
                  value={
                    lang === "en" ? curPageEn.priceValue || "" : curPageJa.priceValue || ""
                  }
                  onChange={(e) =>
                    handleUpdatePageField(
                      safeSelectedIdx,
                      "priceValue",
                      lang === "en" ? "en" : "ja",
                      e.target.value
                    )
                  }
                  placeholder="¥18,000〜 / カット"
                  className="w-full px-3 py-2 text-sm font-extrabold text-amber-900 border border-amber-300 rounded-lg bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ghi chú phụ / Thời gian giao bài cạnh giá:
                </label>
                <input
                  type="text"
                  value={lang === "en" ? curPageEn.priceUnit || "" : curPageJa.priceUnit || ""}
                  onChange={(e) =>
                    handleUpdatePageField(
                      safeSelectedIdx,
                      "priceUnit",
                      lang === "en" ? "en" : "ja",
                      e.target.value
                    )
                  }
                  placeholder="納期目安: 2〜4営業日 · 軽微修正2回込"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                />
              </div>
            </div>

            {/* Danh sách thông số tích xanh dưới khung giá */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  ✓ Các ô thông số ngắn hiển thị bên dưới khung giá ({(curPageJa.specs || []).length} mục):
                </label>
                <button
                  type="button"
                  onClick={() => handleAddSpecOrDeliv(safeSelectedIdx, "specs")}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm dòng thông số</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(curPageJa.specs || []).map((sp, sIdx) => (
                  <div
                    key={sIdx}
                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <input
                      type="text"
                      value={lang === "en" ? curPageEn.specs?.[sIdx] || "" : sp}
                      onChange={(e) =>
                        handleUpdateSpecOrDeliv(
                          safeSelectedIdx,
                          sIdx,
                          "specs",
                          lang === "en" ? "en" : "ja",
                          e.target.value
                        )
                      }
                      className="flex-1 px-2.5 py-1 text-xs border border-slate-300 rounded bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteSpecOrDeliv(safeSelectedIdx, sIdx, "specs")}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                      title="Xóa dòng này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* HỘP 2.4: HÌNH ẢNH / VIDEO / KHÔNG GIAN XOAY 360° GÓC DƯỚI BÊN PHẢI */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  🖼️ Bước 2.4 — Hình Ảnh / Video / Xoay 360° Minh Họa (Góc dưới bên phải thẻ)
                </h3>
                <p className="text-xs text-slate-500">
                  Chọn kiểu trình chiếu phù hợp rồi tải ảnh / video từ máy tính lên.
                </p>
              </div>
            </div>

            {/* 4 nút chọn kiểu trình chiếu dễ hiểu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {[
                {
                  mode: "gallery",
                  title: "🖼️ Bộ ảnh minh họa",
                  desc: "Hiện 3 khung ảnh cạnh nhau, bấm vào phóng to full ảnh (View)",
                },
                {
                  mode: "movie",
                  title: "🎬 Phát Video / Phim",
                  desc: "Khung phát phim tự động chạy kèm nút bật tiếng & phóng to (Movie)",
                },
                {
                  mode: "vr360",
                  title: "🌐 Không gian xoay 360°",
                  desc: "Khách kéo chuột xoay 360° trực tiếp quanh phòng (VR360)",
                },
                {
                  mode: "vrss",
                  title: "📸 Bộ ảnh / clip VR SS",
                  desc: "Hiện bộ ảnh hoặc clip trích xuất đa góc từ không gian VR",
                },
              ].map((opt) => {
                const active = (curPageJa.mediaMode || "gallery") === opt.mode;
                return (
                  <button
                    key={opt.mode}
                    type="button"
                    onClick={() =>
                      handleUpdatePageField(safeSelectedIdx, "mediaMode", "shared", opt.mode)
                    }
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      active
                        ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20"
                        : "border-slate-200 bg-slate-50/50 hover:bg-white"
                    }`}
                  >
                    <p className="text-xs font-extrabold text-slate-900">{opt.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{opt.desc}</p>
                  </button>
                );
              })}
            </div>

            {/* Cài đặt chữ hiển thị riêng trên khung Video hoặc khung VR360 */}
            {(curPageJa.mediaMode === "movie" || curPageJa.mediaMode === "vr360") && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3.5 rounded-xl bg-sky-50/60 border border-sky-200">
                <div>
                  <label className="block text-xs font-bold text-sky-950 mb-1">
                    {curPageJa.mediaMode === "vr360"
                      ? "Dòng chữ hướng dẫn góc trái khung 360°:"
                      : "Nhãn chữ góc trên trái khung Video:"}
                  </label>
                  <input
                    type="text"
                    value={curPageJa.mediaBadgeText || ""}
                    onChange={(e) =>
                      handleUpdatePageField(
                        safeSelectedIdx,
                        "mediaBadgeText",
                        "ja",
                        e.target.value
                      )
                    }
                    placeholder={
                      curPageJa.mediaMode === "vr360"
                        ? "360° ドラッグして視点回転"
                        : "4K ARCHITECTURAL FILM"
                    }
                    className="w-full px-3 py-1.5 text-xs border border-sky-200 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-sky-950 mb-1">
                    Chữ trên nút Mở toàn màn hình:
                  </label>
                  <input
                    type="text"
                    value={curPageJa.expandBtnText || ""}
                    onChange={(e) =>
                      handleUpdatePageField(
                        safeSelectedIdx,
                        "expandBtnText",
                        "ja",
                        e.target.value
                      )
                    }
                    placeholder={curPageJa.mediaMode === "vr360" ? "全画面VR体験" : "全画面再生"}
                    className="w-full px-3 py-1.5 text-xs border border-sky-200 rounded-lg bg-white"
                  />
                </div>

                {curPageJa.mediaMode === "vr360" && (
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-sky-950 mb-1">
                      🌐 Đường dẫn Link Web VR / AR (Hỗ trợ link vr.i8studio.vn/.../index.html, Matterport, Kuula, Panoee — Bỏ trống nếu dùng ảnh Panorama 360° bên dưới):
                    </label>
                    <input
                      type="text"
                      value={curPageJa.vrEmbedUrl || ""}
                      onChange={(e) =>
                        handleUpdatePageField(
                          safeSelectedIdx,
                          "vrEmbedUrl",
                          "shared",
                          e.target.value
                        )
                      }
                      placeholder="VD: https://vr.i8studio.vn/360/AR_JAPAN/index.html (hoặc bỏ trống để dùng danh sách bên dưới)"
                      className="w-full px-3 py-1.5 text-xs font-mono border border-sky-200 rounded-lg bg-white"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Danh sách các tệp Ảnh / Video của trang */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  Danh sách Ảnh / Video đang hiển thị trên trang này ({curMediaListJa.length} mục):
                </span>
                <button
                  type="button"
                  onClick={() => handleAddMediaItem(safeSelectedIdx)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm Ảnh / Video</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {curMediaListJa.map((mItem, mIdx) => {
                  const uploadKey = `media-${safeSelectedIdx}-${mIdx}`;
                  const posterKey = `poster-${safeSelectedIdx}-${mIdx}`;
                  const isVid =
                    mItem.type === "video" || /\.(mp4|webm|mov)$/i.test(mItem.url || "");
                  const mEn = curMediaListEn[mIdx] || mItem;

                  return (
                    <div
                      key={mItem.id || mIdx}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5"
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                        <span>Mục #{mIdx + 1}</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={mIdx === 0}
                            onClick={() => handleMoveMediaItem(safeSelectedIdx, mIdx, -1)}
                            className="px-1.5 py-0.5 rounded bg-white border border-slate-200 disabled:opacity-40"
                            title="Sang trái"
                          >
                            ◀
                          </button>
                          <button
                            type="button"
                            disabled={mIdx >= curMediaListJa.length - 1}
                            onClick={() => handleMoveMediaItem(safeSelectedIdx, mIdx, 1)}
                            className="px-1.5 py-0.5 rounded bg-white border border-slate-200 disabled:opacity-40"
                            title="Sang phải"
                          >
                            ▶
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveMediaItem(safeSelectedIdx, mIdx)}
                            className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100"
                            title="Xóa mục này"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>

                      {(() => {
                        const isImgUrl =
                          /\.(jpe?g|png|webp|gif|avif|svg)(\?.*)?$/i.test(mItem.url || "") ||
                          /images\.unsplash\.com/i.test(mItem.url || "");
                        const isWebVrItem =
                          !isVid && !isImgUrl && Boolean(mItem.url && /^(https?:\/\/|\/)/i.test(mItem.url.trim()));
                        return (
                          <div className="relative h-36 rounded-lg overflow-hidden bg-slate-900 border border-slate-200">
                            {isVid ? (
                              <video
                                src={mItem.url}
                                poster={mItem.poster || mItem.thumbnail}
                                muted
                                loop
                                playsInline
                                controls
                                className="w-full h-full object-cover"
                              />
                            ) : isWebVrItem ? (
                              mItem.poster || mItem.thumbnail ? (
                                <img
                                  src={mItem.poster || mItem.thumbnail}
                                  alt={mItem.caption || "VR Preview"}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center px-3 text-center text-emerald-300">
                                  <Compass className="w-6 h-6 mb-1 text-emerald-400" />
                                  <span className="text-[11px] font-bold">Link Web VR / AR</span>
                                  <span className="text-[10px] text-slate-400 truncate max-w-full mt-0.5 font-mono">
                                    {mItem.url}
                                  </span>
                                </div>
                              )
                            ) : (
                              <img
                                src={mItem.url}
                                alt={mItem.caption || "Preview"}
                                className="w-full h-full object-cover"
                              />
                            )}
                            {isWebVrItem && (
                              <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-emerald-600/95 text-white text-[10px] font-bold shadow">
                                VR / AR
                              </span>
                            )}
                          </div>
                        );
                      })()}

                      {/* Nút tải file từ máy tính to rõ */}
                      <label className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-slate-800 text-white hover:bg-slate-900 cursor-pointer transition">
                        <Upload className="w-3.5 h-3.5" />
                        <span>
                          {uploadingKey === uploadKey
                            ? "Đang tải tệp lên..."
                            : "📁 Chọn Ảnh / Video từ máy tính"}
                        </span>
                        <input
                          type="file"
                          accept="image/*,video/mp4,video/webm,video/quicktime"
                          className="hidden"
                          disabled={uploadingKey === uploadKey}
                          onChange={async (e) => {
                            const f = e.target.files?.[0];
                            e.target.value = "";
                            if (!f) return;
                            const res = await uploadFileToServer(f, uploadKey);
                            if (res?.url) {
                              handleUpdateMediaItem(safeSelectedIdx, mIdx, {
                                url: res.url,
                                type: res.isVideo
                                  ? "video"
                                  : curPageJa.mediaMode === "vr360"
                                  ? "vr360"
                                  : "image",
                              });
                              toast(
                                res.isVideo
                                  ? "Đã tải video lên thành công!"
                                  : "Đã tải ảnh lên thành công!",
                                "success"
                              );
                            }
                          }}
                        />
                      </label>

                      {(isVid || (!(/\.(jpe?g|png|webp|gif|avif|svg)(\?.*)?$/i.test(mItem.url || "") || /images\.unsplash\.com/i.test(mItem.url || "")) && Boolean(mItem.url && /^(https?:\/\/|\/)/i.test(mItem.url.trim())))) && (
                        <label className="w-full inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer">
                          <Upload className="w-3 h-3" />
                          <span>
                            {uploadingKey === posterKey
                              ? "Đang tải ảnh bìa..."
                              : isVid
                              ? "🖼️ Đổi ảnh bìa (Poster) cho Video"
                              : "🖼️ Đổi ảnh bìa đại diện cho Link VR / AR"}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingKey === posterKey}
                            onChange={async (e) => {
                              const f = e.target.files?.[0];
                              e.target.value = "";
                              if (!f) return;
                              const res = await uploadFileToServer(f, posterKey);
                              if (res?.url) {
                                handleUpdateMediaItem(safeSelectedIdx, mIdx, { poster: res.url });
                                toast("Đã cập nhật ảnh bìa cho video!", "success");
                              }
                            }}
                          />
                        </label>
                      )}

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                          Chú thích hiển thị dưới góc ảnh / video:
                        </label>
                        <input
                          type="text"
                          value={lang === "en" ? mEn.caption || "" : mItem.caption || ""}
                          onChange={(e) =>
                            handleUpdateMediaItem(
                              safeSelectedIdx,
                              mIdx,
                              { caption: e.target.value },
                              lang === "en" ? "en" : "ja"
                            )
                          }
                          placeholder="Ví dụ: 外観パース（昼景）..."
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                          Hoặc dán đường dẫn (Link Ảnh / Video / Link VR·AR index.html):
                        </label>
                        <input
                          type="text"
                          value={mItem.url || ""}
                          onChange={(e) =>
                            handleUpdateMediaItem(safeSelectedIdx, mIdx, { url: e.target.value })
                          }
                          placeholder="VD: https://vr.i8studio.vn/360/AR_JAPAN/index.html"
                          className="w-full px-2.5 py-1 text-[11px] font-mono border border-slate-200 rounded-lg bg-white text-slate-700"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* HỘP 2.5: NỘI DUNG BÊN TRONG CỬA SỔ KHI BẤM "XEM CHI TIẾT" */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5">
              📋 Bước 2.5 — Nội Dung Trong Cửa Sổ Popup Khi Khách Bấm &quot;詳細を見る&quot; (Xem chi tiết)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Đoạn giới thiệu chi tiết đầu cửa sổ Popup:
                </label>
                <textarea
                  rows={3}
                  value={
                    lang === "en"
                      ? curPageEn.detailSummary || ""
                      : curPageJa.detailSummary || ""
                  }
                  onChange={(e) =>
                    handleUpdatePageField(
                      safeSelectedIdx,
                      "detailSummary",
                      lang === "en" ? "en" : "ja",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Chữ trên nút Xem mẫu toàn màn hình trong cửa sổ Popup (Để trống tự động theo loại):
                  </label>
                  <input
                    type="text"
                    value={
                      lang === "en"
                        ? curPageEn.modalPreviewBtnText || ""
                        : curPageJa.modalPreviewBtnText || ""
                    }
                    onChange={(e) =>
                      handleUpdatePageField(
                        safeSelectedIdx,
                        "modalPreviewBtnText",
                        lang === "en" ? "en" : "ja",
                        e.target.value
                      )
                    }
                    placeholder={
                      curPageJa.mediaMode === "vr360"
                        ? "360° VRを全画面で体験"
                        : curPageJa.mediaMode === "movie"
                        ? "サンプル映像を全画面再生"
                        : "サンプル画像をフルサイズで見る"
                    }
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tiêu đề danh mục bàn giao của trang này (Để trống dùng tiêu đề chung):
                  </label>
                  <input
                    type="text"
                    value={
                      lang === "en"
                        ? curPageEn.deliverablesHeading || ""
                        : curPageJa.deliverablesHeading || ""
                    }
                    onChange={(e) =>
                      handleUpdatePageField(
                        safeSelectedIdx,
                        "deliverablesHeading",
                        lang === "en" ? "en" : "ja",
                        e.target.value
                      )
                    }
                    placeholder={infoJa.deliverablesHeading || defaultHeaderJa.deliverablesHeading}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  ✓ Danh sách Hạng mục bàn giao chi tiết ({(curPageJa.deliverables || []).length} hạng mục):
                </label>
                <button
                  type="button"
                  onClick={() => handleAddSpecOrDeliv(safeSelectedIdx, "deliverables")}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm hạng mục bàn giao</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(curPageJa.deliverables || []).map((dlv, dIdx) => (
                  <div
                    key={dIdx}
                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <input
                      type="text"
                      value={lang === "en" ? curPageEn.deliverables?.[dIdx] || "" : dlv}
                      onChange={(e) =>
                        handleUpdateSpecOrDeliv(
                          safeSelectedIdx,
                          dIdx,
                          "deliverables",
                          lang === "en" ? "en" : "ja",
                          e.target.value
                        )
                      }
                      className="flex-1 px-2.5 py-1 text-xs border border-slate-300 rounded bg-white"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteSpecOrDeliv(safeSelectedIdx, dIdx, "deliverables")
                      }
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                      title="Xóa hạng mục"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          PHẦN 3: CÀI ĐẶT NÚT ĐĂNG KÝ TƯ VẤN & HOTLINE DÙNG CHUNG
          ===================================================================== */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-extrabold inline-flex items-center justify-center">
              3
            </span>
            <span>Nút Đăng Ký Tư Vấn, Đường Dẫn Liên Hệ &amp; Số Hotline</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Chỉnh sửa nội dung nút kêu gọi tư vấn và số điện thoại hiển thị bên phải cửa sổ Xem chi tiết của mọi gói giá.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Chữ trên nút Đăng ký tư vấn / Báo giá:
            </label>
            <input
              type="text"
              value={
                lang === "en"
                  ? infoEn.btnConsult ?? defaultHeaderEn.btnConsult
                  : infoJa.btnConsult ?? defaultHeaderJa.btnConsult
              }
              onChange={(e) =>
                setInfoField("btnConsult", lang === "en" ? "en" : "ja", e.target.value)
              }
              className="w-full px-3 py-2 text-xs font-bold border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Dòng số điện thoại / Hotline dưới nút tư vấn:
            </label>
            <input
              type="text"
              value={
                lang === "en"
                  ? infoEn.hotlineText ?? defaultHeaderEn.hotlineText
                  : infoJa.hotlineText ?? defaultHeaderJa.hotlineText
              }
              onChange={(e) =>
                setInfoField("hotlineText", lang === "en" ? "en" : "ja", e.target.value)
              }
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Khi khách bấm nút Tư vấn sẽ chuyển tới đâu?
            </label>
            <div className="flex flex-wrap gap-1.5 mb-1.5">
              <button
                type="button"
                onClick={() => setInfoField("consultHref", "shared", "/ja/contact")}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold border cursor-pointer ${
                  (infoJa.consultHref || "/ja/contact") === "/ja/contact"
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                Trang Liên hệ (/ja/contact)
              </button>
              <button
                type="button"
                onClick={() => setInfoField("consultHref", "shared", "#dang-ky-tu-van")}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold border cursor-pointer ${
                  infoJa.consultHref === "#dang-ky-tu-van"
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                Cuộn xuống cuối trang (#dang-ky-tu-van)
              </button>
            </div>
            <input
              type="text"
              value={infoJa.consultHref ?? "/ja/contact"}
              onChange={(e) => setInfoField("consultHref", "shared", e.target.value)}
              className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Chữ mặc định nút Xem chi tiết (詳細を見る):
            </label>
            <input
              type="text"
              value={
                lang === "en"
                  ? infoEn.btnViewDetail ?? defaultHeaderEn.btnViewDetail
                  : infoJa.btnViewDetail ?? defaultHeaderJa.btnViewDetail
              }
              onChange={(e) =>
                setInfoField("btnViewDetail", lang === "en" ? "en" : "ja", e.target.value)
              }
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tiêu đề mặc định của mục Hạng mục bàn giao:
            </label>
            <input
              type="text"
              value={
                lang === "en"
                  ? infoEn.deliverablesHeading ?? defaultHeaderEn.deliverablesHeading
                  : infoJa.deliverablesHeading ?? defaultHeaderJa.deliverablesHeading
              }
              onChange={(e) =>
                setInfoField("deliverablesHeading", lang === "en" ? "en" : "ja", e.target.value)
              }
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Chữ nút Phóng to ảnh dự án:
            </label>
            <input
              type="text"
              value={
                lang === "en"
                  ? infoEn.btnZoom ?? defaultHeaderEn.btnZoom
                  : infoJa.btnZoom ?? defaultHeaderJa.btnZoom
              }
              onChange={(e) =>
                setInfoField("btnZoom", lang === "en" ? "en" : "ja", e.target.value)
              }
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* =====================================================================
          PHẦN 4: DANH SÁCH DỰ ÁN MẪU THAM KHẢO (HIỂN THỊ CUỐI POPUP XEM CHI TIẾT)
          ===================================================================== */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-extrabold inline-flex items-center justify-center">
                4
              </span>
              <span>
                Danh Sách Dự Án Thực Tế Tham Khảo Trong Cửa Sổ Chi Tiết ({allProjectKeys.length} dự án)
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Phần danh sách công trình thực tế xuất hiện bên dưới cửa sổ khi khách bấm &quot;詳細を見る&quot;. Có thể bật/tắt tùy ý.
            </p>
          </div>

          <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 cursor-pointer text-xs font-bold text-amber-950 shrink-0">
            <input
              type="checkbox"
              checked={infoJa.showReferenceProjects !== false}
              onChange={(e) => setInfoField("showReferenceProjects", "shared", e.target.checked)}
              className="rounded text-amber-600"
            />
            <span>Hiển thị khu vực dự án tham khảo này</span>
          </label>
        </div>

        {infoJa.showReferenceProjects !== false && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tiêu đề khu vực Dự án tham khảo:
                </label>
                <input
                  type="text"
                  value={
                    lang === "en"
                      ? infoEn.projectsHeading ?? defaultHeaderEn.projectsHeading
                      : infoJa.projectsHeading ?? defaultHeaderJa.projectsHeading
                  }
                  onChange={(e) =>
                    setInfoField("projectsHeading", lang === "en" ? "en" : "ja", e.target.value)
                  }
                  className="w-full px-3 py-2 text-xs font-bold border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dòng hướng dẫn nhỏ bên cạnh:
                </label>
                <input
                  type="text"
                  value={
                    lang === "en"
                      ? infoEn.projectsSubheading ?? defaultHeaderEn.projectsSubheading
                      : infoJa.projectsSubheading ?? defaultHeaderJa.projectsSubheading
                  }
                  onChange={(e) =>
                    setInfoField(
                      "projectsSubheading",
                      lang === "en" ? "en" : "ja",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setShowProjectsEditor(!showProjectsEditor)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition cursor-pointer"
              >
                <span>
                  {showProjectsEditor
                    ? "▲ Thu gọn danh sách thẻ dự án mẫu"
                    : `▼ Bấm để mở & chỉnh sửa ${allProjectKeys.length} thẻ dự án mẫu`}
                </span>
              </button>

              <button
                type="button"
                onClick={handleAddProject}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm dự án mẫu</span>
              </button>
            </div>

            {showProjectsEditor && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {allProjectKeys.map((projId) => {
                  const pJa = rawProjectsJa[projId] || defaultProjectsJa[projId] || {};
                  const pEn = rawProjectsEn[projId] || defaultProjectsEn[projId] || {};
                  const isExp = expandedProjectId === projId;
                  const pUploadKey = `proj-${projId}`;
                  const pPosterKey = `proj-poster-${projId}`;
                  const projMediaType: "image" | "video" | "vr360" =
                    pJa.mediaType === "vr360" || Boolean(pJa.vrEmbedUrl && pJa.vrEmbedUrl.trim())
                      ? "vr360"
                      : pJa.mediaType === "video" || /\.(mp4|webm|mov)(\?.*)?$/i.test(pJa.img || "")
                      ? "video"
                      : "image";
                  const isDirectVideoFile = /\.(mp4|webm|mov)(\?.*)?$/i.test(pJa.img || "");

                  return (
                    <div
                      key={projId}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3"
                    >
                      {/* Bộ chọn định dạng dự án: Ảnh / Movie / VR 360° */}
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200/80 flex-wrap">
                        <span className="text-[11px] font-bold text-slate-600">
                          Định dạng hiển thị:
                        </span>
                        <div className="inline-flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                          {[
                            { id: "image", label: "🖼️ Ảnh tĩnh" },
                            { id: "video", label: "🎬 Movie" },
                            { id: "vr360", label: "🌐 VR / AR" },
                          ].map((mOpt) => {
                            const active = projMediaType === mOpt.id;
                            return (
                              <button
                                key={mOpt.id}
                                type="button"
                                onClick={() =>
                                  handlePatchProjectShared(projId, { mediaType: mOpt.id })
                                }
                                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                                  active
                                    ? "bg-amber-500 text-white shadow-xs"
                                    : "text-slate-600 hover:bg-slate-100"
                                }`}
                              >
                                {mOpt.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-28 shrink-0 space-y-1.5">
                          <div className="w-28 h-20 rounded-lg overflow-hidden bg-slate-900 border border-slate-200 relative group">
                            {projMediaType === "video" && isDirectVideoFile ? (
                              <video
                                src={pJa.img}
                                poster={pJa.poster}
                                muted
                                loop
                                playsInline
                                autoPlay
                                className="w-full h-full object-cover"
                              />
                            ) : (pJa.img || pJa.poster) && (/(\.(jpe?g|png|webp|gif|avif|svg)(\?.*)?$|images\.unsplash\.com)/i.test((projMediaType === "video" && pJa.poster ? pJa.poster : pJa.img) || "")) ? (
                              <img
                                src={projMediaType === "video" && pJa.poster ? pJa.poster : pJa.img}
                                alt={pJa.title || "Project"}
                                className="w-full h-full object-cover"
                              />
                            ) : (pJa.vrEmbedUrl || pJa.img) ? (
                              <div className="w-full h-full flex flex-col items-center justify-center text-[9px] text-emerald-300 text-center px-1">
                                <Compass className="w-4 h-4 mb-0.5 text-emerald-400" />
                                <span className="font-bold">Web VR/AR</span>
                              </div>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                                Chưa có tệp
                              </div>
                            )}

                            {projMediaType === "video" && (
                              <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-rose-600/90 text-white text-[9px] font-extrabold">
                                MOVIE
                              </span>
                            )}
                            {projMediaType === "vr360" && (
                              <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-sky-600/90 text-white text-[9px] font-extrabold">
                                VR 360°
                              </span>
                            )}

                            <label className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[10px] font-bold cursor-pointer transition text-center px-1">
                              <Upload className="w-3.5 h-3.5 mb-0.5" />
                              <span>
                                {uploadingKey === pUploadKey
                                  ? "Đang tải..."
                                  : projMediaType === "video"
                                  ? "Đổi Movie"
                                  : projMediaType === "vr360"
                                  ? "Đổi ảnh 360°"
                                  : "Đổi ảnh / Movie"}
                              </span>
                              <input
                                type="file"
                                accept="image/*,video/mp4,video/webm,video/quicktime"
                                className="hidden"
                                disabled={uploadingKey === pUploadKey}
                                onChange={async (e) => {
                                  const f = e.target.files?.[0];
                                  e.target.value = "";
                                  if (!f) return;
                                  const res = await uploadFileToServer(f, pUploadKey);
                                  if (res?.url) {
                                    const nextType = res.isVideo
                                      ? "video"
                                      : projMediaType === "vr360"
                                      ? "vr360"
                                      : "image";
                                    handlePatchProjectShared(projId, {
                                      img: res.url,
                                      mediaType: nextType,
                                    });
                                    toast(
                                      res.isVideo
                                        ? "Đã tải Movie cho dự án!"
                                        : nextType === "vr360"
                                        ? "Đã tải ảnh VR 360° cho dự án!"
                                        : "Đã đổi ảnh dự án tham khảo!",
                                      "success"
                                    );
                                  }
                                }}
                              />
                            </label>
                          </div>

                          <label className="w-full inline-flex items-center justify-center gap-1 px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-bold cursor-pointer transition">
                            <Upload className="w-3 h-3" />
                            <span>
                              {uploadingKey === pUploadKey
                                ? "Đang tải..."
                                : projMediaType === "video"
                                ? "Tải Movie"
                                : projMediaType === "vr360"
                                ? "Tải VR 360°"
                                : "Đổi tệp"}
                            </span>
                            <input
                              type="file"
                              accept="image/*,video/mp4,video/webm,video/quicktime"
                              className="hidden"
                              disabled={uploadingKey === pUploadKey}
                              onChange={async (e) => {
                                const f = e.target.files?.[0];
                                e.target.value = "";
                                if (!f) return;
                                const res = await uploadFileToServer(f, pUploadKey);
                                if (res?.url) {
                                  const nextType = res.isVideo
                                    ? "video"
                                    : projMediaType === "vr360"
                                    ? "vr360"
                                    : "image";
                                  handlePatchProjectShared(projId, {
                                    img: res.url,
                                    mediaType: nextType,
                                  });
                                  toast(
                                    res.isVideo
                                      ? "Đã tải Movie cho dự án!"
                                      : nextType === "vr360"
                                      ? "Đã tải ảnh VR 360° cho dự án!"
                                      : "Đã đổi ảnh dự án tham khảo!",
                                    "success"
                                  );
                                }
                              }}
                            />
                          </label>
                        </div>

                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <input
                              type="text"
                              value={pJa.title || ""}
                              onChange={(e) =>
                                handleUpdateProject(projId, "title", "shared", e.target.value)
                              }
                              className="flex-1 px-2.5 py-1 text-xs font-extrabold border border-slate-300 rounded bg-white"
                              placeholder="Tên dự án..."
                            />
                            <button
                              type="button"
                              onClick={() => handleDeleteProject(projId)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                              title="Xóa dự án"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-1.5">
                            <input
                              type="text"
                              value={(lang === "en" ? pEn.catTag : pJa.catTag) || ""}
                              onChange={(e) =>
                                handleUpdateProject(
                                  projId,
                                  "catTag",
                                  lang === "en" ? "en" : "ja",
                                  e.target.value
                                )
                              }
                              placeholder="Loại hình (VD: 高級ヴィラ)"
                              className="px-2 py-1 text-[11px] border border-slate-300 rounded bg-white"
                            />
                            <input
                              type="text"
                              value={(lang === "en" ? pEn.loc : pJa.loc) || ""}
                              onChange={(e) =>
                                handleUpdateProject(
                                  projId,
                                  "loc",
                                  lang === "en" ? "en" : "ja",
                                  e.target.value
                                )
                              }
                              placeholder="Địa điểm · Diện tích"
                              className="px-2 py-1 text-[11px] border border-slate-300 rounded bg-white"
                            />
                          </div>

                          <input
                            type="text"
                            value={pJa.priceValue || pJa.priceEstimate || ""}
                            onChange={(e) => {
                              handlePatchProjectShared(projId, {
                                priceValue: e.target.value,
                                priceEstimate: e.target.value,
                              });
                            }}
                            placeholder="Giá tham khảo (VD: ¥2,500,000〜)"
                            className="w-full px-2.5 py-1 text-xs font-bold text-amber-800 border border-amber-300 rounded bg-white"
                          />
                        </div>
                      </div>

                      {/* Cài đặt bổ sung khi chọn Movie hoặc VR 360° */}
                      {projMediaType === "video" && (
                        <div className="p-2.5 rounded-lg bg-rose-50/60 border border-rose-200 space-y-2">
                          <div>
                            <label className="block text-[10px] font-bold text-rose-900 mb-0.5">
                              🎬 Đường dẫn Video / YouTube / Vimeo (Hoặc bấm nút &quot;Tải Movie&quot; ở trên để chọn file MP4 từ máy):
                            </label>
                            <input
                              type="text"
                              value={pJa.img || ""}
                              onChange={(e) =>
                                handlePatchProjectShared(projId, {
                                  img: e.target.value,
                                  mediaType: "video",
                                })
                              }
                              placeholder="https://... (.mp4, YouTube, Vimeo)"
                              className="w-full px-2.5 py-1 text-[11px] font-mono bg-white border border-rose-200 rounded"
                            />
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-semibold text-slate-600">
                              Ảnh bìa (Poster) cho Movie (tùy chọn):
                            </span>
                            <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-slate-300 text-[10px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer">
                              <Upload className="w-3 h-3" />
                              <span>
                                {uploadingKey === pPosterKey ? "Đang tải..." : "🖼️ Tải ảnh bìa"}
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={uploadingKey === pPosterKey}
                                onChange={async (e) => {
                                  const f = e.target.files?.[0];
                                  e.target.value = "";
                                  if (!f) return;
                                  const res = await uploadFileToServer(f, pPosterKey);
                                  if (res?.url) {
                                    handlePatchProjectShared(projId, { poster: res.url });
                                    toast("Đã cập nhật ảnh bìa Movie!", "success");
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      )}

                      {projMediaType === "vr360" && (
                        <div className="p-2.5 rounded-lg bg-sky-50/70 border border-sky-200 space-y-2">
                          <div>
                            <label className="block text-[10px] font-bold text-sky-950 mb-0.5">
                              🌐 Link Web VR / AR (Hỗ trợ vr.i8studio.vn/.../index.html, Matterport, Kuula — Hoặc bỏ trống nếu dùng ảnh Panorama 360° ở trên):
                            </label>
                            <input
                              type="text"
                              value={pJa.vrEmbedUrl || ""}
                              onChange={(e) =>
                                handlePatchProjectShared(projId, {
                                  vrEmbedUrl: e.target.value,
                                  mediaType: "vr360",
                                })
                              }
                              placeholder="VD: https://vr.i8studio.vn/360/AR_JAPAN/index.html"
                              className="w-full px-2.5 py-1 text-[11px] font-mono bg-white border border-sky-200 rounded"
                            />
                          </div>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => setExpandedProjectId(isExp ? null : projId)}
                        className="w-full py-1 text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer"
                      >
                        {isExp ? "▲ Thu gọn mô tả chi tiết" : "▼ Sửa thêm mô tả chi tiết dự án"}
                      </button>

                      {isExp && (
                        <div className="space-y-2 pt-1">
                          <label className="block text-[11px] font-semibold text-slate-600">
                            Mô tả dự án khi khách bấm vào xem:
                          </label>
                          <textarea
                            rows={3}
                            value={
                              (lang === "en"
                                ? pEn.detailContent || pEn.narrative
                                : pJa.detailContent || pJa.narrative) || ""
                            }
                            onChange={(e) => {
                              const k = lang === "en" ? "en" : "ja";
                              handleUpdateProject(projId, "narrative", k, e.target.value);
                              handleUpdateProject(projId, "detailContent", k, e.target.value);
                            }}
                            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}


/* -------------------------------------------------------------------------
   10. CTA SECTION FORM (Kêu gọi hành động / Sustainable Design)
   ------------------------------------------------------------------------- */
function CtaForm({
  lang,
  contentJa,
  contentEn,
  updateField,
}: {
  lang: "ja" | "en" | "both";
  contentJa: any;
  contentEn: any;
  updateField: (lang: "en" | "ja", path: string[], value: any) => void;
}) {
  const { toast } = useToast();
  const [uploadingImg, setUploadingImg] = useState(false);

  const ja = contentJa || {};
  const en = contentEn || {};

  const handleUpdate = (field: string, langKey: "ja" | "en", val: any) => {
    updateField(langKey, [field], val);
    if (field === "image" || field === "btnHref" || field === "card1Href" || field === "card2Href") {
      updateField(langKey === "ja" ? "en" : "ja", [field], val);
    }
  };

  const handleUploadImage = async (file: File) => {
    try {
      setUploadingImg(true);
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        if (data?.url) {
          handleUpdate("image", "ja", data.url);
          toast("Tải ảnh kiến trúc thành công!", "success");
        }
      } else {
        toast("Lỗi tải ảnh lên máy chủ", "error");
      }
    } catch {
      toast("Có lỗi xảy ra khi tải ảnh", "error");
    } finally {
      setUploadingImg(false);
    }
  };

  const heroImg = ja.image || en.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85";

  return (
    <div className="space-y-8">
      {/* 1. Slogan kiến trúc (Tiêu đề chính của Section CTA) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
            <span>Câu Slogan kiến trúc (Tiêu đề chính)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Đã bỏ phần tiêu đề 2 dòng cũ theo yêu cầu. Câu slogan dưới đây sẽ hiển thị to và nổi bật với kích thước lớn như tiêu đề chính của Section CTA.
          </p>
        </div>

        {/* 1 Câu Slogan (Tiêu đề chính) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(lang === "ja" || lang === "both") && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Câu Slogan [JA / VI]:
              </label>
              <input
                type="text"
                value={ja.slogan ?? ja.subTitle ?? "Enduring Beauty."}
                onChange={(e) => handleUpdate("slogan", "ja", e.target.value)}
                className="w-full px-3 py-2 text-sm font-medium border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enduring Beauty."
              />
            </div>
          )}

          {(lang === "en" || lang === "both") && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Câu Slogan [EN]:
              </label>
              <input
                type="text"
                value={en.slogan ?? en.subTitle ?? "Enduring Beauty."}
                onChange={(e) => handleUpdate("slogan", "en", e.target.value)}
                className="w-full px-3 py-2 text-sm font-medium border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enduring Beauty."
              />
            </div>
          )}
        </div>
      </div>

      {/* 2. Nút CTA Button */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 inline-block"></span>
            <span>Nút bấm Kêu gọi hành động (CTA Button)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Nút bấm nổi bật ngay dưới câu slogan dẫn khách hàng đến trang liên hệ hoặc biểu mẫu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nhãn nút bấm (Text):
            </label>
            <input
              type="text"
              value={ja.btnText ?? en.btnText ?? "Contact"}
              onChange={(e) => {
                handleUpdate("btnText", "ja", e.target.value);
                handleUpdate("btnText", "en", e.target.value);
              }}
              className="w-full px-3 py-2 text-sm font-bold border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="Contact"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Đường dẫn liên kết (Href):
            </label>
            <input
              type="text"
              value={ja.btnHref ?? en.btnHref ?? "/ja/contact"}
              onChange={(e) => {
                handleUpdate("btnHref", "ja", e.target.value);
                handleUpdate("btnHref", "en", e.target.value);
              }}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="/ja/contact"
            />
          </div>
        </div>
      </div>

      {/* 3. 4 Card Contact ở dưới */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block"></span>
            <span>4 Card Thông tin Liên hệ (Icon chuẩn SVG)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            4 khối liên hệ gồm Hotline, Email, Hỗ trợ và Văn phòng Studio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Hotline */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700">
              <Phone size={15} />
              <span>Card 1: Hotline / Điện thoại</span>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Nhãn thẻ:</label>
              <input
                type="text"
                value={ja.card1Label ?? "Hotline / お電話窓口"}
                onChange={(e) => handleUpdate("card1Label", "ja", e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                placeholder="Hotline / お電話窓口"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Số điện thoại hiển thị:</label>
              <input
                type="text"
                value={ja.card1Val ?? "0984 384 190"}
                onChange={(e) => handleUpdate("card1Val", "ja", e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs font-bold font-mono border border-slate-300 rounded-lg bg-white"
                placeholder="0984 384 190"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Link gọi điện:</label>
              <input
                type="text"
                value={ja.card1Href ?? "tel:0984384190"}
                onChange={(e) => handleUpdate("card1Href", "ja", e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded-lg bg-white"
                placeholder="tel:0984384190"
              />
            </div>
          </div>

          {/* Card 2: Email */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700">
              <Mail size={15} />
              <span>Card 2: Email tiếp nhận</span>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Nhãn thẻ:</label>
              <input
                type="text"
                value={ja.card2Label ?? "Email / メール受付"}
                onChange={(e) => handleUpdate("card2Label", "ja", e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                placeholder="Email / メール受付"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Địa chỉ Email hiển thị:</label>
              <input
                type="text"
                value={ja.card2Val ?? "info@i8studio.vn"}
                onChange={(e) => handleUpdate("card2Val", "ja", e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs font-bold font-mono border border-slate-300 rounded-lg bg-white"
                placeholder="info@i8studio.vn"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Link gửi thư:</label>
              <input
                type="text"
                value={ja.card2Href ?? "mailto:info@i8studio.vn"}
                onChange={(e) => handleUpdate("card2Href", "ja", e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded-lg bg-white"
                placeholder="mailto:info@i8studio.vn"
              />
            </div>
          </div>

          {/* Card 3: Support */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700">
              <Clock size={15} />
              <span>Card 3: Thời gian hỗ trợ</span>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Nhãn thẻ:</label>
              <input
                type="text"
                value={ja.card3Label ?? "Support / 相談対応"}
                onChange={(e) => handleUpdate("card3Label", "ja", e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                placeholder="Support / 相談対応"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Mô tả phản hồi:</label>
              <input
                type="text"
                value={ja.card3Val ?? "24時間以内返答・土日祝相談可能"}
                onChange={(e) => handleUpdate("card3Val", "ja", e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs font-medium border border-slate-300 rounded-lg bg-white"
                placeholder="24時間以内返答・土日祝相談可能"
              />
            </div>
          </div>

          {/* Card 4: Studio */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700">
              <MapPin size={15} />
              <span>Card 4: Địa điểm Studio</span>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Nhãn thẻ:</label>
              <input
                type="text"
                value={ja.card4Label ?? "Studio / 拠点"}
                onChange={(e) => handleUpdate("card4Label", "ja", e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                placeholder="Studio / 拠点"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Địa điểm văn phòng:</label>
              <input
                type="text"
                value={ja.card4Val ?? "Tokyo & Ho Chi Minh City"}
                onChange={(e) => handleUpdate("card4Val", "ja", e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs font-medium border border-slate-300 rounded-lg bg-white"
                placeholder="Tokyo & Ho Chi Minh City"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Ảnh kiến trúc bên phải */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>Hình ảnh Kiến trúc Biệt thự (Cột bên phải)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Hình ảnh tràn viền, góc phẳng sắc nét không bo góc ở cột bên phải. Khuyến nghị ảnh chụp kiến trúc độ phân giải cao tỉ lệ dọc hoặc vuông.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-5 items-start">
          {/* Preview ảnh */}
          <div className="w-full sm:w-64 h-64 border border-slate-200 bg-slate-900 rounded-none overflow-hidden shrink-0 relative flex items-center justify-center">
            {heroImg ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroImg}
                alt="Architectural Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs text-slate-400">Chưa có ảnh</span>
            )}
          </div>

          <div className="flex-1 space-y-3 w-full">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Đường dẫn hình ảnh (URL):
              </label>
              <input
                type="text"
                value={heroImg}
                onChange={(e) => handleUpdate("image", "ja", e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer transition shadow-sm">
                <Upload size={14} />
                <span>{uploadingImg ? "Đang tải ảnh..." : "Tải ảnh từ máy tính"}</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingImg}
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUploadImage(f);
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// ============================================================================
// PARTNERS FORM (08. Thương hiệu & Đối tác)
// ============================================================================
function PartnersForm({
  lang,
  contentJa,
  contentEn,
  updateField,
}: {
  lang: "ja" | "en" | "both";
  contentJa: any;
  contentEn: any;
  updateField: (lang: "en" | "ja", path: string[], value: any) => void;
}) {
  const { toast } = useToast();

  // 1. Quản lý Thẻ chỉ số quy mô (Stats Cards)
  const rawStatsJa: any[] = Array.isArray(contentJa?.stats) && contentJa.stats.length > 0
    ? contentJa.stats
    : (Array.isArray(contentJa?.partners?.stats) && contentJa.partners.stats.length > 0
      ? contentJa.partners.stats
      : getDefaultPartnerStats("ja"));
  const rawStatsEn: any[] = Array.isArray(contentEn?.stats) && contentEn.stats.length > 0
    ? contentEn.stats
    : (Array.isArray(contentEn?.partners?.stats) && contentEn.partners.stats.length > 0
      ? contentEn.partners.stats
      : getDefaultPartnerStats("en"));

  const statsCount = Math.max(rawStatsJa.length, rawStatsEn.length);
  const normalizedStatsJa = Array.from({ length: statsCount }, (_, i) => rawStatsJa[i] || { num: "100+", name: "新規項目", desc: "説明文" });
  const normalizedStatsEn = Array.from({ length: statsCount }, (_, i) => rawStatsEn[i] || { num: normalizedStatsJa[i]?.num || "100+", name: "New Category", desc: "Description" });

  const handleUpdateStatField = (idx: number, field: string, langKey: "ja" | "en", val: any) => {
    if (langKey === "ja") {
      const updated = [...normalizedStatsJa];
      updated[idx] = { ...updated[idx], [field]: val };
      updateField("ja", ["stats"], updated);
      if (field === "num") {
        const updatedEn = [...normalizedStatsEn];
        updatedEn[idx] = { ...updatedEn[idx], num: val };
        updateField("en", ["stats"], updatedEn);
      }
    } else {
      const updated = [...normalizedStatsEn];
      updated[idx] = { ...updated[idx], [field]: val };
      updateField("en", ["stats"], updated);
      if (field === "num") {
        const updatedJa = [...normalizedStatsJa];
        updatedJa[idx] = { ...updatedJa[idx], num: val };
        updateField("ja", ["stats"], updatedJa);
      }
    }
  };

  const handleAddStat = () => {
    const newJa = { num: "50+", name: "Phân khúc mới", desc: "Mô tả phân khúc đối tác & dự án tiêu biểu" };
    const newEn = { num: "50+", name: "New Category", desc: "High-end clients and partner network" };
    updateField("ja", ["stats"], [...normalizedStatsJa, newJa]);
    updateField("en", ["stats"], [...normalizedStatsEn, newEn]);
    toast("Đã thêm thẻ chỉ số quy mô mới!", "success");
  };

  const handleDeleteStat = (idx: number) => {
    if (statsCount <= 1) {
      toast("Phải giữ lại ít nhất 1 thẻ chỉ số", "info");
      return;
    }
    const updatedJa = normalizedStatsJa.filter((_, i) => i !== idx);
    const updatedEn = normalizedStatsEn.filter((_, i) => i !== idx);
    updateField("ja", ["stats"], updatedJa);
    updateField("en", ["stats"], updatedEn);
    toast("Đã xóa thẻ chỉ số quy mô", "info");
  };

  // 2. Quản lý Thương hiệu Marquee (Partner Brands)
  const rawBrandsJa: any[] = Array.isArray(contentJa?.brands) && contentJa.brands.length > 0
    ? contentJa.brands
    : (Array.isArray(contentJa?.partners?.brands) && contentJa.partners.brands.length > 0
      ? contentJa.partners.brands
      : getDefaultPartnerBrands("ja"));
  const rawBrandsEn: any[] = Array.isArray(contentEn?.brands) && contentEn.brands.length > 0
    ? contentEn.brands
    : (Array.isArray(contentEn?.partners?.brands) && contentEn.partners.brands.length > 0
      ? contentEn.partners.brands
      : getDefaultPartnerBrands("en"));

  const brandsCount = Math.max(rawBrandsJa.length, rawBrandsEn.length);
  const normalizedBrandsJa = Array.from({ length: brandsCount }, (_, i) => rawBrandsJa[i] || {
    name: "TÊN ĐỐI TÁC",
    sub: "Lĩnh vực",
    img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80",
  });
  const normalizedBrandsEn = Array.from({ length: brandsCount }, (_, i) => rawBrandsEn[i] || {
    name: normalizedBrandsJa[i]?.name || "PARTNER BRAND",
    sub: "Industry",
    img: normalizedBrandsJa[i]?.img || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80",
  });

  const handleUpdateBrandField = (idx: number, field: string, langKey: "ja" | "en", val: any) => {
    const syncAcrossLangs = field === "img" || field === "name" || field === "textColor";
    if (langKey === "ja") {
      const updated = [...normalizedBrandsJa];
      updated[idx] = { ...updated[idx], [field]: val };
      updateField("ja", ["brands"], updated);
      if (syncAcrossLangs) {
        const updatedEn = [...normalizedBrandsEn];
        updatedEn[idx] = { ...updatedEn[idx], [field]: val };
        updateField("en", ["brands"], updatedEn);
      }
    } else {
      const updated = [...normalizedBrandsEn];
      updated[idx] = { ...updated[idx], [field]: val };
      updateField("en", ["brands"], updated);
      if (syncAcrossLangs) {
        const updatedJa = [...normalizedBrandsJa];
        updatedJa[idx] = { ...updatedJa[idx], [field]: val };
        updateField("ja", ["brands"], updatedJa);
      }
    }
  };

  const globalBrandNameColor =
    contentJa?.info?.brandNameColor ??
    contentEn?.info?.brandNameColor ??
    "";

  const handleUpdateGlobalBrandColor = (val: string) => {
    updateField("ja", ["info", "brandNameColor"], val);
    updateField("en", ["info", "brandNameColor"], val);
  };

  const handleAddBrand = () => {
    const newJa = {
      name: "ĐỐI TÁC MỚI",
      sub: "Lĩnh vực hoạt động",
      img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
    };
    const newEn = {
      name: "NEW PARTNER",
      sub: "Industry & Scope",
      img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
    };
    updateField("ja", ["brands"], [...normalizedBrandsJa, newJa]);
    updateField("en", ["brands"], [...normalizedBrandsEn, newEn]);
    toast("Đã thêm đối tác mới vào dải Marquee!", "success");
  };

  const handleDeleteBrand = (idx: number) => {
    if (brandsCount <= 1) {
      toast("Phải giữ lại ít nhất 1 thương hiệu", "info");
      return;
    }
    const updatedJa = normalizedBrandsJa.filter((_, i) => i !== idx);
    const updatedEn = normalizedBrandsEn.filter((_, i) => i !== idx);
    updateField("ja", ["brands"], updatedJa);
    updateField("en", ["brands"], updatedEn);
    toast("Đã xóa thương hiệu khỏi dải Marquee", "info");
  };

  const handleUploadBrandImage = async (idx: number, file: File) => {
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        if (data?.url) {
          handleUpdateBrandField(idx, "img", "ja", data.url);
          toast("Tải ảnh đối tác thành công!", "success");
        }
      } else {
        toast("Lỗi tải ảnh lên máy chủ", "error");
      }
    } catch (err) {
      toast("Có lỗi xảy ra khi tải ảnh", "error");
    }
  };

  return (
    <div className="space-y-10">
      {/* 1. Header Information */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Building2 size={18} className="text-amber-600" />
            <span>Tiêu đề phân khúc Đối tác & Khách hàng</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Chỉnh sửa tiêu đề chính hiển thị trên dải nền sáng của trang chủ (Ví dụ: &quot;250+ PARTNERS &amp; CLIENTS NATIONWIDE&quot;).
          </p>
        </div>

        <BilingualField
          label="Tiêu đề chính (Section Title)"
          path={["info", "title"]}
          contentJa={contentJa}
          contentEn={contentEn}
          updateField={updateField}
          activeLang={lang}
        />
      </div>

      {/* 2. Thống kê Quy mô 4 Thẻ (Stats Cards) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
              <span>4 Thẻ Chỉ số Quy mô &amp; Phân khúc ({statsCount} thẻ)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Các khối thẻ trắng nổi bật hiển thị con số thống kê và phân khúc đối tượng phục vụ.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddStat}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm transition"
          >
            <Plus size={15} />
            <span>Thêm thẻ chỉ số</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Array.from({ length: statsCount }).map((_, idx) => {
            const jaItem = normalizedStatsJa[idx] || {};
            const enItem = normalizedStatsEn[idx] || {};

            return (
              <div
                key={`stat-${idx}`}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-amber-200 transition space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-100 px-2 py-0.5 rounded">
                    Thẻ chỉ số #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteStat(idx)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Xóa thẻ này"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Số liệu nổi bật */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Con số nổi bật (Ví dụ: 120+, 45+, 60+...)
                  </label>
                  <input
                    type="text"
                    value={jaItem.num || enItem.num || ""}
                    onChange={(e) => handleUpdateStatField(idx, "num", "ja", e.target.value)}
                    className="w-full px-3 py-2 text-sm font-bold text-amber-900 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="120+"
                  />
                </div>

                {/* Tên phân khúc */}
                <div className="grid grid-cols-1 gap-2">
                  {(lang === "ja" || lang === "both") && (
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Tên phân khúc [JA / VI]:
                      </label>
                      <input
                        type="text"
                        value={jaItem.name || ""}
                        onChange={(e) => handleUpdateStatField(idx, "name", "ja", e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Luxury Villas & Residences"
                      />
                    </div>
                  )}
                  {(lang === "en" || lang === "both") && (
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Tên phân khúc [EN]:
                      </label>
                      <input
                        type="text"
                        value={enItem.name || ""}
                        onChange={(e) => handleUpdateStatField(idx, "name", "en", e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Luxury Villas & Residences"
                      />
                    </div>
                  )}
                </div>

                {/* Mô tả chi tiết */}
                <div className="grid grid-cols-1 gap-2">
                  {(lang === "ja" || lang === "both") && (
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Mô tả tóm tắt [JA / VI]:
                      </label>
                      <textarea
                        rows={2}
                        value={jaItem.desc || ""}
                        onChange={(e) => handleUpdateStatField(idx, "desc", "ja", e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Mô tả phân khúc gia chủ, đối tác..."
                      />
                    </div>
                  )}
                  {(lang === "en" || lang === "both") && (
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Mô tả tóm tắt [EN]:
                      </label>
                      <textarea
                        rows={2}
                        value={enItem.desc || ""}
                        onChange={(e) => handleUpdateStatField(idx, "desc", "en", e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="High-end private homeowners across prime locations..."
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Danh sách Thương hiệu đối tác chạy Marquee (Partner Brands) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              <span>Dải Marquee Thương hiệu Đối tác ({brandsCount} đối tác)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Danh sách các thương hiệu chuyển động ngang vô tận. Bạn có thể thêm, sửa tên, đổi màu chữ và tải ảnh nền/dự án của từng đối tác.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddBrand}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition"
          >
            <Plus size={15} />
            <span>Thêm thương hiệu đối tác</span>
          </button>
        </div>

        {/* Cài đặt Màu chữ Tên thương hiệu mặc định (Áp dụng chung) */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-800">
              🎨 Màu chữ Tên thương hiệu mặc định (Áp dụng chung cho các thẻ):
            </label>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Nhập mã màu Hex (ví dụ: <code className="font-mono text-slate-700">#000000</code> hoặc <code className="font-mono text-slate-700">#FFFFFF</code>) hoặc chọn trên bảng màu. Từng đối tác bên dưới cũng có thể đổi màu riêng.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="color"
              value={/^#([0-9a-fA-F]{6})$/.test(globalBrandNameColor.trim()) ? globalBrandNameColor.trim() : "#ffffff"}
              onChange={(e) => handleUpdateGlobalBrandColor(e.target.value)}
              className="w-9 h-8 p-0.5 rounded border border-slate-300 bg-white cursor-pointer"
              title="Chọn màu chữ tên thương hiệu"
            />
            <input
              type="text"
              value={globalBrandNameColor}
              onChange={(e) => handleUpdateGlobalBrandColor(e.target.value)}
              placeholder="#FFFFFF hoặc #000000"
              className="w-40 px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div className="flex items-center gap-1">
              {["#FFFFFF", "#000000", "#F59E0B", "#1E293B"].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleUpdateGlobalBrandColor(preset)}
                  className="w-6 h-6 rounded-md border border-slate-300 shadow-2xs transition hover:scale-105"
                  style={{ backgroundColor: preset }}
                  title={`Chọn nhanh ${preset}`}
                />
              ))}
              {globalBrandNameColor && (
                <button
                  type="button"
                  onClick={() => handleUpdateGlobalBrandColor("")}
                  className="px-2 py-1 text-[11px] text-slate-600 hover:text-red-600 bg-white border border-slate-200 rounded-md"
                >
                  Mặc định
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: brandsCount }).map((_, idx) => {
            const jaItem = normalizedBrandsJa[idx] || {};
            const enItem = normalizedBrandsEn[idx] || {};

            return (
              <div
                key={`brand-${idx}`}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-emerald-300 transition space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded">
                    Đối tác #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteBrand(idx)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Xóa thương hiệu này"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Preview và Tải ảnh */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hình ảnh nền / Logo đối tác:
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 bg-slate-900 shrink-0 relative flex items-center justify-center">
                      {jaItem.img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={jaItem.img}
                          alt={jaItem.name || "Brand"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building2 size={24} className="text-slate-500" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <input
                        type="text"
                        value={jaItem.img || enItem.img || ""}
                        onChange={(e) => handleUpdateBrandField(idx, "img", "ja", e.target.value)}
                        className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        placeholder="https://... hoặc tải ảnh"
                      />
                      <label className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded cursor-pointer transition">
                        <Upload size={12} />
                        <span>Tải ảnh lên</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadBrandImage(idx, file);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Tên thương hiệu */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tên thương hiệu (Ví dụ: MASTERISE HOMES):
                  </label>
                  <input
                    type="text"
                    value={jaItem.name || enItem.name || ""}
                    onChange={(e) => handleUpdateBrandField(idx, "name", "ja", e.target.value)}
                    className="w-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="MASTERISE HOMES"
                  />
                </div>

                {/* Màu chữ Tên thương hiệu riêng cho đối tác */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Màu chữ Tên thương hiệu (Ví dụ: #000000):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={
                        /^#([0-9a-fA-F]{6})$/.test(String(jaItem.textColor || enItem.textColor || globalBrandNameColor || "").trim())
                          ? String(jaItem.textColor || enItem.textColor || globalBrandNameColor).trim()
                          : "#ffffff"
                      }
                      onChange={(e) => handleUpdateBrandField(idx, "textColor", "ja", e.target.value)}
                      className="w-8 h-8 p-0.5 rounded border border-slate-300 bg-white cursor-pointer shrink-0"
                      title="Chọn màu chữ cho tên thương hiệu này"
                    />
                    <input
                      type="text"
                      value={jaItem.textColor ?? enItem.textColor ?? ""}
                      onChange={(e) => handleUpdateBrandField(idx, "textColor", "ja", e.target.value)}
                      placeholder={globalBrandNameColor ? `Mặc định chung (${globalBrandNameColor})` : "Ví dụ: #000000 hoặc #FFFFFF"}
                      className="flex-1 px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    {(jaItem.textColor || enItem.textColor) && (
                      <button
                        type="button"
                        onClick={() => handleUpdateBrandField(idx, "textColor", "ja", "")}
                        className="px-2 py-1 text-[10px] text-slate-500 hover:text-red-600 bg-white border border-slate-200 rounded"
                        title="Xóa màu riêng, dùng màu chung"
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
