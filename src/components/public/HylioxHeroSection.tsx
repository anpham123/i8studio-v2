"use client";

import { useRef, useState, useEffect } from "react";
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
  spanCols: string; // Tailwind col span classes
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

export default function HylioxHeroSection() {
  const locale = useLocale();
  const isJa = locale === "ja";
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [activeImageModal, setActiveImageModal] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 3) {
      setIsVideoLoaded(true);
    }
  }, []);

  const scrollToBento = () => {
    const el = document.getElementById("templates-showcase");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative bg-[#0A0A0A] text-[#FAFAFA] selection:bg-[#D4FF4F] selection:text-[#0A0A0A] overflow-hidden">
      {/* ── 1. HERO SECTION (100svh Full-bleed with Video Background) ── */}
      <section className="relative w-full h-[100svh] min-h-[640px] flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            ref={videoRef}
            src="/uploads/anhherrosection/1.mp4"
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={() => setIsVideoLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-1000 ${
              isVideoLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
          {/* 50% Obsidian / Black Overlay */}
          <div className="absolute inset-0 bg-[#0A0A0A]/50 backdrop-blur-[0.5px]" />
          {/* Radial Edge Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/70" />
          <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_30%,rgba(10,10,10,0.85)_100%]" />
        </div>

        {/* Subtle Dust / Ambient Grid Layer */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none opacity-25"
          style={{
            backgroundImage: `radial-gradient(rgba(212, 255, 79, 0.12) 1px, transparent 1px)`,
            backgroundSize: "36px 36px",
          }}
        />

        {/* Hero Content */}
        <div className="relative z-10 max-w-[1280px] w-full mx-auto px-6 text-center flex flex-col items-center">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl mb-6 shadow-xl"
          >
            <span className="w-2 h-2 rounded-full bg-[#D4FF4F] animate-pulse" />
            <span
              className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.4em] uppercase text-[#D4FF4F]"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              {isJa ? "SHOWCASE · 2026" : "TEMPLATES & SHOWCASE · 2026"}
            </span>
          </motion.div>

          {/* Headline Mixing Sans + Italic Serif */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-[34px] sm:text-[52px] md:text-[68px] lg:text-[76px] font-normal leading-[1.08] tracking-tight max-w-5xl mb-6 text-[#FAFAFA]"
            style={{ fontFamily: "var(--font-noto-serif), var(--font-display), serif" }}
          >
            {isJa ? (
              <>
                空間の美学を、
                <br />
                <span className="italic font-light text-[#D4FF4F]">至高のリアリズム</span>
                で描く。
              </>
            ) : (
              <>
                Ship a vision that
                <br />
                <span className="italic font-light text-[#D4FF4F]">doesn&apos;t feel like CGI</span>{" "}
                made it.
              </>
            )}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-sm sm:text-base md:text-lg text-[#FAFAFA]/75 max-w-2xl font-light leading-relaxed mb-9"
          >
            {isJa
              ? "建築CGパース・4Kシネマティックアニメーション・VR空間制作。8つの厳選ショールームを公開中。"
              : "8 premium architectural showcases. High-End 3DCG, cinematic walkthroughs & bespoke VR digital twins."}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            {/* Primary CTA (Lime Fill) */}
            <button
              onClick={scrollToBento}
              className="px-8 py-4 bg-[#D4FF4F] hover:bg-[#b8e83b] text-[#0A0A0A] text-xs sm:text-sm font-bold uppercase tracking-wider rounded-2xl transition-all duration-200 shadow-[0_0_30px_rgba(212,255,79,0.35)] hover:shadow-[0_0_40px_rgba(212,255,79,0.55)] hover:scale-[1.02] active:scale-[0.98]"
            >
              {isJa ? "作品を見る →" : "Browse templates →"}
            </button>

            {/* Secondary CTA (Ghost Glass Outline) */}
            <Link
              href={`/${locale}/solutions`}
              className="px-8 py-4 bg-white/[0.04] hover:bg-white/[0.08] text-[#FAFAFA] text-xs sm:text-sm font-medium uppercase tracking-wider rounded-2xl backdrop-blur-xl border border-white/[0.1] hover:border-white/[0.2] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isJa ? "制作フローを見る" : "See the method"}
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator at bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-6 sm:bottom-8 z-10 flex flex-col items-center gap-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
          onClick={scrollToBento}
        >
          <span
            className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#FAFAFA]/50"
            style={{ fontFamily: "var(--font-mono), monospace" }}
          >
            {isJa ? "スクロールして探索" : "Scroll to explore"}
          </span>
          <div className="w-5 h-8 rounded-full border border-white/20 flex justify-center pt-1.5 backdrop-blur-sm">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-1.5 rounded-full bg-[#D4FF4F]"
            />
          </div>
        </motion.div>
      </section>

      {/* ── 2. INFINITE MARQUEE STRIP ── */}
      <div className="relative py-4 bg-[#0A0A0A] border-y border-white/[0.06] overflow-hidden select-none">
        <div className="flex w-max animate-marquee gap-8 items-center text-xs font-mono uppercase tracking-[0.35em] text-[#FAFAFA]/60">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-8">
              <span>ARCHITECTURAL VISUALIZATION</span>
              <span className="text-[#D4FF4F]">✦</span>
              <span>4K CINEMATIC ANIMATION</span>
              <span className="text-[#D4FF4F]">✦</span>
              <span>VR & DIGITAL TWIN</span>
              <span className="text-[#D4FF4F]">✦</span>
              <span>BUILT WITH PRECISION · NOT AI GENERATED</span>
              <span className="text-[#D4FF4F]">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. TEMPLATES / SHOWCASE 8-TILE ASYMMETRIC BENTO GRID ── */}
      <section
        id="templates-showcase"
        className="relative max-w-[1280px] mx-auto px-6 py-20 sm:py-28 lg:py-36"
      >
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-[#D4FF4F] text-[11px] font-mono tracking-[0.35em] uppercase mb-4">
              <span>01 · SHOWCASE</span>
            </div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-light text-[#FAFAFA] leading-tight"
              style={{ fontFamily: "var(--font-noto-serif), var(--font-display), serif" }}
            >
              {isJa ? (
                <>
                  厳選された <span className="italic text-[#D4FF4F]">8つの空間作品</span>
                </>
              ) : (
                <>
                  8 Featured <span className="italic text-[#D4FF4F]">Architectural Spaces</span>
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
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
              className={`group relative rounded-[16px] overflow-hidden bg-white/[0.03] border ${
                item.featured
                  ? "border-[#D4FF4F]/40 shadow-[0_0_35px_rgba(212,255,79,0.08)]"
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
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#D4FF4F] text-[#0A0A0A] text-[10px] font-mono font-bold tracking-widest uppercase shadow-lg">
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
                  <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#D4FF4F] mb-2 block font-medium">
                    {isJa ? item.tagJa : item.tagEn}
                  </span>
                  <h3
                    className="text-xl sm:text-2xl font-light text-[#FAFAFA] mb-2.5 group-hover:text-[#D4FF4F] transition-colors duration-200"
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
                    className="text-xs font-mono uppercase tracking-wider text-[#FAFAFA]/70 hover:text-[#D4FF4F] transition-colors flex items-center gap-1.5"
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
      </section>

      {/* ── 4. LIGHTBOX MODAL PREVIEW ── */}
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
    </div>
  );
}
