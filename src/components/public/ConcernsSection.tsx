import Link from "next/link";
import { AlertCircle, Clock, MessageCircleX, RotateCcw, ArrowDown } from "lucide-react";
import FadeIn from "./FadeIn";
import { useTranslations } from "next-intl";

const concernIcons = [AlertCircle, Clock, MessageCircleX, RotateCcw];

export default function ConcernsSection({ locale }: { locale: string }) {
  const t = useTranslations("concerns");

  const concerns = [
    { key: "quality", icon: concernIcons[0] },
    { key: "deadline", icon: concernIcons[1] },
    { key: "communication", icon: concernIcons[2] },
    { key: "revisions", icon: concernIcons[3] },
  ];

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            {t("title")}
          </h2>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {concerns.map((concern, i) => {
            const Icon = concern.icon;
            const key = concern.key as "quality" | "deadline" | "communication" | "revisions";
            return (
              <FadeIn key={concern.key} delay={i * 0.1}>
                <div className="card-glass p-6 text-center hover:border-red-500/20 transition-colors">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <Icon size={22} className="text-red-400" />
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {t(`items.${key}`)}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* Arrow down */}
        <FadeIn className="flex justify-center mb-8">
          <div className="flex flex-col items-center gap-1 text-white/30">
            <ArrowDown size={20} className="animate-bounce" />
          </div>
        </FadeIn>

        {/* CTA */}
        <FadeIn className="text-center">
          <div className="max-w-xl mx-auto card-glass p-8 border-blue-500/20">
            <p className="text-white/80 text-lg mb-6">{t("cta")}</p>
            <Link
              href={`/${locale}/contact`}
              className="btn-gradient inline-flex items-center gap-2 px-8 py-4 text-base"
            >
              {t("ctaButton")}
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
