"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { COLLECTIONS } from "@/lib/collection-data";

interface DbCol {
  slug: string;
  titleJa: string;
  titleEn: string;
  descJa: string;
  descEn: string;
  coverImage: string;
}

export default function CollectionListContent({ dbCollections }: { dbCollections?: DbCol[] }) {
  const locale = useLocale();
  const pathname = usePathname();
  const isJa = locale === "ja";
  const isAboutUs = pathname?.includes("/about-us");
  const basePath = isAboutUs ? `/${locale}/about-us/collection` : `/${locale}/collection`;

  const collections = (dbCollections && dbCollections.length > 0)
    ? dbCollections.map((c) => ({
      slug: c.slug,
      titleJa: c.titleJa,
      titleEn: c.titleEn,
      descJa: c.descJa,
      descEn: c.descEn,
      cover: c.coverImage,
    }))
    : COLLECTIONS.map((c) => ({
      slug: c.slug,
      titleJa: c.titleJa,
      titleEn: c.titleEn,
      descJa: c.descJa,
      descEn: c.descEn,
      cover: c.cover,
    }));

  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Scroll spy for Desktop project list
  useEffect(() => {
    const handleScroll = () => {
      const windowCenter = window.innerHeight * 0.45;
      let closestIdx = 0;
      let minDistance = Infinity;

      itemRefs.current.forEach((el, index) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const distance = Math.abs(elementCenter - windowCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestIdx = index;
        }
      });

      setActiveIndex(closestIdx);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [collections.length]);

  const activeCol = collections[activeIndex] || collections[0];

  const scrollToItem = (index: number) => {
    setActiveIndex(index);
    const targetEl = itemRefs.current[index];
    if (targetEl) {
      const navOffset = 180;
      const elementPosition = targetEl.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navOffset,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      {/* ── Hero (Preserved Exactly) ──────────────────── */}
      <section className="bg-[#fafaf8] section-noise border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-32 text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] uppercase tracking-[0.3em] text-gray-400 mb-5">
            {isJa ? "コレクション" : "COLLECTION"}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-light text-[#111] mb-6"
            style={{ fontFamily: "var(--font-noto-serif), var(--font-display), serif" }}
          >
            {isJa ? "空間を彩る、視覚の物語" : "Visual Stories that Color Spaces"}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
            {isJa ? "さまざまな空間タイプの3DCGビジュアライゼーションコレクション。" : "A collection of 3DCG visualizations across various space types."}
          </motion.p>
        </div>
      </section>

      {/* ── Desktop Layout: Interactive Editorial Project Index + Sticky Showcase (lg+) ──────────────────── */}
      <section className="hidden lg:block relative max-w-[1600px] mx-auto px-8 xl:px-14 py-16 xl:py-24">
        <div className="grid grid-cols-12 gap-10 xl:gap-16 items-start">

          {/* Left Side: Scrollable Project Index */}
          <div className="col-span-5 py-12 space-y-16 xl:space-y-24">
            {collections.map((col, idx) => {
              const isActive = activeIndex === idx;
              const title = isJa ? col.titleJa : col.titleEn;
              const numStr = String(idx + 1).padStart(2, "0");

              return (
                <div
                  key={col.slug}
                  ref={(el) => {
                    itemRefs.current[idx] = el;
                  }}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className="group cursor-pointer transition-all duration-500 select-none"
                >
                  <div
                    onClick={() => scrollToItem(idx)}
                    className="flex items-start gap-4 xl:gap-6"
                  >
                    {/* Index Number */}
                    <span
                      className={`text-xs font-roboto font-bold tracking-widest mt-2 transition-colors duration-300 ${isActive ? "text-[#b8935a]" : "text-gray-300 group-hover:text-gray-400"
                        }`}
                    >
                      {numStr}
                    </span>

                    {/* Title & Description */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h2
                          className={`font-serif text-xl lg:text-2xl xl:text-3xl whitespace-nowrap leading-tight transition-all duration-500 ${isActive
                              ? "text-[#111] font-normal translate-x-1"
                              : "text-gray-300 font-light group-hover:text-gray-600"
                            }`}
                          style={{ fontFamily: "var(--font-noto-serif), var(--font-display), serif" }}
                        >
                          {title}
                        </h2>
                        {isActive && (
                          <motion.span
                            layoutId="active-indicator"
                            className="w-2.5 h-2.5 rounded-full bg-[#b8935a] shrink-0"
                            transition={{ type: "spring", stiffness: 350, damping: 30 }}
                          />
                        )}
                      </div>

                      {/* Active Details Slide-in */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, y: 10 }}
                            animate={{ opacity: 1, height: "auto", y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -5 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            className="overflow-hidden"
                          >
                            <p className="text-gray-600 text-sm leading-relaxed mt-4 max-w-md font-light">
                              {isJa ? col.descJa : col.descEn}
                            </p>
                            <Link
                              href={`${basePath}/${encodeURIComponent(col.slug)}`}
                              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#b8935a] hover:text-[#9a7642] mt-4 group-hover:translate-x-1 transition-transform"
                            >
                              <span>{isJa ? "コレクション詳細を見る" : "View Collection"}</span>
                              <span>→</span>
                            </Link>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Side: Sticky Featured Showcase (Khổ 16:9 lấp đầy khung hình không bị viền đen) */}
          <div className="col-span-7 sticky top-28 pb-6">
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl bg-white group flex items-center justify-center border border-gray-100">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCol.slug}
                  initial={{ opacity: 0, scale: 0.98, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.01, y: -6 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative w-full h-full flex items-center justify-center overflow-hidden"
                >
                  <Link
                    href={`${basePath}/${encodeURIComponent(activeCol.slug)}`}
                    className="block w-full h-full relative"
                  >
                    {/* Full Cover Image (Luôn vừa khít khung 16:9, không bị viền đen 2 bên) */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeCol.cover}
                      alt={isJa ? activeCol.titleJa : activeCol.titleEn}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                      onError={(e) => {
                        const t = e.currentTarget;
                        t.style.display = "none";
                        const p = t.parentElement;
                        if (p) {
                          p.classList.add("flex", "items-center", "justify-center", "bg-neutral-800");
                          const s = document.createElement("span");
                          s.className = "text-white/40 text-lg font-medium relative z-10";
                          s.textContent = isJa ? activeCol.titleJa : activeCol.titleEn;
                          p.appendChild(s);
                        }
                      }}
                    />

                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity group-hover:opacity-90 z-[2] pointer-events-none" />

                    {/* Overlay Details */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 xl:p-8 flex items-end justify-between z-10 text-white">
                      <div className="max-w-lg">
                        <span className="text-[11px] uppercase tracking-[0.25em] text-[#e8dcc8] font-semibold block mb-2">
                          {isJa ? "空間コレクション" : "SPACE COLLECTION"} · {String(activeIndex + 1).padStart(2, "0")} / {String(collections.length).padStart(2, "0")}
                        </span>
                        <h3
                          className="font-serif text-xl xl:text-2xl text-white mb-1.5 leading-tight"
                          style={{ fontFamily: "var(--font-noto-serif), var(--font-display), serif" }}
                        >
                          {isJa ? activeCol.titleJa : activeCol.titleEn}
                        </h3>
                        <p className="text-white/80 text-xs xl:text-sm line-clamp-2 leading-relaxed font-light">
                          {isJa ? activeCol.descJa : activeCol.descEn}
                        </p>
                      </div>

                      <div className="shrink-0 ml-4">
                        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 hover:bg-white text-white hover:text-[#111] backdrop-blur-md text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-xl border border-white/20 hover:border-white">
                          <span>{isJa ? "詳細を見る" : "Explore Space"}</span>
                          <span>→</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </section>

      {/* ── Mobile / Tablet Sequential Vertical Flow (< lg) ──────────────────── */}
      <section className="block lg:hidden max-w-2xl mx-auto px-6 py-14 space-y-16">
        {collections.map((col, idx) => {
          const title = isJa ? col.titleJa : col.titleEn;
          const numStr = String(idx + 1).padStart(2, "0");

          return (
            <motion.div
              key={col.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="flex items-baseline gap-3 border-b border-gray-200 pb-3">
                <span className="text-xs font-roboto tracking-widest text-[#b8935a] font-bold">
                  {numStr}
                </span>
                <h2
                  className="font-serif text-2xl sm:text-3xl text-[#111]"
                  style={{ fontFamily: "var(--font-noto-serif), var(--font-display), serif" }}
                >
                  {title}
                </h2>
              </div>

              <Link
                href={`${basePath}/${encodeURIComponent(col.slug)}`}
                className="group block rounded-xl overflow-hidden shadow-md bg-neutral-900 relative aspect-[16/9]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={col.cover}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 right-4 z-10">
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-[#111] text-xs font-semibold shadow-md">
                    <span>{isJa ? "詳細" : "Explore"}</span>
                    <span>→</span>
                  </span>
                </div>
              </Link>

              <p className="text-gray-600 text-sm leading-relaxed font-light">
                {isJa ? col.descJa : col.descEn}
              </p>
            </motion.div>
          );
        })}
      </section>
    </div>
  );
}
