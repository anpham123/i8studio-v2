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

  // Fetch homepage media (standalone, not linked to Works) — Unlimited
  let heroImages: { url: string; alt: string; videoUrl?: string }[] = [];
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((prisma as any)?.homeMedia?.findMany) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const media = await (prisma as any).homeMedia.findMany({
        where: { active: true },
        orderBy: { order: "asc" },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      heroImages = media.map((m: any) => ({
        url: m.image,
        alt: m.title,
        videoUrl: m.videoUrl || undefined,
      }));
    }
  } catch (err) {
    console.error("Error loading home media:", err);
    heroImages = [];
  }

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

      {/* Hero with unlimited images */}
      <HeroEditorial images={heroImages} />
    </>
  );
}
