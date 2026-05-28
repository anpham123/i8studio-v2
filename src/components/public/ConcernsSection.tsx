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
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Common Concerns
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
            {t("title")}
          </h2>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {concerns.map((concern, i) => {
            const Icon = concern.icon;
            const key = concern.key as "quality" | "deadline" | "communication" | "revisions";
            return (
              <FadeIn key={concern.key} delay={i * 0.1}>
                <div className="border border-gray-200 rounded-xl p-6 text-center hover:border-gray-300 hover:shadow-sm transition-all bg-white">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
                    <Icon size={22} className="text-red-400" />
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {t(`items.${key}`)}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* Arrow down */}
        <FadeIn className="flex justify-center mb-8">
          <div className="flex flex-col items-center gap-1 text-gray-300">
            <ArrowDown size={20} className="animate-bounce" />
          </div>
        </FadeIn>

        {/* CTA */}
        <FadeIn className="text-center">
          <div className="max-w-xl mx-auto border border-gray-200 rounded-xl p-8 bg-white">
            <p className="text-gray-900 text-lg font-medium mb-6">{t("cta")}</p>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 bg-gray-900 text-white font-semibold px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors text-base"
            >
              {t("ctaButton")}
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
