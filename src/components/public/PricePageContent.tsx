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
  bulletsEnJson?: string;
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

const JAPANESE_SERVICE_TITLES: Record<string, string> = {
  "cg-perspective": "CGパース",
  "cg-video": "CG動画",
  "photo-composite": "写真合成",
  "virtual-staging": "バーチャルステージング",
  "vr360": "VR360",
  "vr-walkthrough": "VRウォークスルー",
  "digital-model": "デジタル模型",
  "ar": "AR",
  "exe-content": "EXEコンテンツ",
};

const ENGLISH_SERVICE_TITLES: Record<string, string> = {
  "cg-perspective": "CG Perspective",
  "cg-video": "CG Video",
  "photo-composite": "Photo Compositing",
  "virtual-staging": "Virtual Staging",
  "vr360": "VR360",
  "vr-walkthrough": "VR Walkthrough",
  "digital-model": "Digital Model",
  "ar": "AR",
  "exe-content": "EXE Content",
};

const ENGLISH_SERVICE_BULLETS: Record<string, string[]> = {
  "cg-perspective": ["1 Cut", "4K Rendering", "3 Revisions", "Furniture Styling"],
  "cg-video": ["60 Seconds", "4K Quality", "Background Music", "Color Grading"],
  "photo-composite": ["1 Cut", "High-precision Compositing", "3 Revisions"],
  "virtual-staging": ["1 Room", "Premium Furniture", "2 Revisions"],
  "vr360": ["6 Scenes", "Custom UI", "Background Music"],
  "vr-walkthrough": ["Multi-floor", "Custom UI", "Interactive Elements"],
  "digital-model": ["1 Building", "Section View", "Annotations"],
  "ar": ["3 Models", "Custom UI", "Animation"],
  "exe-content": ["Multiple Scenes", "Custom UI", "Data Integration"],
};

const JAPANESE_SERVICE_BULLETS: Record<string, string[]> = {
  "cg-perspective": ["1カット", "4Kレンダリング", "3回修正", "家具コーディネート"],
  "cg-video": ["60秒", "4K", "BGM付き", "カラーグレーディング"],
  "photo-composite": ["1カット", "高精度合成", "3回修正"],
  "virtual-staging": ["1部屋", "プレミアム家具", "2回修正"],
  "vr360": ["6シーン", "カスタムUI", "BGM"],
  "vr-walkthrough": ["複数フロア", "カスタムUI", "インタラクション"],
  "digital-model": ["1棟", "断面表示", "アノテーション"],
  "ar": ["3モデル", "カスタムUI", "アニメーション"],
  "exe-content": ["複数シーン", "カスタムUI", "データ連携"],
};

