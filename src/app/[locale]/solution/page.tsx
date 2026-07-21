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
  const [works, settingsRows] = await Promise.all([
    prisma.work.findMany({
      where: { image: { not: "" } },
      orderBy: { order: "asc" },
      select: { title: true, titleJa: true, image: true, beforeImage: true, type: true, videoUrl: true, vrUrl: true },
    }),
    prisma.setting.findMany({
      where: {
        key: {
          in: [
            "solutionS1Desc", "solutionS1DescJa",
            "solutionS2Desc", "solutionS2DescJa",
            "solutionS3Desc", "solutionS3DescJa",
            "solutionS4Desc", "solutionS4DescJa",
            "solutionS5Desc", "solutionS5DescJa",
            "solutionS6Desc", "solutionS6DescJa",
          ],
        },
      },
    }),
  ]);

  // Group works by type → { still: [...], animation: [...], ... }
  const worksByType: Record<string, { title: string; titleJa: string; image: string; beforeImage: string; videoUrl: string; vrUrl?: string }[]> = {};
  for (const w of works) {
    const t = w.type || "still";
    if (!worksByType[t]) worksByType[t] = [];
    worksByType[t].push({ title: w.title, titleJa: w.titleJa, image: w.image, beforeImage: w.beforeImage, videoUrl: w.videoUrl, vrUrl: w.vrUrl || undefined });
  }

  const settings: Record<string, string> = {};
  for (const s of settingsRows) settings[s.key] = s.value;

  return (
    <div className="min-h-screen bg-white">
      <SolutionContent worksByType={worksByType} settings={settings} />
    </div>
  );
}
