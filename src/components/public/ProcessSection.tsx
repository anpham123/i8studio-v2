"use client";

import { Send, MessageSquare, Clapperboard, FileCheck, Package } from "lucide-react";
import FadeIn from "./FadeIn";
import { useTranslations } from "next-intl";
import Link from "next/link";

const STEP_ICONS = [Send, MessageSquare, Clapperboard, FileCheck, Package];
const STEP_KEYS = ["inquiry", "consultation", "production", "review", "delivery"] as const;

export default function ProcessSection({ locale }: { locale: string }) {
  const t = useTranslations("process");

  return (
    <section className="section-noise py-20 lg:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Workflow
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 font-serif">
            {t("title")}
          </h2>
        </FadeIn>

        {/* Desktop: Horizontal steps with connecting line */}
        <div className="hidden lg:block relative mb-16">
          {/* Connecting line */}
          <div className="absolute top-10 left-[10%] right-[10%] h-px bg-gray-200" />
          <FadeIn>
            <div className="absolute top-10 left-[10%] right-[10%] h-px bg-gradient-to-r from-blue-500 to-purple-600 origin-left scale-x-0 animate-[line-grow_1.5s_ease-out_0.8s_forwards]" />
          </FadeIn>

          <div className="grid grid-cols-5 relative z-10">
            {STEP_KEYS.map((key, i) => {
              const Icon = STEP_ICONS[i];
              return (
                <FadeIn key={key} delay={0.1 + i * 0.12}>
                  <div className="flex flex-col items-center text-center">
                    {/* Circle with icon */}
                    <div className="w-20 h-20 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center mb-5 shadow-sm group-hover:border-blue-300 transition-colors relative">
                      <Icon size={24} className="text-gray-600" />
                      {/* Step number */}
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </div>
                    </div>
                    <h3 className="text-gray-900 font-bold text-sm mb-1">
                      {t(`steps.${key}.title`)}
                    </h3>
                    <p className="text-gray-500 text-xs leading-relaxed max-w-[140px]">
                      {t(`steps.${key}.desc`)}
                    </p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>

        {/* Mobile: Vertical steps */}
        <div className="lg:hidden space-y-0 mb-12">
          {STEP_KEYS.map((key, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <FadeIn key={key} delay={i * 0.08}>
                <div className="flex gap-5">
                  {/* Vertical line + circle */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center shrink-0 shadow-sm relative">
                      <Icon size={18} className="text-gray-600" />
                      <div className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-gray-900 text-white text-[10px] font-bold flex items-center justify-center">
                        {i + 1}
                      </div>
                    </div>
                    {i < STEP_KEYS.length - 1 && (
                      <div className="w-px h-12 bg-gray-200 my-1" />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pt-2 pb-6">
                    <h3 className="text-gray-900 font-bold text-sm">
                      {t(`steps.${key}.title`)}
                    </h3>
                    <p className="text-gray-500 text-xs mt-1">{t(`steps.${key}.desc`)}</p>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* CTA */}
        <FadeIn className="text-center">
          <Link
            href={`/${locale}/contact`}
            className="btn-gradient inline-flex items-center gap-2"
          >
            {t("cta")}
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
