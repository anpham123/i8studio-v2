"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useLocale } from "next-intl";
import Image from "next/image";

interface ShowcaseItem {
  id: string;
  titleJa: string;
  titleEn: string;
  subJa: string;
  subEn: string;
  tagJa: string;
  tagEn: string;
  image: string;
  spanCols: string;
  aspect: string;
  featured?: boolean;
}

const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: "1",
    titleJa: "ザ・ペントハウス レジデンス",
    titleEn: "The Penthouse Sanctuary",
    subJa: "都心のパノラマを望むラグジュアリーレジデンスの3DCGパース制作",
    subEn: "Hyper-realistic CGI visualizing high-end metropolitan living.",
    tagJa: "ラグジュアリー住宅 · 内観CG",
    tagEn: "Luxury Residence · Interior CGI",
    image: "/uploads/anhherrosection/anh1.png",
    spanCols: "col-span-12 lg:col-span-8",
    aspect: "aspect-[16/10]",
    featured: true,
  },
  {
    id: "2",
    titleJa: "プライベートヴィラ & プール",
    titleEn: "Azure Coastal Villa",
    subJa: "自然光と水面の反射を極めたリゾート建築ビジュアライゼーション",
    subEn: "Dynamic sunlight and water caustics simulation.",
    tagJa: "リゾート建築 · 外観CG",
    tagEn: "Resort Villa · Exterior CGI",
    image: "/uploads/anhherrosection/anh2.png",
    spanCols: "col-span-12 sm:col-span-6 lg:col-span-4",
    aspect: "aspect-[4/3] lg:aspect-[16/10]",
  },
  {
    id: "3",
    titleJa: "ミニマリズム ダイニングサロン",
    titleEn: "Minimalist Dining Suite",
    subJa: "木目と大理石の質感を極限まで追求したフォトリアルCG",
    subEn: "Exquisite materiality blending natural walnut and marble.",
    tagJa: "マテリアル設計 · 内観CG",
    tagEn: "Materiality · Interior CG",
    image: "/uploads/anhherrosection/anh3.png",
    spanCols: "col-span-12 sm:col-span-6 lg:col-span-4",
    aspect: "aspect-[4/3]",
  },
  {
    id: "4",
    titleJa: "マスターベッドルーム & テラス",
    titleEn: "Master Suite & Terrace",
    subJa: "間接照明と視線の抜けを考慮した空間演出アニメーション",
    subEn: "Atmospheric ambient lighting and seamless indoor-outdoor sightlines.",
    tagJa: "ライティング設計 · CGパース",
    tagEn: "Lighting Design · Render",
    image: "/uploads/anhherrosection/anh4.png",
    spanCols: "col-span-12 sm:col-span-6 lg:col-span-4",
    aspect: "aspect-[4/3]",
  },
  {
    id: "5",
    titleJa: "モダンオフィス & コラボスペース",
    titleEn: "Contemporary Innovation Hub",
    subJa: "先進的な働き方を提案するオフィス空間のVRウォークスルー",
    subEn: "Interactive digital twin for next-gen workspace design.",
    tagJa: "商業施設 · VR空間",
    tagEn: "Commercial · VR Space",
    image: "/uploads/anhherrosection/anh5.png",
    spanCols: "col-span-12 sm:col-span-6 lg:col-span-4",
    aspect: "aspect-[4/3]",
  },
  {
    id: "6",
    titleJa: "スカイラウンジ & バーカウンター",
    titleEn: "Sky Lounge & Cocktail Bar",
    subJa: "夜景のライティングと高級マテリアルが織りなす空間美",
    subEn: "Evening illumination and luxury hospitality atmosphere.",
    tagJa: "ホテル・商業 · CGパース",
    tagEn: "Hospitality · Night View",
    image: "/uploads/anhherrosection/anh7.png",
    spanCols: "col-span-12 lg:col-span-6",
    aspect: "aspect-[16/10]",
  },
  {
    id: "7",
    titleJa: "禅モダン スパ & バスルーム",
    titleEn: "Zen Spa & Wellness Pavilion",
    subJa: "静寂と癒やしをテーマにしたウェルネス建築のパース制作",
    subEn: "Tranquil architectural visualization emphasizing peace & mindfulness.",
    tagJa: "ウェルネス · 内観CG",
    tagEn: "Wellness & Spa · Interior",
    image: "/uploads/anhherrosection/anh10.png",
    spanCols: "col-span-12 lg:col-span-6",
    aspect: "aspect-[16/10]",
  },
  {
    id: "8",
    titleJa: "シネマティック 3D ウォークスルー",
    titleEn: "Cinematic 3D Walkthrough Showcase",
    subJa: "まるで映画のように空間を旅する最高峰の建築アニメーション",
    subEn: "Full 4K architectural flythrough animation trusted by leading firms.",
    tagJa: "建築アニメーション · 4K",
    tagEn: "Architecture Film · 4K",
    image: "/uploads/anhherrosection/anh12.png",
    spanCols: "col-span-12",
    aspect: "aspect-[21/9] sm:aspect-[16/7]",
    featured: true,
  },
];

