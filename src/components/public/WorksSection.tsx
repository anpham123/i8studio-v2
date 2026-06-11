"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import FadeIn from "./FadeIn";
import { useTranslations } from "next-intl";
import Lightbox from "./Lightbox";

interface Work {
  id: string;
  title: string;
  titleJa: string;
  subtitle: string;
  category: string;
  image: string;
  videoUrl: string;
}

interface WorksSectionProps {
  works: Work[];
  locale: string;
}

const CATEGORIES = ["All", "3DCG", "Animation", "VR", "BIM"];

export default function WorksSection({ works, locale }: WorksSectionProps) {
  const t = useTranslations("works");
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState<{ image: string; title: string } | null>(null);

  const filtered = active === "All" ? works : works.filter((w) => w.category === active);
  const displayed = filtered.slice(0, 6);

  return (
    <section id="works" className="section-noise py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            {t("subtitle")}
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 font-serif">
            {t("title")}
          </h2>
        </FadeIn>

        {/* Filter tabs */}
        <FadeIn className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                active === cat
                  ? "bg-gray-900 text-white shadow-sm"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
              }`}
            >
              {cat === "All" ? t("filters.all") : cat}
            </button>
          ))}
        </FadeIn>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
          >
            {displayed.length > 0 ? (
              displayed.map((work, i) => {
                const title = locale === "ja" ? work.titleJa || work.title : work.title;

                return (
                  <FadeIn key={work.id} delay={i * 0.06}>
                    <button
                      onClick={() => setLightbox({ image: work.image || work.videoUrl, title })}
                      className="group block w-full text-left relative rounded-xl overflow-hidden bg-gray-100 aspect-[4/3]"
                    >
                      {work.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={work.image}
                          alt={title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gray-100" />
                      )}
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      {/* Info on hover */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <p className="text-white font-bold text-base">{title}</p>
                        {work.subtitle && (
                          <p className="text-white/70 text-sm mt-1">{work.subtitle}</p>
                        )}
                        <span className="inline-flex items-center gap-1 text-white/90 text-xs mt-2 font-medium">
                          {t("viewProject")} <ArrowRight size={12} />
                        </span>
                      </div>
                      {/* Category badge */}
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
                          {work.category}
                        </span>
                      </div>
                    </button>
                  </FadeIn>
                );
              })
            ) : (
              <div className="col-span-full text-center py-16 text-gray-400 text-sm">
                {t("emptyCategory")}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* View all link */}
        <FadeIn className="text-center mt-12">
          <Link
            href={`/${locale}/works`}
            className="inline-flex items-center gap-2 border border-gray-900 text-gray-900 font-semibold px-8 py-3 rounded-lg hover:bg-gray-900 hover:text-white transition-all duration-300"
          >
            {t("viewAll")} <ArrowRight size={16} />
          </Link>
        </FadeIn>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <Lightbox
          src={lightbox.image}
          alt={lightbox.title}
          isVideo={lightbox.image?.includes("youtube") || lightbox.image?.includes("vimeo")}
          onClose={() => setLightbox(null)}
        />
      )}
    </section>
  );
}
