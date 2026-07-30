"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import type { CollectionItem } from "@/lib/collection-data";
import { COLLECTIONS } from "@/lib/collection-data";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function CollectionDetailContent({ data }: { data: CollectionItem }) {
  const locale = useLocale();
  const isJa = locale === "ja";
  const title = isJa ? data.titleJa : data.titleEn;
  const desc = isJa ? data.descJa : data.descEn;
  const others = COLLECTIONS.filter((c) => c.slug !== data.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ──────────────── */}
      <section className="bg-[#fafaf8] section-noise border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
          <Link href={`/${locale}/about-us/collection`} className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-6">
            ← {isJa ? "コレクション一覧" : "All Collections"}
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-light text-[#111] mb-4"
            style={{ fontFamily: "var(--font-noto-serif), var(--font-display), serif" }}
          >
            {title}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-gray-500 text-base max-w-2xl mx-auto">
            {desc}
          </motion.p>
        </div>
      </section>

      {/* ── Gallery ──────────── */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        {/* Cover */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-8">
          <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.cover}
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

        {/* Detail images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.images.map((img, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`${title} ${i + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
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
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Other Collections ── */}
      <section className="bg-[#fafaf8] section-noise">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <h2 className="text-xl font-light text-[#111] mb-8 text-center" style={{ fontFamily: "var(--font-noto-serif), serif" }}>
            {isJa ? "他のコレクションもご覧ください" : "Explore Other Collections"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {others.map((col) => {
              const otherTitle = isJa ? col.titleJa : col.titleEn;
              return (
                <Link
                  key={col.slug}
                  href={`/${locale}/about-us/collection/${col.slug}`}
                  className="group block rounded-xl overflow-hidden border border-gray-100 bg-white hover:shadow-md transition-all"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={col.cover}
                      alt={otherTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-medium text-[#111]">{otherTitle}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <Link href={`/${locale}/about-us/collection`} className="text-sm font-medium text-gray-400 hover:text-[#111] transition-colors">
              ← {isJa ? "コレクション一覧に戻る" : "Back to All Collections"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
