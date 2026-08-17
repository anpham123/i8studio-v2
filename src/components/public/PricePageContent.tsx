"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

interface DbPriceItem {
  id: string;
  nameJa: string;
  nameEn: string;
  icon: string;
  serviceSlug: string;
  price: string;
  priceLabelJa: string;
  priceLabelEn: string;
  bulletsJson: string;
  cardImage?: string;
  order: number;
}

interface PriceCard {
  slug: string;
  icon: string;
  titleJa: string;
  titleEn: string;
  features: string[];
  featuresJa: string[];
  price: string;
  priceLabelJa: string;
  priceLabelEn: string;
  cardImage?: string;
}

function buildCardsFromDb(items: DbPriceItem[]): PriceCard[] {
  return items.map((item) => {
    let bullets: string[] = [];
    try { bullets = JSON.parse(item.bulletsJson); } catch { /* ignore */ }
    return {
      slug: item.serviceSlug,
      icon: item.icon || "📦",
      titleJa: item.nameJa,
      titleEn: item.nameEn,
      features: bullets,
      featuresJa: bullets,
      price: item.price || "ASK",
      priceLabelJa: item.priceLabelJa || "参考価格",
      priceLabelEn: item.priceLabelEn || "Starting from",
      cardImage: item.cardImage || "",
    };
  });
}

interface DbServiceItem {
  slug: string;
  name: string;
  nameJa: string;
  priceHint: string;
  icon: string;
  plansJson: string;
}

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
  "bim-services": "🏢",
  "pachinko-slot-cg": "🎰",
  "anime-illustration": "✨",
};

function buildCardsFromServices(services: DbServiceItem[]): PriceCard[] {
  return services.map((svc) => {
    let plans: { name: string; features: string[]; price: string }[] = [];
    try { plans = JSON.parse(svc.plansJson || "[]"); } catch { /* ignore */ }
    return {
      slug: svc.slug,
      icon: SERVICE_ICONS[svc.slug] || svc.icon || "📦",
      titleJa: svc.nameJa || svc.name,
      titleEn: svc.name,
      features: plans[1]?.features.slice(0, 5) ?? plans[0]?.features.slice(0, 5) ?? [],
      featuresJa: plans[1]?.features.slice(0, 5) ?? plans[0]?.features.slice(0, 5) ?? [],
      price: plans[0]?.price ?? svc.priceHint ?? "ASK",
      priceLabelJa: "参考価格",
      priceLabelEn: "Starting from",
    };
  });
}

interface Props {
  dbItems?: DbPriceItem[];
  dbServices?: DbServiceItem[];
}

