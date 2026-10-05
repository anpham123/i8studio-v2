"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useScroll, useTransform, useMotionValue, motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useLocale } from "next-intl";

/*
 * ScrollSequenceHero — performance rewrite (2026-10-05)
 *
 * Key principles:
 *  - Native scrolling: no wheel/keyboard hijacking, no auto-snap. Frames follow the scrollbar 1:1.
 *  - Zero React re-renders while scrolling: canvas drawing runs in a single rAF loop driven by refs.
 *  - Frames are decoded off the main thread (img.decode) before they are eligible for drawing.
 *  - Progressive loading by stride (every 16th → 8th → 4th → 2nd → all) so any scroll position
 *    has a nearby frame quickly. Mobile uses a smaller frame set and every 2nd frame.
 *  - Frame URLs carry ?v=<updatedAt> so they can be cached as immutable by nginx.
 */

function renderFormattedText(text: string, forceNowrap = true) {
  if (!text) return null;
  // Splits on <br>, <br/>, <br />, <\br>, </br>, &lt;br&gt;, &lt;\br&gt;, or \n
  const parts = text.split(/(?:<\\?br\s*\/?>|<\/br>|&lt;\\?br\s*\/?&gt;|&lt;\/br&gt;|\r?\n)/i);
  if (parts.length === 1) {
    return <span className={forceNowrap ? "inline-block md:whitespace-nowrap" : undefined}>{parts[0]}</span>;
  }
  return (
    <>
      {parts.map((part, index) => (
        <span key={index} className={forceNowrap ? "block md:whitespace-nowrap" : "block"}>
          {part}
        </span>
      ))}
    </>
  );
}

/** Contrast shadow via text-shadow (much cheaper than CSS filter: drop-shadow over a repainting canvas) */
function getContrastShadow(color: string, isBig = false) {
  const isDark = /^#(?:[0-3][0-9a-fA-F]{5}|0{3})/i.test(color) || color === "black" || color === "#121316";
  if (isDark) {
    return isBig ? "0 2px 14px rgba(255,255,255,0.85)" : "0 2px 8px rgba(255,255,255,0.8)";
  }
  return isBig
    ? "0 2px 4px rgba(0,0,0,0.6), 0 2px 14px rgba(0,0,0,0.95)"
    : "0 1px 3px rgba(0,0,0,0.6), 0 2px 10px rgba(0,0,0,0.95)";
}

interface ScrollSequenceHeroProps {
  totalFrames?: number;
  fallbackVideo?: string;
  heroTexts?: Record<string, string>;
}

interface HeroMeta {
  totalFrames: number;
  version: string;
  hasMobile: boolean;
}

const BASE_PATH = "/sequences/hero";
const MOBILE_BREAKPOINT = 640;
// Scroll progress (0..1) at which each story beat is fully visible — used by the nav pills
const BEAT_PROGRESSES = [0.0, 0.42, 0.75, 1.0];

