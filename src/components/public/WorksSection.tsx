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
  // Split into top 2 and bottom 4 (or top half / bottom half)
  const topRow = displayed.slice(0, 2);
  const bottomRows = displayed.slice(2);

  return (
    <section id="works" className="section-noise py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            {t("subtitle")}
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
            {t("title")}
          </h2>
        </FadeIn>

        {/* Filter tabs */}
        <FadeIn className="flex flex-wrap justify-center gap-1 mb-10 border-b border-gray-100">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 -mb-px ${
                activeCategory === cat
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </FadeIn>

        {/* Empty state */}
        {displayed.length === 0 ? (
          <div className="text-center py-24 text-gray-300">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <ZoomIn size={24} className="text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm">No works in this category yet.</p>
          </div>
        ) : (
          <>
            {/* Top row — 2 columns */}
            <AnimatePresence mode="popLayout">
              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                {topRow.map((work, i) => (
                  <WorkCard
                    key={work.id}
                    work={work}
                    locale={locale}
                    index={i}
                    onOpen={(src, alt, isVideo) => setLightbox({ src, alt, isVideo })}
                  />
                ))}
              </div>
            </AnimatePresence>

            {/* Slogan break — only shown when there are works below */}
            {bottomRows.length > 0 && (
              <FadeIn className="text-center py-10 lg:py-14">
                <p className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 tracking-tight leading-tight">
                  Photoreal quality,<br />
                  <span className="text-gray-400">built for Japanese standards.</span>
                </p>
              </FadeIn>
            )}

            {/* Bottom rows — 2 columns */}
            <AnimatePresence mode="popLayout">
              <div className="grid sm:grid-cols-2 gap-5">
                {bottomRows.map((work, i) => (
                  <WorkCard
                    key={work.id}
                    work={work}
                    locale={locale}
                    index={i + 2}
                    onOpen={(src, alt, isVideo) => setLightbox({ src, alt, isVideo })}
                  />
                ))}
              </div>
            </AnimatePresence>
          </>
        )}

        <FadeIn className="text-center mt-14">
          <Link
            href={`/${locale}/works`}
            className="inline-flex items-center gap-2 border border-gray-900 text-gray-900 font-semibold px-8 py-3 rounded-lg hover:bg-gray-900 hover:text-white transition-all duration-300"
          >
            {t("viewAll")} <ArrowRight size={16} />
          </Link>
        </FadeIn>
      </div>

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

function WorkCard({
  work,
  locale,
  index,
  onOpen,
}: {
  work: Work;
  locale: string;
  index: number;
  onOpen: (src: string, alt: string, isVideo?: boolean) => void;
}) {
  const title = locale === "ja" ? work.titleJa || work.title : work.title;
  const hasVideo = !!work.videoUrl;
  const hasImage = !!work.image;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
    >
      <div
        className="group relative overflow-hidden rounded-2xl cursor-pointer aspect-video hover:shadow-xl transition-all duration-300 bg-gray-100"
        onClick={() => {
          if (hasVideo) {
            onOpen(work.videoUrl, title, true);
          } else if (hasImage) {
            onOpen(work.image, title);
          }
        }}
      >
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={work.image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-200">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="m3 9 4-4 4 4 4-4 4 4" />
              </svg>
            </div>
          </div>
        )}

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className="text-xs font-medium bg-white/90 text-gray-700 px-2.5 py-1 rounded-full">
            {work.category}
          </span>
        </div>

        {/* Hover content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <h3 className="text-white font-bold text-xl">{title}</h3>
          <p className="text-white/70 text-sm">{work.subtitle}</p>
          <div className="flex items-center gap-2 mt-3 text-white text-sm font-medium">
            {hasVideo ? <Play size={14} /> : <ZoomIn size={14} />}
            View Project →
          </div>
        </div>
      </div>
    </motion.div>
  );
}
