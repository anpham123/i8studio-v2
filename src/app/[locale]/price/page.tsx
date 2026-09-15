import type { Metadata } from "next";

// force-dynamic: locale-dependent page, cannot be ISR cached across locales
export const dynamic = "force-dynamic";
import { buildMetadata, webPageJsonLd } from "@/lib/seo";
import PricePageContent from "@/components/public/PricePageContent";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isJa = params.locale === "ja";
  const topPriceItem = await prisma.priceItem.findFirst({
    where: { cardImage: { not: "" } },
    select: { cardImage: true },
  }).catch(() => null);

  const img = topPriceItem?.cardImage || "/og-default.jpg";

  return buildMetadata({
    title: isJa
      ? "料金案内 (Pricing) — 建築CGパース・アニメーション・VR"
      : "Price — Service Pricing | i8 STUDIO",
    description: isJa
      ? "i8 STUDIOのCGパース制作、アニメーション、VR360、BIMモデリングの参考料金プラン。高品質なオフショア体制で適正価格をご提案。"
      : "View our pricing for architectural visualization, 3DCG, VR, and animation services. Flexible plans for every project scale.",
    path: "/price",
    locale: params.locale,
    image: img,
    images: [img, "/og-default.jpg"],
  });
}

export default async function PricePage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const [dbItems, dbServices] = await Promise.all([
    prisma.priceItem.findMany({ orderBy: { order: "asc" } }),
    prisma.service.findMany({
      orderBy: { order: "asc" },
      select: { slug: true, name: true, nameJa: true, priceHint: true, icon: true, plansJson: true },
    }),
  ]);

  const items = dbItems.map((item) => ({
    id: item.id,
    nameJa: item.titleJa,
    nameEn: item.titleEn,
    icon: item.icon ?? "",
    serviceSlug: item.serviceSlug ?? "",
    price: item.priceFrom ?? "",
    priceLabelJa: item.priceLabelJa ?? "参考価格",
    priceLabelEn: item.priceLabelEn ?? "Starting from",
    bulletsJson: item.bulletsJson ?? "[]",
    bulletsEnJson: (item as any).bulletsEnJson ?? "[]",
    cardImage: item.cardImage ?? "",
    order: item.order,
  }));

  const cardImages = items.map((it) => it.cardImage).filter(Boolean);

  const pageLd = webPageJsonLd({
    title: "Price — Service Pricing | i8 STUDIO",
    description:
      "View our pricing for architectural visualization, 3DCG, VR, and animation services. Flexible plans for every project scale.",
    url: "https://i8studio.vn/price",
    images: cardImages.length > 0 ? cardImages : ["/og-default.jpg"],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageLd) }}
      />
      <PricePageContent locale={locale} dbItems={items} dbServices={dbServices} />
    </>
  );
}
