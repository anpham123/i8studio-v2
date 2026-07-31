import type { Metadata } from "next";
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
  const dbItems = await prisma.priceItem.findMany({
    orderBy: { order: "asc" },
  });

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
    order: item.order,
  }));

  return <PricePageContent dbItems={items} />;
}
