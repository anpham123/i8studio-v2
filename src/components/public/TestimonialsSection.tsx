"use client";

import { Star, Quote } from "lucide-react";
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
    <section className="section-noise py-20 lg:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Testimonials
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 font-serif">
            {t("title")}
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((item, i) => {
            const quoteText = locale === "ja" ? item.quoteJa || item.quote : item.quote;

            return (
              <FadeIn key={item.id} delay={i * 0.1}>
                <div className="bg-white border border-gray-200 rounded-2xl p-7 flex flex-col h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  {/* Quote icon */}
                  <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center mb-5">
                    <Quote size={18} className="text-white" />
                  </div>

                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <Star
                        key={si}
                        size={14}
                        className={si < item.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}
                      />
                    ))}
                  </div>

                  {/* Quote text */}
                  <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-6">
                    &ldquo;{quoteText}&rdquo;
                  </p>

                  {/* Client info */}
                  <div className="flex items-center gap-3 border-t border-gray-100 pt-5">
                    {item.clientPhoto ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={item.clientPhoto}
                        alt={item.clientName}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                        {item.clientName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="text-gray-900 font-semibold text-sm">{item.clientName}</div>
                      <div className="text-gray-400 text-xs">
                        {item.clientTitle}{item.clientCompany ? ` · ${item.clientCompany}` : ""}
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
