"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import Lightbox from "./Lightbox";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */
interface HeroImage {
  url: string;
  alt: string;
  videoUrl?: string;
}

interface HeroEditorialProps {
  images?: HeroImage[];
  limit?: number;
}

interface MasonryItem {
  flex: number;
  aspect: string;
  maxHeight?: string;
  minHeight?: string;
  tileIdx: number;
}

/* Fallback palette when no image */
const PLACEHOLDER_COLORS = [
  "#c8c2b8", "#b8b0a4", "#a8a498", "#d4cec4",
  "#bcb8ae", "#c4c0b8", "#d0c8be", "#bab4aa",
  "#ccc6bc", "#a4a098", "#b0aca2", "#c0bab0",
  "#c8c4bc", "#b4b0a8", "#d0cac0",
];

/*
 * Masonry block pattern (17 items per repeating cycle):
 * Row 1: 4 vertical cards (3:5)
 * Row 2: 1 full-screen cinematic banner (16:9)
 * Row 3-6: 3 widescreen cards per row (16:9)
 */
const MASONRY_BLOCK = [
  [
    { flex: 1, aspect: "3/5" },
    { flex: 1, aspect: "3/5" },
    { flex: 1, aspect: "3/5" },
    { flex: 1, aspect: "3/5" },
  ],
  [
    { flex: 1, aspect: "16/9", minHeight: "calc(100vh - 48px)" },
  ],
  [
    { flex: 1, aspect: "16/9" },
    { flex: 1, aspect: "16/9" },
    { flex: 1, aspect: "16/9" },
  ],
  [
    { flex: 1, aspect: "16/9" },
    { flex: 1, aspect: "16/9" },
    { flex: 1, aspect: "16/9" },
  ],
  [
    { flex: 1, aspect: "16/9" },
    { flex: 1, aspect: "16/9" },
    { flex: 1, aspect: "16/9" },
  ],
  [
    { flex: 1, aspect: "16/9" },
    { flex: 1, aspect: "16/9" },
    { flex: 1, aspect: "16/9" },
  ],
];

/* ------------------------------------------------------------------ */
/*  Staggered reveal for each tile                                     */
/* ------------------------------------------------------------------ */
function isVideoFile(url: string) {
  return /\.(mp4|webm|mov)$/i.test(url);
}

