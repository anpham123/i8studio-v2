import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import FadeIn from "./FadeIn";
import { useTranslations } from "next-intl";

interface CaseStudy {
  id: string;
  title: string;
  titleJa: string;
  slug: string;
  client: string;
  result: string;
  resultJa: string;
  serviceType: string;
  afterImage: string;
  metrics: string;
}

interface CaseStudyPreviewProps {
  caseStudies: CaseStudy[];
  locale: string;
}

export default function CaseStudyPreview({ caseStudies, locale }: CaseStudyPreviewProps) {
  const t = useTranslations("caseStudies");

  if (!caseStudies.length) return null;

  return (
    <section className="py-20 lg:py-28 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
            {t("title")}
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caseStudies.slice(0, 3).map((cs, i) => {
            const title = locale === "ja" ? cs.titleJa || cs.title : cs.title;
            const result = locale === "ja" ? cs.resultJa || cs.result : cs.result;
            let metrics: { label: string; value: string }[] = [];
            try {
              metrics = JSON.parse(cs.metrics || "[]");
            } catch {}

            return (
              <FadeIn key={cs.id} delay={i * 0.1}>
                <Link
                  href={`/${locale}/case-studies/${cs.slug}`}
                  className="group block card-glass overflow-hidden hover:-translate-y-1 hover:border-blue-500/30 transition-all duration-300"
                >
                  {/* Image */}
                  {cs.afterImage ? (
                    <img src={cs.afterImage} alt={title} className="w-full h-48 object-cover" />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-blue-900/30 to-purple-900/30 flex items-center justify-center">
                      <TrendingUp size={40} className="text-white/20" />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="text-xs text-blue-400 font-medium mb-2">{cs.client} · {cs.serviceType}</div>
                    <h3 className="text-white font-bold text-lg mb-3 group-hover:text-blue-300 transition-colors">
                      {title}
                    </h3>
                    {metrics[0] && (
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-3">
                        <div className="text-2xl font-bold text-blue-400">{metrics[0].value}</div>
                        <div className="text-white/50 text-xs">{metrics[0].label}</div>
                      </div>
                    )}
                    <p className="text-white/50 text-sm line-clamp-2">{result}</p>
                    <div className="flex items-center gap-1 mt-4 text-blue-400 text-sm font-medium group-hover:gap-2 transition-all">
                      Read case study <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn className="text-center mt-12">
          <Link
            href={`/${locale}/case-studies`}
            className="inline-flex items-center gap-2 btn-outline px-8 py-3"
          >
            {t("viewAll")} <ArrowRight size={16} />
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
