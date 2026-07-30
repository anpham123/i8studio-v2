import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import CollectionListContent from "@/components/public/CollectionListContent";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildMetadata({
    title: "Collection — Space Visualizations",
    description: "Browse our collection of 3DCG visualizations across various space types including entrances, bedrooms, lobbies, and more.",
    path: "/collection",
    locale: params.locale,
  });
}

export default async function CollectionPage() {
  const collections = await prisma.collection.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    select: { slug: true, titleJa: true, titleEn: true, descJa: true, descEn: true, coverImage: true },
  });

  return <CollectionListContent dbCollections={collections} />;
}