export default function PricePageContent({ dbItems, dbServices = [] }: Props) {
  const locale = useLocale();
  const isJa = locale === "ja";

  const cards = dbItems && dbItems.length > 0
    ? buildCardsFromDb(dbItems)
    : buildCardsFromServices(dbServices);

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="border-b border-[var(--line)]">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 pt-4 sm:pt-6 pb-4 sm:pb-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[11px] uppercase tracking-[0.3em] text-[var(--accent)] mb-4"
          >
            PRICE LIST
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-[clamp(28px,4vw,48px)] font-medium text-[var(--ink)] leading-[1.3] mb-3"
          >
            {isJa ? "料金体系" : "Pricing"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[var(--ink-light)] text-[14px] sm:text-[15px] leading-[1.9] max-w-[600px]"
          >
            {isJa
              ? "建築ビジュアライゼーションの各サービスにおける標準的な価格目安です。プロジェクトの規模、詳細度、納期に応じて最適なプランをご提案いたします。"
              : "Standard pricing for each architectural visualization service. We propose the best plan based on project scale, detail, and timeline."}
          </motion.p>
        </div>
      </section>

      {/* ── Service Grid ──────────────────────────────── */}
      <section className="max-w-[1600px] mx-auto px-6 sm:px-10 pt-6 sm:pt-8 pb-14 sm:pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {cards.map((card, i) => {
            const title = isJa ? card.titleJa : card.titleEn;
            const features = isJa ? (card.featuresJa.length > 0 ? card.featuresJa : card.features) : card.features;
            const priceLabel = isJa ? card.priceLabelJa : card.priceLabelEn;
            const isAsk = card.price === "ASK" || !card.price;

            return (
              <motion.div
                key={card.slug + "-" + i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: (i % 2) * 0.1 }}
                className="group relative rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Full background image */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1e1b14] to-[#2a2318]">
                  {card.cardImage && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={card.cardImage}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    />
                  )}
                </div>

                {/* Dark gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/75" />

                {/* All content overlaid */}
                <div className="relative z-10 flex flex-col justify-between min-h-[380px] sm:min-h-[420px] p-6 sm:p-7">
                  {/* Top: Service name */}
                  <div>
                    <h3
                      className="font-serif text-[20px] sm:text-[24px] font-medium text-white leading-tight"
                      style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}
                    >
                      {card.titleEn}
                    </h3>
                    {isJa && card.titleJa !== card.titleEn && (
                      <p
                        className="text-[12px] text-white/70 mt-1"
                        style={{ textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}
                      >
                        {card.titleJa}
                      </p>
                    )}
                  </div>

                  {/* Bottom: Features + Price + CTA */}
                  <div>
                    {/* Features */}
                    <ul className="space-y-2 mb-6">
                      {features.slice(0, 5).map((f, fi) => (
                        <li key={fi} className="flex items-start gap-2.5 text-[13px] sm:text-[14px] text-white/85 leading-[1.6]">
                          <span className="text-[var(--accent)] mt-[1px] shrink-0 text-[13px]">◎</span>
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* Price + CTA row */}
                    <div className="flex items-end justify-between pt-4 border-t border-white/15">
                      <div>
                        {isAsk ? (
                          <>
                            <span className="font-display text-[28px] sm:text-[32px] font-bold text-white tracking-tight leading-none">
                              ASK
                            </span>
                            <p className="text-[11px] text-white/50 uppercase tracking-wider mt-1">
                              {isJa ? "お見積り" : "On request"}
                            </p>
                          </>
                        ) : (
                          <>
                            <span className="font-display text-[28px] sm:text-[32px] font-bold text-white tracking-tight leading-none">
                              {card.price}
                            </span>
                            <p className="text-[11px] text-white/50 uppercase tracking-wider mt-1">
                              {priceLabel}
                            </p>
                          </>
                        )}
                      </div>

                      {card.slug ? (
                        <Link
                          href={`/${locale}/solution/${card.slug}`}
                          className="text-[var(--accent)] text-[13px] font-medium hover:underline shrink-0"
                        >
                          {isJa ? "詳細を見る" : "Details"} →
                        </Link>
                      ) : (
                        <Link
                          href={`/${locale}/contact`}
                          className="text-[var(--accent)] text-[13px] font-medium hover:underline shrink-0"
                        >
                          {isJa ? "お問い合わせ" : "Contact"} →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Custom Project CTA ────────────────────────── */}
      <section className="border-t border-[var(--line)]">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden rounded-sm my-14 sm:my-20 bg-[#111]">
            {/* Text */}
            <div className="p-10 sm:p-14 flex flex-col justify-center">
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <p className="text-[var(--accent)] text-[11px] uppercase tracking-[0.24em] mb-5">
                  ✦ CUSTOM PROJECT
                </p>
                <h2 className="font-serif text-[22px] sm:text-[30px] font-medium text-white leading-[1.4] mb-6">
                  {isJa
                    ? "個別のプロジェクトに合わせた自由なカスタマイズ。"
                    : "Flexible customization for your unique project."}
                </h2>
                <p className="text-white/50 text-[14px] leading-[1.9] mb-8">
                  {isJa
                    ? "料金はプロジェクトの規模・仕様に応じて変動します。私たちはクライアントのビジョンを最優先し、独自のニーズに応える最適なアプローチを検討いたします。まずはご相談ください。"
                    : "Pricing varies based on project scale and specifications. We prioritize your vision and find the optimal approach. Contact us for a consultation."}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/${locale}/contact`}
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--accent)] text-black text-[13px] font-semibold rounded-sm hover:bg-[#c9a36a] transition-colors"
                  >
                    {isJa ? "お見積もりを依頼する" : "Request a Quote"}
                  </Link>
                  <Link
                    href={`/${locale}/contact`}
                    className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/20 text-white text-[13px] font-medium rounded-sm hover:border-white/40 transition-colors"
                  >
                    {isJa ? "お問い合わせ" : "Contact Us"}
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Image */}
            <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1e1b14] to-[#3a3228]" />
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(184,147,90,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(184,147,90,0.08) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-8">
                  <p className="font-display text-[48px] sm:text-[64px] text-[var(--accent)]/30 font-bold leading-none mb-4">i8</p>
                  <p className="text-white/30 text-[12px] uppercase tracking-[0.3em]">STUDIO</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
