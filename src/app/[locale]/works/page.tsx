import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import WorksContent from "@/components/public/WorksContent";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildMetadata({
    title: "Works — Portfolio",
    description:
      "Browse our portfolio of architectural visualization, 3DCG, VR, and animation projects for the Japanese market.",
    path: "/works",
    locale: params.locale,
  });
}

export default async function WorksPage() {
  const works = await prisma.work.findMany({ orderBy: { order: "asc" } });

  // Clean serialization for client components
  const serializedWorks = works.map((w) => ({
    id: w.id,
    title: w.title,
    titleJa: w.titleJa,
    subtitle: w.subtitle,
    category: w.category,
    type: w.type,
    buildingCategory: w.buildingCategory,
    image: w.image,
    videoUrl: w.videoUrl,
    order: w.order,
    featured: w.featured,
  }));

  return <WorksContent initialWorks={serializedWorks} />;
}
