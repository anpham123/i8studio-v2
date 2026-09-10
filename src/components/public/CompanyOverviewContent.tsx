"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { motion, useInView, useScroll, useTransform, useSpring } from "framer-motion";
import { sanitizeHtml } from "@/lib/sanitize";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

/* ------------------------------------------------------------------ */
/*  Animated Counter with Jump-Up-Drop-Down Bounce Animation          */
/* ------------------------------------------------------------------ */
function AnimatedCounter({ value, delay = 0 }: { value: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });
  const [displayValue, setDisplayValue] = useState<string>("0");
  const [isCounting, setIsCounting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Extract number and suffix, e.g. "2,000+" -> targetNum = 2000, suffix = "+"
  const rawNumStr = value.replace(/[^0-9]/g, "");
  const targetNum = parseInt(rawNumStr, 10) || 0;
  const suffix = value.replace(/[0-9,\s]/g, ""); // e.g. "+"

  useEffect(() => {
    if (!isInView) return;
    if (targetNum <= 0) {
      setDisplayValue("0");
      setIsFinished(true);
      return;
    }

    let animationFrameId: number;
    let stepTimerId: NodeJS.Timeout;

    const timeoutId = setTimeout(() => {
      setIsCounting(true);

      // Solution 1: Small numbers (like 5) count in steady, rhythmic steps with no waiting
      if (targetNum <= 10) {
        let currentStep = 1;
        setDisplayValue("1");

        const stepInterval = 85; // 85ms per step (e.g. 1 -> 2 -> 3 -> 4 -> 5 in ~340ms)
        const step = () => {
          if (currentStep >= targetNum) {
            setDisplayValue(targetNum.toLocaleString());
            setIsCounting(false);
            setIsFinished(true);
            return;
          }
          currentStep += 1;
          setDisplayValue(currentStep.toLocaleString());
          stepTimerId = setTimeout(step, stepInterval);
        };

        stepTimerId = setTimeout(step, stepInterval);
        return;
      }

      // Large numbers (80, 150, 2000) count smoothly with snappy ease-out in ~850ms
      const duration = 850;
      const startTime = performance.now();

      const updateCounter = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Exponential ease out for responsive, clean landing
        const easeProgress = 1 - Math.pow(1 - progress, 3.5);
        const current = Math.floor(1 + (targetNum - 1) * easeProgress);

        if (progress >= 1) {
          setDisplayValue(targetNum.toLocaleString());
          setIsCounting(false);
          setIsFinished(true);
        } else {
          setDisplayValue(current.toLocaleString());
          animationFrameId = requestAnimationFrame(updateCounter);
        }
      };

      animationFrameId = requestAnimationFrame(updateCounter);
    }, delay * 1000);

    return () => {
      clearTimeout(timeoutId);
      if (stepTimerId) clearTimeout(stepTimerId);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isInView, targetNum, delay]);

  return (
    <motion.div
      ref={ref}
      animate={
        isCounting
          ? { y: [0, -3, 0] }
          : isFinished
            ? { scale: [1, 1.08, 1] }
            : { y: 0 }
      }
      transition={
        isCounting
          ? { duration: 0.2, ease: "easeInOut", repeat: 1 } // Nhảy ít vòng, dứt khoát
          : { duration: 0.35, ease: "easeOut" }
      }
      className="inline-flex items-center justify-center font-roboto tracking-tight text-[#111]"
    >
      <span className="tabular-nums inline-block">
        {displayValue}
      </span>
      {suffix && (
        <span className="inline-block ml-0.5 text-[#111]">
          {suffix}
        </span>
      )}
    </motion.div>
  );
}

const DEFAULT_STATS = [
  { numJa: "80+", numEn: "80+", labelJa: "プロフェッショナルスタッフ", labelEn: "Professional Staff" },
  { numJa: "5+", numEn: "5+", labelJa: "年の経験", labelEn: "Years of Experience" },
  { numJa: "150+", numEn: "150+", labelJa: "グローバルクライアント", labelEn: "Global Clients" },
  { numJa: "2,000+", numEn: "2,000+", labelJa: "完了プロジェクト", labelEn: "Completed Projects" },
];

