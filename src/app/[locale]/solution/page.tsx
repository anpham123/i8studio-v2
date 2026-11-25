import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { getServiceName } from "@/lib/solution-data";
import CategoryDirectoryGrid from "@/components/public/CategoryDirectoryGrid";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isJa = params.locale === "ja";
  const topWorks = await prisma.work
    .findMany({
      where: { image: { not: "" } },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      take: 5,
      select: { image: true },
    })
    .catch(() => []);
  const topImages = topWorks.map((w) => w.image).filter(Boolean);

  return buildMetadata({
    title: isJa
      ? "ソリューション (Solution) — 建築CG・VR・動画制作"
      : "Solution — What We Create | 3DCG, VR & Animation",
    description: isJa
      ? "高品質な建築CGパース、ウォークスルー動画、VR360、写真合成、デジタル模型など、日本の建築・不動産向けビジュアライゼーション。"
      : "High-quality 3DCG, Animation, VR Walkthrough, VR 360, Photo Composite, and Digital Model services for Japanese architecture and real estate.",
    path: "/solution",
    locale: params.locale,
    image: topImages[0] || "/og-default.jpg",
    images: topImages.length > 0 ? topImages : ["/og-default.jpg"],
  });
}

export default async function SolutionPage({
  params,
}: {
  params: { locale: string };
}) {
  const isJa = params.locale === "ja";

  const [services, settings] = await Promise.all([
    prisma.service.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
    }),
    prisma.setting.findMany(),
  ]);

  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  const DEFAULT_HIDDEN_SLUGS = new Set([
    "pachinko-slot-cg",
    "anime-illustration",
    "bim-services",
  ]);

  const visibleServices = services.filter((s) => {
    const toggleKey = `serviceVisible_${s.slug}`;
    if (toggleKey in settingsMap) {
      return settingsMap[toggleKey] === "true";
    }
    if (DEFAULT_HIDDEN_SLUGS.has(s.slug)) {
      return false;
    }
    return s.isPublished !== false;
  });

  const items = visibleServices.map((svc) => ({
    label: getServiceName(svc, isJa),
    href: `/${params.locale}/solution/${svc.slug}`,
    thumbnail: svc.image || undefined,
  }));

  return (
    <div className="min-h-[calc(100vh-var(--header-h,76px))] bg-white">
      <CategoryDirectoryGrid
        title={isJa ? "ソリューション" : "SERVICE"}
        items={items}
        gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      />
    </div>
  );
}
