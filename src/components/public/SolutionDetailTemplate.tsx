"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import type { SolutionService } from "@/lib/solution-data";
import { getEmbedUrl } from "@/components/admin/MediaEmbedPreview";
import BeforeAfterSlider from "@/components/public/BeforeAfterSlider";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      {/* ── Hero (full-viewport) ──────────────────────────── */}
      <section className="relative h-screen min-h-[600px] max-h-[1200px] overflow-hidden flex items-center justify-center">
        {/* Background: video or image */}
        {(() => {
          // Priority: heroVideo > heroImage (if video) > mediaEmbedUrl (if video) > heroImage (as image)
          const heroVideoUrl = data.heroVideo || "";
          const heroSrc = data.heroImage || "";
          const isHeroImageVideo = /\.(mp4|webm|mov)(\?|$)/i.test(heroSrc);
          const mediaUrl = data.mediaEmbedUrl || "";
          const isMediaVideo = /\.(mp4|webm|mov)(\?|$)/i.test(mediaUrl);
          
          const useVideo = heroVideoUrl
            || (isHeroImageVideo ? heroSrc : null)
            || (!heroSrc && isMediaVideo ? mediaUrl : null);
          const useImage = !useVideo ? heroSrc : null;

          return (
            <>
              {useVideo ? (
                <video
                  src={useVideo}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : useImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={useImage}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#111] via-[#1a1a2e] to-[#111]" />
              )}
              {/* Dark gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70" />
            </>
          );
        })()}

        {/* Content overlay */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[22px] sm:text-[28px] uppercase tracking-[0.3em] text-white/70 font-medium mb-6"
          >
            {title}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-7xl font-light text-white leading-tight mb-6"
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
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#111] text-sm font-semibold rounded-full hover:bg-white/90 transition-colors shadow-lg"
            >
              {isJa ? "無料相談する" : "Free Consultation"}
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-white/60"
            />
          </div>
        </motion.div>
      </section>

      {/* ── Service-level Media Embed (VR360 / Video / 3D) ── */}
      {data.mediaEmbedUrl && (
        <section className="bg-[#fafaf8]">
          <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-10">
              <p className="text-[11px] uppercase tracking-[0.25em] text-gray-400 mb-3">INTERACTIVE EXPERIENCE</p>
              <h2 className="text-2xl md:text-3xl font-light text-[#111]" style={{ fontFamily: "var(--font-noto-serif), serif" }}>
                {isJa ? "インタラクティブデモ" : "Interactive Demo"}
              </h2>
            </motion.div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="aspect-video rounded-2xl overflow-hidden shadow-xl border border-gray-200"
            >
              {/\.(mp4|webm|mov)(\?|$)/i.test(data.mediaEmbedUrl) ? (
                <video
                  src={data.mediaEmbedUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  className="w-full h-full object-cover bg-black"
                />
              ) : (
                <iframe
                  src={getEmbedUrl(data.mediaEmbedUrl) || undefined}
                  className="w-full h-full border-0"
                  allowFullScreen
                  allow="accelerometer; gyroscope; xr-spatial-tracking; fullscreen; autoplay"
                  title={title}
                />
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Feature Blocks (full-width media, text below) ── */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28 space-y-20 md:space-y-28">
        {data.features.map((feat, i) => {
          const ftTitle = isJa ? feat.titleJa : feat.titleEn;
          const ftDesc = isJa ? feat.descJa : feat.descEn;
          const isDirectVideo = /\.(mp4|webm|mov)(\?|$)/i.test(feat.mediaEmbedUrl || "");
          const embedUrl = feat.mediaEmbedUrl && !isDirectVideo ? getEmbedUrl(feat.mediaEmbedUrl) : null;
          const isBeforeAfter = feat.displayMode === "beforeAfter" && feat.imageBefore && feat.imageAfter;
          const hasMedia = isDirectVideo || embedUrl || isBeforeAfter || feat.image;
          return (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="flex flex-col gap-6"
            >
              {/* Visual — full width */}
              {hasMedia && (
              <div className="w-full rounded-2xl overflow-hidden">
                {isDirectVideo ? (
                  <div className="aspect-video rounded-2xl overflow-hidden">
                    <video
                      src={feat.mediaEmbedUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      controls
                      className="w-full h-full object-cover bg-black"
                    />
                  </div>
                ) : embedUrl ? (
                  <div className="aspect-video rounded-2xl overflow-hidden">
                    <iframe
                      src={embedUrl}
                      className="w-full h-full border-0"
                      allowFullScreen
                      allow="accelerometer; gyroscope; xr-spatial-tracking; fullscreen; autoplay"
                      title={ftTitle}
                    />
                  </div>
                ) : isBeforeAfter ? (
                  <div className="w-full rounded-2xl overflow-hidden">
                    <BeforeAfterSlider
                      beforeImage={feat.imageBefore}
                      afterImage={feat.imageAfter}
                      beforeLabel="Before"
                      afterLabel="After"
                      autoAspect={true}
                    />
                  </div>
                ) : feat.image ? (
                  <div className="w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={feat.image}
                      alt={ftTitle}
                      className="w-full h-auto rounded-2xl"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          parent.style.display = "none";
                        }
                      }}
                    />
                  </div>
                ) : null}
              </div>
              )}
              {/* Text — below media */}
              <div className="w-full">
                <h2 className="text-2xl md:text-3xl font-light text-[#111] mb-3 leading-snug" style={{ fontFamily: "var(--font-noto-serif), serif" }}>
                  {ftTitle}
                </h2>
                {(() => {
                  const rawDesc = ftDesc || "";
                  let items = rawDesc
                    .split(/\r?\n/)
                    .map((s) => s.trim())
                    .filter(Boolean);

                  if (items.length <= 1 && rawDesc.length > 60) {
                    if (isJa && rawDesc.includes("。")) {
                      items = rawDesc
                        .split(/(?<=。)/)
                        .map((s) => s.trim())
                        .filter(Boolean);
                    } else if (!isJa && rawDesc.includes(". ")) {
                      items = rawDesc
                        .split(/(?<=\.\s+)/)
                        .map((s) => s.trim())
                        .filter(Boolean);
                    }
                  }

                  if (items.length === 0 && rawDesc.trim()) {
                    items = [rawDesc.trim()];
                  }

                  if (items.length > 0) {
                    return (
                      <ul className="space-y-2.5 mb-2">
                        {items.map((item, idx) => {
                          const cleanItem = item.replace(/^[-•・*]\s*/, "");
                          return (
                            <li key={idx} className="flex items-start gap-2.5 text-gray-500 text-base leading-relaxed">
                              <span className="text-[#b8935a] font-bold text-base leading-[1.6] select-none shrink-0">•</span>
                              <span>{cleanItem}</span>
                            </li>
                          );
                        })}
                      </ul>
                    );
                  }

                  return null;
                })()}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.process
              .filter((step) => step.titleJa || step.titleEn || step.descJa || step.descEn)
              .map((step, i) => (
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
                <div className="w-12 h-12 rounded-full bg-[#111] text-white flex items-center justify-center text-sm font-bold mb-5 font-roboto">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-base font-medium text-[#111] mb-2">
                  {isJa ? step.titleJa : step.titleEn}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">
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
                <div className="text-3xl font-bold text-white mb-6 font-roboto tracking-tight">
                  {plan.price === "ASK" ? (
                    <span className="text-lg font-normal">{isJa ? "お問い合わせ" : "Contact Us"}</span>
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
