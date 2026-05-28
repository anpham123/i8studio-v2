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
    <section id="services" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            {t("subtitle")}
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
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
                  className="group block border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-lg transition-all duration-300 bg-white"
                >
                  <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                    <Icon size={22} className="text-blue-600" />
                  </div>

                  {service.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={service.image} alt={name} className="w-full h-40 object-cover rounded-lg mb-4" />
                  ) : (
                    <div className="w-full h-40 rounded-lg bg-gray-50 border border-gray-100 mb-4" />
                  )}

                  <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {name}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3">
                    {desc}
                  </p>

                  <div className="flex items-center justify-between">
                    {price && (
                      <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
                        {price}
                      </span>
                    )}
                    <span className="ml-auto flex items-center gap-1 text-sm text-gray-400 group-hover:text-blue-600 transition-colors">
                      {t("learnMore")} <ArrowRight size={14} />
                    </span>
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
