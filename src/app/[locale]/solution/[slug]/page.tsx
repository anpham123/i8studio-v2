import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { SOLUTIONS, getSolutionBySlug } from "@/lib/solution-data";
import SolutionDetailTemplate from "@/components/public/SolutionDetailTemplate";
import type { SolutionService } from "@/lib/solution-data";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return SOLUTIONS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const data = getSolutionBySlug(params.slug);
  if (!data) return {};
  const title = params.locale === "ja" ? data.titleJa : data.titleEn;
  const desc = params.locale === "ja" ? data.heroDescJa : data.heroDescEn;
  return buildMetadata({
    title: `${title} — Solution`,
    description: desc,
    path: `/solution/${params.slug}`,
    locale: params.locale,
  });
}

/** Convert DB Service row → SolutionService (merge with hardcoded fallback) */
function dbToSolution(db: Record<string, unknown>, fallback: SolutionService): SolutionService {
  const has = (k: string) => typeof db[k] === "string" && (db[k] as string).length > 0;

  // Try featuresJson first (new dynamic features), fall back to legacy feature1/feature2
  let features = fallback.features;
  try {
    const parsed = JSON.parse((db.featuresJson as string) || "[]");
    if (Array.isArray(parsed) && parsed.length > 0) {
      features = parsed;
    } else {
      // Legacy feature1/feature2
      features = [
        {
          titleJa: has("feature1TitleJa") ? db.feature1TitleJa as string : fallback.features[0]?.titleJa ?? "",
          titleEn: has("feature1TitleEn") ? db.feature1TitleEn as string : fallback.features[0]?.titleEn ?? "",
          descJa: has("feature1DescJa") ? db.feature1DescJa as string : fallback.features[0]?.descJa ?? "",
          descEn: has("feature1DescEn") ? db.feature1DescEn as string : fallback.features[0]?.descEn ?? "",
          image: has("feature1Image") ? db.feature1Image as string : fallback.features[0]?.image ?? "",
        },
        {
          titleJa: has("feature2TitleJa") ? db.feature2TitleJa as string : fallback.features[1]?.titleJa ?? "",
          titleEn: has("feature2TitleEn") ? db.feature2TitleEn as string : fallback.features[1]?.titleEn ?? "",
          descJa: has("feature2DescJa") ? db.feature2DescJa as string : fallback.features[1]?.descJa ?? "",
          descEn: has("feature2DescEn") ? db.feature2DescEn as string : fallback.features[1]?.descEn ?? "",
          image: has("feature2Image") ? db.feature2Image as string : fallback.features[1]?.image ?? "",
        },
      ];
    }
  } catch { /* use fallback */ }

  return {
    slug: fallback.slug,
    titleJa: has("nameJa") ? db.nameJa as string : fallback.titleJa,
    titleEn: has("name") ? db.name as string : fallback.titleEn,
    heroTaglineJa: has("heroTaglineJa") ? db.heroTaglineJa as string : fallback.heroTaglineJa,
    heroTaglineEn: has("heroTaglineEn") ? db.heroTaglineEn as string : fallback.heroTaglineEn,
    heroDescJa: has("heroDescJa") ? db.heroDescJa as string : fallback.heroDescJa,
    heroDescEn: has("heroDescEn") ? db.heroDescEn as string : fallback.heroDescEn,
    features,
    process: (() => {
      try {
        const parsed = JSON.parse((db.processJson as string) || "[]");
        return parsed.length > 0 ? parsed : fallback.process;
      } catch { return fallback.process; }
    })(),
    plans: (() => {
      try {
        const parsed = JSON.parse((db.plansJson as string) || "[]");
        return parsed.length > 0 ? parsed : fallback.plans;
      } catch { return fallback.plans; }
    })(),
  };
}

export default async function SolutionDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const fallback = getSolutionBySlug(params.slug);
  if (!fallback) notFound();

  // Try to read from DB, merge with hardcoded fallback
  const dbRow = await prisma.service.findUnique({ where: { slug: params.slug } });
  const data = dbRow ? dbToSolution(dbRow as unknown as Record<string, unknown>, fallback) : fallback;

  return <SolutionDetailTemplate data={data} />;
}
