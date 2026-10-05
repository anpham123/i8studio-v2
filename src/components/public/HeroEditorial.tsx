"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";
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
  showOverlayText?: boolean;
}

interface MasonryItem {
  targetCols: number;
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
 * Masonry block pattern (Blocks 1-3: uses 12 vertical cards total):
 * - Row 1: 4 vertical cards (3:5)
 * - Row 2: 1 full-screen cinematic banner (16:9)
 * - Row 3-6: 2 widescreen cards per row (16:9)
 */
const MASONRY_BLOCK = [
  [
    { targetCols: 4, aspect: "3/5" },
    { targetCols: 4, aspect: "3/5" },
    { targetCols: 4, aspect: "3/5" },
    { targetCols: 4, aspect: "3/5" },
  ],
  [
    { targetCols: 1, aspect: "16/9", minHeight: "calc(100vh - 48px)" },
  ],
  [
    { targetCols: 2, aspect: "16/9" },
    { targetCols: 2, aspect: "16/9" },
  ],
  [
    { targetCols: 2, aspect: "16/9" },
    { targetCols: 2, aspect: "16/9" },
  ],
  [
    { targetCols: 2, aspect: "16/9" },
    { targetCols: 2, aspect: "16/9" },
  ],
  [
    { targetCols: 2, aspect: "16/9" },
    { targetCols: 2, aspect: "16/9" },
  ],
];

/*
 * Masonry block pattern from block 4 onwards (When all 12 vertical cards are used):
 * - Row 1-2: 4 widescreen cards (2 rows x 2 cards, 16:9) replacing 4 vertical cards
 * - Row 3: 1 full-screen cinematic banner (16:9)
 * - Row 4-7: 8 widescreen cards per block (4 rows x 2 cards, 16:9)
 */
const MASONRY_BLOCK_HORIZONTAL = [
  [
    { targetCols: 2, aspect: "16/9" },
    { targetCols: 2, aspect: "16/9" },
  ],
  [
    { targetCols: 2, aspect: "16/9" },
    { targetCols: 2, aspect: "16/9" },
  ],
  [
    { targetCols: 1, aspect: "16/9", minHeight: "calc(100vh - 48px)" },
  ],
  [
    { targetCols: 2, aspect: "16/9" },
    { targetCols: 2, aspect: "16/9" },
  ],
  [
    { targetCols: 2, aspect: "16/9" },
    { targetCols: 2, aspect: "16/9" },
  ],
  [
    { targetCols: 2, aspect: "16/9" },
    { targetCols: 2, aspect: "16/9" },
  ],
  [
    { targetCols: 2, aspect: "16/9" },
    { targetCols: 2, aspect: "16/9" },
  ],
];

/* ------------------------------------------------------------------ */
/*  Staggered reveal for each tile                                     */
/* ------------------------------------------------------------------ */
function isVideoFile(url: string) {
  return /\.(mp4|webm|mov)$/i.test(url);
}

/** Only local raster images go through the Next.js optimizer (resized + cached per device width) */
function canOptimize(url: string) {
  return url.startsWith("/") && !/\.(svg|gif)$/i.test(url);
}

function canHover() {
  return typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/**
 * Hover-preview video that is only mounted (and downloaded) after the first real mouse hover.
 * Before that, no <video> element exists, so the page doesn't fetch any video data on load.
 */
function useHoverVideo(hasVideo: boolean) {
  const [mounted, setMounted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const hoveredRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const onEnter = () => {
    hoveredRef.current = true;
    setHovered(true);
    if (!hasVideo || !canHover()) return;
    if (!mounted) {
      setMounted(true); // <video autoPlay> starts itself once mounted
      return;
    }
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      v.play().then(() => hoveredRef.current && setPlaying(true)).catch(() => { });
    }
  };

  const onLeave = () => {
    hoveredRef.current = false;
    setHovered(false);
    setPlaying(false);
    videoRef.current?.pause();
  };

  const onPlaying = () => {
    if (hoveredRef.current) setPlaying(true);
    else videoRef.current?.pause();
  };

  return { mounted, playing, hovered, videoRef, onEnter, onLeave, onPlaying };
}

function GridTile({
  image,
  index,
  fallbackColor,
  aspect,
  maxHeight,
  minHeight,
  sizes,
  onClick,
}: {
  image?: HeroImage;
  index: number;
  fallbackColor: string;
  aspect: string;
  maxHeight?: string;
  minHeight?: string;
  sizes: string;
  onClick?: () => void;
}) {
  const hasImage = Boolean(image?.url);
  const hasVideo = Boolean(image?.videoUrl && isVideoFile(image.videoUrl));
  const isFullScreenHeroType = Boolean(minHeight);
  const hv = useHoverVideo(hasVideo);
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div
      className="hero-tile w-full relative"
      style={{
        aspectRatio: aspect,
        maxHeight: maxHeight || undefined,
        minHeight: minHeight || undefined,
      }}
    >
      {/* Card container: static for large full-screen images (like Hero), hover lift for smaller cards */}
      <div
        onClick={onClick}
        onMouseEnter={hv.onEnter}
        onMouseLeave={hv.onLeave}
        className={`group relative w-full h-full cursor-pointer rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-100 shadow-md ${isFullScreenHeroType
          ? "hover:opacity-95"
          : "transition-[transform,box-shadow] duration-500 ease-out hover:scale-105 hover:-translate-y-3 hover:shadow-[0_25px_50px_rgba(0,0,0,0.35)] hover:z-30 border border-black/5"
          }`}
        style={{
          transformOrigin: "center center",
        }}
      >
        {/* Base Image Poster (always rendered if available) */}
        {hasImage && !imgFailed ? (
          canOptimize(image!.url) ? (
            <Image
              src={image!.url}
              alt={image!.alt || `Work ${index + 1}`}
              fill
              sizes={sizes}
              quality={78}
              loading={index < 4 ? "eager" : "lazy"}
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              onError={() => setImgFailed(true)}
            />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={image!.url}
              alt={image!.alt || `Work ${index + 1}`}
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              loading={index < 4 ? "eager" : "lazy"}
              decoding="async"
              onError={() => setImgFailed(true)}
            />
          )
        ) : (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: fallbackColor }}
          />
        )}

