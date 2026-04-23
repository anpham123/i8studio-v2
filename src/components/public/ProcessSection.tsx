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
    <section id="process" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
            {t("title")}
          </h2>
        </FadeIn>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-px bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-purple-500/0" />

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const stepKey = step.key as "inquiry" | "consultation" | "production" | "review" | "delivery";
              return (
                <FadeIn key={step.key} delay={i * 0.1} className="text-center">
                  <div className="relative flex flex-col items-center">
                    {/* Number */}
                    <div className="text-xs font-bold text-blue-400/50 mb-2">
                      0{i + 1}
                    </div>
                    {/* Icon circle */}
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center mb-4 relative z-10">
                      <Icon size={28} className="text-blue-400" />
                    </div>
                    <h3 className="text-white font-bold mb-2">
                      {t(`steps.${stepKey}.title`)}
                    </h3>
                    <p className="text-white/50 text-sm leading-relaxed">
                      {t(`steps.${stepKey}.desc`)}
                    </p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <FadeIn className="text-center mt-14">
          <Link
            href={`/${locale}/contact`}
            className="btn-gradient inline-flex items-center gap-2 px-8 py-4 text-base"
          >
            {t("cta")}
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
