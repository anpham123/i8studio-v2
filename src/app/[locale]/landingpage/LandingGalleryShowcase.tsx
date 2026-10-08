"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Grid, ArrowRight, Phone, Check, MapPin, Layers, ChevronDown, ChevronUp, Tag, Maximize2, X, ZoomIn } from "lucide-react";

export interface FeatureBlockItem {
  id?: string;
  title: string;
  content: string;
}

export interface ProjectItem {
  id?: string;
  category?: string;
  catTag?: string;
  title: string;
  loc?: string;
  style?: string;
  img: string;
  showPrice?: boolean;
  priceLabel?: string;
  priceValue?: string;
  priceEstimate?: string;
  showSpotlightBadge?: boolean;
  spotlightBadgeText?: string;
  fullscreenBtnText?: string;
  narrative?: string;
  detailContent?: string;
  largeCardContent?: string;
  featureBlocks?: FeatureBlockItem[];
  solution?: string;
  materials?: string;
  deliverables?: string[];
  keyHighlights?: Array<{ label: string; value: string }>;
  specs?: any[];
}

interface LandingGalleryShowcaseProps {
  title?: string;
  subtitle?: string;
  projects?: ProjectItem[];
  contactHref?: string;
  style?: React.CSSProperties;
  defaultSpotlightId?: string;
}

/**
 * Trả về giá tiền dự án - luôn đảm bảo hiển thị giá to rõ và không bao giờ bị rỗng
 */
export function getProjectPrice(proj?: ProjectItem | null): string {
  if (!proj) return "¥3,500,000〜 (¥4,100/m²)";
  if (proj.priceValue && proj.priceValue.trim()) {
    return proj.priceValue;
  }
  if (proj.priceEstimate && proj.priceEstimate.trim()) {
    return proj.priceEstimate;
  }
  const title = (proj.title || "").toLowerCase();
  const id = (proj.id || "").toLowerCase();

  if (id.includes("lakeside") || title.includes("lakeside") || title.includes("horizon")) {
    return "設計・3D目安: ¥3,500,000〜 (¥4,100/m²)";
  }
  if (id.includes("stone") || title.includes("stone") || title.includes("minimalist")) {
    return "設計・3D目安: ¥1,600,000〜 (¥3,800/m²)";
  }
  if (id.includes("skyline") || title.includes("skyline") || title.includes("duplex")) {
    return "設計・3D目安: ¥1,400,000〜 (¥4,000/m²)";
  }
  if (id.includes("forest") || title.includes("retreat") || title.includes("boutique")) {
    return "設計・3D目安: ¥4,200,000〜 (¥3,500/m²)";
  }
  if (id.includes("cafe") || title.includes("commercial") || title.includes("cafe")) {
    return "設計・3D目安: ¥1,100,000〜 (¥3,900/m²)";
  }
  if (id.includes("tropical") || title.includes("villa") || title.includes("resort")) {
    return "設計・3D目安: ¥2,800,000〜 (¥4,000/m²)";
  }
  return "設計・3D目安: ¥2,500,000〜 (¥3,800/m²)";
}

/**
 * Loại bỏ tiền tố trùng lặp (ví dụ '設計・3D目安:') để nhãn và giá không bị lặp từ
 */
export function formatPriceValue(priceStr: string): string {
  if (!priceStr) return "";
  return priceStr
    .replace(/^設計[・･]3D目安[:：]?\s*/i, "")
    .replace(/^Est\.?\s*Fee[:：]?\s*/i, "")
    .replace(/^Chi phí.*?:?\s*/i, "")
    .trim();
}

