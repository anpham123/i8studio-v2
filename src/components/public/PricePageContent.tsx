"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { SOLUTIONS } from "@/lib/solution-data";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const SERVICE_ICONS: Record<string, string> = {
  "cg-perspective": "🖼️",
  "cg-video": "🎬",
  "photo-composite": "📷",
  "virtual-staging": "🛋️",
  "vr360": "🌐",
  "vr-walkthrough": "🚶",
  "digital-model": "🏗️",
  "ar": "📱",
  "exe-content": "💻",
};

export default function PricePageContent() {
  const locale = useLocale();
  const isJa = locale === "ja";

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="bg-[#fafaf8] section-noise border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-32 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[11px] uppercase tracking-[0.3em] text-gray-400 mb-5"
          >
            PRICE LIST
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-light text-[#111] mb-6"
            style={{ fontFamily: "var(--font-noto-serif), var(--font-display), serif" }}
          >
            {isJa ? "料金体系" : "Pricing"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            {isJa
              ? "プロジェクトの規模・複雑さに応じた柔軟な料金体系。まずはお気軽にご相談ください。"
              : "Flexible pricing based on project scale and complexity. Feel free to contact us for a consultation."}
          </motion.p>
        </div>
      </section>

      {/* ── Service Grid ──────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SOLUTIONS.map((svc, i) => {
            const title = isJa ? svc.titleJa : svc.titleEn;
            const basePrice = svc.plans[0]?.price ?? "ASK";
            const features = svc.plans[1]?.features.slice(0, 3) ?? svc.plans[0]?.features.slice(0, 3) ?? [];
            return (
              <motion.div
                key={svc.slug}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.08 }}
                className="group border border-gray-100 rounded-2xl p-7 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                {/* Icon + Title */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{SERVICE_ICONS[svc.slug] ?? "📦"}</span>
                  <h3 className="text-lg font-medium text-[#111]">{title}</h3>
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-sm text-gray-500">
                      <span className="text-[#b8935a] mt-0.5 shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-xs uppercase tracking-wider text-gray-400">{isJa ? "参考価格" : "Starting from"}</span>
                  <div className="text-2xl font-light text-[#111] mt-1" style={{ fontFamily: "var(--font-display), serif" }}>
                    {basePrice === "ASK" ? (isJa ? "お問い合わせ" : "Contact Us") : basePrice}
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href={`/${locale}/solution/${svc.slug}`}
                  className="block text-center text-sm font-semibold py-2.5 rounded-full border border-[#111] text-[#111] hover:bg-[#111] hover:text-white transition-colors"
                >
                  {isJa ? "詳細を見る" : "View Details"}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Footer CTA ────────────────────────────────── */}
      <section className="bg-[#111]">
        <div className="max-w-4xl mx-auto px-6 py-20 md:py-28 text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-2xl md:text-3xl font-light text-white mb-6" style={{ fontFamily: "var(--font-noto-serif), serif" }}>
              {isJa ? "個別のプロジェクトに合わせた自由なカスタマイズ。" : "Flexible customization for your unique project."}
            </h2>
            <p className="text-white/50 mb-10 max-w-lg mx-auto">
              {isJa ? "料金はプロジェクトの規模・仕様に応じて変動します。まずはお気軽にお見積もりをご依頼ください。" : "Pricing varies based on project scale and specifications. Please request a free estimate."}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 px-10 py-4 bg-white text-[#111] text-sm font-semibold rounded-full hover:bg-white/90 transition-colors"
            >
              {isJa ? "お見積もりを依頼する" : "Request a Quote"} →
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
