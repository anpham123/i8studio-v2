"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import FadeIn from "./FadeIn";

// Load FlipbookViewer only on the client — it needs browser APIs (canvas, workers)
const FlipbookViewer = dynamic(() => import("./FlipbookViewer"), {
  ssr: false,
  loading: () => null,
});

interface Flipbook {
  id: string;
  title: string;
  titleJa: string;
  description: string;
  descriptionJa: string;
  coverImage: string;
  pdfUrl: string;
}

interface InsightsGridProps {
  flipbooks: Flipbook[];
  locale: string;
}

export default function InsightsGrid({ flipbooks, locale }: InsightsGridProps) {
  const [activeBook, setActiveBook] = useState<Flipbook | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {flipbooks.map((book, i) => {
          const title = locale === "ja" ? book.titleJa || book.title : book.title;
          const description =
            locale === "ja" ? book.descriptionJa || book.description : book.description;

          return (
            <FadeIn key={book.id} delay={i * 0.08}>
              <div className="group bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-blue-500/30 transition-colors duration-300">
                {/* Cover */}
                <div className="aspect-[3/4] overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-500/10 relative">
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        className="w-16 h-16 text-white/10"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={0.5}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                    <button
                      onClick={() => setActiveBook(book)}
                      className="bg-white text-gray-900 text-sm font-bold px-6 py-2.5 rounded-full shadow-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                    >
                      Read Now
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <h2 className="text-white font-semibold text-lg mb-1 leading-snug">
                    {title}
                  </h2>
                  {description && (
                    <p className="text-white/50 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {description}
                    </p>
                  )}
                  <button
                    onClick={() => setActiveBook(book)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-purple-500 transition-all"
                  >
                    Read Now
                  </button>
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>

      {/* Flipbook modal — mounted dynamically, no SSR */}
      {activeBook && (
        <FlipbookViewer
          pdfUrl={activeBook.pdfUrl}
          title={locale === "ja" ? activeBook.titleJa || activeBook.title : activeBook.title}
          onClose={() => setActiveBook(null)}
        />
      )}
    </>
  );
}
