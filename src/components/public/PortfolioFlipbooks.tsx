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

export default function PortfolioFlipbooks({ flipbooks, isJa, hasPortfolios }: Props) {
  const [activeBook, setActiveBook] = useState<FlipbookItem | null>(null);

  if (flipbooks.length === 0) return null;

  return (
    <>
      <section className={hasPortfolios ? "bg-[#fafaf8] border-t border-gray-100" : ""}>
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <p className="text-[17px] sm:text-[18px] uppercase tracking-[0.22em] text-[#b8935a] font-bold mb-3">
              {isJa ? "資料・ドキュメント" : "DOCUMENTS"}
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#111] tracking-wide" style={{ fontFamily: "var(--font-noto-serif), serif" }}>
              {isJa ? "ポートフォリオ PDF" : "Portfolio PDF"}
            </h2>
            <p className="text-gray-500 text-sm mt-3 max-w-lg mx-auto">
              {isJa
                ? "各カテゴリのポートフォリオPDFをご覧いただけます。"
                : "Browse our portfolio PDFs for each project category."}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {flipbooks.map((fb, idx) => {
              const fbTitle = isJa ? (fb.titleJa || JAP_TITLE_MAP[fb.title] || fb.title) : fb.title;
              const fbDesc = isJa ? (fb.descriptionJa || fb.description) : fb.description;
              return (
                <motion.div
                  key={fb.id}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.75, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="flex"
                >
                  {/* Card Lift & Scale Effect (Toàn bộ thẻ nhấc bổng & phóng lớn khi rê chuột) */}
                  <button
                    onClick={() => setActiveBook(fb)}
                    className="group block rounded-2xl overflow-hidden border border-gray-100 bg-white text-left w-full h-full shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.14)] hover:-translate-y-3 hover:scale-[1.03] transition-all duration-500 ease-out hover:border-[#b8935a]/50 ring-0 hover:ring-4 hover:ring-[#b8935a]/15 flex flex-col justify-between"
                  >
                    <div>
                      {/* Cover with Hover Zoom Effect (Ảnh bên trong phóng to mượt mà điện ảnh) */}
                      <div className="aspect-[4/3] bg-gradient-to-br from-[#1a1a2e] to-[#111] overflow-hidden relative">
                        {fb.coverImage ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={fb.coverImage}
                            alt={fbTitle}
                            className="w-full h-full object-cover group-hover:scale-112 transition-transform duration-700 ease-out"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" className="opacity-30">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                              <line x1="16" y1="13" x2="8" y2="13" />
                              <line x1="16" y1="17" x2="8" y2="17" />
                            </svg>
                          </div>
                        )}
                        {/* Cinematic dark gradient on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                          <span className="bg-white text-gray-900 text-xs font-bold px-6 py-2.5 rounded-full shadow-2xl transform translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                            {isJa ? "PDFを読む" : "Read Now"}
                          </span>
                        </div>
                        {/* PDF badge */}
                        <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md z-10">
                          PDF
                        </div>
                      </div>
                      {/* Info */}
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-[#111] mb-1.5 group-hover:text-[#b8935a] transition-colors duration-300">
                          {fbTitle}
                        </h3>
                        {fbDesc && <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{fbDesc}</p>}
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-0">
                      <span className="inline-flex items-center gap-1.5 text-[#b8935a] text-sm font-semibold group-hover:translate-x-1.5 transition-transform duration-300">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        {isJa ? "PDFを読む →" : "Read PDF →"}
                      </span>
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
