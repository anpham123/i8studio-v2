import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import CollectionDetailContent from "@/components/public/CollectionDetailContent";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const col = await prisma.collection.findUnique({
    where: { slug: params.slug },
    select: { titleJa: true, titleEn: true, descJa: true, descEn: true },
  });
  if (!col) return {};
  const title = params.locale === "ja" ? col.titleJa : col.titleEn;
  const desc = params.locale === "ja" ? col.descJa : col.descEn;
  return buildMetadata({
    title: `${title || "Collection"} — Gallery`,
    description: desc || "Collection gallery",
    path: `/collection/${params.slug}`,
    locale: params.locale,
  });
}

export default async function CollectionDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const col = await prisma.collection.findUnique({
    where: { slug: params.slug },
    include: { items: { orderBy: { order: "asc" } } },
  });

  if (!col) notFound();

  // Merge items from CollectionItem table + legacy imagesJson
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

  return <CollectionDetailContent dbCollection={data} />;
}
