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
    <section id="qa" className="section-noise py-20 lg:py-28 bg-[#f8f9fa] border-t border-gray-200/70">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-14">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#111] tracking-tight uppercase font-sans">
            FAQ
          </h2>
          <p className="text-[21px] sm:text-[23px] text-gray-800 font-semibold tracking-wide mt-2.5">
            {locale === "ja" ? "よくある質問" : "Frequently Asked Questions"}
          </p>
        </FadeIn>

        <div className="space-y-3.5">
          {displayed.map((item, i) => {
            const question = locale === "ja" ? item.questionJa || item.question : item.question;
            const answer = locale === "ja" ? item.answerJa || item.answer : item.answer;
            const isOpen = openId === item.id;

            return (
              <FadeIn key={item.id} delay={i * 0.04}>
                <div
                  onMouseEnter={() => setOpenId(item.id)}
                  className={`border rounded-2xl overflow-hidden bg-white transition-all duration-300 ${
                    isOpen
                      ? "border-[#b8935a]/50 shadow-lg ring-2 ring-[#b8935a]/10"
                      : "border-gray-200/80 shadow-sm hover:border-gray-300"
                  }`}
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer"
                  >
                    <span className={`font-semibold text-sm sm:text-base transition-colors ${isOpen ? "text-[#111]" : "text-black"}`}>
                      {question}
                    </span>
                    <span className={`shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all ${isOpen ? "border-[#111] bg-[#111]" : "border-gray-200 bg-gray-50"}`}>
                      {isOpen
                        ? <Minus size={13} className="text-white" />
                        : <Plus size={13} className="text-black" />
                      }
                    </span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="px-5 sm:px-6 pb-6 text-sm sm:text-[15px] text-black leading-relaxed border-t border-gray-100 pt-4 font-normal">
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
              href={`/${locale}/contact#qa`}
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
