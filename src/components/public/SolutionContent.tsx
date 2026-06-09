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
}

interface Section {
  num: string;
  titleEn: string;
  titleJp: string;
  descKey: string;
  tagsKey: string;
  slides: Slide[];
  layout: "text-left" | "image-left";
}

const SECTIONS: Section[] = [
  {
    num: "01",
    titleEn: "Still Image",
    titleJp: "静止画",
    descKey: "s1.desc",
    tagsKey: "s1.tags",
    slides: [
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
    slides: [
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
    slides: [
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
    slides: [
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
    slides: [
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
    slides: [
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
        {slides.map((slide, i) => (
          <div
            key={i}
            className="min-w-full h-full flex items-center justify-center relative"
            style={{
              backgroundColor: slide.bg,
              backgroundImage: slide.imageUrl
                ? `url(${slide.imageUrl})`
                : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Slide label pill */}
            <span
              className="absolute bottom-[18px] left-[18px] text-[11px] px-3.5 py-[5px] rounded-[20px]"
              style={{
                background: "rgba(255,255,255,0.92)",
                color: "#555",
                border: "0.5px solid #ddd",
              }}
            >
              {slide.label}
            </span>
          </div>
        ))}
      </div>

      {/* Prev arrow */}
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

      {/* Next arrow */}
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

      {/* Dots */}
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
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page content                                                  */
/* ------------------------------------------------------------------ */
export default function SolutionContent() {
  const t = useTranslations("solution");
  const locale = useLocale();

  return (
    <div className="bg-white">
      {/* ========== HERO ========== */}
      <div className="text-center pt-[72px] pb-14 px-[60px]">
        <p className="text-[11px] uppercase tracking-[0.16em] text-[#aaa] mb-4">
          {t("label")}
        </p>
        <h1 className="text-[42px] font-light tracking-[0.04em] text-[#111] mb-3">
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

        const textPanel = (
          <div
            className={`flex-1 min-w-[320px] px-14 py-14 flex flex-col justify-center ${
              isTextLeft ? "border-r-[0.5px] border-[#e8e8e8]" : ""
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

        const galleryPanel = (
          <div className="flex-[1.7] relative overflow-hidden">
            <GallerySlider slides={sec.slides} />
          </div>
        );

        return (
          <div
            key={sec.num}
            className="flex h-[560px] border-t-[0.5px] border-[#e8e8e8] overflow-hidden"
          >
            {isTextLeft ? (
              <>
                {textPanel}
                {galleryPanel}
              </>
            ) : (
              <>
                {galleryPanel}
                {textPanel}
              </>
            )}
          </div>
        );
      })}

      {/* ========== CTA ========== */}
      <div className="text-center py-20 px-[60px] border-t-[0.5px] border-[#e8e8e8]">
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
