"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { createPortal } from "react-dom";
import BeforeAfterSlider from "@/components/public/BeforeAfterSlider";
import Lightbox from "@/components/public/Lightbox";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Slide & Section data                                               */
/* ------------------------------------------------------------------ */
interface Slide {
  label: string;
  bg: string;
  imageUrl?: string;
  beforeImageUrl?: string;
  videoUrl?: string;
  vrUrl?: string;
}

interface Section {
  num: string;
  titleEn: string;
  titleJp: string;
  descKey: string;
  tagsKey: string;
  workType: string;           // maps to Work.type in DB
  fallbackSlides: Slide[];    // shown when no DB images
  layout: "text-left" | "image-left";
}

const SECTIONS: Section[] = [
  {
    num: "01",
    titleEn: "Still Image",
    titleJp: "静止画",
    descKey: "s1.desc",
    tagsKey: "s1.tags",
    workType: "still",
    fallbackSlides: [
      { label: "Exterior — Dusk", bg: "#cdc9c2" },
      { label: "Exterior — Day", bg: "#c4c0b9" },
      { label: "Interior — Living", bg: "#d4cfc8" },
      { label: "Interior — Kitchen", bg: "#ccc8c1" },
      { label: "Aerial View", bg: "#b8b4ad" },
      { label: "Night Scene", bg: "#3a3530" },
    ],
    layout: "text-left",
  },
  {
    num: "02",
    titleEn: "Animation",
    titleJp: "アニメーション",
    descKey: "s2.desc",
    tagsKey: "s2.tags",
    workType: "animation",
    fallbackSlides: [
      { label: "Fly-through", bg: "#1e1e1e" },
      { label: "Walk-through", bg: "#252525" },
      { label: "Exterior Tour", bg: "#2a2a2a" },
      { label: "Interior Tour", bg: "#222222" },
      { label: "Showreel", bg: "#1a1a1a" },
    ],
    layout: "image-left",
  },
  {
    num: "03",
    titleEn: "VR Walkthrough",
    titleJp: "VRウォークスルー",
    descKey: "s3.desc",
    tagsKey: "s3.tags",
    workType: "walkthrough",
    fallbackSlides: [
      { label: "Living Room", bg: "#c0ccca" },
      { label: "Bedroom", bg: "#b8c4c2" },
      { label: "Lobby", bg: "#ccd4d2" },
      { label: "Common Area", bg: "#c4ccc8" },
      { label: "Rooftop", bg: "#b0bcba" },
    ],
    layout: "text-left",
  },
  {
    num: "04",
    titleEn: "VR 360",
    titleJp: "VR360",
    descKey: "s4.desc",
    tagsKey: "s4.tags",
    workType: "vr360",
    fallbackSlides: [
      { label: "Panorama — Exterior", bg: "#ccc4c2" },
      { label: "Panorama — Interior", bg: "#c4bcba" },
      { label: "Garden View", bg: "#d4ccc8" },
      { label: "Rooftop View", bg: "#c8c0be" },
      { label: "Lobby 360", bg: "#bab2b0" },
    ],
    layout: "image-left",
  },
  {
    num: "05",
    titleEn: "Photo Composite",
    titleJp: "写真合成",
    descKey: "s5.desc",
    tagsKey: "s5.tags",
    workType: "composite",
    fallbackSlides: [
      { label: "Residential Block", bg: "#c2cabe" },
      { label: "Commercial Facade", bg: "#bac2b8" },
      { label: "Urban Context", bg: "#ccd4ca" },
      { label: "Street View", bg: "#c0c8bc" },
      { label: "Aerial Blend", bg: "#b4bcb0" },
    ],
    layout: "text-left",
  },
  {
    num: "06",
    titleEn: "Digital Model",
    titleJp: "デジタル模型",
    descKey: "s6.desc",
    tagsKey: "s6.tags",
    workType: "digital",
    fallbackSlides: [
      { label: "Master Plan", bg: "#c4bcc8" },
      { label: "Building Volume", bg: "#bcb4c0" },
      { label: "Site Model", bg: "#d0c8d4" },
      { label: "Unit Layout", bg: "#c8c0cc" },
      { label: "Floor Plan 3D", bg: "#b8b0bc" },
    ],
    layout: "image-left",
  },
];

/* ------------------------------------------------------------------ */
/*  Gallery Slider (self-contained per section)                        */
/* ------------------------------------------------------------------ */

