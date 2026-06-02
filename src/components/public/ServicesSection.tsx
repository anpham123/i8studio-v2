import Link from "next/link";
import { ArrowRight, Box, Film, Glasses, Building2, Gamepad2, Sparkles } from "lucide-react";
import FadeIn from "./FadeIn";
import { useTranslations } from "next-intl";

const iconMap: Record<string, React.ElementType> = {
  Box,
  Film,
  Glasses,
  Building2,
  Gamepad2,
  Sparkles,
};

interface Service {
  id: string;
  name: string;
  nameJa: string;
  slug: string;
  description: string;
  descriptionJa: string;
  icon: string;
  image: string;
  priceHint: string;
  priceHintJa: string;
}

interface ServicesSectionProps {
  services: Service[];
  locale: string;
}

export default function ServicesSection({ services, locale }: ServicesSectionProps) {
  const t = useTranslations("services");

  return (
    <section id="services" className="section-noise py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            {t("subtitle")}
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 font-serif">
            {t("title")}
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t("description")}
          </p>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] || Box;
            const name = locale === "ja" ? service.nameJa || service.name : service.name;
            const desc = locale === "ja" ? service.descriptionJa || service.description : service.description;
            const price = locale === "ja" ? service.priceHintJa || service.priceHint : service.priceHint;

            return (
              <FadeIn key={service.id} delay={i * 0.08}>
                <Link
                  href={`/${locale}/service/${service.slug}`}
                  className="group block rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 bg-white border border-gray-100"
                >
                  {/* Image area */}
                  <div className="relative w-full aspect-video overflow-hidden bg-gray-50">
                    {service.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={service.image}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon size={40} className="text-gray-200" />
                      </div>
                    )}
                    {/* Category tag */}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full">
                        <Icon size={11} className="text-blue-600" />
                        {name}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
                      {desc}
                    </p>
                    <div className="flex items-center justify-between">
                      {price && (
                        <span className="text-xs font-semibold text-gray-900 bg-gray-100 px-3 py-1.5 rounded-full">
                          {price}
                        </span>
                      )}
                      <span className="ml-auto flex items-center gap-1 text-sm font-medium text-gray-400 group-hover:text-gray-900 transition-colors">
                        {t("learnMore")} <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
