"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ArrowRight } from "lucide-react";
import FadeIn from "./FadeIn";
import { useTranslations } from "next-intl";

interface QAItem {
  id: string;
  question: string;
  questionJa: string;
  answer: string;
  answerJa: string;
}

interface QASectionProps {
  items: QAItem[];
  locale: string;
  preview?: boolean;
}

export default function QASection({ items, locale, preview = true }: QASectionProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const t = useTranslations("qa");

  const displayed = preview ? items.slice(0, 5) : items;

  return (
    <section id="qa" className="section-noise py-20 lg:py-28 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            FAQ
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 font-serif">
            {t("title")}
          </h2>
        </FadeIn>

        <div className="space-y-2">
          {displayed.map((item, i) => {
            const question = locale === "ja" ? item.questionJa || item.question : item.question;
            const answer = locale === "ja" ? item.answerJa || item.answer : item.answer;
            const isOpen = openId === item.id;

            return (
              <FadeIn key={item.id} delay={i * 0.05}>
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left"
                  >
                    <span className={`font-medium text-sm sm:text-base transition-colors ${isOpen ? "text-gray-900" : "text-gray-700"}`}>
                      {question}
                    </span>
                    <span className={`shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all ${isOpen ? "border-gray-900 bg-gray-900" : "border-gray-200 bg-white"}`}>
                      {isOpen
                        ? <Minus size={12} className="text-white" />
                        : <Plus size={12} className="text-gray-400" />
                      }
                    </span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                          {answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeIn>
            );
          })}
        </div>

        {preview && items.length > 5 && (
          <FadeIn className="text-center mt-8">
            <Link
              href={`/${locale}/qa`}
              className="inline-flex items-center gap-1 text-gray-900 hover:text-gray-600 font-medium transition-colors border-b border-gray-900 pb-0.5"
            >
              {t("viewMore")} <ArrowRight size={14} />
            </Link>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
