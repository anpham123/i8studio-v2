"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useScroll, useTransform, useSpring, motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useLocale } from "next-intl";

interface ScrollSequenceHeroProps {
  totalFrames?: number;
  framePattern?: (index: number) => string;
  fallbackVideo?: string;
  heroTexts?: Record<string, string>;
}

export default function ScrollSequenceHero({
  totalFrames = 242,
  framePattern = (i) => `/sequences/hero/frame_${String(i).padStart(4, "0")}.jpg`,
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

  const beat3CtaLink = heroTexts.heroBeat3CtaLink || `/${locale}/contact`;
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const lastDrawnFrameRef = useRef<number>(-1);

  // Scroll progress through container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Immediate 1:1 responsive interpolation (zero inertia coasting, stops instantly when mouse stops)
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 45,
    stiffness: 400,
    mass: 0.01,
    restDelta: 0.00001,
  });

  const [activeFramesCount, setActiveFramesCount] = useState(totalFrames);

  // Sync with meta.json from admin upload
  useEffect(() => {
    fetch("/sequences/hero/meta.json", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.totalFrames && typeof data.totalFrames === "number" && data.totalFrames > 0) {
          setActiveFramesCount(data.totalFrames);
        }
      })
      .catch(() => {});
  }, []);

  // Render frame on Canvas
  const renderFrame = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      const idx = Math.min(Math.max(1, Math.round(frameIndex)), activeFramesCount) - 1;
      if (idx === lastDrawnFrameRef.current) return;

      let img = imagesRef.current[idx];
      // Fallback to nearest loaded frame if current frame is still downloading
      if (!img || !img.complete || img.naturalWidth === 0) {
        for (let i = idx - 1; i >= 0; i--) {
          if (imagesRef.current[i]?.complete && imagesRef.current[i]?.naturalWidth > 0) {
            img = imagesRef.current[i];
            break;
          }
        }
      }

      if (!img || !img.complete || img.naturalWidth === 0) return;

      lastDrawnFrameRef.current = idx;

      const w = canvas.width;
      const h = canvas.height;
      const imgW = img.naturalWidth;
      const imgH = img.naturalHeight;

      // Cover calculation
      const canvasRatio = w / h;
      const imgRatio = imgW / imgH;

      let renderW: number;
      let renderH: number;
      let offsetX: number;
      let offsetY: number;

      if (canvasRatio > imgRatio) {
        renderW = w;
        renderH = w / imgRatio;
        offsetX = 0;
        offsetY = (h - renderH) / 2;
      } else {
        renderH = h;
        renderW = h * imgRatio;
        offsetX = (w - renderW) / 2;
        offsetY = 0;
      }

      ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
    },
    [activeFramesCount]
  );

  // Preload all frames cleanly once
  useEffect(() => {
    let isMounted = true;
    const loadedImages: HTMLImageElement[] = [];
    let count = 0;

    for (let i = 1; i <= activeFramesCount; i++) {
      const img = new Image();
      img.src = framePattern(i);
      img.onload = () => {
        if (!isMounted) return;
        count++;
        setLoadedCount(count);
        if (count >= Math.min(10, activeFramesCount)) {
          setIsReady(true);
        }
        if (i === 1) {
          renderFrame(1);
        }
      };
      img.onerror = () => {
        if (!isMounted) return;
        count++;
        setLoadedCount(count);
        if (i === 1) {
          setUseFallback(true);
          setIsReady(true);
        }
      };
      loadedImages.push(img);
    }

    imagesRef.current = loadedImages;
    setIsReady(true);

    return () => {
      isMounted = false;
    };
  }, [activeFramesCount, framePattern, renderFrame]);

  // Resize canvas to match display DPI
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      lastDrawnFrameRef.current = -1;
      renderFrame(1);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [renderFrame, totalFrames]);

  // On-demand rendering when smooth scroll updates
  useEffect(() => {
    if (useFallback) return;

    let rafId: number | null = null;
    const unsubscribe = smoothProgress.on("change", (latest) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        // Map 0% -> 88% scroll progress to complete 100% of video frames,
        // leaving 88% -> 100% as a comfortable view buffer for the final scene
        const clampedProgress = Math.min(1, Math.max(0, latest / 0.88));
        const targetFrame = Math.min(
          totalFrames,
          Math.max(1, Math.round(1 + clampedProgress * (totalFrames - 1)))
        );
        renderFrame(targetFrame);
      });
    });

    return () => {
      unsubscribe();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [smoothProgress, totalFrames, renderFrame, useFallback]);

  // Fallback video scrubbing
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!useFallback) return;
    const unsubscribe = smoothProgress.on("change", (progress) => {
      const video = videoRef.current;
      if (video && video.duration) {
        const clampedProgress = Math.min(1, Math.max(0, progress / 0.88));
        video.currentTime = clampedProgress * video.duration;
      }
    });
    return () => unsubscribe();
  }, [smoothProgress, useFallback]);

  // Text overlay opacities for distinct story beats across the full house tour
  const story1Opacity = useTransform(smoothProgress, [0, 0.10, 0.18], [1, 1, 0]);
  const story1Y = useTransform(smoothProgress, [0, 0.18], [0, -30]);

  const story2Opacity = useTransform(smoothProgress, [0.22, 0.32, 0.45, 0.54], [0, 1, 1, 0]);
  const story2Y = useTransform(smoothProgress, [0.22, 0.32, 0.54], [30, 0, -30]);

  const story3Opacity = useTransform(smoothProgress, [0.58, 0.68, 0.78, 0.86], [0, 1, 1, 0]);
  const story3Y = useTransform(smoothProgress, [0.58, 0.68, 0.86], [30, 0, -30]);

  const story4Opacity = useTransform(smoothProgress, [0.88, 0.94, 1], [0, 1, 1]);
  const story4Y = useTransform(smoothProgress, [0.88, 1], [30, 0]);

  const progressPercent = Math.min(100, Math.round((loadedCount / Math.max(1, totalFrames)) * 100));

  return (
    <div ref={containerRef} className="relative h-[600vh] bg-[#0a0a0a]">
      {/* Sticky Fullscreen Frame */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Loading Indicator */}
        <AnimatePresence>
          {!isReady && !useFallback && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 z-50 bg-[#0a0a0a] flex flex-col items-center justify-center gap-4 text-white"
            >
              <div className="w-12 h-12 rounded-full border border-white/20 border-t-[#c5a666] animate-spin" />
              <p className="text-xs uppercase tracking-[0.3em] text-white/70 font-roboto">
                Loading 3D Experience · {progressPercent}%
              </p>
              <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#c5a666] to-[#e6ca85] transition-all duration-200"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1. Canvas (Image Sequence Mode) */}
        {!useFallback && (
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover select-none pointer-events-none"
          />
        )}

        {/* 2. Fallback Video Element (Scrubbing Mode) */}
        {useFallback && (
          <video
            ref={videoRef}
            src={fallbackVideo}
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover select-none pointer-events-none"
          />
        )}

        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_40%,rgba(0,0,0,0.6)_100%] pointer-events-none" />

        {/* ── Story Beat 1: Intro (0% - 25%) ── */}
        <motion.div
          style={{ opacity: story1Opacity, y: story1Y }}
          className="absolute inset-x-0 bottom-0 pb-8 sm:pb-12 md:pb-14 flex flex-col items-center justify-end text-center px-6 pointer-events-none z-20"
        >
          <div className="flex flex-col items-center max-w-4xl mb-4 sm:mb-5">
            <span className="text-xs sm:text-sm uppercase tracking-[0.35em] text-[#c5a666] font-bold mb-2.5 drop-shadow-md whitespace-nowrap">
              {introEyebrow}
            </span>
            <h1
              className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight drop-shadow-lg mb-2.5 whitespace-nowrap"
              style={{ fontFamily: "var(--font-noto-serif), var(--font-display), serif" }}
            >
              {introTitle}
            </h1>
            <p className="text-white/85 text-xs sm:text-sm md:text-base max-w-xl font-light drop-shadow-md">
              {introDesc}
            </p>
          </div>

          {/* Scroll Cue */}
          <div className="flex flex-col items-center gap-1.5 mt-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-white/50 whitespace-nowrap">
              {isJa ? "スクロールして探索" : "Scroll to explore"}
            </span>
            <div className="w-5 h-8 rounded-full border border-white/30 flex justify-center pt-1.5 backdrop-blur-[1px]">
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-1 h-1.5 rounded-full bg-[#c5a666]"
              />
            </div>
          </div>
        </motion.div>

        {/* ── Story Beat 2: Living & Light (30% - 60%) ── */}
        <motion.div
          style={{ opacity: story2Opacity, y: story2Y }}
          className="absolute bottom-8 sm:bottom-12 md:bottom-14 left-6 sm:left-10 md:left-14 flex flex-col items-start pointer-events-none z-20"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-[#c5a666] font-bold mb-2 block drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] whitespace-nowrap">
            {beat1Tag}
          </span>
          <h2
            className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white leading-snug mb-2.5 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] whitespace-nowrap"
            style={{ fontFamily: "var(--font-noto-serif), serif" }}
          >
            {beat1Title}
          </h2>
          <p className="text-white/90 text-xs sm:text-sm md:text-base leading-relaxed font-light drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] max-w-sm sm:max-w-md lg:max-w-lg">
            {beat1Desc}
          </p>
        </motion.div>

        {/* ── Story Beat 3: Private Sanctuary (65% - 88%) ── */}
        <motion.div
          style={{ opacity: story3Opacity, y: story3Y }}
          className="absolute bottom-24 sm:bottom-28 md:bottom-32 right-6 sm:right-10 md:right-14 flex flex-col items-end text-right pointer-events-none z-20"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-[#c5a666] font-bold mb-2 block drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] whitespace-nowrap">
            {beat2Tag}
          </span>
          <h2
            className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white leading-snug mb-2.5 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] whitespace-nowrap"
            style={{ fontFamily: "var(--font-noto-serif), serif" }}
          >
            {beat2Title}
          </h2>
          <p className="text-white/90 text-xs sm:text-sm md:text-base leading-relaxed font-light drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] max-w-sm sm:max-w-md lg:max-w-lg">
            {beat2Desc}
          </p>
        </motion.div>

        {/* ── Story Beat 4: Rooftop & CTA (92% - 100%) ── */}
        <motion.div
          style={{ opacity: story4Opacity, y: story4Y }}
          className="absolute inset-x-0 bottom-0 pb-14 sm:pb-20 flex flex-col items-center justify-end text-center px-6 z-20 pointer-events-none"
        >
          <span className="text-xs sm:text-sm uppercase tracking-[0.35em] text-[#c5a666] font-bold mb-2.5 drop-shadow-md whitespace-nowrap">
            {beat3Tag}
          </span>
          <h2
            className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight drop-shadow-lg mb-3 whitespace-nowrap"
            style={{ fontFamily: "var(--font-noto-serif), var(--font-display), serif" }}
          >
            {beat3Title}
          </h2>
          <p className="text-white/85 text-xs sm:text-sm md:text-base max-w-lg mb-6 font-light drop-shadow-md">
            {beat3Desc}
          </p>
          <div className="flex items-center justify-center pointer-events-auto">
            <Link
              href={beat3CtaLink}
              className="px-8 py-3.5 bg-[#c5a666] hover:bg-[#b8935a] text-[#111] text-xs sm:text-sm font-bold uppercase tracking-wider rounded-full transition-all shadow-xl hover:scale-105"
            >
              {beat3Cta}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
