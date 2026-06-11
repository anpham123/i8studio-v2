"use client";

import { AlertTriangle, Clock, Languages, RotateCw, ArrowDown } from "lucide-react";
import Link from "next/link";
import FadeIn from "./FadeIn";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const CONCERN_ICONS = [AlertTriangle, Clock, Languages, RotateCw];
const CONCERN_KEYS = ["quality", "deadline", "communication", "revisions"] as const;

export default function ConcernsSection({ locale }: { locale: string }) {
  const t = useTranslations("concerns");

  return (
    <section className="section-noise py-20 lg:py-28 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif">
            {t("title")}
          </h2>
        </FadeIn>

        {/* Concern cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {CONCERN_KEYS.map((key, i) => {
            const Icon = CONCERN_ICONS[i];
            return (
              <FadeIn key={key} delay={i * 0.08}>
                <div className="flex items-start gap-4 bg-red-50/60 border border-red-100 rounded-xl p-5 hover:bg-red-50 transition-colors">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                    <Icon size={18} className="text-red-400" />
                  </div>
                  <p className="text-gray-700 text-sm font-medium leading-relaxed pt-2">
                    {t(`items.${key}`)}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* Arrow animation */}
        <FadeIn className="flex justify-center mb-8">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown size={28} className="text-gray-300" />
          </motion.div>
        </FadeIn>

        {/* CTA */}
        <FadeIn className="text-center">
          <div className="bg-gray-900 rounded-2xl p-8 sm:p-10">
            <p className="text-white/80 text-base mb-5 leading-relaxed">
              {t("cta")}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="btn-gradient inline-flex items-center gap-2"
            >
              {t("ctaButton")}
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
