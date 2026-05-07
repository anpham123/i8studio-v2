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
    <section className="py-20 lg:py-28 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.05) 0%, rgba(10,10,15,1) 40%, rgba(59,130,246,0.04) 100%)" }}
    >
      {/* Decorative dot pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
            {t("title")}
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t_item, i) => {
            const quote = locale === "ja" ? t_item.quoteJa || t_item.quote : t_item.quote;
            return (
              <FadeIn key={t_item.id} delay={i * 0.15}>
                <div className="card-glass-hover p-8 h-full flex flex-col relative overflow-hidden">
                  {/* Large decorative quote mark */}
                  <div
                    className="absolute -top-3 right-5 text-[130px] leading-none select-none pointer-events-none font-serif"
                    style={{ color: "rgba(139,92,246,0.09)" }}
                  >
                    &ldquo;
                  </div>
                  {/* Stars */}
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: t_item.rating }).map((_, s) => (
                      <Star key={s} size={16} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-white/80 leading-relaxed flex-1 mb-6 text-base italic">
                    &ldquo;{quote}&rdquo;
                  </blockquote>

                  {/* Client */}
                  <div className="flex items-center gap-4">
                    {t_item.clientPhoto ? (
                      <img
                        src={t_item.clientPhoto}
                        alt={t_item.clientName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                        {t_item.clientName[0]}
                      </div>
                    )}
                    <div>
                      <div className="text-white font-semibold">{t_item.clientName}</div>
                      <div className="text-white/50 text-sm">
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
