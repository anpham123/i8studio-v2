"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

/* ------------------------------------------------------------------ */
/*  Slide & Section data                                               */
/* ------------------------------------------------------------------ */
interface Slide {
  label: string;
  bg: string;
  imageUrl?: string;
  videoUrl?: string;
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
  return /\.(mp4|webm|ogg)(\?|$)/i.test(url);
}

function GallerySlider({ slides }: { slides: Slide[] }) {
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
                <img
                  src={slide.imageUrl}
                  alt={slide.label}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading={i === 0 ? "eager" : "lazy"}
                />
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
  videoUrl?: string;
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
        videoUrl: w.videoUrl || undefined,
      }));
    }
    return sec.fallbackSlides;
  }

  return (
    <div className="bg-white">
      {/* ========== HERO ========== */}
      <div className="text-center pt-[72px] pb-14 px-6 sm:px-[60px]">
        <p className="text-[11px] uppercase tracking-[0.16em] text-[#aaa] mb-4">
          {t("label")}
        </p>
        <h1 className="text-[36px] sm:text-[42px] font-light tracking-[0.04em] text-[#111] mb-3">
          {t("title")}
        </h1>
        <p className="text-[13px] text-[#888] leading-[2]">
          {t("heroLine1")}
          <br />
          {t("heroLine2")}
        </p>
      </div>

      {/* ========== SECTIONS ========== */}
      {SECTIONS.map((sec) => {
        const isTextLeft = sec.layout === "text-left";
        const slides = getSlidesForSection(sec);

        const textPanel = (
          <div
            className={`flex-1 min-w-[320px] px-8 sm:px-14 py-14 flex flex-col justify-center ${
              isTextLeft ? "lg:border-r-[0.5px] border-[#e8e8e8]" : ""
            }`}
          >
            <div className="text-[12px] text-[#ccc] tracking-[0.1em] mb-4">
              {sec.num}
            </div>
            <div className="text-[28px] font-light tracking-[0.02em] text-[#111] mb-1">
              {sec.titleEn}
            </div>
            <div className="text-[13px] text-[#999] mb-5">
              {sec.titleJp}
            </div>
            <div className="text-[13px] text-[#666] leading-[2] mb-[22px] whitespace-pre-line">
              {t(sec.descKey)}
            </div>
            <div className="flex flex-wrap gap-1.5 mb-8">
              {(t.raw(sec.tagsKey) as string[]).map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] px-3 py-1 rounded-[20px] text-[#888]"
                  style={{ border: "0.5px solid #ccc" }}
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
          </div>
        );


        return (
          <div
            key={sec.num}
            className="flex flex-col lg:flex-row lg:h-[560px] border-t-[0.5px] border-[#e8e8e8] overflow-hidden"
          >
            {isTextLeft ? (
              <>
                {textPanel}
                <div className="flex-[1.7] relative overflow-hidden min-h-[400px] lg:min-h-0">
                  <GallerySlider slides={slides} />
                </div>
              </>
            ) : (
              <>
                <div className="order-2 lg:order-1 flex-[1.7] relative overflow-hidden min-h-[400px] lg:min-h-0">
                  <GallerySlider slides={slides} />
                </div>
                <div className="order-1 lg:order-2 flex-1 min-w-[320px]">
                  {textPanel}
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
    </div>
  );
}