export default function HylioxBentoShowcase() {
  const locale = useLocale();
  const isJa = locale === "ja";
  const [activeImageModal, setActiveImageModal] = useState<string | null>(null);

  return (
    <section className="relative bg-[#0A0A0A] text-[#FAFAFA] py-20 sm:py-28 lg:py-36 border-t border-white/[0.06] overflow-hidden">
      {/* Infinite Marquee Strip */}
      <div className="relative py-4 bg-[#0A0A0A] border-b border-white/[0.06] overflow-hidden select-none mb-16 sm:mb-20">
        <div className="flex w-max animate-marquee gap-8 items-center text-xs font-mono uppercase tracking-[0.35em] text-[#FAFAFA]/60">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-8">
              <span>ARCHITECTURAL VISUALIZATION</span>
              <span className="text-[#c5a666]">✦</span>
              <span>4K CINEMATIC ANIMATION</span>
              <span className="text-[#c5a666]">✦</span>
              <span>VR & DIGITAL TWIN</span>
              <span className="text-[#c5a666]">✦</span>
              <span>BUILT WITH PRECISION · NOT AI GENERATED</span>
              <span className="text-[#c5a666]">✦</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-[#c5a666] text-[11px] font-mono tracking-[0.35em] uppercase mb-4">
              <span>01 · SHOWCASE BENTO</span>
            </div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-light text-[#FAFAFA] leading-tight"
              style={{ fontFamily: "var(--font-noto-serif), var(--font-display), serif" }}
            >
              {isJa ? (
                <>
                  厳選された <span className="italic text-[#c5a666]">8つの空間作品</span>
                </>
              ) : (
                <>
                  8 Featured <span className="italic text-[#c5a666]">Architectural Spaces</span>
                </>
              )}
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#FAFAFA]/65 max-w-md font-light leading-relaxed">
            {isJa
              ? "日本の建築基準と審美眼に最適化されたハイクオリティ3DCGパースとアニメーション。"
              : "Bespoke high-end CGI renderings, exterior masterplans, and immersive spatial animations."}
          </p>
        </div>

        {/* 12-Column Asymmetric Bento Grid */}
        <div className="grid grid-cols-12 gap-6">
          {SHOWCASE_ITEMS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
              className={`group relative rounded-[16px] overflow-hidden bg-white/[0.03] border ${
                item.featured
                  ? "border-[#c5a666]/40 shadow-[0_0_35px_rgba(197,166,102,0.12)]"
                  : "border-white/[0.06] hover:border-white/[0.18]"
              } backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col ${
                item.spanCols
              }`}
            >
              {/* Card Image Thumbnail */}
              <div
                className={`relative w-full overflow-hidden ${item.aspect} bg-[#111] cursor-pointer`}
                onClick={() => setActiveImageModal(item.image)}
              >
                <Image
                  src={item.image}
                  alt={isJa ? item.titleJa : item.titleEn}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  priority={index < 2}
                />
                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />

                {/* Featured Badge */}
                {item.featured && (
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#c5a666] text-[#0A0A0A] text-[10px] font-mono font-bold tracking-widest uppercase shadow-lg">
                    {isJa ? "FEATURED" : "FEATURED"}
                  </div>
                )}

                {/* Quick zoom icon on hover */}
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-6 sm:p-7 flex flex-col justify-between flex-grow">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#c5a666] mb-2 block font-medium">
                    {isJa ? item.tagJa : item.tagEn}
                  </span>
                  <h3
                    className="text-xl sm:text-2xl font-light text-[#FAFAFA] mb-2.5 group-hover:text-[#c5a666] transition-colors duration-200"
                    style={{ fontFamily: "var(--font-noto-serif), serif" }}
                  >
                    {isJa ? item.titleJa : item.titleEn}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#FAFAFA]/65 font-light leading-relaxed">
                    {isJa ? item.subJa : item.subEn}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/[0.04] flex items-center justify-between">
                  <Link
                    href={`/${locale}/contact`}
                    className="text-xs font-mono uppercase tracking-wider text-[#FAFAFA]/70 hover:text-[#c5a666] transition-colors flex items-center gap-1.5"
                  >
                    <span>{isJa ? "制作について相談する" : "Inquire Project"}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                  <span className="text-[10px] font-mono text-white/30">0{index + 1} / 08</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal Preview */}
      <AnimatePresence>
        {activeImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImageModal(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
          >
            <div className="relative max-w-6xl w-full max-h-[90vh] aspect-[16/10] rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
              <Image
                src={activeImageModal}
                alt="Enlarged Preview"
                fill
                className="object-contain"
              />
              <button
                onClick={() => setActiveImageModal(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/70 text-white flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
