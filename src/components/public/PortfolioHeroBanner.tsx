"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface Props {
  heroImage: string;
  isJa: boolean;
  locale: string;
}

export default function PortfolioHeroBanner({ heroImage, isJa, locale }: Props) {
  return (
    <section className="bg-white border-b border-gray-100 overflow-hidden select-none">
      <div className="w-full min-h-[calc(100vh-var(--header-h,76px))] max-h-[950px] grid grid-cols-1 lg:grid-cols-2 items-stretch">
        
        {/* Left Column: White Editorial Layout */}
        <div className="bg-white p-8 sm:p-12 md:p-14 lg:p-16 xl:p-20 flex flex-col justify-between items-start z-10">
          {/* Top Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="w-full"
          >
            <p className="text-[17px] sm:text-[18px] font-extrabold tracking-[0.22em] text-[#111] uppercase font-sans">
              {isJa ? "建築CG制作" : "ARCHITECTURAL"}
            </p>
            <p className="text-sm sm:text-[15px] font-medium tracking-[0.28em] text-gray-500 uppercase font-sans mt-1">
              {isJa ? "ビジュアライゼーション" : "VISUALIZATION"}
            </p>
          </motion.div>

          {/* Center Typographic Statement & Narrative */}
          <div className="my-auto py-8 sm:py-10 md:py-12 w-full">
            {isJa ? (
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-light text-[#111] tracking-[0.1em] sm:tracking-[0.16em] select-none leading-[1.2]"
                style={{ fontFamily: "var(--font-noto-serif), serif" }}
              >
                ポートフォリオ
              </motion.h1>
            ) : (
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal text-[#111] tracking-[0.22em] sm:tracking-[0.28em] uppercase select-none leading-[1.18] font-roboto"
              >
                <span className="block">P O R T -</span>
                <span className="block mt-1 sm:mt-2">F O L I O</span>
              </motion.h1>
            )}
          </div>

          {/* Bottom Credits & Action Link */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="w-full flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-2"
          >
            <div>
              <p className="text-lg sm:text-xl text-gray-900 font-bold tracking-wide">
                i8 STUDIO
              </p>
              <p className="text-sm sm:text-[15px] text-gray-600 font-medium mt-1">
                {isJa ? "建築CGパース・VR・アニメーション制作スタジオ" : "Architectural 3DCG & VR Studio"}
              </p>
            </div>

            <Link
              href={`/${locale}/works`}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#111] hover:bg-[#333] text-white text-sm font-semibold shadow-md transition-all hover:scale-105 group"
            >
              <span>{isJa ? "プロジェクト一覧" : "Selected works"}</span>
              <span className="text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all">→</span>
            </Link>
          </motion.div>
        </div>

        {/* Right Column: 3D Wireframe to Photoreal Laser Scan Reveal */}
        <div className="relative w-full h-[420px] sm:h-[520px] lg:h-auto min-h-full overflow-hidden bg-[#0c0b0a] group">
          
          {/* ── 1. Under-Layer: 3D Technical Wireframe / Blueprint Mesh ── */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(197, 166, 102, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(197, 166, 102, 0.2) 1px, transparent 1px)`,
                backgroundSize: "36px 36px",
              }}
            />
            {heroImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroImage}
                alt="3D Wireframe"
                className="w-full h-full object-cover opacity-20 filter grayscale invert contrast-200"
              />
            )}
            <div className="absolute inset-0 bg-radial from-transparent via-[#0c0b0a]/70 to-[#0c0b0a]" />

            {/* Technical HUD Overlay Indicators */}
            <motion.div
              initial={{ opacity: 0.9 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 1.2, delay: 2.8 }}
              className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none font-mono text-[10px] text-[#c5a666]/70 uppercase tracking-widest z-10"
            >
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#c5a666] animate-ping" />
                  [ 3D WIREFRAME MESH SCAN ]
                </span>
                <span>FOV: 45°</span>
              </div>
              <div className="flex justify-between items-center">
                <span>RAYTRACING: OPTIX</span>
                <span>PHOTOREAL 100%</span>
              </div>
            </motion.div>
          </div>

          {/* ── 2. Top-Layer: Photorealistic Architectural Render (Revealed via Laser Scan) ── */}
          {heroImage && (
            <motion.div
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="absolute inset-0 z-1 overflow-hidden pointer-events-none"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <motion.img
                initial={{ scale: 1.08 }}
                animate={{ scale: 1 }}
                transition={{ duration: 3.5, ease: [0.16, 1, 0.3, 1] }}
                src={heroImage}
                alt="Architectural Visualization Portfolio — i8 STUDIO"
                className="w-full h-full object-cover object-[75%_35%] sm:object-[76%_32%] lg:object-[78%_30%] group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          )}

          {/* ── 3. Glowing Golden Laser Scan Beam Sweep ── */}
          <motion.div
            initial={{ left: "-5%", opacity: 0 }}
            animate={{ left: "105%", opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="absolute inset-y-0 w-12 -translate-x-1/2 z-20 pointer-events-none flex items-center justify-center"
          >
            <div className="w-[2.5px] h-full bg-gradient-to-b from-transparent via-[#fff5d0] to-transparent shadow-[0_0_25px_8px_rgba(224,185,110,0.85)]" />
            <div className="absolute inset-y-0 -left-10 w-20 bg-gradient-to-r from-transparent via-[#c5a666]/30 to-transparent blur-md" />
          </motion.div>

        </div>

      </div>
    </section>
  );
}
