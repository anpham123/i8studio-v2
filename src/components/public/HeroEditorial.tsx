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
 * Masonry block pattern (17 items per repeating cycle):
 * Row 1: 4 vertical cards (3:5)
 * Row 2: 1 full-screen cinematic banner (16:9)
 * Row 3-6: 3 widescreen cards per row (16:9)
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
    { targetCols: 3, aspect: "16/9" },
    { targetCols: 3, aspect: "16/9" },
    { targetCols: 3, aspect: "16/9" },
  ],
  [
    { targetCols: 3, aspect: "16/9" },
    { targetCols: 3, aspect: "16/9" },
    { targetCols: 3, aspect: "16/9" },
  ],
  [
    { targetCols: 3, aspect: "16/9" },
    { targetCols: 3, aspect: "16/9" },
    { targetCols: 3, aspect: "16/9" },
  ],
  [
    { targetCols: 3, aspect: "16/9" },
    { targetCols: 3, aspect: "16/9" },
    { targetCols: 3, aspect: "16/9" },
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
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const hasImage = Boolean(image?.url);
  const hasVideo = Boolean(image?.videoUrl && isVideoFile(image.videoUrl));
  const isFullScreenHeroType = Boolean(minHeight);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (hasVideo && videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsVideoPlaying(true))
          .catch(() => {});
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsVideoPlaying(false);
    if (hasVideo && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

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
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`group relative w-full h-full cursor-pointer rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-100 shadow-md ${
          isFullScreenHeroType
            ? "hover:opacity-95"
            : "transition-all duration-500 ease-out hover:scale-105 hover:-translate-y-3 hover:shadow-[0_25px_50px_rgba(0,0,0,0.35)] hover:z-30 border border-black/5"
        }`}
        style={{
          transformOrigin: "center center",
        }}
      >
        {/* Base Image Poster (always rendered if available) */}
        {hasImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={image!.url}
            alt={image!.alt || `Work ${index + 1}`}
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            loading={index < 6 ? "eager" : "lazy"}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: fallbackColor }}
          />
        )}

        {/* Hover Video: Only plays when user hovers mouse over the card */}
        {hasVideo && (
          <video
            ref={videoRef}
            src={image!.videoUrl}
            className={`absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-opacity duration-300 ${
              isHovered && isVideoPlaying ? "opacity-100" : "opacity-0"
            }`}
            muted
            loop
            playsInline
            preload="metadata"
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
  const [heroHovered, setHeroHovered] = useState(false);
  const [heroVideoPlaying, setHeroVideoPlaying] = useState(false);
  const heroVideoRef = useRef<HTMLVideoElement>(null);

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

  // Determine active rows dynamically to fit all uploaded masonry images (no limit)
  const totalMasonryCount = masonryImages.length;
  const activeRows: Array<Array<{ targetCols: number; aspect: string; minHeight?: string; maxHeight?: string }>> = [];
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
          onMouseEnter={() => {
            setHeroHovered(true);
            if (heroImage?.videoUrl && isVideoFile(heroImage.videoUrl) && heroVideoRef.current) {
              heroVideoRef.current.currentTime = 0;
              const playPromise = heroVideoRef.current.play();
              if (playPromise !== undefined) {
                playPromise.then(() => setHeroVideoPlaying(true)).catch(() => {});
              }
            }
          }}
          onMouseLeave={() => {
            setHeroHovered(false);
            setHeroVideoPlaying(false);
            if (heroImage?.videoUrl && isVideoFile(heroImage.videoUrl) && heroVideoRef.current) {
              heroVideoRef.current.pause();
              heroVideoRef.current.currentTime = 0;
            }
          }}
          className="relative w-full h-full rounded-2xl overflow-hidden cursor-pointer group"
        >
          {/* Base Hero Image */}
          {heroImage?.url ? (
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

          {/* Hover Video Preview for Hero */}
          {heroImage?.videoUrl && isVideoFile(heroImage.videoUrl) && (
            <video
              ref={heroVideoRef}
              src={heroImage.videoUrl}
              className={`absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out pointer-events-none ${
                heroHovered && heroVideoPlaying ? "opacity-100" : "opacity-0"
              }`}
              muted
              loop
              playsInline
              preload="metadata"
            />
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
              className="font-serif text-[17px] sm:text-[20px] md:text-[22px] font-medium text-white/95 tracking-[0.08em] mb-3 drop-shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.p
              className="text-[15px] sm:text-[16px] md:text-[17px] text-white/90 leading-[1.8] max-w-[720px] whitespace-pre-line drop-shadow-sm font-normal"
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

