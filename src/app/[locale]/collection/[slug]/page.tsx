import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { getCollectionBySlug } from "@/lib/collection-data";
import CollectionDetailContent from "@/components/public/CollectionDetailContent";

export const dynamic = "force-dynamic";

interface DbColMeta {
  titleJa?: string | null;
  titleEn?: string | null;
  descJa?: string | null;
  descEn?: string | null;
}

interface DbColItem {
  image: string;
  captionJa?: string | null;
  captionEn?: string | null;
}

interface DbColDetail {
  slug: string;
  titleJa: string;
  titleEn: string;
  descJa: string;
  descEn: string;
  coverImage: string;
  imagesJson?: string | null;
  items?: DbColItem[];
}

interface OtherCol {
  slug: string;
  titleJa: string;
  titleEn: string;
  coverImage: string;
}

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

    let dbCol: DbColMeta | null = null;
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
      title: `${title || "Collection"} — Gallery`,
      description: desc || "Collection gallery",
      path: `/collection/${encodeURIComponent(decodedSlug)}`,
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

  let dbCol: DbColDetail | null = null;
  try {
    dbCol = (await prisma.collection.findFirst({
      where: {
        OR: [{ slug: decodedSlug }, { slug: rawSlug }],
      },
      include: {
        items: { orderBy: { order: "asc" } },
      },
    })) as unknown as DbColDetail | null;
  } catch {
    try {
      dbCol = (await prisma.collection.findFirst({
        where: {
          OR: [{ slug: decodedSlug }, { slug: rawSlug }],
        },
      })) as unknown as DbColDetail | null;
    } catch {
      dbCol = null;
    }
  }

  let allDbCols: OtherCol[] = [];
  try {
    allDbCols = (await prisma.collection.findMany({
      where: { active: true, slug: { notIn: [decodedSlug, rawSlug] } },
      orderBy: { order: "asc" },
      take: 3,
      select: {
        slug: true,
        titleJa: true,
        titleEn: true,
        coverImage: true,
      },
    })) as unknown as OtherCol[];
  } catch {
    allDbCols = [];
  }

  if (dbCol) {
    let images: { image: string; captionJa: string; captionEn: string }[] = [];
    if (dbCol.items && dbCol.items.length > 0) {
      images = dbCol.items.map((i: DbColItem) => ({
        image: i.image,
        captionJa: i.captionJa || "",
        captionEn: i.captionEn || "",
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

    const data = {
      slug: dbCol.slug,
      titleJa: dbCol.titleJa,
      titleEn: dbCol.titleEn,
      descJa: dbCol.descJa,
      descEn: dbCol.descEn,
      coverImage: dbCol.coverImage,
      images,
    };

    return <CollectionDetailContent dbCollection={data} otherCollections={allDbCols} />;
  }

  const fallbackData = getCollectionBySlug(decodedSlug) || getCollectionBySlug(rawSlug);
  if (!fallbackData) notFound();

  return <CollectionDetailContent data={fallbackData} />;
}
