"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useScroll, useTransform, useSpring, motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useLocale } from "next-intl";



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

function getContrastShadow(color: string, isBig = false) {
  const isDark = /^#(?:[0-3][0-9a-fA-F]{5}|0{3})/i.test(color) || color === "black" || color === "#121316";
  if (isDark) {
    return isBig ? "drop-shadow(0 2px 14px rgba(255,255,255,0.85))" : "drop-shadow(0 2px 8px rgba(255,255,255,0.8))";
  }
  return isBig ? "drop-shadow(0 2px 14px rgba(0,0,0,0.95))" : "drop-shadow(0 2px 10px rgba(0,0,0,0.95))";
}

interface ScrollSequenceHeroProps {
  totalFrames?: number;
  framePattern?: (index: number) => string;
  fallbackVideo?: string;
  heroTexts?: Record<string, string>;
}

const defaultFramePattern = (i: number) => `/sequences/hero/frame_${String(i).padStart(4, "0")}.webp`;

export default function ScrollSequenceHero({
  totalFrames = 240,
  framePattern = defaultFramePattern,
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

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const lastDrawnFrameRef = useRef<number>(-1);
  const targetFrameRef = useRef<number>(1);

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
  const activeFramesCountRef = useRef(activeFramesCount);
  const [currentFrameDisplay, setCurrentFrameDisplay] = useState(1);

  useEffect(() => {
    activeFramesCountRef.current = activeFramesCount;
  }, [activeFramesCount]);

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

      const total = activeFramesCountRef.current || 240;
      const idx = Math.min(Math.max(1, Math.round(frameIndex)), total) - 1;

      targetFrameRef.current = idx + 1;
      let img = imagesRef.current[idx];
      if (!img || !img.complete || img.naturalWidth === 0) {
        // Search backwards first
        for (let i = idx - 1; i >= 0; i--) {
          if (imagesRef.current[i]?.complete && imagesRef.current[i]?.naturalWidth > 0) {
            img = imagesRef.current[i];
            break;
          }
        }
        // If not found, search forwards
        if (!img || !img.complete || img.naturalWidth === 0) {
          for (let i = idx + 1; i < total; i++) {
            if (imagesRef.current[i]?.complete && imagesRef.current[i]?.naturalWidth > 0) {
              img = imagesRef.current[i];
              break;
            }
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
    []
  );

  // Preload all frames cleanly with robust parallel loading & throttled UI updates
  useEffect(() => {
    let isMounted = true;
    const loadedImages: HTMLImageElement[] = [];
    let count = 0;
    const total = activeFramesCount;

    for (let i = 1; i <= total; i++) {
      const img = new Image();
      img.src = framePattern(i);
      img.onload = () => {
        if (!isMounted) return;
        count++;
        // Throttle progress updates to avoid React re-rendering churn
        if (count % 20 === 0 || count >= total) {
          setLoadedCount(count);
        }
        if (count >= 10) {
          setIsReady(true);
        }
        // If user scrolled to this frame while it was loading or it is frame 1, render immediately
        if (targetFrameRef.current === i || (lastDrawnFrameRef.current === -1 && i === 1)) {
          renderFrame(i);
        }
      };
      img.onerror = () => {
        if (!isMounted) return;
        count++;
        if (i === 1) {
          setUseFallback(true);
          setIsReady(true);
        }
      };
      loadedImages[i - 1] = img;
    }

    imagesRef.current = loadedImages;

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
      
      const current = lastDrawnFrameRef.current >= 0 
        ? lastDrawnFrameRef.current + 1 
        : 1;
      renderFrame(current);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [renderFrame]);

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
    const startFrame = 1;
    const endFrame = activeFramesCount;
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

    const startFrame = 1;
    const endFrame = activeFramesCount;

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

  // ── Step-based Wheel Scroll Controller (Plan A: 1 wheel roll = complete scene transition) ──
  const BEAT_PROGRESSES = [0.0, 0.38, 0.74, 1.0];
  const isAnimatingRef = useRef<boolean>(false);

  const getContainerScrollBounds = useCallback(() => {
    if (!containerRef.current) return null;
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const containerTop = rect.top + scrollTop;
    const maxScroll = container.scrollHeight - window.innerHeight;
    return { containerTop, maxScroll, rect, scrollY: scrollTop };
  }, []);

  const scrollToBeat = useCallback(
    (targetIndex: number, duration: number = 850) => {
      const bounds = getContainerScrollBounds();
      if (!bounds || bounds.maxScroll <= 0) return;

      const clampedIndex = Math.max(0, Math.min(BEAT_PROGRESSES.length - 1, targetIndex));
      const targetProgress = BEAT_PROGRESSES[clampedIndex];
      const targetY = bounds.containerTop + targetProgress * bounds.maxScroll;

      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;

      const startY = window.scrollY || document.documentElement.scrollTop;
      const diff = targetY - startY;

      if (Math.abs(diff) < 2) {
        isAnimatingRef.current = false;
        return;
      }

      const startTime = performance.now();

      function step(currentTime: number) {
        const elapsed = currentTime - startTime;
        const p = Math.min(elapsed / duration, 1);
        // easeInOutCubic: buttery smooth acceleration and deceleration
        const ease = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

        window.scrollTo(0, startY + diff * ease);

        if (p < 1) {
          requestAnimationFrame(step);
        } else {
          window.scrollTo(0, targetY);
          setTimeout(() => {
            isAnimatingRef.current = false;
          }, 120);
        }
      }

      requestAnimationFrame(step);
    },
    [getContainerScrollBounds]
  );

  // Intercept mouse wheel when hero is sticky/active
  useEffect(() => {
    let wheelAccumulator = 0;
    let resetTimer: NodeJS.Timeout | null = null;

    const handleWheel = (e: WheelEvent) => {
      const bounds = getContainerScrollBounds();
      if (!bounds) return;

      const { rect, containerTop, maxScroll, scrollY } = bounds;
      // Active control zone: sticky within viewport
      const isStickyActive = rect.top <= 80 && rect.bottom >= window.innerHeight - 20;

      if (!isStickyActive) {
        return; // Allow natural scroll outside hero
      }

      // If transition animation is running, lock wheel to prevent stopping midway
      if (isAnimatingRef.current) {
        e.preventDefault();
        return;
      }

      wheelAccumulator += e.deltaY;
      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        wheelAccumulator = 0;
      }, 200);

      const threshold = 20;
      if (Math.abs(wheelAccumulator) < threshold) {
        return;
      }

      const isScrollingDown = wheelAccumulator > 0;
      wheelAccumulator = 0;

      const currentProgress = Math.max(0, Math.min(1, (scrollY - containerTop) / maxScroll));

      // Find closest beat index
      let closestIdx = 0;
      let minDiff = 999;
      BEAT_PROGRESSES.forEach((bp, idx) => {
        const diff = Math.abs(bp - currentProgress);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = idx;
        }
      });

      if (isScrollingDown) {
        if (closestIdx < BEAT_PROGRESSES.length - 1) {
          e.preventDefault();
          scrollToBeat(closestIdx + 1);
        } else {
          // At final scene (03 · Panorama): let user scroll down naturally to next section
        }
      } else {
        if (closestIdx > 0) {
          e.preventDefault();
          scrollToBeat(closestIdx - 1);
        } else {
          // At first scene: let user scroll back to top if applicable
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [getContainerScrollBounds, scrollToBeat]);

  // Fallback: If scrollbar was dragged or mouse wheel stopped midway, auto-snap cleanly
  useEffect(() => {
    let snapTimer: NodeJS.Timeout | null = null;

    const handleScrollEnd = () => {
      if (isAnimatingRef.current) return;
      const bounds = getContainerScrollBounds();
      if (!bounds) return;

      const { rect, containerTop, maxScroll, scrollY } = bounds;
      const isStickyActive = rect.top <= 80 && rect.bottom >= window.innerHeight - 20;
      if (!isStickyActive) return;

      const currentProgress = Math.max(0, Math.min(1, (scrollY - containerTop) / maxScroll));

      let closestIdx = 0;
      let minDiff = 999;
      BEAT_PROGRESSES.forEach((bp, idx) => {
        const diff = Math.abs(bp - currentProgress);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = idx;
        }
      });

      // If stopped in middle motion (> 0.03 away from beat), auto-snap cleanly
      if (minDiff > 0.03) {
        scrollToBeat(closestIdx, 600);
      }
    };

    const onScroll = () => {
      if (isAnimatingRef.current) return;
      if (snapTimer) clearTimeout(snapTimer);
      snapTimer = setTimeout(handleScrollEnd, 220);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (snapTimer) clearTimeout(snapTimer);
    };
  }, [getContainerScrollBounds, scrollToBeat]);

  // Keyboard navigation (ArrowDown, PageDown, Space, ArrowUp, PageUp)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const bounds = getContainerScrollBounds();
      if (!bounds) return;
      const { rect, containerTop, maxScroll, scrollY } = bounds;
      const isStickyActive = rect.top <= 80 && rect.bottom >= window.innerHeight - 20;
      if (!isStickyActive) return;

      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        const currentProgress = Math.max(0, Math.min(1, (scrollY - containerTop) / maxScroll));
        let closestIdx = 0;
        let minDiff = 999;
        BEAT_PROGRESSES.forEach((bp, idx) => {
          const diff = Math.abs(bp - currentProgress);
          if (diff < minDiff) {
            minDiff = diff;
            closestIdx = idx;
          }
        });
        if (closestIdx < BEAT_PROGRESSES.length - 1) {
          e.preventDefault();
          scrollToBeat(closestIdx + 1);
        }
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        const currentProgress = Math.max(0, Math.min(1, (scrollY - containerTop) / maxScroll));
        let closestIdx = 0;
        let minDiff = 999;
        BEAT_PROGRESSES.forEach((bp, idx) => {
          const diff = Math.abs(bp - currentProgress);
          if (diff < minDiff) {
            minDiff = diff;
            closestIdx = idx;
          }
        });
        if (closestIdx > 0) {
          e.preventDefault();
          scrollToBeat(closestIdx - 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [getContainerScrollBounds, scrollToBeat]);

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
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 border-t-[#10b981] animate-spin" />
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-white/70 font-roboto">
                Loading 3D Experience · {progressPercent}%
              </p>
              <div className="w-36 sm:w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#10b981] to-[#34d399] transition-all duration-200"
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
                <span style={{ color: introTagColor, filter: getContrastShadow(introTagColor) }} className="text-xs sm:text-sm uppercase tracking-[0.2em] font-bold mb-1.5 block drop-shadow">
                  {renderFormattedText(introEyebrow)}
                </span>
                <h1
                  className="text-base sm:text-lg font-bold leading-tight mb-1 drop-shadow"
                  style={{ color: introTitleColor, filter: getContrastShadow(introTitleColor, true), fontFamily: "var(--font-noto-serif), var(--font-display), serif" }}
                >
                  {renderFormattedText(introTitle)}
                </h1>
                <p style={{ color: introDescColor, filter: getContrastShadow(introDescColor) }} className="text-sm sm:text-base font-bold drop-shadow leading-snug mb-2">
                  {renderFormattedText(introDesc)}
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
                <span style={{ color: beat1TagColor, filter: getContrastShadow(beat1TagColor) }} className="text-xs sm:text-sm uppercase tracking-[0.2em] font-bold mb-1.5 block drop-shadow">
                  {renderFormattedText(beat1Tag)}
                </span>
                <h2
                  className="text-base sm:text-lg font-bold leading-tight mb-1 drop-shadow"
                  style={{ color: beat1TitleColor, filter: getContrastShadow(beat1TitleColor, true), fontFamily: "var(--font-noto-serif), var(--font-display), serif" }}
                >
                  {renderFormattedText(beat1Title)}
                </h2>
                <p style={{ color: beat1DescColor, filter: getContrastShadow(beat1DescColor) }} className="text-sm sm:text-base font-bold drop-shadow leading-snug mb-2">
                  {renderFormattedText(beat1Desc)}
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
                <span style={{ color: beat2TagColor, filter: getContrastShadow(beat2TagColor) }} className="text-xs sm:text-sm uppercase tracking-[0.2em] font-bold mb-1.5 block drop-shadow">
                  {renderFormattedText(beat2Tag)}
                </span>
                <h2
                  className="text-base sm:text-lg font-bold leading-tight mb-1 drop-shadow"
                  style={{ color: beat2TitleColor, filter: getContrastShadow(beat2TitleColor, true), fontFamily: "var(--font-noto-serif), var(--font-display), serif" }}
                >
                  {renderFormattedText(beat2Title)}
                </h2>
                <p style={{ color: beat2DescColor, filter: getContrastShadow(beat2DescColor) }} className="text-sm sm:text-base font-bold drop-shadow leading-snug mb-2">
                  {renderFormattedText(beat2Desc)}
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
                <span style={{ color: beat3TagColor, filter: getContrastShadow(beat3TagColor) }} className="text-xs sm:text-sm uppercase tracking-[0.2em] font-bold mb-1.5 block drop-shadow">
                  {renderFormattedText(beat3Tag)}
                </span>
                <h2
                  className="text-base sm:text-lg font-bold leading-tight mb-1 drop-shadow"
                  style={{ color: beat3TitleColor, filter: getContrastShadow(beat3TitleColor, true), fontFamily: "var(--font-noto-serif), var(--font-display), serif" }}
                >
                  {renderFormattedText(beat3Title)}
                </h2>
                <p style={{ color: beat3DescColor, filter: getContrastShadow(beat3DescColor) }} className="text-sm sm:text-base font-bold drop-shadow leading-snug mb-2">
                  {renderFormattedText(beat3Desc)}
                </p>
              </motion.div>
            )}
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
              className="text-xs sm:text-sm text-white/90 font-mono tracking-widest drop-shadow font-semibold hover:text-[#10b981] transition-colors"
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
            <span
              style={{ color: introTagColor, filter: getContrastShadow(introTagColor) }}
              className="text-base md:text-lg lg:text-[20px] uppercase tracking-[0.3em] font-bold mb-2.5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]"
            >
              {renderFormattedText(introEyebrow)}
            </span>
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)] mb-3.5"
              style={{ color: introTitleColor, filter: getContrastShadow(introTitleColor, true), fontFamily: "var(--font-noto-serif), var(--font-display), serif" }}
            >
              {renderFormattedText(introTitle)}
            </h1>
            <p
              style={{ color: introDescColor, filter: getContrastShadow(introDescColor) }}
              className="text-lg md:text-xl lg:text-[24px] font-bold drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)] leading-relaxed tracking-wide"
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
          <span
            style={{ color: beat1TagColor, filter: getContrastShadow(beat1TagColor) }}
            className="text-base md:text-lg lg:text-[20px] uppercase tracking-[0.3em] font-bold mb-2.5 block drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]"
          >
            {renderFormattedText(beat1Tag)}
          </span>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-3.5 drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]"
            style={{ color: beat1TitleColor, filter: getContrastShadow(beat1TitleColor, true), fontFamily: "var(--font-noto-serif), var(--font-display), serif" }}
          >
            {renderFormattedText(beat1Title)}
          </h2>
          <p
            style={{ color: beat1DescColor, filter: getContrastShadow(beat1DescColor) }}
            className="text-lg md:text-xl lg:text-[22px] leading-relaxed font-bold drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)] tracking-wide"
          >
            {renderFormattedText(beat1Desc)}
          </p>
        </motion.div>

        {/* ── Desktop Story Beat 3: Private Sanctuary ── */}
        <motion.div
          style={{ opacity: story3Opacity, y: story3Y }}
          className="hidden sm:flex absolute bottom-28 md:bottom-32 right-10 md:right-14 flex-col items-end text-right pointer-events-none z-20 max-w-[95vw] pl-6"
        >
          <span
            style={{ color: beat2TagColor, filter: getContrastShadow(beat2TagColor) }}
            className="text-base md:text-lg lg:text-[20px] uppercase tracking-[0.3em] font-bold mb-2.5 block drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]"
          >
            {renderFormattedText(beat2Tag)}
          </span>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-3.5 drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]"
            style={{ color: beat2TitleColor, filter: getContrastShadow(beat2TitleColor, true), fontFamily: "var(--font-noto-serif), var(--font-display), serif" }}
          >
            {renderFormattedText(beat2Title)}
          </h2>
          <p
            style={{ color: beat2DescColor, filter: getContrastShadow(beat2DescColor) }}
            className="text-lg md:text-xl lg:text-[22px] leading-relaxed font-bold drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)] tracking-wide"
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
            <span
              style={{ color: beat3TagColor, filter: getContrastShadow(beat3TagColor) }}
              className="text-base md:text-lg lg:text-[20px] uppercase tracking-[0.3em] font-bold mb-2.5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]"
            >
              {renderFormattedText(beat3Tag)}
            </span>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)] mb-3.5"
              style={{ color: beat3TitleColor, filter: getContrastShadow(beat3TitleColor, true), fontFamily: "var(--font-noto-serif), var(--font-display), serif" }}
            >
              {renderFormattedText(beat3Title)}
            </h2>
            <p
              style={{ color: beat3DescColor, filter: getContrastShadow(beat3DescColor) }}
              className="text-lg md:text-xl lg:text-[22px] mb-6 font-bold drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)] leading-relaxed tracking-wide"
            >
              {renderFormattedText(beat3Desc)}
            </p>
            <div className="flex items-center justify-center pointer-events-auto">
              <Link
                href={beat3CtaLink}
                className="px-8 py-3.5 bg-[#10b981] hover:bg-[#059669] text-white text-sm font-bold uppercase tracking-wider rounded-full transition-all shadow-xl hover:scale-105"
              >
                {beat3Cta}
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ── Scene Step Navigation Pills (Desktop) ── */}
        <div className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-3 bg-black/40 backdrop-blur-md py-3.5 px-2 rounded-full border border-white/10 pointer-events-auto shadow-2xl">
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

