import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  // Fetch featured works for hero masonry grid
  const works = await prisma.work.findMany({
    where: { image: { not: "" } },
    orderBy: [{ featured: "desc" }, { order: "asc" }],
    take: 12,
    select: { id: true, title: true, image: true },
  });

  const heroImages = works.map((w) => ({
    url: w.image,
    alt: w.title,
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
      <HeroEditorial images={heroImages} />
    </>
  );
}