function GridTile({
  image,
  index,
  fallbackColor,
  aspect,
  maxHeight,
  minHeight,
  onClick,
}: {
  image?: HeroImage;
  index: number;
  fallbackColor: string;
  aspect: string;
  maxHeight?: string;
  minHeight?: string;
  onClick?: () => void;
}) {
  const hasImage = image?.url;
  const hasVideo = image?.videoUrl && isVideoFile(image.videoUrl);
  const isFullScreenHeroType = Boolean(minHeight);

  return (
    <div
      className="hero-tile w-full relative"
      style={{
        aspectRatio: aspect,
        maxHeight: maxHeight || undefined,
        minHeight: minHeight || undefined,
        willChange: "transform, opacity, clip-path",
      }}
    >
      {/* Card container: static for large full-screen images (like Hero), 3D hover lift for smaller cards */}
      <div
        onClick={onClick}
        className={`group relative w-full h-full cursor-pointer rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-100 shadow-md ${
          isFullScreenHeroType
            ? "hover:opacity-95"
            : "transition-all duration-500 ease-out hover:scale-105 hover:-translate-y-3 hover:shadow-[0_25px_50px_rgba(0,0,0,0.35)] hover:z-30 border border-black/5"
        }`}
        style={{
          transformOrigin: "center center",
        }}
      >
        {hasVideo ? (
          <video
            src={image!.videoUrl}
            className="absolute inset-0 w-full h-full object-cover object-center"
            autoPlay
            muted
            loop
            playsInline
            poster={image!.url || undefined}
          />
        ) : hasImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={image.url}
            alt={image.alt || `Work ${index + 1}`}
            className="absolute inset-0 w-full h-full object-cover object-center"
            loading={index < 6 ? "eager" : "lazy"}
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: fallbackColor }}
          />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function HeroEditorial({ images = [], limit = 11 }: HeroEditorialProps) {
  const t = useTranslations("home");
  const sectionRef = useRef<HTMLElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const scrollRowObserverRef = useRef<IntersectionObserver | null>(null);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string; isVideo?: boolean } | null>(null);

  // Parallax: text moves slightly faster than grid on scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  // Hero image = first image, masonry uses the rest
  const heroImage = images[0];
  const masonryImages = images.slice(1);

  // Flatten rows to get tile index mapping
  let tileIndex = 0;

  // Determine active rows dynamically to fit all masonry images
  const totalMasonryCount = masonryImages.length;
  const activeRows: Array<Array<{ flex: number; aspect: string; minHeight?: string }>> = [];
  let itemsAllocated = 0;
  let blockIndex = 0;

  while (itemsAllocated < totalMasonryCount) {
    for (const rowTemplate of MASONRY_BLOCK) {
      if (itemsAllocated >= totalMasonryCount) break;
      const remaining = totalMasonryCount - itemsAllocated;
      const countForThisRow = Math.min(rowTemplate.length, remaining);
      const row = rowTemplate.slice(0, countForThisRow);
      activeRows.push(row);
      itemsAllocated += countForThisRow;
    }
    blockIndex++;
    if (blockIndex > 50) break; // safety guard
  }

  // Scroll-Triggered Row-by-Row Push-Up Reveal Animation (Same as Works page)
  useEffect(() => {
    if (!gridContainerRef.current) return;

    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    if (scrollRowObserverRef.current) {
      scrollRowObserverRef.current.disconnect();
    }

    const rows = Array.from(gridContainerRef.current.querySelectorAll<HTMLElement>(".hero-row"));
    if (rows.length === 0) return;

    // Observe each row as user scrolls down
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const targetRow = entry.target as HTMLElement;
            observer.unobserve(targetRow);

            const tiles = targetRow.querySelectorAll<HTMLElement>(".hero-tile");
            if (tiles.length > 0) {
              gsap.fromTo(
                tiles,
                {
                  opacity: 0,
                  y: 80,
                  clipPath: "inset(40% 0% 0% 0%)",
                },
                {
                  opacity: 1,
                  y: 0,
                  clipPath: "inset(0% 0% 0% 0%)",
                  duration: 0.9,
                  ease: "power4.out",
                  stagger: 0.08,
                  clearProps: "clipPath",
                }
              );
            }
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -40px 0px",
        threshold: 0.05,
      }
    );

    scrollRowObserverRef.current = observer;

    // Initialize unrevealed rows with hidden push-up state
    requestAnimationFrame(() => {
      const vh = window.innerHeight;
      rows.forEach((row) => {
        const rect = row.getBoundingClientRect();
        const tiles = row.querySelectorAll<HTMLElement>(".hero-tile");

        if (rect.top < vh * 0.95 && rect.bottom > 0) {
          // Immediately in viewport
          gsap.fromTo(
            tiles,
            {
              opacity: 0,
              y: 60,
              clipPath: "inset(35% 0% 0% 0%)",
            },
            {
              opacity: 1,
              y: 0,
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 0.85,
              ease: "power4.out",
              stagger: 0.06,
              clearProps: "clipPath",
            }
          );
        } else {
          // Below the fold: set hidden state and observe
          gsap.set(tiles, {
            opacity: 0,
            y: 80,
            clipPath: "inset(40% 0% 0% 0%)",
          });
          observer.observe(row);
        }
      });
    });

    return () => {
      observer.disconnect();
    };
  }, [activeRows.length]);

  return (
    <section ref={sectionRef} id="hero-section" className="bg-white relative overflow-hidden">
      {/* ========== FULL-VIEWPORT HERO ========== */}
      <div className="relative w-full px-3 pt-3" style={{ height: "calc(100vh - var(--header-h, 76px))" }}>
        <div
          onClick={() => {
            if (heroImage?.url || heroImage?.videoUrl) {
              setLightbox({
                src: heroImage.videoUrl || heroImage.url,
                alt: heroImage.alt || "Hero Media",
                isVideo: !!(heroImage.videoUrl && isVideoFile(heroImage.videoUrl)),
              });
            }
          }}
          className="relative w-full h-full rounded-2xl overflow-hidden cursor-pointer group"
        >
          {/* Hero image */}
          {heroImage?.videoUrl && isVideoFile(heroImage.videoUrl) ? (
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <video
                src={heroImage.videoUrl}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                autoPlay
                muted
                loop
                playsInline
                poster={heroImage.url || undefined}
              />
            </motion.div>
          ) : heroImage?.url ? (
            <motion.img
              src={heroImage.url}
              alt={heroImage.alt}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.21, 0.47, 0.32, 0.98] }}
            />
          ) : (
            <div className="absolute inset-0 bg-[#c8c2b8]" />
          )}

          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

          {/* Text overlay */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-end pb-16 sm:pb-20 px-6 text-center z-10"
            style={{ y: textY, opacity: textOpacity }}
          >
            <motion.h1
              className="font-serif text-[32px] sm:text-[40px] md:text-[48px] font-normal text-white tracking-[0.05em] leading-[1.15] mb-3 drop-shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              {t("hero.title")}
            </motion.h1>

            <motion.p
              className="font-serif text-[14px] sm:text-[16px] md:text-[18px] font-light text-white/85 tracking-[0.08em] mb-3 drop-shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.p
              className="text-[11px] sm:text-[12px] text-white/65 leading-[1.6] max-w-[560px] whitespace-pre-line drop-shadow-sm"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              {t("hero.description")}
            </motion.p>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <motion.div
              className="w-5 h-8 rounded-full border-2 border-white/40 flex items-start justify-center p-1"
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            >
              <div className="w-1 h-2 rounded-full bg-white/60" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ========== MASONRY GRID WITH ROW-BY-ROW REVEAL & 3D HOVER LIFT ========== */}
      <div ref={gridContainerRef} className="w-full px-3 py-6">
        <div className="flex flex-col gap-3">
          {activeRows.map((row, rowIdx) => {
            const rowItems = row.map((item) => {
              const currentIndex = tileIndex;
              tileIndex++;
              return { ...item, tileIdx: currentIndex };
            });

            return (
              <div
                key={rowIdx}
                className="hero-row flex gap-3 sm:gap-4 justify-center py-2"
                style={{ alignItems: "stretch" }}
              >
                {rowItems.map((item: MasonryItem) => {
                  const currentImage = masonryImages[item.tileIdx];

                  return (
                    <div
                      key={item.tileIdx}
                      className="flex justify-center relative hover:z-30"
                      style={{ flex: item.flex, minWidth: 0 }}
                    >
                      <GridTile
                        image={currentImage}
                        index={item.tileIdx}
                        fallbackColor={PLACEHOLDER_COLORS[item.tileIdx % PLACEHOLDER_COLORS.length]}
                        aspect={item.aspect}
                        maxHeight={item.maxHeight}
                        minHeight={item.minHeight}
                        onClick={() => {
                          if (currentImage?.url || currentImage?.videoUrl) {
                            setLightbox({
                              src: currentImage.videoUrl || currentImage.url,
                              alt: currentImage.alt || `Work ${item.tileIdx + 1}`,
                              isVideo: !!(currentImage.videoUrl && isVideoFile(currentImage.videoUrl)),
                            });
                          }
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal (Click to open full uncropped image) */}
      {lightbox && (
        <Lightbox
          src={lightbox.src}
          alt={lightbox.alt}
          isVideo={lightbox.isVideo}
          onClose={() => setLightbox(null)}
        />
      )}
    </section>
  );
}

