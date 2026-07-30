"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

const STATS = [
  { numJa: "80+", numEn: "80+", labelJa: "プロフェッショナルスタッフ", labelEn: "Professional Staff" },
  { numJa: "5+", numEn: "5+", labelJa: "年の経験", labelEn: "Years of Experience" },
  { numJa: "150+", numEn: "150+", labelJa: "グローバルクライアント", labelEn: "Global Clients" },
  { numJa: "2,000+", numEn: "2,000+", labelJa: "完了プロジェクト", labelEn: "Completed Projects" },
];

const MILESTONES = [
  {
    year: "2019",
    titleJa: "i8 STUDIO 設立",
    titleEn: "i8 STUDIO Founded",
    descJa: "ベトナム・ダナンにて設立。日本市場向けの高品質3DCG制作を開始。",
    descEn: "Founded in Da Nang, Vietnam. Started high-quality 3DCG production for the Japanese market.",
  },
  {
    year: "2020-2021",
    titleJa: "日本市場拡大",
    titleEn: "Japan Market Expansion",
    descJa: "日本の大手建築・不動産企業との取引を拡大。チームを30名に拡充。",
    descEn: "Expanded partnerships with major Japanese architecture and real estate firms. Team grew to 30 members.",
  },
  {
    year: "2022-2023",
    titleJa: "技術革新",
    titleEn: "Technological Innovation",
    descJa: "VR/AR技術を導入。リアルタイムレンダリングとバーチャルステージングサービスを開始。",
    descEn: "Introduced VR/AR technologies. Launched real-time rendering and virtual staging services.",
  },
  {
    year: "2024〜",
    titleJa: "グローバルパートナーシップ",
    titleEn: "Global Partnership",
    descJa: "80名体制に拡大。AI技術の活用でさらなる品質向上と効率化を実現。グローバル展開を加速。",
    descEn: "Expanded to 80 members. Leveraging AI for enhanced quality and efficiency. Accelerating global expansion.",
  },
];

export default function CompanyOverviewContent({ settings }: { settings: Record<string, string> }) {
  const locale = useLocale();
  const isJa = locale === "ja";

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ───────────────────────── */}
      <section className="relative bg-[#111] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#111] via-[#1a1a2e] to-[#111]" />
        {/* Placeholder hero bg — replace with real image */}
        <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="relative max-w-5xl mx-auto px-6 py-28 md:py-40 text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] uppercase tracking-[0.3em] text-white/40 mb-6">
            ABOUT US
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-6xl font-light text-white leading-tight mb-6"
            style={{ fontFamily: "var(--font-noto-serif), var(--font-display), serif" }}
          >
            {isJa ? "建築の夢を、鮮明な現実へと視覚化する" : "Visualizing Architectural Dreams into Vivid Reality"}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-white/50 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {isJa
              ? "2019年にベトナム・ダナンで設立。日本の建築・不動産市場に特化した高品質CGパートナーとして、80名のクリエイターが在籍。"
              : "Founded in 2019 in Da Nang, Vietnam. A high-quality CG partner specializing in the Japanese architecture and real estate market, with 80 creators."}
          </motion.p>
        </div>
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
                <div className="text-4xl md:text-5xl font-extralight text-[#111] mb-2" style={{ fontFamily: "var(--font-display), serif" }}>
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
          <p className="text-[11px] uppercase tracking-[0.25em] text-gray-400 mb-6">OUR STORY</p>
          <div className="text-gray-600 text-base md:text-lg leading-[1.9] space-y-6">
            <p>
              {isJa
                ? (settings.aboutDescJa || "i8 STUDIOは、2019年にベトナム・ダナンで設立された建築ビジュアライゼーション専門スタジオです。日本の建築・不動産・インテリアデザイン業界のお客様に、高品質な3DCGパース、アニメーション、VR、ARソリューションを提供しています。")
                : (settings.aboutDescEn || "i8 STUDIO is an architectural visualization studio founded in 2019 in Da Nang, Vietnam. We provide high-quality 3DCG perspectives, animations, VR, and AR solutions to clients in the Japanese architecture, real estate, and interior design industries.")}
            </p>
            <p>
              {isJa
                ? "私たちは「お客様のアイデアをサポートする」をミッションに、最新のテクノロジーと80名のプロフェッショナルクリエイターの力で、設計段階のビジョンを鮮明なビジュアルへと変換します。"
                : "Our mission is to 'support your ideas.' With cutting-edge technology and 80 professional creators, we transform design-stage visions into vivid visuals."}
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── Timeline ───────────────────── */}
      <section className="bg-[#fafaf8] section-noise">
        <div className="max-w-4xl mx-auto px-6 py-20 md:py-28">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <p className="text-[11px] uppercase tracking-[0.25em] text-gray-400 mb-3">OUR JOURNEY</p>
            <h2 className="text-2xl md:text-3xl font-light text-[#111]" style={{ fontFamily: "var(--font-noto-serif), serif" }}>
              {isJa ? "沿革・マイルストーン" : "History & Milestones"}
            </h2>
          </motion.div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-1/2" />

            <div className="space-y-12">
              {MILESTONES.map((ms, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative flex flex-col md:flex-row items-start gap-6 ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}
                >
                  {/* Dot */}
                  <div className="absolute left-6 md:left-1/2 w-3 h-3 rounded-full bg-[#111] border-2 border-white -translate-x-1/2 mt-2 z-10" />

                  {/* Content */}
                  <div className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8"}`}>
                    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                      <span className="text-[11px] uppercase tracking-[0.2em] text-[#b8935a] font-semibold">{ms.year}</span>
                      <h3 className="text-lg font-medium text-[#111] mt-2 mb-2">
                        {isJa ? ms.titleJa : ms.titleEn}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {isJa ? ms.descJa : ms.descEn}
                      </p>
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
          <p className="text-[11px] uppercase tracking-[0.25em] text-gray-400 mb-3">OUR TEAM</p>
          <h2 className="text-2xl md:text-3xl font-light text-[#111]" style={{ fontFamily: "var(--font-noto-serif), serif" }}>
            {isJa ? "情熱を持った80名のクリエイター" : "80 Passionate Creators"}
          </h2>
        </motion.div>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/uploads/about-team.jpg"
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
          <p className="text-center text-gray-500 text-base mt-8 max-w-2xl mx-auto leading-relaxed">
            {isJa
              ? "3Dアーティスト、アニメーター、VR/ARエンジニア、プロジェクトマネージャーなど、多彩な専門家が在籍。日本語対応の専任ディレクターがスムーズなコミュニケーションをサポートします。"
              : "Our diverse team includes 3D artists, animators, VR/AR engineers, and project managers. Dedicated Japanese-speaking directors ensure smooth communication."}
          </p>
        </motion.div>
      </section>

      {/* ── CTA ────────────────────────── */}
      <section className="bg-[#111]">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-2xl md:text-3xl font-light text-white mb-8" style={{ fontFamily: "var(--font-noto-serif), serif" }}>
              {isJa ? "プロジェクトのご相談はこちら" : "Discuss Your Project"}
            </h2>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 px-10 py-4 bg-white text-[#111] text-sm font-semibold rounded-full hover:bg-white/90 transition-colors"
            >
              {isJa ? "お問い合わせ" : "Contact Us"} →
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
