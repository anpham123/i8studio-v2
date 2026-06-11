"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
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

interface InsightsPageProps {
  flipbooks: Flipbook[];
  locale: string;
}

export default function InsightsPage({ flipbooks, locale }: InsightsPageProps) {
  const [activeBook, setActiveBook] = useState<Flipbook | null>(null);
  const [subForm, setSubForm] = useState({ firstName: "", lastName: "", email: "" });
  const [subStatus, setSubStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const t = useTranslations("insights");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubStatus("sending");
    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: subForm.email,
          name: `${subForm.firstName} ${subForm.lastName}`.trim(),
          source: "INSIGHTS",
        }),
      });
      if (res.ok) {
        setSubStatus("success");
        setSubForm({ firstName: "", lastName: "", email: "" });
      } else {
        setSubStatus("error");
      }
    } catch {
      setSubStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page title */}
      <FadeIn>
        <div className="text-center pt-16 pb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif">
            i8 Insights
          </h1>
        </div>
      </FadeIn>

      {/* Main content: 2-column layout like PEDI */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-[1fr_380px] gap-12 lg:gap-16">

          {/* LEFT: Flipbook covers grid */}
          <div>
            {flipbooks.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <svg className="w-20 h-20 mx-auto mb-4 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="text-sm">No publications available yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {flipbooks.map((book, i) => {
                  const title = locale === "ja" ? book.titleJa || book.title : book.title;

                  return (
                    <FadeIn key={book.id} delay={i * 0.06}>
                      <button
                        onClick={() => setActiveBook(book)}
                        className="group w-full text-left"
                      >
                        {/* Cover image — portrait aspect like a magazine */}
                        <div className="relative aspect-video bg-gray-100 border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group-hover:-translate-y-1">
                          {book.coverImage ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={book.coverImage}
                              alt={title}
                              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                              <svg className="w-12 h-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            </div>
                          )}

                          {/* Hover overlay with "Read" button */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="bg-white text-gray-900 text-xs font-bold px-5 py-2 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                              {t("readNow")}
                            </span>
                          </div>
                        </div>

                        {/* Title below cover */}
                        <p className="mt-3 text-sm font-medium text-gray-700 text-center line-clamp-2 group-hover:text-gray-900 transition-colors">
                          {title}
                        </p>
                      </button>
                    </FadeIn>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: Description + Subscribe form */}
          <FadeIn direction="right" delay={0.2}>
            <div className="lg:sticky lg:top-[120px]">
              {/* Description */}
              <div className="mb-8">
                <p className="text-gray-500 text-[15px] leading-relaxed">
                  {t("description")}
                </p>
              </div>

              {/* Subscribe form */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="text-gray-900 font-bold text-base mb-5">{t("subscribe")}</h3>

                {subStatus === "success" ? (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-green-700 font-medium text-sm">{t("subscribeSuccess")}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">{t("firstName")}</label>
                      <input
                        type="text"
                        value={subForm.firstName}
                        onChange={(e) => setSubForm({ ...subForm, firstName: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300 transition-colors bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">{t("lastName")}</label>
                      <input
                        type="text"
                        value={subForm.lastName}
                        onChange={(e) => setSubForm({ ...subForm, lastName: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300 transition-colors bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Email *</label>
                      <input
                        type="email"
                        required
                        value={subForm.email}
                        onChange={(e) => setSubForm({ ...subForm, email: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300 transition-colors bg-white"
                      />
                    </div>

                    <p className="text-gray-400 text-[11px] leading-relaxed">
                      {t("privacyNote")}
                    </p>

                    {subStatus === "error" && (
                      <p className="text-red-500 text-xs">{t("subscribeError")}</p>
                    )}

                    <button
                      type="submit"
                      disabled={subStatus === "sending"}
                      className="w-full bg-gray-900 text-white font-semibold py-2.5 rounded-lg hover:bg-gray-800 transition-colors text-sm disabled:opacity-60"
                    >
                      {subStatus === "sending" ? "..." : t("subscribeButton")}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Flipbook modal */}
      <AnimatePresence>
        {activeBook && (
          <FlipbookViewer
            pdfUrl={activeBook.pdfUrl}
            title={locale === "ja" ? activeBook.titleJa || activeBook.title : activeBook.title}
            onClose={() => setActiveBook(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
