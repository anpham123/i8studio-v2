import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import FadeIn from "@/components/public/FadeIn";
import InsightsGrid from "@/components/public/InsightsGrid";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildMetadata({
    title: "Insights — Publications",
    description:
      "Download i8 STUDIO's publications, newsletters, and industry insights about 3DCG, Animation, VR & BIM for the Japanese architecture market.",
    path: "/insights",
    locale: params.locale,
  });
}

export default async function InsightsPage({ params }: { params: { locale: string } }) {
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

  return (
    <main className="min-h-screen bg-[#0a0a0f] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest text-blue-400 uppercase mb-3">
              Publications
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Insights</h1>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              Our publications and newsletters
            </p>
          </div>
        </FadeIn>

        {flipbooks.length === 0 ? (
          <p className="text-center text-white/50 py-20">No publications available yet.</p>
        ) : (
          <InsightsGrid flipbooks={flipbooks} locale={locale} />
        )}
      </div>
    </main>
  );
}
