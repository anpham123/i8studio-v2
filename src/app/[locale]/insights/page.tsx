import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import InsightsPage from "@/components/public/InsightsPage";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildMetadata({
    title: "Insights — Publications",
    description:
      "Browse i8 STUDIO's newsletters and publications about 3DCG, Animation, VR & BIM for the Japanese architecture market.",
    path: "/insights",
    locale: params.locale,
  });
}

export default async function InsightsRoute({ params }: { params: { locale: string } }) {
  const { locale } = params;

  const flipbooks = await prisma.flipbook.findMany({
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
  });

  return <InsightsPage flipbooks={flipbooks} locale={locale} />;
}
