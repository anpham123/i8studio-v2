import type { Metadata } from "next";

// ISR: regenerate every 60 seconds
export const revalidate = 60;
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

export default async function PricePage() {
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
    cardImage: item.cardImage ?? "",
    order: item.order,
  }));

  return <PricePageContent dbItems={items} dbServices={dbServices} />;
}
