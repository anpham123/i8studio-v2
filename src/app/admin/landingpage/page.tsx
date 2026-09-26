"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
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
} from "lucide-react";

interface SectionSummary {
  key: string;
  order: number;
  label: string;
  subLabel: string;
  description: string;
  anchor: string;
  isCustomized: boolean;
  updatedAt: string | null;
}

const SECTION_ICONS: Record<string, React.ElementType> = {
  hero: Sparkles,
  "pain-points": AlertCircle,
  workflow: GitCommit,
  deliverables: FolderCheck,
  "services-bento": LayoutGrid,
  clients: ShieldCheck,
  applications: Layers,
  partners: Building2,
  gallery: Compass,
  pricing: DollarSign,
};

export default function AdminLandingPageOverview() {
  const [sections, setSections] = useState<SectionSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/landing-page", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setSections(data.data);
      }
    } catch (e) {
      console.error("Failed to load sections overview", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

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
              Quản lý Landing Page (Đa ngôn ngữ Anh / Nhật)
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Chỉnh sửa và đồng bộ nội dung các Section trên trang đích với giao diện trực quan song ngữ EN/JA.
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

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Layers size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tổng số Section</p>
              <p className="text-xl font-bold text-slate-800">8 Section</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Trạng thái lưu DB</p>
              <p className="text-xl font-bold text-slate-800">
                {customizedCount} / 8 <span className="text-xs font-normal text-slate-500">đã tùy biến</span>
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

        {/* Sections Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800 uppercase tracking-wide">
              Danh mục các Section của Landing Page
            </h2>
            <span className="text-xs text-slate-500">
              Chọn từng section để chỉnh sửa nội dung chi tiết
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sections.map((sec) => {
              const Icon = SECTION_ICONS[sec.key] || Layers;
              return (
                <div
                  key={sec.key}
                  className="bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all p-5 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shrink-0">
                          <Icon size={20} />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
                            Section #{sec.order}
                          </span>
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                            {sec.label}
                          </h3>
                        </div>
                      </div>

                      {sec.isCustomized ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                          <CheckCircle2 size={12} />
                          Đã lưu DB
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                          Mặc định gốc
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-medium text-slate-700">{sec.subLabel}</p>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {sec.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      {sec.updatedAt ? (
                        <>
                          <Clock size={12} />
                          <span>Cập nhật: {new Date(sec.updatedAt).toLocaleDateString("vi-VN")}</span>
                        </>
                      ) : (
                        <span>Chưa qua chỉnh sửa</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/ja/landingpage${sec.anchor}`}
                        target="_blank"
                        className="text-xs text-slate-500 hover:text-slate-800 p-1.5 rounded hover:bg-slate-100 transition-colors"
                        title="Xem vị trí trên trang"
                      >
                        <ExternalLink size={15} />
                      </Link>
                      <Link
                        href={`/admin/landingpage/${sec.key}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                      >
                        <span>Chỉnh sửa nội dung</span>
                        <ChevronRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
