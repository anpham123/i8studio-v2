import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

// ISR: regenerate every 60 seconds
export const revalidate = 30;

import { buildMetadata, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import HeroEditorial from "@/components/public/HeroEditorial";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
  return buildMetadata({
    title: "i8 STUDIO — 3DCG, Animation, VR & BIM",
    description:
      "High-quality 3DCG, Animation, VR & BIM outsourcing for Japanese architecture market. Trusted by 50+ Japanese companies.",
    path: "",
    locale,
  });
}

export default async function HomePage() {
  const orgJsonLd = organizationJsonLd();
  const siteJsonLd = websiteJsonLd();

  // Fetch homeWorksLimit setting
  const limitSetting = await prisma.setting.findUnique({
    where: { key: "homeWorksLimit" },
  });
  const limit = limitSetting ? (parseInt(limitSetting.value) || 11) : 11;

  // Fetch homepage media (standalone, not linked to Works)
  const media = await prisma.homeMedia.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    take: limit,
  });

  const heroImages = media.map((m) => ({
    url: m.image,
    alt: m.title,
    videoUrl: m.videoUrl || undefined,
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
      />

      {/* Hero */}
      <HeroEditorial images={heroImages} limit={limit} />
    </>
  );
}
