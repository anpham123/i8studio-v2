"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";

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
  "bim-services": "🏢",
  "pachinko-slot-cg": "🎰",
  "anime-illustration": "✨",
};

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

function buildCardsFromServices(services: DbServiceItem[]): PriceCard[] {
  return services.map((svc) => {
    let plans: { name: string; features: string[]; price: string }[] = [];
    try { plans = JSON.parse(svc.plansJson || "[]"); } catch { /* ignore */ }
    return {
      slug: svc.slug,
      icon: SERVICE_ICONS[svc.slug] || svc.icon || "📦",
      titleJa: svc.nameJa || svc.name,
      titleEn: svc.name,
      features: plans[1]?.features.slice(0, 3) ?? plans[0]?.features.slice(0, 3) ?? [],
      featuresJa: plans[1]?.features.slice(0, 3) ?? plans[0]?.features.slice(0, 3) ?? [],
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

  // If DB has price items, use them. Otherwise fall back to services from DB.
  const cards = dbItems && dbItems.length > 0
    ? buildCardsFromDb(dbItems)
    : buildCardsFromServices(dbServices);

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
          {cards.map((card, i) => {
            const title = isJa ? card.titleJa : card.titleEn;
            const features = isJa ? (card.featuresJa.length > 0 ? card.featuresJa : card.features) : card.features;
            const priceLabel = isJa ? card.priceLabelJa : card.priceLabelEn;
            return (
              <motion.div
                key={card.slug + "-" + i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.08 }}
                className="group border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                {/* Card Image */}
                {card.cardImage && (
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={card.cardImage} alt={title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{card.icon}</span>
                        <h3 className="text-white text-lg font-medium">{title}</h3>
                      </div>
                      <div className="text-white/80 text-sm">
                        <span className="text-white/50 text-xs uppercase tracking-wider">{priceLabel} </span>
                        {card.price === "ASK" ? (isJa ? "お問い合わせ" : "Contact Us") : card.price}
                      </div>
                    </div>
                  </div>
                )}
                <div className="p-7">
                  {/* Icon + Title (shown when no image) */}
                  {!card.cardImage && (
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{card.icon}</span>
                      <h3 className="text-lg font-medium text-[#111]">{title}</h3>
                    </div>
                  )}

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {features.slice(0, 4).map((f, fi) => (
                      <li key={fi} className="flex items-start gap-2 text-sm text-gray-500">
                        <span className="text-[#b8935a] mt-0.5 shrink-0">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* Price (shown when no image) */}
                  {!card.cardImage && (
                    <div className="mb-6">
                      <span className="text-xs uppercase tracking-wider text-gray-400">{priceLabel}</span>
                      <div className="text-2xl font-light text-[#111] mt-1" style={{ fontFamily: "var(--font-display), serif" }}>
                        {card.price === "ASK" ? (isJa ? "お問い合わせ" : "Contact Us") : card.price}
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  {card.slug ? (
                    <Link
                      href={`/${locale}/solution/${card.slug}`}
                      className="block text-center text-sm font-semibold py-2.5 rounded-full border border-[#111] text-[#111] hover:bg-[#111] hover:text-white transition-colors"
                    >
                      {isJa ? "詳細を見る" : "View Details"}
                    </Link>
                  ) : (
                    <Link
                      href={`/${locale}/contact`}
                      className="block text-center text-sm font-semibold py-2.5 rounded-full border border-[#111] text-[#111] hover:bg-[#111] hover:text-white transition-colors"
                    >
                      {isJa ? "お問い合わせ" : "Contact Us"}
                    </Link>
                  )}
                </div>
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
