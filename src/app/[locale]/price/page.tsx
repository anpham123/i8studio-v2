import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import PricePageContent from "@/components/public/PricePageContent";

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

export default function PricePage() {
  return <PricePageContent />;
}
