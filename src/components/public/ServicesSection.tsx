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
    <section id="services" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeIn className="text-center mb-16">
          <div className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-3">
            {t("subtitle")}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6">
            {t("title")}
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg leading-relaxed">
            {t("description")}
          </p>
        </FadeIn>

        {/* Grid */}
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
                  className="group block card-glass p-6 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all duration-300"
                >
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center mb-4 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all">
                    <Icon size={22} className="text-blue-400" />
                  </div>

                  {/* Image placeholder */}
                  {service.image ? (
                    <img src={service.image} alt={name} className="w-full h-40 object-cover rounded-lg mb-4" />
                  ) : (
                    <div className="w-full h-40 rounded-lg bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-white/5 mb-4" />
                  )}

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                    {name}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-4 line-clamp-3">
                    {desc}
                  </p>

                  <div className="flex items-center justify-between">
                    {price && (
                      <span className="text-xs text-blue-400 font-medium bg-blue-500/10 px-2 py-1 rounded">
                        {price}
                      </span>
                    )}
                    <span className="ml-auto flex items-center gap-1 text-sm text-white/40 group-hover:text-blue-400 transition-colors">
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
