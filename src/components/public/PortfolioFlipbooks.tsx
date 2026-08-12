"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";

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

export default function PortfolioFlipbooks({ flipbooks, isJa, hasPortfolios }: Props) {
  const [activeBook, setActiveBook] = useState<FlipbookItem | null>(null);

  if (flipbooks.length === 0) return null;

  return (
    <>
      <section className={hasPortfolios ? "bg-[#fafaf8] border-t border-gray-100" : ""}>
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.25em] text-gray-400 mb-3">DOCUMENTS</p>
            <h2 className="text-2xl md:text-3xl font-light text-[#111]" style={{ fontFamily: "var(--font-noto-serif), serif" }}>
              {isJa ? "ポートフォリオ PDF" : "Portfolio PDF"}
            </h2>
            <p className="text-gray-500 text-sm mt-3 max-w-lg mx-auto">
              {isJa
                ? "各カテゴリのポートフォリオPDFをご覧いただけます。"
                : "Browse our portfolio PDFs for each project category."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {flipbooks.map((fb) => {
              const fbTitle = isJa ? (fb.titleJa || fb.title) : fb.title;
              const fbDesc = isJa ? (fb.descriptionJa || fb.description) : fb.description;
              return (
                <button
                  key={fb.id}
                  onClick={() => setActiveBook(fb)}
                  className="group block rounded-2xl overflow-hidden border border-gray-100 hover:border-[#b8935a]/30 hover:shadow-xl transition-all duration-300 bg-white text-left w-full"
                >
                  {/* Cover */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-[#1a1a2e] to-[#111] overflow-hidden relative">
                    {fb.coverImage ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={fb.coverImage}
                        alt={fbTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="bg-white text-gray-900 text-xs font-bold px-5 py-2 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                        {isJa ? "読む" : "Read Now"}
                      </span>
                    </div>
                    {/* PDF badge */}
                    <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">
                      PDF
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-5">
                    <h3 className="text-lg font-medium text-[#111] mb-1 group-hover:text-[#b8935a] transition-colors">
                      {fbTitle}
                    </h3>
                    {fbDesc && <p className="text-sm text-gray-500 line-clamp-2 mb-3">{fbDesc}</p>}
                    <span className="inline-flex items-center gap-1.5 text-[#b8935a] text-sm font-medium">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      {isJa ? "PDFを読む" : "Read PDF"}
                    </span>
                  </div>
                </button>
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
