import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { SOLUTIONS, getSolutionBySlug } from "@/lib/solution-data";
import SolutionDetailTemplate from "@/components/public/SolutionDetailTemplate";

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

export default function SolutionDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const data = getSolutionBySlug(params.slug);
  if (!data) notFound();

  return <SolutionDetailTemplate data={data} />;
}
