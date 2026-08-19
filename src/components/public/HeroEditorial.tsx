"use client";

import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */
interface HeroImage {
  url: string;
  alt: string;
}

interface HeroEditorialProps {
  images?: HeroImage[];
  limit?: number;
}

interface MasonryItem {
  flex: number;
  aspect: string;
  maxHeight?: string;
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
 * Masonry layout definition:
 * Each row defines its items with flex ratios + aspect ratios
 * to create an editorial, varied-height grid.
 */
const MASONRY_ROWS = [
  // Block 1 (Rows 1-6)
  [
    { flex: 1, aspect: "3/5" },
    { flex: 1, aspect: "3/5" },
    { flex: 1, aspect: "3/5" },
    { flex: 1, aspect: "3/5" },
  ],
  [
    { flex: 1, aspect: "21/9", maxHeight: "70vh" },
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

  // Block 2 (Rows 7-12)
  [
    { flex: 1, aspect: "3/5" },
    { flex: 1, aspect: "3/5" },
    { flex: 1, aspect: "3/5" },
    { flex: 1, aspect: "3/5" },
  ],
  [
    { flex: 1, aspect: "21/9", maxHeight: "70vh" },
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

  // Block 3 (Rows 13-18)
  [
    { flex: 1, aspect: "3/5" },
    { flex: 1, aspect: "3/5" },
    { flex: 1, aspect: "3/5" },
    { flex: 1, aspect: "3/5" },
  ],
  [
    { flex: 1, aspect: "21/9", maxHeight: "70vh" },
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
function GridTile({
  image,
  index,
  fallbackColor,
  aspect,
  maxHeight,
}: {
  image?: HeroImage;
  index: number;
  fallbackColor: string;
  aspect: string;
  maxHeight?: string;
}) {
  const hasImage = image?.url;

  return (
    <motion.div
      className="relative overflow-hidden rounded-[3px] w-full"
      style={{
        aspectRatio: aspect,
        maxHeight: maxHeight || undefined,
      }}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.7,
        delay: 0.6 + index * 0.05,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
    >
      {hasImage ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={image.url}
          alt={image.alt}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
          loading={index < 6 ? "eager" : "lazy"}
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      ) : (
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out hover:scale-105"
          style={{ backgroundColor: fallbackColor }}
        />
      )}
      {/* Subtle hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function HeroEditorial({ images = [], limit = 11 }: HeroEditorialProps) {
  const t = useTranslations("home");
  const sectionRef = useRef<HTMLElement>(null);

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

  // Determine active rows dynamically (limit - 1 because hero uses 1 image)
  const masonryLimit = Math.max(0, limit - 1);
  let cumulativeItems = 0;
  let rowCount = 0;
  for (let i = 0; i < MASONRY_ROWS.length; i++) {
    cumulativeItems += MASONRY_ROWS[i].length;
    rowCount = i + 1;
    if (cumulativeItems >= masonryLimit) {
      break;
    }
  }
  const activeRows = MASONRY_ROWS.slice(0, rowCount);

  return (
    <section ref={sectionRef} id="hero-section" className="bg-white relative overflow-hidden">
      {/* ========== FULL-VIEWPORT HERO ========== */}
      <div className="relative w-full" style={{ height: 'calc(100vh - var(--header-h, 76px))' }}>
        {/* Hero image */}
        {heroImage?.url ? (
          <motion.img
            src={heroImage.url}
            alt={heroImage.alt}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.21, 0.47, 0.32, 0.98] }}
          />
        ) : (
          <div className="absolute inset-0 bg-[#c8c2b8]" />
        )}

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

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

      {/* ========== MASONRY GRID ========== */}
      <div className="w-full px-0 py-2">
        <div className="flex flex-col gap-2">
          {activeRows.map((row, rowIdx) => {
            const rowItems = row.map((item) => {
              const currentIndex = tileIndex;
              tileIndex++;
              return { ...item, tileIdx: currentIndex };
            });

            return (
              <div key={rowIdx} className="flex gap-2 justify-center" style={{ alignItems: "stretch" }}>
                {rowItems.map((item: MasonryItem) => (
                  <div
                    key={item.tileIdx}
                    className="flex justify-center"
                    style={{ flex: item.flex, minWidth: 0 }}
                  >
                    <GridTile
                      image={masonryImages[item.tileIdx]}
                      index={item.tileIdx}
                      fallbackColor={PLACEHOLDER_COLORS[item.tileIdx % PLACEHOLDER_COLORS.length]}
                      aspect={item.aspect}
                      maxHeight={item.maxHeight}
                    />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

