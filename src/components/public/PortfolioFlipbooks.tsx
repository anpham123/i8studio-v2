"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";

const FlipbookViewer = dynamic(() => import("./FlipbookViewer"), {
  ssr: false,
  loading: () => null,
});

interface FlipbookItem {
  id: string;
  title: string;
  titleJa: string;
  description: string;
  descriptionJa: string;
  coverImage: string;
  pdfUrl: string;
}

interface Props {
  flipbooks: FlipbookItem[];
  isJa: boolean;
  hasPortfolios: boolean;
}

const JAP_TITLE_MAP: Record<string, string> = {
  "Apartment Porfolio": "集合住宅 ポートフォリオ",
  "Apartment Portfolio": "集合住宅 ポートフォリオ",
  "Porfolio Resort - Hotel": "宿泊施設・リゾート ポートフォリオ",
  "Portfolio Resort - Hotel": "宿泊施設・リゾート ポートフォリオ",
  "Townhouse Portfolio": "住宅 ポートフォリオ",
};

function getCardDetails(fb: FlipbookItem, isJa: boolean) {
  const cleanEnglish = fb.title
    .replace(/porfolio|portfolio/gi, "")
    .replace(/^[-_\s]+|[-_\s]+$/g, "")
    .trim()
    .toUpperCase() || fb.title.toUpperCase();

  let locationTag = "ARCHITECTURE";
  let status = "EXCLUSIVE";

  if (/apartment/i.test(fb.title)) {
    locationTag = "TOKYO / RESIDENTIAL";
    status = "EXCLUSIVE";
  } else if (/resort|hotel/i.test(fb.title)) {
    locationTag = "HOSPITALITY / RESORT";
    status = "EXCLUSIVE";
  } else if (/townhouse|house/i.test(fb.title)) {
    locationTag = "RESIDENTIAL / VILLA";
    status = "EXCLUSIVE";
  }

  const subTitle = isJa
    ? (fb.titleJa || JAP_TITLE_MAP[fb.title] || fb.title)
    : (fb.title || fb.description);

  return {
    bigTitle: cleanEnglish,
    locationTag,
    subTitle,
    status,
  };
}

export default function PortfolioFlipbooks({ flipbooks, isJa, hasPortfolios }: Props) {
  const [activeBook, setActiveBook] = useState<FlipbookItem | null>(null);

  if (flipbooks.length === 0) return null;

  const gridColsCls =
    flipbooks.length === 1
      ? "grid-cols-1 max-w-xl mx-auto"
      : flipbooks.length === 2
      ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-8"
      : flipbooks.length === 3
      ? "grid-cols-1 md:grid-cols-3 w-full gap-6 md:gap-8 xl:gap-10"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full gap-5 md:gap-6 xl:gap-8";

  return (
    <>
      <section className={`py-16 md:py-24 ${hasPortfolios ? "bg-[#fafaf8] border-t border-gray-100" : "bg-white"}`}>
        <div className="max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12">
          {/* ── Centered Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <p className="text-[13px] sm:text-[14px] uppercase tracking-[0.25em] text-[#b8935a] font-bold mb-2.5">
              {isJa ? "資料・ドキュメント" : "DOCUMENTS"}
            </p>
            <h2
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#111] tracking-tight"
              style={{ fontFamily: "var(--font-noto-serif), serif" }}
            >
              {isJa ? "ポートフォリオ PDF" : "Portfolio PDF"}
            </h2>
            <p className="text-gray-500 text-sm sm:text-[15px] mt-3 max-w-xl mx-auto">
              {isJa
                ? "各カテゴリのポートフォリオPDFをご覧いただけます。"
                : "Browse our portfolio PDFs for each project category."}
            </p>
          </motion.div>

          {/* ── Wide Full-Spread Grid with Large Immersive Cards ── */}
          <div className={`grid ${gridColsCls}`}>
            {flipbooks.map((fb, idx) => {
              const details = getCardDetails(fb, isJa);
              return (
                <motion.div
                  key={fb.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col"
                >
                  <button
                    onClick={() => setActiveBook(fb)}
                    className="group text-left w-full flex flex-col cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#b8935a]"
                  >
                    {/* 1. Large Image Container with Headline Overlay */}
                    <div className="relative w-full aspect-[4/3.2] rounded-2xl md:rounded-[22px] overflow-hidden bg-neutral-900 shadow-md transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-1.5">
                      {fb.coverImage ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={fb.coverImage}
                          alt={details.subTitle}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                        />
                      ) : (
                        <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                          <span className="text-white/40 text-xs font-mono uppercase">PDF Document</span>
                        </div>
                      )}

                      {/* Vignette / Contrast Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-black/40 group-hover:via-black/30 transition-all duration-300" />

                      {/* Prominent Overlay Title (RUSUTSU / THE NIGO HOUSE / NATURE WITHIN / MASU style) */}
                      <div className="absolute inset-x-0 top-0 pt-7 sm:pt-9 px-4 flex items-start justify-center text-center pointer-events-none">
                        <h3
                          className="text-white font-extrabold text-2xl sm:text-3xl md:text-3xl lg:text-[28px] xl:text-[34px] uppercase tracking-wide leading-tight drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)] line-clamp-2"
                          style={{ fontFamily: "var(--font-outfit), var(--font-display), sans-serif" }}
                        >
                          {details.bigTitle}
                        </h3>
                      </div>

                      {/* Hover Read Indicator Pill */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <span className="bg-white/95 backdrop-blur-sm text-neutral-900 text-xs sm:text-sm font-bold px-6 py-3 rounded-full shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          {isJa ? "PDFを閲覧" : "View PDF"}
                        </span>
                      </div>
                    </div>

                    {/* 2. Text Info Area Below Image */}
                    <div className="mt-4 space-y-1.5 px-0.5">
                      {/* Line 1: Location / Tag */}
                      <p className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-neutral-800">
                        {details.locationTag}
                      </p>

                      {/* Line 2: Japanese / Project Subtitle */}
                      <p
                        className="text-[14px] sm:text-[15px] font-medium text-neutral-700 leading-snug line-clamp-1 group-hover:text-[#b8935a] transition-colors duration-300"
                      >
                        {details.subTitle}
                      </p>

                      {/* Line 3: Status / Category Gold Tag */}
                      <p className="text-xs sm:text-[13px] font-semibold uppercase tracking-wider text-[#c5a666]">
                        {details.status}
                      </p>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Flipbook modal viewer */}
      <AnimatePresence>
        {activeBook && (
          <FlipbookViewer
            pdfUrl={activeBook.pdfUrl}
            title={isJa ? activeBook.titleJa || activeBook.title : activeBook.title}
            onClose={() => setActiveBook(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