        {/* Hover Video: mounted & downloaded only after the first mouse hover */}
        {hasVideo && hv.mounted && (
          <video
            ref={hv.videoRef}
            src={image!.videoUrl}
            onPlaying={hv.onPlaying}
            className={`absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-opacity duration-300 ${hv.hovered && hv.playing ? "opacity-100" : "opacity-0"
              }`}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function HeroEditorial({ images = [], limit = 11, showOverlayText = false }: HeroEditorialProps) {
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

  const textY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0]);

  // Hero image = first image, masonry uses the rest
  const heroImage = images[0];
  const masonryImages = images.slice(1);
  const heroHasVideo = Boolean(heroImage?.videoUrl && isVideoFile(heroImage.videoUrl));
  const heroHv = useHoverVideo(heroHasVideo);

  // Flatten rows to get tile index mapping
  let tileIndex = 0;

  // Determine active rows dynamically to fit all uploaded masonry images (no limit)
  const totalMasonryCount = masonryImages.length;
  const activeRows: Array<Array<{ targetCols: number; aspect: string; minHeight?: string; maxHeight?: string }>> = [];
  let itemsAllocated = 0;
  let blockIndex = 0;

  while (itemsAllocated < totalMasonryCount) {
    const currentBlockTemplate = blockIndex < 3 ? MASONRY_BLOCK : MASONRY_BLOCK_HORIZONTAL;
    for (const rowTemplate of currentBlockTemplate) {
      if (itemsAllocated >= totalMasonryCount) break;
      const remaining = totalMasonryCount - itemsAllocated;
      const countForThisRow = Math.min(rowTemplate.length, remaining);
      const row = rowTemplate.slice(0, countForThisRow);
      activeRows.push(row);
      itemsAllocated += countForThisRow;
    }
    blockIndex++;
    if (blockIndex > 500) break; // safety guard
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
              // transform + opacity only (compositor-friendly, no clip-path repaint)
              gsap.fromTo(
                tiles,
                {
                  opacity: 0,
                  y: 60,
                },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.8,
                  ease: "power3.out",
                  stagger: 0.07,
                  clearProps: "transform,opacity",
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
              y: 50,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.06,
              clearProps: "transform,opacity",
            }
          );
        } else {
          // Below the fold: set hidden state and observe
          gsap.set(tiles, {
            opacity: 0,
            y: 60,
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
          onMouseEnter={heroHv.onEnter}
          onMouseLeave={heroHv.onLeave}
          className="relative w-full h-full rounded-2xl overflow-hidden cursor-pointer group"
        >
          {/* Base Hero Image */}
          {heroImage?.url ? (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              {canOptimize(heroImage.url) ? (
                <Image
                  src={heroImage.url}
                  alt={heroImage.alt || "i8 STUDIO"}
                  fill
                  sizes="100vw"
                  quality={80}
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={heroImage.url}
                  alt={heroImage.alt}
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              )}
            </motion.div>
          ) : (
            <div className="absolute inset-0 bg-[#c8c2b8]" />
          )}

          {/* Hover Video Preview for Hero (mounted only after first mouse hover) */}
          {heroHasVideo && heroHv.mounted && (
            <video
              ref={heroHv.videoRef}
              src={heroImage!.videoUrl}
              onPlaying={heroHv.onPlaying}
              className={`absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-[opacity,transform] duration-700 ease-out pointer-events-none ${heroHv.hovered && heroHv.playing ? "opacity-100" : "opacity-0"
                }`}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
          )}

          {/* Text overlay directly on photo with luminous high-contrast text-shadow */}
          {showOverlayText && (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-end pb-14 sm:pb-18 px-6 text-center z-10 pointer-events-none"
              style={{ y: textY, opacity: textOpacity }}
            >
              <motion.h1
                className="font-serif text-[30px] sm:text-[44px] md:text-[54px] font-black text-white tracking-[0.08em] leading-[1.15] mb-2 [text-shadow:_0_2px_4px_rgba(0,0,0,0.9),_0_4px_16px_rgba(0,0,0,1),_0_0_30px_rgba(0,0,0,0.95)]"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                {t("hero.title")}
              </motion.h1>

              <motion.p
                className="font-serif text-[18px] sm:text-[22px] md:text-[26px] font-bold text-[#FFE8A3] tracking-[0.1em] mb-3 [text-shadow:_0_2px_4px_rgba(0,0,0,0.9),_0_4px_14px_rgba(0,0,0,1),_0_0_24px_rgba(0,0,0,0.95)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                {t("hero.subtitle")}
              </motion.p>

              <motion.div
                className="text-[14px] sm:text-[16px] md:text-[17px] text-white font-semibold leading-[1.8] max-w-4xl [text-shadow:_0_1px_3px_rgba(0,0,0,0.95),_0_3px_10px_rgba(0,0,0,1),_0_0_20px_rgba(0,0,0,0.95)] flex flex-col items-center"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                {t("hero.description")
                  .split("\n")
                  .map((line, idx) => (
                    <span key={idx} className="block md:whitespace-nowrap">
                      {line}
                    </span>
                  ))}
              </motion.div>
            </motion.div>
          )}

          {/* Scroll indicator */}
          {showOverlayText && (
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
          )}
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
                className="hero-row flex gap-3 sm:gap-4 justify-start py-2"
                style={{ alignItems: "stretch" }}
              >
                {rowItems.map((item: MasonryItem) => {
                  const currentImage = masonryImages[item.tileIdx];

                  const colWidthClass =
                    item.targetCols === 4
                      ? "w-[calc((100%-3*0.75rem)/4)] sm:w-[calc((100%-3*1rem)/4)] flex-[0_0_calc((100%-3*0.75rem)/4)] sm:flex-[0_0_calc((100%-3*1rem)/4)]"
                      : item.targetCols === 3
                        ? "w-[calc((100%-2*0.75rem)/3)] sm:w-[calc((100%-2*1rem)/3)] flex-[0_0_calc((100%-2*0.75rem)/3)] sm:flex-[0_0_calc((100%-2*1rem)/3)]"
                        : item.targetCols === 2
                          ? "w-[calc((100%-0.75rem)/2)] sm:w-[calc((100%-1rem)/2)] flex-[0_0_calc((100%-0.75rem)/2)] sm:flex-[0_0_calc((100%-1rem)/2)]"
                          : "w-full flex-[0_0_100%]";

                  return (
                    <div
                      key={item.tileIdx}
                      className={`flex justify-center relative hover:z-30 ${colWidthClass}`}
                      style={{ minWidth: 0 }}
                    >
                      <GridTile
                        image={currentImage}
                        index={item.tileIdx}
                        fallbackColor={PLACEHOLDER_COLORS[item.tileIdx % PLACEHOLDER_COLORS.length]}
                        aspect={item.aspect}
                        maxHeight={item.maxHeight}
                        minHeight={item.minHeight}
                        sizes={
                          item.targetCols === 4
                            ? "25vw"
                            : item.targetCols === 3
                              ? "34vw"
                              : item.targetCols === 2
                                ? "50vw"
                                : "100vw"
                        }
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