interface MilestoneItem {
  year?: string;
  yearJa?: string;
  yearEn?: string;
  titleJa: string;
  titleEn: string;
  descJa: string;
  descEn: string;
  image?: string;
  images?: string[];
}

const DEFAULT_MILESTONES: MilestoneItem[] = [
  {
    year: "2019",
    yearJa: "2019年",
    yearEn: "2019",
    titleJa: "i8 STUDIO 設立",
    titleEn: "i8 STUDIO Founded",
    descJa: "ベトナム・ダナンにて設立。日本市場向けの高品質3DCG制作を開始。",
    descEn: "Founded in Da Nang, Vietnam. Started high-quality 3DCG production for the Japanese market.",
    image: "/uploads/1781662116949-House_in_forest__Summer_.webp",
  },
  {
    year: "2020-2021",
    yearJa: "2020〜2021年",
    yearEn: "2020-2021",
    titleJa: "日本市場拡大",
    titleEn: "Japan Market Expansion",
    descJa: "日本の大手建築・不動産企業との取引を拡大。チームを30名に拡充。",
    descEn: "Expanded partnerships with major Japanese architecture and real estate firms. Team grew to 30 members.",
    image: "/uploads/1782289015929-260326_View_01.webp",
  },
  {
    year: "2022-2023",
    yearJa: "2022〜2023年",
    yearEn: "2022-2023",
    titleJa: "技術革新",
    titleEn: "Technological Innovation",
    descJa: "VR/AR技術を導入。リアルタイムレンダリングとバーチャルステージングサービスを開始。",
    descEn: "Introduced VR/AR technologies. Launched real-time rendering and virtual staging services.",
    image: "/uploads/1787120553201-wood_sauna_at_ziedlejas_wellness_resort_ver_3_retouch.webp",
  },
  {
    year: "2024〜",
    yearJa: "2024年〜",
    yearEn: "2024-Present",
    titleJa: "グローバルパートナーシップ",
    titleEn: "Global Partnership",
    descJa: "80名体制に拡大。AI技術の活用でさらなる品質向上と効率化を実現。グローバル展開を加速。",
    descEn: "Expanded to 80 members. Leveraging AI for enhanced quality and efficiency. Accelerating global expansion.",
    image: "/uploads/1787120363992-I8_Sample_005_Conner_Pool_002.webp",
  },
];

function buildStats(settings: Record<string, string>, overview?: Record<string, string>) {
  if (overview && (overview.staffCount || overview.yearsExperience || overview.clientCount || overview.projectCount)) {
    return [
      {
        numJa: `${overview.staffCount || "80"}+`,
        numEn: `${overview.staffCount || "80"}+`,
        labelJa: "プロフェッショナルスタッフ",
        labelEn: "Professional Staff",
      },
      {
        numJa: `${overview.yearsExperience || "5"}+`,
        numEn: `${overview.yearsExperience || "5"}+`,
        labelJa: "年の経験",
        labelEn: "Years of Experience",
      },
      {
        numJa: `${overview.clientCount || "150"}+`,
        numEn: `${overview.clientCount || "150"}+`,
        labelJa: "グローバルクライアント",
        labelEn: "Global Clients",
      },
      {
        numJa: `${overview.projectCount ? (isNaN(Number(overview.projectCount)) ? overview.projectCount : Number(overview.projectCount).toLocaleString()) : "2,000"}+`,
        numEn: `${overview.projectCount ? (isNaN(Number(overview.projectCount)) ? overview.projectCount : Number(overview.projectCount).toLocaleString()) : "2,000"}+`,
        labelJa: "完了プロジェクト",
        labelEn: "Completed Projects",
      },
    ];
  }
  return DEFAULT_STATS.map((def, i) => {
    const idx = i + 1;
    return {
      numEn: settings[`overviewStat${idx}NumEn`] || def.numEn,
      numJa: settings[`overviewStat${idx}NumJa`] || settings[`overviewStat${idx}NumEn`] || def.numJa,
      labelEn: settings[`overviewStat${idx}LabelEn`] || def.labelEn,
      labelJa: settings[`overviewStat${idx}LabelJa`] || def.labelJa,
    };
  });
}

