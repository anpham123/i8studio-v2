import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { COLLECTIONS, getCollectionBySlug } from "@/lib/collection-data";
import CollectionDetailContent from "@/components/public/CollectionDetailContent";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  try {
    const rawSlug = params.slug || "";
    let decodedSlug = rawSlug;
    try {
      decodedSlug = decodeURIComponent(rawSlug);
    } catch {
      decodedSlug = rawSlug;
    }

    let dbCol: any = null;
    try {
      dbCol = await prisma.collection.findFirst({
        where: {
          OR: [{ slug: decodedSlug }, { slug: rawSlug }],
        },
        select: { titleJa: true, titleEn: true, descJa: true, descEn: true },
      });
    } catch {
      dbCol = null;
    }

    const data = dbCol || getCollectionBySlug(decodedSlug) || getCollectionBySlug(rawSlug);
    if (!data) return {};
    const title = params.locale === "ja" ? data.titleJa : data.titleEn;
    const desc = params.locale === "ja" ? data.descJa : data.descEn;
    return buildMetadata({
      title: `${title || "Collection"} — Collection`,
      description: desc || "Collection gallery",
      path: `/about-us/collection/${encodeURIComponent(decodedSlug)}`,
      locale: params.locale,
    });
  } catch {
    return {};
  }
}

export default async function CollectionDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const rawSlug = params.slug || "";
  let decodedSlug = rawSlug;
  try {
    decodedSlug = decodeURIComponent(rawSlug);
  } catch {
    decodedSlug = rawSlug;
  }

  // Fetch from DB safely
  let dbCol: any = null;
  try {
    dbCol = await prisma.collection.findFirst({
      where: {
        OR: [{ slug: decodedSlug }, { slug: rawSlug }],
      },
      include: {
        items: { orderBy: { order: "asc" } },
      },
    });
  } catch {
    try {
      dbCol = await prisma.collection.findFirst({
        where: {
          OR: [{ slug: decodedSlug }, { slug: rawSlug }],
        },
      });
    } catch {
      dbCol = null;
    }
  }

  // Fetch other collections safely
  let allDbCols: any[] = [];
  try {
    allDbCols = await prisma.collection.findMany({
      where: { active: true, slug: { notIn: [decodedSlug, rawSlug] } },
      orderBy: { order: "asc" },
      take: 3,
      select: {
        slug: true,
        titleJa: true,
        titleEn: true,
        coverImage: true,
      },
    });
  } catch {
    allDbCols = [];
  }

  if (dbCol) {
    let images: { image: string; captionJa: string; captionEn: string }[] = [];
    if (dbCol.items && dbCol.items.length > 0) {
      images = dbCol.items.map((item: any) => ({
        image: item.image,
        captionJa: item.captionJa || "",
        captionEn: item.captionEn || "",
      }));
    } else {
      try {
        const legacyImages: string[] = JSON.parse(dbCol.imagesJson || "[]");
        images = legacyImages.map((img) => ({
          image: img,
          captionJa: "",
          captionEn: "",
        }));
      } catch {
        images = [];
      }
    }

    return (
      <CollectionDetailContent
        dbCollection={{
          slug: dbCol.slug,
          titleJa: dbCol.titleJa,
          titleEn: dbCol.titleEn,
          descJa: dbCol.descJa,
          descEn: dbCol.descEn,
          coverImage: dbCol.coverImage,
          images,
        }}
        otherCollections={allDbCols}
      />
    );
  }

  // Fallback to hardcoded data
  const data = getCollectionBySlug(decodedSlug) || getCollectionBySlug(rawSlug);
  if (!data) notFound();

  return <CollectionDetailContent data={data} />;
}
