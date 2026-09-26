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
} from "lucide-react";
import {
  getDeliverableCollections,
  getApplicationCards,
  getDefaultApplicationCategories,
  getDefaultPartnerStats,
  getDefaultPartnerBrands,
  getDefaultGalleryTabs,
  getGalleryProjectsData,
  getDefaultPricingTiers,
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
    label: "02. Nỗi đau & Thách thức",
    subLabel: "4 Vấn đề trở ngại của gia chủ",
    anchor: "#quy-trinh",
  },
  workflow: {
    key: "workflow",
    order: 3,
    label: "03. Quy trình 5 bước",
    subLabel: "Lộ trình kiểm soát tiến độ & thiết kế",
    anchor: "#dich-vu",
  },
  deliverables: {
    key: "deliverables",
    order: 4,
    label: "04. Hồ sơ bàn giao",
    subLabel: "Chi tiết các bộ sưu tập hồ sơ kỹ thuật",
    anchor: "#bo-suu-tap",
  },
  "services-bento": {
    key: "services-bento",
    order: 5,
    label: "05. Trụ cột Bento",
    subLabel: "Các khối năng lực dịch vụ kiến trúc & 3D",
    anchor: "#dich-vu",
  },
  clients: {
    key: "clients",
    order: 6,
    label: "06. Đối tác & Uy tín",
    subLabel: "Cam kết tiêu chuẩn & niềm tin",
    anchor: "#doi-tac",
  },
  applications: {
    key: "applications",
    order: 7,
    label: "07. Ứng dụng thực tế",
    subLabel: "Giải pháp theo từng đối tượng kiến trúc",
    anchor: "#ung-dung-thuc-te",
  },
  partners: {
    key: "partners",
    order: 8,
    label: "08. Thương hiệu & Đối tác",
    subLabel: "Thống kê quy mô & Logo marquee",
    anchor: "#khach-hang",
  },
  gallery: {
    key: "gallery",
    order: 9,
    label: "09. Triển lãm dự án",
    subLabel: "Showcase các dự án thực tế tiêu biểu",
    anchor: "#du-an",
  },
  pricing: {
    key: "pricing",
    order: 10,
    label: "10. Báo giá minh bạch",
    subLabel: "3 Gói dịch vụ & Cam kết thi công",
    anchor: "#bao-gia",
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

  const fetchSectionData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/landing-page/${sectionKey}`, { cache: "no-store" });
      const data = await res.json();
      if (data.success && data.data) {
        setContentEn(data.data.contentEn);
        setContentJa(data.data.contentJa);
        setUpdatedAt(data.data.updatedAt || null);
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

          {sectionKey === "services-bento" && (
            <ServicesBentoForm
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
            />
          )}

          {sectionKey === "pricing" && (
            <PricingForm
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
}) {
  const getVal = (obj: any) => {
    let cur = obj;
    for (const p of path) {
      if (!cur) return "";
      cur = cur[p];
    }
    return cur || "";
  };

  const valJa = getVal(contentJa);
  const valEn = getVal(contentEn);

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
  return (
    <div className="space-y-6">
      {/* Khối Tiêu đề chính & Slogan */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Sparkles size={18} className="text-amber-500" />
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
            1. Tiêu đề & Thông điệp định vị chính (Main Headline)
          </h2>
        </div>

        <BilingualField
          label="Dòng chữ Eyebrow / Tagline đầu trang"
          subLabel="Ví dụ: // KONTUR ATELIER · 3D ARCHITECTURAL VISUALIZATION"
          path={["eyebrow"]}
          contentJa={contentJa}
          contentEn={contentEn}
          updateField={updateField}
          activeLang={lang}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BilingualField
            label="Tiêu đề: Tiền tố (Headline Prefix)"
            subLabel="Ví dụ: 理想の住まいを、 / BRINGING YOUR"
            path={["headlinePre"]}
            contentJa={contentJa}
            contentEn={contentEn}
            updateField={updateField}
            activeLang={lang}
          />
          <BilingualField
            label="Tiêu đề: Điểm nhấn 1 (Highlight 1)"
            subLabel="Ví dụ: 確かな空間へと / DREAM SPACE"
            path={["headlineHighlight1"]}
            contentJa={contentJa}
            contentEn={contentEn}
            updateField={updateField}
            activeLang={lang}
          />
          <BilingualField
            label="Tiêu đề: Điểm nhấn 2 (Highlight 2)"
            subLabel="Ví dụ: 具現化する。 / INTO REALITY."
            path={["headlineHighlight2"]}
            contentJa={contentJa}
            contentEn={contentEn}
            updateField={updateField}
            activeLang={lang}
          />
        </div>

        <BilingualField
          label="Đoạn văn miêu tả giá trị cốt lõi (Hero Description)"
          subLabel="Mô tả kỹ thuật, độ chuẩn xác 100% và tiết kiệm chi phí"
          path={["desc"]}
          contentJa={contentJa}
          contentEn={contentEn}
          updateField={updateField}
          activeLang={lang}
          isTextArea
          rows={3}
        />
      </div>

      {/* Khối Nút Kêu gọi Hành động (CTA) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-3">
          2. Các nút Kêu gọi hành động (Call To Action Buttons)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BilingualField
            label="Nút liên hệ chính (Primary CTA)"
            path={["ctaContact"]}
            contentJa={contentJa}
            contentEn={contentEn}
            updateField={updateField}
            activeLang={lang}
          />
          <BilingualField
            label="Nút xem bộ sưu tập (Secondary CTA)"
            path={["ctaCollection"]}
            contentJa={contentJa}
            contentEn={contentEn}
            updateField={updateField}
            activeLang={lang}
          />
          <BilingualField
            label="Chữ gợi ý cuộn trang (Scroll Hint)"
            path={["scrollHint"]}
            contentJa={contentJa}
            contentEn={contentEn}
            updateField={updateField}
            activeLang={lang}
          />
        </div>
      </div>

      {/* Khối Huy hiệu thành tích & Trạng thái */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-3">
          3. Huy hiệu Thành tích & Uy tín (Trust Badge)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BilingualField
            label="Năm thành lập / Thương hiệu (Badge EST)"
            subLabel="Ví dụ: EST. 2026 · KONTUR ATELIER"
            path={["badgeEst"]}
            contentJa={contentJa}
            contentEn={contentEn}
            updateField={updateField}
            activeLang={lang}
          />
          <BilingualField
            label="Trạng thái tiếp nhận dự án (Badge Status)"
            subLabel="Ví dụ: SẴN SÀNG TIẾP NHẬN / ACCEPTING NEW PROJECTS"
            path={["badgeStatus"]}
            contentJa={contentJa}
            contentEn={contentEn}
            updateField={updateField}
            activeLang={lang}
          />
        </div>

        <BilingualField
          label="Tiêu đề huy hiệu (Badge Title)"
          path={["badgeTitle"]}
          contentJa={contentJa}
          contentEn={contentEn}
          updateField={updateField}
          activeLang={lang}
        />

        <BilingualField
          label="Nội dung chứng thực / Số lượng khách hàng (Badge Description)"
          subLabel="Ví dụ: 250+施主様・企業様に選ばれ..."
          path={["badgeDesc"]}
          contentJa={contentJa}
          contentEn={contentEn}
          updateField={updateField}
          activeLang={lang}
          isTextArea
          rows={2}
        />
      </div>

      {/* Khối Cấu hình Khối nhà 3D xoay tương tác */}
      <Model3DManager
        lang={lang}
        contentJa={contentJa}
        contentEn={contentEn}
        updateField={updateField}
      />
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

  const handleAddCard = () => {
    const nextIdx = totalCount + 1;
    const pad = nextIdx < 10 ? `0${nextIdx}` : `${nextIdx}`;

    const newJa = {
      tag: `課題 ${pad}`,
      badge: "VẤN ĐỀ MỚI",
      quote: "「Nhập trích dẫn hoặc câu hỏi nỗi đau...」",
      detail: "Mô tả chi tiết nguyên nhân, rủi ro và hậu quả của vấn đề này...",
      solLabel: "Konturの解決策:",
      solText: "Mô tả giải pháp kiến trúc / 3D của Kontur để khắc phục triệt để...",
    };

    const newEn = {
      tag: `PAIN POINT ${pad}`,
      badge: "NEW CHALLENGE",
      quote: "“Enter pain point question or quote...”",
      detail: "Detailed explanation of the challenge and its consequences...",
      solLabel: "KONTUR SOLUTION:",
      solText: "Detailed explanation of Kontur's technical & architectural solution...",
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

    const nextIdx = totalCount + 1;
    const pad = nextIdx < 10 ? `0${nextIdx}` : `${nextIdx}`;

    const cloneJa = { ...sourceJa, tag: `課題 ${pad}` };
    const cloneEn = { ...sourceEn, tag: `PAIN POINT ${pad}` };

    updateField("ja", ["cards"], [...cardsJa, cloneJa]);
    updateField("en", ["cards"], [...cardsEn, cloneEn]);
    toast(`Đã nhân bản Thẻ Nỗi đau #${idx + 1}`, "success");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-3">
          Tiêu đề Section Nỗi đau & Thách thức
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

      {/* Header bar for cards list with Add Button */}
      <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase">
            Danh sách Thẻ Nỗi đau & Thách thức ({totalCount} thẻ)
          </h3>
          <p className="text-xs text-slate-500">
            Bạn có thể thêm mới không giới hạn, chỉnh sửa hoặc xóa bất kỳ thẻ nỗi đau nào.
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: totalCount }).map((_, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 relative group">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-50 text-red-600 font-bold text-xs flex items-center justify-center">
                  {idx + 1}
                </span>
                <h3 className="text-xs font-bold text-slate-800 uppercase">
                  Nỗi đau / Vấn đề #{idx + 1}
                </h3>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleDuplicateCard(idx)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 rounded-md transition-all cursor-pointer"
                  title="Nhân bản thẻ này"
                >
                  <Copy size={12} />
                  <span className="hidden sm:inline">Nhân bản</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteCard(idx)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] text-red-600 hover:text-white hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-md transition-all cursor-pointer"
                  title="Xóa thẻ nỗi đau này"
                >
                  <Trash2 size={12} />
                  <span>Xóa</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <BilingualField
                label="Thẻ Tag"
                path={["cards", idx.toString(), "tag"]}
                contentJa={contentJa}
                contentEn={contentEn}
                updateField={updateField}
                activeLang={lang}
              />
              <BilingualField
                label="Huy hiệu cảnh báo (Badge)"
                path={["cards", idx.toString(), "badge"]}
                contentJa={contentJa}
                contentEn={contentEn}
                updateField={updateField}
                activeLang={lang}
              />
            </div>

            <BilingualField
              label="Câu hỏi / Trích dẫn nỗi đau (Quote)"
              subLabel="Hiển thị trên 1 dòng. Nhập <br> hoặc <\BR> để ngắt dòng."
              path={["cards", idx.toString(), "quote"]}
              contentJa={contentJa}
              contentEn={contentEn}
              updateField={updateField}
              activeLang={lang}
            />

            <BilingualField
              label="Chi tiết giải thích hậu quả (Detail)"
              path={["cards", idx.toString(), "detail"]}
              contentJa={contentJa}
              contentEn={contentEn}
              updateField={updateField}
              activeLang={lang}
              isTextArea
              rows={2}
            />

            {/* Kontur Solution Editor */}
            <div className="pt-2 border-t border-slate-100 bg-amber-50/20 p-3 rounded-lg border border-amber-200/50 space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800 uppercase tracking-wide">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Giải pháp Kontur (Kontur Solution)</span>
              </div>

              <BilingualField
                label="Tiêu đề nhãn giải pháp (Solution Label)"
                subLabel="Mặc định: Kontur Solution: / Konturの解決策:"
                path={["cards", idx.toString(), "solLabel"]}
                contentJa={contentJa}
                contentEn={contentEn}
                updateField={updateField}
                activeLang={lang}
              />

              <BilingualField
                label="Nội dung giải pháp (Solution Description)"
                subLabel="Mô tả phương án khắc phục triệt để của Kontur"
                path={["cards", idx.toString(), "solText"]}
                contentJa={contentJa}
                contentEn={contentEn}
                updateField={updateField}
                activeLang={lang}
                isTextArea
                rows={2}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Add Card Button */}
      <button
        type="button"
        onClick={handleAddCard}
        className="w-full py-4 border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/40 rounded-xl text-slate-600 hover:text-blue-600 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <Plus size={16} />
        <span>Thêm thẻ Nỗi đau & Thách thức mới</span>
      </button>
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
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-3">
          Tiêu đề Section Quy trình thực hiện
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

  return (
    <div className="space-y-6">
      {/* Tiêu đề Section */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-3">
          1. Tiêu đề Section Hồ sơ bàn giao (Ảnh 1)
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BilingualField
            label="Phụ đề 01: Bản vẽ kỹ thuật"
            path={["info", "cardSub1"]}
            contentJa={contentJa}
            contentEn={contentEn}
            updateField={updateField}
            activeLang={lang}
          />
          <BilingualField
            label="Phụ đề 02: Phối cảnh 3D 8K"
            path={["info", "cardSub2"]}
            contentJa={contentJa}
            contentEn={contentEn}
            updateField={updateField}
            activeLang={lang}
          />
          <BilingualField
            label="Phụ đề 03: Mặt bằng bố trí"
            path={["info", "cardSub3"]}
            contentJa={contentJa}
            contentEn={contentEn}
            updateField={updateField}
            activeLang={lang}
          />
          <BilingualField
            label="Phụ đề 04: Bóc tách dự toán"
            path={["info", "cardSub4"]}
            contentJa={contentJa}
            contentEn={contentEn}
            updateField={updateField}
            activeLang={lang}
          />
        </div>

        <BilingualField
          label="Nhãn Laser Tag / Đóng dấu tiêu chuẩn"
          path={["info", "laserTag"]}
          contentJa={contentJa}
          contentEn={contentEn}
          updateField={updateField}
          activeLang={lang}
        />
      </div>

      {/* 2. Quản lý Bộ sưu tập tài liệu chi tiết */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              2. Quản lý các Bộ sưu tập Bản vẽ & Hình ảnh bàn giao
            </h2>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Hiển thị trong Showcase Viewer & lưới thẻ bộ sưu tập ngoài Landing Page
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddCollection}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
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
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:hover:bg-transparent text-xs font-medium rounded-lg transition"
                    title="Xóa bộ sưu tập này"
                  >
                    <Trash2 size={13} />
                    <span>Xóa bộ sưu tập</span>
                  </button>
                </div>

                {/* Collection Name & Badge */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(lang === "ja" || lang === "both") && (
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          🇯🇵 Tên bộ sưu tập (JA)
                        </label>
                        <input
                          type="text"
                          value={cJa.name || ""}
                          onChange={(e) => {
                            const updated = [...collectionsJa];
                            updated[cIdx] = { ...updated[cIdx], name: e.target.value };
                            updateField("ja", ["collections"], updated);
                          }}
                          className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-slate-500 mb-0.5">
                          Badge góc ảnh (JA) (Ví dụ: 100+ A3ページ, 8K ULTRA-HD, 4K映像＆VR)
                        </label>
                        <input
                          type="text"
                          value={cJa.badge || ""}
                          placeholder="100+ A3ページ"
                          onChange={(e) => {
                            const updated = [...collectionsJa];
                            updated[cIdx] = { ...updated[cIdx], badge: e.target.value };
                            updateField("ja", ["collections"], updated);
                          }}
                          className="w-full px-2.5 py-1 text-xs text-slate-700 bg-white border border-slate-200 rounded-md"
                        />
                      </div>
                    </div>
                  )}

                  {(lang === "en" || lang === "both") && (
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          🇬🇧 Tên bộ sưu tập (EN)
                        </label>
                        <input
                          type="text"
                          value={cEn.name || ""}
                          onChange={(e) => {
                            const updated = [...collectionsEn];
                            updated[cIdx] = { ...updated[cIdx], name: e.target.value };
                            updateField("en", ["collections"], updated);
                          }}
                          className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-slate-500 mb-0.5">
                          Badge góc ảnh (EN) (Ví dụ: 100+ A3 PAGES, 8K ULTRA-HD, 4K VIDEO & VR)
                        </label>
                        <input
                          type="text"
                          value={cEn.badge || ""}
                          placeholder="100+ A3 PAGES"
                          onChange={(e) => {
                            const updated = [...collectionsEn];
                            updated[cIdx] = { ...updated[cIdx], badge: e.target.value };
                            updateField("en", ["collections"], updated);
                          }}
                          className="w-full px-2.5 py-1 text-xs text-slate-700 bg-white border border-slate-200 rounded-md"
                        />
                      </div>
                    </div>
                  )}
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

                              <div className="grid grid-cols-2 gap-1.5">
                                <input
                                  type="text"
                                  value={pJa.tag || ""}
                                  placeholder="Tag (JA)"
                                  onChange={(e) => handleUpdatePhotoMeta(cIdx, pIdx, "tag", "ja", e.target.value)}
                                  className="px-2 py-0.5 text-[10px] text-slate-700 border border-slate-200 rounded"
                                />
                                <input
                                  type="text"
                                  value={pEn.tag || ""}
                                  placeholder="Tag (EN)"
                                  onChange={(e) => handleUpdatePhotoMeta(cIdx, pIdx, "tag", "en", e.target.value)}
                                  className="px-2 py-0.5 text-[10px] text-slate-700 border border-slate-200 rounded"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1">
                            {(lang === "ja" || lang === "both") && (
                              <input
                                type="text"
                                value={pJa.title || ""}
                                placeholder="Tiêu đề bản vẽ (JA)"
                                onChange={(e) => handleUpdatePhotoMeta(cIdx, pIdx, "title", "ja", e.target.value)}
                                className="w-full px-2 py-1 text-[11px] text-slate-800 border border-slate-200 rounded"
                              />
                            )}
                            {(lang === "en" || lang === "both") && (
                              <input
                                type="text"
                                value={pEn.title || ""}
                                placeholder="Tiêu đề bản vẽ (EN)"
                                onChange={(e) => handleUpdatePhotoMeta(cIdx, pIdx, "title", "en", e.target.value)}
                                className="w-full px-2 py-1 text-[11px] text-slate-800 border border-slate-200 rounded"
                              />
                            )}
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
                  {/* Image Preview & Upload */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700">
                      {lang === "ja" ? "アイキャッチ画像" : lang === "en" ? "Card Image" : "Hình ảnh đại diện thẻ"}
                    </label>
                    <div className="w-full h-36 rounded-lg overflow-hidden border border-slate-200 bg-slate-200 flex items-center justify-center relative group">
                      {cardImg ? (
                        <img
                          src={cardImg}
                          alt="Application preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-slate-400">Chưa có ảnh</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
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
                                handleUpdateBothLangs(idx, "image", data.url);
                                toast("Tải ảnh thẻ ứng dụng thành công!", "success");
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
   08. GALLERY SECTION FORM
   ------------------------------------------------------------------------- */
function GalleryForm({
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

  // 1. Quản lý Thể loại Project (Filter Projects / Categories)
  const rawTabsJa: any[] = Array.isArray(contentJa?.info?.filterTabs) && contentJa.info.filterTabs.length > 0
    ? contentJa.info.filterTabs
    : (Array.isArray(contentJa?.filterTabs) && contentJa.filterTabs.length > 0
      ? contentJa.filterTabs
      : getDefaultGalleryTabs("ja"));
  const rawTabsEn: any[] = Array.isArray(contentEn?.info?.filterTabs) && contentEn.info.filterTabs.length > 0
    ? contentEn.info.filterTabs
    : (Array.isArray(contentEn?.filterTabs) && contentEn.filterTabs.length > 0
      ? contentEn.filterTabs
      : getDefaultGalleryTabs("en"));

  const tabsCount = Math.max(rawTabsJa.length, rawTabsEn.length);
  const normalizedTabsJa = Array.from({ length: tabsCount }, (_, i) => rawTabsJa[i] || { key: `tab-${i + 1}`, label: `カテゴリー ${i + 1}` });
  const normalizedTabsEn = Array.from({ length: tabsCount }, (_, i) => rawTabsEn[i] || { key: normalizedTabsJa[i]?.key || `tab-${i + 1}`, label: `Category ${i + 1}` });

  const handleUpdateTabLabel = (idx: number, langKey: "ja" | "en", val: string) => {
    if (langKey === "ja") {
      const updated = [...normalizedTabsJa];
      updated[idx] = { ...updated[idx], label: val };
      updateField("ja", ["info", "filterTabs"], updated);
      updateField("ja", ["filterTabs"], updated);
    } else {
      const updated = [...normalizedTabsEn];
      updated[idx] = { ...updated[idx], label: val };
      updateField("en", ["info", "filterTabs"], updated);
      updateField("en", ["filterTabs"], updated);
    }
  };

  const handleUpdateTabKey = (idx: number, newKey: string) => {
    const safeKey = newKey.toLowerCase().replace(/[^a-z0-9_-]/g, "");
    const updatedJa = [...normalizedTabsJa];
    updatedJa[idx] = { ...updatedJa[idx], key: safeKey };
    updateField("ja", ["info", "filterTabs"], updatedJa);
    updateField("ja", ["filterTabs"], updatedJa);

    const updatedEn = [...normalizedTabsEn];
    updatedEn[idx] = { ...updatedEn[idx], key: safeKey };
    updateField("en", ["info", "filterTabs"], updatedEn);
    updateField("en", ["filterTabs"], updatedEn);
  };

  const handleAddTab = () => {
    const newKey = `cat-${Date.now().toString().slice(-4)}`;
    const newTabJa = { key: newKey, label: "新しいプロジェクト種別" };
    const newTabEn = { key: newKey, label: "New Project Category" };

    const nextJa = [...normalizedTabsJa, newTabJa];
    const nextEn = [...normalizedTabsEn, newTabEn];

    updateField("ja", ["info", "filterTabs"], nextJa);
    updateField("ja", ["filterTabs"], nextJa);
    updateField("en", ["info", "filterTabs"], nextEn);
    updateField("en", ["filterTabs"], nextEn);
    toast("Đã thêm thể loại Project mới thành công!", "success");
  };

  const handleDeleteTab = (idx: number) => {
    const targetKey = normalizedTabsJa[idx]?.key;
    if (targetKey === "all") {
      toast("Không thể xóa thể loại 'Tất cả' mặc định", "error");
      return;
    }
    if (tabsCount <= 1) {
      toast("Phải giữ lại ít nhất 1 thể loại Project", "info");
      return;
    }
    const updatedJa = normalizedTabsJa.filter((_, i) => i !== idx);
    const updatedEn = normalizedTabsEn.filter((_, i) => i !== idx);

    updateField("ja", ["info", "filterTabs"], updatedJa);
    updateField("ja", ["filterTabs"], updatedJa);
    updateField("en", ["info", "filterTabs"], updatedEn);
    updateField("en", ["filterTabs"], updatedEn);
    toast("Đã xóa thể loại Project", "info");
  };

  // 2. Quản lý Danh sách Card Dự án (Project Showcase Cards - Ảnh 2) kèm Bộ lọc
  const [activeProjectFilter, setActiveProjectFilter] = useState<string>("all");
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  const defaultProjectsJa = getGalleryProjectsData("ja");
  const defaultProjectsEn = getGalleryProjectsData("en");

  const rawProjectsJa: Record<string, any> = contentJa?.projects && typeof contentJa.projects === "object"
    ? (Array.isArray(contentJa.projects) ? contentJa.projects.reduce((acc: any, p: any) => ({ ...acc, [p.id]: p }), {}) : contentJa.projects)
    : defaultProjectsJa;
  const rawProjectsEn: Record<string, any> = contentEn?.projects && typeof contentEn.projects === "object"
    ? (Array.isArray(contentEn.projects) ? contentEn.projects.reduce((acc: any, p: any) => ({ ...acc, [p.id]: p }), {}) : contentEn.projects)
    : defaultProjectsEn;

  const allProjectKeys = Array.from(new Set([...Object.keys(rawProjectsJa), ...Object.keys(rawProjectsEn)]));

  // Lọc theo project category tương ứng
  const filteredProjectKeys = activeProjectFilter === "all"
    ? allProjectKeys
    : allProjectKeys.filter((k) => {
      const p = rawProjectsJa[k] || rawProjectsEn[k];
      return p?.category === activeProjectFilter;
    });

  // Helper chuẩn hóa danh sách thông số chân card (specs)
  const getNormalizedSpecs = (specsRaw: any): Array<{ k: string; v: string }> => {
    if (!Array.isArray(specsRaw)) return [];
    return specsRaw.map((sp: any) => {
      if (typeof sp === "string") return { k: "Thông số", v: sp };
      return { k: sp?.k || "Thông số", v: sp?.v || sp?.value || "" };
    });
  };

  const handleUpdateProject = (
    projId: string,
    field: string,
    langKey: "ja" | "en",
    val: any,
    forceSync: boolean = false
  ) => {
    const curJa = rawProjectsJa[projId] || defaultProjectsJa[projId] || {};
    const curEn = rawProjectsEn[projId] || defaultProjectsEn[projId] || {};

    if (langKey === "ja") {
      const updatedJa = { ...rawProjectsJa, [projId]: { ...curJa, id: projId, [field]: val } };
      updateField("ja", ["projects"], updatedJa);

      // Cập nhật đồng bộ sang EN nếu forceSync, hoặc đang ở chế độ song ngữ, hoặc các trường dùng chung
      const isShared = forceSync || lang === "both" || field === "category" || field === "img" || field === "title" || field === "style";
      if (isShared) {
        const updatedEn = { ...rawProjectsEn, [projId]: { ...curEn, id: projId, [field]: val } };
        updateField("en", ["projects"], updatedEn);
      } else {
        // Nếu EN vẫn còn giá trị mặc định hoặc chưa từng sửa, tự động đồng bộ để Landing Page tiếng Anh không bị giữ giá trị cũ
        const defaultVal = (defaultProjectsEn[projId] as any)?.[field];
        if (!curEn[field] || curEn[field] === defaultVal || curEn[field] === curJa[field]) {
          const updatedEn = { ...rawProjectsEn, [projId]: { ...curEn, id: projId, [field]: val } };
          updateField("en", ["projects"], updatedEn);
        }
      }
    } else {
      const updatedEn = { ...rawProjectsEn, [projId]: { ...curEn, id: projId, [field]: val } };
      updateField("en", ["projects"], updatedEn);

      const isShared = forceSync || lang === "both" || field === "category" || field === "img" || field === "title" || field === "style";
      if (isShared) {
        const updatedJa = { ...rawProjectsJa, [projId]: { ...curJa, id: projId, [field]: val } };
        updateField("ja", ["projects"], updatedJa);
      } else {
        const defaultVal = (defaultProjectsJa[projId] as any)?.[field];
        if (!curJa[field] || curJa[field] === defaultVal || curJa[field] === curEn[field]) {
          const updatedJa = { ...rawProjectsJa, [projId]: { ...curJa, id: projId, [field]: val } };
          updateField("ja", ["projects"], updatedJa);
        }
      }
    }
  };

  // Quản lý THÊM / XÓA / SỬA thông số chân card (Specs Chips)
  const handleAddProjectSpec = (projId: string) => {
    const pJa = rawProjectsJa[projId] || defaultProjectsJa[projId] || {};
    const pEn = rawProjectsEn[projId] || defaultProjectsEn[projId] || {};
    const curSpecsJa = getNormalizedSpecs(pJa.specs);
    const curSpecsEn = getNormalizedSpecs(pEn.specs);

    const nextSpecsJa = [...curSpecsJa, { k: "Thông số", v: "Thông số mới" }];
    const nextSpecsEn = [...curSpecsEn, { k: "Spec", v: "New Spec" }];

    handleUpdateProject(projId, "specs", "ja", nextSpecsJa, true);
    handleUpdateProject(projId, "specs", "en", nextSpecsEn, true);
    toast("Đã thêm thông số chân card mới", "success");
  };

  const handleDeleteProjectSpec = (projId: string, specIdx: number) => {
    const pJa = rawProjectsJa[projId] || defaultProjectsJa[projId] || {};
    const pEn = rawProjectsEn[projId] || defaultProjectsEn[projId] || {};
    const curSpecsJa = getNormalizedSpecs(pJa.specs);
    const curSpecsEn = getNormalizedSpecs(pEn.specs);

    if (curSpecsJa.length <= 1) {
      toast("Phải giữ lại ít nhất 1 thông số chân card", "info");
      return;
    }

    const nextSpecsJa = curSpecsJa.filter((_, i) => i !== specIdx);
    const nextSpecsEn = curSpecsEn.filter((_, i) => i !== specIdx);

    handleUpdateProject(projId, "specs", "ja", nextSpecsJa, true);
    handleUpdateProject(projId, "specs", "en", nextSpecsEn, true);
    toast("Đã xóa thông số chân card", "info");
  };

  const handleUpdateProjectSpecValue = (projId: string, specIdx: number, langKey: "ja" | "en", val: string) => {
    const pJa = rawProjectsJa[projId] || defaultProjectsJa[projId] || {};
    const pEn = rawProjectsEn[projId] || defaultProjectsEn[projId] || {};
    const curSpecsJa = getNormalizedSpecs(pJa.specs);
    const curSpecsEn = getNormalizedSpecs(pEn.specs);

    if (langKey === "ja") {
      const nextSpecsJa = [...curSpecsJa];
      nextSpecsJa[specIdx] = { ...(nextSpecsJa[specIdx] || {}), v: val };
      handleUpdateProject(projId, "specs", "ja", nextSpecsJa);

      // Nếu đang sửa JA mà EN chưa có hoặc trùng hoặc đang chọn both thì đồng bộ sang EN
      if (lang === "both" || !curSpecsEn[specIdx]?.v || curSpecsEn[specIdx]?.v === curSpecsJa[specIdx]?.v) {
        const nextSpecsEn = [...curSpecsEn];
        nextSpecsEn[specIdx] = { ...(nextSpecsEn[specIdx] || {}), v: val };
        handleUpdateProject(projId, "specs", "en", nextSpecsEn);
      }
    } else {
      const nextSpecsEn = [...curSpecsEn];
      nextSpecsEn[specIdx] = { ...(nextSpecsEn[specIdx] || {}), v: val };
      handleUpdateProject(projId, "specs", "en", nextSpecsEn);

      if (lang === "both" || !curSpecsJa[specIdx]?.v || curSpecsJa[specIdx]?.v === curSpecsEn[specIdx]?.v) {
        const nextSpecsJa = [...curSpecsJa];
        nextSpecsJa[specIdx] = { ...(nextSpecsJa[specIdx] || {}), v: val };
        handleUpdateProject(projId, "specs", "ja", nextSpecsJa);
      }
    }
  };

  const handleAddProject = () => {
    const newId = `p-proj-${Date.now().toString().slice(-6)}`;
    const cat = activeProjectFilter !== "all" ? activeProjectFilter : (normalizedTabsJa[1]?.key || "villa");
    const newProjJa = {
      id: newId,
      category: cat,
      catTag: "高級リゾートヴィラ",
      title: "NEW PROJECT VILLA",
      loc: "Hồ Tràm • 750 m²",
      style: "Modern Tropical Zen",
      narrative: "打ち放しコンクリートと天然木ルーバーが調和する上質な空間設計...",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
      specs: [
        { k: "Quy mô", v: "3 Tầng • 4 PN" },
        { k: "Diện tích", v: "750 m²" },
        { k: "Bàn giao", v: "Bàn Giao 2026" }
      ],
      solution: "Giải pháp thiết kế kiến trúc thông gió vi khí hậu tự nhiên...",
      materials: "Bê tông trần, đá bazan tự nhiên, gỗ ngoài trời...",
      deliverables: ["8K CG Perspectives", "Bản vẽ kỹ thuật thi công"],
      keyHighlights: [
        { label: "Timeline", value: "20–30 Ngày" },
        { label: "Highlight", value: "Hồ bơi tràn viền" }
      ],
    };
    const newProjEn = {
      ...newProjJa,
      catTag: "LUXURY RETREAT VILLA",
      title: "NEW PROJECT VILLA",
      narrative: "Lakeside villa balancing raw concrete and natural timber louvers...",
      specs: [
        { k: "Scale", v: "3 Levels • 4 Suites" },
        { k: "Area", v: "750 m²" },
        { k: "Delivery", v: "2026 Delivery" }
      ],
      solution: "Architectural microclimatic ventilation solution...",
      materials: "Board-formed concrete, natural stone, outdoor teak...",
      deliverables: ["8K CGI Perspectives", "Working Blueprints"],
      keyHighlights: [
        { label: "Timeline", value: "20–30 Days" },
        { label: "Highlight", value: "Horizon Pool" }
      ],
    };

    const updatedJa = { ...rawProjectsJa, [newId]: newProjJa };
    const updatedEn = { ...rawProjectsEn, [newId]: newProjEn };
    updateField("ja", ["projects"], updatedJa);
    updateField("en", ["projects"], updatedEn);
    setExpandedProjectId(newId);
    toast("Đã thêm card dự án mới thành công!", "success");
  };

  const handleDeleteProject = (projId: string) => {
    if (allProjectKeys.length <= 1) {
      toast("Phải giữ lại ít nhất 1 card dự án", "info");
      return;
    }
    const updatedJa = { ...rawProjectsJa };
    delete updatedJa[projId];
    const updatedEn = { ...rawProjectsEn };
    delete updatedEn[projId];
    updateField("ja", ["projects"], updatedJa);
    updateField("en", ["projects"], updatedEn);
    toast("Đã xóa card dự án", "info");
  };

  const handleUploadProjectImage = async (projId: string, file: File) => {
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        if (data?.url) {
          handleUpdateProject(projId, "img", "ja", data.url, true);
          toast("Tải ảnh dự án thành công!", "success");
        }
      } else {
        toast("Lỗi tải ảnh", "error");
      }
    } catch {
      toast("Có lỗi xảy ra khi tải ảnh", "error");
    }
  };

  // 3. Quản lý Dự án Tiêu điểm (Card lớn bên trái - Spotlight Project)
  const defaultSpotlightJa = defaultProjectsJa["p-lakeside"] || Object.values(defaultProjectsJa)[0];
  const defaultSpotlightEn = defaultProjectsEn["p-lakeside"] || Object.values(defaultProjectsEn)[0];

  const spotlightJa = contentJa?.projects?.["p-lakeside"] || contentJa?.spotlight || defaultSpotlightJa;
  const spotlightEn = contentEn?.projects?.["p-lakeside"] || contentEn?.spotlight || defaultSpotlightEn;

  const handleSetProjectAsSpotlight = (projId: string) => {
    const pJa = rawProjectsJa[projId] || defaultProjectsJa[projId];
    const pEn = rawProjectsEn[projId] || defaultProjectsEn[projId];
    if (pJa) {
      updateField("ja", ["spotlight"], pJa);
      updateField("ja", ["projects", "p-lakeside"], pJa);
    }
    if (pEn) {
      updateField("en", ["spotlight"], pEn);
      updateField("en", ["projects", "p-lakeside"], pEn);
    }
    toast(`Đã thiết lập dự án "${pJa?.title || projId}" làm Tiêu điểm (Card lớn)!`, "success");
  };

  const handleUpdateSpotlightField = (field: string, langKey: "ja" | "en", val: any) => {
    if (langKey === "ja") {
      const updatedJa = { ...spotlightJa, [field]: val };
      updateField("ja", ["projects", "p-lakeside"], updatedJa);
      updateField("ja", ["spotlight"], updatedJa);
      if (field === "img" || field === "category" || lang === "both") {
        const updatedEn = { ...spotlightEn, [field]: val };
        updateField("en", ["projects", "p-lakeside"], updatedEn);
        updateField("en", ["spotlight"], updatedEn);
      }
    } else {
      const updatedEn = { ...spotlightEn, [field]: val };
      updateField("en", ["projects", "p-lakeside"], updatedEn);
      updateField("en", ["spotlight"], updatedEn);
      if (field === "img" || field === "category" || lang === "both") {
        const updatedJa = { ...spotlightJa, [field]: val };
        updateField("ja", ["projects", "p-lakeside"], updatedJa);
        updateField("ja", ["spotlight"], updatedJa);
      }
    }
  };

  const handleUploadSpotlightImage = async (file: File) => {
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        if (data?.url) {
          handleUpdateSpotlightField("img", "ja", data.url);
          toast("Tải ảnh dự án tiêu điểm thành công!", "success");
        }
      } else {
        toast("Lỗi tải ảnh lên máy chủ", "error");
      }
    } catch {
      toast("Có lỗi xảy ra khi tải ảnh", "error");
    }
  };

  // Quản lý gói hồ sơ bàn giao (Deliverables) của card lớn
  const deliverablesJa: string[] = Array.isArray(spotlightJa?.deliverables)
    ? spotlightJa.deliverables
    : (defaultSpotlightJa.deliverables || []);
  const deliverablesEn: string[] = Array.isArray(spotlightEn?.deliverables)
    ? spotlightEn.deliverables
    : (defaultSpotlightEn.deliverables || []);

  const delivCount = Math.max(deliverablesJa.length, deliverablesEn.length);

  const handleUpdateDeliverable = (idx: number, langKey: "ja" | "en", val: string) => {
    if (langKey === "ja") {
      const next = [...deliverablesJa];
      next[idx] = val;
      handleUpdateSpotlightField("deliverables", "ja", next);
    } else {
      const next = [...deliverablesEn];
      next[idx] = val;
      handleUpdateSpotlightField("deliverables", "en", next);
    }
  };

  const handleAddDeliverable = () => {
    const nextJa = [...deliverablesJa, "新しい成果物項目"];
    const nextEn = [...deliverablesEn, "New Deliverable Item"];
    handleUpdateSpotlightField("deliverables", "ja", nextJa);
    handleUpdateSpotlightField("deliverables", "en", nextEn);
    toast("Đã thêm mục hồ sơ bàn giao!", "success");
  };

  const handleDeleteDeliverable = (idx: number) => {
    if (delivCount <= 1) {
      toast("Phải giữ lại ít nhất 1 mục hồ sơ bàn giao", "info");
      return;
    }
    const nextJa = deliverablesJa.filter((_, i) => i !== idx);
    const nextEn = deliverablesEn.filter((_, i) => i !== idx);
    handleUpdateSpotlightField("deliverables", "ja", nextJa);
    handleUpdateSpotlightField("deliverables", "en", nextEn);
    toast("Đã xóa mục hồ sơ bàn giao", "info");
  };

  // Quản lý thông số kỹ thuật chân card lớn (Key Highlights)
  const keyHighlightsJa: any[] = Array.isArray(spotlightJa?.keyHighlights)
    ? spotlightJa.keyHighlights
    : (defaultSpotlightJa.keyHighlights || []);
  const keyHighlightsEn: any[] = Array.isArray(spotlightEn?.keyHighlights)
    ? spotlightEn.keyHighlights
    : (defaultSpotlightEn.keyHighlights || []);

  const highlightsCount = Math.max(keyHighlightsJa.length, keyHighlightsEn.length);

  const handleUpdateHighlight = (idx: number, field: "label" | "value", langKey: "ja" | "en", val: string) => {
    if (langKey === "ja") {
      const next = [...keyHighlightsJa];
      next[idx] = { ...(next[idx] || {}), [field]: val };
      handleUpdateSpotlightField("keyHighlights", "ja", next);
    } else {
      const next = [...keyHighlightsEn];
      next[idx] = { ...(next[idx] || {}), [field]: val };
      handleUpdateSpotlightField("keyHighlights", "en", next);
    }
  };

  const handleAddHighlight = () => {
    const nextJa = [...keyHighlightsJa, { label: "Thông số mới", value: "Giá trị" }];
    const nextEn = [...keyHighlightsEn, { label: "New Spec", value: "Value" }];
    handleUpdateSpotlightField("keyHighlights", "ja", nextJa);
    handleUpdateSpotlightField("keyHighlights", "en", nextEn);
    toast("Đã thêm thông số kỹ thuật mới thành công!", "success");
  };

  const handleDeleteHighlight = (idx: number) => {
    if (highlightsCount <= 1) {
      toast("Phải giữ lại ít nhất 1 thông số kỹ thuật", "info");
      return;
    }
    const nextJa = keyHighlightsJa.filter((_, i) => i !== idx);
    const nextEn = keyHighlightsEn.filter((_, i) => i !== idx);
    handleUpdateSpotlightField("keyHighlights", "ja", nextJa);
    handleUpdateSpotlightField("keyHighlights", "en", nextEn);
    toast("Đã xóa thông số kỹ thuật", "info");
  };

  return (
    <div className="space-y-8">
      {/* 1. Header and Project Filter Categories */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
            <span>1. Tiêu đề Showcase &amp; Quản lý Bộ lọc Project (Project Categories)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý tiêu đề Showcase và các thể loại Project hiển thị trên thanh bộ lọc triển lãm.
          </p>
        </div>

        <BilingualField
          label="Tiêu đề chính Section Showcase"
          path={["info", "title"]}
          contentJa={contentJa}
          contentEn={contentEn}
          updateField={updateField}
          activeLang={lang}
        />

        {/* Danh sách Thể loại Project với tính năng Thêm / Xóa */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Danh sách Thể loại Project ({tabsCount} thể loại)
            </h4>
            <button
              type="button"
              onClick={handleAddTab}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition"
            >
              <Plus size={14} />
              <span>Thêm thể loại Project</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: tabsCount }).map((_, idx) => {
              const tabJa = normalizedTabsJa[idx] || {};
              const tabEn = normalizedTabsEn[idx] || {};
              const isDefaultAll = tabJa.key === "all";

              return (
                <div
                  key={`project-cat-${idx}`}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-blue-300 transition space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-100 px-2 py-0.5 rounded">
                      Project Category #{idx + 1} {isDefaultAll && "(Mặc định: Tất cả)"}
                    </span>
                    {!isDefaultAll && (
                      <button
                        type="button"
                        onClick={() => handleDeleteTab(idx)}
                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Xóa thể loại này"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>

                  {/* Mã định danh Project Category */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Mã Project / Key filter:
                    </label>
                    <input
                      type="text"
                      disabled={isDefaultAll}
                      value={tabJa.key || ""}
                      onChange={(e) => handleUpdateTabKey(idx, e.target.value)}
                      className={`w-full px-2.5 py-1 text-xs border rounded ${isDefaultAll
                          ? "bg-slate-200 text-slate-500 cursor-not-allowed border-slate-300"
                          : "border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        }`}
                      placeholder="villa, townhouse..."
                    />
                  </div>

                  {/* Tên Thể loại song ngữ */}
                  {(lang === "ja" || lang === "both") && (
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Tên thể loại [JA / VI]:
                      </label>
                      <input
                        type="text"
                        value={tabJa.label || ""}
                        onChange={(e) => handleUpdateTabLabel(idx, "ja", e.target.value)}
                        className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="別荘・高級ヴィラ"
                      />
                    </div>
                  )}

                  {(lang === "en" || lang === "both") && (
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Tên thể loại [EN]:
                      </label>
                      <input
                        type="text"
                        value={tabEn.label || ""}
                        onChange={(e) => handleUpdateTabLabel(idx, "en", e.target.value)}
                        className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Villas & Estates"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Quản lý Danh sách Card Dự án (Project Showcase Cards - Ảnh 2) kèm BỘ LỌC PROJECT */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              <span>2. Quản lý Danh sách Card Dự án (Ảnh 2 - Project Cards)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Thêm, xóa và chỉnh sửa từng card dự án hiển thị trong triển lãm. Lọc dự án theo thể loại bên dưới.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddProject}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition shrink-0"
          >
            <Plus size={15} />
            <span>+ Thêm Card Dự án mới</span>
          </button>
        </div>

        {/* BỘ LỌC PROJECT */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <span>🎯 Bộ lọc Project:</span>
              <span className="text-[11px] font-normal text-slate-500">
                (Đang hiển thị: {filteredProjectKeys.length} / {allProjectKeys.length} dự án)
              </span>
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => setActiveProjectFilter("all")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition border ${activeProjectFilter === "all"
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
            >
              <span>Tất cả ({allProjectKeys.length})</span>
            </button>
            {normalizedTabsJa.filter(t => t.key !== "all").map((cat) => {
              const countInCat = allProjectKeys.filter((k) => {
                const p = rawProjectsJa[k] || rawProjectsEn[k];
                return p?.category === cat.key;
              }).length;

              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setActiveProjectFilter(cat.key)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition border flex items-center gap-1.5 ${activeProjectFilter === cat.key
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeProjectFilter === cat.key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                    }`}>
                    {countInCat}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* DANH SÁCH CÁC CARD DỰ ÁN ĐÃ LỌC */}
        {filteredProjectKeys.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <p className="text-xs text-slate-500">Chưa có dự án nào thuộc thể loại này.</p>
            <button
              type="button"
              onClick={handleAddProject}
              className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold hover:underline"
            >
              <Plus size={13} />
              <span>Thêm dự án đầu tiên vào thể loại này</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjectKeys.map((projId) => {
              const pJa = rawProjectsJa[projId] || defaultProjectsJa[projId] || {};
              const pEn = rawProjectsEn[projId] || defaultProjectsEn[projId] || {};
              const isExpanded = expandedProjectId === projId;
              const isSpotlight = spotlightJa?.id === projId || spotlightJa?.title === pJa?.title;

              const specsJa = getNormalizedSpecs(pJa.specs);
              const specsEn = getNormalizedSpecs(pEn.specs);
              const maxSpecs = Math.max(specsJa.length, specsEn.length);

              return (
                <div
                  key={projId}
                  className={`rounded-xl border bg-white shadow-sm transition overflow-hidden space-y-4 ${isSpotlight
                      ? "border-amber-400 ring-2 ring-amber-400/20"
                      : "border-slate-200 hover:border-slate-300"
                    }`}
                >
                  {/* Card Header & Controls */}
                  <div className="p-4 pb-0 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase tracking-wide">
                        {pJa.category || "villa"}
                      </span>
                      {isSpotlight && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                          ★ Đang là Tiêu điểm (Card lớn)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {!isSpotlight && (
                        <button
                          type="button"
                          onClick={() => handleSetProjectAsSpotlight(projId)}
                          className="px-2 py-1 text-[11px] font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded transition"
                          title="Chọn dự án này hiển thị ở Card lớn bên trái"
                        >
                          Chọn làm Card lớn
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteProject(projId)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Xóa card dự án này"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Ảnh đại diện & Tên & Thể loại */}
                  <div className="px-4">
                    <div className="flex gap-3 items-start">
                      <div className="w-28 h-20 rounded-lg overflow-hidden bg-slate-900 border border-slate-200 shrink-0 relative group">
                        {pJa.img ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={pJa.img} alt={pJa.title || "Project"} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500">
                            <Eye size={20} />
                          </div>
                        )}
                        <label className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition text-[10px]">
                          <Upload size={14} />
                          <span>Đổi ảnh</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleUploadProjectImage(projId, f);
                            }}
                          />
                        </label>
                      </div>

                      <div className="flex-1 space-y-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">
                            Tên dự án (Title):
                          </label>
                          <input
                            type="text"
                            value={pJa.title || pEn.title || ""}
                            onChange={(e) => {
                              handleUpdateProject(projId, "title", "ja", e.target.value, true);
                            }}
                            className="w-full px-2 py-1 text-xs font-bold text-slate-800 border border-slate-300 rounded bg-white"
                            placeholder="THE LAKESIDE HORIZON VILLA"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">
                            Thể loại Project (Category):
                          </label>
                          <select
                            value={pJa.category || "villa"}
                            onChange={(e) => {
                              handleUpdateProject(projId, "category", "ja", e.target.value, true);
                            }}
                            className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                          >
                            {normalizedTabsJa.filter(t => t.key !== "all").map((cat) => (
                              <option key={cat.key} value={cat.key}>
                                {cat.label} ({cat.key})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Các trường thông tin chính của Card Dự án */}
                  <div className="px-4 space-y-2.5">
                    {/* Huy hiệu Card (Badge Tag) - Hỗ trợ song ngữ đầy đủ */}
                    <div>
                      <label className="block text-[10px] text-slate-500 font-medium">Huy hiệu Card (Badge Tag):</label>
                      {lang === "both" ? (
                        <div className="grid grid-cols-2 gap-2 mt-0.5">
                          <input
                            type="text"
                            value={pJa.catTag || ""}
                            onChange={(e) => handleUpdateProject(projId, "catTag", "ja", e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                            placeholder="[JA / VI] 高級リゾートヴィラ"
                          />
                          <input
                            type="text"
                            value={pEn.catTag || ""}
                            onChange={(e) => handleUpdateProject(projId, "catTag", "en", e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                            placeholder="[EN] LUXURY RETREAT VILLA"
                          />
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={(lang === "en" ? pEn.catTag : pJa.catTag) || ""}
                          onChange={(e) => handleUpdateProject(projId, "catTag", lang === "en" ? "en" : "ja", e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white mt-0.5"
                          placeholder="LUXURY RETREAT VILLA"
                        />
                      )}
                    </div>

                    {/* Địa điểm & Diện tích (Loc) - Hỗ trợ song ngữ đầy đủ */}
                    <div>
                      <label className="block text-[10px] text-slate-500 font-medium">Địa điểm &amp; Diện tích (Loc):</label>
                      {lang === "both" ? (
                        <div className="grid grid-cols-2 gap-2 mt-0.5">
                          <input
                            type="text"
                            value={pJa.loc || ""}
                            onChange={(e) => handleUpdateProject(projId, "loc", "ja", e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                            placeholder="[JA / VI] Hồ Tràm • 850 m²"
                          />
                          <input
                            type="text"
                            value={pEn.loc || ""}
                            onChange={(e) => handleUpdateProject(projId, "loc", "en", e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                            placeholder="[EN] Ho Tram • 850 m²"
                          />
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={(lang === "en" ? pEn.loc : pJa.loc) || ""}
                          onChange={(e) => handleUpdateProject(projId, "loc", lang === "en" ? "en" : "ja", e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white mt-0.5"
                          placeholder="Ho Tram • 850 m²"
                        />
                      )}
                    </div>

                    {/* Phong cách kiến trúc */}
                    <div>
                      <label className="block text-[10px] text-slate-500 font-medium">Phong cách kiến trúc (Style):</label>
                      <input
                        type="text"
                        value={pJa.style || pEn.style || ""}
                        onChange={(e) => {
                          handleUpdateProject(projId, "style", "ja", e.target.value, true);
                        }}
                        className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white mt-0.5"
                        placeholder="Modern Tropical Zen, Minimalist Zen..."
                      />
                    </div>

                    {/* Mô tả tóm tắt của Card (Narrative) - Hỗ trợ song ngữ */}
                    <div>
                      <label className="block text-[10px] text-slate-500 font-medium">Mô tả tóm tắt (Narrative):</label>
                      {lang === "both" ? (
                        <div className="grid grid-cols-2 gap-2 mt-0.5">
                          <textarea
                            rows={2}
                            value={pJa.narrative || ""}
                            onChange={(e) => handleUpdateProject(projId, "narrative", "ja", e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                            placeholder="[JA / VI] Biệt thự ven hồ kết hợp tinh tế..."
                          />
                          <textarea
                            rows={2}
                            value={pEn.narrative || ""}
                            onChange={(e) => handleUpdateProject(projId, "narrative", "en", e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                            placeholder="[EN] Lakeside villa balancing raw concrete..."
                          />
                        </div>
                      ) : (
                        <textarea
                          rows={2}
                          value={(lang === "en" ? pEn.narrative : pJa.narrative) || ""}
                          onChange={(e) => handleUpdateProject(projId, "narrative", lang === "en" ? "en" : "ja", e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white mt-0.5"
                          placeholder="Lakeside villa balancing raw concrete..."
                        />
                      )}
                    </div>

                    {/* THÔNG SỐ CHÂN CARD (SPECS CHIPS) - CÓ THỂ THÊM HOẶC XÓA THEO YÊU CẦU */}
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-bold text-slate-700">
                          Thông số chân card ({maxSpecs} thông số):
                        </label>
                        <button
                          type="button"
                          onClick={() => handleAddProjectSpec(projId)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition"
                        >
                          <Plus size={12} />
                          <span>Thêm thông số</span>
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        {Array.from({ length: maxSpecs }).map((_, sIdx) => {
                          const valJa = specsJa[sIdx]?.v || "";
                          const valEn = specsEn[sIdx]?.v || "";

                          return (
                            <div key={`spec-${sIdx}`} className="flex items-center gap-1.5 p-1.5 bg-slate-50 rounded-lg border border-slate-200">
                              <span className="text-[10px] font-bold text-slate-500 w-5 shrink-0 text-center">
                                #{sIdx + 1}
                              </span>

                              {lang === "both" ? (
                                <div className="grid grid-cols-2 gap-1.5 flex-1">
                                  <input
                                    type="text"
                                    value={valJa}
                                    onChange={(e) => handleUpdateProjectSpecValue(projId, sIdx, "ja", e.target.value)}
                                    className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                                    placeholder="[JA] 3 Tầng • 4 PN"
                                  />
                                  <input
                                    type="text"
                                    value={valEn}
                                    onChange={(e) => handleUpdateProjectSpecValue(projId, sIdx, "en", e.target.value)}
                                    className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                                    placeholder="[EN] 3 Levels • 4 Suites"
                                  />
                                </div>
                              ) : (
                                <input
                                  type="text"
                                  value={lang === "en" ? valEn : valJa}
                                  onChange={(e) => handleUpdateProjectSpecValue(projId, sIdx, lang === "en" ? "en" : "ja", e.target.value)}
                                  className="flex-1 px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                                  placeholder={sIdx === 0 ? "3 Tầng • 4 PN" : sIdx === 1 ? "750 m²" : "Bàn Giao 2026"}
                                />
                              )}

                              <button
                                type="button"
                                onClick={() => handleDeleteProjectSpec(projId, sIdx)}
                                className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition shrink-0"
                                title="Xóa thông số này"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Nút bấm thu gọn/mở rộng chi tiết kỹ thuật */}
                  <div className="px-4 pb-4 pt-1">
                    <button
                      type="button"
                      onClick={() => setExpandedProjectId(isExpanded ? null : projId)}
                      className="w-full py-1.5 text-[11px] font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 transition"
                    >
                      {isExpanded ? "▲ Thu gọn chi tiết kỹ thuật" : "▼ Chi tiết kiến trúc & giải pháp kỹ thuật"}
                    </button>

                    {isExpanded && (
                      <div className="mt-3 p-3 bg-slate-50/80 rounded-lg border border-slate-200 space-y-2 text-xs">
                        <div>
                          <label className="block text-[10px] text-slate-500 font-medium">Giải pháp kiến trúc (Solution):</label>
                          {lang === "both" ? (
                            <div className="grid grid-cols-2 gap-2 mt-0.5">
                              <textarea
                                rows={2}
                                value={pJa.solution || ""}
                                onChange={(e) => handleUpdateProject(projId, "solution", "ja", e.target.value)}
                                className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                                placeholder="[JA / VI]..."
                              />
                              <textarea
                                rows={2}
                                value={pEn.solution || ""}
                                onChange={(e) => handleUpdateProject(projId, "solution", "en", e.target.value)}
                                className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                                placeholder="[EN]..."
                              />
                            </div>
                          ) : (
                            <textarea
                              rows={2}
                              value={(lang === "en" ? pEn.solution : pJa.solution) || ""}
                              onChange={(e) => handleUpdateProject(projId, "solution", lang === "en" ? "en" : "ja", e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white mt-0.5"
                            />
                          )}
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500 font-medium">Vật liệu chủ đạo (Materials):</label>
                          {lang === "both" ? (
                            <div className="grid grid-cols-2 gap-2 mt-0.5">
                              <textarea
                                rows={2}
                                value={pJa.materials || ""}
                                onChange={(e) => handleUpdateProject(projId, "materials", "ja", e.target.value)}
                                className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                                placeholder="[JA / VI]..."
                              />
                              <textarea
                                rows={2}
                                value={pEn.materials || ""}
                                onChange={(e) => handleUpdateProject(projId, "materials", "en", e.target.value)}
                                className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                                placeholder="[EN]..."
                              />
                            </div>
                          ) : (
                            <textarea
                              rows={2}
                              value={(lang === "en" ? pEn.materials : pJa.materials) || ""}
                              onChange={(e) => handleUpdateProject(projId, "materials", lang === "en" ? "en" : "ja", e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white mt-0.5"
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Dự án Tiêu điểm (Card lớn bên trái - Spotlight Project) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
            <span>3. Dự án Tiêu điểm Showcase (Card lớn bên trái)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tùy chỉnh toàn bộ thông tin chi tiết dự án nổi bật hiển thị ở cột bên trái của khu vực triển lãm.
          </p>
        </div>

        {/* Tên dự án & Thể loại */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tên dự án tiêu điểm (Ví dụ: THE LAKESIDE HORIZON VILLA):
            </label>
            <input
              type="text"
              value={spotlightJa?.title || spotlightEn?.title || ""}
              onChange={(e) => {
                handleUpdateSpotlightField("title", "ja", e.target.value);
                handleUpdateSpotlightField("title", "en", e.target.value);
              }}
              className="w-full px-3 py-2 text-sm font-bold uppercase tracking-wide border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="THE LAKESIDE HORIZON VILLA"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Thuộc Thể loại Project nào:
            </label>
            <select
              value={spotlightJa?.category || "villa"}
              onChange={(e) => {
                handleUpdateSpotlightField("category", "ja", e.target.value);
                handleUpdateSpotlightField("category", "en", e.target.value);
              }}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {normalizedTabsJa.filter(t => t.key !== "all").map((tab) => (
                <option key={tab.key} value={tab.key}>
                  {tab.label} ({tab.key})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Nhãn thể loại & Địa điểm song ngữ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(lang === "ja" || lang === "both") && (
            <div className="space-y-3 p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Tiếng Nhật / Tiếng Việt [JA]</span>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Nhãn thể loại (Tag):</label>
                <input
                  type="text"
                  value={spotlightJa?.catTag || ""}
                  onChange={(e) => handleUpdateSpotlightField("catTag", "ja", e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:ring-1 focus:ring-amber-500"
                  placeholder="高級リゾートヴィラ"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Địa điểm &amp; Diện tích:</label>
                <input
                  type="text"
                  value={spotlightJa?.loc || ""}
                  onChange={(e) => handleUpdateSpotlightField("loc", "ja", e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:ring-1 focus:ring-amber-500"
                  placeholder="ホーチャム · 850 m²"
                />
              </div>
            </div>
          )}

          {(lang === "en" || lang === "both") && (
            <div className="space-y-3 p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Tiếng Anh [EN]</span>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Nhãn thể loại (Tag):</label>
                <input
                  type="text"
                  value={spotlightEn?.catTag || ""}
                  onChange={(e) => handleUpdateSpotlightField("catTag", "en", e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:ring-1 focus:ring-amber-500"
                  placeholder="LUXURY RETREAT VILLA"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Địa điểm &amp; Diện tích:</label>
                <input
                  type="text"
                  value={spotlightEn?.loc || ""}
                  onChange={(e) => handleUpdateSpotlightField("loc", "en", e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:ring-1 focus:ring-amber-500"
                  placeholder="Ho Tram • 850 m²"
                />
              </div>
            </div>
          )}
        </div>

        {/* MỤC MÔ TẢ CHO CARD LỚN (NARRATIVE / DESCRIPTION) */}
        <div className="space-y-2 p-4 bg-amber-50/50 rounded-xl border border-amber-200">
          <label className="block text-xs font-bold text-amber-900">
            ★ Mục Mô tả tóm tắt cho Card lớn (Project Narrative / Description):
          </label>
          <p className="text-[11px] text-amber-700">
            Đoạn văn giới thiệu không gian và ý niệm thiết kế xuất hiện trực tiếp ngay dưới tên dự án trên Card lớn.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {(lang === "ja" || lang === "both") && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Mô tả [JA / VI]:</label>
                <textarea
                  rows={3}
                  value={spotlightJa?.narrative || ""}
                  onChange={(e) => handleUpdateSpotlightField("narrative", "ja", e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Biệt thự ven hồ kết hợp tinh tế giữa bê tông trần mộc mạc và hệ lam gỗ thông gió tự nhiên..."
                />
              </div>
            )}
            {(lang === "en" || lang === "both") && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Mô tả [EN]:</label>
                <textarea
                  rows={3}
                  value={spotlightEn?.narrative || ""}
                  onChange={(e) => handleUpdateSpotlightField("narrative", "en", e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Lakeside villa balancing raw board-formed concrete and natural timber louvers..."
                />
              </div>
            )}
          </div>
        </div>

        {/* Hình ảnh chính của Card lớn */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">
            Hình ảnh phối cảnh chính của Card lớn:
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-36 h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-900 shrink-0 relative flex items-center justify-center">
              {spotlightJa?.img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={spotlightJa.img}
                  alt={spotlightJa.title || "Project"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Eye size={24} className="text-slate-500" />
              )}
            </div>
            <div className="flex-1 space-y-2 w-full">
              <input
                type="text"
                value={spotlightJa?.img || spotlightEn?.img || ""}
                onChange={(e) => {
                  handleUpdateSpotlightField("img", "ja", e.target.value);
                  handleUpdateSpotlightField("img", "en", e.target.value);
                }}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="https://... hoặc bấm tải ảnh bên dưới"
              />
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg cursor-pointer transition shadow-sm">
                <Upload size={13} />
                <span>Tải ảnh dự án lên</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUploadSpotlightImage(file);
                  }}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Giải pháp kiến trúc & Vật liệu chủ đạo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              🏛 Giải pháp kiến trúc &amp; Vi khí hậu (Solution):
            </label>
            {(lang === "ja" || lang === "both") && (
              <textarea
                rows={2}
                value={spotlightJa?.solution || ""}
                onChange={(e) => handleUpdateSpotlightField("solution", "ja", e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-amber-500"
                placeholder="Giải pháp [JA / VI]..."
              />
            )}
            {(lang === "en" || lang === "both") && (
              <textarea
                rows={2}
                value={spotlightEn?.solution || ""}
                onChange={(e) => handleUpdateSpotlightField("solution", "en", e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-amber-500"
                placeholder="Solution [EN]..."
              />
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              🪵 Vật liệu hoàn thiện chủ đạo (Materials):
            </label>
            {(lang === "ja" || lang === "both") && (
              <textarea
                rows={2}
                value={spotlightJa?.materials || ""}
                onChange={(e) => handleUpdateSpotlightField("materials", "ja", e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-amber-500"
                placeholder="Vật liệu [JA / VI]..."
              />
            )}
            {(lang === "en" || lang === "both") && (
              <textarea
                rows={2}
                value={spotlightEn?.materials || ""}
                onChange={(e) => handleUpdateSpotlightField("materials", "en", e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-amber-500"
                placeholder="Materials [EN]..."
              />
            )}
          </div>
        </div>

        {/* Gói hồ sơ bàn giao (Deliverables Checklist) */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700">
              ✓ Gói hồ sơ bàn giao của Card lớn ({delivCount} mục):
            </label>
            <button
              type="button"
              onClick={handleAddDeliverable}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md border border-emerald-200 transition"
            >
              <Plus size={13} />
              <span>Thêm mục hồ sơ</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Array.from({ length: delivCount }).map((_, idx) => (
              <div
                key={`deliv-${idx}`}
                className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2"
              >
                <div className="flex-1 space-y-1.5">
                  {(lang === "ja" || lang === "both") && (
                    <input
                      type="text"
                      value={deliverablesJa[idx] || ""}
                      onChange={(e) => handleUpdateDeliverable(idx, "ja", e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      placeholder="Mục hồ sơ [JA / VI]"
                    />
                  )}
                  {(lang === "en" || lang === "both") && (
                    <input
                      type="text"
                      value={deliverablesEn[idx] || ""}
                      onChange={(e) => handleUpdateDeliverable(idx, "en", e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      placeholder="Deliverable item [EN]"
                    />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteDeliverable(idx)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                  title="Xóa mục này"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* THÔNG SỐ KỸ THUẬT CHÂN CARD LỚN - CÓ TÍNH NĂNG THÊM / XÓA THÔNG SỐ */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700">
              📊 Chỉ số kỹ thuật nổi bật chân Card lớn ({highlightsCount} thông số):
            </label>
            <button
              type="button"
              onClick={handleAddHighlight}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md border border-emerald-200 transition"
            >
              <Plus size={13} />
              <span>Thêm thông số</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {Array.from({ length: highlightsCount }).map((_, idx) => {
              const hJa = keyHighlightsJa[idx] || {};
              const hEn = keyHighlightsEn[idx] || {};

              return (
                <div key={`hl-${idx}`} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 relative group">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-700">Thông số #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteHighlight(idx)}
                      className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                      title="Xóa thông số này"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500">Tên nhãn:</label>
                    <input
                      type="text"
                      value={(lang === "en" ? hEn.label : hJa.label) || ""}
                      onChange={(e) => handleUpdateHighlight(idx, "label", lang === "en" ? "en" : "ja", e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                      placeholder="Thiết kế, Đặc trưng..."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500">Giá trị nổi bật:</label>
                    <input
                      type="text"
                      value={(lang === "en" ? hEn.value : hJa.value) || ""}
                      onChange={(e) => handleUpdateHighlight(idx, "value", lang === "en" ? "en" : "ja", e.target.value)}
                      className="w-full px-2 py-1 text-xs font-bold text-emerald-600 border border-slate-300 rounded bg-white"
                      placeholder="25-35 Ngày, 18m..."
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Buttons & Hotline */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block"></span>
          <span>4. Các nút bấm &amp; Hotline tương tác Showcase</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <BilingualField
            label="Nút phóng to ảnh (Zoom)"
            path={["info", "btnZoom"]}
            contentJa={contentJa}
            contentEn={contentEn}
            updateField={updateField}
            activeLang={lang}
          />
          <BilingualField
            label="Nút tư vấn dự án (Consult)"
            path={["info", "btnConsult"]}
            contentJa={contentJa}
            contentEn={contentEn}
            updateField={updateField}
            activeLang={lang}
          />
          <BilingualField
            label="Text Hotline tư vấn"
            path={["info", "hotlineText"]}
            contentJa={contentJa}
            contentEn={contentEn}
            updateField={updateField}
            activeLang={lang}
          />
          <BilingualField
            label="Nút xem chi tiết (View Detail)"
            path={["info", "btnViewDetail"]}
            contentJa={contentJa}
            contentEn={contentEn}
            updateField={updateField}
            activeLang={lang}
          />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   08. PRICING SECTION FORM
   ------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------
   10. PRICING SECTION FORM (Báo giá minh bạch)
   ------------------------------------------------------------------------- */
function PricingForm({
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

  const defaultTiersJa = getDefaultPricingTiers("ja");
  const defaultTiersEn = getDefaultPricingTiers("en");

  const getRawTiers = (content: any, defaultTiers: any[]) => {
    if (Array.isArray(content?.tiers) && content.tiers.length > 0) {
      return content.tiers;
    }
    if (content?.tier1 || content?.tier2 || content?.tier3) {
      const dynamicTiers: any[] = [];
      Object.keys(content).forEach((k) => {
        if (k.startsWith("tier") && typeof content[k] === "object" && content[k] !== null) {
          dynamicTiers.push({ id: k, ...content[k] });
        }
      });
      if (dynamicTiers.length > 0) return dynamicTiers;
    }
    return defaultTiers;
  };

  const rawTiersJa = getRawTiers(contentJa, defaultTiersJa);
  const rawTiersEn = getRawTiers(contentEn, defaultTiersEn);
  const count = Math.max(rawTiersJa.length, rawTiersEn.length);

  const normalizedTiersJa = Array.from({ length: count }, (_, i) => rawTiersJa[i] || {
    id: `tier-${Date.now()}-${i}`,
    badge: "新規プラン",
    name: "プラン名",
    sub: "プラン概要説明",
    price: "100,000",
    unit: "円〜 / 式",
    commitTime: "納期: 5〜7日",
    commitSupport: "サポート対応",
    features: ["8K解像度高品質パース納品", "マテリアル選定表付属"],
    btnText: "申し込む",
    isFeatured: false,
  });

  const normalizedTiersEn = Array.from({ length: count }, (_, i) => rawTiersEn[i] || {
    ...normalizedTiersJa[i],
    badge: "New Package",
    name: "Package Name",
    sub: "Package Summary",
    features: ["8K High-Resolution Perspectives", "Material Specification Matrix"],
    btnText: "Select Plan",
  });

  const handleUpdateTierField = (idx: number, field: string, langKey: "ja" | "en", val: any) => {
    if (langKey === "ja") {
      const updated = [...normalizedTiersJa];
      updated[idx] = { ...updated[idx], [field]: val };
      updateField("ja", ["tiers"], updated);
      if (field === "price" || field === "unit" || field === "isFeatured") {
        const updatedEn = [...normalizedTiersEn];
        updatedEn[idx] = { ...updatedEn[idx], [field]: val };
        updateField("en", ["tiers"], updatedEn);
      }
    } else {
      const updated = [...normalizedTiersEn];
      updated[idx] = { ...updated[idx], [field]: val };
      updateField("en", ["tiers"], updated);
      if (field === "price" || field === "unit" || field === "isFeatured") {
        const updatedJa = [...normalizedTiersJa];
        updatedJa[idx] = { ...updatedJa[idx], [field]: val };
        updateField("ja", ["tiers"], updatedJa);
      }
    }
  };

  const handleAddTier = () => {
    const newId = `tier-${Date.now().toString().slice(-4)}`;
    const newTierJa = {
      id: newId,
      badge: "新規プラン",
      name: `プラン 0${count + 1}: 新規設計パッケージ`,
      sub: "ご要望に合わせた柔軟なカスタムプラン。",
      price: "200,000",
      unit: "円〜 / 式",
      commitTime: "納期: 7〜10営業日",
      commitSupport: "サポート: 専任KTS伴走",
      features: [
        "8K解像度高品質パース納品",
        "基本平面計画＆ゾーニング図面",
        "修正対応＆技術相談サポート",
      ],
      btnText: "プランについて相談する",
      isFeatured: false,
    };
    const newTierEn = {
      id: newId,
      badge: "NEW PACKAGE",
      name: `Package 0${count + 1}: Custom Design Plan`,
      sub: "Flexible customized architectural design solution.",
      price: "$1,500",
      unit: "USD / Project",
      commitTime: "Timeline: 7-10 Business Days",
      commitSupport: "Support: Dedicated Architect",
      features: [
        "8K High-Resolution Perspective Renders",
        "Schematic 2D Floor Plan & Space Zoning",
        "Revisions & Ongoing Technical Advisory",
      ],
      btnText: "Inquire Package",
      isFeatured: false,
    };

    const updatedJa = [...normalizedTiersJa, newTierJa];
    const updatedEn = [...normalizedTiersEn, newTierEn];
    updateField("ja", ["tiers"], updatedJa);
    updateField("en", ["tiers"], updatedEn);
    toast("Đã thêm gói báo giá mới!", "success");
  };

  const handleDeleteTier = (idx: number) => {
    if (count <= 1) {
      toast("Phải giữ lại ít nhất 1 gói báo giá", "info");
      return;
    }
    const updatedJa = normalizedTiersJa.filter((_, i) => i !== idx);
    const updatedEn = normalizedTiersEn.filter((_, i) => i !== idx);
    updateField("ja", ["tiers"], updatedJa);
    updateField("en", ["tiers"], updatedEn);
    toast("Đã xóa gói báo giá", "info");
  };

  // Quản lý Features Checklist (Ảnh 2)
  const handleUpdateFeature = (tierIdx: number, fIdx: number, langKey: "ja" | "en", val: string) => {
    if (langKey === "ja") {
      const tier = normalizedTiersJa[tierIdx];
      const nextFeatures = [...(tier.features || [])];
      nextFeatures[fIdx] = val;
      handleUpdateTierField(tierIdx, "features", "ja", nextFeatures);
    } else {
      const tier = normalizedTiersEn[tierIdx];
      const nextFeatures = [...(tier.features || [])];
      nextFeatures[fIdx] = val;
      handleUpdateTierField(tierIdx, "features", "en", nextFeatures);
    }
  };

  const handleAddFeature = (tierIdx: number) => {
    const tierJa = normalizedTiersJa[tierIdx];
    const tierEn = normalizedTiersEn[tierIdx];
    const nextJa = [...(tierJa.features || []), "新しい特典・機能項目"];
    const nextEn = [...(tierEn.features || []), "New Feature / Deliverable"];
    handleUpdateTierField(tierIdx, "features", "ja", nextJa);
    handleUpdateTierField(tierIdx, "features", "en", nextEn);
    toast("Đã thêm đặc quyền / tính năng mới!", "success");
  };

  const handleDeleteFeature = (tierIdx: number, fIdx: number) => {
    const tierJa = normalizedTiersJa[tierIdx];
    const tierEn = normalizedTiersEn[tierIdx];
    const nextJa = (tierJa.features || []).filter((_: any, i: number) => i !== fIdx);
    const nextEn = (tierEn.features || []).filter((_: any, i: number) => i !== fIdx);
    handleUpdateTierField(tierIdx, "features", "ja", nextJa);
    handleUpdateTierField(tierIdx, "features", "en", nextEn);
    toast("Đã xóa tính năng", "info");
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-3">
          Tiêu đề Section Báo giá minh bạch
        </h2>

        <BilingualField
          label="Tiêu đề Section Báo giá"
          path={["info", "title"]}
          contentJa={contentJa}
          contentEn={contentEn}
          updateField={updateField}
          activeLang={lang}
        />

        <BilingualField
          label="Đoạn mô tả phụ (Subtitle)"
          path={["info", "sub"]}
          contentJa={contentJa}
          contentEn={contentEn}
          updateField={updateField}
          activeLang={lang}
          isTextArea
          rows={2}
        />
      </div>

      {/* Pricing Tiers Management */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <DollarSign size={18} className="text-emerald-600" />
              <span>Danh sách các Gói Báo giá ({count} gói)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Bạn có thể thêm gói mới, xóa gói, đánh dấu gói nổi bật và quản lý chi tiết các đặc quyền &amp; cam kết.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddTier}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition"
          >
            <Plus size={15} />
            <span>Thêm gói báo giá mới</span>
          </button>
        </div>

        {/* Grid các Gói Báo Giá */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: count }).map((_, idx) => {
            const tierJa = normalizedTiersJa[idx] || {};
            const tierEn = normalizedTiersEn[idx] || {};
            const featuresJa: string[] = Array.isArray(tierJa.features) ? tierJa.features : [];
            const featuresEn: string[] = Array.isArray(tierEn.features) ? tierEn.features : [];
            const fCount = Math.max(featuresJa.length, featuresEn.length);

            return (
              <div
                key={tierJa.id || `tier-${idx}`}
                className={`bg-white p-5 rounded-xl border shadow-sm space-y-4 transition ${tierJa.isFeatured ? "border-amber-400 ring-2 ring-amber-100" : "border-slate-200 hover:border-slate-300"
                  }`}
              >
                {/* Header Card */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <label className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(tierJa.isFeatured)}
                        onChange={(e) => handleUpdateTierField(idx, "isFeatured", "ja", e.target.checked)}
                        className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span>Gói Nổi Bật (Khuyên dùng)</span>
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteTier(idx)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Xóa gói báo giá này"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Huy hiệu & Tên gói */}
                <div className="space-y-2">
                  <div className="grid grid-cols-1 gap-2">
                    {(lang === "ja" || lang === "both") && (
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Huy hiệu gói [JA / VI]:
                        </label>
                        <input
                          type="text"
                          value={tierJa.badge || ""}
                          onChange={(e) => handleUpdateTierField(idx, "badge", "ja", e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-emerald-500"
                          placeholder="おすすめプラン, パース制作..."
                        />
                      </div>
                    )}
                    {(lang === "en" || lang === "both") && (
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Huy hiệu gói [EN]:
                        </label>
                        <input
                          type="text"
                          value={tierEn.badge || ""}
                          onChange={(e) => handleUpdateTierField(idx, "badge", "en", e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-emerald-500"
                          placeholder="RECOMMENDED, FULL PACKAGE..."
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {(lang === "ja" || lang === "both") && (
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Tên gói [JA / VI]:
                        </label>
                        <input
                          type="text"
                          value={tierJa.name || ""}
                          onChange={(e) => handleUpdateTierField(idx, "name", "ja", e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs font-bold text-slate-800 border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-emerald-500"
                          placeholder="プラン 01: 8K 3DCG 外観・内観パース"
                        />
                      </div>
                    )}
                    {(lang === "en" || lang === "both") && (
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Tên gói [EN]:
                        </label>
                        <input
                          type="text"
                          value={tierEn.name || ""}
                          onChange={(e) => handleUpdateTierField(idx, "name", "en", e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs font-bold text-slate-800 border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-emerald-500"
                          placeholder="Package 01: 8K 3D Perspectives"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Mô tả tóm tắt */}
                <div className="grid grid-cols-1 gap-2">
                  {(lang === "ja" || lang === "both") && (
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Mô tả tóm tắt [JA / VI]:
                      </label>
                      <textarea
                        rows={2}
                        value={tierJa.sub || ""}
                        onChange={(e) => handleUpdateTierField(idx, "sub", "ja", e.target.value)}
                        className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-emerald-500"
                        placeholder="Mô tả phạm vi áp dụng..."
                      />
                    </div>
                  )}
                  {(lang === "en" || lang === "both") && (
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Mô tả tóm tắt [EN]:
                      </label>
                      <textarea
                        rows={2}
                        value={tierEn.sub || ""}
                        onChange={(e) => handleUpdateTierField(idx, "sub", "en", e.target.value)}
                        className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-emerald-500"
                        placeholder="Scope description..."
                      />
                    </div>
                  )}
                </div>

                {/* Đơn giá & Đơn vị tính */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Đơn giá:
                    </label>
                    <input
                      type="text"
                      value={tierJa.price || tierEn.price || ""}
                      onChange={(e) => handleUpdateTierField(idx, "price", "ja", e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs font-bold text-emerald-700 border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-emerald-500"
                      placeholder="180,000"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Đơn vị tính:
                    </label>
                    <input
                      type="text"
                      value={tierJa.unit || tierEn.unit || ""}
                      onChange={(e) => handleUpdateTierField(idx, "unit", "ja", e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-emerald-500"
                      placeholder="円〜 / 式, VNĐ/m²..."
                    />
                  </div>
                </div>

                {/* Cam kết tiến độ & hỗ trợ */}
                <div className="space-y-2">
                  {(lang === "ja" || lang === "both") && (
                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Cam kết tiến độ [JA / VI]:
                        </label>
                        <input
                          type="text"
                          value={tierJa.commitTime || ""}
                          onChange={(e) => handleUpdateTierField(idx, "commitTime", "ja", e.target.value)}
                          className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded bg-white"
                          placeholder="納期: 5〜7営業日"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Cam kết hỗ trợ [JA / VI]:
                        </label>
                        <input
                          type="text"
                          value={tierJa.commitSupport || ""}
                          onChange={(e) => handleUpdateTierField(idx, "commitSupport", "ja", e.target.value)}
                          className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded bg-white"
                          placeholder="修正: 2回まで無料"
                        />
                      </div>
                    </div>
                  )}

                  {(lang === "en" || lang === "both") && (
                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Cam kết tiến độ [EN]:
                        </label>
                        <input
                          type="text"
                          value={tierEn.commitTime || ""}
                          onChange={(e) => handleUpdateTierField(idx, "commitTime", "en", e.target.value)}
                          className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded bg-white"
                          placeholder="Timeline: 5-7 Business Days"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Cam kết hỗ trợ [EN]:
                        </label>
                        <input
                          type="text"
                          value={tierEn.commitSupport || ""}
                          onChange={(e) => handleUpdateTierField(idx, "commitSupport", "en", e.target.value)}
                          className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded bg-white"
                          placeholder="Revisions: 2 Free Rounds"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* TÍNH NĂNG ẢNH 2: DANH SÁCH ĐẶC QUYỀN & TÍNH NĂNG (FEATURES CHECKLIST) */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                      <span className="text-amber-600">✓</span>
                      <span>Đặc quyền &amp; Tính năng ({fCount})</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAddFeature(idx)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded transition"
                    >
                      <Plus size={12} />
                      <span>Thêm dòng</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {Array.from({ length: fCount }).map((_, fIdx) => (
                      <div
                        key={`f-${idx}-${fIdx}`}
                        className="flex items-start gap-1.5 p-2 bg-slate-50/80 rounded-lg border border-slate-200"
                      >
                        <span className="text-amber-500 font-bold text-xs mt-1 shrink-0">✓</span>
                        <div className="flex-1 space-y-1">
                          {(lang === "ja" || lang === "both") && (
                            <input
                              type="text"
                              value={featuresJa[fIdx] || ""}
                              onChange={(e) => handleUpdateFeature(idx, fIdx, "ja", e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                              placeholder="8K解像度納品（印刷・Web両対応）..."
                            />
                          )}
                          {(lang === "en" || lang === "both") && (
                            <input
                              type="text"
                              value={featuresEn[fIdx] || ""}
                              onChange={(e) => handleUpdateFeature(idx, fIdx, "en", e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                              placeholder="8K Print & Web Resolution Deliverables..."
                            />
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteFeature(idx, fIdx)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded transition shrink-0"
                          title="Xóa dòng tính năng này"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nút bấm CTA */}
                <div className="pt-2 border-t border-slate-100">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Nút Đăng ký (CTA Button Text):
                  </label>
                  <div className="grid grid-cols-1 gap-1.5">
                    {(lang === "ja" || lang === "both") && (
                      <input
                        type="text"
                        value={tierJa.btnText || ""}
                        onChange={(e) => handleUpdateTierField(idx, "btnText", "ja", e.target.value)}
                        className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded bg-white"
                        placeholder="プラン01を相談する"
                      />
                    )}
                    {(lang === "en" || lang === "both") && (
                      <input
                        type="text"
                        value={tierEn.btnText || ""}
                        onChange={(e) => handleUpdateTierField(idx, "btnText", "en", e.target.value)}
                        className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded bg-white"
                        placeholder="Inquire Package"
                      />
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
    if (langKey === "ja") {
      const updated = [...normalizedBrandsJa];
      updated[idx] = { ...updated[idx], [field]: val };
      updateField("ja", ["brands"], updated);
      if (field === "img" || field === "name") {
        const updatedEn = [...normalizedBrandsEn];
        updatedEn[idx] = { ...updatedEn[idx], [field]: val };
        updateField("en", ["brands"], updatedEn);
      }
    } else {
      const updated = [...normalizedBrandsEn];
      updated[idx] = { ...updated[idx], [field]: val };
      updateField("en", ["brands"], updated);
      if (field === "img" || field === "name") {
        const updatedJa = [...normalizedBrandsJa];
        updatedJa[idx] = { ...updatedJa[idx], [field]: val };
        updateField("ja", ["brands"], updatedJa);
      }
    }
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
              Danh sách các thương hiệu chuyển động ngang vô tận. Bạn có thể thêm, sửa tên, phân khúc và tải ảnh nền/dự án của từng đối tác.
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

                {/* Lĩnh vực phụ đề */}
                <div className="grid grid-cols-1 gap-2">
                  {(lang === "ja" || lang === "both") && (
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Lĩnh vực / Phân loại [JA / VI]:
                      </label>
                      <input
                        type="text"
                        value={jaItem.sub || ""}
                        onChange={(e) => handleUpdateBrandField(idx, "sub", "ja", e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Luxury Real Estate"
                      />
                    </div>
                  )}
                  {(lang === "en" || lang === "both") && (
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Lĩnh vực / Phân loại [EN]:
                      </label>
                      <input
                        type="text"
                        value={enItem.sub || ""}
                        onChange={(e) => handleUpdateBrandField(idx, "sub", "en", e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Luxury Real Estate"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
