import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import CollectionListContent from "@/components/public/CollectionListContent";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildMetadata({
    title: "Collection — Space Visualizations",
    description: "Browse our collection of 3DCG visualizations across various space types including entrances, bedrooms, lobbies, and more.",
    path: "/about-us/collection",
    locale: params.locale,
  });
}

export default function CollectionPage() {
  return <CollectionListContent />;
}
