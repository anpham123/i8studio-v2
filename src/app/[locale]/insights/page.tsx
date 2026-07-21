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

  return <InsightsPage flipbooks={flipbooks} locale={locale} settings={settings} />;
}
