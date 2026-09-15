import type { Metadata } from "next";

// ISR: regenerate every 60 seconds
export const revalidate = 60;
import { prisma } from "@/lib/prisma";
import { buildMetadata, collectionPageJsonLd } from "@/lib/seo";
import { getImageAspectRatio } from "@/lib/image-meta";
import WorksContent from "@/components/public/WorksContent";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isJa = params.locale === "ja";
  const topWorks = await prisma.work.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    take: 4,
    select: { image: true },
  }).catch(() => []);

  const topImages = topWorks.map((w) => w.image).filter(Boolean);

  return buildMetadata({
    title: isJa
      ? "制作実績 (Works) — 建築CGパース・アニメーション・VR"
      : "Works — Portfolio | 3DCG & Architectural Visualization",
    description: isJa
      ? "i8 STUDIOの建築CGパース、3Dアニメーション、VR360、BIM制作実績一覧。日本の住宅・商業施設・リゾートなどの高品質CGビジュアライゼーション。"
      : "Browse our portfolio of architectural visualization, 3DCG, VR, and animation projects for the Japanese market.",
    path: "/works",
    locale: params.locale,
    image: topImages[0] || "/og-default.jpg",
    images: topImages.length > 0 ? topImages : ["/og-default.jpg"],
  });
}

export default async function WorksPage() {
  const works = await prisma.work.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
  const settings = await prisma.setting.findMany();

  // Fetch active collections for sidebar navigation
  let collections: { slug: string; titleJa: string; titleEn: string }[] = [];
  try {
    collections = await prisma.collection.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      select: { slug: true, titleJa: true, titleEn: true },
    });
  } catch {
    collections = [];
  }

  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  // Clean serialization with server-computed aspect ratios for instant zero-CLS rendering
  const serializedWorks = await Promise.all(
    works.map(async (w) => {
      const aspectRatio = await getImageAspectRatio(w.image);
      const beforeAspectRatio = w.beforeImage ? await getImageAspectRatio(w.beforeImage) : undefined;
      return {
        id: w.id,
        title: w.title,
        titleJa: w.titleJa,
        subtitle: w.subtitle,
        category: w.category,
        type: w.type,
        buildingCategory: w.buildingCategory,
        image: w.image,
        beforeImage: w.beforeImage,
        aspectRatio: aspectRatio || beforeAspectRatio,
        videoUrl: w.videoUrl,
        vrUrl: w.vrUrl,
        order: w.order,
        featured: w.featured,
      };
    })
  );

  // Preload top 9 images for instant rendering without layout shift
  const topImageUrls = serializedWorks
    .slice(0, 9)
    .map((w) => w.image)
    .filter(Boolean) as string[];

  const collectionJsonLdData = collectionPageJsonLd({
    title: "Works — Portfolio | i8 STUDIO",
    description:
      "Browse our portfolio of architectural visualization, 3DCG, VR, and animation projects for the Japanese market.",
    url: "https://i8studio.vn/works",
    items: serializedWorks.map((w) => ({
      title: w.title || "Architectural 3DCG Work",
      url: `https://i8studio.vn/works#${w.id}`,
      image: w.image,
      description: w.subtitle || w.category,
    })),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLdData) }}
      />
      {topImageUrls.map((url, i) => (
        <link key={i} rel="preload" as="image" href={url} fetchPriority="high" />
      ))}
      <WorksContent
        initialWorks={serializedWorks}
        settings={settingsMap}
        collections={collections}
      />
    </>
  );
}
