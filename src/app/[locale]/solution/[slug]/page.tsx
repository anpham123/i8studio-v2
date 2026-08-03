import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { dbServiceToSolution } from "@/lib/solution-data";
import SolutionDetailTemplate from "@/components/public/SolutionDetailTemplate";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const services = await prisma.service.findMany({
    select: { slug: true },
  });
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const dbRow = await prisma.service.findUnique({ where: { slug: params.slug } });
  if (!dbRow) return {};
  const title = params.locale === "ja" ? dbRow.nameJa : dbRow.name;
  const desc = params.locale === "ja" ? dbRow.heroDescJa : dbRow.heroDescEn;
  return buildMetadata({
    title: `${title || dbRow.name} — Solution`,
    description: desc || dbRow.description,
    path: `/solution/${params.slug}`,
    locale: params.locale,
  });
}

export default async function SolutionDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const dbRow = await prisma.service.findUnique({ where: { slug: params.slug } });
  if (!dbRow) notFound();

  const data = dbServiceToSolution(dbRow as unknown as Record<string, unknown>);

  return <SolutionDetailTemplate data={data} />;
}
