import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import WorksSection from "@/components/public/WorksSection";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildMetadata({
    title: "Works — Portfolio",
    description:
      "Browse i8 STUDIO's full portfolio: 200+ completed 3DCG, Animation, VR & BIM projects for Japanese architecture and real estate clients.",
    path: "/works",
    locale: params.locale,
  });
}

export default async function WorksPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const works = await prisma.work.findMany({ orderBy: { order: "asc" } });

  return (
    <main className="min-h-screen bg-[#0a0a0f] pt-20">
      <WorksSection works={works} locale={locale} />
    </main>
  );
}
