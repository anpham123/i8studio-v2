"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { useToast } from "@/components/admin/Toast";
import {
  Sparkles,
  AlertCircle,
  GitCommit,
  LayoutGrid,
  FolderCheck,
  ShieldCheck,
  Compass,
  DollarSign,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  CheckCircle2,
  Clock,
  Layers,
  Globe,
  ArrowUpRight,
  Building2,
  ArrowUp,
  ArrowDown,
  Palette,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Sliders,
  Megaphone,
} from "lucide-react";

interface SectionSummary {
  key: string;
  order: number;
  label: string;
  subLabel: string;
  description: string;
  anchor: string;
  backgroundColor?: string;
  visible?: boolean;
  isCustomized: boolean;
  updatedAt: string | null;
}

const SECTION_ICONS: Record<string, React.ElementType> = {
  hero: Sparkles,
  "pain-points": AlertCircle,
  solutions: CheckCircle2,
  workflow: GitCommit,
  deliverables: FolderCheck,
  "services-bento": LayoutGrid,
  clients: ShieldCheck,
  applications: Layers,
  partners: Building2,
  gallery: Compass,
  cta: Megaphone,
  pricing: DollarSign,
};

const COLOR_PRESETS = [
  { name: "Section 4 Kem Sáng (#f7f4ed)", hex: "#f7f4ed" },
  { name: "Alabaster Sáng Ấm (#fdfcf9)", hex: "#fdfcf9" },
  { name: "Deep Obsidian", hex: "#07080a" },
  { name: "Midnight Charcoal", hex: "#0b0d11" },
  { name: "Dark Navy Tint", hex: "#0d1017" },
  { name: "Architectural Slate", hex: "#12151c" },
  { name: "Pure Black", hex: "#000000" },
];

