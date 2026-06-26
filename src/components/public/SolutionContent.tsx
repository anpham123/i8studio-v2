"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { createPortal } from "react-dom";
import BeforeAfterSlider from "@/components/public/BeforeAfterSlider";

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

function GallerySlider({ slides, isPanorama = false, isComposite = false, onVrClick }: { slides: Slide[]; isPanorama?: boolean; isComposite?: boolean; onVrClick?: (url: string, title: string) => void }) {
  const locale = useLocale();
  const [idx, setIdx] = useState(0);
  const total = slides.length;

  const prev = useCallback(
    () => setIdx((i) => (i - 1 + total) % total),
    [total]
  );
  const next = useCallback(
    () => setIdx((i) => (i + 1) % total),
    [total]
  );

  if (total === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Track */}
      <div
        className="flex h-full"
        style={{
          transform: `translateX(-${idx * 100}%)`,
          transition: "transform 0.45s cubic-bezier(.4,0,.2,1)",
        }}
      >
        {slides.map((slide, i) => {
          const ytId = slide.videoUrl ? getYouTubeId(slide.videoUrl) : null;
          const directVideo = slide.videoUrl && isDirectVideo(slide.videoUrl);

          return (
            <div
              key={i}
              className="min-w-full h-full relative"
              style={{ backgroundColor: slide.bg }}
            >
              {/* YouTube embed */}
              {ytId ? (
                <>
                  {/* Poster image shown instantly while iframe loads */}
                  {slide.imageUrl && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={slide.imageUrl}
                      alt={slide.label}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  <iframe
                    src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                    style={{ zIndex: 1 }}
                    loading={i === 0 ? "eager" : "lazy"}
                    title={slide.label}
                  />
                </>
              ) : directVideo ? (
                <>
                  {/* Poster image shown instantly while video buffers */}
                  {slide.imageUrl && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={slide.imageUrl}
                      alt={slide.label}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  <video
                    src={slide.videoUrl}
                    poster={slide.imageUrl || undefined}
                    preload="auto"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ zIndex: 1 }}
                  />
                </>
              ) : slide.videoUrl ? (
                /* Non-playable video format (e.g. .mov) — show image only */
                slide.imageUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={slide.imageUrl}
                    alt={slide.label}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : null
              ) : slide.imageUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                isComposite && slide.beforeImageUrl ? (
                  <BeforeAfterSlider
                    before={slide.beforeImageUrl}
                    after={slide.imageUrl}
                    beforeLabel={locale === "ja" ? "合成前" : "Before"}
                    afterLabel={locale === "ja" ? "合成後" : "After"}
                  />
                ) : (
                  <img
                    src={slide.imageUrl}
                    alt={slide.label}
                    className={`absolute inset-0 w-full h-full object-cover ${isPanorama ? 'animate-pan-360' : ''}`}
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                )
              ) : null}

              {/* Slide label pill */}
              <span
                className="absolute bottom-[18px] left-[18px] text-[11px] px-3.5 py-[5px] rounded-[20px] z-10"
                style={{
                  background: "rgba(255,255,255,0.92)",
                  color: "#555",
                  border: "0.5px solid #ddd",
                }}
              >
                {slide.label}
              </span>

              {/* VR360 open button */}
              {slide.vrUrl && onVrClick && (
                <button
                  onClick={(e) => { e.stopPropagation(); onVrClick(slide.vrUrl!, slide.label); }}
                  className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-medium text-white bg-black/70 hover:bg-black/90 backdrop-blur-sm transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 8a2 2 0 012-2h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8z" />
                    <circle cx="8" cy="12" r="2" />
                    <circle cx="16" cy="12" r="2" />
                  </svg>
                  VR 360°
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Prev arrow */}
      {total > 1 && (
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-[42px] h-[42px] rounded-full flex items-center justify-center cursor-pointer hover:shadow-[0_0_0_1px_#ccc]"
          style={{
            background: "rgba(255,255,255,0.9)",
            border: "0.5px solid #ddd",
          }}
          aria-label="Previous"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      {/* Next arrow */}
      {total > 1 && (
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-[42px] h-[42px] rounded-full flex items-center justify-center cursor-pointer hover:shadow-[0_0_0_1px_#ccc]"
          style={{
            background: "rgba(255,255,255,0.9)",
            border: "0.5px solid #ddd",
          }}
          aria-label="Next"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      {/* Dots */}
      {total > 1 && (
        <div className="absolute bottom-4 right-[18px] flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className="w-1.5 h-1.5 rounded-full cursor-pointer transition-colors duration-200"
              style={{
                background: i === idx ? "#111" : "rgba(0,0,0,0.18)",
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
              href={`/${locale}/works`}
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
                <div className="w-full lg:w-[63%] shrink-0 relative overflow-hidden aspect-[16/9]">
                  <GallerySlider slides={slides} isPanorama={sec.workType === 'vr360'} isComposite={sec.workType === 'composite'} onVrClick={sec.workType === 'vr360' ? (url, title) => setVrModal({ url, title }) : undefined} />
                </div>
              </>
            ) : (
              <>
                <div className="order-2 lg:order-1 w-full lg:w-[63%] shrink-0 relative overflow-hidden aspect-[16/9]">
                  <GallerySlider slides={slides} isPanorama={sec.workType === 'vr360'} isComposite={sec.workType === 'composite'} onVrClick={sec.workType === 'vr360' ? (url, title) => setVrModal({ url, title }) : undefined} />
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
    </div>
  );
}
