"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { motion, useInView } from "framer-motion";
import { sanitizeHtml } from "@/lib/sanitize";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

/* ------------------------------------------------------------------ */
/*  Animated Counter with Jump-Up-Drop-Down Bounce Animation          */
/* ------------------------------------------------------------------ */
function AnimatedCounter({ value, delay = 0 }: { value: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });
  const [count, setCount] = useState(1);
  const [isCounting, setIsCounting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Extract number and suffix, e.g. "2,000+" -> targetNum = 2000, suffix = "+"
  const rawNumStr = value.replace(/[^0-9]/g, "");
  const targetNum = parseInt(rawNumStr, 10) || 0;
  const suffix = value.replace(/[0-9,\s]/g, ""); // e.g. "+"

  useEffect(() => {
    if (!isInView || targetNum <= 1) {
      if (targetNum <= 1) {
        setCount(targetNum);
        setIsFinished(true);
      }
      return;
    }

    let start = 1;
    const duration = 2000; // 2.0s duration
    let animationFrameId: number;

    const timeoutId = setTimeout(() => {
      setIsCounting(true);
      const startTime = performance.now();

      const updateCounter = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (targetNum - start) * easeProgress);

        setCount(current);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(updateCounter);
        } else {
          setCount(targetNum);
          setIsCounting(false);
          setIsFinished(true);
        }
      };

      animationFrameId = requestAnimationFrame(updateCounter);
    }, delay * 1000);

    return () => {
      clearTimeout(timeoutId);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isInView, targetNum, delay]);

  return (
    <motion.div
      ref={ref}
      animate={
        isCounting
          ? { y: [0, -10, 0] }
          : isFinished
            ? { y: [0, -4, 0], scale: [1, 1.15, 0.98, 1.0] }
            : { y: 0 }
      }
      transition={
        isCounting
          ? { repeat: Infinity, duration: 0.24, ease: "easeInOut" }
          : { duration: 0.45, ease: "easeOut" }
      }
      className="inline-flex items-center justify-center font-roboto tracking-tight text-[#111]"
    >
      <span className="tabular-nums inline-block">
        {count.toLocaleString()}
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

const DEFAULT_MILESTONES = [
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

interface MilestoneItem {
  year?: string;
  yearJa?: string;
  yearEn?: string;
  titleJa: string;
  titleEn: string;
  descJa: string;
  descEn: string;
  image?: string;
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

  const heroBgImage = settings.aboutHeroImage || "";
  const teamImage = settings.aboutImageTeam || "";

  return (
    <div className="min-h-screen bg-white selection:bg-[#111] selection:text-white">
      {/* ── Hero (full-viewport with dynamic Hero Image background & entrance motion) ────────── */}
      <section className="relative h-[calc(100vh-var(--header-h,76px))] min-h-[600px] max-h-[1200px] bg-[#111] overflow-hidden flex items-center justify-center">
        {/* Background Hero Image if uploaded with subtle cinematic motion */}
        {heroBgImage ? (
          <div className="absolute inset-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
              src={heroBgImage}
              alt="i8 STUDIO About Us"
              className="w-full h-full object-cover"
              onError={(e) => {
                const t = e.currentTarget;
                t.style.display = "none";
              }}
            />
            {/* Light clean overlay without blur */}
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-[#111] via-[#161616] to-[#111]" />
        )}

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-[11px] uppercase tracking-[0.35em] text-white/70 mb-6 font-semibold"
          >
            {isJa ? "私たちについて" : "ABOUT US"}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl md:text-5xl lg:text-6xl font-light text-white leading-[1.25] mb-6 drop-shadow-sm"
            style={{ fontFamily: "var(--font-noto-serif), var(--font-display), serif" }}
          >
            {isJa
              ? (settings.aboutHeroTitleJa || "建築の夢を、鮮明な現実へと視覚化する")
              : (settings.aboutHeroTitleEn || "Visualizing Architectural Dreams into Vivid Reality")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-white/80 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-light"
          >
            {isJa
              ? (settings.aboutHeroDescJa || "2019年にベトナム・ダナンで設立。日本の建築・不動産市場に特化した高品質CGパートナーとして、80名のクリエイターが在籍。")
              : (settings.aboutHeroDescEn || "Founded in 2019 in Da Nang, Vietnam. A high-quality CG partner specializing in the Japanese architecture and real estate market, with 80 creators.")}
          </motion.p>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 cursor-pointer"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/40 flex justify-center pt-2 backdrop-blur-[2px]">
            <motion.div
              animate={{ y: [0, 8, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-white"
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
                <div className="text-sm text-gray-400 font-medium uppercase tracking-wide transition-colors group-hover:text-gray-600">
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
            <span className="w-8 h-px bg-[#b8935a]" />
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#b8935a] font-semibold">
              {isJa ? "私たちのストーリー" : "OUR STORY"}
            </p>
          </div>
          <div className="blog-content text-gray-700 text-base md:text-lg leading-[1.9] space-y-6">
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

      {/* ── Timeline (Milestones with Staggered Scroll Motion) ─────── */}
      <section className="bg-[#fafaf8] section-noise overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#b8935a] font-semibold mb-3">
              {isJa ? "歩みと沿革" : "OUR JOURNEY"}
            </p>
            <h2 className="text-2xl md:text-4xl font-light text-[#111]" style={{ fontFamily: "var(--font-noto-serif), serif" }}>
              {isJa ? "沿革・マイルストーン" : "History & Milestones"}
            </h2>
          </motion.div>

          <div className="relative">
            {/* Vertical line with gradient glow */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent -translate-x-1/2" />

            <div className="space-y-16">
              {MILESTONES.map((ms, i) => {
                const isEven = i % 2 === 0;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className={`relative flex flex-col md:flex-row items-stretch gap-6 md:gap-0 ${!isEven ? "md:flex-row-reverse" : ""}`}
                  >
                    {/* Pulsing Central Dot (Centered exactly on vertical line) */}
                    <div className="absolute left-6 md:left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center pointer-events-none">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                        className="w-4 h-4 rounded-full bg-[#111] border-2 border-white shadow-md ring-4 ring-[#b8935a]/20"
                      />
                    </div>

                    {/* Content (Text Card) with Left/Right Entrance Motion */}
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                      className={`w-full ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${isEven ? "md:pr-4" : "md:pl-4"} flex flex-col`}
                    >
                      <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100/80 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-500 h-full flex flex-col justify-center group">
                        <span className="text-[12px] uppercase tracking-[0.15em] text-[#b8935a] font-bold font-roboto">
                          {isJa ? (ms.yearJa || ms.year) : (ms.yearEn || ms.year)}
                        </span>
                        <h3 className="text-lg md:text-xl font-medium text-[#111] mt-2 mb-3 group-hover:text-[#b8935a] transition-colors">
                          {isJa ? ms.titleJa : ms.titleEn}
                        </h3>
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
                              <ul className="space-y-2.5 mt-1">
                                {items.map((item, idx) => {
                                  const cleanItem = item.replace(/^[-•・*]\s*/, "");
                                  return (
                                    <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-600 leading-relaxed">
                                      <span className="text-[#b8935a] font-bold text-sm leading-[1.6] select-none shrink-0">•</span>
                                      <span>{cleanItem}</span>
                                    </li>
                                  );
                                })}
                              </ul>
                            );
                          }

                          return (
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {rawDesc}
                            </p>
                          );
                        })()}
                      </div>
                    </motion.div>

                    {/* Spacer for center dot alignment */}
                    <div className="hidden md:block w-16 shrink-0" />

                    {/* Opposite Side (Image Frame with Zoom Hover) */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, x: isEven ? 30 : -30 }}
                      whileInView={{ opacity: 1, scale: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                      className={`w-full ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${isEven ? "md:pl-4" : "md:pr-4"} flex flex-col`}
                    >
                      <div className="w-full h-full min-h-[200px] md:min-h-[240px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 border border-gray-100 shadow-sm relative group cursor-pointer">
                        {ms.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={ms.image}
                            alt={isJa ? ms.titleJa : ms.titleEn}
                            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                            onError={(e) => {
                              const t = e.currentTarget;
                              t.style.display = "none";
                              const p = t.parentElement;
                              if (p) {
                                p.classList.add("flex", "items-center", "justify-center");
                                const s = document.createElement("span");
                                s.className = "text-gray-400 text-sm font-medium";
                                s.textContent = isJa ? (ms.yearJa || ms.year || "") : (ms.yearEn || ms.year || "");
                                p.appendChild(s);
                              }
                            }}
                          />
                        ) : (
                          <div className="w-full h-full min-h-[200px] flex items-center justify-center bg-gradient-to-br from-[#f5f5f3] via-[#eeeeeb] to-[#f5f5f3]">
                            <span className="text-gray-400 text-sm font-medium">
                              {isJa ? (ms.yearJa || ms.year || "i8 STUDIO") : (ms.yearEn || ms.year || "i8 STUDIO")}
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
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
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#b8935a] font-semibold mb-3">
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
          <p className="text-center text-gray-600 text-lg md:text-[22px] mt-8 max-w-4xl mx-auto leading-[1.85] font-normal">
            {isJa
              ? "3Dアーティスト、アニメーター、VR/ARエンジニア、プロジェクトマネージャーなど、多彩な専門家が在籍。日本語対応の専任ディレクターがスムーズなコミュニケーションをサポートします。"
              : "Our diverse team includes 3D artists, animators, VR/AR engineers, and project managers. Dedicated Japanese-speaking directors ensure smooth communication."}
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
