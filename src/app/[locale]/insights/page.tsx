import type { Metadata } from "next";

// ISR: regenerate every 60 seconds
export const revalidate = 60;
import { prisma } from "@/lib/prisma";
import { buildMetadata, collectionPageJsonLd } from "@/lib/seo";
import InsightsPage from "@/components/public/InsightsPage";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const topFlipbooks = await prisma.flipbook.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    take: 4,
    select: { coverImage: true },
  }).catch(() => []);
  const images = topFlipbooks.map((f) => f.coverImage).filter(Boolean);

  return buildMetadata({
    title: "Insights — Publications",
    description:
      "Browse i8 STUDIO's newsletters and publications about 3DCG, Animation, VR & BIM for the Japanese architecture market.",
    path: "/insights",
    locale: params.locale,
    image: images[0] || "/og-default.jpg",
    images: images.length > 0 ? images : ["/og-default.jpg"],
  });
}

export default async function InsightsRoute({ params }: { params: { locale: string } }) {
  const { locale } = params;

  const [flipbooks, settingsRows] = await Promise.all([
    prisma.flipbook.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      select: {
        id: true,
        title: true,
        titleJa: true,
        description: true,
        descriptionJa: true,
        coverImage: true,
        pdfUrl: true,
      },
    }),
    prisma.setting.findMany({
      where: { key: { in: ["insightsDescription", "insightsDescriptionJa"] } },
    }),
  ]);

  const settings: Record<string, string> = {};
  for (const s of settingsRows) settings[s.key] = s.value;

  const insightsCollectionLd = collectionPageJsonLd({
    title: "Insights — Publications | i8 STUDIO",
    description:
      "Browse i8 STUDIO's newsletters and publications about 3DCG, Animation, VR & BIM for the Japanese architecture market.",
    url: "https://i8studio.vn/insights",
    items: flipbooks.map((f) => ({
      title: locale === "ja" && f.titleJa ? f.titleJa : f.title,
      url: `https://i8studio.vn/${locale}/insights#${f.id}`,
      image: f.coverImage || undefined,
      description: locale === "ja" && f.descriptionJa ? f.descriptionJa : f.description,
    })),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(insightsCollectionLd) }}
      />
      <InsightsPage flipbooks={flipbooks} locale={locale} settings={settings} />
    </>
  );
}
