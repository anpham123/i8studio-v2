import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import SolutionContent from "@/components/public/SolutionContent";

// ISR: regenerate every 60 seconds
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return buildMetadata({
    title: "Solution — What We Create",
    description:
      "High-quality 3DCG, Animation, VR Walkthrough, VR 360, Photo Composite, and Digital Model services for Japanese architecture and real estate.",
    path: "/solution",
    locale: params.locale,
  });
}

export default async function SolutionPage() {
  // Fetch works grouped by type for solution gallery slides
  const works = await prisma.work.findMany({
    where: { image: { not: "" } },
    orderBy: { order: "asc" },
    select: { title: true, titleJa: true, image: true, type: true, videoUrl: true },
  });

  // Group works by type → { still: [...], animation: [...], ... }
  const worksByType: Record<string, { title: string; titleJa: string; image: string; videoUrl: string }[]> = {};
  for (const w of works) {
    const t = w.type || "still";
    if (!worksByType[t]) worksByType[t] = [];
    worksByType[t].push({ title: w.title, titleJa: w.titleJa, image: w.image, videoUrl: w.videoUrl });
  }

  return (
    <div className="min-h-screen bg-white">
      <SolutionContent worksByType={worksByType} />
    </div>
  );
}
