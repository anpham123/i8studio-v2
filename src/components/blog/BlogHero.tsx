"use client";

import { sanitizeHtml } from "@/lib/sanitize";
import { BLOG_CATEGORIES } from "@/lib/blog-categories";
import { motion } from "framer-motion";

export default function BlogHero({
  category,
  eyebrow,
  title,
  subtitle,
  heroImage,
  locale = "ja",
}: {
  category: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  heroImage?: string;
  locale?: string;
}) {
  const isJa = locale === "ja";
  const categoryLabel = isJa ? "カテゴリー" : "Category";
  const catObj = BLOG_CATEGORIES.find(
    (c) =>
      c.slug.toLowerCase() === (category || "").toLowerCase() ||
      c.aliases?.some((a) => a.toLowerCase() === (category || "").toLowerCase()) ||
      c.nameEn.toLowerCase() === (category || "").toLowerCase()
  );
  const localizedCategory = isJa ? (catObj?.nameJa || category) : (catObj?.nameEn || category);

  const getEyebrowText = (eb?: string) => {
    if (!eb) return "";
    if (!isJa) return eb;
    const map: Record<string, string> = {
      "i8 Life Gallery": "i8 ライフギャラリー",
      "I8 LIFE GALLERY": "i8 ライフギャラリー",
      "Process Case Study · 2026": "プロセス・ケーススタディ · 2026",
      "Architectural Visualization": "建築ビジュアライゼーション",
      "Architectural Visualization ": "建築ビジュアライゼーション",
    };
    return map[eb.trim()] || eb;
  };

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = `/${locale}/blogs`;
    }
  };

  return (
    <section className="relative w-full max-w-full overflow-hidden isolate">
      {/* Back button top-left */}
      <div className="absolute top-6 sm:top-8 left-4 sm:left-8 lg:left-12 z-30">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/60 hover:bg-black/85 text-white border border-white/20 backdrop-blur-md text-xs sm:text-sm transition-all duration-300 shadow-lg cursor-pointer group select-none active:scale-95"
          aria-label={isJa ? "前のページに戻る" : "Back to previous page"}
        >
          <svg
            className="w-4 h-4 transition-transform group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium tracking-wide">
            {isJa ? "戻る" : "Back"}
          </span>
        </button>
      </div>

      {/* Eyebrow top-right & Panoramic Badge */}
      <div className="absolute top-6 sm:top-8 right-4 sm:right-10 lg:right-12 z-30 flex items-center gap-2.5">
        {/* Panoramic Scan Indicator Badge on Mobile */}
        <div className="sm:hidden px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#c5a666]/35 text-[9px] font-mono text-[#c5a666] tracking-wider uppercase flex items-center gap-1.5 shadow-md">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#c5a666] animate-pulse" />
          <span>⟷ PANORAMIC SCAN</span>
        </div>

        {eyebrow && (
          <div className="hidden sm:block text-white/60 text-[11px] uppercase tracking-[0.24em]">
            {getEyebrowText(eyebrow)}
          </div>
        )}
      </div>

      {/* Blueprint Grid Background on Mobile */}
      <div
        className="sm:hidden absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(197, 166, 102, 0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(197, 166, 102, 0.18) 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
        }}
      />

      {/* Hero image — Ken Burns Auto-Panoramic Pan on Mobile, full-viewport on Desktop */}
      <div className="relative z-10 w-full h-[55vh] min-h-[380px] max-h-[520px] sm:h-[calc(100vh-var(--header-h,76px))] sm:min-h-[600px] sm:max-h-[1200px] overflow-hidden flex items-center justify-start sm:justify-center bg-[#0c0b0a]">
        <div className="relative w-full h-full overflow-hidden flex items-center justify-start sm:justify-center bg-[#111]">
          {heroImage ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <motion.img
              initial={{ scale: 1.04 }}
              animate={{
                scale: 1,
                x: ["0%", "-42%", "0%"],
              }}
              transition={{
                scale: { duration: 3.5, ease: [0.16, 1, 0.3, 1] },
                x: { duration: 22, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" },
              }}
              src={heroImage}
              alt={title.replace(/<[^>]*>/g, "")}
              className="h-full min-w-[190%] sm:min-w-full sm:w-full sm:h-full object-cover object-center sm:!transform-none"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#0d0c0a] via-[#1e1b14] to-[#2a2318]" />
          )}

          {/* Gradients */}
          <div className="absolute inset-0 z-2 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
          <div className="absolute inset-0 z-2 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

          {/* Grid pattern overlay on desktop */}
          <div
            className="hidden sm:block absolute inset-0 z-2 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(184,147,90,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(184,147,90,0.06) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>
      </div>

      {/* Title section BELOW image */}
      <div className="bg-[var(--surface)] pt-8 sm:pt-14 pb-4 sm:pb-6 border-b border-gray-100">
        <div className="w-full max-w-[1024px] mx-auto px-5 sm:px-6 lg:px-0">
          {/* Category badge */}
          {localizedCategory && (
            <div className="mb-2">
              <span className="inline-block text-[11px] font-mono tracking-widest text-[#c5a666] uppercase">
                {localizedCategory}
              </span>
            </div>
          )}

          {/* Title - Supports <br> from admin */}
          <h1
            className="font-serif text-[clamp(22px,2.5vw,34px)] font-bold leading-[1.4] tracking-tight text-[#111] mb-3 max-w-full"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(title) }}
          />

          {/* Subtitle - Supports <br> from admin */}
          {subtitle && (
            <p
              className="font-serif text-[14.5px] sm:text-[15.5px] md:text-[16.5px] text-[#555] font-normal leading-[1.65] max-w-full mb-2 tracking-normal"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(subtitle),
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
}

