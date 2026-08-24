"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { sanitizeHtml } from "@/lib/sanitize";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

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

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero (full-viewport) ──────────────────────────── */}
      <section className="relative h-[calc(100vh-var(--header-h,76px))] min-h-[600px] max-h-[1200px] bg-[#111] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#111] via-[#1a1a2e] to-[#111]" />
        {/* Placeholder hero bg — replace with real image */}
        <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] uppercase tracking-[0.3em] text-white/40 mb-6">
            {isJa ? "私たちについて" : "ABOUT US"}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-6xl font-light text-white leading-tight mb-6"
            style={{ fontFamily: "var(--font-noto-serif), var(--font-display), serif" }}
          >
            {isJa
              ? (settings.aboutHeroTitleJa || "建築の夢を、鮮明な現実へと視覚化する")
              : (settings.aboutHeroTitleEn || "Visualizing Architectural Dreams into Vivid Reality")}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-white/50 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {isJa
              ? (settings.aboutHeroDescJa || "2019年にベトナム・ダナンで設立。日本の建築・不動産市場に特化した高品質CGパートナーとして、80名のクリエイターが在籍。")
              : (settings.aboutHeroDescEn || "Founded in 2019 in Da Nang, Vietnam. A high-quality CG partner specializing in the Japanese architecture and real estate market, with 80 creators.")}
          </motion.p>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-white/60"
            />
          </div>
        </motion.div>
      </section>

      {/* ── Stats ──────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-[#111] mb-2 font-roboto tracking-tight">
                  {isJa ? stat.numJa : stat.numEn}
                </div>
                <div className="text-sm text-gray-400 font-medium uppercase tracking-wide">
                  {isJa ? stat.labelJa : stat.labelEn}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Company Description ─────── */}
      <section className="max-w-4xl mx-auto px-6 py-20 md:py-28">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <p className="text-[11px] uppercase tracking-[0.25em] text-gray-400 mb-6">
            {isJa ? "私たちのストーリー" : "OUR STORY"}
          </p>
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

      {/* ── Timeline ───────────────────── */}
      <section className="bg-[#fafaf8] section-noise">
        <div className="max-w-5xl mx-auto px-6 py-20 md:py-28">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <p className="text-[11px] uppercase tracking-[0.25em] text-gray-400 mb-3">
              {isJa ? "歩みと沿革" : "OUR JOURNEY"}
            </p>
            <h2 className="text-2xl md:text-3xl font-light text-[#111]" style={{ fontFamily: "var(--font-noto-serif), serif" }}>
              {isJa ? "沿革・マイルストーン" : "History & Milestones"}
            </h2>
          </motion.div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-1/2" />

            <div className="space-y-16">
              {MILESTONES.map((ms, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative flex flex-col md:flex-row items-stretch gap-6 md:gap-0 ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}
                >
                  {/* Dot */}
                  <div className="absolute left-6 md:left-1/2 w-3.5 h-3.5 rounded-full bg-[#111] border-2 border-white -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 shadow-sm" />

                  {/* Content (Text Card) */}
                  <div className={`w-full ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? "md:pr-4" : "md:pl-4"} flex flex-col`}>
                    <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col justify-center">
                      <span className="text-[12px] uppercase tracking-[0.15em] text-[#b8935a] font-bold font-roboto">{isJa ? (ms.yearJa || ms.year) : (ms.yearEn || ms.year)}</span>
                      <h3 className="text-lg md:text-xl font-medium text-[#111] mt-2 mb-3">
                        {isJa ? ms.titleJa : ms.titleEn}
                      </h3>
                      {(() => {
                        const rawDesc = (isJa ? ms.descJa : ms.descEn) || "";
                        // Split by newlines first
                        let items = rawDesc
                          .split(/\r?\n/)
                          .map((s) => s.trim())
                          .filter(Boolean);

                        // If it's a single block without newlines, split by sentence endings for Japanese (。) or English (. )
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
                  </div>

                  {/* Spacer for center dot alignment */}
                  <div className="hidden md:block w-16 shrink-0" />

                  {/* Opposite Side (Image Frame) */}
                  <div className={`w-full ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? "md:pl-4" : "md:pr-4"} flex flex-col`}>
                    <div className="w-full h-full min-h-[200px] md:min-h-[240px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 border border-gray-100 shadow-sm relative group">
                      {ms.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={ms.image}
                          alt={isJa ? ms.titleJa : ms.titleEn}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
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
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Team Section ───────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
          <p className="text-[11px] uppercase tracking-[0.25em] text-gray-400 mb-3">
            {isJa ? "チーム紹介" : "OUR TEAM"}
          </p>
          <h2 className="text-2xl md:text-3xl font-light text-[#111]" style={{ fontFamily: "var(--font-noto-serif), serif" }}>
            {isJa ? "情熱を持った80名のクリエイター" : "80 Passionate Creators"}
          </h2>
        </motion.div>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={settings.aboutImageTeam || settings.aboutHeroImage || "/uploads/about-team.jpg"}
              alt="i8 STUDIO Team"
              className="w-full h-full object-cover"
              onError={(e) => {
                const t = e.currentTarget;
                t.style.display = "none";
                const p = t.parentElement;
                if (p) {
                  p.classList.add("flex", "items-center", "justify-center");
                  const s = document.createElement("span");
                  s.className = "text-gray-400 text-sm font-medium";
                  s.textContent = isJa ? "チーム写真" : "Team Photo";
                  p.appendChild(s);
                }
              }}
            />
          </div>
          <p className="text-center text-gray-600 text-lg md:text-[22px] mt-8 max-w-4xl mx-auto leading-[1.85] font-normal">
            {isJa
              ? "3Dアーティスト、アニメーター、VR/ARエンジニア、プロジェクトマネージャーなど、多彩な専門家が在籍。日本語対応の専任ディレクターがスムーズなコミュニケーションをサポートします。"
              : "Our diverse team includes 3D artists, animators, VR/AR engineers, and project managers. Dedicated Japanese-speaking directors ensure smooth communication."}
          </p>
        </motion.div>
      </section>

      {/* ── CTA ────────────────────────── */}
      <section className="bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-2xl md:text-3xl font-light text-[#111] mb-8" style={{ fontFamily: "var(--font-noto-serif), serif" }}>
              {isJa ? "プロジェクトのご相談はこちら" : "Discuss Your Project"}
            </h2>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 px-10 py-4 bg-[#111] text-white text-sm font-semibold rounded-full hover:bg-[#333] transition-colors shadow-sm"
            >
              {isJa ? "お問い合わせ" : "Contact Us"} →
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
