import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import ServicesSection from "@/components/public/ServicesSection";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildMetadata({
    title: "Services — 3DCG, Animation, VR & BIM",
    description:
      "Explore i8 STUDIO's full range of services: 3DCG visualization, Animation, VR, BIM, Pachinko, and Anime production for the Japanese market.",
    path: "/service",
    locale: params.locale,
  });
}

export default async function ServicePage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });

  return (
    <main className="min-h-screen bg-[#0a0a0f] pt-20">
      <ServicesSection services={services} locale={locale} />
    </main>
  );
}
