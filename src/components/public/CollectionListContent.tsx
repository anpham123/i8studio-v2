"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { COLLECTIONS } from "@/lib/collection-data";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function CollectionListContent() {
  const locale = useLocale();
  const isJa = locale === "ja";

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ──────────────────── */}
      <section className="bg-[#fafaf8] section-noise border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-32 text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] uppercase tracking-[0.3em] text-gray-400 mb-5">
            COLLECTION
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-light text-[#111] mb-6"
            style={{ fontFamily: "var(--font-noto-serif), var(--font-display), serif" }}
          >
            {isJa ? "空間を彩る、視覚の物語" : "Visual Stories that Color Spaces"}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
            {isJa ? "さまざまな空間タイプの3DCGビジュアライゼーションコレクション。" : "A collection of 3DCG visualizations across various space types."}
          </motion.p>
        </div>
      </section>

      {/* ── Grid ──────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COLLECTIONS.map((col, i) => {
            const title = isJa ? col.titleJa : col.titleEn;
            return (
              <motion.div
                key={col.slug}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.08 }}
              >
                <Link
                  href={`/${locale}/about-us/collection/${col.slug}`}
                  className="group block rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={col.cover}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const t = e.currentTarget;
                        t.style.display = "none";
                        const p = t.parentElement;
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
                  <div className="p-5">
                    <h3 className="text-lg font-medium text-[#111] mb-1">{title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{isJa ? col.descJa : col.descEn}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
