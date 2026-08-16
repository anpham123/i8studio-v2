import type { Metadata } from "next";

// ISR: regenerate every 60 seconds
export const revalidate = 60;
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { COLLECTIONS, getCollectionBySlug } from "@/lib/collection-data";
import CollectionDetailContent from "@/components/public/CollectionDetailContent";

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  // Try DB first, then fallback to hardcoded
  const dbCol = await prisma.collection.findUnique({
    where: { slug: params.slug },
    select: { titleJa: true, titleEn: true, descJa: true, descEn: true },
  });
  const data = dbCol || getCollectionBySlug(params.slug);
  if (!data) return {};
  const title = params.locale === "ja" ? data.titleJa : data.titleEn;
  const desc = params.locale === "ja" ? data.descJa : data.descEn;
  return buildMetadata({
    title: `${title} — Collection`,
    description: desc,
    path: `/about-us/collection/${params.slug}`,
    locale: params.locale,
  });
}

export default async function CollectionDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  // Try DB first
  const dbCol = await prisma.collection.findUnique({
    where: { slug: params.slug },
    include: {
      items: { orderBy: { order: "asc" } },
    },
  });

  if (dbCol) {
    return (
      <CollectionDetailContent
        dbCollection={{
          slug: dbCol.slug,
          titleJa: dbCol.titleJa,
          titleEn: dbCol.titleEn,
          descJa: dbCol.descJa,
          descEn: dbCol.descEn,
          coverImage: dbCol.coverImage,
          images: dbCol.items.map((item) => ({
            image: item.image,
            captionJa: item.captionJa,
            captionEn: item.captionEn,
          })),
        }}
      />
    );
  }

  // Fallback to hardcoded data
  const data = getCollectionBySlug(params.slug);
  if (!data) notFound();

  return <CollectionDetailContent data={data} />;
}
