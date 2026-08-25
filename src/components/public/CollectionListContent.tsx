"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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

interface CollectionItemData {
  slug: string;
  titleJa: string;
  titleEn: string;
  descJa: string;
  descEn: string;
  cover: string;
}

export default function CollectionListContent({ dbCollections }: { dbCollections?: DbCol[] }) {
  const locale = useLocale();
  const pathname = usePathname();
  const isJa = locale === "ja";
  const isAboutUs = pathname?.includes("/about-us");
  const basePath = isAboutUs ? `/${locale}/about-us/collection` : `/${locale}/collection`;

  const collections: CollectionItemData[] = (dbCollections && dbCollections.length > 0)
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
  const stageRef = useRef<HTMLDivElement>(null);
  const isWheelingRef = useRef(false);
  const touchStartYRef = useRef(0);

  const CARD_HEIGHT = 450;
  const GAP = 28;
  const CARD_STEP = CARD_HEIGHT + GAP; // 478px

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => Math.min(prev + 1, collections.length - 1));
  }, [collections.length]);

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  // Handle Global Wheel Scroll: locks scroll to collection items until the last card is reached
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // If user is already down in the footer (scrollY > 50) and scrolling down, allow native scroll
      if (window.scrollY > 50 && e.deltaY > 0) {
        return;
      }

      // If user is down in the footer and scrolls up, check if they reached the collection top
      if (window.scrollY > 50 && e.deltaY < 0) {
        return;
      }

      // If we are at the very last card and user scrolls DOWN, let them scroll down into the footer!
      if (activeIndex === collections.length - 1 && e.deltaY > 0) {
        return; // Allow native page scroll to footer
      }

      // If we are at the very first card and user scrolls UP, let them scroll up if needed
      if (activeIndex === 0 && e.deltaY < 0 && window.scrollY <= 0) {
        return;
      }

      // Otherwise, intercept wheel to step through collection items and prevent premature footer scrolling
      e.preventDefault();

      if (isWheelingRef.current) return;

      if (Math.abs(e.deltaY) > 18) {
        if (e.deltaY > 0) {
          if (activeIndex < collections.length - 1) {
            isWheelingRef.current = true;
            goToNext();
            setTimeout(() => {
              isWheelingRef.current = false;
            }, 420);
          }
        } else {
          if (activeIndex > 0) {
            isWheelingRef.current = true;
            goToPrev();
            setTimeout(() => {
              isWheelingRef.current = false;
            }, 420);
          }
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [activeIndex, collections.length, goToNext, goToPrev]);

  // Keyboard navigation (ArrowUp, ArrowDown)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (window.scrollY > 50) return;

      if (e.key === "ArrowDown" || e.key === "PageDown") {
        if (activeIndex < collections.length - 1) {
          e.preventDefault();
          goToNext();
        }
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        if (activeIndex > 0) {
          e.preventDefault();
          goToPrev();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, collections.length, goToNext, goToPrev]);

  // Touch Swipe for Mobile / Tablets
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (window.scrollY > 50) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartYRef.current - touchEndY;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        if (activeIndex < collections.length - 1) goToNext();
      } else {
        if (activeIndex > 0) goToPrev();
      }
    }
  };

  const activeCol = collections[activeIndex] || collections[0];

  return (
    <div className="min-h-screen bg-[#fafaf8] flex flex-col justify-between overflow-hidden">
      {/* ── Top Header ────────────────────────────────────────────── */}
      <header className="pt-8 sm:pt-12 pb-2 text-center px-6 z-30">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#b8935a] font-semibold mb-2">
          {isJa ? "コレクション" : "SPACE COLLECTION"}
        </p>
        <h1
          className="text-2xl sm:text-3xl lg:text-4xl font-light text-[#111] leading-tight"
          style={{ fontFamily: "var(--font-noto-serif), var(--font-display), serif" }}
        >
          {isJa ? "空間を彩る、視覚の物語" : "Visual Stories that Color Spaces"}
        </h1>
      </header>

      {/* ── Main Interactive Showcase Stage (100% Center Aligned with Peeking Neighbors) ─── */}
      <div
        ref={stageRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative flex-1 w-full flex items-center justify-center overflow-hidden px-6 lg:px-16 xl:px-24 py-4 select-none"
        style={{ minHeight: "calc(100vh - 160px)" }}
      >
        <div className="w-full max-w-[1560px] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">

          {/* ── Left Column: Synchronized Dynamic Typography ────────── */}
          <div className="lg:col-span-5 flex flex-col justify-center select-none z-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCol.slug}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-5 sm:space-y-6"
              >

                {/* Main Large Title */}
                <h2
                  className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-[#111] font-light leading-[1.12] tracking-tight"
                  style={{ fontFamily: "var(--font-noto-serif), var(--font-display), serif" }}
                >
                  {isJa ? activeCol.titleJa : activeCol.titleEn}
                </h2>

                {/* Description */}
                {activeCol.descJa && (
                  <p className="text-gray-500 text-sm sm:text-base leading-relaxed font-light max-w-md">
                    {isJa ? activeCol.descJa : activeCol.descEn}
                  </p>
                )}

                {/* Action Link */}
                <div className="flex items-center gap-4 pt-2">
                  <Link
                    href={`${basePath}/${encodeURIComponent(activeCol.slug)}`}
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#111] text-white hover:bg-[#b8935a] text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-xl hover:translate-x-1"
                  >
                    <span>{isJa ? "詳細を見る" : "Explore Space"}</span>
                    <span>→</span>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Bottom Mini Category List Indicator */}
            <div className="hidden lg:flex flex-wrap gap-x-4 gap-y-1.5 pt-10 text-[11px] uppercase tracking-wider text-gray-300 font-mono">
              {collections.slice(0, 7).map((c, i) => (
                <span
                  key={c.slug}
                  onClick={() => setActiveIndex(i)}
                  className={`cursor-pointer transition-colors ${i === activeIndex ? "text-[#b8935a] font-bold" : "hover:text-gray-600"
                    }`}
                >
                  {String(i + 1).padStart(2, "0")} {isJa ? c.titleJa : c.titleEn}
                </span>
              ))}
              {collections.length > 7 && <span>...</span>}
            </div>
          </div>

          {/* ── Right Column: Vertical Reel with Visible Top & Bottom Peeking Cards ──── */}
          <div className="lg:col-span-7 relative h-[720px] sm:h-[780px] lg:h-[840px] flex items-center justify-center overflow-hidden">
            {/* Top & Bottom Subtle Edge Softeners */}
            <div className="absolute top-0 inset-x-0 h-6 bg-gradient-to-b from-[#fafaf8] to-transparent z-30 pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 h-6 bg-gradient-to-t from-[#fafaf8] to-transparent z-30 pointer-events-none" />

            {/* Filmstrip Reel centered at Y = -activeIndex * CARD_STEP */}
            <motion.div
              animate={{ y: -activeIndex * CARD_STEP }}
              transition={{ type: "spring", stiffness: 200, damping: 26, mass: 0.8 }}
              className="flex flex-col items-center gap-7 absolute w-full max-w-[760px] xl:max-w-[850px] 2xl:max-w-[920px]"
              style={{
                top: "50%",
                marginTop: `-${CARD_HEIGHT / 2}px`,
              }}
            >
              {collections.map((col, idx) => {
                const isCurrent = idx === activeIndex;
                const distance = Math.abs(idx - activeIndex);

                let targetScale = 0.65;
                let targetOpacity = 0.35;

                if (isCurrent) {
                  targetScale = 1.0;
                  targetOpacity = 1.0;
                } else if (distance === 1) {
                  targetScale = 0.78;
                  targetOpacity = 0.65; // Clearly visible top & bottom preview cards
                }

                return (
                  <motion.div
                    key={col.slug}
                    animate={{
                      scale: targetScale,
                      opacity: targetOpacity,
                    }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => {
                      if (!isCurrent) setActiveIndex(idx);
                    }}
                    style={{ height: `${CARD_HEIGHT}px` }}
                    className={`relative w-full overflow-visible cursor-pointer shrink-0 bg-transparent flex items-center justify-center ${isCurrent
                      ? "z-20"
                      : "hover:opacity-85 z-10"
                      }`}
                  >
                    <Link
                      href={isCurrent ? `${basePath}/${encodeURIComponent(col.slug)}` : "#"}
                      onClick={(e) => {
                        if (!isCurrent) {
                          e.preventDefault();
                          setActiveIndex(idx);
                        }
                      }}
                      className="w-full h-full relative group bg-transparent flex items-center justify-center"
                    >
                      {/* Image floats seamlessly with natural rounded borders and shadow */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={col.cover}
                        alt={isJa ? col.titleJa : col.titleEn}
                        className={`max-w-full max-h-full object-contain rounded-2xl sm:rounded-3xl transition-all duration-700 ease-out group-hover:scale-[1.02] ${
                          isCurrent
                            ? "shadow-2xl ring-1 ring-black/5"
                            : "shadow-lg opacity-90"
                        }`}
                        onError={(e) => {
                          const t = e.currentTarget;
                          t.style.display = "none";
                          const p = t.parentElement;
                          if (p) {
                            p.classList.add("flex", "items-center", "justify-center", "bg-neutral-100", "rounded-2xl");
                            const s = document.createElement("span");
                            s.className = "text-gray-400 text-lg font-medium";
                            s.textContent = isJa ? col.titleJa : col.titleEn;
                            p.appendChild(s);
                          }
                        }}
                      />
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}