export default function ScrollSequenceHero({
  totalFrames = 240,
  fallbackVideo = "/video/video 1.mp4",
  heroTexts = {},
}: ScrollSequenceHeroProps) {
  const locale = useLocale();
  const isJa = locale === "ja";

  // Story Beat 1: Intro
  const introEyebrow = isJa
    ? (heroTexts.heroIntroEyebrowJa || "i8 STUDIO · 3DCG 建築ビジュアライゼーション")
    : (heroTexts.heroIntroEyebrowEn || "i8 STUDIO · 3DCG ARCHITECTURAL VISUALIZATION");

  const introTitle = isJa
    ? (heroTexts.heroIntroTitleJa || "建築の美を、映画のような臨場感で")
    : (heroTexts.heroIntroTitleEn || "Cinematic Architectural Journey");

  const introDesc = isJa
    ? (heroTexts.heroIntroDescJa || "スクロールして空間の奥行きと光の表情をご体験ください")
    : (heroTexts.heroIntroDescEn || "Scroll to explore spatial depth, light, and architectural harmony");

  // Story Beat 2: Living & Light (01)
  const beat1Tag = isJa
    ? (heroTexts.heroBeat1TagJa || "01 · 空間の調和")
    : (heroTexts.heroBeat1TagEn || "01 · SPATIAL HARMONY");

  const beat1Title = isJa
    ? (heroTexts.heroBeat1TitleJa || "光と影が織りなすリビング空間")
    : (heroTexts.heroBeat1TitleEn || "Harmonious Living & Natural Light");

  const beat1Desc = isJa
    ? (heroTexts.heroBeat1DescJa || "厳密な光学計算に基づき、時間帯による自然光の移ろいと木・石・ファブリックの質感を極限まで再現。")
    : (heroTexts.heroBeat1DescEn || "Physically-based rendering reproduces true-to-life sunlight, wood textures, and refined interior tones.");

  // Story Beat 3: Private Sanctuary (02)
  const beat2Tag = isJa
    ? (heroTexts.heroBeat2TagJa || "02 · プライベート空間")
    : (heroTexts.heroBeat2TagEn || "02 · PRIVATE SANCTUARY");

  const beat2Title = isJa
    ? (heroTexts.heroBeat2TitleJa || "心地よさを追求したプライベート空間")
    : (heroTexts.heroBeat2TitleEn || "Private Retreat & Materiality");

  const beat2Desc = isJa
    ? (heroTexts.heroBeat2DescJa || "間接照明と視線の抜けを考慮したアングル設計。施主様が暮らす未来の情景を鮮やかに伝えます。")
    : (heroTexts.heroBeat2DescEn || "Atmospheric ambient lighting and seamless indoor-outdoor sightlines create captivating visual storytelling.");

  // Story Beat 4: Rooftop & CTA (03)
  const beat3Tag = isJa
    ? (heroTexts.heroBeat3TagJa || "03 · パノラマ＆スカイ空間")
    : (heroTexts.heroBeat3TagEn || "03 · PANORAMA & SKY RETREAT");

  const beat3Title = isJa
    ? (heroTexts.heroBeat3TitleJa || "プロジェクトに、圧倒的な説得力を。")
    : (heroTexts.heroBeat3TitleEn || "Elevate Your Architecture with i8 STUDIO");

  const beat3Desc = isJa
    ? (heroTexts.heroBeat3DescJa || "最高峰の3DCGビジュアライゼーションで、未だ見ぬ建築の価値を余すことなく表現します。")
    : (heroTexts.heroBeat3DescEn || "High-end 3D architectural rendering and animation trusted by leading firms.");

  const beat3Cta = isJa
    ? (heroTexts.heroBeat3CtaJa || "無料相談・お見積り")
    : (heroTexts.heroBeat3CtaEn || "Request Free Quote");

  const beat3CtaLink = `/${locale}/landingpage`;

  // Dynamic text colors from Admin Settings
  const introTagColor = heroTexts.heroIntroTagColor || "#10b981";
  const introTitleColor = heroTexts.heroIntroTitleColor || "#ffffff";
  const introDescColor = heroTexts.heroIntroDescColor || "#ffffff";

  const beat1TagColor = heroTexts.heroBeat1TagColor || "#10b981";
  const beat1TitleColor = heroTexts.heroBeat1TitleColor || "#ffffff";
  const beat1DescColor = heroTexts.heroBeat1DescColor || "#ffffff";

  const beat2TagColor = heroTexts.heroBeat2TagColor || "#10b981";
  const beat2TitleColor = heroTexts.heroBeat2TitleColor || "#ffffff";
  const beat2DescColor = heroTexts.heroBeat2DescColor || "#ffffff";

  const beat3TagColor = heroTexts.heroBeat3TagColor || "#10b981";
  const beat3TitleColor = heroTexts.heroBeat3TitleColor || "#ffffff";
  const beat3DescColor = heroTexts.heroBeat3DescColor || "#ffffff";

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [meta, setMeta] = useState<HeroMeta | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(1);

  /* ------------------------------------------------------------------ */
  /*  Mutable engine state (never triggers React renders)                */
  /* ------------------------------------------------------------------ */
  const engine = useRef({
    images: [] as (HTMLImageElement | undefined)[],
    decoded: [] as boolean[],
    total: 0,
    target: 0, // target progress 0..1 (from scroll)
    current: 0, // smoothed progress 0..1
    drawnIdx: -1,
    raf: 0,
    ctx: null as CanvasRenderingContext2D | null,
    isMobile: false,
    touching: false,
    touchAxis: "" as "" | "x" | "y",
    touchStartX: 0,
    touchStartY: 0,
    touchStartProgress: 0,
    beat: 1,
  });

  // Smoothed progress exposed as a MotionValue so text overlays animate without React renders
  const progress = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  /* ------------------------------------------------------------------ */
  /*  1. Read meta.json (frame count + version for cache busting)        */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    let cancelled = false;
    const fallbackMeta: HeroMeta = { totalFrames, version: "", hasMobile: false };
    const timeout = setTimeout(() => !cancelled && setMeta((m) => m || fallbackMeta), 2500);
    fetch(`${BASE_PATH}/meta.json`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const count = typeof data?.totalFrames === "number" && data.totalFrames > 0 ? data.totalFrames : totalFrames;
        const version = String(data?.updatedAt || "").replace(/[^0-9A-Za-z]/g, "");
        setMeta({ totalFrames: count, version, hasMobile: Boolean(data?.mobile) });
      })
      .catch(() => !cancelled && setMeta(fallbackMeta));
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [totalFrames]);

  /* ------------------------------------------------------------------ */
  /*  2. Canvas drawing                                                  */
  /* ------------------------------------------------------------------ */
  const nearestDecoded = useCallback((idx: number) => {
    const e = engine.current;
    if (e.decoded[idx]) return idx;
    for (let d = 1; d < e.total; d++) {
      if (idx - d >= 0 && e.decoded[idx - d]) return idx - d;
      if (idx + d < e.total && e.decoded[idx + d]) return idx + d;
    }
    return -1;
  }, []);

  const drawIndex = useCallback((wantedIdx: number, force = false) => {
    const e = engine.current;
    const canvas = canvasRef.current;
    if (!canvas || e.total === 0) return;
    const idx = nearestDecoded(wantedIdx);
    if (idx < 0 || (idx === e.drawnIdx && !force)) return;
    const img = e.images[idx];
    if (!img) return;

    if (!e.ctx) e.ctx = canvas.getContext("2d", { alpha: false });
    const ctx = e.ctx;
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const imgW = img.naturalWidth || 1920;
    const imgH = img.naturalHeight || 1080;

    if (e.isMobile) {
      // Exact 16:9 fit on mobile
      ctx.drawImage(img, 0, 0, w, h);
    } else {
      // Cover on desktop
      const scale = Math.max(w / imgW, h / imgH);
      const dw = imgW * scale;
      const dh = imgH * scale;
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
    }
    e.drawnIdx = idx;
  }, [nearestDecoded]);

  const progressToIndex = useCallback((p: number) => {
    const e = engine.current;
    if (e.total === 0) return 0;
    // Skip a few lead-in/lead-out frames (matches previous behaviour)
    const start = Math.min(5, e.total - 1);
    const end = Math.max(start, e.total - 7);
    return Math.round(start + Math.min(1, Math.max(0, p)) * (end - start));
  }, []);

  const updateBeat = useCallback((p: number) => {
    const e = engine.current;
    const beat = p < 0.25 ? 1 : p < 0.55 ? 2 : p < 0.85 ? 3 : 4;
    if (beat !== e.beat) {
      e.beat = beat;
      setCurrentBeat(beat); // only fires 3 times over the whole hero
    }
  }, []);

  // Single rAF loop: eases current → target, draws only when the frame index changes
  const tick = useCallback(() => {
    const e = engine.current;
    const diff = e.target - e.current;
    e.current = Math.abs(diff) < 0.0005 ? e.target : e.current + diff * 0.22;
    progress.set(e.current);
    updateBeat(e.current);
    drawIndex(progressToIndex(e.current));
    e.raf = e.current !== e.target ? requestAnimationFrame(tick) : 0;
  }, [drawIndex, progress, progressToIndex, updateBeat]);

  const kick = useCallback(() => {
    const e = engine.current;
    if (!e.raf) e.raf = requestAnimationFrame(tick);
  }, [tick]);

  /* ------------------------------------------------------------------ */
  /*  3. Scroll → target progress                                        */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const e = engine.current;
    e.target = e.current = scrollYProgress.get();
    const unsub = scrollYProgress.on("change", (v) => {
      if (e.touching) return;
      e.target = Math.min(1, Math.max(0, v));
      kick();
    });
    return () => {
      unsub();
      if (e.raf) cancelAnimationFrame(e.raf);
      e.raf = 0;
    };
  }, [scrollYProgress, kick]);

  /* ------------------------------------------------------------------ */
  /*  4. Canvas sizing (DPR capped for performance)                      */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const applySize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const e = engine.current;
      e.isMobile = window.innerWidth < MOBILE_BREAKPOINT;
      const dpr = Math.min(window.devicePixelRatio || 1, e.isMobile ? 2 : 1.5);
      const cssW = window.innerWidth;
      const cssH = e.isMobile ? cssW / (16 / 9) : window.innerHeight;
      const w = Math.round(cssW * dpr);
      const h = Math.round(cssH * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        e.ctx = canvas.getContext("2d", { alpha: false });
        if (e.ctx) {
          e.ctx.imageSmoothingEnabled = true;
          e.ctx.imageSmoothingQuality = "medium";
        }
        drawIndex(progressToIndex(e.current), true);
      }
    };
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(applySize, 120);
    };
    applySize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (resizeTimer) clearTimeout(resizeTimer);
    };
  }, [drawIndex, progressToIndex, useFallback]);

  /* ------------------------------------------------------------------ */
  /*  5. Progressive frame loading                                       */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!meta) return;
    const e = engine.current;
    let cancelled = false;

    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    e.isMobile = isMobile;
    const total = meta.totalFrames;
    e.total = total;
    e.images = new Array(total);
    e.decoded = new Array(total).fill(false);
    e.drawnIdx = -1;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const conn = (navigator as any).connection;
    const saveData = Boolean(conn?.saveData) || /(^|-)2g$/.test(conn?.effectiveType || "");
    const useMobileSet = isMobile && meta.hasMobile;
    // Mobile / data-saver: load every 2nd (or 3rd) frame — nearest-frame drawing fills the gaps
    const step = saveData ? 3 : isMobile ? 2 : 1;
    const dir = useMobileSet ? `${BASE_PATH}/m` : BASE_PATH;
    const qs = meta.version ? `?v=${meta.version}` : "";
    const urlFor = (idx: number) => `${dir}/frame_${String(idx + 1).padStart(4, "0")}.webp${qs}`;

    // Build load order: first frames, then coarse → fine strides
    const order: number[] = [];
    const seen = new Set<number>();
    const push = (i: number) => {
      if (i >= 0 && i < total && i % step === 0 && !seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    };
    const startIdx = progressToIndex(e.current);
    for (let i = 0; i < 6 * step; i++) push(startIdx + i);
    for (const stride of [16, 8, 4, 2, 1]) {
      for (let i = 0; i < total; i += stride) push(i);
    }

    let cursor = 0;
    let inFlight = 0;
    const CONCURRENCY = 6;

    const loadNext = () => {
      while (!cancelled && inFlight < CONCURRENCY && cursor < order.length) {
        const idx = order[cursor++];
        inFlight++;
        const img = new Image();
        img.decoding = "async";
        img.src = urlFor(idx);
        e.images[idx] = img;
        const done = (ok: boolean) => {
          inFlight--;
          if (cancelled) return;
          if (ok) {
            e.decoded[idx] = true;
            const wanted = progressToIndex(e.current);
            if (e.drawnIdx < 0 || Math.abs(idx - wanted) < Math.abs(e.drawnIdx - wanted)) {
              drawIndex(wanted, true);
            }
            if (e.drawnIdx >= 0) setIsReady(true);
          } else if (idx === order[0] && !e.decoded.some(Boolean)) {
            // First frame failed — fall back to video scrubbing
            setUseFallback(true);
            setIsReady(true);
            cancelled = true;
            return;
          }
          loadNext();
        };
        img.decode().then(() => done(true), () => done(img.complete && img.naturalWidth > 0));
      }
    };
    loadNext();

    return () => {
      cancelled = true;
    };
  }, [meta, drawIndex, progressToIndex]);

  /* ------------------------------------------------------------------ */
  /*  6. Fallback video scrubbing                                        */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!useFallback) return;
    const unsub = progress.on("change", (p) => {
      const video = videoRef.current;
      if (video && video.duration) {
        const clamped = Math.min(1, Math.max(0, p / 0.88));
        const startTime = 0.025 * video.duration;
        const endTime = 0.975 * video.duration;
        video.currentTime = startTime + clamped * (endTime - startTime);
      }
    });
    return () => unsub();
  }, [progress, useFallback]);

  /* ------------------------------------------------------------------ */
  /*  7. Mobile horizontal drag scrub (visual only, doesn't move page)   */
  /* ------------------------------------------------------------------ */
  const handleTouchStart = (ev: React.TouchEvent) => {
    const e = engine.current;
    e.touchStartX = ev.touches[0].clientX;
    e.touchStartY = ev.touches[0].clientY;
    e.touchStartProgress = e.current;
    e.touchAxis = "";
    e.touching = false;
  };

  const handleTouchMove = (ev: React.TouchEvent) => {
    const e = engine.current;
    const deltaX = ev.touches[0].clientX - e.touchStartX;
    const deltaY = ev.touches[0].clientY - e.touchStartY;
    if (!e.touchAxis) {
      if (Math.abs(deltaX) < 8 && Math.abs(deltaY) < 8) return;
      // Vertical swipe → let the browser scroll natively; horizontal → scrub frames
      e.touchAxis = Math.abs(deltaX) > Math.abs(deltaY) ? "x" : "y";
      e.touching = e.touchAxis === "x";
    }
    if (!e.touching) return;
    e.target = Math.min(1, Math.max(0, e.touchStartProgress - (deltaX / window.innerWidth) * 1.5));
    kick();
  };

  const handleTouchEnd = () => {
    const e = engine.current;
    e.touching = false;
    e.touchAxis = "";
  };

  /* ------------------------------------------------------------------ */
  /*  8. Scene navigation (native smooth scroll — never blocks the user) */
  /* ------------------------------------------------------------------ */
  const scrollToBeat = useCallback((targetIndex: number) => {
    const container = containerRef.current;
    if (!container) return;
    const clamped = Math.max(0, Math.min(BEAT_PROGRESSES.length - 1, targetIndex));
    const rect = container.getBoundingClientRect();
    const containerTop = rect.top + window.scrollY;
    // Same range as useScroll({ offset: ["start start", "end end"] })
    const maxScroll = container.offsetHeight - window.innerHeight;
    window.scrollTo({ top: containerTop + BEAT_PROGRESSES[clamped] * maxScroll, behavior: "smooth" });
  }, []);

  /* ------------------------------------------------------------------ */
  /*  Text overlay transforms (MotionValues → no React renders)          */
  /* ------------------------------------------------------------------ */
  const story1Opacity = useTransform(progress, [0, 0.03, 0.18, 0.25], [1, 1, 1, 0]);
  const story1Y = useTransform(progress, [0, 0.03, 0.18, 0.25], [0, 0, 0, -20]);

  const story2Opacity = useTransform(progress, [0.26, 0.32, 0.52, 0.6], [0, 1, 1, 0]);
  const story2Y = useTransform(progress, [0.26, 0.32, 0.52, 0.6], [25, 0, 0, -25]);

  const story3Opacity = useTransform(progress, [0.61, 0.68, 0.82, 0.88], [0, 1, 1, 0]);
  const story3Y = useTransform(progress, [0.61, 0.68, 0.82, 0.88], [25, 0, 0, -25]);

  const story4Opacity = useTransform(progress, [0.89, 0.94, 1], [0, 1, 1]);
  const story4Y = useTransform(progress, [0.89, 0.94, 1], [25, 0, 0]);

  // Reusable text styles
  const tagCls = "text-base md:text-lg lg:text-[20px] uppercase tracking-[0.3em] font-bold mb-2.5 block";
  const titleCls = "text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-3.5";
  const serif = "var(--font-noto-serif), var(--font-display), serif";

  const mobileBeats = [
    { key: "mbeat1", tag: introEyebrow, tagColor: introTagColor, title: introTitle, titleColor: introTitleColor, desc: introDesc, descColor: introDescColor, isH1: true },
    { key: "mbeat2", tag: beat1Tag, tagColor: beat1TagColor, title: beat1Title, titleColor: beat1TitleColor, desc: beat1Desc, descColor: beat1DescColor },
    { key: "mbeat3", tag: beat2Tag, tagColor: beat2TagColor, title: beat2Title, titleColor: beat2TitleColor, desc: beat2Desc, descColor: beat2DescColor },
    { key: "mbeat4", tag: beat3Tag, tagColor: beat3TagColor, title: beat3Title, titleColor: beat3TitleColor, desc: beat3Desc, descColor: beat3DescColor },
  ];
  const mb = mobileBeats[currentBeat - 1];
  const MobileTitleTag = mb.isH1 ? "h1" : "h2";

  return (
    <div ref={containerRef} className="relative w-full h-[300vh] sm:h-[350vh] bg-transparent sm:bg-[#0c0b0a]">
      {/* Viewport Frame — Sticky 16:9 on Mobile, Sticky Fullscreen on Desktop */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="sticky top-[var(--header-h,76px)] sm:top-0 w-full aspect-[16/9] sm:aspect-auto sm:h-screen overflow-hidden flex items-center justify-center bg-black shadow-sm z-20"
        style={{ contain: "layout paint" }}
      >
        {/* Loading Indicator */}
        <AnimatePresence>
          {!isReady && !useFallback && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 z-50 bg-[#111] flex flex-col items-center justify-center gap-4 text-white"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 border-t-[#10b981] animate-spin" />
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-white/70 font-roboto">
                Loading 3D Experience
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1. Canvas (Image Sequence Mode) */}
        {!useFallback && (
          <canvas ref={canvasRef} className="w-full h-full select-none z-10 touch-pan-y" />
        )}

        {/* 2. Fallback Video Element */}
        {useFallback && (
          <div className="relative z-10 w-full h-full overflow-hidden flex items-center justify-center">
            <video
              ref={videoRef}
              src={fallbackVideo}
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover select-none pointer-events-none"
            />
          </div>
        )}

        {/* ── Mobile Overlay Banner ── */}
        <div className="sm:hidden absolute inset-0 z-20 flex flex-col justify-end p-4 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={mb.key}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.2 }}
            >
              <span style={{ color: mb.tagColor, textShadow: getContrastShadow(mb.tagColor) }} className="text-xs sm:text-sm uppercase tracking-[0.2em] font-bold mb-1.5 block">
                {renderFormattedText(mb.tag)}
              </span>
              <MobileTitleTag
                className="text-base sm:text-lg font-bold leading-tight mb-1"
                style={{ color: mb.titleColor, textShadow: getContrastShadow(mb.titleColor, true), fontFamily: serif }}
              >
                {renderFormattedText(mb.title)}
              </MobileTitleTag>
              <p style={{ color: mb.descColor, textShadow: getContrastShadow(mb.descColor) }} className="text-sm sm:text-base font-bold leading-snug mb-2">
                {renderFormattedText(mb.desc)}
              </p>
            </motion.div>
          </AnimatePresence>
          <div className="pointer-events-auto mt-1 flex items-center justify-between">
            <Link
              href={beat3CtaLink}
              className="inline-block px-4 py-1.5 bg-[#10b981] hover:bg-[#059669] text-white text-[11px] font-bold uppercase tracking-wider rounded-full shadow-lg"
            >
              {beat3Cta}
            </Link>
            <button
              type="button"
              onClick={() => scrollToBeat(currentBeat % 4)}
              className="text-xs sm:text-sm text-white/90 font-mono tracking-widest font-semibold hover:text-[#10b981] transition-colors"
              style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}
              aria-label="Next scene"
            >
              0{currentBeat} / 04 ↓
            </button>
          </div>
        </div>

        {/* ── Desktop Story Beat 1: Intro ── */}
        <motion.div
          style={{ opacity: story1Opacity, y: story1Y }}
          className="hidden sm:flex absolute inset-x-0 bottom-0 pb-12 md:pb-14 flex-col items-center justify-end text-center px-6 pointer-events-none z-20"
        >
          <div className="flex flex-col items-center max-w-[95vw] px-4 mb-5">
            <span style={{ color: introTagColor, textShadow: getContrastShadow(introTagColor) }} className={tagCls}>
              {renderFormattedText(introEyebrow)}
            </span>
            <h1 className={titleCls} style={{ color: introTitleColor, textShadow: getContrastShadow(introTitleColor, true), fontFamily: serif }}>
              {renderFormattedText(introTitle)}
            </h1>
            <p
              style={{ color: introDescColor, textShadow: getContrastShadow(introDescColor, true) }}
              className="text-lg md:text-xl lg:text-[24px] font-bold leading-relaxed tracking-wide"
            >
              {renderFormattedText(introDesc)}
            </p>
          </div>
        </motion.div>

        {/* ── Desktop Story Beat 2: Living & Light ── */}
        <motion.div
          style={{ opacity: story2Opacity, y: story2Y }}
          className="hidden sm:flex absolute bottom-12 md:bottom-14 left-10 md:left-14 flex-col items-start pointer-events-none z-20 max-w-[95vw] pr-6"
        >
          <span style={{ color: beat1TagColor, textShadow: getContrastShadow(beat1TagColor) }} className={tagCls}>
            {renderFormattedText(beat1Tag)}
          </span>
          <h2 className={titleCls} style={{ color: beat1TitleColor, textShadow: getContrastShadow(beat1TitleColor, true), fontFamily: serif }}>
            {renderFormattedText(beat1Title)}
          </h2>
          <p
            style={{ color: beat1DescColor, textShadow: getContrastShadow(beat1DescColor, true) }}
            className="text-lg md:text-xl lg:text-[22px] leading-relaxed font-bold tracking-wide"
          >
            {renderFormattedText(beat1Desc)}
          </p>
        </motion.div>

        {/* ── Desktop Story Beat 3: Private Sanctuary ── */}
        <motion.div
          style={{ opacity: story3Opacity, y: story3Y }}
          className="hidden sm:flex absolute bottom-28 md:bottom-32 right-10 md:right-14 flex-col items-end text-right pointer-events-none z-20 max-w-[95vw] pl-6"
        >
          <span style={{ color: beat2TagColor, textShadow: getContrastShadow(beat2TagColor) }} className={tagCls}>
            {renderFormattedText(beat2Tag)}
          </span>
          <h2 className={titleCls} style={{ color: beat2TitleColor, textShadow: getContrastShadow(beat2TitleColor, true), fontFamily: serif }}>
            {renderFormattedText(beat2Title)}
          </h2>
          <p
            style={{ color: beat2DescColor, textShadow: getContrastShadow(beat2DescColor, true) }}
            className="text-lg md:text-xl lg:text-[22px] leading-relaxed font-bold tracking-wide"
          >
            {renderFormattedText(beat2Desc)}
          </p>
        </motion.div>

        {/* ── Desktop Story Beat 4: Rooftop & CTA ── */}
        <motion.div
          style={{ opacity: story4Opacity, y: story4Y }}
          className="hidden sm:flex absolute inset-x-0 bottom-0 pb-20 flex-col items-center justify-end text-center px-6 z-20 pointer-events-none"
        >
          <div className="flex flex-col items-center max-w-[95vw] px-4">
            <span style={{ color: beat3TagColor, textShadow: getContrastShadow(beat3TagColor) }} className={tagCls}>
              {renderFormattedText(beat3Tag)}
            </span>
            <h2 className={titleCls} style={{ color: beat3TitleColor, textShadow: getContrastShadow(beat3TitleColor, true), fontFamily: serif }}>
              {renderFormattedText(beat3Title)}
            </h2>
            <p
              style={{ color: beat3DescColor, textShadow: getContrastShadow(beat3DescColor, true) }}
              className="text-lg md:text-xl lg:text-[22px] mb-6 font-bold leading-relaxed tracking-wide"
            >
              {renderFormattedText(beat3Desc)}
            </p>
            <div className="flex items-center justify-center pointer-events-auto">
              <Link
                href={beat3CtaLink}
                className="px-8 py-3.5 bg-[#10b981] hover:bg-[#059669] text-white text-sm font-bold uppercase tracking-wider rounded-full transition-[background-color,transform] shadow-xl hover:scale-105"
              >
                {beat3Cta}
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ── Scene Step Navigation Pills (Desktop) — solid bg, no backdrop-blur over the repainting canvas ── */}
        <div className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-3 bg-black/55 py-3.5 px-2 rounded-full border border-white/10 pointer-events-auto shadow-2xl">
          {[
            { num: "01", title: isJa ? "建築の美" : "Exterior View" },
            { num: "02", title: isJa ? "空間の調和" : "Spatial Harmony" },
            { num: "03", title: isJa ? "プライベート空間" : "Private Sanctuary" },
            { num: "04", title: isJa ? "パノラマ＆スカイ" : "Panorama Retreat" },
          ].map((item, idx) => {
            const isActive = currentBeat === idx + 1;
            return (
              <button
                key={item.num}
                type="button"
                onClick={() => scrollToBeat(idx)}
                className="group relative flex items-center justify-center p-1.5 focus:outline-none"
                aria-label={`Jump to Scene ${item.num}: ${item.title}`}
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    isActive
                      ? "w-2.5 h-6 bg-[#10b981] shadow-[0_0_12px_rgba(16,185,129,0.9)]"
                      : "w-2.5 h-2.5 bg-white/40 hover:bg-white/80 group-hover:scale-125"
                  }`}
                />
                <span className="absolute right-10 px-2.5 py-1 bg-black/90 text-white text-[11px] font-medium rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none border border-white/15 shadow-lg translate-x-1 group-hover:translate-x-0">
                  <span className="text-[#10b981] font-mono mr-1.5">{item.num}</span>
                  {item.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
