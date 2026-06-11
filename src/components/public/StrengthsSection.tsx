import { CheckCircle } from "lucide-react";
import FadeIn from "./FadeIn";
import { useTranslations } from "next-intl";

export default function StrengthsSection() {
  const t = useTranslations("strengths");

  const items = [
    { key: "quality" },
    { key: "price" },
    { key: "communication" },
    { key: "nda" },
    { key: "turnaround" },
  ] as const;

  return (
    <section className="section-noise py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Visual */}
          <FadeIn direction="left">
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <p className="text-gray-300 text-sm font-medium">High Quality CG Production</p>
                </div>
              </div>
              {/* Decorative corner badge */}
              <div className="absolute -bottom-4 -right-4 bg-gray-900 text-white rounded-xl px-5 py-3 shadow-lg">
                <div className="text-2xl font-bold">50+</div>
                <div className="text-xs text-gray-400">Japanese Clients</div>
              </div>
            </div>
          </FadeIn>

          {/* Right: Checklist */}
          <FadeIn direction="right">
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                {t("subtitle")}
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-serif">
                {t("title")}
              </h2>
              <p className="text-base text-gray-500 leading-relaxed mb-8">
                {t("description")}
              </p>

              <div className="space-y-4">
                {items.map((item, i) => (
                  <FadeIn key={item.key} delay={0.1 + i * 0.08}>
                    <div className="flex items-start gap-4 group">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mt-0.5">
                        <CheckCircle size={16} className="text-white" strokeWidth={2.5} />
                      </div>
                      <div>
                        <div className="text-gray-900 font-semibold text-sm">
                          {t(`items.${item.key}.title`)}
                        </div>
                        <div className="text-gray-500 text-sm mt-0.5">
                          {t(`items.${item.key}.desc`)}
                        </div>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
