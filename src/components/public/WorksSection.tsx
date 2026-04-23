"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ZoomIn, ArrowRight } from "lucide-react";
import FadeIn from "./FadeIn";
import Lightbox from "./Lightbox";
import { useTranslations } from "next-intl";

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

const categories = ["All", "3DCG", "Animation", "VR", "BIM"];

export default function WorksSection({ works, locale }: WorksSectionProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightbox, setLightbox] = useState<{ src: string; alt: string; isVideo?: boolean } | null>(null);
  const t = useTranslations("works");

  const filtered = activeCategory === "All"
    ? works
    : works.filter((w) => w.category === activeCategory);

  const displayed = filtered.slice(0, 6);

  return (
    <section id="works" className="py-20 lg:py-28 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeIn className="text-center mb-12">
          <div className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-3">
            {t("subtitle")}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
            {t("title")}
          </h2>
        </FadeIn>

        {/* Filter tabs */}
        <FadeIn className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </FadeIn>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {displayed.map((work, i) => {
              const title = locale === "ja" ? work.titleJa || work.title : work.title;
              const hasVideo = !!work.videoUrl;
              const hasImage = !!work.image;

              return (
                <motion.div
                  key={work.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <div
                    className="group relative overflow-hidden rounded-2xl border border-white/5 cursor-pointer bg-gradient-to-br from-blue-900/20 to-purple-900/20 aspect-[4/3]"
                    onClick={() => {
                      if (hasVideo) {
                        setLightbox({ src: work.videoUrl, alt: title, isVideo: true });
                      } else if (hasImage) {
                        setLightbox({ src: work.image, alt: title });
                      }
                    }}
                  >
                    {/* Image or placeholder */}
                    {hasImage ? (
                      <img
                        src={work.image}
                        alt={title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white/10">
                          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <path d="m3 9 4-4 4 4 4-4 4 4" />
                          </svg>
                        </div>
                      </div>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                      <span className="text-xs font-medium bg-black/40 backdrop-blur-sm border border-white/10 text-white/70 px-2 py-1 rounded-full">
                        {work.category}
                      </span>
                    </div>

                    {/* Hover content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <h3 className="text-white font-bold text-lg">{title}</h3>
                      <p className="text-white/60 text-sm">{work.subtitle}</p>
                      <div className="flex items-center gap-2 mt-3 text-blue-400 text-sm font-medium">
                        {hasVideo ? <Play size={14} /> : <ZoomIn size={14} />}
                        View Project →
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* View all button */}
        <FadeIn className="text-center mt-12">
          <Link
            href={`/${locale}/works`}
            className="inline-flex items-center gap-2 btn-outline px-8 py-3"
          >
            {t("viewAll")} <ArrowRight size={16} />
          </Link>
        </FadeIn>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <Lightbox
          src={lightbox.src}
          alt={lightbox.alt}
          isVideo={lightbox.isVideo}
          onClose={() => setLightbox(null)}
        />
      )}
    </section>
  );
}
