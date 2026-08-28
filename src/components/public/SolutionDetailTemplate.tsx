"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import type { SolutionService } from "@/lib/solution-data";
import { getEmbedUrl } from "@/components/admin/MediaEmbedPreview";
import BeforeAfterSlider from "@/components/public/BeforeAfterSlider";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.28,
      delayChildren: 0.15,
    },
  },
};

const listItemVariants = {
  hidden: { opacity: 0, x: -22, y: 8 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

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
      {/* ── Hero (full-viewport with bottom-aligned content to showcase product) ── */}
      <section className="relative h-[calc(100vh-var(--header-h,76px))] min-h-[600px] max-h-[1200px] overflow-hidden flex flex-col justify-end pb-14 sm:pb-16 md:pb-20">
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
              {/* Subtle top and bottom gradients so product in center is completely clear */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-transparent pointer-events-none" />
            </>
          );
        })()}

        {/* Content overlay (Gọn gàng, hạ xuống phía dưới để không che ảnh sản phẩm) */}
        <div className="relative z-10 text-center px-6 max-w-5xl md:max-w-6xl mx-auto mb-2">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-base sm:text-lg md:text-xl uppercase tracking-[0.28em] text-[#c5a666] font-bold mb-3 drop-shadow-sm"
          >
            {title}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-light text-white leading-tight mb-4 drop-shadow-md md:whitespace-nowrap"
            style={{ fontFamily: "var(--font-noto-serif), var(--font-display), serif" }}
          >
            {heroTagline}
          </motion.h1>
          {heroDesc && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-white/85 text-xs sm:text-sm md:text-base max-w-2xl mx-auto mb-6 leading-relaxed font-light drop-shadow-sm"
            >
              {heroDesc}
            </motion.p>
          )}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#111] text-xs sm:text-sm font-semibold rounded-full hover:bg-white/95 hover:scale-105 transition-all shadow-lg"
            >
              <span>{isJa ? "無料相談する" : "Free Consultation"}</span>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
        >
          <div className="w-5 h-8 rounded-full border border-white/30 flex justify-center pt-1.5 backdrop-blur-[1px]">
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-1 rounded-full bg-white/70"
            />
          </div>
        </motion.div>
      </section>

      {/* ── Service-level Media Embed (VR360 / Video / 3D) ── */}
      {data.mediaEmbedUrl && data.slug !== "cg-video" && data.slug !== "vr360" && data.slug !== "vr-360" && (
        <section className="bg-[#fafaf8]">
          <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-10">
              <p className="text-[11px] uppercase tracking-[0.25em] text-gray-400 mb-3">
                {isJa ? "インタラクティブ体験" : "INTERACTIVE EXPERIENCE"}
              </p>
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
              {/* Text — below media (spans full width matching media above) */}
              <div className="w-full">
                <h2 className="text-2xl md:text-3xl font-light text-[#111] mb-4 leading-snug" style={{ fontFamily: "var(--font-noto-serif), serif" }}>
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
                      <motion.ul
                        variants={listContainerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15 }}
                        className="w-full space-y-3 mb-2"
                      >
                        {items.map((item, idx) => {
                          const cleanItem = item.replace(/^[-•・*]\s*/, "");
                          return (
                            <motion.li
                              key={idx}
                              variants={listItemVariants}
                              className="w-full flex items-start gap-3 text-black text-[16px] sm:text-[17px] md:text-[18px] leading-[1.85] font-normal"
                            >
                              <span className="text-[#b8935a] font-bold text-[18px] leading-[1.65] select-none shrink-0">•</span>
                              <span className="flex-1 min-w-0 text-justify [text-align-last:left] [text-justify:inter-word]">{cleanItem}</span>
                            </motion.li>
                          );
                        })}
                      </motion.ul>
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
            <p className="text-[18px] sm:text-[20px] md:text-[21px] uppercase tracking-[0.25em] text-[#b8935a] font-bold mb-3">
              {isJa ? "制作工程" : "PROCESS"}
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-[40px] font-light text-[#111] leading-tight" style={{ fontFamily: "var(--font-noto-serif), serif" }}>
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
                  <div className="w-12 h-12 rounded-full bg-[#111] text-white flex items-center justify-center text-[15px] sm:text-base font-bold mb-5 font-roboto">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-[18px] sm:text-[20px] font-semibold text-[#111] mb-3">
                    {isJa ? step.titleJa : step.titleEn}
                  </h3>
                  {(() => {
                    const rawDesc = (isJa ? step.descJa : step.descEn) || "";
                    let items = rawDesc
                      .split(/\r?\n/)
                      .map((s) => s.trim())
                      .filter(Boolean);

                    if (items.length === 0 && rawDesc.trim()) {
                      items = [rawDesc.trim()];
                    }

                    if (items.length > 0) {
                      return (
                        <ul className="space-y-2.5">
                          {items.map((item, idx) => {
                            const cleanItem = item.replace(/^[-•・*]\s*/, "");
                            return (
                              <li key={idx} className="flex items-start gap-2.5 text-[15px] sm:text-[16px] text-black leading-relaxed [text-wrap:pretty]">
                                <span className="text-[#b8935a] font-bold text-base leading-[1.6] select-none shrink-0">•</span>
                                <span className="flex-1">{cleanItem}</span>
                              </li>
                            );
                          })}
                        </ul>
                      );
                    }

                    return null;
                  })()}
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Block (Insight warm cream-gold theme) ──────────────────────────── */}
      <section className="bg-[#fbf6ec] border-y border-[#ebd9be]">
        <div className="max-w-6xl mx-auto px-6 py-12 sm:py-14 md:py-16">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-10 sm:mb-12">
            <p className="text-[15px] sm:text-[16px] uppercase tracking-[0.25em] text-[#b8935a] font-bold mb-2.5">
              {isJa ? "料金プラン" : "SERVICE PLANS"}
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-[38px] font-light text-[#111] leading-tight" style={{ fontFamily: "var(--font-noto-serif), serif" }}>
              {isJa ? "サービスプラン" : "Service Plans"}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {data.plans.map((plan, i) => {
              const isHighlight = plan.highlighted || (!data.plans.some((p) => p.highlighted) && i === 1);
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`rounded-2xl p-8 transition-all flex flex-col justify-between relative ${isHighlight
                      ? "bg-gradient-to-b from-[#1f1b17] via-[#161412] to-[#0f0e0c] border-2 border-[#b8935a] shadow-[0_20px_50px_rgba(0,0,0,0.25)] ring-4 ring-[#b8935a]/30 scale-[1.03] md:scale-[1.06] z-10 text-white"
                      : "bg-white border border-[#ebd9be]/90 shadow-sm hover:shadow-md text-[#111]"
                    }`}
                >
                  <div>
                    {isHighlight ? (
                      <span className="inline-block bg-gradient-to-r from-[#b8935a] to-[#d8b467] text-black text-[12px] sm:text-[13px] uppercase tracking-[0.2em] font-extrabold px-4 py-1 rounded-full mb-3.5 shadow-lg">
                        {isJa ? "★ おすすめ" : "★ RECOMMENDED"}
                      </span>
                    ) : (
                      <div className="h-[29px] mb-3.5" />
                    )}
                    <h3 className={`text-[20px] sm:text-[22px] font-bold mb-4 ${isHighlight ? "text-white" : "text-[#111]"}`}>
                      {isJa
                        ? (plan.name === "Standard" ? "スタンダード" : plan.name === "High Quality" ? "ハイクオリティ" : plan.name === "Full Custom" ? "フルカスタム" : plan.name)
                        : plan.name}
                    </h3>
                    <div className={`text-3xl sm:text-[34px] font-bold mb-6 font-roboto tracking-tight ${isHighlight ? "text-[#f5d78e]" : "text-[#111]"}`}>
                      {plan.price === "ASK" ? (
                        <span className="text-xl font-semibold">{isJa ? "お問い合わせ" : "Contact Us"}</span>
                      ) : (
                        plan.price
                      )}
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((f, fi) => (
                        <li key={fi} className={`flex items-start gap-2.5 text-[15px] sm:text-[16px] leading-relaxed ${isHighlight ? "text-gray-200" : "text-gray-700"}`}>
                          <span className="text-[#b8935a] font-bold mt-0.5 select-none">✓</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    href={`/${locale}/contact`}
                    className={`block text-center py-3.5 px-6 rounded-full text-[15px] font-bold transition-all ${isHighlight
                        ? "bg-gradient-to-r from-[#b8935a] to-[#d8b467] text-black hover:brightness-110 shadow-xl shadow-[#b8935a]/30"
                        : "bg-[#111] text-white hover:bg-[#333] shadow-xs"
                      }`}
                  >
                    {plan.price === "ASK"
                      ? (isJa ? "お見積もりを依頼" : "Request Quote")
                      : (isJa ? "お問い合わせ" : "Contact Us")}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Footer CTA ────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 py-20 md:py-28 text-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h2 className="text-2xl md:text-3xl font-light text-[#111] mb-6 leading-snug" style={{ fontFamily: "var(--font-noto-serif), serif" }}>
            {isJa ? "i8 studioと共にプロジェクトを形にしましょう" : "Let's bring your project to life with i8 studio"}
          </h2>
          <p className="text-black mb-10 max-w-lg mx-auto font-normal">
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
