import type { Metadata } from "next";

// ISR: regenerate every 60 seconds
export const revalidate = 60;
import { prisma } from "@/lib/prisma";
import { buildMetadata, collectionPageJsonLd } from "@/lib/seo";
import ServicesSection from "@/components/public/ServicesSection";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const topServices = await prisma.service.findMany({
    orderBy: { order: "asc" },
    take: 4,
    select: { image: true },
  }).catch(() => []);
  const images = topServices.map((s) => s.image).filter(Boolean);

  return buildMetadata({
    title: "Services — 3DCG, Animation, VR & BIM",
    description:
      "Explore i8 STUDIO's full range of services: 3DCG visualization, Animation, VR, BIM, Pachinko, and Anime production for the Japanese market.",
    path: "/service",
    locale: params.locale,
    image: images[0] || "/og-default.jpg",
    images: images.length > 0 ? images : ["/og-default.jpg"],
  });
}

export default async function ServicePage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });

  const serviceCollectionLd = collectionPageJsonLd({
    title: "Services — 3DCG, Animation, VR & BIM | i8 STUDIO",
    description:
      "Explore i8 STUDIO's full range of services: 3DCG visualization, Animation, VR, BIM, Pachinko, and Anime production for the Japanese market.",
    url: "https://i8studio.vn/service",
    items: services.map((s) => ({
      title: locale === "ja" && s.nameJa ? s.nameJa : s.name,
      url: `https://i8studio.vn/${locale}/service/${s.slug}`,
      image: s.image || undefined,
      description: locale === "ja" && s.descriptionJa ? s.descriptionJa : s.description,
    })),
  });

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceCollectionLd) }}
      />
      <ServicesSection services={services} locale={locale} />
    </div>
  );
}
