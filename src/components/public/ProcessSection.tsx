import Link from "next/link";
import { MessageSquare, Users, Cpu, CheckCircle, Package } from "lucide-react";
import FadeIn from "./FadeIn";
import { useTranslations } from "next-intl";

const stepIcons = [MessageSquare, Users, Cpu, CheckCircle, Package];

export default function ProcessSection({ locale }: { locale: string }) {
  const t = useTranslations("process");

  const steps = [
    { key: "inquiry", icon: stepIcons[0] },
    { key: "consultation", icon: stepIcons[1] },
    { key: "production", icon: stepIcons[2] },
    { key: "review", icon: stepIcons[3] },
    { key: "delivery", icon: stepIcons[4] },
  ];

  return (
    <section id="process" className="section-noise py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Our Process
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 font-serif">
            {t("title")}
          </h2>
        </FadeIn>

        <div className="relative">
          {/* Connecting dashed line (desktop) */}
          <div className="hidden lg:block absolute top-[38px] left-[12%] right-[12%] h-px border-t border-dashed border-gray-200 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const stepKey = step.key as "inquiry" | "consultation" | "production" | "review" | "delivery";
              return (
                <FadeIn key={step.key} delay={i * 0.1}>
                  <div className="flex flex-col items-center text-center group">
                    {/* Step number + icon */}
                    <div className="relative z-10 mb-5">
                      <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center group-hover:border-blue-200 group-hover:shadow-md transition-all duration-300">
                        <Icon size={24} className="text-gray-700 group-hover:text-blue-600 transition-colors duration-300" />
                      </div>
                      <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gray-900 text-white text-[10px] font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1.5">
                      {t(`steps.${stepKey}.title`)}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed max-w-[140px]">
                      {t(`steps.${stepKey}.desc`)}
                    </p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>

        <FadeIn className="text-center mt-14">
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 bg-gray-900 text-white font-semibold px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors text-base"
          >
            {t("cta")}
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
