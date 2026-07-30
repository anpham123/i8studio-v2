"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import type { SolutionService } from "@/lib/solution-data";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

function PlaceholderImage({ alt, className }: { alt: string; className?: string }) {
  return (
    <div className={`bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 flex items-center justify-center ${className ?? ""}`}>
      <span className="text-gray-400 text-sm font-medium text-center px-4">{alt}</span>
    </div>
  );
}

export default function SolutionDetailTemplate({ data }: { data: SolutionService }) {
  const locale = useLocale();
  const isJa = locale === "ja";

  const title = isJa ? data.titleJa : data.titleEn;
  const heroTagline = isJa ? data.heroTaglineJa : data.heroTaglineEn;
  const heroDesc = isJa ? data.heroDescJa : data.heroDescEn;

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative bg-[#111] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#111] via-[#1a1a2e] to-[#111]" />
        <div className="relative max-w-5xl mx-auto px-6 py-28 md:py-36 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[11px] uppercase tracking-[0.3em] text-white/40 mb-6"
          >
            {title}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-6xl font-light text-white leading-tight mb-6"
            style={{ fontFamily: "var(--font-noto-serif), var(--font-display), serif" }}
          >
            {heroTagline}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {heroDesc}
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#111] text-sm font-semibold rounded-full hover:bg-white/90 transition-colors"
            >
              {isJa ? "無料相談する" : "Free Consultation"}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Feature Blocks (alternating) ────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28 space-y-20 md:space-y-28">
        {data.features.map((feat, i) => {
          const ftTitle = isJa ? feat.titleJa : feat.titleEn;
          const ftDesc = isJa ? feat.descJa : feat.descEn;
          const reverse = i % 2 === 1;
          return (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} gap-10 md:gap-16 items-center`}
            >
              {/* Image */}
              <div className="w-full md:w-1/2 aspect-[4/3] rounded-2xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={feat.image}
                  alt={ftTitle}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      parent.classList.add("bg-gradient-to-br", "from-gray-200", "via-gray-100", "to-gray-200", "flex", "items-center", "justify-center");
                      const span = document.createElement("span");
                      span.className = "text-gray-400 text-sm font-medium text-center px-4";
                      span.textContent = ftTitle;
                      parent.appendChild(span);
                    }
                  }}
                />
              </div>
              {/* Text */}
              <div className="w-full md:w-1/2">
                <h2 className="text-2xl md:text-3xl font-light text-[#111] mb-4 leading-snug" style={{ fontFamily: "var(--font-noto-serif), serif" }}>
                  {ftTitle}
                </h2>
                <p className="text-gray-500 text-base leading-relaxed">{ftDesc}</p>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* ── Process Block ─────────────────────────────────── */}
      <section className="bg-[#fafaf8] section-noise">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <p className="text-[11px] uppercase tracking-[0.25em] text-gray-400 mb-3">PROCESS</p>
            <h2 className="text-2xl md:text-3xl font-light text-[#111]" style={{ fontFamily: "var(--font-noto-serif), serif" }}>
              {isJa ? "プロフェッショナルな制作工程" : "Professional Production Process"}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.process.map((step, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                {/* Step number */}
                <div className="w-12 h-12 rounded-full bg-[#111] text-white flex items-center justify-center text-sm font-semibold mb-5">
                  {String(i + 1).padStart(2, "0")}
                </div>
                {/* Connector line (not on last) */}
                {i < data.process.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-12 w-[calc(100%-3rem)] h-px bg-gray-200" />
                )}
                <h3 className="text-base font-medium text-[#111] mb-2">
                  {isJa ? step.titleJa : step.titleEn}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {isJa ? step.descJa : step.descEn}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Block (dark) ──────────────────────────── */}
      <section className="bg-[#111]">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <p className="text-[11px] uppercase tracking-[0.25em] text-white/40 mb-3">SERVICE PLANS</p>
            <h2 className="text-2xl md:text-3xl font-light text-white" style={{ fontFamily: "var(--font-noto-serif), serif" }}>
              {isJa ? "サービスプラン" : "Service Plans"}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.plans.map((plan, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl p-8 border transition-all ${
                  plan.highlighted
                    ? "bg-white/10 border-white/20 scale-[1.02]"
                    : "bg-white/5 border-white/10"
                }`}
              >
                {plan.highlighted && (
                  <span className="inline-block text-[10px] uppercase tracking-[0.2em] text-[#b8935a] font-semibold mb-3">
                    {isJa ? "おすすめ" : "Recommended"}
                  </span>
                )}
                <h3 className="text-xl font-medium text-white mb-4">{plan.name}</h3>
                <div className="text-3xl font-light text-white mb-6" style={{ fontFamily: "var(--font-display), serif" }}>
                  {plan.price === "ASK" ? (
                    <span className="text-lg">{isJa ? "お問い合わせ" : "Contact Us"}</span>
                  ) : (
                    plan.price
                  )}
                </div>
                <ul className="space-y-2.5 mb-8">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-sm text-white/60">
                      <span className="text-[#b8935a] mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/${locale}/contact`}
                  className={`block text-center text-sm font-semibold py-3 rounded-full transition-colors ${
                    plan.highlighted
                      ? "bg-white text-[#111] hover:bg-white/90"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {plan.price === "ASK"
                    ? (isJa ? "お見積もりを依頼" : "Request Quote")
                    : (isJa ? "お問い合わせ" : "Contact Us")}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer CTA ────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 py-20 md:py-28 text-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h2 className="text-2xl md:text-3xl font-light text-[#111] mb-6 leading-snug" style={{ fontFamily: "var(--font-noto-serif), serif" }}>
            {isJa ? "i8 studioと共にプロジェクトを形にしましょう" : "Let's bring your project to life with i8 studio"}
          </h2>
          <p className="text-gray-500 mb-10 max-w-lg mx-auto">
            {isJa ? "まずはお気軽にご相談ください。プロジェクトの規模に関わらず、最適なソリューションをご提案いたします。" : "Feel free to contact us. We'll propose the optimal solution regardless of project scale."}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 px-10 py-4 bg-[#111] text-white text-sm font-semibold rounded-full hover:bg-[#333] transition-colors"
          >
            {isJa ? "お問い合わせ" : "Contact Us"} →
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