export default function AdminLandingPageOverview() {
  const { toast } = useToast();
  const [sections, setSections] = useState<SectionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/landing-page", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setSections(data.data);
        setHasChanges(false);
      }
    } catch (e) {
      console.error("Failed to load sections overview", e);
      toast("Không thể tải danh sách Section", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  // Di chuyển thứ tự section lên
  const moveUp = (index: number) => {
    if (index <= 0) return;
    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[index - 1];
    newSections[index - 1] = temp;
    // cập nhật lại order index
    newSections.forEach((s, idx) => (s.order = idx + 1));
    setSections(newSections);
    setHasChanges(true);
  };

  // Di chuyển thứ tự section xuống
  const moveDown = (index: number) => {
    if (index >= sections.length - 1) return;
    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[index + 1];
    newSections[index + 1] = temp;
    // cập nhật lại order index
    newSections.forEach((s, idx) => (s.order = idx + 1));
    setSections(newSections);
    setHasChanges(true);
  };

  // Đổi màu nền của section
  const changeBackgroundColor = (key: string, color: string) => {
    setSections((prev) =>
      prev.map((s) => (s.key === key ? { ...s, backgroundColor: color } : s))
    );
    setHasChanges(true);
  };

  // Bật/tắt hiển thị section
  const toggleVisibility = (key: string) => {
    setSections((prev) =>
      prev.map((s) => (s.key === key ? { ...s, visible: !s.visible } : s))
    );
    setHasChanges(true);
  };

  // Lưu thứ tự và màu nền
  const handleSaveLayout = async () => {
    setSaving(true);
    try {
      const order = sections.map((s) => s.key);
      const backgroundColors: Record<string, string> = {};
      const visible: Record<string, boolean> = {};

      sections.forEach((s) => {
        backgroundColors[s.key] = s.backgroundColor || "#0b0d11";
        visible[s.key] = s.visible !== false;
      });

      const res = await fetch("/api/landing-page", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order, backgroundColors, visible }),
      });

      const result = await res.json();
      if (result.success) {
        toast("Đã lưu thứ tự và màu nền các Section thành công!", "success");
        setHasChanges(false);
      } else {
        throw new Error(result.error || "Failed to save");
      }
    } catch (e: any) {
      console.error("Save layout failed", e);
      toast(e.message || "Lưu thất bại", "error");
    } finally {
      setSaving(false);
    }
  };

  // Đặt lại mặc định
  const handleResetDefaults = () => {
    if (!confirm("Bạn có chắc muốn đặt lại thứ tự các Section về mặc định?")) return;
    const defaultKeys = [
      "hero",
      "pain-points",
      "solutions",
      "workflow",
      "deliverables",
      "services-bento",
      "applications",
      "partners",
      "gallery",
      "cta",
    ];

    const map = new Map(sections.map((s) => [s.key, s]));
    const reordered: SectionSummary[] = [];

    defaultKeys.forEach((k, idx) => {
      const existing = map.get(k);
      if (existing) {
        reordered.push({ ...existing, order: idx + 1 });
      }
    });

    setSections(reordered);
    setHasChanges(true);
  };

  const customizedCount = sections.filter((s) => s.isCustomized).length;

  return (
    <AdminShell title="Quản lý Landing Page">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <span>Admin</span>
              <ChevronRight size={14} />
              <span className="text-slate-800 font-medium">Landing Page</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Quản lý Landing Page (Thứ tự, Màu nền & Nội dung)
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Tùy biến số thứ tự các section, phối màu nền độc lập và chỉnh sửa nội dung đa ngôn ngữ EN/JA.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={fetchSections}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
              title="Làm mới dữ liệu"
            >
              <RefreshCw size={15} className={loading ? "animate-spin text-blue-600" : ""} />
              <span>Làm mới</span>
            </button>

            <Link
              href="/ja/landingpage"
              target="_blank"
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors shadow-sm"
            >
              <Globe size={15} />
              <span>Xem trang tiếng Nhật</span>
              <ArrowUpRight size={14} />
            </Link>

            <Link
              href="/en/landingpage"
              target="_blank"
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors shadow-sm"
            >
              <Globe size={15} />
              <span>Xem trang tiếng Anh</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* Floating / Sticky Save Banner when changed */}
        {hasChanges && (
          <div className="sticky top-4 z-40 bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 rounded-xl shadow-lg flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <Sliders size={20} className="shrink-0" />
              <div>
                <p className="text-sm font-bold">Bạn đã thay đổi Thứ tự hoặc Màu nền Section</p>
                <p className="text-xs text-amber-100">
                  Nhấn "Lưu cấu hình Layout" để cập nhật trực tiếp lên trang Landing Page.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetDefaults}
                className="px-3 py-1.5 text-xs font-semibold bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                Đặt lại
              </button>
              <button
                onClick={handleSaveLayout}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-white text-amber-800 rounded-lg shadow-md hover:bg-amber-50 transition-all disabled:opacity-50"
              >
                <Save size={14} className={saving ? "animate-spin" : ""} />
                <span>{saving ? "Đang lưu..." : "Lưu cấu hình Layout"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Layers size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tổng số Section</p>
              <p className="text-xl font-bold text-slate-800">{sections.length} Section</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Trạng thái lưu DB</p>
              <p className="text-xl font-bold text-slate-800">
                {customizedCount} / {sections.length}{" "}
                <span className="text-xs font-normal text-slate-500">đã tùy biến</span>
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Globe size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ngôn ngữ áp dụng</p>
              <p className="text-xl font-bold text-slate-800">Tiếng Anh (EN) & Tiếng Nhật (JA)</p>
            </div>
          </div>
        </div>

        {/* Sections Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Danh sách Section (Thứ tự hiển thị & Màu nền)
            </h2>
            <p className="text-xs text-slate-500">
              Dùng nút <strong>↑</strong> và <strong>↓</strong> để thay đổi vị trí, hoặc bấm vào ô màu để đổi màu nền cho từng section.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <RotateCcw size={13} />
              <span>Đặt lại thứ tự gốc</span>
            </button>
            <button
              onClick={handleSaveLayout}
              disabled={saving || !hasChanges}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg shadow-sm transition-all ${
                hasChanges
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              <Save size={14} className={saving ? "animate-spin" : ""} />
              <span>{saving ? "Đang lưu..." : "Lưu thứ tự & Màu nền"}</span>
            </button>
          </div>
        </div>

        {/* Sections List */}
        <div className="space-y-3">
          {sections.map((sec, idx) => {
            const Icon = SECTION_ICONS[sec.key] || Layers;
            const currentBg = sec.backgroundColor || "#0b0d11";
            const isVisible = sec.visible !== false;
            const validHex = (currentBg && currentBg.startsWith("#") && (currentBg.length === 7 || currentBg.length === 4))
              ? currentBg
              : "#0b0d11";

            return (
              <div
                key={sec.key}
                className={`bg-white rounded-xl border transition-all p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 group ${
                  !isVisible ? "opacity-60 border-dashed border-slate-300" : "border-slate-200 hover:border-blue-400 hover:shadow-sm"
                }`}
              >
                {/* Left: Reorder Controls + Icon + Info */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  {/* Up / Down buttons */}
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => moveUp(idx)}
                      disabled={idx === 0}
                      title="Chuyển lên trên"
                      className="p-1 rounded bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-700 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDown(idx)}
                      disabled={idx === sections.length - 1}
                      title="Chuyển xuống dưới"
                      className="p-1 rounded bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-700 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>

                  {/* Order Badge & Icon */}
                  <div className="relative shrink-0">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-inner transition-colors"
                      style={{ background: currentBg, backgroundColor: validHex }}
                    >
                      <Icon size={22} className="opacity-90" />
                    </div>
                    <span className="absolute -top-1.5 -left-1.5 bg-blue-600 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                      {idx + 1}
                    </span>
                  </div>

                  {/* Section Labels */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                        #{idx + 1} · {sec.key}
                      </span>
                      {sec.isCustomized ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                          <CheckCircle2 size={10} />
                          Đã lưu DB
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200 shrink-0">
                          Mặc định
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-700 transition-colors">
                      {sec.label}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{sec.subLabel}</p>
                  </div>
                </div>

                {/* Right: Color Picker Controls + Visibility + Edit Button */}
                <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center flex-wrap">
                  {/* Background Color Picker & Presets */}
                  <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                    <Palette size={14} className="text-slate-400 ml-1 shrink-0" />
                    <span className="text-[11px] font-medium text-slate-600 shrink-0">Màu nền:</span>
                    {/* Native color picker */}
                    <input
                      type="color"
                      value={validHex}
                      onChange={(e) => changeBackgroundColor(sec.key, e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer border border-slate-300 bg-transparent p-0 shrink-0"
                      title="Chọn mã màu tùy ý"
                    />
                    <input
                      type="text"
                      value={currentBg}
                      onChange={(e) => changeBackgroundColor(sec.key, e.target.value)}
                      className="text-[11px] font-mono text-slate-700 w-24 sm:w-28 px-1.5 py-0.5 border border-slate-200 rounded bg-white focus:ring-1 focus:ring-blue-500 outline-none truncate"
                      title={currentBg}
                      placeholder="#000000"
                    />

                    {/* Quick Presets Dropdown/Dots */}
                    <div className="hidden lg:flex items-center gap-1 ml-1 pl-2 border-l border-slate-200">
                      {COLOR_PRESETS.map((p) => (
                        <button
                          key={p.hex}
                          type="button"
                          onClick={() => changeBackgroundColor(sec.key, p.hex)}
                          className={`w-4 h-4 rounded-full border transition-transform ${
                            currentBg.toLowerCase() === p.hex.toLowerCase()
                              ? "scale-125 border-blue-500 ring-2 ring-blue-300"
                              : "border-slate-300 hover:scale-110"
                          }`}
                          style={{ backgroundColor: p.hex }}
                          title={p.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Visibility Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleVisibility(sec.key)}
                    className={`p-2 rounded-lg border text-xs transition-colors ${
                      isVisible
                        ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                        : "bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                    }`}
                    title={isVisible ? "Đang hiển thị ngoài web" : "Đang bị ẩn ngoài web"}
                  >
                    {isVisible ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>

                  {/* View on Page Anchor */}
                  <Link
                    href={`/ja/landingpage${sec.anchor}`}
                    target="_blank"
                    className="text-xs text-slate-500 hover:text-slate-800 p-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
                    title="Xem vị trí trên trang"
                  >
                    <ExternalLink size={15} />
                  </Link>

                  {/* Edit Detail Button */}
                  <Link
                    href={`/admin/landingpage/${sec.key}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                  >
                    <span>Sửa nội dung</span>
                    <ChevronRight size={13} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminShell>
  );
}

