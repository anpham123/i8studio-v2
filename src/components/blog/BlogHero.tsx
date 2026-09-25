"use client";

import { sanitizeHtml } from "@/lib/sanitize";

export default function BlogHero({
  eyebrow,
  title,
  subtitle,
  heroImage,
  locale = "ja",
}: {
  category?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  heroImage?: string;
  locale?: string;
}) {
  const isJa = locale === "ja";

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
      <div className="absolute top-4 sm:top-6 lg:top-8 left-4 sm:left-8 lg:left-12 z-30">
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

      {/* Eyebrow top-right */}
      {eyebrow && (
        <div className="absolute top-4 sm:top-6 lg:top-8 right-4 sm:right-10 lg:right-12 z-30 flex items-center gap-2.5">
          <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white/80 text-[10px] sm:text-[11px] uppercase tracking-[0.24em] font-medium shadow-md">
            {getEyebrowText(eyebrow)}
          </div>
        </div>
      )}

      {/* Hero Image — Full Width Edge-to-Edge & Full Image (Uncropped) */}
      <div className="relative z-10 w-full overflow-hidden bg-[#0c0b0a]">
        {heroImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={heroImage}
            alt={title.replace(/<[^>]*>/g, "")}
            className="w-full h-auto block select-none"
            loading="eager"
            decoding="async"
          />
        ) : (
          <div className="w-full h-[50vh] min-h-[350px] bg-gradient-to-br from-[#0d0c0a] via-[#1e1b14] to-[#2a2318]" />
        )}
      </div>

      {/* Title section BELOW image */}
      <div className="bg-[var(--surface)] pt-8 sm:pt-14 pb-2 sm:pb-3">
        <div className="w-full max-w-[1024px] mx-auto px-5 sm:px-6 lg:px-0">
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

