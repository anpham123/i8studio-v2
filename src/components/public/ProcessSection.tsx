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
    <section id="process" className="section-noise py-20 lg:py-28" style={{ backgroundColor: "#f0efe9" }}>
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
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-[52px] left-[10%] right-[10%] h-px bg-gray-300" />

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const stepKey = step.key as "inquiry" | "consultation" | "production" | "review" | "delivery";
              return (
                <FadeIn key={step.key} delay={i * 0.1} className="text-center">
                  <div className="relative flex flex-col items-center">
                    <div className="text-xs font-bold text-gray-300 mb-2 tracking-widest">
                      0{i + 1}
                    </div>
                    <div className="w-20 h-20 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-4 relative z-10 shadow-sm">
                      <Icon size={28} className="text-blue-600" />
                    </div>
                    <h3 className="text-gray-900 font-bold mb-2">
                      {t(`steps.${stepKey}.title`)}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
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
