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
    <section id="qa" className="py-20 lg:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            {t("title")}
          </h2>
        </FadeIn>

        <div className="space-y-3">
          {displayed.map((item, i) => {
            const question = locale === "ja" ? item.questionJa || item.question : item.question;
            const answer = locale === "ja" ? item.answerJa || item.answer : item.answer;
            const isOpen = openId === item.id;

            return (
              <FadeIn key={item.id} delay={i * 0.05}>
                <div className="card-glass overflow-hidden">
                  <button
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left"
                  >
                    <span className={`font-medium text-sm sm:text-base transition-colors ${isOpen ? "text-blue-400" : "text-white/90"}`}>
                      {question}
                    </span>
                    <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${isOpen ? "bg-blue-500" : "bg-white/10"}`}>
                      {isOpen ? <Minus size={12} className="text-white" /> : <Plus size={12} className="text-white/70" />}
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
                        <div className="px-5 pb-5 text-white/60 text-sm leading-relaxed border-t border-white/5 pt-4">
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
              className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              {t("viewMore")} <ArrowRight size={14} />
            </Link>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
