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
  const gridY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Flatten rows to get tile index mapping
  let tileIndex = 0;

  // Determine active rows dynamically by summing cumulative items until we reach limit
  let cumulativeItems = 0;
  let rowCount = 0;
  for (let i = 0; i < MASONRY_ROWS.length; i++) {
    cumulativeItems += MASONRY_ROWS[i].length;
    rowCount = i + 1;
    if (cumulativeItems >= limit) {
      break;
    }
  }
  const activeRows = MASONRY_ROWS.slice(0, rowCount);

  return (
    <section ref={sectionRef} id="hero-section" className="bg-white relative overflow-hidden">
      {/* ========== TEXT ========== */}
      <motion.div
        className="max-w-[800px] mx-auto text-center pt-[20px] pb-[16px] px-6"
        style={{ y: textY, opacity: textOpacity }}
      >
        <motion.h1
          className="font-serif text-[28px] sm:text-[32px] md:text-[36px] font-normal text-[#111] tracking-[0.05em] leading-[1.2] mb-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          {t("hero.title")}
        </motion.h1>

        <motion.p
          className="font-serif text-[14px] sm:text-[15px] md:text-[16px] font-light text-[#555] tracking-[0.08em] mb-2"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          {t("hero.subtitle")}
        </motion.p>

        <motion.p
          className="text-[11px] sm:text-[12px] text-[#888] leading-[1.6] max-w-[560px] mx-auto whitespace-pre-line"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          {t("hero.description")}
        </motion.p>
      </motion.div>

      {/* ========== MASONRY GRID ========== */}
      <motion.div
        className="w-full px-0 pb-4"
        style={{ y: gridY }}
      >
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
                      image={images[item.tileIdx]}
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
      </motion.div>
    </section>
  );
}
