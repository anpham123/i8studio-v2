"use client";

import { useTranslations } from "next-intl";
import FadeIn from "./FadeIn";

interface StepData {
  title: string;
  description: string;
}

export default function WorkflowSection() {
  const t = useTranslations("about");
  const steps = t.raw("workflow.steps") as StepData[];

  return (
    <section className="py-20 lg:py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <FadeIn className="text-center mb-16">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Process
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 font-serif mb-3">
            {t("workflow.title")}
          </h2>
          <p className="text-gray-500 text-base">
            {t("workflow.subtitle")}
          </p>
        </FadeIn>

        {/* Desktop: Horizontal steps */}
        <div className="hidden md:flex items-start justify-center gap-0">
          {steps.map((step, i) => (
            <FadeIn key={i} delay={i * 0.1} className="flex items-start">
              {/* Step */}
              <div className="flex flex-col items-center text-center" style={{ width: 160 }}>
                {/* Circle */}
                <div className="w-[60px] h-[60px] rounded-full border border-[#111] flex items-center justify-center mb-4 relative">
                  <span className="text-[18px] font-semibold text-[#111]">{String(i + 1).padStart(2, "0")}</span>
                </div>
                {/* Title */}
                <div className="text-[14px] font-medium text-[#111] mb-1">{step.title}</div>
                {/* Description */}
                <div className="text-[13px] text-[#666] leading-[1.6] px-1">{step.description}</div>
              </div>

              {/* Arrow between steps */}
              {i < steps.length - 1 && (
                <div className="flex items-center pt-[18px] px-2">
                  <svg width="32" height="16" viewBox="0 0 32 16" fill="none" className="text-[#ccc]">
                    <path d="M0 8h28M22 2l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </FadeIn>
          ))}
        </div>

        {/* Mobile: Vertical steps */}
        <div className="md:hidden space-y-0">
          {steps.map((step, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div className="flex flex-col items-center text-center">
                {/* Circle */}
                <div className="w-[52px] h-[52px] rounded-full border border-[#111] flex items-center justify-center mb-3">
                  <span className="text-[16px] font-semibold text-[#111]">{String(i + 1).padStart(2, "0")}</span>
                </div>
                {/* Title */}
                <div className="text-[14px] font-medium text-[#111] mb-1">{step.title}</div>
                {/* Description */}
                <div className="text-[13px] text-[#666] leading-[1.6] max-w-[240px] mx-auto">{step.description}</div>

                {/* Down arrow */}
                {i < steps.length - 1 && (
                  <div className="py-4">
                    <svg width="16" height="24" viewBox="0 0 16 24" fill="none" className="text-[#ccc]">
                      <path d="M8 0v20M2 14l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