/* ------------------------------------------------------------------ */
/*  Milestone Image Slideshow Component (2s Auto-transition + Full Image) */
/* ------------------------------------------------------------------ */
function MilestoneImageSlideshow({
  images,
  fallbackImage,
  title,
}: {
  images?: string[];
  fallbackImage?: string;
  title: string;
}) {
  const validImages =
    Array.isArray(images) && images.length > 0
      ? images.filter(Boolean)
      : fallbackImage
        ? [fallbackImage]
        : [];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (validImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % validImages.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [validImages.length]);

  if (validImages.length === 0) {
    return (
      <div className="w-full h-full min-h-[220px] flex items-center justify-center bg-gradient-to-br from-[#f5f5f3] via-[#eeeeeb] to-[#f5f5f3]">
        <span className="text-black text-sm font-medium">{title}</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[220px] md:min-h-[260px] overflow-hidden bg-gray-100">
      {validImages.map((src, idx) => (
        <motion.div
          key={src + "-" + idx}
          initial={false}
          animate={{
            opacity: idx === currentIndex ? 1 : 0,
          }}
          transition={{
            opacity: { duration: 0.5, ease: "easeInOut" },
          }}
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: idx === currentIndex ? 2 : 1 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`${title} - ${idx + 1}`}
            className="w-full h-full object-cover select-none group-hover:scale-108 transition-transform duration-700 ease-out"
          />
        </motion.div>
      ))}

      {/* Modern subtle slide indicator if 2+ images */}
      {validImages.length > 1 && (
        <div className="absolute bottom-3.5 right-3.5 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 pointer-events-none shadow-sm">
          {validImages.map((_, dotIdx) => (
            <div
              key={dotIdx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                dotIdx === currentIndex
                  ? "w-4 bg-[#c5a666]"
                  : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MilestoneDotItem({
  progress,
  index,
  total,
}: {
  progress: ReturnType<typeof useSpring>;
  index: number;
  total: number;
}) {
  // Threshold: Dot reveals smoothly as the line reaches each milestone index
  const threshold = index === 0 ? 0.05 : (index + 0.25) / total;
  const dotScale = useTransform(progress, [threshold - 0.06, threshold], [0, 1], { clamp: true });
  const dotOpacity = useTransform(progress, [threshold - 0.06, threshold], [0, 1], { clamp: true });

  return (
    <div className="absolute left-4 sm:left-6 md:left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center pointer-events-none">
      <motion.div
        style={{ scale: dotScale, opacity: dotOpacity }}
        className="relative flex items-center justify-center"
      >
        {/* Soft Golden Outer Halo */}
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#c5a666]/30 flex items-center justify-center">
          {/* Gold Core Ring */}
          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#b8935a] border-2 border-white shadow-[0_0_12px_rgba(184,147,90,0.85)] flex items-center justify-center">
            {/* White Core Dot */}
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

interface Props {
  settings: Record<string, string>;
  milestones?: MilestoneItem[];
  overview?: Record<string, string>;
}

export default function CompanyOverviewContent({ settings, milestones, overview }: Props) {
  const locale = useLocale();
  const isJa = locale === "ja";
  const STATS = buildStats(settings, overview);
  // Use DB milestones if available, otherwise fallback to hardcoded defaults
  const MILESTONES = milestones && milestones.length > 0 ? milestones : DEFAULT_MILESTONES;

  const heroBgImage = overview?.heroImage || settings.aboutHeroImage || "";
  const heroBgImageMobile = overview?.heroImageMobile || settings.aboutHeroImageMobile || heroBgImage;
  const teamImage = overview?.teamImage || settings.aboutImageTeam || "";
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 70%", "end 75%"],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 25, restDelta: 0.001 });
  const travelingDotTop = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="min-h-screen bg-white selection:bg-[#111] selection:text-white">
      {/* ── Hero (Solution 4: Art Direction — Desktop Landscape & Mobile Portrait) ────────── */}
      <section className="relative w-full h-[calc(100vh-var(--header-h,76px))] min-h-[560px] sm:min-h-[600px] max-h-[1200px] bg-[#0c0b0a] overflow-hidden flex flex-col justify-end items-center pb-14 sm:pb-20 select-none">

        {/* ── 1. Under-Layer: 3D Technical Wireframe / Blueprint Mesh ── */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(197, 166, 102, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(197, 166, 102, 0.2) 1px, transparent 1px)`,
              backgroundSize: "36px 36px",
            }}
          />
          {heroBgImage && (
            <div className="hidden sm:block absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroBgImage}
                alt="3D Mesh"
                className="relative z-1 w-full h-full object-cover object-center opacity-20 filter grayscale invert contrast-200"
              />
            </div>
          )}
          {/* Subtle 3D Depth Vignette */}
          <div className="absolute inset-0 bg-radial from-transparent via-[#0c0b0a]/70 to-[#0c0b0a]" />

          {/* Technical HUD Overlay Indicators (Desktop) */}
          <motion.div
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.2, delay: 2.8 }}
            className="hidden sm:flex absolute inset-0 p-6 sm:p-10 flex-col justify-between pointer-events-none font-mono text-[10px] sm:text-xs text-[#c5a666]/70 uppercase tracking-widest z-10"
          >
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#c5a666] animate-ping" />
                [ 3D WIREFRAME MESH SCAN ]
              </span>
              <span>FOV: 45° | SAMPLES: 4096</span>
            </div>
            <div className="flex justify-between items-center">
              <span>RAYTRACING ACCELERATION: OPTIX</span>
              <span>RENDER: PHOTOREAL 100%</span>
            </div>
          </motion.div>
        </div>

        {/* ── 2. Top-Layer: Photorealistic Architectural Render with Auto-Panoramic Pan on Mobile ── */}
        {heroBgImage ? (
          <motion.div
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="absolute inset-0 z-1 overflow-hidden pointer-events-none flex items-center justify-start sm:justify-center"
          >
            {/* Cinematic Auto-Pan Panoramic Render */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
              src={heroBgImage}
              alt="i8 STUDIO About Us"
              className="h-full min-w-[190%] sm:min-w-full sm:w-full sm:h-full object-cover object-center sm:!transform-none"
              onError={(e) => {
                const t = e.currentTarget;
                t.style.display = "none";
              }}
            />

            {/* Gradient overlays for crisp readability */}
            <div className="absolute inset-0 z-2 bg-gradient-to-t from-black/95 via-black/45 to-black/35" />
            <div className="absolute inset-0 z-2 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none" />
          </motion.div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-[#111] via-[#161616] to-[#111]" />
        )}

        {/* ── Panoramic Scan Indicator Badge on Mobile ── */}
        <div className="sm:hidden absolute top-6 right-5 z-20 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#c5a666]/35 text-[9.5px] font-mono text-[#c5a666] tracking-wider uppercase flex items-center gap-1.5 shadow-md">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#c5a666] animate-pulse" />
          <span>⟷ PANORAMIC SCAN</span>
        </div>

        {/* ── 3. Glowing Golden Laser Scan Beam & Flare Sweep (Desktop) ── */}
        <motion.div
          initial={{ left: "-5%", opacity: 0 }}
          animate={{ left: "105%", opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="hidden sm:flex absolute inset-y-0 w-12 -translate-x-1/2 z-20 pointer-events-none items-center justify-center"
        >
          {/* Intense vertical laser beam core */}
          <div className="w-[2.5px] h-full bg-gradient-to-b from-transparent via-[#fff5d0] to-transparent shadow-[0_0_25px_8px_rgba(224,185,110,0.85)]" />
          {/* Trailing soft gold light wash */}
          <div className="absolute inset-y-0 -left-10 w-20 bg-gradient-to-r from-transparent via-[#c5a666]/30 to-transparent blur-md" />
        </motion.div>

        {/* ── 4. Floating Hero Typography ── */}
        <div className="relative z-30 max-w-4xl mx-auto px-5 sm:px-6 text-center pb-3 sm:pb-0 mb-2 sm:mb-0">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-xs sm:text-[16px] md:text-[17px] uppercase tracking-[0.28em] text-[#c5a666] mb-2 sm:mb-3 font-bold drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
          >
            {isJa ? "私たちについて" : "ABOUT US"}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-normal text-white leading-tight mb-3 sm:mb-4 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] md:whitespace-nowrap"
            style={{ fontFamily: "var(--font-noto-serif), var(--font-display), serif" }}
          >
            {isJa
              ? (settings.aboutHeroTitleJa || "建築の夢を、鮮明な現実へと視覚化する")
              : (settings.aboutHeroTitleEn || "Visualizing Architectural Dreams into Vivid Reality")}
          </motion.h1>

          {/* Description (Visible on both mobile & desktop) */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-white text-[13.5px] sm:text-base md:text-[17px] max-w-5xl mx-auto leading-relaxed font-normal drop-shadow-[0_2px_14px_rgba(0,0,0,1)] space-y-1.5 sm:space-y-1"
          >
            {(() => {
              const raw = isJa
                ? (settings.aboutHeroDescJa || "2019年にベトナム・ダナンで設立。\n日本の建築・不動産市場に特化した高品質CGパートナーとして、80名のクリエイターが在籍。")
                : (settings.aboutHeroDescEn || "Founded in 2019 in Da Nang, Vietnam.\nA high-quality CG partner specializing in the Japanese architecture and real estate market, with 80 creators.");

              const formatted = isJa
                ? raw.replace(/。\s*(?!$)/g, "。\n")
                : raw.replace(/\.\s+(?=[A-Z])/g, ".\n");

              return formatted.split("\n").filter(Boolean).map((line, idx) => (
                <span key={idx} className="block md:whitespace-nowrap">
                  {line}
                </span>
              ));
            })()}
          </motion.p>
        </div>

        {/* ── 5. Scroll Indicator ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="hidden sm:block absolute bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
        >
          <div className="w-5 h-8 rounded-full border border-white/30 flex justify-center pt-1.5 backdrop-blur-[1px]">
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-1 rounded-full bg-white/70"
            />
          </div>
        </motion.div>
      </section>

      {/* ── Stats (In-Place Count Up from 1 with Bounce Loop) ──────── */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <div
                key={i}
                className="text-center group"
              >
                <div className="text-4xl md:text-5xl font-bold text-[#111] mb-2 font-roboto tracking-tight tabular-nums">
                  <AnimatedCounter value={isJa ? stat.numJa : stat.numEn} delay={i * 0.12} />
                </div>
                <div className="text-[15px] sm:text-[16px] text-black font-bold uppercase tracking-wide transition-colors">
                  {isJa ? stat.labelJa : stat.labelEn}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Company Description / Our Story ─────── */}
      <section className="max-w-4xl mx-auto px-6 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-[1.5px] bg-[#b8935a]" />
            <p className="text-[17px] sm:text-[18px] uppercase tracking-[0.22em] text-[#b8935a] font-bold">
              {isJa ? "私たちのストーリー" : "OUR STORY"}
            </p>
          </div>
          <div className="blog-content text-black text-[17px] md:text-[19px] leading-[1.9] space-y-6 font-normal">
            {(() => {
              const customIntro = isJa ? overview?.introJa : overview?.introEn;
              if (customIntro && customIntro.trim().length > 0) {
                if (/<[a-z][\s\S]*>/i.test(customIntro)) {
                  return (
                    <div
                      className="space-y-4"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(customIntro) }}
                    />
                  );
                }
                return customIntro
                  .split(/\r?\n\r?\n|\r?\n/)
                  .map((p) => p.trim())
                  .filter(Boolean)
                  .map((p, idx) => (
                    <p
                      key={idx}
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(p) }}
                    />
                  ));
              }

              const settingDesc = isJa ? settings.aboutDescJa : settings.aboutDescEn;
              if (settingDesc && settingDesc.trim().length > 0) {
                return <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(settingDesc) }} />;
              }

              return (
                <>
                  <p>
                    {isJa
                      ? "i8 STUDIOは、2019年にベトナム・ダナンで設立された建築ビジュアライゼーション専門スタジオです。日本の建築・不動産・インテリアデザイン業界のお客様に、高品質な3DCGパース、アニメーション、VR、ARソリューションを提供しています。"
                      : "i8 STUDIO is an architectural visualization studio founded in 2019 in Da Nang, Vietnam. We provide high-quality 3DCG perspectives, animations, VR, and AR solutions to clients in the Japanese architecture, real estate, and interior design industries."}
                  </p>
                  <p>
                    {isJa
                      ? "私たちは「お客様のアイデアをサポートする」をミッションに、最新のテクノロジーと80名のプロフェッショナルクリエイターの力で、設計段階のビジョンを鮮明なビジュアルへと変換します。"
                      : "Our mission is to 'support your ideas.' With cutting-edge technology and 80 professional creators, we transform design-stage visions into vivid visuals."}
                  </p>
                </>
              );
            })()}
          </div>
        </motion.div>
      </section>

      {/* ── Timeline (Milestones matching Workflow full-bleed image & floating typography) ─────── */}
      <section className="w-full py-20 md:py-32 bg-[#fafaf8] section-noise overflow-hidden relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center mb-16 md:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[17px] sm:text-[18px] uppercase tracking-[0.22em] text-[#b8935a] font-bold mb-3">
              {isJa ? "歩みと沿革" : "OUR JOURNEY"}
            </p>
            <h2 className="text-2xl md:text-4xl font-light text-[#111]" style={{ fontFamily: "var(--font-noto-serif), serif" }}>
              {isJa ? "沿革・マイルストーン" : "History & Milestones"}
            </h2>
          </motion.div>
        </div>

        <div ref={timelineRef} className="relative w-full">
          {/* Scroll-Linked Dynamic Vertical Timeline Line in Center Channel */}
          <motion.div
            style={{ height: travelingDotTop }}
            className="hidden md:block absolute left-1/2 top-0 w-[2px] bg-gradient-to-b from-[#c5a666]/40 via-[#b8935a] to-[#b8935a] -translate-x-1/2 z-10 origin-top pointer-events-none"
          />

          <div className="space-y-24 md:space-y-36">
            {MILESTONES.map((ms, i) => {
              const isEven = i % 2 === 0;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className={`w-full flex flex-col ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  } gap-8 md:gap-0 items-center relative`}
                >
                  {/* 1. Image Container: Mobile aligns with text width (px-6 sm:px-10), Desktop is full-bleed */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98, x: isEven ? -30 : 30 }}
                    whileInView={{ opacity: 1, scale: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full md:w-[calc(50%-22px)] px-6 sm:px-10 md:px-0 shrink-0"
                  >
                    <div
                      className={`relative w-full h-[220px] sm:h-[280px] md:h-[450px] lg:h-[500px] overflow-hidden bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 shadow-md ${
                        isEven
                          ? "rounded-2xl md:rounded-r-3xl md:rounded-l-none"
                          : "rounded-2xl md:rounded-l-3xl md:rounded-r-none"
                      }`}
                    >
                      <MilestoneImageSlideshow
                        images={ms.images}
                        fallbackImage={ms.image}
                        title={isJa ? (ms.titleJa || ms.yearJa || ms.year || "") : (ms.titleEn || ms.yearEn || ms.year || "")}
                      />
                    </div>
                  </motion.div>

                  {/* 2. Center Timeline Dot (44px channel, line & dot fully unobstructed) */}
                  <div className="hidden md:flex w-11 shrink-0 items-center justify-center relative z-20">
                    <MilestoneDotItem
                      progress={smoothProgress}
                      index={i}
                      total={MILESTONES.length}
                    />
                  </div>

                  {/* 3. Floating Editorial Typography Block (Matching Workflow Image 2) */}
                  <div
                    className={`relative w-full md:w-[calc(50%-22px)] flex-1 min-w-0 px-6 sm:px-10 md:px-12 lg:px-16 ${
                      isEven
                        ? "md:pl-10 lg:pl-16 md:pr-10 lg:pr-20"
                        : "md:pr-10 lg:pr-16 md:pl-10 lg:pl-20"
                    }`}
                  >
                    {/* Big Gold Year Header */}
                    <span className="text-5xl sm:text-6xl md:text-7xl font-bold text-[#b8935a] block mb-2 font-roboto tracking-tight select-none">
                      {isJa ? (ms.yearJa || ms.year) : (ms.yearEn || ms.year)}
                    </span>

                    {/* Step Title */}
                    <h3
                      className="text-2xl md:text-3xl font-semibold mb-4 text-[#b8935a]"
                      style={{
                        fontFamily: isJa
                          ? "var(--font-noto-serif), serif"
                          : "var(--font-cormorant), var(--font-noto-serif), serif",
                      }}
                    >
                      {isJa ? ms.titleJa : ms.titleEn}
                    </h3>

                    {/* Bullet Points */}
                    {(() => {
                      const rawDesc = (isJa ? ms.descJa : ms.descEn) || "";
                      let items = rawDesc
                        .split(/\r?\n/)
                        .map((s) => s.trim())
                        .filter(Boolean);

                      if (items.length <= 1 && rawDesc.length > 40) {
                        if (isJa && rawDesc.includes("。")) {
                          items = rawDesc
                            .split(/(?<=。)/)
                            .map((s) => s.trim())
                            .filter(Boolean);
                        } else if (!isJa && rawDesc.includes(". ")) {
                          items = rawDesc
                            .split(/(?<=\.\s+)/)
                            .map((s) => s.trim())
                            .filter(Boolean);
                        }
                      }

                      if (items.length > 1) {
                        return (
                          <ul className="space-y-3 mt-3">
                            {items.map((item, idx) => {
                              const cleanItem = item.replace(/^[-•・*]\s*/, "");
                              return (
                                <li key={idx} className="flex items-start gap-3 text-[15px] sm:text-[16px] text-neutral-800 font-normal leading-relaxed">
                                  <span className="text-[#b8935a] font-bold text-base leading-[1.6] select-none shrink-0">•</span>
                                  <span className="flex-1">{cleanItem}</span>
                                </li>
                              );
                            })}
                          </ul>
                        );
                      }

                      return (
                        <p className="text-[15px] sm:text-[16px] text-neutral-800 font-normal leading-relaxed">
                          {rawDesc}
                        </p>
                      );
                    })()}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Team Section ───────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="text-[17px] sm:text-[18px] uppercase tracking-[0.22em] text-[#b8935a] font-bold mb-3">
            {isJa ? "チーム紹介" : "OUR TEAM"}
          </p>
          <h2 className="text-2xl md:text-4xl font-light text-[#111]" style={{ fontFamily: "var(--font-noto-serif), serif" }}>
            {isJa ? "情熱を持った80名のクリエイター" : "80 Passionate Creators"}
          </h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {teamImage ? (
            <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 shadow-md group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={teamImage}
                alt="i8 STUDIO Team"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                onError={(e) => {
                  const t = e.currentTarget;
                  t.style.display = "none";
                }}
              />
            </div>
          ) : null}
          <p className="text-center text-black text-[16px] sm:text-[18px] md:text-[19px] lg:text-[20px] mt-8 max-w-5xl mx-auto leading-[1.85] font-normal">
            {isJa ? (
              <>
                <span className="block">
                  3Dアーティスト、アニメーター、VR/ARエンジニア、プロジェクトマネージャーなど、多彩な専門家が在籍。
                </span>
                <span className="block">
                  日本語対応の専任ディレクターがスムーズなコミュニケーションをサポートします。
                </span>
              </>
            ) : (
              <>
                <span className="block">
                  Our diverse team includes 3D artists, animators, VR/AR engineers, and project managers.
                </span>
                <span className="block">
                  Dedicated Japanese-speaking directors ensure smooth communication.
                </span>
              </>
            )}
          </p>
        </motion.div>
      </section>

      {/* ── CTA Section with Magnetic Floating Motion ────────────────────────── */}
      <section className="bg-white border-t border-gray-100 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 25 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-2xl md:text-4xl font-light text-[#111] mb-8" style={{ fontFamily: "var(--font-noto-serif), serif" }}>
              {isJa ? "プロジェクトのご相談はこちら" : "Discuss Your Project"}
            </h2>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 px-10 py-4 bg-[#111] text-white text-sm font-semibold rounded-full hover:bg-[#333] hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-md group"
            >
              <span>{isJa ? "お問い合わせ" : "Contact Us"}</span>
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