export default function LandingGalleryShowcase({
  title = "建築実績＆デザインコレクション",
  subtitle,
  projects = [],
  contactHref = "/ja/contact",
  style,
  defaultSpotlightId,
}: LandingGalleryShowcaseProps) {
  const INITIAL_GRID_COUNT = 8;
  const isJa = !contactHref.includes("/en");
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "split">("grid");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [visibleGridCount, setVisibleGridCount] = useState<number>(INITIAL_GRID_COUNT);
  const [lightboxProject, setLightboxProject] = useState<ProjectItem | null>(null);
  const [isExpandedDesc, setIsExpandedDesc] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Khóa cuộn trang và lắng nghe phím ESC khi mở xem ảnh full màn hình
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxProject(null);
      }
    };
    if (lightboxProject) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightboxProject]);

  const totalProjects = projects.length;
  const displayedGridProjects = projects.slice(0, visibleGridCount);
  const hasMore = visibleGridCount < totalProjects;

  // Active project for the Split View (left column spotlight)
  const currentSpotlight: ProjectItem =
    selectedProject ||
    (defaultSpotlightId ? projects.find((p) => p.id === defaultSpotlightId) : null) ||
    projects[0] || {
      id: "p-fallback",
      title: "ARCHITECTURE PROJECT",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    };

  const handleSelectProjectAndOpenSplit = (proj: ProjectItem) => {
    setSelectedProject(proj);
    setIsExpandedDesc(false);
    setViewMode("split");
    // Cuộn nhẹ lên đầu section dự án để người xem thấy trọn vẹn card lớn bên trái
    if (typeof window !== "undefined") {
      const sectionEl = document.getElementById("du-an");
      if (sectionEl) {
        sectionEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleToggleLoadMore = () => {
    if (hasMore) {
      setVisibleGridCount((prev) => Math.min(prev + 8, totalProjects));
    } else {
      setVisibleGridCount(INITIAL_GRID_COUNT);
    }
  };

  return (
    <section
      className={`gallery-dark-exhibition relative ${
        viewMode === "split" ? "py-8 sm:py-10 lg:py-12" : "py-16 sm:py-20 lg:py-24"
      } bg-[#0a0a0c] text-white border-b border-zinc-800/80 overflow-hidden w-full transition-all duration-300`}
      id="du-an"
      style={style}
    >
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
        
        {/* =========================================================================
            HEADER: TIÊU ĐỀ SECTION VÀO GIỮA - HIỆU ỨNG TRƯỢT TỪ DƯỚI LÊN 1.4S
            ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className={`relative ${
            viewMode === "split" ? "mb-4 sm:mb-6 pb-3 sm:pb-4" : "mb-8 sm:mb-10 pb-6"
          } border-b border-white/10`}
        >
          <div className="text-center max-w-3xl mx-auto space-y-2.5">
            <h2
              className="text-2xl sm:text-3xl md:text-[2.25rem] lg:text-[2.5rem] font-black tracking-tight text-white leading-tight drop-shadow-md"
              style={{ fontFamily: "var(--font-heading), 'Plus Jakarta Sans', sans-serif" }}
            >
              {title}
            </h2>
            <div className="flex items-center justify-center gap-3" aria-hidden="true">
              <span className="w-10 h-[1.5px] bg-gradient-to-r from-transparent to-amber-500" />
              <span className="text-amber-400 text-xs tracking-widest font-mono">✦</span>
              <p className="text-xs text-zinc-400 font-medium">
                {subtitle || (viewMode === "split"
                  ? "左側に選択したプロジェクトの詳細、右側に全作品リストを表示しています"
                  : "各プロジェクトをクリックすると、詳細情報と設計ソリューションをご覧いただけます")}
              </p>
              <span className="text-amber-400 text-xs tracking-widest font-mono">✦</span>
              <span className="w-10 h-[1.5px] bg-gradient-to-l from-transparent to-amber-500" />
            </div>
          </div>

          {/* Nút chuyển đổi chế độ xem (Chỉ hiển thị khi đang ở Split View để quay lại lưới nhanh chóng) */}
          {viewMode === "split" && (
            <div className="mt-4 sm:mt-0 sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2 flex justify-center">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-none bg-white/10 hover:bg-amber-500 hover:text-slate-950 text-white text-xs font-bold border border-white/20 hover:border-amber-500 transition-all duration-300 shadow-md cursor-pointer shrink-0"
              >
                <Grid size={15} />
                <span>← 全作品をグリッド表示に戻る</span>
              </button>
            </div>
          )}
        </motion.div>

        {/* =========================================================================
            CHẾ ĐỘ 1: LƯỚI CARD TOÀN MÀN HÌNH (GRID VIEW - MẶC ĐỊNH BAN ĐẦU)
            - Không bo góc (rounded-none)
            - Giá tiền mép dưới ở giữa của ảnh
            - Click vào card sẽ chuyển ngay sang CHẾ ĐỘ 2 (Split View)
            ========================================================================= */}
        {viewMode === "grid" && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 items-stretch">
              {displayedGridProjects.map((proj, idx) => {
                const specsList: any[] = Array.isArray(proj.specs) ? proj.specs : [];

                return (
                  <motion.article
                    key={proj.id || idx}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 1.4, delay: 0.1 + (idx % 4) * 0.18, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => handleSelectProjectAndOpenSplit(proj)}
                    className="group bg-[#141417] hover:bg-[#18181c] border border-white/10 hover:border-amber-500/50 rounded-none overflow-hidden shadow-lg hover:shadow-[0_16px_36px_rgba(0,0,0,0.5)] transition-all duration-300 flex flex-col justify-between cursor-pointer"
                  >
                    {/* 1. Thumbnail tỷ lệ 16:10 không bo góc */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900 rounded-none">
                      <img
                        src={proj.img || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out rounded-none"
                        loading="lazy"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                      {proj.catTag && (
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-none text-[11px] font-bold tracking-tight bg-black/75 backdrop-blur-md text-amber-300 border border-amber-500/30">
                          {proj.catTag}
                        </span>
                      )}

                      {/* GIÁ TIỀN HIỂN THỊ LUÔN TRÊN HÌNH (VỊ TRÍ KHOANH ĐỎ Ở MÉP DƯỚI Ở GIỮA) */}
                      <div className="absolute bottom-2.5 sm:bottom-3 left-1/2 -translate-x-1/2 z-20 px-3.5 sm:px-4 py-1 sm:py-1.5 bg-black/90 backdrop-blur-md border border-amber-400 rounded-none text-center shadow-2xl flex items-center gap-1.5 pointer-events-none">
                        <Tag size={12} className="text-amber-400 shrink-0" />
                        <span className="text-xs sm:text-[13px] font-mono font-black text-amber-300 whitespace-nowrap drop-shadow-md">
                          {formatPriceValue(getProjectPrice(proj))}
                        </span>
                      </div>

                      {/* LỚP HOVER: KHI RƠ CHUỘT VÀO THÌ HIỆN NÚT "詳細を見る" (XEM CHI TIẾT), CLICK MỚI NHẢY QUA TRANG 4 (SPLIT VIEW) */}
                      <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/55 backdrop-blur-[1.5px]">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-none text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
                          <span>詳細を見る</span>
                          <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>

                    {/* 2. Khối nội dung card */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 text-[11px] text-zinc-400 mb-1.5 font-medium">
                          <span className="truncate flex items-center gap-1">
                            <MapPin size={11} className="text-amber-500 shrink-0" />
                            <span>{proj.loc || "Japan"}</span>
                          </span>
                          {proj.style && (
                            <span className="text-[10px] uppercase font-mono text-zinc-500 truncate">
                              {proj.style}
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-white text-sm sm:text-base leading-snug group-hover:text-amber-400 transition-colors line-clamp-1 mb-2">
                          {proj.title}
                        </h3>

                        {proj.narrative && (
                          <p
                            className="text-zinc-400 text-xs leading-relaxed line-clamp-2 mb-3"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {proj.narrative}
                          </p>
                        )}
                      </div>

                      {/* 3. Chips thông số (specs) không bo góc */}
                      {specsList.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5 mt-auto">
                          {specsList.slice(0, 3).map((sp: any, sIdx: number) => {
                            const val = typeof sp === "string" ? sp : (sp?.v || sp?.value || sp?.k || "");
                            if (!val) return null;
                            return (
                              <span
                                key={sIdx}
                                className="px-2 py-0.5 rounded-none text-[10px] font-mono bg-white/5 text-zinc-300 border border-white/10"
                              >
                                {val}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </motion.article>
                );
              })}
            </div>

            {/* Nút Xem thêm khi có nhiều dự án */}
            {totalProjects > INITIAL_GRID_COUNT && (
              <div className="mt-12 text-center">
                <button
                  type="button"
                  onClick={handleToggleLoadMore}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-none text-xs font-bold uppercase tracking-wider bg-[#18181c] hover:bg-[#222228] text-white border border-white/15 hover:border-amber-500/50 shadow-lg hover:shadow-amber-500/10 transition-all duration-300 cursor-pointer"
                >
                  {hasMore ? (
                    <>
                      <span>さらに表示する (残り {totalProjects - visibleGridCount} 件)</span>
                      <ChevronDown size={16} className="text-amber-400" />
                    </>
                  ) : (
                    <>
                      <span>一部を折りたたむ</span>
                      <ChevronUp size={16} className="text-amber-400" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            CHẾ ĐỘ 2: SPLIT VIEW TỐI ƯU TRÊN 1 TRANG (CHUẨN ẢNH 4)
            - Cột trái: Tăng width card lớn, trên là ảnh dưới là nội dung, giá tiền mép dưới ở giữa ảnh
            - Cột phải: Kích thước card (width + height) bằng Ảnh 3 (2 cột cuộn mượt mà)
            - Hiệu ứng xuất hiện trượt từ dưới lên 1.4s mượt mà giống Section Thương hiệu & Đối tác
            ========================================================================= */}
        {viewMode === "split" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 xl:gap-7 items-start w-full">
            
            {/* =====================================================================
                CỘT TRÁI (50% WIDTH - CHUẨN KÍCH CỠ ẢNH 1):
                - Card lớn chiếm đúng 50% màn hình, không bị bè rộng quá mức
                - Chiều cao ảnh Visual 8K và nội dung cân đối hoàn hảo
                ===================================================================== */}
            <div className="w-full min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSpotlight.id || currentSpotlight.title}
                  initial={{ opacity: 0, y: 45 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-[#121216] border border-amber-500/60 rounded-none overflow-hidden shadow-2xl flex flex-col"
                >
                  {/* PHẦN TRÊN: ẢNH VISUAL 8K LỚN (TĂNG CHIỀU CAO - CLICK ĐỂ XEM TOÀN MÀN HÌNH) */}
                  <div
                    onClick={() => setLightboxProject(currentSpotlight)}
                    className="relative w-full aspect-[16/10] sm:aspect-[16/10] md:h-[390px] lg:h-[440px] xl:h-[475px] overflow-hidden bg-black shrink-0 group cursor-zoom-in select-none"
                    title="クリックして写真を全画面表示"
                  >
                    <img
                      src={currentSpotlight.img}
                      alt={currentSpotlight.title}
                      className="w-full h-full object-cover rounded-none transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Gradient siêu nhẹ chỉ ở đỉnh trên giúp chữ badge dễ đọc, KHÔNG LÀM MỜ HAY TỐI ẢNH */}
                    <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

                    {/* Top Badges (Nội dung Ảnh 3) */}
                    <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-2 z-10">
                      {currentSpotlight.showSpotlightBadge !== false && (
                        <span className="px-3 py-1 rounded-none text-[11px] font-extrabold uppercase tracking-wider bg-amber-500 text-slate-950 shadow-md">
                          {currentSpotlight.spotlightBadgeText || "✦ 選択中のプロジェクト"}
                        </span>
                      )}
                      {currentSpotlight.catTag && (
                        <span className="px-2.5 py-1 rounded-none text-[11px] font-bold bg-black/80 backdrop-blur-md text-zinc-200 border border-white/20">
                          {currentSpotlight.catTag}
                        </span>
                      )}
                    </div>

                    {/* Nút Xem Fullscreen ở góc trên bên phải */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxProject(currentSpotlight);
                      }}
                      className="absolute top-3.5 right-3.5 z-20 px-3 py-1.5 bg-black/80 hover:bg-amber-500 hover:text-slate-950 text-white text-xs font-bold border border-white/25 hover:border-amber-400 rounded-none flex items-center gap-1.5 transition-all duration-200 backdrop-blur-md shadow-xl cursor-pointer"
                      title="写真を全画面表示"
                    >
                      <Maximize2 size={13} />
                      <span className="hidden sm:inline">
                        {currentSpotlight.fullscreenBtnText || "全画面表示"}
                      </span>
                    </button>

                    {/* Hover Hint ở giữa ảnh */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-black/85 backdrop-blur-md border border-amber-500/60 text-white text-xs font-bold shadow-2xl">
                        <ZoomIn size={15} className="text-amber-400" />
                        <span>クリックで高解像度写真を全画面表示</span>
                      </span>
                    </div>

                    {/* GIÁ TIỀN TRONG ẢNH Ở VỊ TRÍ MÉP DƯỚI Ở GIỮA (HỖ TRỢ TÙY BIẾN CẢ CHỮ VÀ SỐ TIỀN) */}
                    {currentSpotlight.showPrice !== false && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setLightboxProject(currentSpotlight);
                        }}
                        className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 bg-black/90 backdrop-blur-md border-2 border-amber-400 rounded-none shadow-[0_12px_36px_rgba(0,0,0,0.9)] flex items-center gap-2 sm:gap-3 transition-all hover:scale-105 hover:border-amber-300 hover:bg-black cursor-pointer group/price pointer-events-auto"
                      >
                        <Tag size={18} className="text-amber-400 shrink-0 hidden xs:inline-block" />
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2 text-center sm:text-left">
                          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-200/90 whitespace-nowrap">
                            {currentSpotlight.priceLabel !== undefined ? currentSpotlight.priceLabel : "設計・3D目安費用:"}
                          </span>
                          <span className="text-base sm:text-xl md:text-2xl font-mono font-black text-amber-300 tracking-tight whitespace-nowrap drop-shadow-[0_2px_12px_rgba(245,158,11,0.6)]">
                            {currentSpotlight.priceValue || formatPriceValue(getProjectPrice(currentSpotlight))}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* PHẦN DƯỚI: NỘI DUNG CHI TIẾT DỰ ÁN (TỐI ƯU GỌN GÀNG TRÊN 1 TRANG) */}
                  <div className="p-4 sm:p-5 lg:p-5 space-y-2.5 sm:space-y-3 bg-[#141418] text-white flex-1 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      {/* Vị trí & Phong cách thiết kế */}
                      <div className="flex items-center justify-between gap-3 text-xs text-zinc-400">
                        {currentSpotlight.loc && (
                          <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                            <MapPin size={13} />
                            <span>{currentSpotlight.loc}</span>
                          </span>
                        )}
                        {currentSpotlight.style && (
                          <span className="font-mono text-zinc-400 uppercase text-[11px] bg-white/5 px-2.5 py-0.5 border border-white/10">
                            {currentSpotlight.style}
                          </span>
                        )}
                      </div>

                      {/* Tiêu đề dự án lớn */}
                      <h3 className="text-lg sm:text-xl xl:text-2xl font-black text-white tracking-tight leading-snug">
                        {currentSpotlight.title}
                      </h3>

                      {/* Đoạn văn mô tả & nút Xem thêm */}
                      {(currentSpotlight.narrative || currentSpotlight.detailContent) && (
                        <div className="space-y-1.5 pt-0.5">
                          <p
                            className="text-zinc-300 text-xs sm:text-[13px] leading-relaxed transition-all whitespace-pre-line"
                            style={
                              !isExpandedDesc
                                ? {
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }
                                : undefined
                            }
                          >
                            {isExpandedDesc && currentSpotlight.detailContent
                              ? `${currentSpotlight.narrative ? currentSpotlight.narrative + "\n\n" : ""}${currentSpotlight.detailContent}`
                              : currentSpotlight.narrative || currentSpotlight.detailContent}
                          </p>
                          <button
                            type="button"
                            onClick={() => setIsExpandedDesc(!isExpandedDesc)}
                            className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 text-xs font-bold transition-colors cursor-pointer select-none"
                          >
                            <span>{isExpandedDesc ? "Thu gọn ▲" : "Xem thêm ▼"}</span>
                          </button>
                        </div>
                      )}

                      {/* KHỐI NỘI DUNG ẢNH 4 (GIẢI PHÁP / VẬT LIỆU / CÁC KHỐI ĐẶC ĐIỂM CÓ TÍNH NĂNG THÊM / XÓA) */}
                      {(() => {
                        const rawBlocks: FeatureBlockItem[] =
                          Array.isArray(currentSpotlight.featureBlocks) && currentSpotlight.featureBlocks.length > 0
                            ? currentSpotlight.featureBlocks
                            : [
                                currentSpotlight.solution
                                  ? { title: "🏛 建築ソリューション", content: currentSpotlight.solution }
                                  : null,
                                currentSpotlight.materials
                                  ? { title: "🧱 マテリアル仕様", content: currentSpotlight.materials }
                                  : null,
                              ].filter(Boolean) as FeatureBlockItem[];

                        if (rawBlocks.length === 0) return null;

                        return (
                          <div className={`grid grid-cols-1 ${rawBlocks.length > 1 ? "md:grid-cols-2" : ""} gap-2.5 pt-0.5`}>
                            {rawBlocks.map((blk, bIdx) => (
                              <div key={bIdx} className="bg-white/5 border border-white/10 rounded-none p-2.5 sm:p-3 space-y-1">
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400">
                                  <span>{blk.title}</span>
                                </div>
                                <p className="text-xs text-zinc-300 leading-relaxed line-clamp-2">
                                  {blk.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        );
                      })()}

                      {/* Gói thành phẩm bàn giao */}
                      {Array.isArray(currentSpotlight.deliverables) && currentSpotlight.deliverables.length > 0 && (
                        <div className="space-y-1 pt-0.5">
                          <span className="text-[10px] sm:text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                            納品成果物パッケージ:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {currentSpotlight.deliverables.map((item, dIdx) => (
                              <span
                                key={dIdx}
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-none text-[11px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                              >
                                <Check size={12} className="text-emerald-400 shrink-0" />
                                <span>{item}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Key Highlights specs (4 ô specs nhanh) */}
                      {Array.isArray(currentSpotlight.keyHighlights) && currentSpotlight.keyHighlights.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-white/5">
                          {currentSpotlight.keyHighlights.slice(0, 4).map((s, hIdx) => (
                            <div
                              key={hIdx}
                              className="bg-black/40 border border-white/5 rounded-none p-2 text-center"
                            >
                              <span className="text-[10px] text-zinc-500 uppercase font-mono block truncate mb-0.5">
                                {s.label}
                              </span>
                              <span className="text-xs font-mono font-bold text-emerald-400 block truncate">
                                {s.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Hàng nút bấm CTA + Hotline */}
                    <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center gap-2.5">
                      <a
                        href={contactHref}
                        className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-black rounded-none shadow-lg transition-all"
                      >
                        <span>このプランについて相談する</span>
                        <ArrowRight size={15} />
                      </a>

                      <div
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 text-xs text-zinc-300 bg-white/5 border border-white/10 rounded-none shrink-0 cursor-default select-text"
                      >
                        <Phone size={13} className="text-amber-500" />
                        <span>お電話窓口: 0984 384 190</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* =====================================================================
                CỘT PHẢI (50% WIDTH - CHUẨN KÍCH CỠ ẢNH 1):
                - Danh sách 2 cột card rộng rãi bằng đúng 50% màn hình
                - Kích cỡ card, thumbnail 16:10, text & specs chuẩn tỉ lệ như Ảnh 1
                ===================================================================== */}
            <div className="w-full min-w-0 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-zinc-400 pb-2 border-b border-white/10">
                <span className="font-bold text-white uppercase tracking-wider">
                  全プロジェクト一覧 ({projects.length})
                </span>
                <span className="text-[11px] text-amber-400 font-mono">
                  クリックして切り替え
                </span>
              </div>

              {/* Danh sách cuộn 2 cột card rộng rãi chuẩn Ảnh 1 */}
              <div className="grid grid-cols-2 gap-3.5 sm:gap-4 max-h-[780px] xl:max-h-[850px] overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-zinc-700">
                {projects.map((proj, idx) => {
                  const isSelected =
                    (currentSpotlight.id && proj.id && currentSpotlight.id === proj.id) ||
                    currentSpotlight.title === proj.title;

                  const specsList: any[] = Array.isArray(proj.specs) ? proj.specs : [];

                  return (
                    <motion.article
                      key={proj.id || idx}
                      initial={{ opacity: 0, y: 35 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1.2, delay: 0.05 * (idx % 8), ease: [0.16, 1, 0.3, 1] }}
                      onClick={() => {
                        setSelectedProject(proj);
                        setIsExpandedDesc(false);
                      }}
                      className={`border transition-all duration-300 flex flex-col justify-between cursor-pointer group rounded-none overflow-hidden ${
                        isSelected
                          ? "bg-amber-500/15 border-amber-500 shadow-md ring-1 ring-amber-500/40"
                          : "bg-[#141418] hover:bg-[#1a1a20] border-white/10 hover:border-amber-500/40"
                      }`}
                    >
                      {/* 1. Thumbnail tỷ lệ 16:10 (chuẩn Ảnh 1) */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900 shrink-0 rounded-none">
                        <img
                          src={proj.img}
                          alt={proj.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-none"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-75 group-hover:opacity-55 transition-opacity" />

                        {/* Badges góc trên */}
                        <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1 z-10">
                          {proj.catTag ? (
                            <span className="px-1.5 py-0.5 text-[9px] font-bold bg-black/75 backdrop-blur-sm text-amber-300 border border-amber-500/30 truncate rounded-none">
                              {proj.catTag}
                            </span>
                          ) : <span />}
                          {isSelected && (
                            <span className="px-1.5 py-0.5 text-[9px] font-black uppercase bg-amber-500 text-slate-950 shrink-0 rounded-none">
                              選択中
                            </span>
                          )}
                        </div>

                        {/* Giá tiền mép dưới ở giữa ảnh (tự động cập nhật theo giá dự án đã sửa) */}
                        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/90 backdrop-blur-sm border border-amber-500/40 text-center rounded-none z-10">
                          <span className="text-[9px] font-mono font-bold text-amber-300 whitespace-nowrap block">
                            {proj.priceValue || formatPriceValue(getProjectPrice(proj))}
                          </span>
                        </div>
                      </div>

                      {/* 2. Thông tin card phía dưới (chuẩn Ảnh 1) */}
                      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-1 text-[11px] text-zinc-400 mb-1">
                            <span className="truncate flex items-center gap-1 text-amber-400 font-medium">
                              <MapPin size={11} className="shrink-0" />
                              <span className="truncate">{proj.loc || "Japan"}</span>
                            </span>
                            {proj.style && (
                              <span className="text-[10px] font-mono text-amber-500 font-medium truncate">
                                {proj.style}
                              </span>
                            )}
                          </div>

                          <h4
                            className={`font-bold text-xs sm:text-sm leading-snug line-clamp-1 transition-colors ${
                              isSelected ? "text-amber-300" : "text-white group-hover:text-amber-400"
                            }`}
                          >
                            {proj.title}
                          </h4>

                          {proj.narrative && (
                            <p
                              className="text-zinc-400 text-xs line-clamp-2 mt-1 leading-relaxed"
                              style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {proj.narrative}
                            </p>
                          )}
                        </div>

                        {/* Chips thông số (specs) dưới đáy card */}
                        {specsList.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5 mt-2">
                            {specsList.slice(0, 4).map((sp: any, sIdx: number) => {
                              const val = typeof sp === "string" ? sp : (sp?.v || sp?.value || sp?.k || "");
                              if (!val) return null;
                              return (
                                <span
                                  key={sIdx}
                                  className="px-2 py-0.5 rounded-none text-[10px] font-mono bg-white/5 text-zinc-300 border border-white/10"
                                >
                                  {val}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* =========================================================================
          LIGHTBOX MODAL: XEM ẢNH DỰ ÁN TOÀN MÀN HÌNH (FULLSCREEN HIGH-RES VIEW)
          - Kích hoạt khi click vào ảnh visual hoặc nút [全画面表示]
          - Không bo góc, hiển thị ảnh siêu nét, tiêu đề, và giá tiền nổi bật
          - Đóng qua nút [X], phím ESC hoặc click ra ngoài nền đen
          ========================================================================= */}
      {/* =========================================================================
          LIGHTBOX MODAL XEM ẢNH FULL MÀN HÌNH (PORTAL GẮN THẲNG VÀO BODY)
          - Dùng createPortal thoát hoàn toàn khỏi stacking context của section
          - Đảm bảo 100% không bao giờ bị đen xì hay lệch khung hình
          ========================================================================= */}
      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {lightboxProject && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: "100vw",
                height: "100vh",
                zIndex: 2147483647,
                backgroundColor: "rgba(5, 7, 10, 0.96)",
                backdropFilter: "blur(16px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "1rem",
                userSelect: "none",
                boxSizing: "border-box",
              }}
              onClick={() => setLightboxProject(null)}
            >
              {/* Top Bar: Tiêu đề & Nút đóng */}
              <div
                className="flex items-center justify-between gap-4 pb-3 border-b border-white/15 shrink-0 px-2 sm:px-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {lightboxProject.catTag && (
                    <span className="px-2.5 py-1 text-[11px] font-bold bg-amber-500 text-slate-950 rounded-none shrink-0">
                      {lightboxProject.catTag}
                    </span>
                  )}
                  <h3 className="text-sm sm:text-lg font-black text-white tracking-tight truncate">
                    {lightboxProject.title}
                  </h3>
                  {lightboxProject.loc && (
                    <span className="text-xs text-zinc-400 hidden md:inline truncate">
                      ({lightboxProject.loc})
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setLightboxProject(null)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-none shadow-lg transition-all cursor-pointer shrink-0"
                >
                  <X size={16} />
                  <span>閉じる (ESC)</span>
                </button>
              </div>

              {/* Middle: Ảnh Full HD / 8K phóng to tối đa */}
              <div
                className="flex-1 flex items-center justify-center p-2 sm:p-4 overflow-hidden relative"
                onClick={() => setLightboxProject(null)}
              >
                <img
                  src={lightboxProject.img || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=90"}
                  alt={lightboxProject.title || "Project"}
                  className="max-h-[75vh] max-w-[94vw] w-auto h-auto object-contain rounded-none border border-white/20 shadow-[0_25px_80px_rgba(0,0,0,0.95)]"
                  onClick={(e) => e.stopPropagation()}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=90";
                  }}
                />
              </div>

              {/* Bottom Bar: Giá tiền to rõ ràng & Hướng dẫn đóng */}
              <div
                className="pt-3 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left shrink-0 px-2 sm:px-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="inline-flex items-center gap-3 px-5 py-2 bg-black/95 border-2 border-amber-400 rounded-none shadow-2xl">
                  <Tag size={16} className="text-amber-400 shrink-0" />
                  <span className="text-xs text-zinc-300 font-bold uppercase tracking-wider">
                    {lightboxProject.priceLabel || (isJa ? "設計・3D目安費用:" : "Est. Design & 3D Fee:")}
                  </span>
                  <span className="text-base sm:text-xl font-mono font-black text-amber-300 tracking-tight">
                    {lightboxProject.priceValue || formatPriceValue(getProjectPrice(lightboxProject))}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 font-medium">
                  ✦ 背景をクリックするか <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/20 text-zinc-200 rounded-none font-mono text-[10px]">ESC</kbd> キーで全画面表示を終了します
                </p>
              </div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
