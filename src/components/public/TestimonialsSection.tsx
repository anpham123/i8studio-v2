import { Star } from "lucide-react";
import FadeIn from "./FadeIn";
import { useTranslations } from "next-intl";

interface Testimonial {
  id: string;
  clientName: string;
  clientTitle: string;
  clientCompany: string;
  clientPhoto: string;
  quote: string;
  quoteJa: string;
  rating: number;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  locale: string;
}

export default function TestimonialsSection({ testimonials, locale }: TestimonialsSectionProps) {
  const t = useTranslations("testimonials");

  if (!testimonials.length) return null;

  return (
    <section className="section-noise py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Client Reviews
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 font-serif">
            {t("title")}
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t_item, i) => {
            const quote = locale === "ja" ? t_item.quoteJa || t_item.quote : t_item.quote;
            return (
              <FadeIn key={t_item.id} delay={i * 0.15}>
                <div className="border border-gray-200 rounded-xl p-8 h-full flex flex-col bg-white hover:shadow-md transition-shadow">
                  {/* Stars */}
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: t_item.rating }).map((_, s) => (
                      <Star key={s} size={16} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-base text-gray-600 leading-relaxed flex-1 mb-6 italic">
                    &ldquo;{quote}&rdquo;
                  </blockquote>

                  {/* Client */}
                  <div className="flex items-center gap-4">
                    {t_item.clientPhoto ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={t_item.clientPhoto}
                        alt={t_item.clientName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-lg shrink-0">
                        {t_item.clientName[0]}
                      </div>
                    )}
                    <div>
                      <div className="text-gray-900 font-semibold">{t_item.clientName}</div>
                      <div className="text-gray-400 text-sm">
                        {t_item.clientTitle}
                        {t_item.clientCompany && ` · ${t_item.clientCompany}`}
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
