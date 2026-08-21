import type { Metadata } from "next";

// force-dynamic: locale-dependent page, cannot be ISR cached across locales
export const dynamic = "force-dynamic";
import { buildMetadata } from "@/lib/seo";
import PricePageContent from "@/components/public/PricePageContent";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildMetadata({
    title: "Price — Service Pricing",
    description:
      "View our pricing for architectural visualization, 3DCG, VR, and animation services. Flexible plans for every project scale.",
    path: "/price",
    locale: params.locale,
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

  return <PricePageContent locale={locale} dbItems={items} dbServices={dbServices} />;
}
