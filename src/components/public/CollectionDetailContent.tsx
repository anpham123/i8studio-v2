"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import type { CollectionItem } from "@/lib/collection-data";
import { COLLECTIONS } from "@/lib/collection-data";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

interface DbCollection {
  slug: string; titleJa: string; titleEn: string;
  descJa: string; descEn: string; coverImage: string;
  images: { image: string; captionJa: string; captionEn: string }[];
}

interface OtherCol {
  slug: string;
  titleJa: string;
  titleEn: string;
  coverImage: string;
}

export default function CollectionDetailContent({
  data,
  dbCollection,
  otherCollections,
}: {
  data?: CollectionItem;
  dbCollection?: DbCollection;
  otherCollections?: OtherCol[];
}) {
  const locale = useLocale();
  const pathname = usePathname();
  const isJa = locale === "ja";

  const isAboutUs = pathname?.includes("/about-us");
  const basePath = isAboutUs ? `/${locale}/about-us/collection` : `/${locale}/collection`;

  const col = dbCollection || (data ? {
    slug: data.slug,
    titleJa: data.titleJa,
    titleEn: data.titleEn,
    descJa: data.descJa,
    descEn: data.descEn,
    coverImage: data.cover,
    images: data.images.map((img) => ({ image: img, captionJa: "", captionEn: "" })),
  } : null);

  if (!col) return null;

  const title = isJa ? (col.titleJa || col.titleEn) : (col.titleEn || col.titleJa);
  const desc = isJa ? (col.descJa || col.descEn) : (col.descEn || col.descJa);

  // Others to display
  const others = (otherCollections && otherCollections.length > 0)
    ? otherCollections.map((c) => ({ slug: c.slug, titleJa: c.titleJa, titleEn: c.titleEn, cover: c.coverImage }))
    : COLLECTIONS.filter((c) => c.slug !== col.slug).slice(0, 3).map((c) => ({ slug: c.slug, titleJa: c.titleJa, titleEn: c.titleEn, cover: c.cover }));

  return (
    <div className="min-h-screen bg-white">
      {/* ── Gallery Section (Bỏ Hero section cồng kềnh, vào thẳng nội dung) ──────────── */}
      <section className="max-w-6xl mx-auto px-6 pt-8 md:pt-12 pb-16 md:pb-24">
        {/* Back Link & Centered Large Title Header */}
        <div className="mb-10 text-center flex flex-col items-center justify-center">
          <Link
            href={basePath}
            className="inline-flex items-center gap-1.5 text-[14px] sm:text-[16px] md:text-[17px] font-semibold text-gray-500 hover:text-black transition-colors mb-3.5 tracking-wide group"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span> {isJa ? "コレクション一覧" : "All Collections"}
          </Link>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-light text-[#111] tracking-tight leading-tight"
            style={{ fontFamily: "var(--font-noto-serif), var(--font-display), 'Playfair Display', serif" }}
          >
            {title}
          </h1>
          {desc && (
            <p className="text-gray-500 text-sm sm:text-base max-w-2xl text-center mx-auto mt-3.5 leading-relaxed">
              {desc}
            </p>
          )}
        </div>

        {/* Cover */}
        {col.coverImage && (
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-8">
            <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={col.coverImage}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const p = e.currentTarget.parentElement;
                  if (p) {
                    p.classList.add("flex", "items-center", "justify-center");
                    const s = document.createElement("span");
                    s.className = "text-gray-400 text-sm font-medium";
                    s.textContent = title;
                    p.appendChild(s);
                  }
                }}
              />
            </div>
          </motion.div>
        )}

        {/* Detail images */}
        {col.images && col.images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {col.images.map((img, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl overflow-hidden bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 relative group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.image}
                  alt={`${title} ${i + 1}`}
                  className="w-full h-auto block hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const p = e.currentTarget.parentElement;
                    if (p) {
                      p.classList.add("flex", "items-center", "justify-center");
                      const s = document.createElement("span");
                      s.className = "text-gray-400 text-sm";
                      s.textContent = `${title} ${i + 1}`;
                      p.appendChild(s);
                    }
                  }}
                />
                {(img.captionJa || img.captionEn) && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-xs px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {isJa ? img.captionJa : img.captionEn}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ── Other Collections ── */}
      {others.length > 0 && (
        <section className="bg-[#fafaf8] section-noise">
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
            <h2 className="text-xl font-light text-[#111] mb-8 text-center" style={{ fontFamily: "var(--font-noto-serif), serif" }}>
              {isJa ? "他のコレクションもご覧ください" : "Explore Other Collections"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {others.map((otherCol) => {
                const otherTitle = isJa ? (otherCol.titleJa || otherCol.titleEn) : (otherCol.titleEn || otherCol.titleJa);
                return (
                  <Link
                    key={otherCol.slug}
                    href={`${basePath}/${encodeURIComponent(otherCol.slug)}`}
                    className="group flex flex-col justify-between h-full rounded-xl overflow-hidden border border-gray-100 bg-white hover:shadow-md transition-all"
                  >
                    <div className="bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 overflow-hidden flex-1 flex items-center justify-center min-h-[180px]">
                      {otherCol.cover ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={otherCol.cover}
                          alt={otherTitle}
                          className="w-full h-auto block group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full min-h-[180px] flex items-center justify-center text-gray-400 text-sm font-medium">
                          {otherTitle}
                        </div>
                      )}
                    </div>
                    <div className="p-4 mt-auto bg-white border-t border-gray-50">
                      <h3 className="text-base font-medium text-[#111]">{otherTitle}</h3>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="text-center mt-10">
              <Link href={basePath} className="inline-flex items-center gap-1.5 text-[14px] sm:text-[16px] md:text-[17px] font-semibold text-gray-500 hover:text-black transition-colors tracking-wide group">
                <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span> {isJa ? "コレクション一覧に戻る" : "Back to All Collections"}
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

