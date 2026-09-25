import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

// ISR: regenerate every 60 seconds
export const revalidate = 30;

import { buildMetadata, organizationJsonLd, websiteJsonLd, webPageJsonLd } from "@/lib/seo";
import HeroEditorial from "@/components/public/HeroEditorial";
import ScrollSequenceHero from "@/components/public/ScrollSequenceHero";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
  const isJa = locale === "ja";

  const topWorks = await prisma.work.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    take: 5,
    select: { image: true },
  }).catch(() => []);
  const topImages = topWorks.map((w) => w.image).filter(Boolean);

  return buildMetadata({
    title: isJa
      ? "i8 STUDIO — 建築CGパース・3Dアニメーション・VR・BIM制作"
      : "i8 STUDIO — 3DCG, Animation, VR & BIM",
    description: isJa
      ? "日本の建築・不動産市場向け高品質3DCGパース、建築アニメーション、VR・BIM制作。日本のクライアント50社以上との実績。"
      : "High-quality 3DCG, Animation, VR & BIM outsourcing for Japanese architecture market. Trusted by 50+ Japanese companies.",
    path: "",
    locale,
    image: topImages[0] || "/og-default.jpg",
    images: topImages.length > 0 ? topImages : ["/og-default.jpg"],
  });
}

export default async function HomePage() {
  const orgJsonLd = organizationJsonLd();
  const siteJsonLd = websiteJsonLd();

  // Fetch settings for dynamic hero texts & homepage media
  let heroTexts: Record<string, string> = {};
  let heroImages: { url: string; alt: string; videoUrl?: string }[] = [];
  try {
    const [settings, media] = await Promise.all([
      prisma.setting.findMany(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (prisma as any)?.homeMedia?.findMany
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (prisma as any).homeMedia.findMany({
            where: { active: true },
            orderBy: { order: "asc" },
          })
        : [],
    ]);

    heroTexts = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    heroImages = (media || []).map((m: any) => ({
      url: m.image,
      alt: m.title,
      videoUrl: m.videoUrl || undefined,
    }));
  } catch (err) {
    console.error("Error loading home data:", err);
  }

  const pageJsonLd = webPageJsonLd({
    title: "i8 STUDIO — 3DCG, Animation, VR & BIM",
    description:
      "High-quality 3DCG, Animation, VR & BIM outsourcing for Japanese architecture market. Trusted by 50+ Japanese companies.",
    url: "https://i8studio.vn",
    images: heroImages.map((img) => img.url).filter(Boolean),
  });

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />

      {/* 1. Scroll-driven 3D Walkthrough Hero */}
      {heroTexts.heroVideoHidden !== "true" && (
        <ScrollSequenceHero
          fallbackVideo="/uploads/anhherrosection/1.mp4"
          totalFrames={242}
          heroTexts={heroTexts}
        />
      )}

      {/* 2. Masonry Editorial Gallery below */}
      <HeroEditorial images={heroImages} />
    </>
  );
}