/** Extract YouTube video ID from various URL formats */
function getYouTubeId(url: string): string | null {
  if (!url) return null;
  // Handle youtu.be/ID, youtube.com/watch?v=ID, youtube.com/embed/ID
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

/** Check if URL is a direct video file */
function isDirectVideo(url: string): boolean {
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);
}

function HorizontalScrollGallery({
  slides,
  isComposite = false,
  onVrClick,
  onImageClick,
  onCompositeClick,
}: {
  slides: Slide[];
  isComposite?: boolean;
  onVrClick?: (url: string, title: string) => void;
  onImageClick?: (url: string, title: string) => void;
  onCompositeClick?: (before: string, after: string, title: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(false);

  const checkScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    setShowLeftBtn(el.scrollLeft > 5);
    setShowRightBtn(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [slides]);

  const scroll = (direction: "left" | "right") => {
    const el = containerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (slides.length === 0) return null;

  return (
    <div className="relative group/gallery w-full h-full flex items-center bg-[#fafafa] py-6 px-4 md:px-8">
      {/* Scrollable Container */}
      <div
        ref={containerRef}
        className="flex gap-5 items-center overflow-x-auto w-full py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent scroll-smooth select-none"
      >
        {slides.map((slide, i) => {
          const ytId = slide.videoUrl ? getYouTubeId(slide.videoUrl) : null;
          const directVideo = slide.videoUrl && isDirectVideo(slide.videoUrl);

          return (
            <div
              key={i}
              className="relative shrink-0 h-[180px] sm:h-[240px] md:h-[280px] lg:h-[320px] w-auto rounded-lg overflow-hidden shadow-md border border-gray-200 bg-white group/item cursor-pointer"
              onClick={() => {
                if (slide.vrUrl) {
                  window.open(slide.vrUrl, '_blank', 'noopener,noreferrer');
                } else if (isComposite && slide.beforeImageUrl && slide.imageUrl && onCompositeClick) {
                  onCompositeClick(slide.beforeImageUrl, slide.imageUrl, slide.label);
                } else if (slide.videoUrl && onImageClick) {
                  onImageClick(slide.videoUrl, slide.label);
                } else if (slide.imageUrl && onImageClick) {
                  onImageClick(slide.imageUrl, slide.label);
                }
              }}
            >
              {/* YouTube embed or thumbnail */}
              {ytId ? (
                <div className="h-full aspect-video relative bg-black">
                  {slide.imageUrl && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={slide.imageUrl}
                      alt={slide.label}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover/item:bg-black/40 transition-colors">
                    <span className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover/item:scale-110 transition-transform duration-300">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-gray-900 ml-0.5">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </div>
                </div>
              ) : directVideo ? (
                <div className="h-full aspect-video relative bg-black">
                  <video
                    src={slide.videoUrl}
                    poster={slide.imageUrl || undefined}
                    preload="metadata"
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/item:bg-black/35 transition-colors">
                    <span className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover/item:scale-110 transition-transform duration-300">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-gray-900 ml-0.5">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </div>
                </div>
              ) : slide.imageUrl ? (
                isComposite && slide.beforeImageUrl ? (
                  <BeforeAfterSlider
                    before={slide.beforeImageUrl}
                    after={slide.imageUrl}
                    beforeLabel="Before"
                    afterLabel="After"
                    autoAspect={true}
                    preferHeightOverWidth={true}
                  />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={slide.imageUrl}
                    alt={slide.label}
                    className="h-full w-auto object-contain transition-transform duration-500 ease-out group-hover/item:scale-[1.02]"
                    loading="lazy"
                  />
                )
              ) : null}

              {/* Label Pill overlay */}
              <span className="absolute bottom-3 left-3 text-[10px] px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 shadow-sm border border-gray-200/50 pointer-events-none">
                {slide.label}
              </span>

              {/* VR Icon overlay if VR link */}
              {slide.vrUrl && (
                <span className="absolute top-3 right-3 bg-blue-600 text-white p-1.5 rounded-full shadow-md z-10 pointer-events-none">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M2 8a2 2 0 012-2h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8z" />
                    <circle cx="8" cy="12" r="2" />
                    <circle cx="16" cy="12" r="2" />
                  </svg>
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons (Left/Right Arrows) */}
      {showLeftBtn && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 border border-gray-200 shadow-md flex items-center justify-center hover:bg-white hover:shadow-lg transition-all duration-200 z-10"
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} className="text-gray-700" />
        </button>
      )}

      {showRightBtn && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 border border-gray-200 shadow-md flex items-center justify-center hover:bg-white hover:shadow-lg transition-all duration-200 z-10"
          aria-label="Scroll right"
        >
          <ChevronRight size={20} className="text-gray-700" />
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */
interface WorkItem {
  title: string;
  titleJa: string;
  image: string;
  beforeImage?: string;
  videoUrl?: string;
  vrUrl?: string;
}

interface SolutionContentProps {
  worksByType?: Record<string, WorkItem[]>;
}

/* ------------------------------------------------------------------ */
/*  Main page content                                                  */
/* ------------------------------------------------------------------ */
export default function SolutionContent({ worksByType = {} }: SolutionContentProps) {
  const t = useTranslations("solution");
  const locale = useLocale();

  // Build slides for a section: use DB works if available, else fallback
  function getSlidesForSection(sec: Section): Slide[] {
    const dbWorks = worksByType[sec.workType];
    if (dbWorks && dbWorks.length > 0) {
      return dbWorks.map((w) => ({
        label: locale === "ja" && w.titleJa ? w.titleJa : w.title,
        bg: "#e5e2de",
        imageUrl: w.image,
        beforeImageUrl: w.beforeImage || undefined,
        videoUrl: w.videoUrl || undefined,
        vrUrl: w.vrUrl || undefined,
      }));
    }
    return sec.fallbackSlides;
  }

  // VR modal state
  const [vrModal, setVrModal] = useState<{ url: string; title: string } | null>(null);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string; isVideo?: boolean } | null>(null);
  const [compositeModal, setCompositeModal] = useState<{ beforeImage: string; afterImage: string; title: string } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [vh, setVh] = useState(typeof window !== "undefined" ? window.innerHeight : 800);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setVh(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll lock + ESC key handler for full-screen composite modal
  useEffect(() => {
    if (!compositeModal) return;
    document.body.style.overflow = "hidden";
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCompositeModal(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [compositeModal]);

  return (
    <div className="bg-white">
      {/* ========== HERO ========== */}
      <div className="text-center pt-8 pb-6 px-6 sm:px-[60px]">
        <p className="text-[11px] uppercase tracking-[0.16em] text-[#aaa] mb-2">
          {t("label")}
        </p>
        <h1 className="text-[36px] sm:text-[42px] font-light tracking-[0.04em] text-[#111] mb-2">
          {t("title")}
        </h1>
        <p className="text-[13px] text-[#888] leading-[1.7]">
          {t("heroLine1")}
          <br />
          {t("heroLine2")}
        </p>
      </div>

      {/* ========== SECTIONS ========== */}
      {SECTIONS.map((sec) => {
        const isTextLeft = sec.layout === "text-left";
        const slides = getSlidesForSection(sec);

        const textContents = (
          <>
            <div className="text-[32px] font-normal tracking-[0.02em] text-[#111] mb-4">
              <span className="text-[#bbb] mr-2">{sec.num}.</span>
              {sec.titleEn}
            </div>
            <div className="text-[15px] text-[#444] leading-[2] mb-4 whitespace-pre-line">
              {t(sec.descKey)}
            </div>
            <div className="flex flex-wrap gap-1.5 mb-5">
              {(t.raw(sec.tagsKey) as string[]).map((tag) => (
                <span
                  key={tag}
                  className="text-[12px] px-3.5 py-1.5 rounded-[20px] text-[#555]"
                  style={{ border: "0.5px solid #bbb" }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <Link
              href={sec.workType === "composite" ? `/${locale}/solution/photo-composite` : `/${locale}/works`}
              className="group inline-flex items-center gap-2.5 self-start"
            >
              <span className="text-[12px] text-[#111] tracking-[0.08em]">
                {t("viewWorks")}
              </span>
              <span
                className="w-[38px] h-[38px] rounded-full flex items-center justify-center transition-colors duration-200 group-hover:bg-[#111]"
                style={{ border: "0.5px solid #111" }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="stroke-[#111] group-hover:stroke-white transition-colors duration-200"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </>
        );

        return (
          <div
            key={sec.num}
            className="flex flex-col lg:flex-row border-t-[0.5px] border-[#e8e8e8] overflow-hidden"
          >
            {isTextLeft ? (
              <>
                <div className="w-full lg:w-[37%] shrink-0 px-8 sm:px-14 py-10 flex flex-col justify-center lg:border-r-[0.5px] border-[#e8e8e8]">
                  {textContents}
                </div>
                <div className="w-full lg:w-[63%] shrink-0 relative overflow-hidden">
                  <HorizontalScrollGallery
                    slides={slides}
                    isComposite={sec.workType === 'composite'}
                    onVrClick={(url, title) => setVrModal({ url, title })}
                    onImageClick={(src, alt) => setLightbox({ src, alt, isVideo: isDirectVideo(src) || getYouTubeId(src) !== null })}
                    onCompositeClick={(before, after, title) => setCompositeModal({ beforeImage: before, afterImage: after, title })}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="order-2 lg:order-1 w-full lg:w-[63%] shrink-0 relative overflow-hidden">
                  <HorizontalScrollGallery
                    slides={slides}
                    isComposite={sec.workType === 'composite'}
                    onVrClick={(url, title) => setVrModal({ url, title })}
                    onImageClick={(src, alt) => setLightbox({ src, alt, isVideo: isDirectVideo(src) || getYouTubeId(src) !== null })}
                    onCompositeClick={(before, after, title) => setCompositeModal({ beforeImage: before, afterImage: after, title })}
                  />
                </div>
                <div className="order-1 lg:order-2 w-full lg:w-[37%] shrink-0 px-8 sm:px-14 py-10 flex flex-col justify-center">
                  {textContents}
                </div>
              </>
            )}
          </div>
        );
      })}

      {/* ========== CTA ========== */}
      <div className="text-center py-20 px-6 sm:px-[60px] border-t-[0.5px] border-[#e8e8e8]">
        <p className="text-[12px] text-[#aaa] tracking-[0.06em] mb-2.5">
          {t("ctaSubtitle")}
        </p>
        <h2 className="text-[32px] font-light tracking-[0.03em] text-[#111] mb-7">
          {t("ctaTitle")}
        </h2>
        <Link
          href={`/${locale}/contact`}
          className="inline-block px-10 py-[13px] text-[13px] text-[#111] tracking-[0.08em] bg-white transition-all duration-200 hover:bg-[#111] hover:text-white"
          style={{ border: "0.5px solid #111" }}
        >
          {t("ctaButton")}
        </Link>
      </div>

      {/* ========== VR360 FULLSCREEN MODAL ========== */}
      {mounted && vrModal && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center" onClick={() => setVrModal(null)}>
          <div className="relative w-[95vw] h-[90vh] max-w-[1600px]" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button
              onClick={() => setVrModal(null)}
              className="absolute -top-10 right-0 text-white/80 hover:text-white text-sm flex items-center gap-1.5 transition-colors z-10"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
              Close
            </button>
            {/* Title */}
            <div className="absolute -top-10 left-0 text-white/70 text-sm">
              {vrModal.title}
            </div>
            {/* Iframe */}
            <iframe
              src={vrModal.url}
              className="w-full h-full rounded-lg border-0"
              allowFullScreen
              allow="accelerometer; gyroscope; xr-spatial-tracking"
              title={vrModal.title}
            />
          </div>
        </div>,
        document.body
      )}

      {/* ========== LIGHTBOX MODAL ========== */}
      {lightbox && (
        <Lightbox
          src={lightbox.src}
          alt={lightbox.alt}
          isVideo={lightbox.isVideo}
          onClose={() => setLightbox(null)}
        />
      )}

      {/* ========== COMPOSITE FULLSCREEN MODAL ========== */}
      {mounted && compositeModal && createPortal(
        <div 
          className="fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-center p-4 sm:p-8 select-none"
          onClick={() => setCompositeModal(null)}
        >
          <button 
            onClick={(e) => { e.stopPropagation(); setCompositeModal(null); }}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white z-[10000] transition"
            aria-label="Close"
          >
            <X size={24} />
          </button>
          
          <div 
            className="flex items-center justify-center w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full h-full max-w-[90vw] max-h-[90vh] bg-neutral-900 p-2 sm:p-4 rounded-lg border border-neutral-800 shadow-2xl overflow-hidden flex items-center justify-center">
              <BeforeAfterSlider
                beforeImage={compositeModal.beforeImage}
                afterImage={compositeModal.afterImage}
                beforeLabel={locale === "ja" ? "BEFORE" : "BEFORE"}
                afterLabel={locale === "ja" ? "AFTER" : "AFTER"}
                autoAspect={true}
                maxHeight={Math.floor(vh * 0.85)}
                initialPosition={50}
              />
            </div>
          </div>
          
          <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-[11px] uppercase tracking-[0.24em] pointer-events-none z-[10000]">
            {locale === "ja" ? "← ドラッグして比較 →" : "Drag the handle to compare ↔"}
          </p>
        </div>,
        document.body
      )}
    </div>
  );
}
