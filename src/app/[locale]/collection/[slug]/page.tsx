import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { COLLECTIONS, getCollectionBySlug } from "@/lib/collection-data";
import CollectionDetailContent from "@/components/public/CollectionDetailContent";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const dbCols = await prisma.collection.findMany({
      where: { active: true },
      select: { slug: true },
    });
    const slugs = new Set([
      ...COLLECTIONS.map((c) => c.slug),
      ...dbCols.map((c) => c.slug),
    ]);
    return Array.from(slugs).map((slug) => ({ slug }));
  } catch {
    return COLLECTIONS.map((c) => ({ slug: c.slug }));
  }
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const decodedSlug = decodeURIComponent(params.slug);
  const col = await prisma.collection.findUnique({
    where: { slug: decodedSlug },
    select: { titleJa: true, titleEn: true, descJa: true, descEn: true },
  });
  const data = col || getCollectionBySlug(decodedSlug);
  if (!data) return {};
  const title = params.locale === "ja" ? data.titleJa : data.titleEn;
  const desc = params.locale === "ja" ? data.descJa : data.descEn;
  return buildMetadata({
    title: `${title || "Collection"} — Gallery`,
    description: desc || "Collection gallery",
    path: `/collection/${encodeURIComponent(decodedSlug)}`,
    locale: params.locale,
  });
}

export default async function CollectionDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const decodedSlug = decodeURIComponent(params.slug);
  const col = await prisma.collection.findUnique({
    where: { slug: decodedSlug },
    include: { items: { orderBy: { order: "asc" } } },
  });

  const allDbCols = await prisma.collection.findMany({
    where: { active: true, slug: { not: decodedSlug } },
    orderBy: { order: "asc" },
    take: 3,
    select: {
      slug: true,
      titleJa: true,
      titleEn: true,
      coverImage: true,
    },
  });

  if (col) {
    let images: { image: string; captionJa: string; captionEn: string }[] = [];
    if (col.items && col.items.length > 0) {
      images = col.items.map((i) => ({ image: i.image, captionJa: i.captionJa, captionEn: i.captionEn }));
    } else {
      try {
        const legacyImages: string[] = JSON.parse(col.imagesJson || "[]");
        images = legacyImages.map((img) => ({ image: img, captionJa: "", captionEn: "" }));
      } catch { /* ignore */ }
    }

    const data = {
      slug: col.slug,
      titleJa: col.titleJa,
      titleEn: col.titleEn,
      descJa: col.descJa,
      descEn: col.descEn,
      coverImage: col.coverImage,
      images,
    };

    return <CollectionDetailContent dbCollection={data} otherCollections={allDbCols} />;
  }

  const fallbackData = getCollectionBySlug(decodedSlug);
  if (!fallbackData) notFound();

  return <CollectionDetailContent data={fallbackData} />;
}

