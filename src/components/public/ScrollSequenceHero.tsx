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
  framePattern = (i) => `/sequences/hero/frame_${String(i).padStart(4, "0")}.webp`,
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

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Scroll progress through container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Immediate 1:1 responsive interpolation (zero inertia coasting)
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 45,
    stiffness: 400,
    mass: 0.01,
    restDelta: 0.00001,
  });

  const [activeFramesCount, setActiveFramesCount] = useState(totalFrames);
  const [currentFrameDisplay, setCurrentFrameDisplay] = useState(1);

  // Sync with meta.json from admin upload
  useEffect(() => {
    fetch("/sequences/hero/meta.json", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.totalFrames && typeof data.totalFrames === "number" && data.totalFrames > 0) {
          setActiveFramesCount(data.totalFrames);
        }
      })
      .catch(() => { });
  }, []);

  // Render frame on Canvas (Exact 16:9 Fit on Mobile without cropping, Cover on Desktop)
  const renderFrame = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      const idx = Math.min(Math.max(1, Math.round(frameIndex)), activeFramesCount) - 1;

      let img = imagesRef.current[idx];
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
      setCurrentFrameDisplay(idx + 1);

      const w = canvas.width;
      const h = canvas.height;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      const isMobileView = window.innerWidth < 640;
      if (isMobileView) {
        // Exact fit: 100% full image view on 16:9 canvas
        ctx.drawImage(img, 0, 0, w, h);
      } else {
        // Desktop Cover mode
        const imgW = img.naturalWidth || 1920;
        const imgH = img.naturalHeight || 1080;
        const scale = Math.max(w / imgW, h / imgH);
        const drawW = imgW * scale;
        const drawH = imgH * scale;
        const drawX = (w - drawW) / 2;
        const drawY = (h - drawH) / 2;
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      }
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
        if (i === 6 || (i === 1 && !imagesRef.current[5])) {
          renderFrame(Math.min(6, activeFramesCount));
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
      const isMobileView = window.innerWidth < 640;
      canvas.width = window.innerWidth * dpr;
      // Exact 16:9 height on mobile (0 black gap above/below), fullscreen on desktop
      canvas.height = (isMobileView ? (window.innerWidth / (16 / 9)) : window.innerHeight) * dpr;
      lastDrawnFrameRef.current = -1;
      renderFrame(Math.min(6, activeFramesCount));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [renderFrame, activeFramesCount]);

  // Touch Drag scrub on mobile
  const touchStartXRef = useRef<number>(0);
  const touchStartFrameRef = useRef<number>(6);
  const isTouchingRef = useRef<boolean>(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartFrameRef.current = lastDrawnFrameRef.current > 0 ? lastDrawnFrameRef.current + 1 : 6;
    isTouchingRef.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isTouchingRef.current) return;
    const deltaX = e.touches[0].clientX - touchStartXRef.current;
    const startFrame = Math.min(6, activeFramesCount);
    const endFrame = Math.max(startFrame, activeFramesCount - 6);
    const frameDelta = -Math.round((deltaX / window.innerWidth) * (endFrame - startFrame) * 1.5);
    const targetFrame = Math.min(endFrame, Math.max(startFrame, touchStartFrameRef.current + frameDelta));
    renderFrame(targetFrame);
  };

  const handleTouchEnd = () => {
    isTouchingRef.current = false;
  };

  // On-demand rendering when smooth scroll updates
  useEffect(() => {
    if (useFallback) return;

    const startFrame = Math.min(6, activeFramesCount);
    const endFrame = Math.max(startFrame, activeFramesCount - 6);

    let rafId: number | null = null;

    const unsubscribe = smoothProgress.on("change", (latest: number) => {
      if (isTouchingRef.current) return;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const clampedProgress = Math.min(1, Math.max(0, latest));
        const targetFrame = Math.min(
          endFrame,
          Math.max(startFrame, Math.round(startFrame + clampedProgress * (endFrame - startFrame)))
        );
        renderFrame(targetFrame);
      });
    });

    return () => {
      unsubscribe();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [smoothProgress, activeFramesCount, renderFrame, useFallback]);

  // Fallback video scrubbing
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!useFallback) return;
    const unsubscribe = smoothProgress.on("change", (progress: number) => {
      const video = videoRef.current;
      if (video && video.duration) {
        const clampedProgress = Math.min(1, Math.max(0, progress / 0.88));
        const startTime = 0.025 * video.duration;
        const endTime = 0.975 * video.duration;
        video.currentTime = startTime + clampedProgress * (endTime - startTime);
      }
    });

    return () => unsubscribe();
  }, [smoothProgress, useFallback]);

  // Track active beat for mobile and desktop transitions
  const [currentBeat, setCurrentBeat] = useState(1);
  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (latest) => {
      if (latest < 0.25) {
        setCurrentBeat(1);
      } else if (latest < 0.55) {
        setCurrentBeat(2);
      } else if (latest < 0.85) {
        setCurrentBeat(3);
      } else {
        setCurrentBeat(4);
      }
    });
    return () => unsubscribe();
  }, [smoothProgress]);

  // Desktop Story Beat opacities
  const story1Opacity = useTransform(smoothProgress, [0, 0.03, 0.18, 0.25], [1, 1, 1, 0]);
  const story1Y = useTransform(smoothProgress, [0, 0.03, 0.18, 0.25], [0, 0, 0, -20]);

  const story2Opacity = useTransform(smoothProgress, [0.26, 0.32, 0.52, 0.6], [0, 1, 1, 0]);
  const story2Y = useTransform(smoothProgress, [0.26, 0.32, 0.52, 0.6], [25, 0, 0, -25]);

  const story3Opacity = useTransform(smoothProgress, [0.61, 0.68, 0.82, 0.88], [0, 1, 1, 0]);
  const story3Y = useTransform(smoothProgress, [0.61, 0.68, 0.82, 0.88], [25, 0, 0, -25]);

  const story4Opacity = useTransform(smoothProgress, [0.89, 0.94, 1], [0, 1, 1]);
  const story4Y = useTransform(smoothProgress, [0.89, 0.94, 1], [25, 0, 0]);

  const progressPercent = Math.min(100, Math.round((loadedCount / Math.max(1, totalFrames)) * 100));

  return (
    <div ref={containerRef} className="relative w-full h-[300vh] sm:h-[600vh] bg-transparent sm:bg-[#0c0b0a]">
      {/* Viewport Frame — Sticky 16:9 on Mobile, Sticky Fullscreen on Desktop */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="sticky top-[var(--header-h,76px)] sm:top-0 w-full aspect-[16/9] sm:aspect-auto sm:h-screen overflow-hidden flex items-center justify-center bg-black shadow-sm z-20"
      >
        {/* Loading Indicator */}
        <AnimatePresence>
          {!isReady && !useFallback && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 z-50 bg-[#111] flex flex-col items-center justify-center gap-4 text-white"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 border-t-[#c5a666] animate-spin" />
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-white/70 font-roboto">
                Loading 3D Experience · {progressPercent}%
              </p>
              <div className="w-36 sm:w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#c5a666] to-[#e6ca85] transition-all duration-200"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1. Canvas (Image Sequence Mode — Exact 16:9 on mobile, Fullscreen on Desktop) */}
        {!useFallback && (
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover select-none z-10 touch-none"
          />
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

        {/* ── Mobile Overlay Banner (Matches Image 1 Exactly with 01 / 04 indicator) ── */}
        <div className="sm:hidden absolute inset-0 z-20 flex flex-col justify-end p-4 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none">
          <AnimatePresence mode="wait">
            {currentBeat === 1 && (
              <motion.div
                key="mbeat1"
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#c5a666] font-bold mb-1 block drop-shadow">
                  {introEyebrow}
                </span>
                <h1
                  className="text-sm font-bold text-white leading-tight mb-1 drop-shadow [text-wrap:balance]"
                  style={{ fontFamily: "var(--font-noto-serif), var(--font-display), serif" }}
                >
                  {introTitle}
                </h1>
                <p className="text-white/85 text-[11px] font-light drop-shadow leading-snug line-clamp-2 mb-2">
                  {introDesc}
                </p>
              </motion.div>
            )}
            {currentBeat === 2 && (
              <motion.div
                key="mbeat2"
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#c5a666] font-bold mb-1 block drop-shadow">
                  {beat1Tag}
                </span>
                <h2
                  className="text-sm font-bold text-white leading-tight mb-1 drop-shadow [text-wrap:balance]"
                  style={{ fontFamily: "var(--font-noto-serif), var(--font-display), serif" }}
                >
                  {beat1Title}
                </h2>
                <p className="text-white/85 text-[11px] font-light drop-shadow leading-snug line-clamp-2 mb-2">
                  {beat1Desc}
                </p>
              </motion.div>
            )}
            {currentBeat === 3 && (
              <motion.div
                key="mbeat3"
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#c5a666] font-bold mb-1 block drop-shadow">
                  {beat2Tag}
                </span>
                <h2
                  className="text-sm font-bold text-white leading-tight mb-1 drop-shadow [text-wrap:balance]"
                  style={{ fontFamily: "var(--font-noto-serif), var(--font-display), serif" }}
                >
                  {beat2Title}
                </h2>
                <p className="text-white/85 text-[11px] font-light drop-shadow leading-snug line-clamp-2 mb-2">
                  {beat2Desc}
                </p>
              </motion.div>
            )}
            {currentBeat === 4 && (
              <motion.div
                key="mbeat4"
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#c5a666] font-bold mb-1 block drop-shadow">
                  {beat3Tag}
                </span>
                <h2
                  className="text-sm font-bold text-white leading-tight mb-1 drop-shadow [text-wrap:balance]"
                  style={{ fontFamily: "var(--font-noto-serif), var(--font-display), serif" }}
                >
                  {beat3Title}
                </h2>
                <p className="text-white/85 text-[11px] font-light drop-shadow leading-snug line-clamp-2 mb-2">
                  {beat3Desc}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="pointer-events-auto mt-1 flex items-center justify-between">
            <Link
              href={beat3CtaLink}
              className="inline-block px-4 py-1.5 bg-[#c5a666] hover:bg-[#b8935a] text-[#111] text-[11px] font-bold uppercase tracking-wider rounded-full shadow-lg"
            >
              {beat3Cta}
            </Link>
            <div className="text-[11px] text-white/80 font-mono tracking-widest drop-shadow font-semibold">
              0{currentBeat} / 04
            </div>
          </div>
        </div>

        {/* ── Desktop Story Beat 1: Intro ── */}
        <motion.div
          style={{ opacity: story1Opacity, y: story1Y }}
          className="hidden sm:flex absolute inset-x-0 bottom-0 pb-12 md:pb-14 flex-col items-center justify-end text-center px-6 pointer-events-none z-20"
        >
          <div className="flex flex-col items-center max-w-4xl mb-5">
            <span className="text-sm md:text-[15px] uppercase tracking-[0.35em] text-[#c5a666] font-bold mb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
              {introEyebrow}
            </span>
            <h1
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)] mb-3 [text-wrap:balance]"
              style={{ fontFamily: "var(--font-noto-serif), var(--font-display), serif" }}
            >
              {introTitle}
            </h1>
            <p className="text-white/85 text-sm md:text-base max-w-xl font-light drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] leading-relaxed">
              {introDesc}
            </p>
          </div>
        </motion.div>

        {/* ── Desktop Story Beat 2: Living & Light ── */}
        <motion.div
          style={{ opacity: story2Opacity, y: story2Y }}
          className="hidden sm:flex absolute bottom-12 md:bottom-14 left-10 md:left-14 flex-col items-start pointer-events-none z-20"
        >
          <span className="text-sm md:text-[15px] uppercase tracking-[0.35em] text-[#c5a666] font-bold mb-2 block drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
            {beat1Tag}
          </span>
          <h2
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-3 drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)] [text-wrap:balance]"
            style={{ fontFamily: "var(--font-noto-serif), var(--font-display), serif" }}
          >
            {beat1Title}
          </h2>
          <p className="text-white/90 text-sm md:text-base leading-relaxed font-light drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] max-w-md lg:max-w-xl">
            {beat1Desc}
          </p>
        </motion.div>

        {/* ── Desktop Story Beat 3: Private Sanctuary ── */}
        <motion.div
          style={{ opacity: story3Opacity, y: story3Y }}
          className="hidden sm:flex absolute bottom-28 md:bottom-32 right-10 md:right-14 flex-col items-end text-right pointer-events-none z-20"
        >
          <span className="text-sm md:text-[15px] uppercase tracking-[0.35em] text-[#c5a666] font-bold mb-2 block drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
            {beat2Tag}
          </span>
          <h2
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-3 drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)] [text-wrap:balance]"
            style={{ fontFamily: "var(--font-noto-serif), var(--font-display), serif" }}
          >
            {beat2Title}
          </h2>
          <p className="text-white/90 text-sm md:text-base leading-relaxed font-light drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] max-w-md lg:max-w-xl">
            {beat2Desc}
          </p>
        </motion.div>

        {/* ── Desktop Story Beat 4: Rooftop & CTA ── */}
        <motion.div
          style={{ opacity: story4Opacity, y: story4Y }}
          className="hidden sm:flex absolute inset-x-0 bottom-0 pb-20 flex-col items-center justify-end text-center px-6 z-20 pointer-events-none"
        >
          <span className="text-sm md:text-[15px] uppercase tracking-[0.35em] text-[#c5a666] font-bold mb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
            {beat3Tag}
          </span>
          <h2
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)] mb-3 [text-wrap:balance]"
            style={{ fontFamily: "var(--font-noto-serif), var(--font-display), serif" }}
          >
            {beat3Title}
          </h2>
          <p className="text-white/85 text-sm md:text-base max-w-xl mb-6 font-light drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] leading-relaxed">
            {beat3Desc}
          </p>
          <div className="flex items-center justify-center pointer-events-auto">
            <Link
              href={beat3CtaLink}
              className="px-8 py-3.5 bg-[#c5a666] hover:bg-[#b8935a] text-[#111] text-sm font-bold uppercase tracking-wider rounded-full transition-all shadow-xl hover:scale-105"
            >
              {beat3Cta}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