function getLocalizedTitle(card: PriceCard, isJa: boolean): string {
  const rawJa = (card.titleJa || "").trim();
  const rawEn = (card.titleEn || "").trim();
  const slug = (card.slug || "").toLowerCase().replace(/_/g, "-");

  if (isJa) {
    if (JAPANESE_SERVICE_TITLES[slug]) return JAPANESE_SERVICE_TITLES[slug];
    // Check if rawJa is one of known English titles stored in DB
    if (rawJa === "VR Walkthrough" || rawEn === "VR Walkthrough" || slug.includes("walkthrough")) {
      return "VRウォークスルー";
    }
    if (rawJa === "CG Perspective" || rawEn === "CG Perspective" || slug.includes("perspective")) {
      return "CGパース";
    }
    if (rawJa === "CG Video" || rawEn === "CG Video" || slug.includes("video")) {
      return "CG動画";
    }
    if (rawJa === "Photo Compositing" || rawEn === "Photo Compositing" || slug.includes("photo") || slug.includes("composite")) {
      return "写真合成";
    }
    if (rawJa === "Virtual Staging" || rawEn === "Virtual Staging" || slug.includes("staging")) {
      return "バーチャルステージング";
    }
    if (rawJa === "Digital Model" || rawEn === "Digital Model" || slug.includes("model")) {
      return "デジタル模型";
    }
    if (rawJa === "EXE Content" || rawEn === "EXE Content" || slug.includes("exe")) {
      return "EXEコンテンツ";
    }
    return rawJa || rawEn;
  } else {
    if (ENGLISH_SERVICE_TITLES[slug]) return ENGLISH_SERVICE_TITLES[slug];
    if (rawJa === "VRウォークスルー" || rawEn === "VRウォークスルー" || slug.includes("walkthrough")) {
      return "VR Walkthrough";
    }
    if (rawJa === "CGパース" || rawEn === "CGパース" || slug.includes("perspective")) {
      return "CG Perspective";
    }
    if (rawJa === "CG動画" || rawEn === "CG動画" || slug.includes("video")) {
      return "CG Video";
    }
    if (rawJa === "写真合成" || rawEn === "写真合成" || slug.includes("photo") || slug.includes("composite")) {
      return "Photo Compositing";
    }
    if (rawJa === "バーチャルステージング" || rawEn === "バーチャルステージング" || slug.includes("staging")) {
      return "Virtual Staging";
    }
    if (rawJa === "デジタル模型" || rawEn === "デジタル模型" || slug.includes("model")) {
      return "Digital Model";
    }
    if (rawJa === "EXEコンテンツ" || rawEn === "EXEコンテンツ" || slug.includes("exe")) {
      return "EXE Content";
    }
    return rawEn || rawJa;
  }
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

function buildCardsFromDb(items: DbPriceItem[]): PriceCard[] {
  return items.map((item) => {
    let bulletsJa: string[] = [];
    let bulletsEn: string[] = [];
    try { bulletsJa = JSON.parse(item.bulletsJson || "[]"); } catch { /* ignore */ }
    try { bulletsEn = JSON.parse(item.bulletsEnJson || "[]"); } catch { /* ignore */ }
    return {
      slug: item.serviceSlug,
      icon: item.icon || "📦",
      titleJa: item.nameJa,
      titleEn: item.nameEn,
      features: bulletsEn.length > 0 ? bulletsEn : (ENGLISH_SERVICE_BULLETS[item.serviceSlug] || bulletsJa),
      featuresJa: bulletsJa.length > 0 ? bulletsJa : (JAPANESE_SERVICE_BULLETS[item.serviceSlug] || []),
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
      features: ENGLISH_SERVICE_BULLETS[svc.slug] ?? plans[1]?.features.slice(0, 5) ?? plans[0]?.features.slice(0, 5) ?? [],
      featuresJa: JAPANESE_SERVICE_BULLETS[svc.slug] ?? plans[1]?.features.slice(0, 5) ?? plans[0]?.features.slice(0, 5) ?? [],
      price: plans[0]?.price ?? svc.priceHint ?? "ASK",
      priceLabelJa: "参考価格",
      priceLabelEn: "Starting from",
    };
  });
}

interface Props {
  locale?: string;
  dbItems?: DbPriceItem[];
  dbServices?: DbServiceItem[];
}

export default function PricePageContent({ locale: localeProp, dbItems, dbServices = [] }: Props) {
  // Prefer prop passed from server (avoids ISR cache locale mismatch on deploy)
  // Fall back to useLocale() for cases where component is used without prop
  const localeFromHook = useLocale();
  const locale = localeProp || localeFromHook;
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
            {isJa ? "料金体系" : "Service Pricing"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[var(--ink-light)] text-[14px] sm:text-[15px] leading-[1.9] max-w-[600px]"
          >
            {isJa
              ? "建築ビジュアライゼーションの各サービスにおける標準的な価格目安です。プロジェクトの規模、詳細度、納期に応じて最適なプランをご提案いたします。"
              : "Standard pricing guidelines for our architectural visualization services. We propose optimal plans based on project scale, level of detail, and schedule."}
          </motion.p>
        </div>
      </section>

      {/* ── Service Grid ──────────────────────────────── */}
      <section className="max-w-[1600px] mx-auto px-6 sm:px-10 pt-6 sm:pt-8 pb-14 sm:pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {cards.map((card, i) => {
            const title = getLocalizedTitle(card, isJa);
            const features = isJa
              ? ((card.featuresJa && card.featuresJa.length > 0) ? card.featuresJa : (JAPANESE_SERVICE_BULLETS[card.slug] || card.features))
              : ((card.features && card.features.length > 0) ? card.features : (ENGLISH_SERVICE_BULLETS[card.slug] || card.featuresJa));
            const priceLabel = isJa ? (card.priceLabelJa || "参考価格") : (card.priceLabelEn || "Starting from");
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
                      className="font-serif text-[26px] sm:text-[30px] font-medium text-white leading-tight tracking-wide"
                      style={{ textShadow: "0 2px 14px rgba(0,0,0,0.7)" }}
                    >
                      {title}
                    </h3>
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
                              {isJa ? "お見積り" : "Get a quote"}
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
                          {isJa ? "詳細を見る →" : "View details →"}
                        </Link>
                      ) : (
                        <Link
                          href={`/${locale}/contact`}
                          className="text-[var(--accent)] text-[13px] font-medium hover:underline shrink-0"
                        >
                          {isJa ? "お問い合わせ →" : "Contact us →"}
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
    </div>
  );
}
